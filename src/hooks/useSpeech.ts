import { useCallback, useEffect, useRef, useState } from 'react'
import type { WordToken } from '../types/story'
import {
  buildFallbackSchedule,
  buildSentenceText,
  estimateWordMs,
  initialKaraoke,
  karaokeOnBoundary,
  karaokeOnTimer,
  pickEnglishVoice,
  tokenIndexAtChar,
  wordSpeechText,
} from '../utils/speechLogic'

export type VoiceStatus = 'loading' | 'ready' | 'missing'

const SENTENCE_RATE = 0.8
const SLOW_RATE = 0.55
const SLOW_PAUSE_MS = 400
/** Chrome sometimes drops speak() issued right after cancel(). */
const AFTER_CANCEL_MS = 70
/** How long to wait for `voiceschanged` before concluding there is no voice. */
const VOICE_WAIT_MS = 2000

function getSynth(): SpeechSynthesis | null {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined'
    ? window.speechSynthesis
    : null
}

export function useSpeech() {
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>(() => (getSynth() ? 'loading' : 'missing'))
  /** Index of the block highlighted by karaoke, -1 when nothing is spoken. */
  const [activeIndex, setActiveIndex] = useState(-1)
  const [speaking, setSpeaking] = useState(false)

  const voiceRef = useRef<SpeechSynthesisVoice | null>(null)
  const runRef = useRef(0) // run token: stale callbacks compare against it
  const timersRef = useRef<number[]>([])
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null) // keeps the utterance alive for onend

  useEffect(() => {
    const synth = getSynth()
    if (!synth) return // no speechSynthesis (e.g. WebView): status is already 'missing'
    let waitTimer = 0
    const refresh = () => {
      const voice = pickEnglishVoice(synth.getVoices())
      voiceRef.current = voice
      if (voice) {
        window.clearTimeout(waitTimer)
        setVoiceStatus('ready')
      }
    }
    refresh()
    synth.addEventListener('voiceschanged', refresh)
    waitTimer = window.setTimeout(() => {
      if (!voiceRef.current) setVoiceStatus('missing')
    }, VOICE_WAIT_MS)
    return () => {
      window.clearTimeout(waitTimer)
      synth.removeEventListener('voiceschanged', refresh)
    }
  }, [])

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id))
    timersRef.current = []
  }, [])

  const later = useCallback((fn: () => void, ms: number) => {
    timersRef.current.push(window.setTimeout(fn, ms))
  }, [])

  const stop = useCallback(() => {
    runRef.current += 1
    clearTimers()
    utteranceRef.current = null
    getSynth()?.cancel()
    setActiveIndex(-1)
    setSpeaking(false)
  }, [clearTimers])

  // Leaving the reader always silences the speech.
  useEffect(() => stop, [stop])

  /** Cancels what is playing, then runs `start` with a fresh run token. Silent without an English voice. */
  const begin = useCallback(
    (start: (run: number, synth: SpeechSynthesis, voice: SpeechSynthesisVoice) => void) => {
      const synth = getSynth()
      stop()
      const voice = voiceRef.current
      if (!synth || !voice) return
      const run = runRef.current
      setSpeaking(true)
      later(() => {
        if (runRef.current === run) start(run, synth, voice)
      }, AFTER_CANCEL_MS)
    },
    [stop, later],
  )

  const makeUtterance = (text: string, rate: number, voice: SpeechSynthesisVoice) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.voice = voice
    utterance.lang = voice.lang
    utterance.rate = rate
    utteranceRef.current = utterance
    return utterance
  }

  /** Any short English text (a hero's line, a flashcard word). */
  const speakText = useCallback(
    (text: string, rate = 0.9) => {
      begin((run, synth, voice) => {
        const utterance = makeUtterance(text, rate, voice)
        const finish = () => {
          if (runRef.current === run) setSpeaking(false)
        }
        utterance.onend = finish
        utterance.onerror = finish
        synth.speak(utterance)
      })
    },
    [begin],
  )

  const speakWord = useCallback((token: WordToken) => speakText(wordSpeechText(token), 0.85), [speakText])

  /** "Posłuchaj": the whole sentence at 0.8x with hybrid karaoke (onboundary + fallback timer). */
  const speakSentence = useCallback(
    (tokens: readonly WordToken[]) => {
      begin((run, synth, voice) => {
        const { text, ranges } = buildSentenceText(tokens)
        const { offsets, totalMs } = buildFallbackSchedule(tokens, SENTENCE_RATE)
        const utterance = makeUtterance(text, SENTENCE_RATE, voice)
        let karaoke = initialKaraoke
        const show = (next: typeof karaoke) => {
          karaoke = next
          setActiveIndex(next.active)
        }
        const done = () => {
          if (runRef.current !== run) return
          clearTimers()
          setActiveIndex(-1)
          setSpeaking(false)
        }
        utterance.onstart = () => {
          if (runRef.current !== run) return
          show(karaokeOnTimer(karaoke, 0))
          offsets.forEach((offset, i) => {
            if (i === 0) return
            later(() => {
              if (runRef.current === run) show(karaokeOnTimer(karaoke, i))
            }, offset)
          })
          // If neither onend nor boundaries arrive, do not leave a block lit forever.
          later(() => {
            if (runRef.current === run && !karaoke.boundarySeen) done()
          }, totalMs + 1200)
        }
        utterance.onboundary = (event) => {
          if (runRef.current !== run || (event.name && event.name !== 'word')) return
          if (!karaoke.boundarySeen) clearTimers() // real events take over, the timer steps aside
          const index = tokenIndexAtChar(ranges, event.charIndex)
          if (index >= 0) show(karaokeOnBoundary(index))
        }
        utterance.onend = done
        utterance.onerror = done
        synth.speak(utterance)
      })
    },
    [begin, clearTimers, later],
  )

  /** "Żółwik": word by word, very slowly, 400 ms pause between words. */
  const speakSlow = useCallback(
    (tokens: readonly WordToken[]) => {
      begin((run, synth, voice) => {
        const step = (i: number) => {
          if (runRef.current !== run) return
          if (i >= tokens.length) {
            setActiveIndex(-1)
            setSpeaking(false)
            return
          }
          setActiveIndex(i)
          const utterance = makeUtterance(wordSpeechText(tokens[i]), SLOW_RATE, voice)
          let advanced = false
          const next = () => {
            if (advanced || runRef.current !== run) return
            advanced = true
            later(() => step(i + 1), SLOW_PAUSE_MS)
          }
          utterance.onend = next
          utterance.onerror = next
          // onend can get lost on some engines: never hang the loop.
          later(next, estimateWordMs(tokens[i], SLOW_RATE) + 1500)
          synth.speak(utterance)
        }
        step(0)
      })
    },
    [begin, later],
  )

  return { voiceStatus, activeIndex, speaking, speakText, speakWord, speakSentence, speakSlow, stop }
}

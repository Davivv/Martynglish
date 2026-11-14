import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import type { SceneVisualConfig } from '../../types/story'
import { BACKGROUND_DRAWINGS } from './backgrounds'
import { BOY_HEROES, CHARACTER_DRAWINGS, GIRL_HEROES, heroShadowRx } from './characters'
import { Cat } from './characters/Cat'
import { layoutProps } from './layout'
import type { StageMode } from './layout'
import { PROP_DRAWINGS } from './props'
import type { PlacedProp } from './layout'
import './stage.css'

export interface InteractiveStoryStageProps {
  visualConfig: SceneVisualConfig
  /** Local illustration from the repo. When set, it replaces the vector scene, the tap stays. */
  imageUrl?: string
  altText: string
  /** Speech bubble text. Without it, a tap shows no bubble. */
  interactiveSoundText?: string
  /** Without it the stage is a static picture (library covers, flashcards). */
  onCharacterTap?: (text: string) => void
  className?: string
}

const VIEW_W = 400
const VIEW_H = 240
const BUBBLE_MS = 2600

/** Picks the layout mode from the proportions of the parent. */
function modeFor(width: number, height: number): StageMode {
  if (width <= 0 || height <= 0) return 'roomy'
  const aspect = width / height
  if (aspect >= 2.2) return 'strip'
  return aspect >= 1.3 ? 'roomy' : 'square'
}

/** `/images/...` from the story data becomes a path below the app base (D8). */
function resolveImageUrl(imageUrl: string): string {
  if (/^(https?:|data:|blob:)/.test(imageUrl)) return imageUrl
  return `${import.meta.env.BASE_URL}${imageUrl.replace(/^\/+/, '')}`
}

function PropItem({ item }: { item: PlacedProp }) {
  const Drawing = PROP_DRAWINGS[item.object]
  return (
    <g transform={`translate(${item.x.toFixed(1)} ${item.y.toFixed(1)}) scale(${((item.stretch ?? 1) * item.scale).toFixed(3)} ${item.scale.toFixed(3)})`}>
      <Drawing variant={item.variant} />
    </g>
  )
}

/**
 * Layered vector scene: background, objects, hero. It fills its parent and is cropped with
 * "slice", so hero and objects stay in the middle band of the 400 x 240 canvas.
 * The scene never plays sounds; a tap on the hero is reported through `onCharacterTap`.
 */
export function InteractiveStoryStage({
  visualConfig,
  imageUrl,
  altText,
  interactiveSoundText,
  onCharacterTap,
  className,
}: InteractiveStoryStageProps) {
  const interactive = onCharacterTap !== undefined
  const { backgroundTheme, primaryCharacter, primaryColor, secondaryColor, props, characterMood } = visualConfig

  const [hopKey, setHopKey] = useState(0)
  const [bubbleKey, setBubbleKey] = useState(0)
  const [bubbleVisible, setBubbleVisible] = useState(false)
  const [failedImage, setFailedImage] = useState<string | undefined>(undefined)
  const [mode, setMode] = useState<StageMode>('roomy')
  const rootRef = useRef<HTMLDivElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    const measure = () => setMode(modeFor(root.clientWidth, root.clientHeight))
    measure()
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(measure)
    observer.observe(root)
    return () => observer.disconnect()
  }, [])

  const handleTap = useCallback(() => {
    if (!onCharacterTap) return
    setHopKey((k) => k + 1)
    if (interactiveSoundText) {
      setBubbleKey((k) => k + 1)
      setBubbleVisible(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setBubbleVisible(false), BUBBLE_MS)
    }
    onCharacterTap(interactiveSoundText ?? '')
  }, [onCharacterTap, interactiveSoundText])

  const handleKey = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleTap()
    }
  }

  const slimHero = primaryCharacter in GIRL_HEROES || primaryCharacter in BOY_HEROES
  const layout = useMemo(
    () => layoutProps(props, mode, backgroundTheme, slimHero),
    [props, mode, backgroundTheme, slimHero],
  )
  const { hero } = layout
  const Background = BACKGROUND_DRAWINGS[backgroundTheme] ?? BACKGROUND_DRAWINGS.meadow
  const Hero = CHARACTER_DRAWINGS[primaryCharacter] ?? Cat
  const heroTransform = `translate(${hero.x.toFixed(1)} ${hero.y.toFixed(1)}) scale(${hero.scale})`
  const showImage = imageUrl !== undefined && imageUrl !== failedImage

  if (showImage) {
    // A finished illustration is a plain <img> that covers the parent; the SVG would crop it to 400 x 240 (D40).
    return (
      <div
        ref={rootRef}
        role="img"
        aria-label={altText}
        className={`stage-root h-full w-full ${interactive ? 'stage-live' : ''} ${className ?? ''}`}
      >
        <img
          src={resolveImageUrl(imageUrl)}
          alt=""
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setFailedImage(imageUrl)}
        />
        {interactive && (
          <button
            type="button"
            aria-label={interactiveSoundText ?? altText}
            onClick={handleTap}
            className="stage-img-hit absolute inset-0 h-full w-full cursor-pointer bg-transparent"
          />
        )}
        {interactive && bubbleVisible && interactiveSoundText && (
          <div key={bubbleKey} className="stage-bubble" aria-hidden="true">
            {interactiveSoundText}
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      ref={rootRef}
      role="img"
      aria-label={altText}
      className={`stage-root h-full w-full ${interactive ? 'stage-live' : ''} ${className ?? ''}`}
    >
      <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <Background />
        {layout.props
          .filter((item) => item.behind)
          .map((item) => (
            <PropItem key={item.key} item={item} />
          ))}
        <g transform={heroTransform}>
          <ellipse cx={50} cy={99} rx={heroShadowRx(primaryCharacter)} ry={6} fill="#1a3a22" opacity={0.18} />
          <g key={hopKey} className={hopKey > 0 ? 'stage-hop' : undefined}>
            <g className={characterMood === 'excited' ? 'stage-excited' : undefined}>
              <g className="stage-hero-idle">
                <Hero primary={primaryColor} secondary={secondaryColor} mood={characterMood} />
              </g>
            </g>
          </g>
        </g>
        {layout.props
          .filter((item) => !item.behind)
          .map((item) => (
            <PropItem key={item.key} item={item} />
          ))}
        {interactive && (
          <g
            className="stage-hit"
            role="button"
            tabIndex={0}
            aria-label={interactiveSoundText ?? altText}
            onClick={handleTap}
            onKeyDown={handleKey}
          >
            <rect
              className="stage-focus-ring"
              x={hero.x - 4 * hero.scale}
              y={hero.y - 2 * hero.scale}
              width={112 * hero.scale}
              height={104 * hero.scale}
              rx={16}
              fill="transparent"
              stroke="transparent"
            />
          </g>
        )}
      </svg>
      {interactive && bubbleVisible && interactiveSoundText && (
        <div key={bubbleKey} className="stage-bubble" aria-hidden="true">
          {interactiveSoundText}
        </div>
      )}
    </div>
  )
}

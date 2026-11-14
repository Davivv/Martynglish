import type { CharacterMood } from '../../../types/story'
import { darken, lighten, useGid } from '../colors'
import type { CharacterProps } from '../types'
import type { BoyLook, BoyLookKey } from './boyLooks'
import { BOY_LOOKS } from './boyLooks'

/**
 * One figure for all three boys (D44, Friends): a cheerful 10-12 year old creator-studio kid,
 * drawn in the same 100 x 100 box as `Girl.tsx` (feet at y 99, head on top) so the two rigs share
 * the stage layout and ground shadow math. The look table (`boyLooks.ts`) picks hair, skin and
 * outfit; the story colours replace the two main outfit colours. Hair is short on every variant,
 * so unlike the girls there is no separate back layer: one `Hair` group sits on the head.
 */
export type BoyPose = CharacterMood | 'stand'

type Pt = readonly [number, number]

const INK = '#2b1a2e'
const SHOULDER_L: Pt = [40.6, 36.6]
const SHOULDER_R: Pt = [59.4, 36.6]

const ARMS: Record<BoyPose, { l: readonly Pt[]; r: readonly Pt[] }> = {
  stand: {
    l: [SHOULDER_L, [37.4, 49], [38.6, 60.6]],
    r: [SHOULDER_R, [62.6, 49], [61.4, 60.6]],
  },
  happy: {
    l: [SHOULDER_L, [37.4, 49], [38.6, 60.6]],
    r: [SHOULDER_R, [69.6, 42.5], [72.6, 27.5]],
  },
  excited: {
    l: [SHOULDER_L, [30.6, 30.5], [26.4, 12.5]],
    r: [SHOULDER_R, [69.4, 30.5], [73.6, 12.5]],
  },
  curious: {
    l: [SHOULDER_L, [37.4, 49], [38.6, 60.6]],
    r: [SHOULDER_R, [66.4, 48], [54.4, 32]],
  },
  brave: {
    l: [SHOULDER_L, [30.4, 47.4], [40.4, 58.4]],
    r: [SHOULDER_R, [69.6, 47.4], [59.6, 58.4]],
  },
  worried: {
    l: [SHOULDER_L, [36.6, 47.6], [46.4, 29.6]],
    r: [SHOULDER_R, [63.4, 47.6], [53.6, 29.6]],
  },
  sleepy: {
    l: [SHOULDER_L, [38, 50], [39.4, 62]],
    r: [SHOULDER_R, [62, 50], [60.6, 62]],
  },
}

function starPath(cx: number, cy: number, R: number, r = R * 0.46): string {
  const pts: string[] = []
  for (let i = 0; i < 10; i++) {
    const a = (Math.PI / 5) * i - Math.PI / 2
    const rad = i % 2 === 0 ? R : r
    pts.push(`${(cx + Math.cos(a) * rad).toFixed(2)} ${(cy + Math.sin(a) * rad).toFixed(2)}`)
  }
  return `M${pts.join(' L')} Z`
}

interface ArmProps {
  pts: readonly Pt[]
  sleeve: string
  outline: string
  cuff: string
  skin: string
  skinLine: string
}

function Arm({ pts, sleeve, outline, cuff, skin, skinLine }: ArmProps) {
  const [s, e, h] = pts
  const cx = 2 * e[0] - (s[0] + h[0]) / 2
  const cy = 2 * e[1] - (s[1] + h[1]) / 2
  const d = `M${s[0]} ${s[1]} Q${cx.toFixed(2)} ${cy.toFixed(2)} ${h[0]} ${h[1]}`
  return (
    <g strokeLinecap="round" fill="none">
      <path d={d} stroke={outline} strokeWidth={5.8} />
      <path d={d} stroke={sleeve} strokeWidth={4.4} />
      <path d={d} stroke={cuff} strokeWidth={4.8} pathLength={100} strokeDasharray="0 84 16" strokeLinecap="butt" />
      <circle cx={h[0]} cy={h[1]} r={2.8} fill={skin} stroke={skinLine} strokeWidth={0.8} />
    </g>
  )
}

interface EyeProps {
  cx: number
  cy: number
  mood: BoyPose
  color: string
}

function BoyEye({ cx, cy, mood, color }: EyeProps) {
  if (mood === 'sleepy') {
    return (
      <g fill="none" stroke={INK} strokeLinecap="round">
        <path d={`M${cx - 2.6} ${cy - 0.2} Q${cx} ${cy + 2} ${cx + 2.6} ${cy - 0.2}`} strokeWidth={1.2} />
      </g>
    )
  }
  const ry = mood === 'excited' ? 3.2 : mood === 'worried' ? 3 : mood === 'brave' ? 2.4 : 2.75
  const rx = 2.5
  const lookX = mood === 'curious' ? 0.9 : 0
  const lookY = mood === 'curious' ? -0.5 : mood === 'worried' ? -0.4 : 0
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#fff" />
      <ellipse cx={cx + lookX} cy={cy + lookY} rx={1.85} ry={Math.min(ry - 0.1, 2.5)} fill={color} />
      <ellipse cx={cx + lookX} cy={cy + lookY} rx={0.95} ry={1.2} fill="#1b1220" />
      <circle cx={cx + lookX - 0.7} cy={cy + lookY - 0.9} r={0.75} fill="#fff" />
      <path
        d={`M${cx - rx - 0.3} ${cy - 0.3} Q${cx} ${cy - ry - 1.3} ${cx + rx + 0.3} ${cy - 0.3}`}
        fill="none"
        stroke={INK}
        strokeWidth={1.2}
        strokeLinecap="round"
      />
    </g>
  )
}

function BoyBrows({ mood, color }: { mood: BoyPose; color: string }) {
  const s = { fill: 'none', stroke: color, strokeWidth: 1.5, strokeLinecap: 'round' } as const
  if (mood === 'sleepy') {
    return (
      <g {...s} opacity={0.8}>
        <path d="M42 15.4 L47.4 15" />
        <path d="M52.6 15 L58 15.4" />
      </g>
    )
  }
  if (mood === 'brave') {
    return (
      <g {...s} strokeWidth={1.7}>
        <path d="M41 12.8 L47.8 15" />
        <path d="M59 12.8 L52.2 15" />
      </g>
    )
  }
  if (mood === 'worried') {
    return (
      <g {...s}>
        <path d="M41.2 14.8 Q44.6 13.6 48 13" />
        <path d="M58.8 14.8 Q55.4 13.6 52 13" />
      </g>
    )
  }
  if (mood === 'curious') {
    return (
      <g {...s}>
        <path d="M41.4 14.4 L47.6 14" />
        <path d="M52.4 11.6 Q55.6 9.6 58.8 12" />
      </g>
    )
  }
  const y = mood === 'excited' ? 12 : 13.6
  return (
    <g {...s}>
      <path d={`M41.2 ${y + 0.4} L47.8 ${y - 0.6}`} />
      <path d={`M52.2 ${y - 0.6} L58.8 ${y + 0.4}`} />
    </g>
  )
}

function BoyMouth({ mood }: { mood: BoyPose }) {
  const line = { fill: 'none', stroke: INK, strokeWidth: 1.15, strokeLinecap: 'round', strokeLinejoin: 'round' } as const
  switch (mood) {
    case 'excited':
      return (
        <g>
          <path d="M46.4 24.4 Q50 25.4 53.6 24.4 Q53 29.4 50 29.4 Q47 29.4 46.4 24.4 Z" fill="#8b1d3f" stroke={INK} strokeWidth={0.9} strokeLinejoin="round" />
          <path d="M47.4 24.6 Q50 25.4 52.6 24.6 L52.2 25.6 Q50 26.2 47.8 25.6Z" fill="#fff" />
        </g>
      )
    case 'curious':
      return <ellipse cx={50.8} cy={26} rx={1.1} ry={1.4} fill="#8b1d3f" stroke={INK} strokeWidth={0.8} />
    case 'brave':
      return <path d="M47.2 25.4 Q50.2 27.4 53.2 24.4" {...line} />
    case 'worried':
      return <path d="M47.6 27 Q50 25 52.4 27" {...line} />
    case 'sleepy':
      return <path d="M48.6 25.2 Q50 26.2 51.4 25.2" {...line} />
    default:
      return <path d="M47 24.6 Q50 27.6 53 24.6" {...line} />
  }
}

function Fx({ mood }: { mood: BoyPose }) {
  const font = "'Lexend Variable', system-ui, sans-serif"
  if (mood === 'sleepy') {
    return (
      <g className="stage-zzz" fill="#8b9cf0" fontWeight={800} fontFamily={font}>
        <text x={66} y={12} fontSize={9}>z</text>
        <text x={72} y={4} fontSize={6}>z</text>
      </g>
    )
  }
  if (mood === 'excited') {
    const spark = (x: number, y: number, s: number, d: string) => (
      <path key={d} className="stage-twinkle" style={{ animationDelay: d }} d={starPath(x, y, s, s * 0.35)} fill="#FFD43B" stroke="#E8A400" strokeWidth={0.5} />
    )
    return <g>{spark(30, 6, 4, '0s')}{spark(70, 4, 3.4, '0.5s')}{spark(76, 30, 2.6, '0.9s')}</g>
  }
  if (mood === 'curious') {
    return (
      <text className="stage-twinkle" x={68} y={12} fontSize={11} fontWeight={800} fill="#a78bfa" fontFamily={font}>
        ?
      </text>
    )
  }
  if (mood === 'worried') {
    return (
      <path
        className="stage-twinkle"
        d="M68 4 C70 7.4 71.4 9 71.4 10.8 C71.4 12.8 69.8 14 68 14 C66.2 14 64.6 12.8 64.6 10.8 C64.6 9 66 7.4 68 4 Z"
        fill="#8fd3ff"
        stroke="#3b8fd0"
        strokeWidth={0.7}
      />
    )
  }
  return null
}

/** Short hair on top of the head: the only layer, since none of the three styles reaches the shoulders. */
function Hair({ look, id }: { look: BoyLook; id: string }) {
  const fill = `url(#${id}h)`
  const line = darken(look.hair, 0.5)
  const stroke = { stroke: line, strokeWidth: 0.8, strokeLinejoin: 'round' } as const
  const gloss = { fill: 'none', stroke: look.hairLight, strokeLinecap: 'round' } as const
  switch (look.hairStyle) {
    case 'spiky':
      return (
        <g>
          <path d="M38 19 C36 9 42 2.4 50 2.4 C58 2.4 64 9 62 19 C60.6 15 59 13 57.4 14.6 C56.4 10.4 54 8.6 52.4 11.6 C51.2 8 50 6.6 50 6.6 C50 6.6 48.8 8 47.6 11.6 C46 8.6 43.6 10.4 42.6 14.6 C41 13 39.4 15 38 19 Z" fill={fill} {...stroke} />
          <path d="M43 12 L46.4 4.2 M50 11 L50 3 M57 12 L53.6 4.2" {...gloss} strokeWidth={1.1} opacity={0.6} />
        </g>
      )
    case 'messy':
      return (
        <g>
          <path d="M37 19.6 C35 9 42 2 50 2 C58 2 65 9 63 19.6 C61.6 15.4 59.6 17 58.8 13.8 C57 17.4 54 16 53.4 12.8 C51.6 15.6 48.4 15.6 46.6 12.8 C46 16 43 17.4 41.2 13.8 C40.4 17 38.4 15.4 37 19.6 Z" fill={fill} {...stroke} />
          <path d="M58 9 Q62 6 61 2" {...gloss} strokeWidth={1.3} opacity={0.65} />
          <path d="M42 6.4 Q46 3.4 50 4.8 Q54 3.4 58 6.4" {...gloss} strokeWidth={0.8} opacity={0.5} />
        </g>
      )
    case 'curly':
    default:
      return (
        <g>
          <path d="M38.4 18.4 C36 10 43 3.4 50 3.4 C57 3.4 64 10 61.6 18.4 C60.6 15 59.2 13.2 57.4 13 C56.4 15.4 53.8 15.4 52.8 13 C51.6 15.4 48.4 15.4 47.2 13 C46.2 15.4 43.6 15.4 42.6 13 C40.8 13.2 39.4 15 38.4 18.4 Z" fill={fill} {...stroke} />
          <path d="M42.6 8.2 Q44 6.4 45.8 7.6 M48.6 6 Q50 4.4 51.4 6 M54.2 7.6 Q56 6.4 57.4 8.2" {...gloss} strokeWidth={0.9} opacity={0.65} />
        </g>
      )
  }
}

function Glasses() {
  const frame = '#334155'
  return (
    <g fill="none" stroke={frame} strokeWidth={1}>
      <circle cx={44.8} cy={18.8} r={4.6} fill="#fff" fillOpacity={0.14} />
      <circle cx={55.2} cy={18.8} r={4.6} fill="#fff" fillOpacity={0.14} />
      <path d="M49.3 18.4 Q50 17.6 50.7 18.4" />
      <path d="M40.2 18.2 L38.2 17.4 M59.8 18.2 L61.8 17.4" />
      <path d="M41.8 16.4 Q43 15.4 44.2 15.4" stroke="#fff" strokeWidth={0.7} opacity={0.8} strokeLinecap="round" />
      <path d="M52.2 16.4 Q53.4 15.4 54.6 15.4" stroke="#fff" strokeWidth={0.7} opacity={0.8} strokeLinecap="round" />
    </g>
  )
}

function Face({ look, mood, id }: { look: BoyLook; mood: BoyPose; id: string }) {
  const skinLine = darken(look.skin, 0.5)
  const shade = darken(look.skin, 0.2)
  return (
    <g>
      <path d="M46.8 28.6 L46.6 36 Q50 38 53.4 36 L53.2 28.6 Z" fill={shade} />
      <ellipse cx={38.2} cy={19.4} rx={1.7} ry={2.5} fill={look.skin} stroke={skinLine} strokeWidth={0.7} />
      <ellipse cx={61.8} cy={19.4} rx={1.7} ry={2.5} fill={look.skin} stroke={skinLine} strokeWidth={0.7} />
      <path
        d="M50 4.4 C57.6 4.4 62 10.4 62 17.4 C62 25.2 57.2 31.2 50 31.2 C42.8 31.2 38 25.2 38 17.4 C38 10.4 42.4 4.4 50 4.4 Z"
        fill={`url(#${id}s)`}
        stroke={skinLine}
        strokeWidth={0.8}
      />
      <path d="M48.6 22.4 Q50 23.6 51.6 22.4" fill="none" stroke={darken(look.skin, 0.3)} strokeWidth={0.8} strokeLinecap="round" />
      <ellipse cx={42.8} cy={23.2} rx={2.2} ry={1.3} fill="#FF8FA3" opacity={0.22} />
      <ellipse cx={57.2} cy={23.2} rx={2.2} ry={1.3} fill="#FF8FA3" opacity={0.22} />
      {look.freckles && (
        <g fill="#C26A3E" opacity={0.7}>
          {[[43.6, 21.6], [41.9, 22.8], [45, 23], [56.4, 21.6], [58.1, 22.8], [55, 23]].map(([x, y]) => (
            <circle key={`${x}${y}`} cx={x} cy={y} r={0.38} />
          ))}
        </g>
      )}
      <g className="stage-blink">
        <BoyEye cx={44.8} cy={18.6} mood={mood} color={look.eye} />
        <BoyEye cx={55.2} cy={18.6} mood={mood} color={look.eye} />
      </g>
      <BoyMouth mood={mood} />
    </g>
  )
}

const LEG = 'M40.4 58 C39.8 70 41.2 84 41.4 94.8 L48.9 94.8 C49.1 84 49.7 70 49.6 58 Z'
const SHOE =
  'M40.8 92.6 L49.2 92.6 L49.5 97.2 C49.5 98.6 48.6 99.2 47.6 99.2 L39 99.2 C36.4 99.2 35.6 97.6 36.8 96.2 C38 94.8 39.6 94.2 40.8 92.6 Z'
const SOLE = 'M36.4 97 L49.5 97 L49.5 97.6 C49.5 98.8 48.7 99.4 47.6 99.4 L39 99.4 C37.4 99.4 36.5 98.6 36.4 97 Z'
const MIRROR = 'matrix(-1 0 0 1 100 0)'

interface Palette {
  p: string
  s: string
  pants: string
  neon: string
}

/** Straight legs and sneakers; boys never wear a skirt. */
function Bottoms({ look, c }: { look: BoyLook; c: Palette }) {
  const legs = c.pants
  const edge = darken(legs, 0.55)
  return (
    <g strokeLinejoin="round">
      {[0, 1].map((i) => (
        <g key={i} transform={i === 1 ? MIRROR : undefined}>
          <path d={LEG} fill={legs} stroke={edge} strokeWidth={0.9} />
          <path d="M44.2 60 C43.8 72 44.4 84 44.6 93" fill="none" stroke={c.neon} strokeWidth={0.9} opacity={0.85} strokeLinecap="round" />
          <path d={SHOE} fill={look.shoe} stroke={darken(look.shoe, 0.6)} strokeWidth={0.9} />
          <path d={SOLE} fill={look.shoe === '#F8FAFC' ? '#E2E8F0' : '#F8FAFC'} stroke={darken(look.shoe, 0.6)} strokeWidth={0.7} />
          <path d="M41.6 94 L47.6 95.8" stroke={c.neon} strokeWidth={1.2} strokeLinecap="round" />
        </g>
      ))}
    </g>
  )
}

/** Torso with all garment details. */
function Torso({ look, c, id }: { look: BoyLook; c: Palette; id: string }) {
  const base = `url(#${id}b)`
  const T = 'M40 35 Q50 38.2 60 35 L61.8 48 L61.4 62 Q50 64 38.6 62 L38.2 48 Z'
  const o = darken(c.p, 0.6)
  const line = { stroke: o, strokeWidth: 0.9, strokeLinejoin: 'round' } as const
  switch (look.top) {
    case 'jacket': {
      const rib = darken(c.p, 0.25)
      return (
        <g>
          <clipPath id={`${id}c`}><path d={T} /></clipPath>
          <path d={T} fill={base} />
          <g clipPath={`url(#${id}c)`}>
            <rect x={34} y={59} width={30} height={6.4} fill={rib} />
            <path d="M48.4 35.6 L51.6 35.6 L51.2 62 L48.8 62 Z" fill={darken(c.p, 0.14)} />
          </g>
          <path d={T} fill="none" {...line} />
          <path d="M48.4 35.6 L51.6 35.6 L51.2 62 L48.8 62 Z" fill="none" stroke={o} strokeWidth={0.7} />
          <circle cx={50} cy={43} r={1} fill={c.neon} />
          <circle cx={50} cy={49} r={1} fill={c.neon} />
          <circle cx={50} cy={55} r={1} fill={c.neon} />
          <path d="M42.4 33.4 Q50 40 57.6 33.4 L56 32.2 Q50 37 44 32.2 Z" fill={rib} stroke={o} strokeWidth={0.8} strokeLinejoin="round" />
          <path d={starPath(57.2, 46, 2.6)} fill="#fff" opacity={0.95} />
        </g>
      )
    }
    case 'tee': {
      const W = 'M41 35 Q50 37.6 59 35 L60.4 48 L60 62 Q50 64 40 62 L39.6 48 Z'
      return (
        <g>
          <clipPath id={`${id}c`}><path d={W} /></clipPath>
          <path d={W} fill={base} />
          <g clipPath={`url(#${id}c)`}>
            <rect x={34} y={43.4} width={34} height={3.4} fill={lighten(c.p, 0.6)} />
            <rect x={34} y={51.4} width={34} height={3.4} fill={lighten(c.p, 0.6)} />
            <rect x={34} y={59.4} width={34} height={3.4} fill={lighten(c.p, 0.6)} />
          </g>
          <path d={W} fill="none" {...line} />
          <path d="M43.6 34.6 Q50 39.6 56.4 34.6 L54.8 33.2 Q50 36.8 45.2 33.2 Z" fill="none" stroke={o} strokeWidth={0.9} strokeLinejoin="round" />
        </g>
      )
    }
    case 'hoodie':
    default: {
      const rib = darken(c.p, 0.2)
      return (
        <g>
          <clipPath id={`${id}c`}><path d={T} /></clipPath>
          <path d={T} fill={base} />
          <g clipPath={`url(#${id}c)`}>
            <rect x={36} y={58.6} width={28} height={6.4} fill={rib} />
            <path d="M42.6 52.4 L57.4 52.4 L59.6 61 Q50 63 40.4 61 Z" fill={darken(c.p, 0.1)} />
          </g>
          <path d={T} fill="none" {...line} />
          <path d="M42.8 52.6 L57.2 52.6 L59.4 60.8 M42.8 52.6 L40.6 60.8" fill="none" stroke={o} strokeWidth={0.8} strokeLinejoin="round" />
          <path d="M41.4 32.6 C40 39.4 44.4 43.4 50 43.8 C55.6 43.4 60 39.4 58.6 32.6 Q50 38.8 41.4 32.6 Z" fill={darken(c.p, 0.12)} stroke={o} strokeWidth={0.9} strokeLinejoin="round" />
          <path d="M46 41 C46.6 44.6 46.2 48 46.2 50.6 M54 41 C53.4 44.6 53.8 48 53.8 50.6" fill="none" stroke={c.neon} strokeWidth={0.95} strokeLinecap="round" />
          <circle cx={46.2} cy={51.2} r={1} fill={c.neon} />
          <circle cx={53.8} cy={51.2} r={1} fill={c.neon} />
        </g>
      )
    }
  }
}

export interface BoyProps extends Partial<CharacterProps> {
  look: BoyLookKey
  pose: BoyPose
}

/** The figure itself, 100 x 100 box, no ground shadow. */
export function Boy({ look: key, primary, secondary, pose }: BoyProps) {
  const look = BOY_LOOKS[key]
  const id = useGid()
  const p = primary ?? look.primary
  const s = secondary ?? look.secondary
  const c: Palette = { p, s, pants: look.pants ?? s, neon: look.neon }
  const cuff = darken(p, 0.22)
  const arms = ARMS[pose]
  const skinLine = darken(look.skin, 0.5)
  const armProps = { sleeve: p, outline: darken(p, 0.6), cuff, skin: look.skin, skinLine }
  const waving = pose === 'happy'
  const tiltDeg = pose === 'curious' ? -3 : pose === 'sleepy' ? 3 : 0
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <defs>
        <linearGradient id={`${id}h`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={look.hairLight} />
          <stop offset="0.25" stopColor={look.hair} />
          <stop offset="1" stopColor={look.hairShade} />
        </linearGradient>
        <radialGradient id={`${id}s`} cx="42%" cy="35%" r="75%">
          <stop offset="0" stopColor={lighten(look.skin, 0.35)} />
          <stop offset="0.6" stopColor={look.skin} />
          <stop offset="1" stopColor={darken(look.skin, 0.1)} />
        </radialGradient>
        <linearGradient id={`${id}b`} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor={lighten(p, 0.3)} />
          <stop offset="0.55" stopColor={p} />
          <stop offset="1" stopColor={darken(p, 0.18)} />
        </linearGradient>
      </defs>
      <Bottoms look={look} c={c} />
      <Torso look={look} c={c} id={id} />
      <g transform={tiltDeg ? `rotate(${tiltDeg} 50 31)` : undefined}>
        <Face look={look} mood={pose} id={id} />
        <Hair look={look} id={id} />
        <BoyBrows mood={pose} color={darken(look.hair, 0.3)} />
        {look.glasses && <Glasses />}
      </g>
      <g>
        <Arm pts={arms.l} {...armProps} />
        {waving ? (
          <g className="stage-wave" style={{ transformOrigin: `${SHOULDER_R[0]}px ${SHOULDER_R[1]}px` }}>
            <Arm pts={arms.r} {...armProps} />
          </g>
        ) : (
          <Arm pts={arms.r} {...armProps} />
        )}
      </g>
      <Fx mood={pose} />
    </g>
  )
}

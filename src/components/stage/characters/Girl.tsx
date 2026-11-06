import type { CharacterMood } from '../../../types/story'
import { darken, lighten, mix, useGid } from '../colors'
import type { CharacterProps } from '../types'
import { GIRL_LOOKS } from './looks'
import type { GirlLook, GirlLookKey } from './looks'

/**
 * One figure for all seven girls (D38): a 10-12 year old drawn like a character from a cartoon
 * for older kids, not a chibi. Head about 28% of the height, slim body, long legs, medium eyes
 * with lashes, small nose and mouth. The figure fills a 100 x 100 box: feet at y 99, head on
 * top, width 50-60. The look table (looks.ts) picks hair, skin and outfit; the story colours
 * replace the two main outfit colours. The mood is played with the whole body: face and arms.
 */
export type GirlPose = CharacterMood | 'stand'

type Pt = readonly [number, number]

const INK = '#2b1a2e'
const SHOULDER_L: Pt = [40.6, 36.6]
const SHOULDER_R: Pt = [59.4, 36.6]

const ARMS: Record<GirlPose, { l: readonly Pt[]; r: readonly Pt[] }> = {
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
  stripe?: string
}

function Arm({ pts, sleeve, outline, cuff, skin, skinLine, stripe }: ArmProps) {
  const [s, e, h] = pts
  // Control point that makes the curve pass through the elbow.
  const cx = 2 * e[0] - (s[0] + h[0]) / 2
  const cy = 2 * e[1] - (s[1] + h[1]) / 2
  const d = `M${s[0]} ${s[1]} Q${cx.toFixed(2)} ${cy.toFixed(2)} ${h[0]} ${h[1]}`
  return (
    <g strokeLinecap="round" fill="none">
      <path d={d} stroke={outline} strokeWidth={5.6} />
      <path d={d} stroke={sleeve} strokeWidth={4.2} />
      {stripe && <path d={d} stroke={stripe} strokeWidth={1.1} opacity={0.9} pathLength={100} strokeDasharray="0 6 62 32" />}
      <path d={d} stroke={cuff} strokeWidth={4.6} pathLength={100} strokeDasharray="0 86 14" strokeLinecap="butt" />
      <circle cx={h[0]} cy={h[1]} r={2.7} fill={skin} stroke={skinLine} strokeWidth={0.8} />
    </g>
  )
}

interface EyeProps {
  cx: number
  cy: number
  /** -1 for the viewer's left eye, +1 for the right one: where the outer corner is. */
  side: -1 | 1
  mood: GirlPose
  look: GirlLook
}

function GirlEye({ cx, cy, side, mood, look }: EyeProps) {
  if (mood === 'sleepy') {
    return (
      <g fill="none" stroke={INK} strokeLinecap="round">
        <path d={`M${cx - 2.7} ${cy - 0.2} Q${cx} ${cy + 2.3} ${cx + 2.7} ${cy - 0.2}`} strokeWidth={1.2} />
        <path d={`M${cx + side * 2.6} ${cy + 0.3} l${side * 1.4} 1`} strokeWidth={0.9} />
      </g>
    )
  }
  const ry = mood === 'excited' ? 3.5 : mood === 'worried' ? 3.3 : mood === 'brave' ? 2.6 : 3.05
  const rx = 2.6
  const lookX = mood === 'curious' ? 0.9 : 0
  const lookY = mood === 'curious' ? -0.5 : mood === 'worried' ? -0.4 : 0
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#fff" />
      <ellipse cx={cx + lookX} cy={cy + lookY} rx={1.95} ry={Math.min(ry - 0.1, 2.7)} fill={look.eye} />
      <ellipse cx={cx + lookX} cy={cy + lookY + 1.1} rx={1.6} ry={1.1} fill={lighten(look.eye, 0.4)} opacity={0.55} />
      <ellipse cx={cx + lookX} cy={cy + lookY} rx={1} ry={1.3} fill="#1b1220" />
      <circle cx={cx + lookX - 0.75} cy={cy + lookY - 1} r={0.8} fill="#fff" />
      <circle cx={cx + lookX + 0.8} cy={cy + lookY + 1.1} r={0.35} fill="#fff" />
      <path
        d={`M${cx - rx - 0.3} ${cy - 0.3} Q${cx} ${cy - ry - 1.5} ${cx + rx + 0.3} ${cy - 0.3}`}
        fill="none"
        stroke={INK}
        strokeWidth={1.3}
        strokeLinecap="round"
      />
      <path d={`M${cx + side * (rx + 0.1)} ${cy - 0.7} l${side * 1.6} -1.2`} stroke={INK} strokeWidth={0.95} strokeLinecap="round" />
    </g>
  )
}

function GirlBrows({ mood, color, sad }: { mood: GirlPose; color: string; sad: boolean }) {
  const s = { fill: 'none', stroke: color, strokeWidth: 1.15, strokeLinecap: 'round' } as const
  if (mood === 'sleepy') {
    return (
      <g {...s} opacity={0.8}>
        <path d="M41.8 15.4 Q44.8 14.2 47.6 15" />
        <path d="M52.4 15 Q55.2 14.2 58.2 15.4" />
      </g>
    )
  }
  if (mood === 'brave') {
    return (
      <g {...s} strokeWidth={1.4}>
        <path d="M41.2 13.2 L47.8 15" />
        <path d="M58.8 13.2 L52.2 15" />
      </g>
    )
  }
  if (mood === 'worried' || (sad && mood !== 'excited')) {
    const lift = mood === 'worried' ? 1.4 : 0.6
    return (
      <g {...s}>
        <path d={`M41.4 ${14.9} Q44.6 ${14 - lift * 0.4} 47.8 ${13.2 - lift}`} />
        <path d={`M58.6 ${14.9} Q55.4 ${14 - lift * 0.4} 52.2 ${13.2 - lift}`} />
      </g>
    )
  }
  if (mood === 'curious') {
    return (
      <g {...s}>
        <path d="M41.6 14.6 Q44.6 13.4 47.6 14.4" />
        <path d="M52.4 12.2 Q55.6 10 58.6 12.4" />
      </g>
    )
  }
  const y = mood === 'excited' ? 12.4 : 13.9
  return (
    <g {...s}>
      <path d={`M41.6 ${y + 0.8} Q44.6 ${y - 1} 47.8 ${y + 0.4}`} />
      <path d={`M52.2 ${y + 0.4} Q55.4 ${y - 1} 58.4 ${y + 0.8}`} />
    </g>
  )
}

function GirlMouth({ mood }: { mood: GirlPose }) {
  const line = { fill: 'none', stroke: INK, strokeWidth: 1.15, strokeLinecap: 'round', strokeLinejoin: 'round' } as const
  switch (mood) {
    case 'excited':
      return (
        <g>
          <path d="M46.6 24.2 Q50 25.2 53.4 24.2 Q52.8 29.6 50 29.6 Q47.2 29.6 46.6 24.2 Z" fill="#8b1d3f" stroke={INK} strokeWidth={0.9} strokeLinejoin="round" />
          <path d="M47.6 27.8 Q50 26.6 52.4 27.8 Q51.6 29.2 50 29.2 Q48.4 29.2 47.6 27.8Z" fill="#ff8aa3" />
          <path d="M47.2 24.5 Q50 25.3 52.8 24.5 L52.4 25.6 Q50 26.2 47.6 25.6Z" fill="#fff" />
        </g>
      )
    case 'curious':
      return <ellipse cx={50.8} cy={26} rx={1.1} ry={1.4} fill="#8b1d3f" stroke={INK} strokeWidth={0.8} />
    case 'brave':
      return <path d="M47.4 25.6 Q50.2 27.6 53 24.6" {...line} />
    case 'worried':
      return <path d="M47.8 27 Q50 24.8 52.2 27" {...line} />
    case 'sleepy':
      return <path d="M48.6 25.4 Q50 26.4 51.4 25.4" {...line} />
    default:
      return <path d="M47.2 24.6 Q50 27.8 52.8 24.6" {...line} />
  }
}

/** Hair in front of the face: a sweeping fringe plus side locks. */
function HairFront({ look, id }: { look: GirlLook; id: string }) {
  const fill = `url(#${id}h)`
  const line = darken(look.hair, 0.5)
  const stroke = { stroke: line, strokeWidth: 0.8, strokeLinejoin: 'round' } as const
  const gloss = { fill: 'none', stroke: look.hairLight, strokeLinecap: 'round' } as const
  switch (look.hairStyle) {
    case 'ponytail':
      return (
        <g>
          <path d="M37.4 19.5 C35.8 8.5 42 2 50 2 C58.6 2 64.2 8.5 62.6 19.5 C61.8 15 59.6 12 56 10.4 C52 14.4 45.6 14.2 41.2 17.2 C39.6 18.2 38.4 18.8 37.4 19.5 Z" fill={fill} {...stroke} />
          <path d="M38 17 C36.4 24 36.8 30.4 39.4 35.6 C40.6 30.6 40.8 24 40.4 18 Z" fill={fill} {...stroke} />
          <path d="M62 17 C63.6 24 63.2 30.4 60.6 35.6 C59.4 30.6 59.2 24 59.6 18 Z" fill={fill} {...stroke} />
          <path d="M41 7.4 Q50 2.8 59.4 7.6" {...gloss} strokeWidth={1.6} opacity={0.5} />
          <path d="M44 6.2 C47 9 52 11 55.6 10.6" {...gloss} strokeWidth={0.8} opacity={0.6} />
          <path d="M39.4 21 C39.4 26 39.8 30 40.4 33" {...gloss} strokeWidth={0.7} opacity={0.5} />
          <path d="M60.6 21 C60.6 26 60.2 30 59.6 33" {...gloss} strokeWidth={0.7} opacity={0.5} />
          <path d="M39.4 28 C39.8 31 40 33 40 35" stroke={look.hairTip} strokeWidth={1.4} strokeLinecap="round" fill="none" />
          <path d="M60.6 28 C60.2 31 60 33 60 35" stroke={look.hairTip} strokeWidth={1.4} strokeLinecap="round" fill="none" />
          <path d="M46.8 10.8 C44.6 12.4 42.2 14 40.6 16.4" stroke={look.hairTip} strokeWidth={1.1} strokeLinecap="round" fill="none" opacity={0.9} />
        </g>
      )
    case 'wavy':
      return (
        <g>
          <path d="M37.2 19 C35.4 8 42 1.8 50 1.8 C58.2 1.8 64.6 8 62.8 19 C61.2 14 58.4 10 53 8.8 C49 12.8 42.4 12.8 40 18.2 C39 19 38 19.2 37.2 19 Z" fill={fill} {...stroke} />
          <path d="M37.8 17.6 C34.4 23.6 38.2 28.6 35.6 35 C39.2 33.8 41.6 30 40.8 24 C40.8 21 40.2 19.2 39.6 17.6 Z" fill={fill} {...stroke} />
          <path d="M62.2 17.6 C65.6 23.6 61.8 28.6 64.4 35 C60.8 33.8 58.4 30 59.2 24 C59.2 21 59.8 19.2 60.4 17.6 Z" fill={fill} {...stroke} />
          <path d="M42 6.6 Q51 1.6 60.4 7.4" {...gloss} strokeWidth={1.8} opacity={0.55} />
          <path d="M44.6 5.4 C48 8 52 9.4 54.6 8.8" {...gloss} strokeWidth={0.8} opacity={0.65} />
          <path d="M37.6 22.6 C36.8 26 38.4 28.6 37.6 31.4" {...gloss} strokeWidth={0.7} opacity={0.6} />
          <path d="M62.4 22.6 C63.2 26 61.6 28.6 62.4 31.4" {...gloss} strokeWidth={0.7} opacity={0.6} />
        </g>
      )
    case 'buns':
      return (
        <g>
          <path d="M37.4 19.5 C35.8 8.5 41 3 50 3 C59 3 64.2 8.5 62.6 19.5 L62.4 31 C61 27 60.6 21 60.8 14.6 C56 12.2 44 12.2 39.2 14.6 C39.4 21 39 27 37.6 31 Z" fill={fill} {...stroke} />
          <path d="M40 8 Q50 3.4 60 8" {...gloss} strokeWidth={1.6} opacity={0.5} />
          <path d="M43 11.6 C47 12.6 53 12.6 57 11.6" stroke={look.hairShade} strokeWidth={0.8} fill="none" opacity={0.6} />
        </g>
      )
    case 'queen':
      return (
        <g>
          <path d="M37.6 19.4 C35.8 8 42 2 50 2 C58 2 64.2 8 62.4 19.4 C60.2 13.6 55.8 10 50 8.4 C44.2 10 39.8 13.6 37.6 19.4 Z" fill={fill} {...stroke} />
          <path d="M37.8 18 C34.8 30 36.2 40 33 51 C37.4 49.6 40.8 42 40.8 32 C40.8 26 40.2 21.6 39.8 18 Z" fill={fill} {...stroke} />
          <path d="M62.2 18 C65.2 30 63.8 40 67 51 C62.6 49.6 59.2 42 59.2 32 C59.2 26 59.8 21.6 60.2 18 Z" fill={fill} {...stroke} />
          <path d="M41 7.6 Q50 2.4 59 7.6" {...gloss} strokeWidth={1.6} opacity={0.8} />
          <path d="M39 26 C38.4 34 37.4 42 35.8 48" {...gloss} strokeWidth={0.8} opacity={0.9} />
          <path d="M61 26 C61.6 34 62.6 42 64.2 48" {...gloss} strokeWidth={0.8} opacity={0.9} />
          <path d="M37 44 C36 47 35.2 49 34.4 50.4" stroke={look.hairTip} strokeWidth={1.4} fill="none" strokeLinecap="round" />
          <path d="M63 44 C64 47 64.8 49 65.6 50.4" stroke={look.hairTip} strokeWidth={1.4} fill="none" strokeLinecap="round" />
        </g>
      )
    case 'curly':
      return (
        <g>
          <path d="M38 18 C35.4 9.6 43 3 50 3 C57 3 64.6 9.6 62 18 C60.8 14.4 59.2 12.4 57.2 12 C56 14.6 53.2 14.8 52 12.4 C50.6 15 47.4 15 46.2 12.4 C44.8 14.8 42 14.4 40.8 12 C39.2 12.8 38.6 15 38 18 Z" fill={fill} {...stroke} />
          <path d="M42 8.6 Q43.6 6.6 45.6 8 M49 6 Q51 4.4 53 6.4 M56 8.2 Q58 6.8 59.4 9.2" {...gloss} strokeWidth={1} opacity={0.7} />
          <path d="M39.6 20 C38.6 24 39.6 28 41 30 C41.6 26 41.2 22 40.8 19.6 Z" fill={fill} {...stroke} />
          <path d="M60.4 20 C61.4 24 60.4 28 59 30 C58.4 26 58.8 22 59.2 19.6 Z" fill={fill} {...stroke} />
        </g>
      )
    case 'braids':
      return (
        <g>
          <path d="M37.4 20 C35.6 8.5 42 2 50 2 C58 2 64.4 8.5 62.6 20 C61 14.4 57 10.6 52 9.4 L50 8.6 L48 9.4 C43 10.6 39 14.4 37.4 20 Z" fill={fill} {...stroke} />
          <path d="M50 3 L50 8.8 M44.6 4.2 C45.4 6.4 46.4 8.2 47.6 9.2 M55.4 4.2 C54.6 6.4 53.6 8.2 52.4 9.2 M40.4 8 C41.6 10 43 11.6 44.6 12.6 M59.6 8 C58.4 10 57 11.6 55.4 12.6" {...gloss} strokeWidth={0.7} opacity={0.7} />
          <path d="M42 6.2 Q50 2.4 58 6.2" {...gloss} strokeWidth={1.3} opacity={0.5} />
        </g>
      )
    case 'bob':
    default:
      return (
        <g>
          <path d="M37.2 19 C35.6 8 42 1.8 50 1.8 C58.4 1.8 64.6 8 62.8 19 C61.2 13 57.2 9.4 51 8.4 C47 12.6 42 13.6 38.8 17.6 C38.4 18.4 37.8 18.8 37.2 19 Z" fill={fill} {...stroke} />
          <path d="M37.8 16.6 C34.8 23.8 35.4 30 40.2 32.6 C40.8 27.4 40.4 22 39.8 16.6 Z" fill={fill} {...stroke} />
          <path d="M62.2 16.6 C65.2 23.8 64.6 30 59.8 32.6 C59.2 27.4 59.6 22 60.2 16.6 Z" fill={fill} {...stroke} />
          <path d="M42 6.6 Q51 1.8 60 7" {...gloss} strokeWidth={1.8} opacity={0.6} />
          <path d="M45 5.6 C48 8 52 9 55 8.4" {...gloss} strokeWidth={0.8} opacity={0.7} />
          <path d="M37.8 24 C37.2 27 38 29.4 38.8 31" {...gloss} strokeWidth={0.7} opacity={0.6} />
        </g>
      )
  }
}

/** Hair behind the head and body. */
function HairBack({ look, id }: { look: GirlLook; id: string }) {
  const fill = `url(#${id}h)`
  const line = darken(look.hair, 0.5)
  const stroke = { stroke: line, strokeWidth: 0.8, strokeLinejoin: 'round' } as const
  const gloss = { fill: 'none', stroke: look.hairLight, strokeLinecap: 'round' } as const
  switch (look.hairStyle) {
    case 'ponytail':
      return (
        <g>
          <g className="stage-sway" style={{ transformOrigin: '56px 6px' }}>
            <path d="M55 3.4 C66 -0.6 77 8 74.4 22 C72.8 30.4 75.2 39.4 69.6 49.4 C69 41.6 66.4 37.4 67 30.2 C66.8 21 62 13.6 55.4 10 Z" fill={`url(#${id}y)`} {...stroke} />
            <path d="M60.6 6.4 C68 8 71.4 16 70 24 C69.2 30 70.6 35 68.4 41" {...gloss} strokeWidth={0.8} opacity={0.5} />
            <path d="M64 12 C67.4 16 68.2 21 67.4 26" stroke={look.hairShade} strokeWidth={0.9} fill="none" opacity={0.6} />
            <path d="M54.2 3.2 C54 6.2 55.2 8.6 56.2 10.4" stroke={look.neon} strokeWidth={2.4} fill="none" strokeLinecap="round" />
          </g>
          <path d="M37.2 17 C36.4 6 44 1.2 50 1.2 C57 1.2 63.6 6 62.8 17 Z" fill={fill} {...stroke} />
        </g>
      )
    case 'wavy':
      return (
        <path
          d="M36.6 12 C31.2 18 35 25 31.6 32 C29.6 37.4 34.4 41.6 40.4 38.4 L40 26 L60 26 L59.6 38.4 C65.6 41.6 70.4 37.4 68.4 32 C65 25 68.8 18 63.4 12 C60 5 56 1.6 50 1.6 C44 1.6 40 5 36.6 12 Z"
          fill={fill}
          {...stroke}
        />
      )
    case 'buns':
      return (
        <g>
          {[39, 61].map((x, i) => (
            <g key={x}>
              <ellipse cx={x} cy={5.6} rx={5.8} ry={5.3} fill={fill} {...stroke} />
              <path d={`M${x - 3.4} ${5.8} C${x - 3} ${2.6} ${x + 1.4} ${1.8} ${x + 3} ${4.2} C${x + 3.6} ${6.8} ${x + 1} ${8.4} ${x - 1} ${7.6}`} {...gloss} strokeWidth={0.8} opacity={0.65} />
              <path d={`M${x - 5.4} ${i === 0 ? 8.6 : 8.6} Q${x} ${10.6} ${x + 5.4} ${8.6}`} stroke="#FDE047" strokeWidth={1.6} fill="none" strokeLinecap="round" />
            </g>
          ))}
          <path d="M37.2 17 C36.4 6 44 2 50 2 C57 2 63.6 6 62.8 17 Z" fill={fill} {...stroke} />
        </g>
      )
    case 'queen':
      return (
        <path
          d="M36 12 C29.6 26 31.2 42 28.6 57 C33.6 61.4 40.6 60.6 44.4 56.6 L44 30 L56 30 L55.6 56.6 C59.4 60.6 66.4 61.4 71.4 57 C68.8 42 70.4 26 64 12 C61 5 56 1.6 50 1.6 C44 1.6 39 5 36 12 Z"
          fill={`url(#${id}y)`}
          {...stroke}
        />
      )
    case 'curly':
      return (
        <g>
          <path d={scallop(50, 14.4, 19.4, 15.4, 15, 3)} fill={fill} {...stroke} />
          <path d="M36 14 q-2 -3 1 -5 M63.8 13 q2 -3 -1 -5 M33.4 20 q-2 -2 0 -4.6 M66.8 20 q2 -2 0 -4.6 M36 22 q-2 -2 0.4 -4.4 M64 22 q2 -2 -0.4 -4.4" {...gloss} strokeWidth={0.9} opacity={0.7} />
          <path d="M34.4 24 q-2 3 0 5 M65.6 24 q2 3 0 5" stroke={look.hairShade} strokeWidth={0.9} fill="none" opacity={0.7} strokeLinecap="round" />
        </g>
      )
    case 'braids':
      return (
        <g>
          <path d="M36.6 14 C35.4 4 44 0.8 50 0.8 C56 0.8 64.6 4 63.4 14 L63.2 22 L36.8 22 Z" fill={fill} {...stroke} />
          <Braid d="M38 12 C33 20 31.4 30 32.6 44" hair={look.hair} light={look.hairLight} />
          <Braid d="M62 12 C67 20 68.6 30 67.4 44" hair={look.hair} light={look.hairLight} />
        </g>
      )
    case 'bob':
    default:
      return (
        <path
          d="M35.8 13 C33.4 23 34 32 39.8 34 L60.2 34 C66 32 66.6 23 64.2 13 C62 5 57 1.8 50 1.8 C43 1.8 38 5 35.8 13 Z"
          fill={fill}
          {...stroke}
        />
      )
  }
}

/** A plait: dark rope with lighter ribs and a bead at the end. */
function Braid({ d, hair, light }: { d: string; hair: string; light: string }) {
  return (
    <g fill="none" strokeLinecap="round">
      <path d={d} stroke={darken(hair, 0.4)} strokeWidth={5.6} />
      <path d={d} stroke={hair} strokeWidth={4.4} />
      <path d={d} stroke={light} strokeWidth={4.4} strokeDasharray="0.9 2.1" strokeLinecap="butt" opacity={0.75} />
      <path d={d} stroke={light} strokeWidth={0.8} opacity={0.45} transform="translate(-0.9 0)" />
    </g>
  )
}

/** Closed path with `n` soft bumps around an ellipse (curly hair). */
function scallop(cx: number, cy: number, rx: number, ry: number, n: number, bump: number): string {
  const at = (i: number, k: number) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2
    return [cx + Math.cos(a) * (rx + k), cy + Math.sin(a) * (ry + k)] as const
  }
  let d = `M${at(0, 0)[0].toFixed(2)} ${at(0, 0)[1].toFixed(2)}`
  for (let i = 0; i < n; i++) {
    const mid = at(i + 0.5, bump)
    const end = at(i + 1, 0)
    d += ` Q${mid[0].toFixed(2)} ${mid[1].toFixed(2)} ${end[0].toFixed(2)} ${end[1].toFixed(2)}`
  }
  return `${d} Z`
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

/** The outfit below the head, back layer: things that stand out behind the body. */
function OutfitBack({ look, c, id }: { look: GirlLook; c: Palette; id: string }) {
  if (look.top === 'gown') {
    return (
      <g>
        <path
          d="M37 34 Q50 31 63 34 C70 56 76 78 79 92 Q73 98.6 67.4 93.6 Q62 99.6 56 95.4 Q50 100.2 44 95.4 Q38 99.6 32.6 93.6 Q27 98.6 21 92 C24 78 30 56 37 34 Z"
          fill={`url(#${id}k)`}
          stroke={darken(c.p, 0.6)}
          strokeWidth={0.9}
          strokeLinejoin="round"
        />
        <path d="M22 91.4 Q27 97.4 32.6 93 Q38 98 44 94.6 Q50 99.2 56 94.6 Q62 98 67.4 93 Q73 97.4 78 91.4" fill="none" stroke={c.s} strokeWidth={1.2} strokeLinecap="round" opacity={0.9} />
        <g className="stage-bob" fill={lighten(c.p, 0.25)} opacity={0.5}>
          <ellipse cx={22} cy={93.6} rx={6} ry={3.4} />
          <ellipse cx={77.6} cy={94} rx={6.4} ry={3.4} />
          <ellipse cx={34} cy={97.4} rx={5} ry={2.6} />
          <ellipse cx={66} cy={97.6} rx={5} ry={2.6} />
        </g>
      </g>
    )
  }
  if (look.backpack) {
    return (
      <g>
        <path d="M45.4 36.6 Q50 31 54.6 36.6" fill="none" stroke={darken(c.s, 0.4)} strokeWidth={1.6} strokeLinecap="round" />
        <path
          d="M33.8 40.4 Q33.8 36.2 38 36.2 L62 36.2 Q66.2 36.2 66.2 40.4 L66.8 59.6 Q66.8 62.6 63.8 62.6 L36.2 62.6 Q33.2 62.6 33.2 59.6 Z"
          fill={`url(#${id}k)`}
          stroke={darken(c.s, 0.6)}
          strokeWidth={0.9}
          strokeLinejoin="round"
        />
        <path d="M35 53 L35.2 61 M65 53 L64.8 61" stroke={lighten(c.s, 0.4)} strokeWidth={1} opacity={0.7} />
      </g>
    )
  }
  return null
}

/** Legs and shoes (or nothing for the gown). */
function Bottoms({ look, c }: { look: GirlLook; c: Palette }) {
  if (look.top === 'gown') return null
  const legs = c.pants
  const edge = darken(legs, 0.55)
  const rib = look.top === 'jacket' || look.top === 'track' || look.skirt
  return (
    <g strokeLinejoin="round">
      {[0, 1].map((i) => (
        <g key={i} transform={i === 1 ? MIRROR : undefined}>
          <path d={LEG} fill={legs} stroke={edge} strokeWidth={0.9} />
          <path d="M43 60 C42.4 72 43.4 84 43.6 93" fill="none" stroke={lighten(legs, 0.28)} strokeWidth={1} opacity={0.5} strokeLinecap="round" />
          {rib && <path d="M41.4 62 C41 72 42 84 42.2 93.4" fill="none" stroke={c.neon} strokeWidth={0.9} opacity={0.95} strokeLinecap="round" />}
          <path d={SHOE} fill={look.shoe} stroke={darken(look.shoe, 0.6)} strokeWidth={0.9} />
          <path d={SOLE} fill={look.shoe === '#F8FAFC' ? '#E2E8F0' : '#F8FAFC'} stroke={darken(look.shoe, 0.6)} strokeWidth={0.7} />
          <path d="M41.6 94 L47.6 95.8" stroke={look.shoe === '#F8FAFC' ? c.neon : darken(look.shoe, 0.4)} strokeWidth={1.2} strokeLinecap="round" />
          <path d="M37.4 98.4 H48.4" stroke={c.neon} strokeWidth={0.7} opacity={look.neon === '#F8FAFC' ? 0 : 0.9} />
        </g>
      ))}
      {look.skirt && (
        <g>
          <path d="M39.4 57.6 L60.6 57.6 L65 76 Q50 79.6 35 76 Z" fill={c.s} stroke={darken(c.s, 0.55)} strokeWidth={0.9} />
          <path d="M44.4 58 L42.2 77.4 M50 58 L50 78.6 M55.6 58 L57.8 77.4" fill="none" stroke={lighten(c.s, 0.3)} strokeWidth={0.8} opacity={0.6} />
          <path d="M35.6 75 Q50 78.6 64.4 75" fill="none" stroke={c.neon} strokeWidth={1.2} strokeLinecap="round" />
        </g>
      )}
    </g>
  )
}

/** Torso with all garment details. */
function Torso({ look, c, id }: { look: GirlLook; c: Palette; id: string }) {
  const base = `url(#${id}b)`
  const o = darken(look.top === 'denim' ? c.s : c.p, 0.6)
  const T = 'M40 35 Q50 38.2 60 35 L61.8 48 L61.4 62 Q50 64 38.6 62 L38.2 48 Z'
  const line = { stroke: o, strokeWidth: 0.9, strokeLinejoin: 'round' } as const
  switch (look.top) {
    case 'jacket':
      return (
        <g>
          <clipPath id={`${id}c`}><path d={T} /></clipPath>
          <path d={T} fill={base} />
          <g clipPath={`url(#${id}c)`}>
            <path d="M36 58 L66 43.4 L66 49.8 L36 64 Z" fill={c.s} />
            <path d="M36 58 L66 43.4" stroke={c.neon} strokeWidth={0.8} />
            <path d="M36 64 L66 49.8" stroke={c.neon} strokeWidth={0.5} opacity={0.7} />
            <circle cx={45} cy={46} r={5.6} fill={`url(#${id}n)`} />
          </g>
          <path d={starPath(45, 46, 3.2)} fill="#fff" stroke={c.neon} strokeWidth={0.6} strokeLinejoin="round" />
          <path d={T} fill="none" {...line} />
          <path d="M46.6 35.6 L50 42 L53.4 35.6 Z" fill={c.s} />
          <path d="M50 42 L50 62.6" stroke={darken(c.p, 0.45)} strokeWidth={0.8} />
          <path d="M44.4 33.6 L46.4 39.6 L50 42 L53.6 39.6 L55.6 33.6 Q50 36.2 44.4 33.6 Z" fill={lighten(c.p, 0.5)} stroke={o} strokeWidth={0.8} strokeLinejoin="round" />
          <path d="M45.2 34.8 L46.8 38.4 M54.8 34.8 L53.2 38.4" stroke={c.neon} strokeWidth={0.7} />
        </g>
      )
    case 'bomber': {
      const rib = darken(c.p, 0.28)
      const B = 'M40 35 Q50 38.2 60 35 L62.8 48 L63.2 61 Q50 63.4 36.8 61 L37.2 48 Z'
      return (
        <g>
          <clipPath id={`${id}c`}><path d={B} /></clipPath>
          <path d={B} fill={base} />
          <g clipPath={`url(#${id}c)`}>
            <rect x={34} y={58.2} width={34} height={7} fill={rib} />
            <path d="M39 58.4 V62.4 M42 58.6 V62.8 M45 58.8 V63 M48 58.8 V63.2 M51 58.8 V63.2 M54 58.8 V63 M57 58.6 V62.8 M60 58.4 V62.4" stroke={darken(rib, 0.3)} strokeWidth={0.6} />
            <path d="M36 52.4 Q50 55 64 52.4" stroke={c.neon} strokeWidth={0.9} fill="none" opacity={0.9} />
          </g>
          <path d={B} fill="none" stroke={o} strokeWidth={0.9} strokeLinejoin="round" />
          <path d="M50 41 L50 62" stroke={darken(c.p, 0.45)} strokeWidth={0.8} />
          <path d="M43 34 Q50 41.4 57 34 L55.4 32.8 Q50 37.4 44.6 32.8 Z" fill={rib} stroke={o} strokeWidth={0.8} strokeLinejoin="round" />
          <circle cx={44.6} cy={47.2} r={4.8} fill="#FDE047" stroke={darken('#FDE047', 0.5)} strokeWidth={0.8} />
          <path d={starPath(44.6, 47.2, 3.2)} fill="#fff" stroke={c.p} strokeWidth={0.6} strokeLinejoin="round" />
          <path d="M55 50 L58.6 52" stroke={rib} strokeWidth={0.9} strokeLinecap="round" />
        </g>
      )
    }
    case 'track':
      return (
        <g>
          <clipPath id={`${id}c`}><path d={T} /></clipPath>
          <path d={T} fill={base} />
          <g clipPath={`url(#${id}c)`}>
            <rect x={37} y={34} width={4.4} height={32} fill={c.s} />
            <rect x={58.6} y={34} width={4.4} height={32} fill={c.s} />
            <rect x={36} y={58.4} width={30} height={6} fill={c.s} />
            <path d="M41.4 36 V58.4 M58.6 36 V58.4" stroke={c.neon} strokeWidth={0.6} />
          </g>
          <path d={T} fill="none" {...line} />
          <path d="M44.6 33.6 L46.4 39.6 L50 41.6 L53.6 39.6 L55.4 33.6 Q50 36.2 44.6 33.6 Z" fill={c.s} stroke={c.neon} strokeWidth={0.6} strokeLinejoin="round" />
          <path d="M50 41.6 L50 62" stroke={c.s} strokeWidth={0.9} />
          <path d="M53.4 42.4 L48.8 49.6 L51.8 49.6 L50.2 56 L56 47.2 L52.6 47.2 L54.8 42.4 Z" fill={c.s} stroke={c.neon} strokeWidth={0.7} strokeLinejoin="round" />
        </g>
      )
    case 'gown':
      return (
        <g>
          <path
            d="M40 35 Q50 38.2 60 35 L62 50 C63.6 66 66.4 82 67.8 92.6 Q59 98.4 50 94.4 Q41 98.4 32.2 92.6 C33.6 82 36.4 66 38 50 Z"
            fill={base}
            stroke={o}
            strokeWidth={0.9}
            strokeLinejoin="round"
          />
          <path d="M38.2 53.4 Q50 56.6 61.8 53.4 L62 57 Q50 60.2 38 57 Z" fill={c.s} stroke={darken(c.s, 0.4)} strokeWidth={0.7} strokeLinejoin="round" />
          <path d="M33.2 91.4 Q41 97.4 50 93.6 Q59 97.4 66.8 91.4" fill="none" stroke={c.s} strokeWidth={1.3} strokeLinecap="round" />
          <path d="M43.8 33.6 L46.4 40 L50 41.8 L53.6 40 L56.2 33.6 Q50 36.4 43.8 33.6 Z" fill={c.s} stroke={darken(c.s, 0.4)} strokeWidth={0.7} strokeLinejoin="round" />
          <path d="M52.4 43.4 C48.6 43.8 47 47.6 48.8 50.2 C46.8 49.8 45.2 47.8 45.8 45.4 C46.6 43 49.8 41.8 52.4 43.4 Z" fill="#F1F5F9" stroke="#94A3B8" strokeWidth={0.6} />
          {[
            [44, 68, 1.5],
            [56, 74, 1.3],
            [48, 84, 1.2],
            [60, 64, 1.1],
          ].map(([x, y, r]) => (
            <path key={`${x}${y}`} d={starPath(x, y, r * 1.6, r * 0.5)} fill="#F5F3FF" opacity={0.8} />
          ))}
        </g>
      )
    case 'denim': {
      const tee = c.p
      return (
        <g>
          <path d={T} fill={tee} stroke={darken(tee, 0.55)} strokeWidth={0.9} strokeLinejoin="round" />
          <path d={starPath(50, 49, 3.6)} fill="#fff" opacity={0.95} />
          {[0, 1].map((i) => (
            <g key={i} transform={i === 1 ? MIRROR : undefined}>
              <path d="M40 35 Q43.6 37.2 45.4 37.8 L47 62.4 Q42.6 63 38.6 62 L38.2 48 Z" fill={base} stroke={o} strokeWidth={0.9} strokeLinejoin="round" />
              <path d="M43.8 36.4 L45.6 62.2" stroke={lighten(c.s, 0.55)} strokeWidth={0.6} strokeDasharray="1.2 0.9" />
              <path d="M39.8 44.8 H44.4 V49 L42.1 50.2 L39.8 49 Z" fill={darken(c.s, 0.12)} stroke={o} strokeWidth={0.7} strokeLinejoin="round" />
              <path d="M43.2 33.2 L47.4 40.4 L46.2 42.2 L41.6 36 Z" fill={lighten(c.s, 0.2)} stroke={o} strokeWidth={0.7} strokeLinejoin="round" />
            </g>
          ))}
          <path d="M45.4 34.8 Q50 38 54.6 34.8" fill="none" stroke={darken(tee, 0.5)} strokeWidth={0.8} />
        </g>
      )
    }
    case 'hoodie': {
      const rib = darken(c.p, 0.2)
      return (
        <g>
          <clipPath id={`${id}c`}><path d={T} /></clipPath>
          <path d={T} fill={base} />
          <g clipPath={`url(#${id}c)`}>
            <rect x={36} y={59.2} width={30} height={6} fill={rib} />
            <path d="M42.2 52.6 L57.8 52.6 L60 61 Q50 63 40 61 Z" fill={darken(c.p, 0.1)} />
          </g>
          <path d={T} fill="none" {...line} />
          <path d="M42.6 52.8 L57.4 52.8 L59.8 60.8 M42.6 52.8 L40.2 60.8" fill="none" stroke={o} strokeWidth={0.8} strokeLinejoin="round" />
          <path d="M41.8 33 C40.4 39.2 44.6 43 50 43.4 C55.4 43 59.6 39.2 58.2 33 Q50 38.8 41.8 33 Z" fill={darken(c.p, 0.12)} stroke={o} strokeWidth={0.9} strokeLinejoin="round" />
          <path d="M45.6 40.6 C46.4 44 46 47.4 46 50 M54.4 40.6 C53.6 44 54 47.4 54 50" fill="none" stroke={c.s} strokeWidth={0.95} strokeLinecap="round" />
          <circle cx={46} cy={50.6} r={1} fill={c.s} />
          <circle cx={54} cy={50.6} r={1} fill={c.s} />
          <path d={starPath(50, 46, 2.6)} fill={c.s} opacity={0.95} />
        </g>
      )
    }
    case 'sweater':
    default: {
      const rib = darken(c.p, 0.22)
      const W = 'M40 35 Q50 38.2 60 35 L62.4 48 L63 63 Q50 65.4 37 63 L37.6 48 Z'
      return (
        <g>
          <clipPath id={`${id}c`}><path d={W} /></clipPath>
          <path d={W} fill={base} />
          <g clipPath={`url(#${id}c)`}>
            <rect x={34} y={46.4} width={34} height={2.8} fill={lighten(c.p, 0.6)} />
            <rect x={34} y={51.6} width={34} height={2.8} fill={lighten(c.p, 0.6)} />
            <rect x={34} y={60.4} width={34} height={6} fill={rib} />
          </g>
          <path d={W} fill="none" stroke={o} strokeWidth={0.9} strokeLinejoin="round" />
          <path d="M43.8 33.4 Q50 40.6 56.2 33.4 L54.8 32.6 Q50 37.2 45.2 32.6 Z" fill={rib} stroke={o} strokeWidth={0.8} strokeLinejoin="round" />
          <path d="M44 36 L44.4 58.6 M56 36 L55.6 58.6" stroke={c.s} strokeWidth={2.2} strokeLinecap="round" />
          <path d="M44.2 47.8 H55.8" stroke={c.s} strokeWidth={1.1} />
          <rect x={48.6} y={46.6} width={2.8} height={2.4} rx={0.6} fill={lighten(c.s, 0.5)} stroke={darken(c.s, 0.5)} strokeWidth={0.5} />
        </g>
      )
    }
  }
}

function Face({ look, mood, id }: { look: GirlLook; mood: GirlPose; id: string }) {
  const skinLine = darken(look.skin, 0.5)
  const shade = darken(look.skin, 0.2)
  return (
    <g>
      {/* neck */}
      <path d="M46.8 28.6 L46.6 36 Q50 38 53.4 36 L53.2 28.6 Z" fill={shade} />
      {/* ears */}
      <ellipse cx={38.2} cy={19.4} rx={1.7} ry={2.5} fill={look.skin} stroke={skinLine} strokeWidth={0.7} />
      <ellipse cx={61.8} cy={19.4} rx={1.7} ry={2.5} fill={look.skin} stroke={skinLine} strokeWidth={0.7} />
      {/* face */}
      <path
        d="M50 4.4 C57.6 4.4 62 10.4 62 17.4 C62 25.2 57.2 31.2 50 31.2 C42.8 31.2 38 25.2 38 17.4 C38 10.4 42.4 4.4 50 4.4 Z"
        fill={`url(#${id}s)`}
        stroke={skinLine}
        strokeWidth={0.8}
      />
      <path d="M48.6 22.4 Q50 23.6 51.6 22.4" fill="none" stroke={darken(look.skin, 0.3)} strokeWidth={0.8} strokeLinecap="round" />
      <ellipse cx={42.6} cy={23.2} rx={2.5} ry={1.5} fill="#FF6F91" opacity={look.skin === '#8A5638' ? 0.22 : 0.3} />
      <ellipse cx={57.4} cy={23.2} rx={2.5} ry={1.5} fill="#FF6F91" opacity={look.skin === '#8A5638' ? 0.22 : 0.3} />
      {look.freckles && (
        <g fill="#C26A3E" opacity={0.7}>
          {[[43.6, 21.6], [41.9, 22.8], [45, 23], [56.4, 21.6], [58.1, 22.8], [55, 23], [49, 20.6], [51, 20.8]].map(([x, y]) => (
            <circle key={`${x}${y}`} cx={x} cy={y} r={0.38} />
          ))}
        </g>
      )}
      <g className="stage-blink">
        <GirlEye cx={44.8} cy={18.6} side={-1} mood={mood} look={look} />
        <GirlEye cx={55.2} cy={18.6} side={1} mood={mood} look={look} />
      </g>
      <GirlMouth mood={mood} />
    </g>
  )
}

function Fx({ mood }: { mood: GirlPose }) {
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

function Headset({ look }: { look: GirlLook }) {
  const dark = '#1F2937'
  return (
    <g>
      <path d="M38.8 16 C38 4.2 62 4.2 61.2 16" fill="none" stroke={dark} strokeWidth={1.3} strokeLinecap="round" />
      <path d="M38.6 15.4 C38.4 9 43 5.6 48 5" fill="none" stroke={look.neon} strokeWidth={0.5} opacity={0.9} />
      <ellipse cx={38.2} cy={18.6} rx={2.2} ry={3.1} fill={dark} stroke={look.neon} strokeWidth={0.7} />
      <ellipse cx={38.2} cy={18.6} rx={0.9} ry={1.5} fill={look.neon} />
      <path d="M38.8 21.6 C39 26.6 42.6 28.4 45.4 27.2" fill="none" stroke={dark} strokeWidth={0.9} strokeLinecap="round" />
      <ellipse cx={45.6} cy={27.2} rx={1.7} ry={1.25} fill={look.neon} stroke={dark} strokeWidth={0.6} />
    </g>
  )
}

function Glasses() {
  const frame = '#7A4A1F'
  return (
    <g fill="none" stroke={frame} strokeWidth={0.95}>
      <circle cx={44.8} cy={18.8} r={4.5} fill="#fff" fillOpacity={0.14} />
      <circle cx={55.2} cy={18.8} r={4.5} fill="#fff" fillOpacity={0.14} />
      <path d="M49.3 18.4 Q50 17.6 50.7 18.4" />
      <path d="M40.3 18.2 L38.4 17.6 M59.7 18.2 L61.6 17.6" />
      <path d="M41.8 16.4 Q43 15.4 44.2 15.4" stroke="#fff" strokeWidth={0.7} opacity={0.8} strokeLinecap="round" />
      <path d="M52.2 16.4 Q53.4 15.4 54.6 15.4" stroke="#fff" strokeWidth={0.7} opacity={0.8} strokeLinecap="round" />
    </g>
  )
}

function Crown() {
  return (
    <g strokeLinejoin="round">
      <path d="M41.8 6.2 L42.6 -0.6 L46.4 3 L50 -2.2 L53.6 3 L57.4 -0.6 L58.2 6.2 Q50 8 41.8 6.2 Z" fill="#E5E7EB" stroke="#7C7A99" strokeWidth={0.8} />
      <path d="M42.4 4.8 Q50 6.6 57.6 4.8" fill="none" stroke="#fff" strokeWidth={0.8} opacity={0.9} />
      <circle cx={50} cy={-0.2} r={1.1} fill="#C4B5FD" stroke="#7C5CD6" strokeWidth={0.5} />
      <circle cx={42.6} cy={0.8} r={0.8} fill="#F0ABFC" />
      <circle cx={57.4} cy={0.8} r={0.8} fill="#F0ABFC" />
    </g>
  )
}

export interface GirlProps extends Partial<CharacterProps> {
  look: GirlLookKey
  pose: GirlPose
}

/** The figure itself, 100 x 100 box, no ground shadow. */
export function Girl({ look: key, primary, secondary, pose }: GirlProps) {
  const look = GIRL_LOOKS[key]
  const id = useGid()
  const p = primary ?? look.primary
  const s = secondary ?? look.secondary
  const c: Palette = { p, s, pants: look.pants ?? s, neon: look.neon }
  const sleeveBase = look.top === 'denim' ? s : p
  const cuff = look.top === 'bomber' ? darken(p, 0.28) : look.top === 'track' ? s : look.top === 'gown' ? s : look.top === 'hoodie' ? darken(p, 0.2) : look.top === 'sweater' ? darken(p, 0.22) : look.top === 'jacket' ? s : darken(s, 0.1)
  const stripe = look.top === 'jacket' || look.top === 'track' ? (look.top === 'track' ? s : look.neon) : undefined
  const arms = ARMS[pose]
  const skinLine = darken(look.skin, 0.5)
  const armProps = {
    sleeve: sleeveBase,
    outline: darken(sleeveBase, 0.6),
    cuff,
    skin: look.skin,
    skinLine,
    stripe,
  }
  const waving = pose === 'happy'
  const tiltDeg = pose === 'curious' ? -3 : pose === 'sleepy' ? 3 : 0
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <defs>
        <linearGradient id={`${id}h`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={look.hairLight} />
          <stop offset="0.2" stopColor={look.hair} />
          <stop offset="0.8" stopColor={look.hair} />
          <stop offset="1" stopColor={look.hairShade} />
        </linearGradient>
        <linearGradient id={`${id}y`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={look.hair} />
          <stop offset="0.5" stopColor={look.hair} />
          <stop offset="1" stopColor={look.hairTip ?? look.hairShade} />
        </linearGradient>
        <radialGradient id={`${id}s`} cx="42%" cy="35%" r="75%">
          <stop offset="0" stopColor={lighten(look.skin, 0.35)} />
          <stop offset="0.6" stopColor={look.skin} />
          <stop offset="1" stopColor={darken(look.skin, 0.1)} />
        </radialGradient>
        <linearGradient id={`${id}b`} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor={lighten(look.top === 'denim' ? s : p, look.top === 'jacket' ? 0.6 : 0.3)} />
          <stop offset="0.55" stopColor={look.top === 'denim' ? s : p} />
          <stop offset="1" stopColor={darken(look.top === 'denim' ? s : p, 0.18)} />
        </linearGradient>
        <linearGradient id={`${id}k`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={darken(look.top === 'gown' ? p : s, 0.4)} />
          <stop offset="1" stopColor={mix(look.top === 'gown' ? p : s, '#000000', 0.08)} />
        </linearGradient>
        <radialGradient id={`${id}n`}>
          <stop offset="0" stopColor={look.neon} stopOpacity="0.7" />
          <stop offset="1" stopColor={look.neon} stopOpacity="0" />
        </radialGradient>
      </defs>
      <OutfitBack look={look} c={c} id={id} />
      <HairBack look={look} id={id} />
      <Bottoms look={look} c={c} />
      <Torso look={look} c={c} id={id} />
      <g transform={tiltDeg ? `rotate(${tiltDeg} 50 31)` : undefined}>
        <Face look={look} mood={pose} id={id} />
        <HairFront look={look} id={id} />
        {look.crown && <Crown />}
        {look.hairStyle === 'braids' && (
          <>
            <Braid d="M38.4 18 C36.4 28 36 38 37.4 50" hair={look.hair} light={look.hairLight} />
            <Braid d="M61.6 18 C63.6 28 64 38 62.6 50" hair={look.hair} light={look.hairLight} />
            <circle cx={37.4} cy={51.6} r={1.7} fill={look.neon} stroke={darken(look.neon, 0.5)} strokeWidth={0.5} />
            <circle cx={62.6} cy={51.6} r={1.7} fill={look.neon} stroke={darken(look.neon, 0.5)} strokeWidth={0.5} />
            <circle cx={32.6} cy={45.6} r={1.5} fill={look.neon} stroke={darken(look.neon, 0.5)} strokeWidth={0.5} />
            <circle cx={67.4} cy={45.6} r={1.5} fill={look.neon} stroke={darken(look.neon, 0.5)} strokeWidth={0.5} />
          </>
        )}
        <GirlBrows mood={pose} color={darken(look.hair, look.hair === '#D9CFF2' ? 0.45 : 0.35)} sad={look.sad} />
        {look.glasses && <Glasses />}
        {look.headset && <Headset look={look} />}
      </g>
      {/* arms are in front of the body; a waving hand turns around the shoulder */}
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

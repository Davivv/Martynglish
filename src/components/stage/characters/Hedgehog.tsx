import { darken, lighten, useGid } from '../colors'
import type { CharacterProps } from '../types'
import { Blush, Brows, Eyes, MoodFx, Mouth } from './Face'

/**
 * Pepper (D43): a small hedgehog with golden-brown spikes, a cream face and belly, and
 * rosy pink cheeks (characterVisualAnchor).
 */
export function Hedgehog({ primary, secondary = '#FBCFE8', mood }: CharacterProps) {
  const id = useGid()
  const light = lighten(primary, 0.3)
  const dark = darken(primary, 0.3)
  const outline = darken(primary, 0.6)
  const cream = lighten(primary, 0.82)
  const spikeLines = [
    [27, 48, -18], [22, 62, -8], [21, 78, 4], [29, 92, 16],
    [73, 48, 18], [78, 62, 8], [79, 78, -4], [71, 92, -16],
    [40, 34, -30], [60, 34, 30], [50, 28, 0],
  ] as const
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <defs>
        <radialGradient id={`${id}f`} cx="40%" cy="30%" r="85%">
          <stop offset="0" stopColor={light} />
          <stop offset="0.55" stopColor={primary} />
          <stop offset="1" stopColor={dark} />
        </radialGradient>
      </defs>
      {/* tiny feet */}
      {[36, 64].map((x) => (
        <ellipse key={x} cx={x} cy={97.5} rx={7} ry={4} fill={dark} stroke={outline} strokeWidth={1.3} />
      ))}
      {/* round spiky body */}
      <path d="M20 93 C12 70 24 52 50 50 C76 52 88 70 80 93 C68 100 32 100 20 93 Z" fill={`url(#${id}f)`} stroke={outline} strokeWidth={1.8} />
      {/* spikes: small dark strokes over the back */}
      <g stroke={outline} strokeWidth={2.4} fill="none" opacity={0.75}>
        {spikeLines.map(([x, y, r]) => (
          <path key={`${x}-${y}`} d={`M${x} ${y} l0 -8`} transform={`rotate(${r} ${x} ${y})`} />
        ))}
      </g>
      {/* round ears peeking through the spikes */}
      <circle cx={31} cy={44} r={7.5} fill={`url(#${id}f)`} stroke={outline} strokeWidth={1.6} />
      <circle cx={69} cy={44} r={7.5} fill={`url(#${id}f)`} stroke={outline} strokeWidth={1.6} />
      <circle cx={31} cy={44.6} r={3.6} fill={secondary} />
      <circle cx={69} cy={44.6} r={3.6} fill={secondary} />
      {/* cream face with a pointed snout */}
      <path
        d="M50 36 C66 36 76 48 74 60 C76 72 62 82 50 82 C38 82 24 72 26 60 C24 48 34 36 50 36 Z"
        fill={cream}
        stroke={outline}
        strokeWidth={1.6}
      />
      <path d="M44 70 Q50 80 56 70 Q58 73 56 76 Q50 81 44 76 Q42 73 44 70 Z" fill={cream} stroke={outline} strokeWidth={1.2} />
      <ellipse cx={50} cy={72.5} rx={3} ry={2.2} fill="#2a1a33" />
      <ellipse cx={48.8} cy={71.8} rx={0.9} ry={0.5} fill="#fff" opacity={0.7} />
      <Mouth x={50} y={75.5} w={4} mood={mood} />
      <Eyes x1={40} x2={60} y={58} r={6.4} mood={mood} lid={cream} />
      <Brows x1={40} x2={60} y={47} w={7.4} mood={mood} color={outline} />
      <Blush x1={32} x2={68} y={64} r={5} />
      <MoodFx mood={mood} />
    </g>
  )
}

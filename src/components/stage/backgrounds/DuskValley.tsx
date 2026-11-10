import { useGid } from '../colors'
import { DriftCloud, H, W } from './shared'

/** Scattered fireflies in the grass: [x, y, twinkle delay]. */
const AMBIENT_FIREFLIES = [
  [50, 182, 0.2], [340, 190, 0.9], [20, 206, 1.5], [372, 168, 0.6], [150, 200, 1.1], [260, 212, 0.3],
] as const

/**
 * Twinkle Hollow (D43): a valley at warm, magical dusk. Deep lavender high up fades into
 * gold near the horizon, with soft rolling hills and a scatter of tiny fireflies in the grass.
 */
export function DuskValley() {
  const id = useGid()
  return (
    <g>
      <defs>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3B2E6E" />
          <stop offset="0.45" stopColor="#7A5FA8" />
          <stop offset="0.75" stopColor="#E99A4E" />
          <stop offset="1" stopColor="#FBBF24" />
        </linearGradient>
        <linearGradient id={`${id}h1`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8D6BAE" />
          <stop offset="1" stopColor="#5B4486" />
        </linearGradient>
        <linearGradient id={`${id}h2`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6B4F94" />
          <stop offset="1" stopColor="#3E2E64" />
        </linearGradient>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4C3A74" />
          <stop offset="1" stopColor="#2A2050" />
        </linearGradient>
        <radialGradient id={`${id}a`} cx="50%" cy="80%" r="75%">
          <stop offset="0" stopColor="#FDE68A" stopOpacity="0.55" />
          <stop offset="1" stopColor="#FDE68A" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id}s)`} />
      <ellipse cx={200} cy={150} rx={240} ry={100} fill={`url(#${id}a)`} />
      <DriftCloud y={34} scale={1} duration={95} delay={-18} opacity={0.3} tint="#F3D9B1" />
      <DriftCloud y={58} scale={0.7} duration={120} delay={-70} opacity={0.22} tint="#F3D9B1" />
      {/* far hills */}
      <path d="M0 128 C50 104 110 112 170 128 C220 142 270 108 330 114 C360 118 385 124 400 120 V240 H0 Z" fill={`url(#${id}h1)`} />
      {/* near hills */}
      <path d="M0 154 C60 134 130 142 190 150 C260 158 330 132 400 142 V240 H0 Z" fill={`url(#${id}h2)`} />
      {/* ground */}
      <path d="M0 176 C80 164 160 172 240 168 C310 164 360 170 400 166 V240 H0 Z" fill={`url(#${id}g)`} />
      {AMBIENT_FIREFLIES.map(([x, y, delay], i) => (
        <circle key={`${x}-${y}`} className="stage-twinkle" style={{ animationDelay: `${delay}s` }} cx={x} cy={y} r={i % 2 === 0 ? 1.6 : 1.2} fill="#FFE9A8" />
      ))}
    </g>
  )
}

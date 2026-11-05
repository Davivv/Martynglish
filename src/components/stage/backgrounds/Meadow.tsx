import { useGid } from '../colors'
import { DriftCloud, H, W } from './shared'

const TUFTS = [
  [40, 205], [95, 188], [150, 226], [250, 222], [322, 196], [372, 214], [20, 170], [380, 168], [118, 168], [300, 170],
]

/** Sunny meadow: blue sky, rolling green hills, tufts of grass, a distant fence. */
export function Meadow() {
  const id = useGid()
  return (
    <g>
      <defs>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#56B7F2" />
          <stop offset="0.6" stopColor="#A9DDFB" />
          <stop offset="1" stopColor="#E4F6FF" />
        </linearGradient>
        <linearGradient id={`${id}h1`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9BDB7B" />
          <stop offset="1" stopColor="#6FC25F" />
        </linearGradient>
        <linearGradient id={`${id}h2`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7BD267" />
          <stop offset="1" stopColor="#3FA24A" />
        </linearGradient>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6BCB5A" />
          <stop offset="1" stopColor="#3C9C45" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id}s)`} />
      <DriftCloud y={44} scale={1.1} duration={70} delay={-12} />
      <DriftCloud y={78} scale={0.8} duration={90} delay={-55} opacity={0.45} />
      <DriftCloud y={30} scale={0.7} duration={110} delay={-85} opacity={0.4} />
      {/* far hills */}
      <path d="M0 126 C40 100 90 104 140 122 C190 138 230 100 290 104 C340 108 370 120 400 112 V240 H0 Z" fill={`url(#${id}h1)`} />
      <path d="M0 128 C40 104 90 108 140 124" fill="none" stroke="#C8F0B0" strokeWidth={2} opacity={0.6} />
      {/* fence */}
      <g stroke="#E9D9B8" strokeWidth={2.2} strokeLinecap="round" opacity={0.9}>
        <path d="M232 128 H296 M232 135 H296" />
        {[236, 250, 264, 278, 292].map((x) => (
          <path key={x} d={`M${x} 124 V140`} />
        ))}
      </g>
      {/* near hill */}
      <path d="M0 150 C60 132 120 138 190 146 C260 154 330 130 400 140 V240 H0 Z" fill={`url(#${id}h2)`} />
      <path d="M0 150 C60 132 120 138 190 146 C260 154 330 130 400 140" fill="none" stroke="#B7EE9C" strokeWidth={2.4} opacity={0.7} />
      {/* foreground */}
      <path d="M0 170 C80 160 160 168 240 164 C310 160 360 166 400 162 V240 H0 Z" fill={`url(#${id}g)`} />
      {TUFTS.map(([x, y]) => (
        <g key={`${x}-${y}`} stroke="#2E8240" strokeWidth={1.8} strokeLinecap="round" fill="none" opacity={0.75}>
          <path d={`M${x} ${y} q-2 -7 -5 -9 M${x} ${y} q0 -8 0 -11 M${x} ${y} q2 -7 5 -9`} />
        </g>
      ))}
    </g>
  )
}

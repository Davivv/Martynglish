import { useGid } from '../colors'
import { DriftCloud, H, W } from './shared'

const SPRINKLES = [
  [30, 40, 20, '#FF6FA3'], [90, 60, -30, '#6AD1C4'], [150, 30, 60, '#FFD43B'], [210, 70, 10, '#8B7CF6'],
  [270, 36, -50, '#FF8A5C'], [330, 62, 30, '#FF6FA3'], [380, 34, -15, '#6AD1C4'], [60, 94, 45, '#FFD43B'],
  [180, 100, -20, '#FF6FA3'], [310, 98, 70, '#8B7CF6'],
] as const

/** Ice cream parlour: candy-coloured sky with sprinkles, wavy cream hills and a tiled floor. */
export function IceCreamShop() {
  const id = useGid()
  return (
    <g>
      <defs>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFC2DC" />
          <stop offset="0.6" stopColor="#FFE3EE" />
          <stop offset="1" stopColor="#CFF5EA" />
        </linearGradient>
        <linearGradient id={`${id}c`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFDF7" />
          <stop offset="1" stopColor="#FFE9D2" />
        </linearGradient>
        <linearGradient id={`${id}m`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#A6EBD3" />
          <stop offset="1" stopColor="#75D4B8" />
        </linearGradient>
        <pattern id={`${id}t`} width={40} height={20} patternUnits="userSpaceOnUse" patternTransform="translate(0 150)">
          <rect width={40} height={20} fill="#FFF7FB" />
          <rect width={20} height={10} fill="#FFD3E4" />
          <rect x={20} y={10} width={20} height={10} fill="#FFD3E4" />
        </pattern>
      </defs>
      <rect width={W} height={H} fill={`url(#${id}s)`} />
      <DriftCloud y={44} scale={1} duration={80} delay={-25} tint="#FFF9FC" />
      <DriftCloud y={86} scale={0.7} duration={100} delay={-65} opacity={0.45} tint="#FFF9FC" />
      {SPRINKLES.map(([x, y, r, c]) => (
        <rect key={`${x}-${y}`} x={x - 5} y={y - 1.5} width={10} height={3} rx={1.5} fill={c} transform={`rotate(${r} ${x} ${y})`} opacity={0.85} />
      ))}
      {/* mint wavy hills */}
      <path d="M0 122 C30 106 60 106 90 120 C120 134 150 134 180 118 C210 102 250 104 280 120 C310 134 350 130 400 112 V240 H0 Z" fill={`url(#${id}m)`} />
      {/* cream waves with drips */}
      <path d="M0 136 C25 128 50 130 75 138 C100 146 125 146 150 138 C175 130 200 130 225 138 C250 146 275 146 300 138 C325 130 350 130 375 136 L400 140 V240 H0 Z" fill={`url(#${id}c)`} />
      <path d="M0 136 C25 128 50 130 75 138 C100 146 125 146 150 138 C175 130 200 130 225 138 C250 146 275 146 300 138 C325 130 350 130 375 136 L400 140" fill="none" stroke="#FFFFFF" strokeWidth={2.4} />
      <g fill="#FFFDF7">
        <path d="M60 142 v8 a3 3 0 0 0 6 0 v-8 Z M170 138 v11 a3.4 3.4 0 0 0 6.8 0 v-11 Z M290 142 v7 a3 3 0 0 0 6 0 v-7 Z" />
      </g>
      {/* tiled floor */}
      <rect y={152} width={W} height={88} fill={`url(#${id}t)`} />
      <path d="M0 152 H400" stroke="#F3A9C5" strokeWidth={2} />
    </g>
  )
}

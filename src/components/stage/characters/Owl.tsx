import { darken, lighten, useGid } from '../colors'
import type { CharacterProps } from '../types'
import { Blush, Brows, Eyes, MoodFx } from './Face'

/**
 * Juniper (D43): a young owl with soft lavender-grey feathers, a pale chest and big round
 * eyes, perched with folded wings (characterVisualAnchor).
 */
export function Owl({ primary, secondary = '#F8FAFC', mood }: CharacterProps) {
  const id = useGid()
  const light = lighten(primary, 0.32)
  const dark = darken(primary, 0.3)
  const outline = darken(primary, 0.58)
  const chest = lighten(secondary, 0.1)
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <defs>
        <radialGradient id={`${id}f`} cx="38%" cy="26%" r="85%">
          <stop offset="0" stopColor={light} />
          <stop offset="0.55" stopColor={primary} />
          <stop offset="1" stopColor={dark} />
        </radialGradient>
      </defs>
      {/* feet */}
      {[41, 59].map((x) => (
        <g key={x} stroke="#D97706" strokeWidth={1.6} fill="none">
          <path d={`M${x} 95 v4 M${x} 99 l-3 2 M${x} 99 l3 2`} />
        </g>
      ))}
      {/* folded wings at the sides */}
      <path d="M22 95 C14 82 16 64 28 58 C22 72 23 86 30 96 Z" fill={`url(#${id}f)`} stroke={outline} strokeWidth={1.7} />
      <path d="M78 95 C86 82 84 64 72 58 C78 72 77 86 70 96 Z" fill={`url(#${id}f)`} stroke={outline} strokeWidth={1.7} />
      <g fill="none" stroke={dark} strokeWidth={1} opacity={0.5}>
        <path d="M24 86 C21 80 21 74 23 68 M27 90 C25 83 25 77 27 70" />
        <path d="M76 86 C79 80 79 74 77 68 M73 90 C75 83 75 77 73 70" />
      </g>
      {/* round body */}
      <path d="M25 99 C17 76 30 60 50 60 C70 60 83 76 75 99 Z" fill={`url(#${id}f)`} stroke={outline} strokeWidth={1.8} />
      {/* chest feathers (chevron texture) */}
      <path d="M36 98 C32 82 38 68 50 68 C62 68 68 82 64 98 Z" fill={chest} />
      <g fill="none" stroke={darken(chest, 0.12)} strokeWidth={1.1} opacity={0.65}>
        <path d="M40 76 Q50 80 60 76 M39 84 Q50 89 61 84 M39 92 Q50 97 61 92" />
      </g>
      {/* ear tufts */}
      <path d="M31 18 C26 8 32 4 36 13 C35 17 34 21 33 25 Z" fill={`url(#${id}f)`} stroke={outline} strokeWidth={1.6} />
      <path d="M69 18 C74 8 68 4 64 13 C65 17 66 21 67 25 Z" fill={`url(#${id}f)`} stroke={outline} strokeWidth={1.6} />
      {/* big round head with a pale facial disc */}
      <path
        d="M50 13 C70 13 80 27 79 41 C81 54 68 65 50 65 C32 65 19 54 21 41 C20 27 30 13 50 13 Z"
        fill={`url(#${id}f)`}
        stroke={outline}
        strokeWidth={1.8}
      />
      <path
        d="M50 22 C63 22 71 31 70 42 C71 51 61 58 50 58 C39 58 29 51 30 42 C29 31 37 22 50 22 Z"
        fill={lighten(secondary, 0.25)}
        opacity={0.9}
      />
      {/* small hooked beak */}
      <path d="M46 46 Q50 51 54 46 Q50 55 46 46 Z" fill="#F59E0B" stroke="#B45309" strokeWidth={1} />
      <Eyes x1={40} x2={60} y={37} r={9.4} mood={mood} lid={primary} ring={lighten(secondary, 0.3)} />
      <Brows x1={40} x2={60} y={23} w={9} mood={mood} color={outline} />
      <Blush x1={30} x2={70} y={48} r={3.6} />
      <MoodFx mood={mood} />
    </g>
  )
}

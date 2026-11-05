import { darken, lighten, useGid } from '../colors'
import type { CharacterProps } from '../types'
import { Blush, Brows, Eyes, MoodFx, Mouth } from './Face'

/** Golden puppy with floppy ears and a red collar (SPEC section 6). */
export function Dog({ primary, secondary = '#E11D48', mood }: CharacterProps) {
  const id = useGid()
  const light = lighten(primary, 0.3)
  const dark = darken(primary, 0.3)
  const outline = darken(primary, 0.6)
  const cream = lighten(primary, 0.78)
  const collarDark = darken(secondary, 0.4)
  const open = mood === 'excited' || mood === 'happy'
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <defs>
        <radialGradient id={`${id}f`} cx="40%" cy="30%" r="80%">
          <stop offset="0" stopColor={light} />
          <stop offset="0.55" stopColor={primary} />
          <stop offset="1" stopColor={dark} />
        </radialGradient>
        <linearGradient id={`${id}e`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={darken(primary, 0.05)} />
          <stop offset="1" stopColor={darken(primary, 0.38)} />
        </linearGradient>
        <linearGradient id={`${id}c`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={lighten(secondary, 0.35)} />
          <stop offset="1" stopColor={secondary} />
        </linearGradient>
      </defs>
      {/* wagging tail */}
      <g className="stage-wag" style={{ transformOrigin: '74px 90px' }}>
        <path d="M74 92 C92 94 98 76 92 62" fill="none" stroke={outline} strokeWidth={10} />
        <path d="M74 92 C92 94 98 76 92 62" fill="none" stroke={primary} strokeWidth={7} />
        <path d="M92 66 C91 62 92 60 93 60" fill="none" stroke={cream} strokeWidth={7} />
      </g>
      {/* body */}
      <path d="M24 99 C19 78 30 62 50 62 C70 62 81 78 76 99 Z" fill={`url(#${id}f)`} stroke={outline} strokeWidth={1.8} />
      <path d="M38 99 C34 84 40 72 50 72 C60 72 66 84 62 99 Z" fill={cream} opacity={0.9} />
      {/* front legs and paws */}
      {[39, 61].map((x) => (
        <g key={x}>
          <path d={`M${x - 6} 84 L${x - 7} 95 Q${x - 8} 100 ${x} 100 Q${x + 8} 100 ${x + 7} 95 L${x + 6} 84 Z`} fill={light} stroke={outline} strokeWidth={1.6} />
          <path d={`M${x - 3} 95.5 v3.5 M${x + 3} 95.5 v3.5`} stroke={outline} strokeWidth={1} opacity={0.55} fill="none" />
        </g>
      ))}
      {/* floppy ears (behind head edge) */}
      <path d="M26 20 C8 18 4 50 11 62 C19 68 29 56 31 38 Z" fill={`url(#${id}e)`} stroke={outline} strokeWidth={1.8} />
      <path d="M74 20 C92 18 96 50 89 62 C81 68 71 56 69 38 Z" fill={`url(#${id}e)`} stroke={outline} strokeWidth={1.8} />
      <path d="M17 28 C12 40 13 52 15 58" fill="none" stroke={lighten(primary, 0.25)} strokeWidth={1.8} opacity={0.6} />
      <path d="M83 28 C88 40 87 52 85 58" fill="none" stroke={lighten(primary, 0.25)} strokeWidth={1.8} opacity={0.6} />
      {/* head */}
      <path
        d="M50 11 C72 11 82 24 81 38 C84 52 72 64 50 64 C28 64 16 52 19 38 C18 24 28 11 50 11 Z"
        fill={`url(#${id}f)`}
        stroke={outline}
        strokeWidth={1.8}
      />
      {/* eye patch */}
      <ellipse cx={36} cy={33} rx={11} ry={9.5} fill={darken(primary, 0.28)} opacity={0.55} transform="rotate(-18 36 33)" />
      {/* blaze */}
      <path d="M50 12 C45 24 46 36 50 40 C54 36 55 24 50 12 Z" fill={cream} opacity={0.75} />
      {/* collar */}
      <path d="M29 61 Q50 72 71 61 L72 67.5 Q50 79 28 67.5 Z" fill={`url(#${id}c)`} stroke={collarDark} strokeWidth={1.4} />
      <circle cx={50} cy={74.5} r={4.3} fill="#FFD43B" stroke="#B88400" strokeWidth={1.1} />
      <path d="M48.3 74.5 h3.4 M50 72.8 v3.4" stroke="#B88400" strokeWidth={0.9} />
      {/* muzzle */}
      <path d="M50 41 C60 41 67 46 66 53 C65 60 58 62 50 62 C42 62 35 60 34 53 C33 46 40 41 50 41 Z" fill={cream} stroke={darken(primary, 0.35)} strokeWidth={0.8} opacity={0.97} />
      {open && mood !== 'excited' && <path d="M46 56 Q50 66 54 56 Z" fill="#FF7A93" stroke={outline} strokeWidth={1.2} />}
      <Mouth x={50} y={54} w={5.8} mood={mood} />
      <path d="M43.5 43 C43.5 40 56.5 40 56.5 43 C56.5 47.5 52 49 50 49 C48 49 43.5 47.5 43.5 43 Z" fill="#3a2430" stroke="#1d1020" strokeWidth={0.8} />
      <ellipse cx={47.5} cy={42.6} rx={2.1} ry={1.1} fill="#fff" opacity={0.7} />
      <path d="M50 49 V51.5" stroke={outline} strokeWidth={1.2} fill="none" />
      <Eyes x1={37} x2={63} y={33.5} r={7.4} mood={mood} lid={primary} />
      <Brows x1={37} x2={63} y={21.5} w={8} mood={mood} color={darken(primary, 0.5)} />
      <Blush x1={26} x2={74} y={47} r={4.8} />
      <MoodFx mood={mood} />
    </g>
  )
}

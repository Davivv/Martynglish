import { darken, lighten, useGid } from '../colors'
import type { CharacterProps } from '../types'
import { Blush, Brows, Eyes, MoodFx, Mouth } from './Face'

/**
 * Nova (D43): a little fox cub with warm rust fur, a cream chest and muzzle, and a bushy
 * tail that sparkles like tiny stars when she is happy or excited (characterVisualAnchor).
 */
export function Fox({ primary, secondary = '#FEF08A', mood }: CharacterProps) {
  const id = useGid()
  const light = lighten(primary, 0.3)
  const dark = darken(primary, 0.3)
  const outline = darken(primary, 0.6)
  const cream = lighten(primary, 0.8)
  const tip = lighten(secondary, 0.3)
  const sparkly = mood === 'happy' || mood === 'excited'
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <defs>
        <radialGradient id={`${id}f`} cx="40%" cy="30%" r="80%">
          <stop offset="0" stopColor={light} />
          <stop offset="0.55" stopColor={primary} />
          <stop offset="1" stopColor={dark} />
        </radialGradient>
      </defs>
      {/* bushy tail with a cream tip, curling up beside the body */}
      <g className="stage-tail" style={{ transformOrigin: '80px 90px' }}>
        <path d="M68 93 C92 98 106 78 97 56 C110 64 110 92 85 98 C77 99.6 71 97 68 93 Z" fill={`url(#${id}f)`} stroke={outline} strokeWidth={1.8} />
        <path d="M97 56 C101 47 98 40 92 42 C96 48 95 53 91 58 Z" fill={tip} stroke={outline} strokeWidth={1.4} />
        {sparkly && (
          <g fill="#FFF6CC" stroke="#E8A400" strokeWidth={0.5}>
            <path className="stage-twinkle" d="M89 62 l1.4 3.1 l3.1 1.4 l-3.1 1.4 l-1.4 3.1 l-1.4 -3.1 l-3.1 -1.4 l3.1 -1.4 z" />
            <path className="stage-twinkle" style={{ animationDelay: '0.6s' }} d="M98 79 l1 2.4 l2.4 1 l-2.4 1 l-1 2.4 l-1 -2.4 l-2.4 -1 l2.4 -1 z" />
          </g>
        )}
      </g>
      {/* body */}
      <path d="M24 99 C19 78 30 62 50 62 C70 62 81 78 76 99 Z" fill={`url(#${id}f)`} stroke={outline} strokeWidth={1.8} />
      <path d="M38 99 C34 83 40 72 50 72 C60 72 66 83 62 99 Z" fill={cream} opacity={0.9} />
      {/* front paws */}
      {[39, 61].map((x) => (
        <g key={x}>
          <path d={`M${x - 6} 84 L${x - 7} 95 Q${x - 8} 100 ${x} 100 Q${x + 8} 100 ${x + 7} 95 L${x + 6} 84 Z`} fill={light} stroke={outline} strokeWidth={1.6} />
          <path d={`M${x - 3} 95.5 v3.5 M${x + 3} 95.5 v3.5`} stroke={outline} strokeWidth={1} opacity={0.55} fill="none" />
        </g>
      ))}
      {/* pointed ears, dark tips */}
      <path d="M23 29 C16 9 31 1 37 15 C34 23 30 31 29 39 Z" fill={`url(#${id}f)`} stroke={outline} strokeWidth={1.8} />
      <path d="M77 29 C84 9 69 1 63 15 C66 23 70 31 71 39 Z" fill={`url(#${id}f)`} stroke={outline} strokeWidth={1.8} />
      <path d="M26 25 C22 13 29 8 32 14 C30 20 28 25 27 31 Z" fill={cream} />
      <path d="M74 25 C78 13 71 8 68 14 C70 20 72 25 73 31 Z" fill={cream} />
      {/* head with a narrower, pointed muzzle */}
      <path
        d="M50 13 C70 13 81 26 79 39 C83 51 71 64 50 64 C29 64 17 51 21 39 C19 26 30 13 50 13 Z"
        fill={`url(#${id}f)`}
        stroke={outline}
        strokeWidth={1.8}
      />
      <path d="M50 39 C59 39 66 45 64 52 C62 59 56 63 50 63 C44 63 38 59 36 52 C34 45 41 39 50 39 Z" fill={cream} stroke={darken(primary, 0.35)} strokeWidth={0.8} opacity={0.97} />
      <ellipse cx={50} cy={53.5} rx={3.2} ry={2.3} fill="#2a1a33" />
      <ellipse cx={48.6} cy={52.8} rx={1} ry={0.6} fill="#fff" opacity={0.7} />
      <Mouth x={50} y={57.5} w={5} mood={mood} />
      <Eyes x1={37} x2={63} y={34} r={7.2} mood={mood} lid={primary} />
      <Brows x1={37} x2={63} y={22} w={8} mood={mood} color={darken(primary, 0.5)} />
      <Blush x1={27} x2={73} y={47} r={4.4} />
      <MoodFx mood={mood} />
    </g>
  )
}

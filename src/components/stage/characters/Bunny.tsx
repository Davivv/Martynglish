import { darken, lighten, useGid } from '../colors'
import type { CharacterProps } from '../types'
import { Blush, Brows, Eyes, MoodFx, Mouth } from './Face'

/** Fluffy bunny with long ears, one slightly bent, and a little flower. */
export function Bunny({ primary, secondary = '#F472B6', mood }: CharacterProps) {
  const id = useGid()
  const light = lighten(primary, 0.4)
  const dark = darken(primary, 0.28)
  const outline = darken(primary, 0.58)
  const cream = lighten(primary, 0.8)
  const petal = lighten(secondary, 0.1)
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <defs>
        <radialGradient id={`${id}f`} cx="40%" cy="30%" r="85%">
          <stop offset="0" stopColor={light} />
          <stop offset="0.55" stopColor={primary} />
          <stop offset="1" stopColor={dark} />
        </radialGradient>
      </defs>
      {/* fluffy tail peeking out */}
      <circle cx={80} cy={93} r={7} fill={cream} stroke={outline} strokeWidth={1.4} />
      {/* ears */}
      <g className="stage-ear" style={{ transformOrigin: '38px 40px' }}>
        <path d="M38 42 C28 30 24 12 30 6 C38 2 44 22 44 42 Z" fill={`url(#${id}f)`} stroke={outline} strokeWidth={1.8} />
        <path d="M37 38 C31 28 29 15 32 11 C37 9 40 24 40 38 Z" fill="#FFB3C7" />
      </g>
      <g>
        <path d="M62 42 C72 28 80 14 74 5 C66 1 56 20 56 42 Z" fill={`url(#${id}f)`} stroke={outline} strokeWidth={1.8} />
        <path d="M63 38 C69 28 73 16 71 11 C65 9 60 24 60 38 Z" fill="#FFB3C7" />
      </g>
      {/* body */}
      <path d="M23 99 C18 80 29 63 50 63 C71 63 82 80 77 99 Z" fill={`url(#${id}f)`} stroke={outline} strokeWidth={1.8} />
      <ellipse cx={50} cy={85} rx={14} ry={12} fill={cream} opacity={0.85} />
      {/* feet and paws */}
      {[33, 67].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy={96.5} rx={12} ry={5.6} fill={light} stroke={outline} strokeWidth={1.6} />
          <path d={`M${x - 4} 94.5 v3.5 M${x} 94.5 v3.5 M${x + 4} 94.5 v3.5`} stroke={outline} strokeWidth={0.9} opacity={0.55} fill="none" />
        </g>
      ))}
      {[40, 60].map((x) => (
        <ellipse key={x} cx={x} cy={80} rx={5.2} ry={6.4} fill={light} stroke={outline} strokeWidth={1.5} />
      ))}
      {/* head */}
      <path
        d="M50 28 C72 28 82 40 81 52 C85 62 72 72 50 72 C28 72 15 62 19 52 C18 40 28 28 50 28 Z"
        fill={`url(#${id}f)`}
        stroke={outline}
        strokeWidth={1.8}
      />
      <path d="M16 56 q-5 4 0 8 q-1 -4 4 -4 Z M84 56 q5 4 0 8 q1 -4 -4 -4 Z" fill={light} stroke={outline} strokeWidth={1.2} />
      {/* flower on the bent ear */}
      <g transform="translate(34 24)">
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse key={a} cx={0} cy={-3.6} rx={2.5} ry={3.4} fill={petal} stroke={darken(secondary, 0.35)} strokeWidth={0.7} transform={`rotate(${a})`} />
        ))}
        <circle r={2} fill="#FFD43B" stroke="#C99700" strokeWidth={0.6} />
      </g>
      {/* muzzle */}
      <ellipse cx={50} cy={58} rx={14} ry={10} fill={cream} />
      <path d="M46 50.5 Q50 48.5 54 50.5 Q53 55 50 55.5 Q47 55 46 50.5 Z" fill="#FF7FA6" stroke={outline} strokeWidth={0.8} />
      <path d="M50 55.5 V57.5" stroke={outline} strokeWidth={1.2} fill="none" />
      <Mouth x={50} y={58.2} w={4.4} mood={mood} cat />
      {(mood === 'happy' || mood === 'curious') && (
        <path d="M47.2 61.3 v3.8 q2.8 1 5.6 0 v-3.8 Z M50 61.5 v3.4" fill="#fff" stroke={outline} strokeWidth={0.9} />
      )}
      <g stroke={lighten(primary, 0.8)} strokeWidth={0.9} fill="none">
        <path d="M37 56 L20 53 M37 59 L19 60 M38 62 L22 67" />
        <path d="M63 56 L80 53 M63 59 L81 60 M62 62 L78 67" />
      </g>
      <Eyes x1={36.5} x2={63.5} y={48.5} r={7.4} mood={mood} lid={primary} />
      <Brows x1={36.5} x2={63.5} y={37} w={8.5} mood={mood} color={outline} />
      <Blush x1={26} x2={74} y={57} r={4.4} />
      <MoodFx mood={mood} />
    </g>
  )
}

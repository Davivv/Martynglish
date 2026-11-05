import { darken, lighten, useGid } from '../colors'
import type { CharacterProps } from '../types'
import { Blush, Brows, Eyes, MoodFx, Mouth } from './Face'

const BLACK = '#2b2433'
const BLACK_LIGHT = '#4a4056'

/** Panda with a scarf in the story colour and a bamboo stalk. */
export function Panda({ primary, mood }: CharacterProps) {
  const id = useGid()
  const scarf = primary
  const scarfDark = darken(primary, 0.35)
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <defs>
        <radialGradient id={`${id}w`} cx="40%" cy="30%" r="85%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.7" stopColor="#F6F3FA" />
          <stop offset="1" stopColor="#D9D2E4" />
        </radialGradient>
        <radialGradient id={`${id}k`} cx="35%" cy="30%" r="85%">
          <stop offset="0" stopColor={BLACK_LIGHT} />
          <stop offset="1" stopColor={BLACK} />
        </radialGradient>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={lighten(scarf, 0.3)} />
          <stop offset="1" stopColor={scarf} />
        </linearGradient>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7BD389" />
          <stop offset="0.5" stopColor="#4CAF62" />
          <stop offset="1" stopColor="#2F8A4B" />
        </linearGradient>
      </defs>
      {/* bamboo */}
      <g className="stage-sway" style={{ transformOrigin: '90px 99px' }}>
        <rect x={87} y={32} width={6} height={67} rx={2.5} fill={`url(#${id}b)`} stroke="#216A3A" strokeWidth={1.3} />
        {[44, 58, 72, 86].map((y) => (
          <path key={y} d={`M86.5 ${y} h7`} stroke="#216A3A" strokeWidth={1.5} />
        ))}
        <path d="M93 46 C100 40 104 42 106 38 C100 36 95 40 93 46 Z" fill="#6ACB7E" stroke="#216A3A" strokeWidth={1} />
        <path d="M87 60 C80 54 76 56 73 52 C79 49 85 53 87 60 Z" fill="#6ACB7E" stroke="#216A3A" strokeWidth={1} />
        <path d="M93 34 C99 28 103 28 105 24 C99 23 94 28 93 34 Z" fill="#8BDD9A" stroke="#216A3A" strokeWidth={1} />
      </g>
      {/* legs */}
      {[33, 67].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy={93} rx={13} ry={9} fill={`url(#${id}k)`} stroke={BLACK} strokeWidth={1.6} />
          <ellipse cx={x} cy={96.5} rx={7} ry={4} fill="#8c7f9c" />
          {[-4, 0, 4].map((d) => (
            <circle key={d} cx={x + d} cy={93.5} r={1.5} fill="#8c7f9c" />
          ))}
        </g>
      ))}
      {/* body */}
      <path d="M22 97 C16 78 28 62 50 62 C72 62 84 78 78 97 C68 102 32 102 22 97 Z" fill={`url(#${id}w)`} stroke={BLACK} strokeWidth={1.8} />
      <ellipse cx={50} cy={84} rx={14} ry={11} fill="#ffffff" opacity={0.6} />
      {/* arms */}
      <path d="M26 66 C14 72 14 90 22 92 C30 92 33 80 33 70 Z" fill={`url(#${id}k)`} stroke={BLACK} strokeWidth={1.6} />
      <path d="M74 66 C86 72 86 90 78 92 C70 92 67 80 67 70 Z" fill={`url(#${id}k)`} stroke={BLACK} strokeWidth={1.6} />
      {/* ears */}
      <circle cx={24} cy={19} r={10.5} fill={`url(#${id}k)`} stroke={BLACK} strokeWidth={1.6} />
      <circle cx={76} cy={19} r={10.5} fill={`url(#${id}k)`} stroke={BLACK} strokeWidth={1.6} />
      <ellipse cx={24} cy={20} rx={5} ry={4.5} fill="#7a6d8a" />
      <ellipse cx={76} cy={20} rx={5} ry={4.5} fill="#7a6d8a" />
      {/* head */}
      <path
        d="M50 11 C72 11 85 24 84 40 C87 53 74 65 50 65 C26 65 13 53 16 40 C15 24 28 11 50 11 Z"
        fill={`url(#${id}w)`}
        stroke={BLACK}
        strokeWidth={1.8}
      />
      {/* eye patches */}
      <ellipse cx={34.5} cy={37} rx={10} ry={12.5} fill={`url(#${id}k)`} transform="rotate(24 34.5 37)" />
      <ellipse cx={65.5} cy={37} rx={10} ry={12.5} fill={`url(#${id}k)`} transform="rotate(-24 65.5 37)" />
      {/* nose and muzzle */}
      <ellipse cx={50} cy={50} rx={11} ry={8} fill="#ffffff" opacity={0.85} />
      <path d="M45 44 Q50 41.5 55 44 Q54 49 50 50 Q46 49 45 44 Z" fill={BLACK} />
      <ellipse cx={48.2} cy={44.2} rx={1.6} ry={0.9} fill="#fff" opacity={0.7} />
      <Mouth x={50} y={52} w={4.6} mood={mood} />
      <Eyes x1={35} x2={65} y={36} r={5.6} mood={mood} lid={BLACK} ring="#6b5d7c" />
      <Brows x1={35} x2={65} y={22.5} w={8} mood={mood} color="#5b4d6b" />
      <Blush x1={22} x2={78} y={50} r={4.2} />
      {/* scarf */}
      <path d="M26 63 Q50 76 74 63 L75 70 Q50 84 25 70 Z" fill={`url(#${id}s)`} stroke={scarfDark} strokeWidth={1.5} />
      <path d="M33 68 l2 7 M42 72 l1.5 7 M57 72 l-1.5 7 M67 68 l-2 7" stroke={scarfDark} strokeWidth={1.2} opacity={0.5} />
      <path d="M60 74 L66 88 L75 85 L68 72 Z" fill={`url(#${id}s)`} stroke={scarfDark} strokeWidth={1.5} />
      <MoodFx mood={mood} />
    </g>
  )
}

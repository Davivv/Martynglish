import { darken, lighten, mix, useGid } from '../colors'
import type { CharacterProps } from '../types'
import { Blush, Brows, Eyes, MoodFx, Mouth } from './Face'

/** Friendly baby dinosaur with a bow tie (SPEC section 6). */
export function Dino({ primary, secondary = '#3B82F6', mood }: CharacterProps) {
  const id = useGid()
  const light = lighten(primary, 0.35)
  const dark = darken(primary, 0.32)
  const outline = darken(primary, 0.62)
  const belly = mix(lighten(primary, 0.78), '#FFF3C4', 0.5)
  const plate = mix(primary, '#FFD166', 0.62)
  const plateDark = darken(plate, 0.3)
  const spot = darken(primary, 0.16)
  const bowDark = darken(secondary, 0.38)
  const plates = [
    [31, 15, 7],
    [42, 11, 8],
    [54, 11, 8],
    [65, 15, 7],
  ] as const
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <defs>
        <radialGradient id={`${id}f`} cx="40%" cy="30%" r="85%">
          <stop offset="0" stopColor={light} />
          <stop offset="0.55" stopColor={primary} />
          <stop offset="1" stopColor={dark} />
        </radialGradient>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={lighten(secondary, 0.35)} />
          <stop offset="1" stopColor={secondary} />
        </linearGradient>
      </defs>
      {/* tail with plates */}
      <g className="stage-tail" style={{ transformOrigin: '70px 90px' }}>
        <path d="M68 78 C86 80 98 74 98 60 C95 70 86 70 78 66 L68 66 Z" fill={`url(#${id}f)`} stroke={outline} strokeWidth={1.8} />
        {[
          [82, 69, 5],
          [90, 70, 4.5],
        ].map(([x, y, s]) => (
          <path key={x} d={`M${x - s} ${y - 1} L${x} ${y - s * 1.5} L${x + s} ${y - 1} Z`} fill={plate} stroke={plateDark} strokeWidth={1.2} />
        ))}
      </g>
      {/* back plates (behind head and body) */}
      {plates.map(([x, y, s]) => (
        <path key={x} d={`M${x - s} ${y + 8} Q${x} ${y - s * 1.2} ${x + s} ${y + 8} Z`} fill={plate} stroke={plateDark} strokeWidth={1.4} />
      ))}
      {/* body */}
      <path d="M22 99 C16 80 26 62 50 62 C74 62 84 80 78 99 Z" fill={`url(#${id}f)`} stroke={outline} strokeWidth={1.8} />
      <path d="M36 98 C32 84 38 70 50 70 C62 70 68 84 64 98 Z" fill={belly} stroke={darken(belly, 0.15)} strokeWidth={0.8} />
      <g stroke={darken(belly, 0.12)} strokeWidth={1} fill="none" opacity={0.8}>
        <path d="M39 79 Q50 84 61 79 M38 86 Q50 91 62 86 M38 93 Q50 98 62 93" />
      </g>
      {/* body spots */}
      <g fill={spot} opacity={0.65}>
        <ellipse cx={27} cy={80} rx={3.4} ry={2.6} />
        <ellipse cx={31} cy={90} rx={2.4} ry={1.9} />
        <ellipse cx={73} cy={82} rx={3} ry={2.4} />
      </g>
      {/* arms */}
      {[
        [24, 77, -20],
        [76, 77, 20],
      ].map(([x, y, r]) => (
        <g key={x} transform={`rotate(${r} ${x} ${y})`}>
          <ellipse cx={x} cy={y} rx={5} ry={8} fill={`url(#${id}f)`} stroke={outline} strokeWidth={1.5} />
          <path d={`M${x - 2} ${y + 6} v3 M${x + 2} ${y + 6} v3`} stroke={outline} strokeWidth={1} />
        </g>
      ))}
      {/* feet */}
      {[36, 64].map((x) => (
        <g key={x}>
          <path d={`M${x - 11} 99 C${x - 12} 91 ${x + 12} 91 ${x + 11} 99 Z`} fill={`url(#${id}f)`} stroke={outline} strokeWidth={1.6} />
          {[-6, 0, 6].map((d) => (
            <ellipse key={d} cx={x + d} cy={99} rx={2.6} ry={1.9} fill={light} stroke={outline} strokeWidth={1} />
          ))}
        </g>
      ))}
      {/* head */}
      <path
        d="M50 12 C72 12 82 24 81 38 C84 52 72 64 50 64 C28 64 16 52 19 38 C18 24 28 12 50 12 Z"
        fill={`url(#${id}f)`}
        stroke={outline}
        strokeWidth={1.8}
      />
      {/* head crest bumps */}
      <g fill={plate} stroke={plateDark} strokeWidth={1.2}>
        <path d="M43 13.5 Q50 2 57 13.5 Z" />
        <path d="M30 18 Q34 8 41 14 Z" />
        <path d="M70 18 Q66 8 59 14 Z" />
      </g>
      {/* cheek spots and snout */}
      <g fill={spot} opacity={0.6}>
        <ellipse cx={26} cy={44} rx={3} ry={2.2} />
        <ellipse cx={31} cy={51} rx={2} ry={1.6} />
        <ellipse cx={74} cy={44} rx={3} ry={2.2} />
      </g>
      <ellipse cx={50} cy={51} rx={19} ry={12} fill={lighten(primary, 0.35)} opacity={0.75} />
      <ellipse cx={45} cy={43} rx={1.6} ry={1.1} fill={dark} />
      <ellipse cx={55} cy={43} rx={1.6} ry={1.1} fill={dark} />
      <Mouth x={50} y={50} w={8.5} mood={mood} />
      <Eyes x1={36.5} x2={63.5} y={32} r={7.6} mood={mood} lid={primary} />
      <Brows x1={36.5} x2={63.5} y={20} w={9} mood={mood} color={outline} />
      <Blush x1={27} x2={73} y={46} r={4.5} />
      {/* bow tie */}
      <path d="M50 67 L33 59 Q31 67 33 76 Z" fill={`url(#${id}b)`} stroke={bowDark} strokeWidth={1.4} />
      <path d="M50 67 L67 59 Q69 67 67 76 Z" fill={`url(#${id}b)`} stroke={bowDark} strokeWidth={1.4} />
      <path d="M40 65 L37 62 M40 69 L36 69 M60 65 L63 62 M60 69 L64 69" stroke={lighten(secondary, 0.5)} strokeWidth={1} opacity={0.8} />
      <rect x={45.5} y={62} width={9} height={11} rx={3.5} fill={secondary} stroke={bowDark} strokeWidth={1.4} />
      <MoodFx mood={mood} />
    </g>
  )
}

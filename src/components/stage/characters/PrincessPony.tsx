import { darken, lighten, useGid } from '../colors'
import type { CharacterProps } from '../types'
import { Blush, Brows, Eyes, MoodFx, Mouth } from './Face'

const RAINBOW = ['#EF4444', '#F97316', '#FACC15', '#4ADE80', '#38BDF8', '#8B5CF6']
const SKIN = '#FFD9BF'
const SKIN_DARK = '#E9A98A'

/** A little princess in a pink dress and golden crown with her white pony with a rainbow mane. */
export function PrincessPony({ primary, secondary = '#FACC15', mood }: CharacterProps) {
  const id = useGid()
  const dress = primary
  const dressLight = lighten(dress, 0.45)
  const dressDark = darken(dress, 0.3)
  const dressLine = darken(dress, 0.55)
  const hair = '#E8A33D'
  const hairDark = '#B9741A'
  const outline = '#6f5a7d'
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <defs>
        <linearGradient id={`${id}d`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={dressLight} />
          <stop offset="0.6" stopColor={dress} />
          <stop offset="1" stopColor={dressDark} />
        </linearGradient>
        <linearGradient id={`${id}h`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F8C45E" />
          <stop offset="1" stopColor={hairDark} />
        </linearGradient>
        <radialGradient id={`${id}s`} cx="40%" cy="35%" r="75%">
          <stop offset="0" stopColor="#FFF0E3" />
          <stop offset="1" stopColor={SKIN} />
        </radialGradient>
        <radialGradient id={`${id}p`} cx="40%" cy="30%" r="85%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.7" stopColor="#F4EEFA" />
          <stop offset="1" stopColor="#D4C6EA" />
        </radialGradient>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFE680" />
          <stop offset="1" stopColor={secondary} />
        </linearGradient>
      </defs>

      {/* ---------- pony (right) ---------- */}
      {/* tail */}
      <g className="stage-wag" style={{ transformOrigin: '93px 74px' }}>
        {RAINBOW.map((c, i) => (
          <path
            key={c}
            d={`M${93 + i * 0.6} ${72 + i * 1.2} C${106 + i * 1.2} ${78 + i} ${108 + i * 0.4} ${92 + i} ${99 + i * 1.6} 99`}
            fill="none"
            stroke={c}
            strokeWidth={3.6}
          />
        ))}
      </g>
      {/* back legs */}
      {[84, 91].map((x) => (
        <g key={x}>
          <path d={`M${x - 3.5} 82 L${x - 3.8} 96 L${x + 3.8} 96 L${x + 3.5} 82 Z`} fill={`url(#${id}p)`} stroke={outline} strokeWidth={1.4} />
          <path d={`M${x - 4.2} 95 h8.4 v4 q-4.2 2 -8.4 0 Z`} fill="#B79AE8" stroke={outline} strokeWidth={1.2} />
        </g>
      ))}
      {/* body */}
      <path d="M52 80 C50 66 62 62 74 62 C90 62 98 70 96 82 C95 90 88 92 74 92 C60 92 53 90 52 80 Z" fill={`url(#${id}p)`} stroke={outline} strokeWidth={1.6} />
      <path
        d="M80 71 l1.9 3.9 l4.3 .5 l-3.2 3 l.9 4.2 l-3.9 -2.2 l-3.9 2.2 l.9 -4.2 l-3.2 -3 l4.3 -.5 z"
        fill={`url(#${id}g)`}
        stroke="#C9971A"
        strokeWidth={0.9}
      />
      {/* front legs */}
      {[60, 67].map((x) => (
        <g key={x}>
          <path d={`M${x - 3.5} 82 L${x - 3.8} 96 L${x + 3.8} 96 L${x + 3.5} 82 Z`} fill={`url(#${id}p)`} stroke={outline} strokeWidth={1.4} />
          <path d={`M${x - 4.2} 95 h8.4 v4 q-4.2 2 -8.4 0 Z`} fill="#B79AE8" stroke={outline} strokeWidth={1.2} />
        </g>
      ))}
      {/* neck */}
      <path d="M64 70 C62 58 66 50 72 46 L88 46 C90 56 90 64 86 70 Z" fill={`url(#${id}p)`} stroke={outline} strokeWidth={1.5} />
      {/* rainbow mane (behind head) */}
      {RAINBOW.map((c, i) => (
        <path
          key={c}
          d={`M${78 - i * 1.4} ${28 + i * 0.6} C${58 - i * 2.2} ${26 + i} ${56 - i * 2} ${50 + i} ${60 - i * 1.2} ${72 - i * 0.4}`}
          fill="none"
          stroke={c}
          strokeWidth={3.7}
        />
      ))}
      {/* ears */}
      <path d="M69 31 C66 18 71 15 73 15 C77 18 79 26 79 31 Z" fill={`url(#${id}p)`} stroke={outline} strokeWidth={1.5} />
      <path d="M85 31 C86 18 82 15 80 15 C76 18 75 26 76 31 Z" fill={`url(#${id}p)`} stroke={outline} strokeWidth={1.5} />
      <path d="M71 29 C70 22 72 19 73 19 C75 21 76 25 76 29 Z" fill="#FFB3D1" />
      <path d="M83 29 C83 22 82 19 80.5 19 C79 21 78.5 25 79 29 Z" fill="#FFB3D1" />
      {/* head */}
      <path d="M77 29 C91 29 96 40 94 50 C92 60 84 63 77 63 C70 63 62 60 60 50 C58 40 63 29 77 29 Z" fill={`url(#${id}p)`} stroke={outline} strokeWidth={1.6} />
      <ellipse cx={77} cy={56} rx={10} ry={6.8} fill="#FFE3EE" />
      <circle cx={73.5} cy={57} r={0.9} fill={outline} />
      <circle cx={80.5} cy={57} r={0.9} fill={outline} />
      <Mouth x={77} y={59.6} w={3} mood={mood} />
      {/* forelock curls */}
      {RAINBOW.slice(0, 5).map((c, i) => (
        <path
          key={c}
          d={`M${65 + i * 1.3} ${34 - i * 0.5} C${70 + i} ${27 - i} ${80 - i} ${28 + i * 0.2} ${86 + i * 0.4} ${35 + i * 0.4}`}
          fill="none"
          stroke={c}
          strokeWidth={2.1}
          opacity={0.95}
        />
      ))}
      <Eyes x1={69.8} x2={84.2} y={45} r={4.8} mood={mood} iris="#8B5CF6" lid="#F4EEFA" />
      <Brows x1={69.8} x2={84.2} y={37} w={5.5} mood={mood} color={outline} />
      <Blush x1={64.5} x2={89.5} y={53} r={3} />

      {/* ---------- princess (left) ---------- */}
      {/* hair behind */}
      <path d="M12 40 C6 14 48 8 42 40 C46 58 41 66 37 69 L17 69 C13 62 15 50 12 40 Z" fill={`url(#${id}h)`} stroke={darken(hair, 0.5)} strokeWidth={1.5} />
      {/* shoes */}
      <ellipse cx={19.5} cy={99.5} rx={6} ry={2.8} fill="#FF8FB8" stroke={dressLine} strokeWidth={1.1} />
      <ellipse cx={34.5} cy={99.5} rx={6} ry={2.8} fill="#FF8FB8" stroke={dressLine} strokeWidth={1.1} />
      {/* arms */}
      <path d="M16 55 C9 60 7 66 9 70" fill="none" stroke={SKIN_DARK} strokeWidth={5.5} />
      <path d="M16 55 C9 60 7 66 9 70" fill="none" stroke={SKIN} strokeWidth={3.8} />
      <path d="M38 55 C45 60 47 66 45 70" fill="none" stroke={SKIN_DARK} strokeWidth={5.5} />
      <path d="M38 55 C45 60 47 66 45 70" fill="none" stroke={SKIN} strokeWidth={3.8} />
      <circle cx={9} cy={71} r={3.2} fill={SKIN} stroke={SKIN_DARK} strokeWidth={0.9} />
      <circle cx={45} cy={71} r={3.2} fill={SKIN} stroke={SKIN_DARK} strokeWidth={0.9} />
      {/* dress */}
      <path d="M21 51 L33 51 C34 60 36 66 44 80 C47 86 49 92 50 98 Q27 104 4 98 C5 92 7 86 10 80 C18 66 20 60 21 51 Z" fill={`url(#${id}d)`} stroke={dressLine} strokeWidth={1.6} />
      <g stroke={dressDark} strokeWidth={1} fill="none" opacity={0.55}>
        <path d="M20 72 C18 82 15 90 12 97" />
        <path d="M27 72 V98" />
        <path d="M34 72 C36 82 39 90 42 97" />
      </g>
      {/* ruffle hem */}
      <path d="M4.5 94 q3.5 5 7 0 q3.5 5 7 0 q3.5 5 7 0 q3.5 5 7 0 q3.5 5 7 0 q3.5 5 7 0 q3.5 5 6 0 L50 99 Q27 104 4 99 Z" fill={dressLight} stroke={dressLine} strokeWidth={1.1} />
      {/* bodice + sash */}
      <path d="M21 51 L33 51 L34 62 Q27 65 20 62 Z" fill={dressLight} opacity={0.5} />
      <path d="M19.5 62 Q27 66 34.5 62 L35 66 Q27 70 19 66 Z" fill={secondary} stroke="#C9971A" strokeWidth={1} />
      <path d="M27 64 l-6 -4 v8 z M27 64 l6 -4 v8 z" fill="#FFE680" stroke="#C9971A" strokeWidth={0.9} />
      {/* puff sleeves */}
      <ellipse cx={17.5} cy={54} rx={5.4} ry={4.6} fill={dressLight} stroke={dressLine} strokeWidth={1.2} />
      <ellipse cx={36.5} cy={54} rx={5.4} ry={4.6} fill={dressLight} stroke={dressLine} strokeWidth={1.2} />
      {/* neck + face */}
      <rect x={24} y={46} width={6} height={7} rx={2} fill={SKIN_DARK} />
      <path d="M27 21 C39 21 41 32 40 40 C39 49 34 52 27 52 C20 52 15 49 14 40 C13 32 15 21 27 21 Z" fill={`url(#${id}s)`} stroke={SKIN_DARK} strokeWidth={1.2} />
      {/* bangs */}
      <path d="M13.5 36 C13 22 26 17 33 20 C38 22 41 28 40.5 36 C37 28 31 25 26 26 C21 27 16 30 13.5 36 Z" fill={`url(#${id}h)`} stroke={darken(hair, 0.5)} strokeWidth={1.2} />
      {/* crown */}
      <path d="M15 24 L16.5 11 L22 17 L27 7 L32 17 L37.5 11 L39 24 Q27 28 15 24 Z" fill={`url(#${id}g)`} stroke="#B88400" strokeWidth={1.3} />
      <circle cx={27} cy={10.5} r={1.8} fill="#EF4444" stroke="#9B1C1C" strokeWidth={0.6} />
      <circle cx={16.8} cy={13.5} r={1.4} fill="#38BDF8" />
      <circle cx={37.2} cy={13.5} r={1.4} fill="#38BDF8" />
      <circle cx={27} cy={22.5} r={1.5} fill="#F472B6" />
      <Eyes x1={21.2} x2={32.8} y={37} r={4.3} mood={mood} iris="#5AB0E8" lid={SKIN} />
      <Brows x1={21.2} x2={32.8} y={30.5} w={5} mood={mood} color={hairDark} />
      <Mouth x={27} y={45.2} w={3} mood={mood} />
      <Blush x1={17} x2={37} y={42.5} r={2.8} />
      <MoodFx mood={mood} />
    </g>
  )
}

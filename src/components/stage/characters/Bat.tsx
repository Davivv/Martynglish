import { darken, lighten, useGid } from '../colors'
import type { CharacterProps } from '../types'
import { Blush, Brows, Eyes, MoodFx, Mouth } from './Face'

/**
 * Willow (D43): a shy little bat with soft grey fur and pale lavender wings that shine
 * with a starry pattern only when she is happy, and look dim and still when worried
 * (characterVisualAnchor).
 */
export function Bat({ primary, secondary = '#C4B5FD', mood }: CharacterProps) {
  const id = useGid()
  const light = lighten(primary, 0.3)
  const dark = darken(primary, 0.3)
  const outline = darken(primary, 0.6)
  const cream = lighten(primary, 0.78)
  const shiny = mood === 'happy' || mood === 'excited'
  const dim = mood === 'worried' || mood === 'sleepy'
  const wing = dim ? darken(secondary, 0.15) : secondary
  const wingOpacity = dim ? 0.72 : 1
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <defs>
        <radialGradient id={`${id}f`} cx="40%" cy="30%" r="85%">
          <stop offset="0" stopColor={light} />
          <stop offset="0.55" stopColor={primary} />
          <stop offset="1" stopColor={dark} />
        </radialGradient>
        <linearGradient id={`${id}w`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={lighten(wing, 0.3)} />
          <stop offset="1" stopColor={darken(wing, 0.1)} />
        </linearGradient>
      </defs>
      {/* wings, spread gently to the sides */}
      <g className="stage-flap" style={{ transformOrigin: '20px 70px' }} opacity={wingOpacity}>
        <path
          d="M30 90 C12 92 2 80 6 64 C9 50 4 40 10 30 C18 38 22 36 28 44 C26 54 30 64 34 72 Z"
          fill={`url(#${id}w)`}
          stroke={darken(wing, 0.35)}
          strokeWidth={1.6}
        />
        <path d="M14 36 C12 46 13 56 17 64 M22 42 C21 52 23 61 27 68" fill="none" stroke={darken(wing, 0.2)} strokeWidth={1} opacity={0.6} />
      </g>
      <g className="stage-flap" style={{ transformOrigin: '80px 70px', animationDelay: '0.1s' }} opacity={wingOpacity}>
        <path
          d="M70 90 C88 92 98 80 94 64 C91 50 96 40 90 30 C82 38 78 36 72 44 C74 54 70 64 66 72 Z"
          fill={`url(#${id}w)`}
          stroke={darken(wing, 0.35)}
          strokeWidth={1.6}
        />
        <path d="M86 36 C88 46 87 56 83 64 M78 42 C79 52 77 61 73 68" fill="none" stroke={darken(wing, 0.2)} strokeWidth={1} opacity={0.6} />
      </g>
      {shiny && (
        <g fill="#fff" opacity={0.9}>
          <path className="stage-twinkle" d="M18 56 l1.3 2.9 l2.9 1.3 l-2.9 1.3 l-1.3 2.9 l-1.3 -2.9 l-2.9 -1.3 l2.9 -1.3 z" />
          <path className="stage-twinkle" style={{ animationDelay: '0.5s' }} d="M82 56 l1.3 2.9 l2.9 1.3 l-2.9 1.3 l-1.3 2.9 l-1.3 -2.9 l-2.9 -1.3 l2.9 -1.3 z" />
          <path className="stage-twinkle" style={{ animationDelay: '0.9s' }} d="M14 78 l1 2.3 l2.3 1 l-2.3 1 l-1 2.3 l-1 -2.3 l-2.3 -1 l2.3 -1 z" />
          <path className="stage-twinkle" style={{ animationDelay: '1.2s' }} d="M86 78 l1 2.3 l2.3 1 l-2.3 1 l-1 2.3 l-1 -2.3 l-2.3 -1 l2.3 -1 z" />
        </g>
      )}
      {/* small round body */}
      <path d="M33 97 C28 82 36 70 50 70 C64 70 72 82 67 97 Z" fill={`url(#${id}f)`} stroke={outline} strokeWidth={1.7} />
      <ellipse cx={50} cy={86} rx={10} ry={9} fill={cream} opacity={0.85} />
      {/* big ears */}
      <path d="M30 20 C22 6 36 2 42 16 C40 22 37 27 36 32 Z" fill={`url(#${id}f)`} stroke={outline} strokeWidth={1.7} />
      <path d="M70 20 C78 6 64 2 58 16 C60 22 63 27 64 32 Z" fill={`url(#${id}f)`} stroke={outline} strokeWidth={1.7} />
      <path d="M33 18 C28 9 35 7 38 15 C36 19 34 23 34 27 Z" fill="#FFB3C7" opacity={0.7} />
      <path d="M67 18 C72 9 65 7 62 15 C64 19 66 23 66 27 Z" fill="#FFB3C7" opacity={0.7} />
      {/* round head */}
      <path
        d="M50 16 C66 16 75 28 73 40 C75 51 64 61 50 61 C36 61 25 51 27 40 C25 28 34 16 50 16 Z"
        fill={`url(#${id}f)`}
        stroke={outline}
        strokeWidth={1.8}
      />
      <ellipse cx={50} cy={47} rx={11} ry={7.5} fill={cream} opacity={0.9} />
      <path d="M47.4 42.5 Q50 41 52.6 42.5 Q51.6 46 50 46.6 Q48.4 46 47.4 42.5 Z" fill="#2a1a33" />
      <Mouth x={50} y={48.5} w={3.6} mood={mood} />
      <Eyes x1={40} x2={60} y={39} r={6.8} mood={mood} lid={primary} />
      <Brows x1={40} x2={60} y={28} w={7.6} mood={mood} color={outline} />
      <Blush x1={32} x2={68} y={46} r={4} />
      <MoodFx mood={mood} />
    </g>
  )
}

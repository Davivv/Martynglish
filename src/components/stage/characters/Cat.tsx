import { darken, lighten, useGid } from '../colors'
import type { CharacterProps } from '../types'
import { Blush, Brows, Eyes, MoodFx, Mouth } from './Face'

/** Purple kitten with big green eyes and a yellow star collar (SPEC section 6). */
export function Cat({ primary, secondary = '#FACC15', mood }: CharacterProps) {
  const id = useGid()
  const light = lighten(primary, 0.35)
  const mid = primary
  const dark = darken(primary, 0.35)
  const outline = darken(primary, 0.62)
  const collarDark = darken(secondary, 0.35)
  const stripe = darken(primary, 0.28)
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <defs>
        <radialGradient id={`${id}f`} cx="40%" cy="30%" r="80%">
          <stop offset="0" stopColor={light} />
          <stop offset="0.55" stopColor={mid} />
          <stop offset="1" stopColor={dark} />
        </radialGradient>
        <linearGradient id={`${id}c`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={lighten(secondary, 0.4)} />
          <stop offset="1" stopColor={secondary} />
        </linearGradient>
      </defs>
      {/* tail */}
      <g className="stage-tail" style={{ transformOrigin: '72px 92px' }}>
        <path d="M72 94 C98 96 100 66 88 56" fill="none" stroke={outline} strokeWidth={10.5} />
        <path d="M72 94 C98 96 100 66 88 56" fill="none" stroke={mid} strokeWidth={7.5} />
        <path d="M91 61 C92 56 90 54 88 56" fill="none" stroke={dark} strokeWidth={7.5} />
        <path d="M74 91 C94 92 96 70 87 60" fill="none" stroke={light} strokeWidth={2} opacity={0.6} />
      </g>
      {/* body */}
      <path d="M23 99 C18 78 29 62 50 62 C71 62 82 78 77 99 Z" fill={`url(#${id}f)`} stroke={outline} strokeWidth={1.8} />
      <ellipse cx={50} cy={84} rx={14} ry={13} fill={lighten(primary, 0.55)} opacity={0.6} />
      {/* paws */}
      {[38, 62].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy={96.5} rx={10} ry={5.6} fill={light} stroke={outline} strokeWidth={1.6} />
          <path d={`M${x - 3} ${95} v3 M${x + 3} ${95} v3`} stroke={outline} strokeWidth={1} opacity={0.6} fill="none" />
        </g>
      ))}
      {/* ears */}
      <path d="M18 36 C13 8 28 8 31 11 C38 13 44 18 46 22 Z" fill={`url(#${id}f)`} stroke={outline} strokeWidth={1.8} />
      <path d="M82 36 C87 8 72 8 69 11 C62 13 56 18 54 22 Z" fill={`url(#${id}f)`} stroke={outline} strokeWidth={1.8} />
      <path d="M23 30 C21 17 28 16 30 17 C35 19 39 22 41 25 Z" fill="#FFB3C7" />
      <path d="M77 30 C79 17 72 16 70 17 C65 19 61 22 59 25 Z" fill="#FFB3C7" />
      {/* head */}
      <path
        d="M50 11 C74 11 86 24 85 40 C88 50 78 63 64 63 C58 66 42 66 36 63 C22 63 12 50 15 40 C14 24 26 11 50 11 Z"
        fill={`url(#${id}f)`}
        stroke={outline}
        strokeWidth={1.8}
      />
      {/* forehead stripes */}
      <g fill="none" stroke={stripe} strokeWidth={2.6}>
        <path d="M50 13 V22" />
        <path d="M42 14.5 L44 21" />
        <path d="M58 14.5 L56 21" />
      </g>
      {/* collar */}
      <path d="M30 60 Q50 70 70 60 L71 66 Q50 77 29 66 Z" fill={`url(#${id}c)`} stroke={collarDark} strokeWidth={1.4} />
      <path
        d="M50 66 l2.2 4.7 l5.1 .6 l-3.8 3.5 l1 5 l-4.5 -2.5 l-4.5 2.5 l1 -5 l-3.8 -3.5 l5.1 -.6 z"
        fill={lighten(secondary, 0.3)}
        stroke={collarDark}
        strokeWidth={1.1}
        transform="translate(0 -2.5) scale(1)"
      />
      {/* muzzle */}
      <ellipse cx={50} cy={50} rx={13} ry={9.5} fill={lighten(primary, 0.72)} />
      <path d="M46.5 43.2 Q50 41.8 53.5 43.2 Q52.5 47 50 47.6 Q47.5 47 46.5 43.2 Z" fill="#FF7FA6" stroke={outline} strokeWidth={0.8} />
      <Mouth x={50} y={50.5} w={4.2} mood={mood} cat />
      {/* whiskers */}
      <g stroke={lighten(primary, 0.8)} strokeWidth={0.9} fill="none">
        <path d="M36 47 L19 44 M36 50 L18 51 M37 53 L21 58" />
        <path d="M64 47 L81 44 M64 50 L82 51 M63 53 L79 58" />
      </g>
      <Eyes x1={34.5} x2={65.5} y={35.5} r={8.2} mood={mood} iris="#3FC96B" lid={mid} />
      <Brows x1={34.5} x2={65.5} y={22.5} w={9} mood={mood} color={outline} />
      <Blush x1={24} x2={76} y={47} />
      <MoodFx mood={mood} />
    </g>
  )
}

import { colorOf, darken, lighten, useGid } from '../colors'
import type { PropProps } from '../types'

/** Every prop is drawn in a 40x40 box centred on (0, 0). */

export function Apple({ variant }: PropProps) {
  const id = useGid()
  const c = colorOf(variant)
  const line = darken(c, 0.5)
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <defs>
        <radialGradient id={id} cx="35%" cy="30%" r="80%">
          <stop offset="0" stopColor={lighten(c, 0.5)} />
          <stop offset="0.5" stopColor={c} />
          <stop offset="1" stopColor={darken(c, 0.3)} />
        </radialGradient>
      </defs>
      <path d="M0 -10 C-6 -16 -19 -13 -18 0 C-18 12 -9 19 -4 18 C-2 17.5 -1 17 0 17 C1 17 2 17.5 4 18 C9 19 18 12 18 0 C19 -13 6 -16 0 -10 Z" fill={`url(#${id})`} stroke={line} strokeWidth={1.6} />
      <path d="M0 -10 C0 -14 1 -17 3 -19" fill="none" stroke="#6b4423" strokeWidth={2.2} />
      <path d="M2 -14 C6 -21 14 -20 16 -17 C12 -12 6 -11 2 -14 Z" fill="#4CC15C" stroke="#237a35" strokeWidth={1.2} />
      <path d="M4 -15 C8 -17 11 -17.5 14 -17" fill="none" stroke="#237a35" strokeWidth={0.8} />
      <ellipse cx={-9} cy={-3} rx={3.2} ry={5.5} fill="#fff" opacity={0.5} transform="rotate(18 -9 -3)" />
    </g>
  )
}

export function Banana() {
  const id = useGid()
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFF08A" />
          <stop offset="0.5" stopColor="#FACC15" />
          <stop offset="1" stopColor="#D69B08" />
        </linearGradient>
      </defs>
      <path d="M-17 -12 C-18 4 -6 17 12 15 C16 14.5 18 13 18 11 C20 8 19 6 16 7 C4 9 -6 2 -8 -13 C-9 -16 -16 -16 -17 -12 Z" fill={`url(#${id})`} stroke="#8a5a0a" strokeWidth={1.6} />
      <path d="M-8 -13 C-6 0 4 8 15 7" fill="none" stroke="#B7860B" strokeWidth={1} opacity={0.7} />
      <path d="M-15 -4 C-12 6 -4 12 6 13" fill="none" stroke="#fff" strokeWidth={1.8} opacity={0.5} />
      <path d="M-17 -12 C-17 -16 -9 -17 -8 -13 L-9.5 -13.5 C-12 -14.5 -15 -14 -16.5 -11 Z" fill="#7a5a1d" />
      <path d="M16 7 C19 6 20 8 18 11 C18 13 16 14.5 12 15 L13 11 Z" fill="#5b3b12" />
    </g>
  )
}

export function Chocolate() {
  const id = useGid()
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#A5683A" />
          <stop offset="1" stopColor="#5A3015" />
        </linearGradient>
      </defs>
      <g transform="rotate(-12)">
        <rect x={-14} y={-18} width={28} height={36} rx={3.5} fill={`url(#${id})`} stroke="#3a1d0b" strokeWidth={1.6} />
        <g stroke="#3a1d0b" strokeWidth={1.1} opacity={0.75}>
          <path d="M-14 -6 H14 M-14 6 H14 M0 -18 V18" />
        </g>
        <g fill="#fff" opacity={0.22}>
          <rect x={-12} y={-16} width={11} height={8} rx={2} />
          <rect x={2} y={-16} width={10} height={8} rx={2} />
        </g>
        {/* foil wrapper at the bottom */}
        <path d="M-15 6 L15 6 L15 18 Q15 19.5 13.5 19.5 H-13.5 Q-15 19.5 -15 18 Z" fill="#D8E2EE" stroke="#8394a8" strokeWidth={1.4} />
        <path d="M-9 8 V18 M-3 8 V18 M3 8 V18 M9 8 V18" stroke="#fff" strokeWidth={1.4} opacity={0.7} />
        <path d="M-15 6 L-11 3.5 L-7 6 L-3 3.5 L1 6 L5 3.5 L9 6 L12 3.5 L15 6" fill="none" stroke="#8394a8" strokeWidth={1.3} />
      </g>
    </g>
  )
}

const ICE_CREAM_FLAVOURS: Record<string, { scoop: string; accent: string }> = {
  '1': { scoop: '#FF8FB8', accent: '#E0457F' },
  '2': { scoop: '#8B5A3C', accent: '#4a2a15' },
  '3': { scoop: '#FFE27A', accent: '#E0A800' },
  '4': { scoop: '#7DE3B4', accent: '#27A877' },
  '5': { scoop: '#A98CF5', accent: '#6A45D6' },
}

/** `icecream-1..5` are cones with differently coloured scoops. */
export function IceCream({ variant }: PropProps) {
  const id = useGid()
  const f = ICE_CREAM_FLAVOURS[variant] ?? ICE_CREAM_FLAVOURS['1']
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <defs>
        <radialGradient id={id} cx="35%" cy="30%" r="85%">
          <stop offset="0" stopColor={lighten(f.scoop, 0.45)} />
          <stop offset="0.55" stopColor={f.scoop} />
          <stop offset="1" stopColor={darken(f.scoop, 0.22)} />
        </radialGradient>
        <linearGradient id={`${id}c`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F7CE7E" />
          <stop offset="1" stopColor="#C98A3A" />
        </linearGradient>
      </defs>
      <path d="M-11 -1 L0 20 L11 -1 Z" fill={`url(#${id}c)`} stroke="#8a5420" strokeWidth={1.5} />
      <path d="M-8 4 L8 4 M-5.5 10 L5.5 10 M-9 -1 L3 17 M-3 -1 L7 14 M9 -1 L-3 17 M3 -1 L-7 14" stroke="#9c6226" strokeWidth={1} opacity={0.65} fill="none" />
      <path d="M-13 -3 C-16 -8 -13 -12 -9 -11 C-8 -17 -2 -20 3 -18 C8 -20 14 -15 12 -10 C16 -10 17 -4 13 -3 C11 -0.5 9 2.5 7 0.5 C5 3 2 3 0 0.5 C-2 3 -6 3 -7 0.5 C-9 2 -11 1 -13 -3 Z" fill={`url(#${id})`} stroke={darken(f.scoop, 0.45)} strokeWidth={1.5} />
      <ellipse cx={-6} cy={-11} rx={3.2} ry={2} fill="#fff" opacity={0.55} transform="rotate(-25 -6 -11)" />
      <g fill={f.accent} opacity={0.75}>
        <circle cx={0} cy={-7} r={0.9} />
        <circle cx={6} cy={-10} r={0.9} />
        <circle cx={-2} cy={-13} r={0.9} />
        <circle cx={7} cy={-4} r={0.9} />
      </g>
      <circle cx={2} cy={-19.5} r={3} fill="#EF2F4F" stroke="#8c1226" strokeWidth={1} />
      <path d="M2 -22 C3 -25 5 -26 6 -26" fill="none" stroke="#4a7a2a" strokeWidth={1.1} />
      <circle cx={1} cy={-20.5} r={0.9} fill="#fff" opacity={0.8} />
    </g>
  )
}

const PIZZA_TOPPINGS = ['#EF4444', '#FACC15', '#22C55E', '#EF4444', '#FACC15', '#22C55E']
const PIZZA_FRUIT: ReadonlyArray<readonly [number, number]> = [
  [-13, -5], [-4, -9], [7, -7], [15, -1], [-15, 3], [-2, 2], [9, 5], [-7, 8], [2, 9],
]

/** `pizza-1`: a round fruit pizza, cut into slices and topped with colourful fruit. */
export function Pizza() {
  const id = useGid()
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <defs>
        <radialGradient id={id} cx="38%" cy="30%" r="80%">
          <stop offset="0" stopColor="#FFE8A3" />
          <stop offset="0.6" stopColor="#F7CE7E" />
          <stop offset="1" stopColor="#C98A3A" />
        </radialGradient>
        <linearGradient id={`${id}c`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F2C06B" />
          <stop offset="1" stopColor="#C98A3A" />
        </linearGradient>
      </defs>
      <ellipse cx={0} cy={18} rx={27} ry={5} fill="#000" opacity={0.15} />
      {/* crust ring */}
      <ellipse cx={0} cy={0} rx={27} ry={17} fill={`url(#${id}c)`} stroke="#8a5420" strokeWidth={1.6} />
      {/* dough base */}
      <ellipse cx={0} cy={0.6} rx={22} ry={13.6} fill={`url(#${id})`} stroke="#B7791F" strokeWidth={1.2} />
      {/* slice lines, so it reads as a shareable pizza */}
      <g stroke="#B7791F" strokeWidth={1} opacity={0.5}>
        <path d="M0 0.6 L0 -13" />
        <path d="M0 0.6 L19 7.4" />
        <path d="M0 0.6 L-19 7.4" />
        <path d="M0 0.6 L12 -9.4" />
        <path d="M0 0.6 L-12 -9.4" />
        <path d="M0 0.6 L12 10.6" />
        <path d="M0 0.6 L-12 10.6" />
      </g>
      {/* colourful fruit toppings: red, yellow and green, matching the story's pizza */}
      {PIZZA_FRUIT.map(([x, y], i) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={2.3} fill={PIZZA_TOPPINGS[i % PIZZA_TOPPINGS.length]} stroke="#00000022" strokeWidth={0.5} />
      ))}
      <ellipse cx={-8} cy={-6} rx={6} ry={2.4} fill="#fff" opacity={0.35} transform="rotate(-20 -8 -6)" />
    </g>
  )
}

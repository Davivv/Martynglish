import { colorOf, darken, lighten, useGid } from '../colors'
import type { PropProps } from '../types'

export function Flower({ variant }: PropProps) {
  const id = useGid()
  const c = colorOf(variant, '#EC4899')
  const line = variant === 'white' ? '#a7a0b8' : darken(c, 0.4)
  const petals = Array.from({ length: 6 }, (_, i) => i * 60)
  return (
    <g strokeLinejoin="round" strokeLinecap="round" className="stage-sway" style={{ transformOrigin: '0px 20px' }}>
      <defs>
        <radialGradient id={id} cx="50%" cy="85%" r="90%">
          <stop offset="0" stopColor={lighten(c, 0.5)} />
          <stop offset="0.6" stopColor={c} />
          <stop offset="1" stopColor={darken(c, 0.12)} />
        </radialGradient>
      </defs>
      <path d="M0 4 C-1 11 1 16 0 21" fill="none" stroke="#2f8f3e" strokeWidth={3} />
      <path d="M0 15 C-6 9 -13 11 -14 15 C-8 18 -3 17 0 15 Z" fill="#4CC15C" stroke="#237a35" strokeWidth={1.1} />
      <path d="M0 12 C5 6 12 8 13 12 C8 15 3 14 0 12 Z" fill="#5ED06C" stroke="#237a35" strokeWidth={1.1} />
      <g transform="translate(0 -6)">
        {petals.map((a) => (
          <ellipse key={a} cx={0} cy={-8} rx={5.2} ry={7} fill={`url(#${id})`} stroke={line} strokeWidth={1.3} transform={`rotate(${a})`} />
        ))}
        <circle r={5.2} fill="#FFD43B" stroke="#C99700" strokeWidth={1.2} />
        <circle cx={-1.6} cy={-1.8} r={1.5} fill="#fff" opacity={0.7} />
      </g>
    </g>
  )
}

export function Shell({ variant }: PropProps) {
  const id = useGid()
  const c = colorOf(variant, '#EC4899')
  const base = variant === 'white' ? '#F7F2EC' : lighten(c, 0.4)
  const line = variant === 'white' ? '#a58f7c' : darken(c, 0.45)
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <defs>
        <radialGradient id={id} cx="50%" cy="95%" r="100%">
          <stop offset="0" stopColor={lighten(base, 0.45)} />
          <stop offset="0.7" stopColor={base} />
          <stop offset="1" stopColor={darken(base, 0.2)} />
        </radialGradient>
      </defs>
      <path d="M-7 17 L-4 12 L4 12 L7 17 Q0 20 -7 17 Z" fill={darken(base, 0.1)} stroke={line} strokeWidth={1.4} />
      <path d="M0 13 C-12 13 -22 4 -19 -6 C-17 -14 -9 -17 0 -17 C9 -17 17 -14 19 -6 C22 4 12 13 0 13 Z" fill={`url(#${id})`} stroke={line} strokeWidth={1.7} />
      <g fill="none" stroke={line} strokeWidth={1.2} opacity={0.7}>
        <path d="M0 12 V-16 M-2 12 C-8 6 -9 -6 -7 -15 M2 12 C8 6 9 -6 7 -15 M-4 12 C-13 6 -15 -2 -15 -9 M4 12 C13 6 15 -2 15 -9" />
      </g>
      <path d="M-13 -9 C-11 -13 -7 -15 -3 -15.5" fill="none" stroke="#fff" strokeWidth={2} opacity={0.6} />
    </g>
  )
}

export function Tree() {
  const id = useGid()
  return (
    <g strokeLinejoin="round" strokeLinecap="round" className="stage-sway" style={{ transformOrigin: '0px 20px' }}>
      <defs>
        <radialGradient id={id} cx="35%" cy="28%" r="90%">
          <stop offset="0" stopColor="#8FE08B" />
          <stop offset="0.55" stopColor="#3FB25A" />
          <stop offset="1" stopColor="#23783D" />
        </radialGradient>
        <linearGradient id={`${id}t`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#A8703C" />
          <stop offset="1" stopColor="#6e4220" />
        </linearGradient>
      </defs>
      <path d="M-4 20 C-3 12 -3 8 -5 3 L5 3 C3 8 3 12 4 20 Z" fill={`url(#${id}t)`} stroke="#4a2b12" strokeWidth={1.5} />
      <path d="M-1 12 C-5 10 -8 8 -9 5 M1 9 C4 7 6 5 7 3" fill="none" stroke="#6e4220" strokeWidth={1.8} />
      <path d="M-6 6 C-20 7 -22 -8 -12 -9 C-14 -19 -3 -24 3 -19 C10 -23 20 -15 15 -8 C23 -5 20 8 7 6 C3 8 -2 8 -6 6 Z" fill={`url(#${id})`} stroke="#1e6234" strokeWidth={1.7} />
      <g fill="none" stroke="#1e6234" strokeWidth={1.1} opacity={0.4}>
        <path d="M-12 -2 C-9 0 -6 -1 -4 -4 M6 -12 C9 -10 12 -11 13 -8 M2 0 C5 2 8 1 10 -1" />
      </g>
      <ellipse cx={-6} cy={-12} rx={4.5} ry={2.4} fill="#fff" opacity={0.35} transform="rotate(-28 -6 -12)" />
    </g>
  )
}

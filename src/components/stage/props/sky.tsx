import { colorOf, darken, lighten, useGid } from '../colors'
import type { PropProps } from '../types'

export function Sun() {
  const id = useGid()
  const rays = Array.from({ length: 12 }, (_, i) => i * 30)
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <defs>
        <radialGradient id={id} cx="38%" cy="32%" r="80%">
          <stop offset="0" stopColor="#FFF6A8" />
          <stop offset="0.55" stopColor="#FFD43B" />
          <stop offset="1" stopColor="#F59E0B" />
        </radialGradient>
      </defs>
      <g className="stage-spin">
        {rays.map((a) => (
          <path key={a} d="M-3.2 -13.5 L0 -21 L3.2 -13.5 Z" fill="#FFB020" stroke="#D97706" strokeWidth={1.1} transform={`rotate(${a})`} />
        ))}
      </g>
      <circle r={13.5} fill={`url(#${id})`} stroke="#D97706" strokeWidth={1.6} />
      <ellipse cx={-5} cy={-6} rx={4} ry={2.4} fill="#fff" opacity={0.5} transform="rotate(-30 -5 -6)" />
      <circle cx={-4.6} cy={-1.5} r={1.6} fill="#5a3410" />
      <circle cx={4.6} cy={-1.5} r={1.6} fill="#5a3410" />
      <path d="M-5 4 Q0 9 5 4" fill="none" stroke="#5a3410" strokeWidth={1.4} />
      <ellipse cx={-8} cy={3.5} rx={2.6} ry={1.6} fill="#FF7A59" opacity={0.5} />
      <ellipse cx={8} cy={3.5} rx={2.6} ry={1.6} fill="#FF7A59" opacity={0.5} />
    </g>
  )
}

export function Moon({ variant }: PropProps) {
  const id = useGid()
  const c = variant === 'white' ? '#F4F7FF' : '#FFE27A'
  const edge = variant === 'white' ? '#8fa0c8' : '#C98F0A'
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={lighten(c, 0.45)} />
          <stop offset="0.6" stopColor={c} />
          <stop offset="1" stopColor={darken(c, 0.18)} />
        </linearGradient>
      </defs>
      <path d="M6 -19 C-11 -17 -20 -3 -15 9 C-10 20 6 22 15 14 C2 13 -5 2 -2 -8 C0 -13 3 -17 6 -19 Z" fill={`url(#${id})`} stroke={edge} strokeWidth={1.6} />
      <g fill={darken(c, 0.14)} opacity={0.6}>
        <circle cx={-11} cy={2} r={2.3} />
        <circle cx={-6} cy={11} r={1.7} />
        <circle cx={-3.5} cy={-3.5} r={1.2} />
      </g>
      <path d="M-9 -9 C-12 -6 -13 -2 -13 0" fill="none" stroke="#fff" strokeWidth={1.8} opacity={0.6} />
      <path className="stage-twinkle" d="M12 -6 l1 2.6 l2.6 1 l-2.6 1 l-1 2.6 l-1 -2.6 l-2.6 -1 l2.6 -1 z" fill="#fff" stroke={edge} strokeWidth={0.7} />
    </g>
  )
}

export function Cloud() {
  const id = useGid()
  return (
    <g strokeLinejoin="round" strokeLinecap="round" className="stage-bob">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#DCE9F8" />
        </linearGradient>
      </defs>
      <path d="M-14 13 C-22 13 -23 3 -15 2 C-16 -7 -6 -10 -2 -4 C1 -14 15 -14 15 -3 C23 -4 24 9 17 13 Z" fill={`url(#${id})`} stroke="#8EB0D8" strokeWidth={1.6} />
      <path d="M-13 9 C-8 11 4 11 14 9" fill="none" stroke="#B9D0EC" strokeWidth={1.6} />
      <path d="M-12 -2 C-11 -5 -8 -6 -6 -5" fill="none" stroke="#fff" strokeWidth={1.8} opacity={0.9} />
    </g>
  )
}

export function Star({ variant }: PropProps) {
  const id = useGid()
  const c = variant === 'white' ? '#F5F8FF' : colorOf(variant, '#FACC15')
  const edge = variant === 'white' ? '#8da0c9' : darken(c, 0.38)
  return (
    <g strokeLinejoin="round" strokeLinecap="round" className="stage-pulse">
      <defs>
        <radialGradient id={id} cx="40%" cy="35%" r="75%">
          <stop offset="0" stopColor={lighten(c, 0.55)} />
          <stop offset="0.6" stopColor={c} />
          <stop offset="1" stopColor={darken(c, 0.2)} />
        </radialGradient>
      </defs>
      <path d="M0 -19 L5.2 -7 L18.4 -5.9 L8.4 3 L11.4 15.9 L0 9.2 L-11.4 15.9 L-8.4 3 L-18.4 -5.9 L-5.2 -7 Z" fill={`url(#${id})`} stroke={edge} strokeWidth={4.5} />
      <path d="M0 -19 L5.2 -7 L18.4 -5.9 L8.4 3 L11.4 15.9 L0 9.2 L-11.4 15.9 L-8.4 3 L-18.4 -5.9 L-5.2 -7 Z" fill={`url(#${id})`} />
      <path d="M-3 -10 L0 -15 L1.5 -9" fill="none" stroke="#fff" strokeWidth={1.8} opacity={0.7} />
      <circle cx={-5} cy={1} r={1.3} fill={darken(c, 0.5)} />
      <circle cx={5} cy={1} r={1.3} fill={darken(c, 0.5)} />
      <path d="M-2.6 5 Q0 7.5 2.6 5" fill="none" stroke={darken(c, 0.5)} strokeWidth={1.2} />
    </g>
  )
}

const RAINBOW = ['#EF4444', '#F97316', '#FACC15', '#4ADE80', '#38BDF8', '#8B5CF6']

export function Rainbow() {
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      {RAINBOW.map((c, i) => {
        const r = 19 - i * 2.7
        return <path key={c} d={`M${-r} 12 A${r} ${r * 0.95} 0 0 1 ${r} 12`} fill="none" stroke={c} strokeWidth={3.2} />
      })}
      <path d="M-17 7 A17 15 0 0 1 -4 -2" fill="none" stroke="#fff" strokeWidth={1.1} opacity={0.5} />
      {/* soft cloud puffs at both ends */}
      <g fill="#fff" stroke="#9db9de" strokeWidth={1.2}>
        <path d="M-24 15 C-27 9 -19 6 -17 10 C-14 7 -9 11 -11 15 Z" />
        <path d="M24 15 C27 9 19 6 17 10 C14 7 9 11 11 15 Z" />
      </g>
    </g>
  )
}

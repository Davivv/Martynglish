import { colorOf, darken, lighten, useGid } from '../colors'
import type { PropProps } from '../types'

export function Bird({ variant }: PropProps) {
  const id = useGid()
  const c = colorOf(variant, '#3B82F6')
  const line = darken(c, 0.5)
  return (
    <g strokeLinejoin="round" strokeLinecap="round" className="stage-bob">
      <defs>
        <radialGradient id={id} cx="35%" cy="30%" r="85%">
          <stop offset="0" stopColor={lighten(c, 0.5)} />
          <stop offset="0.55" stopColor={c} />
          <stop offset="1" stopColor={darken(c, 0.28)} />
        </radialGradient>
      </defs>
      {/* tail */}
      <path d="M12 2 L22 -4 L20 5 L23 9 L11 9 Z" fill={darken(c, 0.15)} stroke={line} strokeWidth={1.4} />
      {/* feet */}
      <path d="M-3 15 v5 M-3 20 l-3 1 M-3 20 l3 1 M4 15 v5 M4 20 l-3 1 M4 20 l3 1" stroke="#D97706" strokeWidth={1.4} fill="none" />
      {/* body */}
      <path d="M-15 -4 C-15 -17 -2 -20 6 -14 C16 -12 18 2 14 9 C10 17 -6 18 -13 10 C-15 6 -16 1 -15 -4 Z" fill={`url(#${id})`} stroke={line} strokeWidth={1.6} />
      <ellipse cx={-1} cy={8} rx={9} ry={6} fill={lighten(c, 0.75)} opacity={0.75} />
      {/* wing */}
      <g className="stage-flap" style={{ transformOrigin: '2px -1px' }}>
        <path d="M-1 -4 C6 -10 15 -5 14 3 C10 6 3 7 -1 4 Z" fill={darken(c, 0.12)} stroke={line} strokeWidth={1.3} />
        <path d="M2 -1 C6 -3 9 -2 11 0" fill="none" stroke={lighten(c, 0.35)} strokeWidth={1} />
      </g>
      {/* beak */}
      <path d="M-14 -6 L-23 -3 L-14 0 Z" fill="#FFA726" stroke="#C26A00" strokeWidth={1.2} />
      <circle cx={-9} cy={-6.5} r={3.1} fill="#2a1a33" />
      <circle cx={-10} cy={-7.6} r={1.1} fill="#fff" />
      <ellipse cx={-6} cy={-1} rx={2.3} ry={1.4} fill="#FF7A8F" opacity={0.55} />
      <path d="M-3 -18 C-4 -23 0 -23 1 -20" fill="none" stroke={line} strokeWidth={1.4} />
    </g>
  )
}

export function Butterfly({ variant }: PropProps) {
  const id = useGid()
  const c = colorOf(variant, '#3B82F6')
  const line = darken(c, 0.5)
  const accent = lighten(c, 0.65)
  return (
    <g strokeLinejoin="round" strokeLinecap="round" className="stage-bob">
      <defs>
        <radialGradient id={id} cx="30%" cy="40%" r="90%">
          <stop offset="0" stopColor={lighten(c, 0.45)} />
          <stop offset="0.6" stopColor={c} />
          <stop offset="1" stopColor={darken(c, 0.25)} />
        </radialGradient>
      </defs>
      <path d="M-1 -9 C-3 -14 -7 -17 -9 -16 M1 -9 C3 -14 7 -17 9 -16" fill="none" stroke="#3a2a40" strokeWidth={1.3} />
      <circle cx={-9} cy={-16} r={1.3} fill="#3a2a40" />
      <circle cx={9} cy={-16} r={1.3} fill="#3a2a40" />
      <g className="stage-flutter">
        {/* upper wings */}
        <path d="M-1 -4 C-6 -20 -21 -19 -20 -7 C-20 0 -8 2 -1 0 Z" fill={`url(#${id})`} stroke={line} strokeWidth={1.5} />
        <path d="M1 -4 C6 -20 21 -19 20 -7 C20 0 8 2 1 0 Z" fill={`url(#${id})`} stroke={line} strokeWidth={1.5} />
        {/* lower wings */}
        <path d="M-1 1 C-14 0 -19 8 -14 14 C-9 18 -3 12 -1 6 Z" fill={darken(c, 0.08)} stroke={line} strokeWidth={1.5} />
        <path d="M1 1 C14 0 19 8 14 14 C9 18 3 12 1 6 Z" fill={darken(c, 0.08)} stroke={line} strokeWidth={1.5} />
        <g fill={accent} opacity={0.9}>
          <circle cx={-13} cy={-9} r={3.1} />
          <circle cx={13} cy={-9} r={3.1} />
          <circle cx={-10} cy={9} r={2.1} />
          <circle cx={10} cy={9} r={2.1} />
        </g>
        <g fill="none" stroke={line} strokeWidth={0.9} opacity={0.5}>
          <path d="M-3 -2 C-8 -6 -12 -8 -17 -8 M3 -2 C8 -6 12 -8 17 -8" />
        </g>
      </g>
      <ellipse cx={0} cy={0} rx={2.3} ry={9} fill="#4a3452" stroke="#2a1a33" strokeWidth={1.1} />
      <ellipse cx={0} cy={-8} rx={2.6} ry={2.6} fill="#4a3452" stroke="#2a1a33" strokeWidth={1.1} />
    </g>
  )
}

export function Fish({ variant }: PropProps) {
  const id = useGid()
  const c = colorOf(variant, '#F97316')
  const line = darken(c, 0.5)
  return (
    <g strokeLinejoin="round" strokeLinecap="round" className="stage-bob">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={lighten(c, 0.35)} />
          <stop offset="0.55" stopColor={c} />
          <stop offset="1" stopColor={darken(c, 0.25)} />
        </linearGradient>
      </defs>
      <path d="M13 0 L23 -10 C25 -3 25 3 23 10 Z" fill={darken(c, 0.1)} stroke={line} strokeWidth={1.5} />
      <path d="M-3 -10 C0 -17 8 -17 10 -9 Z" fill={darken(c, 0.12)} stroke={line} strokeWidth={1.4} />
      <path d="M-20 0 C-16 -12 0 -15 13 -3 C15 -1 15 1 13 3 C0 15 -16 12 -20 0 Z" fill={`url(#${id})`} stroke={line} strokeWidth={1.6} />
      <path d="M-14 6 C-8 11 4 11 10 4 C4 8 -8 8 -14 6 Z" fill={lighten(c, 0.65)} opacity={0.7} />
      <g fill="none" stroke={line} strokeWidth={0.9} opacity={0.4}>
        <path d="M2 -6 q3 6 0 12 M6 -5 q3 5 0 10 M-2 -7 q3 7 0 14" />
      </g>
      <path d="M-5 0 C-3 4 1 7 4 6 C2 3 -1 1 -5 0 Z" fill={darken(c, 0.12)} stroke={line} strokeWidth={1.1} />
      <circle cx={-12} cy={-3} r={3.8} fill="#fff" stroke={line} strokeWidth={1} />
      <circle cx={-12.8} cy={-3} r={2.2} fill="#2a1a33" />
      <circle cx={-13.4} cy={-4} r={0.8} fill="#fff" />
      <path d="M-19 3 Q-16.5 5 -14 3.5" fill="none" stroke={line} strokeWidth={1.2} />
      <g fill="#fff" stroke="#7bbbe8" strokeWidth={0.8} opacity={0.9} className="stage-bubbles">
        <circle cx={-23} cy={-9} r={2.1} />
        <circle cx={-20} cy={-15} r={1.4} />
      </g>
    </g>
  )
}

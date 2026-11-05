import { colorOf, darken, lighten, useGid } from '../colors'
import type { PropProps } from '../types'

export function Ball({ variant }: PropProps) {
  const id = useGid()
  const c = colorOf(variant, '#EF4444')
  const alt = variant === 'white' ? '#9ca3af' : lighten(c, 0.8)
  const line = darken(c, 0.5)
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <defs>
        <radialGradient id={id} cx="35%" cy="30%" r="85%">
          <stop offset="0" stopColor={lighten(c, 0.45)} />
          <stop offset="0.55" stopColor={c} />
          <stop offset="1" stopColor={darken(c, 0.32)} />
        </radialGradient>
        <clipPath id={`${id}c`}>
          <circle r={16.5} />
        </clipPath>
      </defs>
      <ellipse cx={0} cy={17.5} rx={13} ry={2.6} fill="#000" opacity={0.15} />
      <circle r={16.5} fill={`url(#${id})`} />
      <g clipPath={`url(#${id}c)`}>
        <path d="M-6 -20 C-14 -6 -14 6 -6 20 L2 20 C-6 6 -6 -6 2 -20 Z" fill={alt} opacity={0.88} />
        <path d="M12 -20 C4 -6 4 6 12 20 L20 20 L20 -20 Z" fill={alt} opacity={0.88} />
        <circle r={16.5} fill={`url(#${id})`} opacity={0.25} />
      </g>
      <circle r={16.5} fill="none" stroke={line} strokeWidth={1.6} />
      <ellipse cx={-7} cy={-8} rx={4.6} ry={2.8} fill="#fff" opacity={0.6} transform="rotate(-38 -7 -8)" />
    </g>
  )
}

export function Balloon({ variant }: PropProps) {
  const id = useGid()
  const c = colorOf(variant, '#EF4444')
  const line = darken(c, 0.5)
  return (
    <g strokeLinejoin="round" strokeLinecap="round" className="stage-sway" style={{ transformOrigin: '0px 14px' }}>
      <defs>
        <radialGradient id={id} cx="35%" cy="28%" r="85%">
          <stop offset="0" stopColor={lighten(c, 0.5)} />
          <stop offset="0.5" stopColor={c} />
          <stop offset="1" stopColor={darken(c, 0.3)} />
        </radialGradient>
      </defs>
      <path d="M0 14 C-4 17 4 19 0 24" fill="none" stroke="#7b6a86" strokeWidth={1.1} />
      <path d="M0 -21 C12 -21 16 -9 12 0 C9 7 4 11 0 12 C-4 11 -9 7 -12 0 C-16 -9 -12 -21 0 -21 Z" fill={`url(#${id})`} stroke={line} strokeWidth={1.6} />
      <path d="M-3.5 15 L0 11.5 L3.5 15 Q0 16.5 -3.5 15 Z" fill={darken(c, 0.15)} stroke={line} strokeWidth={1.2} />
      <ellipse cx={-5.5} cy={-11} rx={2.8} ry={5} fill="#fff" opacity={0.55} transform="rotate(18 -5.5 -11)" />
    </g>
  )
}

export function Heart({ variant }: PropProps) {
  const id = useGid()
  const c = colorOf(variant, '#EF4444')
  const line = darken(c, 0.5)
  return (
    <g strokeLinejoin="round" strokeLinecap="round" className="stage-pulse">
      <defs>
        <radialGradient id={id} cx="35%" cy="28%" r="85%">
          <stop offset="0" stopColor={lighten(c, 0.5)} />
          <stop offset="0.5" stopColor={c} />
          <stop offset="1" stopColor={darken(c, 0.3)} />
        </radialGradient>
      </defs>
      <path d="M0 17 C-6 12 -19 5 -19 -6 C-19 -14 -12 -18 -6.5 -16 C-3 -15 -1 -12.5 0 -10 C1 -12.5 3 -15 6.5 -16 C12 -18 19 -14 19 -6 C19 5 6 12 0 17 Z" fill={`url(#${id})`} stroke={line} strokeWidth={1.7} />
      <path d="M-14 -9 C-14 -12 -11 -13.5 -8.5 -12.5" fill="none" stroke="#fff" strokeWidth={2.4} opacity={0.65} />
      <circle cx={-14.5} cy={-4} r={1.2} fill="#fff" opacity={0.6} />
    </g>
  )
}

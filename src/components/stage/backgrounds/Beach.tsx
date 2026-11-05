import { useGid } from '../colors'
import { DriftCloud, H, W } from './shared'

/** Sunny beach: bright sky, turquoise sea with moving waves, a little sailboat, golden sand. */
export function Beach() {
  const id = useGid()
  return (
    <g>
      <defs>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4FB8F0" />
          <stop offset="1" stopColor="#C8EEFF" />
        </linearGradient>
        <linearGradient id={`${id}w`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2FB5D8" />
          <stop offset="1" stopColor="#7AE0E8" />
        </linearGradient>
        <linearGradient id={`${id}d`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FBE5A8" />
          <stop offset="1" stopColor="#F0C878" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id}s)`} />
      <DriftCloud y={40} scale={1.1} duration={75} delay={-18} />
      <DriftCloud y={74} scale={0.75} duration={95} delay={-60} opacity={0.45} />
      {/* sea */}
      <rect y={108} width={W} height={50} fill={`url(#${id}w)`} />
      <path d="M0 108 H400" stroke="#BFF1F8" strokeWidth={1.6} opacity={0.8} />
      {/* sailboat */}
      <g transform="translate(300 100)">
        <path d="M0 8 L0 -22 L16 6 Z" fill="#FFFFFF" stroke="#9CC4E0" strokeWidth={1} strokeLinejoin="round" />
        <path d="M-2 8 L-12 8 L-2 -14 Z" fill="#FF8A8A" stroke="#C45C5C" strokeWidth={1} strokeLinejoin="round" />
        <path d="M-14 10 H20 L15 16 H-8 Z" fill="#B5783F" stroke="#7a4a1f" strokeWidth={1} strokeLinejoin="round" />
      </g>
      {/* moving wave lines */}
      <g className="stage-waves" fill="none" stroke="#E6FAFD" strokeWidth={2} strokeLinecap="round" opacity={0.8}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
          <path key={i} d={`M${i * 60 - 60} ${122 + (i % 3) * 8} q10 -5 20 0 t20 0`} />
        ))}
      </g>
      {/* surf foam */}
      <path className="stage-surf" d="M-20 150 C20 140 60 156 100 148 C140 140 180 156 220 148 C260 140 300 156 340 148 C370 142 400 150 420 148 V160 H-20 Z" fill="#F4FEFF" opacity={0.95} />
      {/* sand */}
      <path d="M0 156 C60 150 120 160 200 154 C280 148 340 158 400 152 V240 H0 Z" fill={`url(#${id}d)`} />
      <g fill="#D9AE62" opacity={0.55}>
        <circle cx={40} cy={200} r={1.6} />
        <circle cx={120} cy={218} r={1.3} />
        <circle cx={210} cy={206} r={1.6} />
        <circle cx={300} cy={222} r={1.4} />
        <circle cx={360} cy={196} r={1.5} />
        <circle cx={80} cy={176} r={1.2} />
        <circle cx={250} cy={180} r={1.3} />
      </g>
      <path d="M20 190 q12 -4 24 0 M280 208 q12 -4 24 0" fill="none" stroke="#E4BC70" strokeWidth={2} strokeLinecap="round" opacity={0.7} />
    </g>
  )
}

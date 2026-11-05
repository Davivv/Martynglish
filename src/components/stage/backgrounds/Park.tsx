import { useGid } from '../colors'
import { DriftCloud, H, W } from './shared'

/** Town park: pale sky, round bushes, a sandy path, a bench and a lamp post. */
export function Park() {
  const id = useGid()
  return (
    <g>
      <defs>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7EC8F5" />
          <stop offset="1" stopColor="#D9F2FF" />
        </linearGradient>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#86D46A" />
          <stop offset="1" stopColor="#47A650" />
        </linearGradient>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5DBB63" />
          <stop offset="1" stopColor="#2F8A49" />
        </linearGradient>
        <linearGradient id={`${id}p`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F3DDB0" />
          <stop offset="1" stopColor="#E3C285" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id}s)`} />
      <DriftCloud y={42} scale={1} duration={80} delay={-20} />
      <DriftCloud y={74} scale={0.75} duration={100} delay={-70} opacity={0.45} />
      {/* distant bushes */}
      <g fill="#8FD18B" opacity={0.8}>
        <path d="M0 132 C0 106 30 98 48 112 C58 96 92 100 98 124 C112 112 140 116 146 132 Z" />
        <path d="M250 132 C252 108 280 100 296 114 C308 98 340 104 346 124 C362 110 392 114 400 128 V132 Z" />
      </g>
      <rect y={128} width={W} height={112} fill={`url(#${id}g)`} />
      <path d="M0 130 H400" stroke="#B9EBA4" strokeWidth={2} opacity={0.6} />
      {/* lamp post */}
      <g>
        <rect x={331} y={86} width={4} height={50} rx={1.5} fill="#5b6475" />
        <path d="M324 86 h18 l-3 -10 h-12 Z" fill="#FFE27A" stroke="#5b6475" strokeWidth={1.6} strokeLinejoin="round" />
        <rect x={329} y={134} width={8} height={3} rx={1} fill="#4a5262" />
      </g>
      {/* bench */}
      <g stroke="#6b3f1f" strokeWidth={1.4} strokeLinejoin="round">
        <rect x={86} y={110} width={44} height={6} rx={2} fill="#C4864B" />
        <rect x={86} y={118} width={44} height={6} rx={2} fill="#B3743C" />
        <rect x={86} y={128} width={44} height={5} rx={2} fill="#D39A5E" />
        <path d="M90 133 v8 M126 133 v8 M90 116 v12 M126 116 v12" fill="none" />
      </g>
      {/* path */}
      <path d="M150 240 C170 200 190 170 205 140 L228 140 C240 172 280 206 330 240 Z" fill={`url(#${id}p)`} />
      <path d="M150 240 C170 200 190 170 205 140" fill="none" stroke="#C9A468" strokeWidth={1.6} opacity={0.8} />
      <path d="M330 240 C280 206 240 172 228 140" fill="none" stroke="#C9A468" strokeWidth={1.6} opacity={0.8} />
      <g fill="#D3B27A" opacity={0.8}>
        <ellipse cx={200} cy={190} rx={5} ry={2} />
        <ellipse cx={235} cy={200} rx={6} ry={2.2} />
        <ellipse cx={180} cy={222} rx={7} ry={2.4} />
        <ellipse cx={270} cy={225} rx={7} ry={2.4} />
      </g>
      {/* foreground bushes */}
      <g>
        <path d="M-6 240 C-6 206 22 196 40 210 C52 194 86 200 90 224 C96 232 96 240 96 240 Z" fill={`url(#${id}b)`} />
        <path d="M320 240 C322 212 346 204 362 216 C374 200 404 206 408 232 V240 Z" fill={`url(#${id}b)`} />
      </g>
    </g>
  )
}

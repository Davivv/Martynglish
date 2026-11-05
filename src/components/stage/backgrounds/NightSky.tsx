import { useGid } from '../colors'
import { H, Twinkle, W } from './shared'

const STARS = [
  [24, 20, 1.3], [58, 56, 1], [92, 26, 1.5], [126, 70, 1], [160, 18, 1.2], [196, 50, 1], [238, 24, 1.4],
  [274, 64, 1], [310, 22, 1.3], [346, 52, 1.5], [380, 16, 1], [44, 96, 1.2], [140, 100, 1], [250, 98, 1.2],
  [330, 92, 1], [388, 80, 1.3], [210, 14, 1], [70, 8, 1],
] as const

/** Night: deep blue sky with tiny twinkling dots (not star shapes), dark hills and a cosy window. */
export function NightSky() {
  const id = useGid()
  return (
    <g>
      <defs>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#141A52" />
          <stop offset="0.6" stopColor="#2C2F7A" />
          <stop offset="1" stopColor="#5A4BA0" />
        </linearGradient>
        <linearGradient id={`${id}h`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3B4A9A" />
          <stop offset="1" stopColor="#22296B" />
        </linearGradient>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2F3E8A" />
          <stop offset="1" stopColor="#1A2058" />
        </linearGradient>
        <radialGradient id={`${id}a`} cx="50%" cy="100%" r="80%">
          <stop offset="0" stopColor="#8E7CF0" stopOpacity="0.5" />
          <stop offset="1" stopColor="#8E7CF0" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id}s)`} />
      <ellipse cx={200} cy={130} rx={260} ry={80} fill={`url(#${id}a)`} />
      {STARS.map(([x, y, r], i) => (
        <Twinkle key={`${x}-${y}`} x={x} y={y} r={r} delay={(i % 6) * 0.45} color={i % 4 === 0 ? '#FFE9A8' : '#FFFFFF'} />
      ))}
      {/* distant hills */}
      <path d="M0 126 C50 104 110 108 170 124 C220 136 270 108 330 108 C360 108 385 116 400 120 V240 H0 Z" fill={`url(#${id}h)`} />
      {/* little house with a warm window */}
      <g strokeLinejoin="round">
        <rect x={86} y={104} width={26} height={22} fill="#1B2055" />
        <path d="M82 105 L99 90 L116 105 Z" fill="#141846" />
        <rect x={94} y={110} width={9} height={9} rx={1.5} fill="#FFD76A" />
        <path d="M98.5 110 v9 M94 114.5 h9" stroke="#C99700" strokeWidth={0.8} />
        <rect x={104} y={92} width={4} height={8} fill="#141846" />
      </g>
      <path d="M0 150 C80 138 160 152 240 146 C320 140 360 148 400 144 V240 H0 Z" fill={`url(#${id}g)`} />
      <path d="M0 150 C80 138 160 152 240 146 C320 140 360 148 400 144" fill="none" stroke="#6A78C9" strokeWidth={1.8} opacity={0.6} />
      {/* fireflies */}
      <g fill="#FFF3A3">
        <circle className="stage-twinkle" style={{ animationDelay: '0.2s' }} cx={60} cy={176} r={1.8} />
        <circle className="stage-twinkle" style={{ animationDelay: '0.9s' }} cx={340} cy={186} r={1.8} />
        <circle className="stage-twinkle" style={{ animationDelay: '1.5s' }} cx={20} cy={210} r={1.5} />
        <circle className="stage-twinkle" style={{ animationDelay: '0.6s' }} cx={375} cy={158} r={1.5} />
      </g>
    </g>
  )
}

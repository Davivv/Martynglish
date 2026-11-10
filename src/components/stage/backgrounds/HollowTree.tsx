import { useGid } from '../colors'
import { H, W } from './shared'

/**
 * Twinkle Hollow (D43): inside an old, empty tree. Cosy and warm, with soft golden light
 * pouring through a crack in the bark above and drifting dust motes.
 */
export function HollowTree() {
  const id = useGid()
  return (
    <g>
      <defs>
        <radialGradient id={`${id}w`} cx="50%" cy="34%" r="80%">
          <stop offset="0" stopColor="#8A5A34" />
          <stop offset="0.6" stopColor="#5E3A20" />
          <stop offset="1" stopColor="#3A2213" />
        </radialGradient>
        <linearGradient id={`${id}l`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFE9A8" stopOpacity="0.95" />
          <stop offset="1" stopColor="#FFE9A8" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}g`}>
          <stop offset="0" stopColor="#FFE9A8" stopOpacity="0.8" />
          <stop offset="1" stopColor="#FFE9A8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}f`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#B07A3F" />
          <stop offset="1" stopColor="#7A4F28" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id}w)`} />
      {/* bark ridges curving down the walls */}
      <g fill="none" stroke="#3A2213" strokeWidth={3} opacity={0.5} strokeLinecap="round">
        <path d="M30 0 C20 70 36 150 24 240" />
        <path d="M80 0 C92 80 70 160 86 240" />
        <path d="M320 0 C332 80 310 160 326 240" />
        <path d="M370 0 C360 70 376 150 364 240" />
      </g>
      <g fill="none" stroke="#9C6A3F" strokeWidth={1.4} opacity={0.4}>
        <path d="M50 10 C44 80 56 160 48 230 M110 6 C118 76 102 150 112 230" />
        <path d="M290 6 C282 76 298 150 288 230 M350 10 C356 80 344 160 352 230" />
      </g>
      {/* knot holes */}
      <ellipse cx={56} cy={150} rx={10} ry={14} fill="#2A160C" opacity={0.6} />
      <ellipse cx={344} cy={118} rx={8} ry={11} fill="#2A160C" opacity={0.6} />
      {/* crack of warm light up above, gently swaying like a spotlight */}
      <g className="stage-beam">
        <path d="M186 -2 L214 -2 L242 150 L158 150 Z" fill={`url(#${id}l)`} />
      </g>
      <path d="M188 -2 H212 L214 6 H186 Z" fill="#FFF3C4" opacity={0.9} />
      {/* floor of soft moss and leaves */}
      <path d="M0 196 C80 184 160 192 240 188 C310 184 360 190 400 186 V240 H0 Z" fill={`url(#${id}f)`} />
      <ellipse cx={200} cy={198} rx={110} ry={16} fill={`url(#${id}g)`} />
      {/* drifting light motes */}
      <g fill="#FFE9A8">
        <circle className="stage-bob" cx={170} cy={108} r={2} />
        <circle className="stage-bob" style={{ animationDelay: '0.6s' }} cx={230} cy={130} r={1.6} />
        <circle className="stage-twinkle" cx={200} cy={88} r={1.8} />
      </g>
    </g>
  )
}

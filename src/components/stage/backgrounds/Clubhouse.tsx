import { useGid } from '../colors'
import { H, W } from './shared'

const FLAG_COLORS = ['#EF4444', '#FACC15', '#22C55E', '#3B82F6', '#EC4899']

/** Point on the quadratic curve `P0 P1 P2` at `t`. */
function quad(p0: readonly [number, number], p1: readonly [number, number], p2: readonly [number, number], t: number) {
  const u = 1 - t
  return [u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0], u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1]] as const
}

/** Inside a tree house: wooden walls, bunting, a couch with cushions, a window onto the leaves. */
export function Clubhouse() {
  const id = useGid()
  const flags: Record<string, string> = {}
  for (let i = 0; i < 18; i++) {
    const [x, y] = quad([0, 26], [200, 56], [400, 26], (i + 0.5) / 18)
    const color = FLAG_COLORS[i % FLAG_COLORS.length]
    flags[color] = `${flags[color] ?? ''}M${(x - 7).toFixed(1)} ${y.toFixed(1)}h14l-7 15z`
  }
  const bulbs = Array.from({ length: 13 }, (_, i) => quad([0, 12], [200, 34], [400, 12], (i + 0.5) / 13))
  return (
    <g>
      <defs>
        <linearGradient id={`${id}w`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#B8794A" />
          <stop offset="1" stopColor="#D79C66" />
        </linearGradient>
        <linearGradient id={`${id}f`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9C6035" />
          <stop offset="1" stopColor="#6E4023" />
        </linearGradient>
        <linearGradient id={`${id}v`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7DD3FC" />
          <stop offset="1" stopColor="#D9F4D2" />
        </linearGradient>
        <linearGradient id={`${id}c`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2DD4BF" />
          <stop offset="1" stopColor="#0F9488" />
        </linearGradient>
        <radialGradient id={`${id}g`}>
          <stop offset="0" stopColor="#FFE9A8" stopOpacity="0.8" />
          <stop offset="1" stopColor="#FFE9A8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id}w)`} />
      {/* vertical planks */}
      <g stroke="#8A5530" strokeWidth={1.4} opacity={0.55}>
        {Array.from({ length: 21 }, (_, i) => (
          <path key={i} d={`M${i * 20} 0 V160`} />
        ))}
      </g>
      <g fill="#E8B07A" opacity={0.25}>
        {Array.from({ length: 10 }, (_, i) => (
          <rect key={i} x={i * 40 + 2} y={0} width={16} height={160} />
        ))}
      </g>
      <rect x={0} y={0} width={W} height={9} fill="#6E4023" />
      <rect x={0} y={9} width={W} height={2} fill="#A56B3C" />
      {/* window onto the leaves */}
      <g>
        <rect x={262} y={44} width={86} height={76} rx={4} fill="#F8F1E4" stroke="#7A4A28" strokeWidth={2.4} />
        <rect x={268} y={50} width={74} height={64} fill={`url(#${id}v)`} />
        <g className="stage-sway" style={{ transformOrigin: '305px 120px' }}>
          <path d="M268 114 C268 90 280 82 292 88 C296 74 316 74 320 88 C334 80 344 92 342 114 Z" fill="#3FA55A" />
          <path d="M268 114 C272 100 284 98 292 104 C298 96 312 98 316 106 C326 98 338 104 342 114 Z" fill="#2E8A4A" />
          <path d="M280 70 C286 62 296 66 294 74 C290 80 282 78 280 70 Z M322 66 C330 60 338 66 334 74 C328 78 322 74 322 66 Z" fill="#5CC273" />
        </g>
        <path d="M305 50 V114 M268 82 H342" stroke="#F8F1E4" strokeWidth={3} />
        <path d="M274 52 L286 52 L272 70 Z M296 112 L310 112 L328 92 L316 92 Z" fill="#fff" opacity={0.2} />
        <path d="M262 44 Q276 66 264 100 L256 100 Q262 70 256 44 Z" fill="#F472B6" />
        <path d="M348 44 Q334 66 346 100 L354 100 Q348 70 354 44 Z" fill="#F472B6" />
      </g>
      {/* shelf with books and a plant */}
      <g>
        <rect x={36} y={74} width={80} height={5} rx={1.4} fill="#6E4023" />
        {[
          [42, 52, 22, '#EF4444'], [50, 56, 18, '#3B82F6'], [57, 50, 24, '#FACC15'], [65, 58, 16, '#22C55E'],
        ].map(([x, , h, c]) => (
          <rect key={x as number} x={x as number} y={74 - (h as number)} width={7} height={h as number} fill={c as string} stroke="#00000033" strokeWidth={0.6} />
        ))}
        <path d="M92 74 L95 62 H107 L110 74 Z" fill="#E67E4E" stroke="#8A4A24" strokeWidth={1} strokeLinejoin="round" />
        <path d="M101 62 C94 52 92 46 98 44 C100 50 101 56 101 62 Z M101 62 C108 52 112 46 106 42 C103 48 101 54 101 62 Z M101 62 C101 52 101 46 101 40 C104 46 103 54 101 62 Z" fill="#3FA55A" />
      </g>
      {/* bunting and string lights */}
      <path d="M0 26 Q200 56 400 26" fill="none" stroke="#6E4023" strokeWidth={1.2} />
      {Object.entries(flags).map(([c, d]) => (
        <path key={c} d={d} fill={c} stroke="#00000022" strokeWidth={0.5} />
      ))}
      <path d="M0 12 Q200 34 400 12" fill="none" stroke="#4A3320" strokeWidth={1} />
      {bulbs.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y + 3} r={7} fill={`url(#${id}g)`} />
          <circle className="stage-twinkle" style={{ animationDelay: `${(i % 5) * 0.5}s` }} cx={x} cy={y + 3} r={2.6} fill="#FFF1B8" stroke="#E0A93A" strokeWidth={0.6} />
        </g>
      ))}
      {/* couch */}
      <g strokeLinejoin="round">
        <rect x={20} y={118} width={118} height={38} rx={10} fill={`url(#${id}c)`} stroke="#0B6B62" strokeWidth={1.6} />
        <rect x={12} y={134} width={22} height={30} rx={8} fill="#14B8A6" stroke="#0B6B62" strokeWidth={1.6} />
        <rect x={124} y={134} width={22} height={30} rx={8} fill="#14B8A6" stroke="#0B6B62" strokeWidth={1.6} />
        <rect x={30} y={140} width={98} height={24} rx={7} fill="#2DD4BF" stroke="#0B6B62" strokeWidth={1.6} />
        <path d="M70 142 V162 M98 142 V162" stroke="#0B6B62" strokeWidth={1} opacity={0.5} />
        <rect x={34} y={122} width={22} height={22} rx={6} fill="#F472B6" stroke="#9D2B6B" strokeWidth={1.2} transform="rotate(-8 45 133)" />
        <rect x={60} y={124} width={20} height={20} rx={6} fill="#FACC15" stroke="#A8780C" strokeWidth={1.2} transform="rotate(6 70 134)" />
        <rect x={88} y={122} width={22} height={22} rx={6} fill="#A78BFA" stroke="#5B3FB8" strokeWidth={1.2} transform="rotate(-4 99 133)" />
        <path d="M38 126 q6 -3 12 0 M92 126 q6 -3 12 0" stroke="#fff" strokeWidth={1} fill="none" opacity={0.6} />
      </g>
      {/* floor and rug */}
      <rect y={160} width={W} height={H - 160} fill={`url(#${id}f)`} />
      <rect y={160} width={W} height={3} fill="#4A2A15" opacity={0.7} />
      <g stroke="#4A2A15" strokeWidth={1} opacity={0.5}>
        <path d="M0 178 H400 M0 200 H400 M0 224 H400" />
        <path d="M60 160 V178 M200 160 V178 M330 160 V178 M20 178 V200 M140 178 V200 M270 178 V200 M390 178 V200 M80 200 V224 M210 200 V224 M340 200 V224" />
      </g>
      <ellipse cx={200} cy={188} rx={112} ry={20} fill="#F472B6" stroke="#9D2B6B" strokeWidth={1.4} />
      <ellipse cx={200} cy={188} rx={92} ry={15} fill="#FDE68A" opacity={0.9} />
      <ellipse cx={200} cy={188} rx={72} ry={11} fill="#2DD4BF" opacity={0.9} />
      <ellipse cx={200} cy={188} rx={52} ry={7.4} fill="#F472B6" opacity={0.9} />
    </g>
  )
}

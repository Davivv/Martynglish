import { useGid } from '../colors'
import { H, W } from './shared'

const PANEL_COLORS = ['#38BDF8', '#FB923C', '#FDE047', '#F472B6', '#34D399', '#A78BFA']
const BULBS_X = [40, 90, 140, 200, 260, 310, 360]

/**
 * Friends (D44): the crew's bright recording-studio headquarters. A flat, colourful,
 * creator-studio look (acoustic panel wall, an "ON AIR" sign, a tripod camera and ring light in
 * the corner, a rainbow rug) rather than a photoreal set, matching `characterVisualAnchor`.
 */
export function Studio() {
  const id = useGid()
  return (
    <g>
      <defs>
        <linearGradient id={`${id}w`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFF7ED" />
          <stop offset="1" stopColor="#FDECD2" />
        </linearGradient>
        <linearGradient id={`${id}f`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F3E8D8" />
          <stop offset="1" stopColor="#E3D2B4" />
        </linearGradient>
        <radialGradient id={`${id}g`}>
          <stop offset="0" stopColor="#FFF4CC" stopOpacity="0.85" />
          <stop offset="1" stopColor="#FFF4CC" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}r`} cx="40%" cy="35%" r="75%">
          <stop offset="0" stopColor="#FFFDF2" />
          <stop offset="1" stopColor="#FDE68A" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id}w)`} />
      {/* ceiling track lights */}
      <rect y={0} width={W} height={14} fill="#F6CFA0" />
      {BULBS_X.map((x, i) => (
        <g key={x}>
          <circle cx={x} cy={20} r={20} fill={`url(#${id}g)`} />
          <circle className="stage-twinkle" style={{ animationDelay: `${(i % 4) * 0.4}s` }} cx={x} cy={11} r={4} fill="#FFF1B8" stroke="#E0A93A" strokeWidth={1} />
        </g>
      ))}
      {/* acoustic panel wall, a grid of soft rounded squares */}
      <g strokeLinejoin="round">
        {Array.from({ length: 4 }, (_, r) =>
          Array.from({ length: 8 }, (_, c) => {
            const x = 8 + c * 49
            const y = 24 + r * 29
            if (x > 300 && r > 1) return null
            const color = PANEL_COLORS[(r * 8 + c) % PANEL_COLORS.length]
            return <rect key={`${r}${c}`} x={x} y={y} width={40} height={22} rx={6} fill={color} opacity={0.26} />
          }),
        )}
      </g>
      {/* "ON AIR" sign, hanging from the ceiling */}
      <g transform="translate(118 20)">
        <path d="M0 0 V14" stroke="#94A3B8" strokeWidth={1.6} />
        <path d="M44 0 V14" stroke="#94A3B8" strokeWidth={1.6} />
        <rect x={-12} y={14} width={68} height={26} rx={13} fill="#EF4444" stroke="#9B1C1C" strokeWidth={1.6} />
        <rect x={-7} y={19} width={58} height={16} rx={8} fill="none" stroke="#FEE2E2" strokeWidth={1.2} opacity={0.7} />
        <text x={22} y={32} fontSize={13} fontWeight={800} textAnchor="middle" fill="#fff" fontFamily="'Lexend Variable', system-ui, sans-serif">
          ON AIR
        </text>
      </g>
      {/* big circle backdrop behind the hero, like a logo wall */}
      <circle cx={300} cy={96} r={58} fill="#BAE6FD" opacity={0.55} />
      <circle cx={300} cy={96} r={40} fill="#FEF3C7" opacity={0.6} />
      {/* a shelf with colourful trophies and a plant, studio pride */}
      <g strokeLinejoin="round">
        <rect x={16} y={70} width={92} height={5} rx={1.6} fill="#C9962A" />
        {[[24, '#FACC15'], [46, '#38BDF8'], [68, '#F472B6']].map(([x, c]) => (
          <g key={x as string}>
            <path d={`M${(x as number) + 6} 70 L${(x as number) + 2} 54 H${(x as number) + 10} Z`} fill={c as string} stroke="#00000022" strokeWidth={0.8} />
            <circle cx={(x as number) + 6} cy={51} r={4.4} fill={c as string} stroke="#00000022" strokeWidth={0.8} />
          </g>
        ))}
        <path d="M94 70 L97 58 H109 L112 70 Z" fill="#C9962A" stroke="#8A5A0B" strokeWidth={1} />
        <path d="M103 58 C96 48 94 42 100 40 C102 46 103 52 103 58 Z M103 58 C110 48 112 42 106 40 C104 46 103 52 103 58 Z" fill="#34D399" />
      </g>
      {/* tripod camera and ring light, soft set-dressing in the corner */}
      <g opacity={0.9}>
        <path d="M346 150 L326 188 M346 150 L346 188 M346 150 L366 188" fill="none" stroke="#94A3B8" strokeWidth={2.4} />
        <rect x={334} y={130} width={24} height={16} rx={3} fill="#CBD5E1" stroke="#64748B" strokeWidth={1.4} />
        <circle cx={352} cy={138} r={8} fill="#94A3B8" stroke="#64748B" strokeWidth={1.2} />
        <circle cx={352} cy={138} r={4.2} fill="#334155" />
      </g>
      <g className="stage-pulse" style={{ transformOrigin: '54px 150px' }} opacity={0.92}>
        <path d="M54 186 V146" stroke="#CBD5E1" strokeWidth={2.4} />
        <path d="M44 186 H64" stroke="#94A3B8" strokeWidth={2.8} strokeLinecap="round" />
        <circle cx={54} cy={140} r={18} fill={`url(#${id}g)`} />
        <circle cx={54} cy={140} r={10} fill={`url(#${id}r)`} stroke="#CA8A04" strokeWidth={1.4} />
        <circle cx={54} cy={140} r={5.6} fill="#0F172A" opacity={0.8} />
      </g>
      {/* floor and a cheerful rainbow rug */}
      <rect y={164} width={W} height={H - 164} fill={`url(#${id}f)`} />
      <path d="M0 164 H400" stroke="#C9AE80" strokeWidth={1.4} opacity={0.6} />
      <g stroke="#D8C29A" strokeWidth={1} opacity={0.5}>
        {Array.from({ length: 10 }, (_, i) => (
          <path key={i} d={`M${i * 44 + 6} 164 V240`} />
        ))}
      </g>
      <ellipse cx={200} cy={206} rx={128} ry={22} fill="#F9A8D4" stroke="#BE5A8A" strokeWidth={1.4} />
      <ellipse cx={200} cy={206} rx={104} ry={16.6} fill="#FDE68A" opacity={0.9} />
      <ellipse cx={200} cy={206} rx={80} ry={12} fill="#7DD3FC" opacity={0.9} />
      <ellipse cx={200} cy={206} rx={56} ry={7.6} fill="#86EFAC" opacity={0.9} />
    </g>
  )
}

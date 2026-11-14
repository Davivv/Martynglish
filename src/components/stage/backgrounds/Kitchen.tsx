import { useGid } from '../colors'
import { H, W } from './shared'

const CABINET_COLORS = ['#F97316', '#38BDF8', '#FACC15', '#F472B6', '#34D399']
const TILE_COLORS = ['#FDE68A', '#FBCFE8', '#BAE6FD']
const JARS: Array<[number, string]> = [
  [312, '#FDE68A'],
  [338, '#93C5FD'],
  [364, '#FCA5A5'],
]
const BOWLS: Array<[number, string, string]> = [
  [206, '#F97316', '#22C55E'],
  [254, '#38BDF8', '#FACC15'],
]

/**
 * Friends (D45): the crew's bright kitchen corner inside the studio, for the fruit-pizza
 * challenge. Same warm, flat, colourful creator-studio palette as `Studio.tsx`: a tiled
 * backsplash, a long counter with bright cabinet doors, a two-ring stovetop and mixing bowls.
 */
export function Kitchen() {
  const id = useGid()
  return (
    <g>
      <defs>
        <linearGradient id={`${id}w`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFF7ED" />
          <stop offset="1" stopColor="#FDECD2" />
        </linearGradient>
        <linearGradient id={`${id}cab`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F3E8D8" />
          <stop offset="1" stopColor="#D8C29A" />
        </linearGradient>
        <linearGradient id={`${id}top`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#E7D9BE" />
        </linearGradient>
        <radialGradient id={`${id}g`}>
          <stop offset="0" stopColor="#FFF4CC" stopOpacity="0.8" />
          <stop offset="1" stopColor="#FFF4CC" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}b`} cx="40%" cy="35%" r="75%">
          <stop offset="0" stopColor="#FCA5A5" />
          <stop offset="1" stopColor="#DC2626" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id}w)`} />
      {/* two soft pendant lamps */}
      {[120, 300].map((x) => (
        <g key={x}>
          <circle cx={x} cy={24} r={22} fill={`url(#${id}g)`} />
          <path d={`M${x} 0 V12`} stroke="#C9962A" strokeWidth={1.6} />
          <path d={`M${x - 10} 22 Q${x - 10} 12 ${x} 12 Q${x + 10} 12 ${x + 10} 22 Z`} fill="#FDE68A" stroke="#C9962A" strokeWidth={1.4} strokeLinejoin="round" />
          <ellipse cx={x} cy={23} rx={5.4} ry={1.8} fill="#FFF7D6" />
        </g>
      ))}
      {/* backsplash: small colourful tiles behind the counter */}
      <g strokeLinejoin="round">
        {Array.from({ length: 2 }, (_, r) =>
          Array.from({ length: 12 }, (_, c) => {
            const x = 8 + c * 33
            const y = 58 + r * 26
            const color = TILE_COLORS[(r * 12 + c) % TILE_COLORS.length]
            return <rect key={`${r}${c}`} x={x} y={y} width={27} height={20} rx={4} fill={color} opacity={0.3} />
          }),
        )}
      </g>
      {/* open shelf with little spice jars, right side */}
      <rect x={300} y={44} width={96} height={5} rx={1.6} fill="#A9793F" />
      {JARS.map(([x, c]) => (
        <g key={x}>
          <rect x={x} y={24} width={18} height={20} rx={3} fill="#fff" opacity={0.9} stroke="#A9793F" strokeWidth={1.2} />
          <rect x={x + 2} y={30} width={14} height={12} rx={1.4} fill={c} opacity={0.75} />
          <rect x={x + 3} y={21} width={12} height={4} rx={1.4} fill="#A9793F" />
        </g>
      ))}
      {/* stovetop appliance, sitting on the counter */}
      <rect x={56} y={78} width={100} height={30} rx={4} fill="#475569" stroke="#1E293B" strokeWidth={1.4} />
      <rect x={56} y={78} width={100} height={6} rx={3} fill="#64748B" />
      {[84, 128].map((x) => (
        <g key={x} className="stage-pulse" style={{ transformOrigin: `${x}px 96px` }}>
          <circle cx={x} cy={96} r={9} fill="#1E293B" stroke="#0F172A" strokeWidth={1.2} />
          <circle cx={x} cy={96} r={5.4} fill={`url(#${id}b)`} />
        </g>
      ))}
      {/* two mixing bowls with colourful fruit batter, waiting on the counter */}
      {BOWLS.map(([x, rim, fruit]) => (
        <g key={x}>
          <ellipse cx={x} cy={108} rx={20} ry={5} fill="#000" opacity={0.12} />
          <path d={`M${x - 19} 90 C${x - 19} 102 ${x + 19} 102 ${x + 19} 90 L${x + 16} 90 Q${x} 98 ${x - 16} 90 Z`} fill="#E2E8F0" stroke="#64748B" strokeWidth={1.4} strokeLinejoin="round" />
          <ellipse cx={x} cy={90} rx={19} ry={5} fill={rim} opacity={0.85} stroke="#64748B" strokeWidth={1.2} />
          <circle cx={x - 6} cy={89} r={2.6} fill={fruit} />
          <circle cx={x + 7} cy={91} r={2.2} fill={fruit} opacity={0.8} />
        </g>
      ))}
      {/* counter: an overhanging top slab above bright cabinet doors */}
      <rect x={-4} y={108} width={408} height={10} rx={2} fill={`url(#${id}top)`} stroke="#B9A47A" strokeWidth={1.4} />
      <rect x={0} y={116} width={W} height={48} fill={`url(#${id}cab)`} stroke="#B9A47A" strokeWidth={1.4} />
      {CABINET_COLORS.map((c, i) => (
        <g key={c}>
          <rect x={10 + i * 78} y={124} width={66} height={34} rx={5} fill={c} opacity={0.82} stroke="#00000022" strokeWidth={1.2} />
          <circle cx={10 + i * 78 + 58} cy={141} r={2.6} fill="#fff" opacity={0.85} />
        </g>
      ))}
      {/* floor: warm checker tiles */}
      <rect y={164} width={W} height={H - 164} fill="#F3E8D8" />
      <path d="M0 164 H400" stroke="#C9AE80" strokeWidth={1.4} opacity={0.6} />
      <g opacity={0.5} fill="#E3D2B4">
        {Array.from({ length: 10 }, (_, c) =>
          Array.from({ length: 3 }, (_, r) => ((r + c) % 2 === 0 ? <rect key={`${r}${c}`} x={c * 40} y={164 + r * 26} width={40} height={26} /> : null)),
        )}
      </g>
    </g>
  )
}

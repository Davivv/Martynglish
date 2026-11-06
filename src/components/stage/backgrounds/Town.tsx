import { useGid } from '../colors'
import { DriftCloud, H, W } from './shared'

const HOUSES: ReadonlyArray<readonly [number, number, number, string, string, boolean]> = [
  // x, width, height, wall, roof, gable
  [-6, 56, 98, '#F9A8D4', '#BE5A8A', false],
  [48, 46, 80, '#FDE68A', '#C9962A', true],
  [92, 54, 108, '#86EFAC', '#3E9A62', false],
  [144, 48, 86, '#93C5FD', '#4A78C0', true],
  [190, 52, 104, '#FDBA74', '#C9783A', false],
  [240, 50, 82, '#C4B5FD', '#7C65C8', true],
]

/** A sunny, modern street: colourful town houses, a cafe with an awning, a bike by a lamp post. */
export function Town() {
  const id = useGid()
  const base = 152
  return (
    <g>
      <defs>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5BC0F8" />
          <stop offset="1" stopColor="#DFF4FF" />
        </linearGradient>
        <linearGradient id={`${id}w`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#BAE6FD" />
          <stop offset="1" stopColor="#7DD3FC" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id}s)`} />
      <DriftCloud y={36} duration={90} delay={-20} />
      <DriftCloud y={66} scale={0.7} duration={120} delay={-80} opacity={0.5} />
      {HOUSES.map(([x, w, h, wall, roof, gable], i) => {
        const top = base - h
        return (
          <g key={x} strokeLinejoin="round">
            <rect x={x} y={top} width={w} height={h + 4} fill={wall} />
            <rect x={x} y={top} width={w} height={5} fill={roof} />
            {gable && <path d={`M${x - 2} ${top} L${x + w / 2} ${top - 16} L${x + w + 2} ${top} Z`} fill={roof} />}
            {[0, 1].map((c) =>
              [0, 1].map((r) => {
                const wx = x + 8 + c * ((w - 16) / 2 + 2)
                const wy = top + 14 + r * 30
                if (wy + 22 > base - 22) return null
                return (
                  <g key={`${c}${r}`}>
                    <rect x={wx} y={wy} width={(w - 22) / 2} height={20} rx={2} fill="#fff" />
                    <rect x={wx + 2} y={wy + 2} width={(w - 22) / 2 - 4} height={16} rx={1} fill={`url(#${id}w)`} />
                    <path d={`M${wx + (w - 22) / 4} ${wy + 2} v16`} stroke="#fff" strokeWidth={1} />
                    {r === 0 && i % 2 === 0 && <rect x={wx - 1} y={wy + 20} width={(w - 22) / 2 + 2} height={4} rx={1} fill="#C2410C" />}
                    {r === 0 && i % 2 === 0 && <path d={`M${wx + 2} ${wy + 20} q2 -4 4 0 q2 -4 4 0 q2 -4 4 0`} fill="#F472B6" stroke="#F472B6" strokeWidth={1.4} />}
                  </g>
                )
              }),
            )}
            <rect x={x + w / 2 - 6} y={base - 22} width={12} height={24} rx={2} fill={roof} />
            <circle cx={x + w / 2 + 3} cy={base - 10} r={1} fill="#FDE68A" />
          </g>
        )
      })}
      {/* the cafe */}
      <g strokeLinejoin="round">
        <rect x={296} y={base - 92} width={112} height={96} fill="#FFF3D6" />
        <rect x={296} y={base - 92} width={112} height={6} fill="#C0392B" />
        <rect x={304} y={base - 40} width={46} height={38} rx={3} fill="#2E6F86" />
        <rect x={307} y={base - 37} width={40} height={32} rx={2} fill="#FEF3C7" opacity={0.85} />
        <circle cx={327} cy={base - 21} r={7} fill="#fff" opacity={0.9} />
        <rect x={360} y={base - 44} width={22} height={44} rx={3} fill="#7C4A21" />
        <circle cx={377} cy={base - 20} r={1.4} fill="#FDE68A" />
        <path d={`M290 ${base - 58} L414 ${base - 58} L408 ${base - 78} L296 ${base - 78} Z`} fill="#fff" stroke="#9B1C1C" strokeWidth={1} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path key={i} d={`M${296 + i * 19 + (i > 0 ? 0 : 0)} ${base - 78} h9.5 l1 20 h-9.5 z`} fill="#EF4444" transform={`translate(${-i * 0.9} 0)`} />
        ))}
        <path d={`M290 ${base - 58} q6 8 12 0 q6 8 12 0 q6 8 12 0 q6 8 12 0 q6 8 12 0 q6 8 12 0 q6 8 12 0 q6 8 12 0 q6 8 12 0`} fill="#fff" stroke="#9B1C1C" strokeWidth={1} />
        <rect x={302} y={base - 90} width={96} height={11} rx={2} fill="#7C4A21" />
        <rect x={307} y={base - 87.5} width={86} height={6} rx={1} fill="#FDE68A" opacity={0.9} />
        <circle cx={340} cy={base - 84.5} r={2.6} fill="#EF4444" />
      </g>
      {/* ground */}
      <rect y={base} width={W} height={H - base} fill="#8A92A6" />
      <rect y={base} width={W} height={20} fill="#E8EAF0" />
      <path d={`M0 ${base + 20} H${W}`} stroke="#B3B9C9" strokeWidth={2.4} />
      <path d={`M40 ${base} V${base + 20} M110 ${base} V${base + 20} M180 ${base} V${base + 20} M250 ${base} V${base + 20} M320 ${base} V${base + 20} M390 ${base} V${base + 20}`} stroke="#CDD2DE" strokeWidth={1} />
      <path d={`M0 ${base + 56} H${W}`} stroke="#FDE68A" strokeWidth={2} strokeDasharray="22 16" opacity={0.85} />
      {/* lamp post and bike */}
      <g>
        <rect x={115} y={base - 70} width={3.4} height={74} rx={1.4} fill="#475569" />
        <path d={`M108 ${base - 70} h18 l-3 -10 h-12 z`} fill="#FDE68A" stroke="#475569" strokeWidth={1.4} strokeLinejoin="round" />
        <rect x={111} y={base - 2} width={11} height={4} rx={1} fill="#334155" />
      </g>
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx={70} cy={base + 12} r={12} stroke="#1F2937" strokeWidth={2.4} />
        <circle cx={104} cy={base + 12} r={12} stroke="#1F2937" strokeWidth={2.4} />
        <circle cx={70} cy={base + 12} r={1.8} fill="#9CA3AF" />
        <circle cx={104} cy={base + 12} r={1.8} fill="#9CA3AF" />
        <path d={`M70 ${base + 12} L83 ${base - 2} L98 ${base - 2} L104 ${base + 12} M83 ${base - 2} L88 ${base + 12} L70 ${base + 12} M98 ${base - 2} L96 ${base - 7} M92 ${base - 7} h9`} stroke="#EC4899" strokeWidth={2.6} />
        <path d={`M82 ${base - 3} l-1 -5 h6`} stroke="#1F2937" strokeWidth={2.4} />
        <rect x={104} y={base - 20} width={9} height={7} rx={1.5} fill="#FACC15" stroke="#B7791F" strokeWidth={1} transform={`rotate(10 108 ${base - 16})`} />
      </g>
    </g>
  )
}

import { useGid } from '../colors'
import { H, W } from './shared'

const MUGS = ['#EF4444', '#FACC15', '#22C55E', '#3B82F6', '#EC4899', '#F97316']

/** Cafe interior: counter, espresso machine, mug shelf, a big window and hanging lamps. */
export function Cafe() {
  const id = useGid()
  const tiles: string[] = []
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 21; c++) {
      if ((r + c) % 2 === 0) tiles.push(`M${c * 20 - 10} ${162 + r * 14}h20v14h-20z`)
    }
  }
  return (
    <g>
      <defs>
        <linearGradient id={`${id}w`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FDE9CC" />
          <stop offset="1" stopColor="#F6D3A6" />
        </linearGradient>
        <linearGradient id={`${id}v`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8EDBFF" />
          <stop offset="1" stopColor="#E3F6FF" />
        </linearGradient>
        <linearGradient id={`${id}c`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#A06A3C" />
          <stop offset="1" stopColor="#6E4524" />
        </linearGradient>
        <linearGradient id={`${id}m`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#E2E8F0" />
          <stop offset="0.5" stopColor="#F8FAFC" />
          <stop offset="1" stopColor="#94A3B8" />
        </linearGradient>
        <radialGradient id={`${id}g`}>
          <stop offset="0" stopColor="#FFE9A8" stopOpacity="0.75" />
          <stop offset="1" stopColor="#FFE9A8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id}w)`} />
      {/* teal wainscot */}
      <rect y={122} width={W} height={42} fill="#2F9488" />
      <rect y={122} width={W} height={4} fill="#1F6F66" />
      <path d="M0 144 H400" stroke="#3FB3A5" strokeWidth={1.4} opacity={0.7} />
      <g stroke="#1F6F66" strokeWidth={1} opacity={0.5}>
        {Array.from({ length: 14 }, (_, i) => (
          <path key={i} d={`M${i * 30 + 8} 126 V162`} />
        ))}
      </g>
      {/* big window */}
      <g strokeLinejoin="round">
        <rect x={20} y={34} width={132} height={96} rx={5} fill="#7A4A28" />
        <rect x={27} y={41} width={118} height={82} rx={2} fill={`url(#${id}v)`} />
        <path d="M27 123 V96 H44 V84 H58 V104 H76 V76 H94 V98 H112 V90 H126 V104 H145 V123 Z" fill="#A9C3E8" opacity={0.7} />
        <path d="M84 123 V100 M84 100 C74 98 72 86 80 80 C88 82 92 92 84 100" fill="#6FBF73" stroke="#4E9A58" strokeWidth={1.2} />
        <path d="M86 41 V123 M27 82 H145" stroke="#7A4A28" strokeWidth={3} />
        <path d="M34 44 L58 44 L36 80 Z M96 118 L118 118 L142 86 L120 86 Z" fill="#fff" opacity={0.28} />
        <rect x={16} y={128} width={140} height={6} rx={2} fill="#6A3E20" />
      </g>
      {/* counter */}
      <g strokeLinejoin="round">
        <rect x={222} y={116} width={190} height={54} rx={3} fill={`url(#${id}c)`} stroke="#4A2C14" strokeWidth={1.6} />
        <rect x={218} y={108} width={196} height={10} rx={3} fill="#F5E6CC" stroke="#8A6A3E" strokeWidth={1.4} />
        <g stroke="#4A2C14" strokeWidth={1} opacity={0.5}>
          <path d="M246 122 V168 M274 122 V168 M302 122 V168 M330 122 V168 M358 122 V168 M386 122 V168" />
        </g>
        {/* espresso machine */}
        <rect x={322} y={66} width={52} height={42} rx={5} fill={`url(#${id}m)`} stroke="#64748B" strokeWidth={1.4} />
        <rect x={322} y={66} width={52} height={9} rx={4} fill="#EF4444" stroke="#9B1C1C" strokeWidth={1} />
        <circle cx={334} cy={88} r={5} fill="#fff" stroke="#64748B" strokeWidth={1.2} />
        <path d="M334 88 l3 -3" stroke="#475569" strokeWidth={1.2} />
        <rect x={346} y={80} width={20} height={5} rx={1.4} fill="#475569" />
        <rect x={350} y={85} width={12} height={6} fill="#334155" />
        <rect x={348} y={97} width={16} height={11} rx={2} fill="#fff" stroke="#64748B" strokeWidth={1.2} />
        {/* cake dome */}
        <ellipse cx={262} cy={108} rx={25} ry={3.4} fill="#E2E8F0" stroke="#94A3B8" strokeWidth={1} />
        <path d="M239 108 C239 82 285 82 285 108 Z" fill="#DFF4FF" opacity={0.55} stroke="#94A3B8" strokeWidth={1.2} />
        <path d="M246 108 V98 H278 V108 Z" fill="#F9A8D4" stroke="#BE185D" strokeWidth={1} />
        <path d="M246 98 Q252 94 258 98 Q264 93 270 98 Q275 95 278 98 V100 H246 Z" fill="#fff" stroke="#BE185D" strokeWidth={0.8} />
        <circle cx={262} cy={86} r={2.2} fill="#94A3B8" />
        <path d="M247 92 Q250 86 258 85" stroke="#fff" strokeWidth={1.4} fill="none" opacity={0.7} strokeLinecap="round" />
      </g>
      {/* shelf with mugs */}
      <rect x={238} y={52} width={150} height={5} rx={1.4} fill="#7A4A28" />
      {MUGS.map((c, i) => (
        <g key={c}>
          <path d={`M${246 + i * 24} 52 l-1 -14 h14 l-1 14 z`} fill={c} stroke="#00000033" strokeWidth={0.8} strokeLinejoin="round" />
          <path d={`M${259 + i * 24} 42 q6 0 5 6 q-1 3 -5 3`} fill="none" stroke={c} strokeWidth={2} />
        </g>
      ))}
      {/* hanging lamps */}
      {[88, 200, 300].map((x) => (
        <g key={x}>
          <circle cx={x} cy={46} r={26} fill={`url(#${id}g)`} />
          <path d={`M${x} 0 V16`} stroke="#4A3320" strokeWidth={1.4} />
          <path d={`M${x - 11} 30 Q${x - 11} 16 ${x} 16 Q${x + 11} 16 ${x + 11} 30 Z`} fill="#F59E0B" stroke="#8A4B08" strokeWidth={1.4} strokeLinejoin="round" />
          <path d={`M${x - 7} 24 Q${x - 6} 19 ${x - 1} 18`} fill="none" stroke="#FDE68A" strokeWidth={1.2} strokeLinecap="round" />
          <ellipse cx={x} cy={30.4} rx={6} ry={2} fill="#FFF1B8" />
        </g>
      ))}
      {/* floor */}
      <rect y={162} width={W} height={H - 162} fill="#F7ECDA" />
      <path d={tiles.join('')} fill="#2F9488" opacity={0.85} />
      <rect y={162} width={W} height={3} fill="#1F6F66" opacity={0.6} />
    </g>
  )
}

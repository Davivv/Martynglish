import { useGid } from '../colors'
import { H, W } from './shared'

const BEAMS: ReadonlyArray<readonly [number, number, 'm' | 'c' | 'y', number]> = [
  // [lamp x, target x, colour key, delay]
  [40, 190, 'm', 0],
  [120, 250, 'c', -1.2],
  [200, 120, 'y', -2.4],
  [280, 170, 'm', -0.6],
  [360, 220, 'c', -1.8],
]
const BAR_HEIGHTS = [16, 30, 22, 38, 26, 42, 20, 34, 44, 24, 36, 18, 40, 28, 32, 14]
const CROWD_X = [8, 32, 58, 82, 108, 134, 158, 184, 210, 236, 262, 286, 312, 338, 362, 388]
const STICKS: ReadonlyArray<readonly [number, string]> = [
  [32, '#FF2EC4'], [108, '#22E5FF'], [158, '#FDE047'], [236, '#FF2EC4'], [286, '#22E5FF'], [338, '#FDE047'], [388, '#FF2EC4'],
]

function starPath(cx: number, cy: number, R: number): string {
  const pts: string[] = []
  for (let i = 0; i < 10; i++) {
    const a = (Math.PI / 5) * i - Math.PI / 2
    const r = i % 2 === 0 ? R : R * 0.45
    pts.push(`${(cx + Math.cos(a) * r).toFixed(1)} ${(cy + Math.sin(a) * r).toFixed(1)}`)
  }
  return `M${pts.join(' L')} Z`
}

/** Concert stage: LED screen with an equalizer, crossing spotlights, a crowd with light sticks. */
export function Concert() {
  const id = useGid()
  const beamColor = { m: '#FF4FD8', c: '#4DE8FF', y: '#FDE047' } as const
  return (
    <g>
      <defs>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0A0620" />
          <stop offset="1" stopColor="#35146E" />
        </linearGradient>
        <linearGradient id={`${id}l`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FF2EC4" />
          <stop offset="0.5" stopColor="#8B3DFF" />
          <stop offset="1" stopColor="#22D3EE" />
        </linearGradient>
        <linearGradient id={`${id}f`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3A1B80" />
          <stop offset="1" stopColor="#170B3C" />
        </linearGradient>
        {Object.entries(beamColor).map(([k, c]) => (
          <linearGradient key={k} id={`${id}${k}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={c} stopOpacity="0.55" />
            <stop offset="1" stopColor={c} stopOpacity="0" />
          </linearGradient>
        ))}
        <radialGradient id={`${id}p`}>
          <stop offset="0" stopColor="#FF4FD8" stopOpacity="0.55" />
          <stop offset="1" stopColor="#FF4FD8" stopOpacity="0" />
        </radialGradient>
        {['#FF2EC4', '#22E5FF', '#FDE047'].map((c) => (
          <radialGradient key={c} id={`${id}g${c.slice(1)}`}>
            <stop offset="0" stopColor={c} stopOpacity="0.9" />
            <stop offset="1" stopColor={c} stopOpacity="0" />
          </radialGradient>
        ))}
      </defs>
      <rect width={W} height={H} fill={`url(#${id}s)`} />
      {/* LED screen */}
      <rect x={90} y={26} width={220} height={96} rx={7} fill="#150B3A" stroke="#7C6BE8" strokeWidth={2} />
      <rect x={96} y={32} width={208} height={84} rx={4} fill={`url(#${id}l)`} />
      <path d={starPath(200, 66, 24)} fill="#fff" opacity={0.26} />
      <path d={starPath(200, 66, 12)} fill="#fff" opacity={0.3} />
      {BAR_HEIGHTS.map((h, i) => (
        <rect
          key={i}
          className="stage-eq"
          style={{ animationDuration: `${0.7 + (i % 5) * 0.17}s`, animationDelay: `${-(i % 7) * 0.2}s` }}
          x={104 + i * 12.5}
          y={110 - h}
          width={8}
          height={h}
          rx={1.6}
          fill={i % 3 === 0 ? '#FEF08A' : '#FFFFFF'}
          opacity={0.88}
        />
      ))}
      {/* speakers */}
      {[16, 346].map((x) => (
        <g key={x}>
          <rect x={x} y={86} width={38} height={72} rx={3} fill="#120A30" stroke="#4B3AA8" strokeWidth={1.4} />
          <circle cx={x + 19} cy={106} r={9} fill="#251659" stroke="#6D5BD0" strokeWidth={1.2} />
          <circle cx={x + 19} cy={106} r={3.6} fill="#6D5BD0" />
          <circle cx={x + 19} cy={134} r={11} fill="#251659" stroke="#6D5BD0" strokeWidth={1.2} />
          <circle cx={x + 19} cy={134} r={4.4} fill="#6D5BD0" />
        </g>
      ))}
      {/* spotlights from the truss */}
      {BEAMS.map(([lx, tx, key, delay]) => (
        <path
          key={lx}
          className="stage-beam"
          style={{ animationDelay: `${delay}s` }}
          d={`M${lx - 2.5} 18 L${lx + 2.5} 18 L${tx + 34} 176 L${tx - 34} 176 Z`}
          fill={`url(#${id}${key})`}
        />
      ))}
      <rect x={0} y={6} width={W} height={7} fill="#1B1250" stroke="#4B3AA8" strokeWidth={1} />
      <path d={`M0 13 L8 6 L16 13 L24 6 L32 13 L40 6 L48 13 L56 6 L64 13 L72 6 L80 13 L88 6 L96 13 L104 6 L112 13 L120 6 L128 13 L136 6 L144 13 L152 6 L160 13 L168 6 L176 13 L184 6 L192 13 L200 6 L208 13 L216 6 L224 13 L232 6 L240 13 L248 6 L256 13 L264 6 L272 13 L280 6 L288 13 L296 6 L304 13 L312 6 L320 13 L328 6 L336 13 L344 6 L352 13 L360 6 L368 13 L376 6 L384 13 L392 6 L400 13`} fill="none" stroke="#4B3AA8" strokeWidth={0.8} />
      {BEAMS.map(([lx, , key]) => (
        <g key={lx}>
          <circle cx={lx} cy={18} r={9} fill={`url(#${id}g${beamColor[key].slice(1)})`} />
          <circle cx={lx} cy={17} r={4.4} fill="#fff" stroke="#1B1250" strokeWidth={1.2} />
        </g>
      ))}
      {/* stage floor */}
      <path d="M0 152 H400 V196 H0 Z" fill={`url(#${id}f)`} />
      <path d="M0 152 H400" stroke="#8B7CF0" strokeWidth={1.4} opacity={0.8} />
      <ellipse cx={200} cy={166} rx={120} ry={16} fill={`url(#${id}p)`} />
      <path d="M0 192 H400" stroke="#22E5FF" strokeWidth={2.4} opacity={0.9} />
      <path d="M0 196 H400" stroke="#22E5FF" strokeWidth={6} opacity={0.18} />
      <path d="M60 152 L20 196 M140 152 L120 196 M260 152 L280 196 M340 152 L380 196" stroke="#6D5BD0" strokeWidth={0.8} opacity={0.4} />
      {/* crowd: back row, light sticks, front row */}
      <g fill="#150C3C">
        {CROWD_X.map((x, i) => (
          <g key={x}>
            <circle cx={x + 11} cy={207 + (i % 3) * 2} r={6} />
            <path d={`M${x} 226 Q${x} ${215 + (i % 3) * 2} ${x + 11} ${215 + (i % 3) * 2} Q${x + 22} ${215 + (i % 3) * 2} ${x + 22} 226 Z`} />
          </g>
        ))}
      </g>
      {STICKS.map(([x, c]) => (
        <g key={x} className="stage-sway" style={{ transformOrigin: `${x + 14}px 224px` }}>
          <circle cx={x + 18} cy={198} r={9} fill={`url(#${id}g${c.slice(1)})`} />
          <path d={`M${x + 14} 224 L${x + 18} 196`} stroke={c} strokeWidth={3} strokeLinecap="round" />
          <path d={`M${x + 14} 224 L${x + 16.6} 207`} stroke="#fff" strokeWidth={1} strokeLinecap="round" opacity={0.8} />
        </g>
      ))}
      <g fill="#0B0620">
        {CROWD_X.map((x, i) => (
          <g key={x}>
            <circle cx={x + 3} cy={224 + (i % 2) * 3} r={8} />
            <path d={`M${x - 11} 240 Q${x - 11} ${233 + (i % 2) * 3} ${x + 3} ${233 + (i % 2) * 3} Q${x + 17} ${233 + (i % 2) * 3} ${x + 17} 240 Z`} />
          </g>
        ))}
      </g>
    </g>
  )
}

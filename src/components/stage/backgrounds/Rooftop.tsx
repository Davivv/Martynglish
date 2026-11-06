import { useGid } from '../colors'
import { H, Twinkle, W } from './shared'
import { seeded, windowPaths } from './windows'

const SKYLINE: ReadonlyArray<readonly [number, number, number]> = [
  [0, 30, 42], [28, 24, 60], [50, 34, 36], [82, 26, 54], [106, 40, 30], [144, 28, 50], [170, 36, 38],
  [204, 26, 62], [228, 38, 34], [264, 30, 52], [292, 26, 40], [316, 36, 60], [350, 28, 34], [376, 30, 48],
]
const STARS = [[24, 14, 1.2], [70, 32, 1], [118, 10, 1.4], [168, 36, 1], [214, 14, 1.3], [262, 30, 1], [310, 12, 1.4], [372, 28, 1.1], [40, 58, 1], [150, 62, 1]] as const

/** Night rooftop: balustrade, water tank, antenna with a blinking light, a far-away glowing city. */
export function Rooftop() {
  const id = useGid()
  const rand = seeded(11)
  return (
    <g>
      <defs>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#090E2E" />
          <stop offset="0.6" stopColor="#32197A" />
          <stop offset="1" stopColor="#8A3FA8" />
        </linearGradient>
        <linearGradient id={`${id}f`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#343878" />
          <stop offset="1" stopColor="#171A45" />
        </linearGradient>
        <linearGradient id={`${id}t`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3C4084" />
          <stop offset="0.45" stopColor="#6169B8" />
          <stop offset="1" stopColor="#343878" />
        </linearGradient>
        <radialGradient id={`${id}h`} cx="50%" cy="100%" r="70%">
          <stop offset="0" stopColor="#FF6AD9" stopOpacity="0.5" />
          <stop offset="1" stopColor="#FF6AD9" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id}s)`} />
      {STARS.map(([x, y, r], i) => (
        <Twinkle key={x} x={x} y={y} r={r} delay={(i % 5) * 0.5} color={i % 3 === 0 ? '#FFE9A8' : '#fff'} />
      ))}
      <ellipse cx={200} cy={136} rx={260} ry={60} fill={`url(#${id}h)`} />
      {/* distant skyline, seen over the rail */}
      {SKYLINE.map(([x, w, h]) => (
        <g key={x}>
          <rect x={x} y={140 - h} width={w} height={h + 14} fill="#221A63" />
          {windowPaths(x, 140 - h, 140, w, ['#221A63', '#FDE68A', '#F9A8D4', '#67E8F9'], rand, 0.45).map(([c, d]) => (
            c === '#221A63' ? null : <path key={c} d={d} fill={c} opacity={0.85} />
          ))}
        </g>
      ))}
      {/* water tank */}
      <g strokeLinejoin="round">
        <path d="M44 114 L40 156 M72 114 L76 156 M58 114 V156" stroke="#2A2D68" strokeWidth={3} />
        <path d="M44 128 L72 144 M72 128 L44 144" stroke="#2A2D68" strokeWidth={1.6} />
        <rect x={38} y={68} width={40} height={48} rx={5} fill={`url(#${id}t)`} stroke="#23265E" strokeWidth={1.6} />
        <ellipse cx={58} cy={68} rx={20} ry={5} fill="#7078C8" stroke="#23265E" strokeWidth={1.4} />
        <path d="M38 82 H78 M38 100 H78" stroke="#23265E" strokeWidth={1.6} />
        <path d="M44 72 V112" stroke="#A4ACE8" strokeWidth={1.2} opacity={0.5} />
        <path d="M40 66 L58 52 L76 66 Z" fill="#4A4F98" stroke="#23265E" strokeWidth={1.4} />
      </g>
      {/* antenna */}
      <g>
        <path d="M338 156 L338 46" stroke="#2A2D68" strokeWidth={3} strokeLinecap="round" />
        <path d="M328 70 H348 M332 88 H344 M326 106 H350 M338 156 L322 122 M338 156 L354 122" stroke="#2A2D68" strokeWidth={1.8} strokeLinecap="round" />
        <circle className="stage-twinkle" cx={338} cy={44} r={3.6} fill="#FF5C7A" />
        <circle cx={338} cy={44} r={7} fill="#FF5C7A" opacity={0.2} />
      </g>
      {/* balustrade */}
      <g>
        <rect x={0} y={132} width={W} height={6} rx={2} fill="#4A4F98" />
        <rect x={0} y={132} width={W} height={2} fill="#8A92DA" opacity={0.7} />
        {Array.from({ length: 21 }, (_, i) => (
          <rect key={i} x={i * 20 + 4} y={138} width={5} height={16} fill="#3C4084" />
        ))}
        <rect x={0} y={152} width={W} height={5} fill="#343878" />
        {[0, 100, 200, 300, 396].map((x) => (
          <rect key={x} x={x - 3} y={126} width={9} height={31} rx={2} fill="#4A4F98" stroke="#23265E" strokeWidth={0.8} />
        ))}
      </g>
      {/* roof floor */}
      <rect y={157} width={W} height={H - 157} fill={`url(#${id}f)`} />
      <path d="M0 157 H400" stroke="#6C74C8" strokeWidth={1.4} opacity={0.7} />
      <path d="M0 176 H400 M0 200 H400 M60 157 L10 240 M150 157 L120 240 M250 157 L280 240 M340 157 L390 240" stroke="#4A4F98" strokeWidth={0.8} opacity={0.5} />
      <ellipse cx={200} cy={196} rx={120} ry={9} fill="#FF6AD9" opacity={0.08} />
    </g>
  )
}


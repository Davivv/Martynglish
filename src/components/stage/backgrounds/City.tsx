import { useGid } from '../colors'
import { DriftCloud, H, Twinkle, W } from './shared'
import { seeded, windowPaths } from './windows'

const FAR: ReadonlyArray<readonly [number, number, number]> = [
  [0, 38, 70], [34, 30, 96], [62, 40, 60], [100, 34, 88], [132, 44, 66], [172, 30, 102],
  [200, 38, 72], [236, 34, 94], [268, 42, 66], [306, 32, 106], [336, 40, 78], [372, 34, 90],
]
const NEAR: ReadonlyArray<readonly [number, number, number]> = [
  [-4, 56, 120], [54, 44, 92], [100, 38, 110], [142, 42, 84], [188, 36, 102],
  [228, 44, 88], [274, 42, 114], [320, 46, 96], [364, 44, 124],
]
const BASE = 152

/**
 * The same night city twice (D38): `lit` is full of neon and bright windows, `!lit` is the same
 * street with the lights out, cold and dark. The glow is made of gradients, not filters.
 */
export function City({ lit }: { lit: boolean }) {
  const id = useGid()
  const rand = seeded(7)
  const sky = lit ? ['#1B1464', '#4C1D95', '#BE2FC8'] : ['#04060F', '#0D1330', '#1F2851']
  const far = lit ? '#2A1F6B' : '#101530'
  const nearColors = lit ? ['#2B2677', '#382D8A', '#251F66'] : ['#171C38', '#1E2547', '#131830']
  const windowColors = lit ? ['#1B1650', '#FDE68A', '#67E8F9', '#F9A8D4', '#FDE68A'] : ['#0C1022', '#26335F', '#1E2950']
  const neonA = lit ? '#FF2EC4' : '#3B4468'
  const neonB = lit ? '#22E5FF' : '#33405F'
  return (
    <g>
      <defs>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sky[0]} />
          <stop offset="0.55" stopColor={sky[1]} />
          <stop offset="1" stopColor={sky[2]} />
        </linearGradient>
        <linearGradient id={`${id}r`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={lit ? '#2A2766' : '#161B36'} />
          <stop offset="1" stopColor={lit ? '#131238' : '#0A0E20'} />
        </linearGradient>
        <linearGradient id={`${id}a`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={neonA} stopOpacity="0" />
          <stop offset="0.5" stopColor={neonA} stopOpacity="0.5" />
          <stop offset="1" stopColor={neonA} stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={neonB} stopOpacity="0" />
          <stop offset="0.5" stopColor={neonB} stopOpacity="0.5" />
          <stop offset="1" stopColor={neonB} stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}m`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={neonA} stopOpacity="0.5" />
          <stop offset="1" stopColor={neonA} stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}n`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={neonB} stopOpacity="0.5" />
          <stop offset="1" stopColor={neonB} stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}l`}>
          <stop offset="0" stopColor="#FFE9A8" stopOpacity="0.8" />
          <stop offset="1" stopColor="#FFE9A8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}h`} cx="50%" cy="100%" r="70%">
          <stop offset="0" stopColor="#FF4FD8" stopOpacity="0.55" />
          <stop offset="1" stopColor="#FF4FD8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id}s)`} />
      {lit ? (
        <ellipse cx={200} cy={150} rx={280} ry={80} fill={`url(#${id}h)`} />
      ) : (
        <g>
          <circle cx={318} cy={44} r={30} fill="#CBD5F5" opacity={0.08} />
          <circle cx={318} cy={44} r={17} fill="#E8EEFF" />
          <circle cx={326} cy={39} r={15} fill="#0A1030" />
        </g>
      )}
      {[
        [30, 20, 1.2], [76, 46, 1], [124, 24, 1.4], [170, 56, 1], [214, 18, 1.2], [262, 40, 1.4], [352, 70, 1], [388, 30, 1.2], [100, 74, 1],
      ].map(([x, y, r], i) => (
        <Twinkle key={`${x}`} x={x} y={y} r={r} delay={(i % 5) * 0.5} color={lit ? '#FFE1FA' : '#C9D4FF'} />
      ))}
      {!lit && (
        <DriftCloud y={92} scale={1.4} duration={110} delay={-40} opacity={0.2} tint="#7C8BC4" />
      )}
      {/* far skyline */}
      {FAR.map(([x, w, h]) => (
        <rect key={x} x={x} y={BASE - h} width={w} height={h + 4} fill={far} opacity={lit ? 0.85 : 0.9} />
      ))}
      {/* near buildings */}
      {NEAR.map(([x, w, h], i) => {
        const top = BASE - h
        return (
          <g key={x}>
            <rect x={x} y={top} width={w} height={h + 6} fill={nearColors[i % 3]} />
            <rect x={x} y={top} width={w} height={2.4} fill={lit ? '#5648B8' : '#2A3460'} opacity={0.8} />
            {windowPaths(x, top, BASE, w, windowColors, rand, lit ? 0.62 : 0.05).map(([color, d]) => (
              <path key={color} d={d} fill={color} />
            ))}
          </g>
        )
      })}
      {/* neon: vertical tubes, roof outlines and their glow */}
      <g>
        <rect x={42} y={BASE - 118} width={26} height={118} fill={`url(#${id}a)`} />
        <rect x={53} y={BASE - 116} width={2} height={112} rx={1} fill={neonA} />
        <rect x={166} y={BASE - 100} width={30} height={100} fill={`url(#${id}b)`} />
        <rect x={180} y={BASE - 98} width={2} height={94} rx={1} fill={neonB} />
        <rect x={268} y={BASE - 112} width={24} height={112} fill={`url(#${id}a)`} />
        <rect x={347} y={BASE - 96} width={30} height={96} fill={`url(#${id}b)`} />
        <rect x={359} y={BASE - 94} width={2} height={90} rx={1} fill={neonB} />
        <path d={`M100 ${BASE - 110} H138`} stroke={neonB} strokeWidth={2.2} strokeLinecap="round" />
        <path d={`M228 ${BASE - 88} H272`} stroke={neonA} strokeWidth={2.2} strokeLinecap="round" />
      </g>
      {/* the sign with the neon star */}
      <g className={lit ? 'stage-neon' : undefined}>
        {lit && <ellipse cx={296} cy={72} rx={32} ry={26} fill={`url(#${id}l)`} opacity={0.35} />}
        <path d="M296 52 V58" stroke={lit ? '#9CA3C8' : '#3A4468'} strokeWidth={1.4} />
        <rect x={278} y={58} width={36} height={28} rx={5} fill={lit ? '#14103A' : '#0C1022'} stroke={neonA} strokeWidth={2.2} />
        <path
          d="M296 62.6 l3.2 6.6 l7.2 1 l-5.2 5.1 l1.2 7.2 l-6.4 -3.4 l-6.4 3.4 l1.2 -7.2 l-5.2 -5.1 l7.2 -1 z"
          fill={lit ? '#FDE047' : '#4A5273'}
          stroke={lit ? '#FFF7B0' : '#394261'}
          strokeWidth={0.9}
          strokeLinejoin="round"
        />
      </g>
      {/* sidewalk and wet street */}
      <rect y={BASE} width={W} height={H - BASE} fill={`url(#${id}r)`} />
      <rect y={BASE} width={W} height={16} fill={lit ? '#35317A' : '#1D2345'} />
      <rect y={BASE + 16} width={W} height={2.4} fill={lit ? '#6B5FD0' : '#2E3866'} opacity={0.8} />
      <path d={`M0 ${BASE + 6} H${W}`} stroke={lit ? '#4B43A0' : '#272F5A'} strokeWidth={1} />
      {lit && (
        <g>
          <rect x={44} y={BASE + 20} width={22} height={52} fill={`url(#${id}m)`} opacity={0.7} />
          <rect x={170} y={BASE + 20} width={22} height={52} fill={`url(#${id}n)`} opacity={0.7} />
          <rect x={268} y={BASE + 20} width={22} height={52} fill={`url(#${id}m)`} opacity={0.6} />
          <rect x={350} y={BASE + 20} width={22} height={52} fill={`url(#${id}n)`} opacity={0.6} />
          <ellipse cx={296} cy={BASE + 36} rx={26} ry={8} fill="#FDE047" opacity={0.16} />
        </g>
      )}
      <g stroke={lit ? '#B8B4FF' : '#6C78A8'} strokeWidth={1.6} strokeLinecap="round" opacity={lit ? 0.3 : 0.18} strokeDasharray="14 18">
        <path d={`M0 ${BASE + 52} H${W}`} />
      </g>
      <path d={`M0 ${BASE + 74} Q200 ${BASE + 66} ${W} ${BASE + 74}`} fill="none" stroke="#fff" strokeWidth={1} opacity={lit ? 0.12 : 0.06} />
      {/* street lamps */}
      {[78, 336].map((x) => (
        <g key={x}>
          {lit && <circle cx={x} cy={BASE - 36} r={26} fill={`url(#${id}l)`} />}
          <rect x={x - 1.4} y={BASE - 34} width={2.8} height={36} fill={lit ? '#4B5190' : '#2A3050'} />
          <path d={`M${x - 6} ${BASE - 34} h12 l-2 -5 h-8 z`} fill={lit ? '#FFE9A8' : '#3A4264'} />
        </g>
      ))}
    </g>
  )
}

export function NeonCity() {
  return <City lit />
}

export function DarkCity() {
  return <City lit={false} />
}

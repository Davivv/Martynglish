import type { CharacterMood } from '../../../types/story'

const INK = '#2a1a33'

interface EyesProps {
  /** Centres of the two eyes. */
  x1: number
  x2: number
  y: number
  r: number
  mood: CharacterMood
  /** Colour of the iris. When set, a dark pupil is drawn inside. */
  iris?: string
  /** Colour of the eyelid (the fur colour) used for the sleepy mood. */
  lid: string
  /** Lighter ring around the eye, needed on dark patches (panda). */
  ring?: string
}

function Eye({ cx, cy, r, mood, iris, lid, ring }: Omit<EyesProps, 'x1' | 'x2' | 'y'> & { cx: number; cy: number }) {
  const ry = r * 1.12
  return (
    <g>
      {ring && <ellipse cx={cx} cy={cy} rx={r * 1.22} ry={ry * 1.2} fill={ring} />}
      <ellipse cx={cx} cy={cy} rx={r} ry={ry} fill={iris ?? INK} />
      {iris && (
        <>
          <ellipse cx={cx} cy={cy + r * 0.1} rx={r * 0.62} ry={ry * 0.7} fill={INK} />
          <ellipse cx={cx} cy={cy + ry * 0.62} rx={r * 0.7} ry={ry * 0.3} fill="#ffffff" opacity={0.28} />
        </>
      )}
      <circle cx={cx - r * 0.32} cy={cy - ry * 0.34} r={r * 0.38} fill="#fff" />
      <circle cx={cx + r * 0.38} cy={cy + ry * 0.32} r={r * 0.17} fill="#fff" />
      {mood === 'excited' && (
        <path
          d={`M${cx + r * 0.5} ${cy - ry * 0.55} l${r * 0.1} ${r * 0.22} l${r * 0.22} ${r * 0.1} l-${r * 0.22} ${r * 0.1} l-${r * 0.1} ${r * 0.22} l-${r * 0.1} -${r * 0.22} l-${r * 0.22} -${r * 0.1} l${r * 0.22} -${r * 0.1} z`}
          fill="#fff"
          opacity={0.9}
        />
      )}
      {mood === 'sleepy' && (
        <>
          <path
            d={`M${cx - r * 1.3} ${cy - ry * 1.5} L${cx + r * 1.3} ${cy - ry * 1.5} L${cx + r * 1.3} ${cy - ry * 0.05} Q${cx} ${cy + ry * 0.55} ${cx - r * 1.3} ${cy - ry * 0.05} Z`}
            fill={lid}
          />
          <path
            d={`M${cx - r * 1.15} ${cy - ry * 0.02} Q${cx} ${cy + ry * 0.55} ${cx + r * 1.15} ${cy - ry * 0.02}`}
            fill="none"
            stroke={INK}
            strokeWidth={1.4}
            strokeLinecap="round"
          />
        </>
      )}
    </g>
  )
}

/** Two big glossy eyes that blink (CSS `.stage-blink`). */
export function Eyes(props: EyesProps) {
  const { x1, x2, y, r, mood } = props
  const curious = mood === 'curious'
  const size = mood === 'excited' ? r * 1.12 : r
  return (
    <g className="stage-blink">
      <Eye {...props} cx={x1} cy={y} r={curious ? size * 0.92 : size} />
      <Eye {...props} cx={x2} cy={curious ? y - 0.5 : y} r={curious ? size * 1.1 : size} />
    </g>
  )
}

interface BrowsProps {
  x1: number
  x2: number
  y: number
  w: number
  mood: CharacterMood
  color: string
}

/** Small expressive brows: one is raised when curious, both lifted when excited. */
export function Brows({ x1, x2, y, w, mood, color }: BrowsProps) {
  if (mood === 'sleepy') return null
  const stroke = { fill: 'none', stroke: color, strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' } as const
  if (mood === 'brave' || mood === 'worried') {
    // Brave: outer ends high, brows slant down to the nose. Worried: the inner ends are lifted.
    const outer = mood === 'brave' ? -1.8 : 1.4
    const inner = mood === 'brave' ? 1.4 : -2.2
    const half = w / 2
    return (
      <g>
        <path d={`M${x1 - half} ${y + outer} L${x1 + half} ${y + inner}`} {...stroke} />
        <path d={`M${x2 + half} ${y + outer} L${x2 - half} ${y + inner}`} {...stroke} />
      </g>
    )
  }
  const lift = mood === 'excited' ? -2 : 0
  const left = mood === 'curious' ? 0 : lift
  const right = mood === 'curious' ? -4 : lift
  const brow = (x: number, dy: number) => (
    <path d={`M${x - w / 2} ${y + dy + 1} Q${x} ${y + dy - 2} ${x + w / 2} ${y + dy + 1}`} {...stroke} />
  )
  return (
    <g>
      {brow(x1, left)}
      {brow(x2, right)}
    </g>
  )
}

interface MouthProps {
  x: number
  y: number
  /** Half width of a smile. */
  w: number
  mood: CharacterMood
  /** Cat "w" mouth instead of a plain smile. */
  cat?: boolean
  tongue?: string
}

export function Mouth({ x, y, w, mood, cat, tongue = '#FF8FA3' }: MouthProps) {
  const line = { fill: 'none', stroke: INK, strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' } as const
  if (mood === 'excited') {
    return (
      <g>
        <path
          d={`M${x - w} ${y - 1} Q${x} ${y + 1} ${x + w} ${y - 1} Q${x + w * 0.8} ${y + w * 1.25} ${x} ${y + w * 1.25} Q${x - w * 0.8} ${y + w * 1.25} ${x - w} ${y - 1} Z`}
          fill="#7B1E3A"
          stroke={INK}
          strokeWidth={1.4}
          strokeLinejoin="round"
        />
        <ellipse cx={x} cy={y + w * 0.95} rx={w * 0.5} ry={w * 0.3} fill={tongue} />
      </g>
    )
  }
  if (mood === 'curious') {
    return <ellipse cx={x} cy={y + 2} rx={w * 0.32} ry={w * 0.42} fill="#7B1E3A" stroke={INK} strokeWidth={1.2} />
  }
  if (mood === 'sleepy') {
    return <path d={`M${x - w * 0.6} ${y + 1} Q${x} ${y + w * 0.6} ${x + w * 0.6} ${y + 1}`} {...line} />
  }
  if (mood === 'worried') {
    return <path d={`M${x - w * 0.6} ${y + 2.4} Q${x} ${y - 0.6} ${x + w * 0.6} ${y + 2.4}`} {...line} />
  }
  if (mood === 'brave') {
    return <path d={`M${x - w} ${y} Q${x} ${y + w * 1.25} ${x + w} ${y - 1.4}`} {...line} />
  }
  if (cat) {
    return <path d={`M${x - w} ${y - 1} Q${x - w * 0.5} ${y + w * 0.9} ${x} ${y - 1} Q${x + w * 0.5} ${y + w * 0.9} ${x + w} ${y - 1}`} {...line} />
  }
  return <path d={`M${x - w} ${y - 1} Q${x} ${y + w * 1.1} ${x + w} ${y - 1}`} {...line} />
}

export function Blush({ x1, x2, y, r = 4.5 }: { x1: number; x2: number; y: number; r?: number }) {
  return (
    <g fill="#FF6F91" opacity={0.42}>
      <ellipse cx={x1} cy={y} rx={r} ry={r * 0.68} />
      <ellipse cx={x2} cy={y} rx={r} ry={r * 0.68} />
    </g>
  )
}

/** Small mood decorations around the hero: sleepy "z", excited sparkles, curious "?". */
export function MoodFx({ mood }: { mood: CharacterMood }) {
  if (mood === 'sleepy') {
    return (
      <g className="stage-zzz" fill="#5b6bbf" fontWeight={800} fontFamily="'Lexend Variable', system-ui, sans-serif">
        <text x={80} y={18} fontSize={11}>z</text>
        <text x={88} y={8} fontSize={8}>z</text>
      </g>
    )
  }
  if (mood === 'excited') {
    const spark = (x: number, y: number, s: number, d: string) => (
      <path
        className="stage-twinkle"
        style={{ animationDelay: d }}
        d={`M${x} ${y - s} Q${x + s * 0.2} ${y - s * 0.2} ${x + s} ${y} Q${x + s * 0.2} ${y + s * 0.2} ${x} ${y + s} Q${x - s * 0.2} ${y + s * 0.2} ${x - s} ${y} Q${x - s * 0.2} ${y - s * 0.2} ${x} ${y - s} Z`}
        fill="#FFD43B"
        stroke="#E8A400"
        strokeWidth={0.6}
      />
    )
    return (
      <g>
        {spark(-2, 24, 5, '0s')}
        {spark(103, 30, 4, '0.5s')}
        {spark(98, 8, 3, '0.9s')}
      </g>
    )
  }
  if (mood === 'worried') {
    return (
      <path
        className="stage-twinkle"
        d="M84 8 C87 13 89 15.6 89 18.2 C89 21 86.8 22.6 84 22.6 C81.2 22.6 79 21 79 18.2 C79 15.6 81 13 84 8 Z"
        fill="#8fd3ff"
        stroke="#3b8fd0"
        strokeWidth={1}
      />
    )
  }
  if (mood === 'curious') {
    return (
      <text
        className="stage-twinkle"
        x={86}
        y={16}
        fontSize={15}
        fontWeight={800}
        fill="#7c5cd6"
        fontFamily="'Lexend Variable', system-ui, sans-serif"
      >
        ?
      </text>
    )
  }
  return null
}

import { Boy } from '../characters/Boy'
import { isBoyLookKey } from '../characters/boyLooks'
import { colorOf, darken, lighten, useGid } from '../colors'
import type { PropProps } from '../types'

/**
 * Props of the Friends crew (D44), flat bright creator-studio style. Like the other props they
 * are drawn around (0, 0), and `OBJECT_BOX` in layout.ts says how far the base is below the
 * centre.
 */

/** A boy friend standing beside the hero: the same figure as the boy heroes, in his own colours. */
export function BoyFriend({ variant }: PropProps) {
  const look = isBoyLookKey(variant) ? variant : 'promyk'
  return (
    <g transform="translate(-50 -50)">
      <ellipse cx={50} cy={99} rx={24} ry={5} fill="#1a3a22" opacity={0.18} />
      <Boy look={look} pose="stand" />
    </g>
  )
}

/** A small vlogging camera on a folding tripod, lens forward, a red tally light on top. */
export function CameraBlack() {
  const id = useGid()
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#475569" />
          <stop offset="1" stopColor="#1E293B" />
        </linearGradient>
        <radialGradient id={`${id}l`} cx="38%" cy="35%" r="75%">
          <stop offset="0" stopColor="#64748B" />
          <stop offset="0.6" stopColor="#334155" />
          <stop offset="1" stopColor="#0F172A" />
        </radialGradient>
      </defs>
      <ellipse cx={0} cy={23} rx={20} ry={2.8} fill="#000" opacity={0.15} />
      {/* tripod */}
      <path d="M0 -4 L-18 22 M0 -4 L0 22 M0 -4 L18 22" fill="none" stroke="#1E293B" strokeWidth={2.6} />
      <path d="M-18 22 L-22 22 M0 22 L0 18 M18 22 L22 22" stroke="#334155" strokeWidth={2} />
      {/* body */}
      <rect x={-14} y={-14} width={28} height={18} rx={3} fill={`url(#${id})`} stroke="#0F172A" strokeWidth={1.4} />
      <rect x={-14} y={-10} width={4} height={10} rx={1.4} fill="#334155" />
      {/* lens */}
      <circle cx={8} cy={-5} r={10} fill={`url(#${id}l)`} stroke="#0F172A" strokeWidth={1.4} />
      <circle cx={8} cy={-5} r={5.6} fill="#0B1220" />
      <ellipse cx={5.4} cy={-7.6} rx={1.8} ry={1.1} fill="#fff" opacity={0.5} transform="rotate(-30 5.4 -7.6)" />
      {/* flip screen */}
      <rect x={-18} y={-18} width={9} height={7} rx={1.4} fill="#E2E8F0" stroke="#0F172A" strokeWidth={1.2} transform="rotate(-8 -13.5 -14.5)" />
      <rect x={-17} y={-17} width={7} height={5} fill="#38BDF8" opacity={0.85} transform="rotate(-8 -13.5 -14.5)" />
      {/* tally light */}
      <circle className="stage-twinkle" cx={-10} cy={-16} r={1.6} fill="#EF4444" />
    </g>
  )
}

/** The Friends hoodie, laid out with sleeves open, a drawstring hood and a little heart tag. */
export function HoodieOrange({ variant }: PropProps) {
  const id = useGid()
  const base = colorOf(variant, '#F97316')
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={lighten(base, 0.3)} />
          <stop offset="0.55" stopColor={base} />
          <stop offset="1" stopColor={darken(base, 0.22)} />
        </linearGradient>
      </defs>
      <ellipse cx={0} cy={21} rx={24} ry={3} fill="#000" opacity={0.14} />
      {/* sleeves */}
      <path d="M-14 -12 L-30 -2 L-26 8 L-12 0 Z" fill={`url(#${id})`} stroke={darken(base, 0.5)} strokeWidth={1.4} />
      <path d="M14 -12 L30 -2 L26 8 L12 0 Z" fill={`url(#${id})`} stroke={darken(base, 0.5)} strokeWidth={1.4} />
      <path d="M-28 -3 L-24 5 M24 -3 L28 5" stroke={darken(base, 0.35)} strokeWidth={0.8} opacity={0.6} />
      {/* body */}
      <path d="M-16 -14 Q0 -18 16 -14 L18 16 Q0 20 -18 16 Z" fill={`url(#${id})`} stroke={darken(base, 0.5)} strokeWidth={1.6} />
      <rect x={-18} y={13} width={36} height={5} rx={2} fill={darken(base, 0.18)} />
      {/* hood */}
      <path d="M-9 -14 Q0 -24 9 -14 Q4 -10 0 -10 Q-4 -10 -9 -14 Z" fill={darken(base, 0.1)} stroke={darken(base, 0.5)} strokeWidth={1.2} />
      <path d="M-2 -12 L-3.4 2 M2 -12 L3.4 2" stroke={darken(base, 0.45)} strokeWidth={1} strokeLinecap="round" />
      <circle cx={-3.4} cy={3} r={1.2} fill="#fff" stroke={darken(base, 0.4)} strokeWidth={0.5} />
      <circle cx={3.4} cy={3} r={1.2} fill="#fff" stroke={darken(base, 0.4)} strokeWidth={0.5} />
      {/* little heart badge, the crew mark */}
      <path d="M0 2.4 C-3 -1 -7 1.4 -5 5 C-3.4 7.6 0 9.6 0 9.6 C0 9.6 3.4 7.6 5 5 C7 1.4 3 -1 0 2.4 Z" fill="#fff" opacity={0.92} />
    </g>
  )
}

/** A bright studio ring light on a stand, glowing warm when the scene is tappable. */
export function LightWhite() {
  const id = useGid()
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <defs>
        <radialGradient id={`${id}g`}>
          <stop offset="0" stopColor="#FFF7D6" stopOpacity="0.9" />
          <stop offset="1" stopColor="#FFF7D6" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}r`} cx="40%" cy="35%" r="75%">
          <stop offset="0" stopColor="#FFFDF2" />
          <stop offset="1" stopColor="#FDE68A" />
        </radialGradient>
      </defs>
      <ellipse cx={0} cy={30} rx={13} ry={2.4} fill="#000" opacity={0.14} />
      {/* stand */}
      <path d="M-6 30 L6 30 L3 30 L3 -2 M-3 -2 L-3 30" stroke="#64748B" strokeWidth={0} fill="none" />
      <path d="M0 30 V-4" stroke="#334155" strokeWidth={2.6} />
      <path d="M-9 30 H9" stroke="#1E293B" strokeWidth={3} strokeLinecap="round" />
      <path d="M-5 30 L-9 20 M5 30 L9 20" stroke="#334155" strokeWidth={2.2} />
      {/* ring light */}
      <g className="stage-pulse" style={{ transformOrigin: '0px -20px' }}>
        <circle cx={0} cy={-20} r={24} fill={`url(#${id}g)`} />
        <circle cx={0} cy={-20} r={13} fill={`url(#${id}r)`} stroke="#CA8A04" strokeWidth={1.6} />
        <circle cx={0} cy={-20} r={7.6} fill="#0F172A" opacity={0.85} />
        <circle cx={0} cy={-20} r={13} fill="none" stroke="#fff" strokeWidth={0.8} opacity={0.5} />
        <g stroke="#CA8A04" strokeWidth={0.7} opacity={0.6}>
          {Array.from({ length: 8 }, (_, i) => {
            const a = (Math.PI / 4) * i
            const x1 = Math.cos(a) * 8.4
            const y1 = -20 + Math.sin(a) * 8.4
            const x2 = Math.cos(a) * 12.4
            const y2 = -20 + Math.sin(a) * 12.4
            return <path key={i} d={`M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}`} />
          })}
        </g>
      </g>
      <path d="M-2.4 -2 L2.4 -2 L1.4 4 L-1.4 4 Z" fill="#334155" />
    </g>
  )
}

/** `hat-yellow`: Iskierka's sun hat, a wide floppy brim and a rounded crown with a little bow. */
export function HatYellow({ variant }: PropProps) {
  const id = useGid()
  const base = colorOf(variant, '#FACC15')
  return (
    <g strokeLinejoin="round" strokeLinecap="round" className="stage-sway" style={{ transformOrigin: '0px 4px' }}>
      <defs>
        <radialGradient id={id} cx="38%" cy="30%" r="80%">
          <stop offset="0" stopColor={lighten(base, 0.4)} />
          <stop offset="0.6" stopColor={base} />
          <stop offset="1" stopColor={darken(base, 0.25)} />
        </radialGradient>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={lighten(base, 0.3)} />
          <stop offset="1" stopColor={darken(base, 0.2)} />
        </linearGradient>
      </defs>
      <ellipse cx={0} cy={18} rx={22} ry={3} fill="#000" opacity={0.14} />
      {/* wide floppy brim */}
      <ellipse cx={0} cy={10} rx={24} ry={8} fill={`url(#${id}b)`} stroke={darken(base, 0.5)} strokeWidth={1.5} />
      <ellipse cx={0} cy={10} rx={24} ry={8} fill="none" stroke="#fff" strokeWidth={0.8} opacity={0.4} />
      {/* rounded crown */}
      <path d="M-13 8 C-15 -10 -9 -18 0 -18 C9 -18 15 -10 13 8 Z" fill={`url(#${id})`} stroke={darken(base, 0.5)} strokeWidth={1.6} />
      {/* band with a little bow */}
      <rect x={-13} y={2} width={26} height={6} rx={3} fill={darken(base, 0.1)} stroke={darken(base, 0.5)} strokeWidth={1} />
      <path
        d="M-3 5 C-6 2 -10 4 -9 7 C-8 9.4 -3 10.6 -3 10.6 C-3 10.6 3 9.4 4 7 C5 4 1 2 -3 5 Z"
        fill="#fff"
        opacity={0.92}
        transform="translate(6 -1) scale(0.7)"
      />
      <ellipse cx={-5} cy={-10} rx={4} ry={2.4} fill="#fff" opacity={0.5} transform="rotate(-20 -5 -10)" />
    </g>
  )
}

/** `blanket-red`: the park picnic blanket, a red-and-cream gingham check with a scalloped edge. */
export function BlanketRed({ variant }: PropProps) {
  const id = useGid()
  const base = colorOf(variant, '#EF4444')
  const cream = '#FFF7ED'
  const shape = 'M-30 -2 Q0 -14 30 -2 L26 14 Q0 22 -26 14 Z'
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={lighten(base, 0.1)} />
          <stop offset="1" stopColor={darken(base, 0.15)} />
        </linearGradient>
        <clipPath id={`${id}c`}>
          <path d={shape} />
        </clipPath>
      </defs>
      <ellipse cx={0} cy={18} rx={32} ry={4} fill="#000" opacity={0.12} />
      <path d={shape} fill={`url(#${id})`} stroke={darken(base, 0.45)} strokeWidth={1.6} />
      {/* gingham check: cream stripes crossing over the red base */}
      <g clipPath={`url(#${id}c)`}>
        {Array.from({ length: 6 }, (_, c) => (
          <rect key={`c${c}`} x={-32 + c * 11} y={-16} width={11} height={40} fill={cream} opacity={c % 2 === 0 ? 0.55 : 0} />
        ))}
        {Array.from({ length: 4 }, (_, r) => (
          <rect key={`r${r}`} x={-34} y={-14 + r * 9} width={70} height={9} fill={cream} opacity={r % 2 === 0 ? 0 : 0.55} />
        ))}
      </g>
      <path d="M-30 -2 Q0 -14 30 -2" fill="none" stroke="#fff" strokeWidth={0.8} opacity={0.4} />
      {/* scalloped fringe along the front edge */}
      <g fill={darken(base, 0.2)}>
        {Array.from({ length: 9 }, (_, i) => (
          <circle key={i} cx={-24 + i * 6} cy={13 + Math.abs(i - 4) * 0.6} r={1.6} />
        ))}
      </g>
    </g>
  )
}

const BRACELET_CORD = '#F3E3C7'

/** `bracelet-*`: a friendship bracelet, a braided cord with colourful beads threaded around it. */
export function Bracelet({ variant }: PropProps) {
  const id = useGid()
  const base = colorOf(variant, '#EC4899')
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <defs>
        <radialGradient id={id} cx="35%" cy="30%" r="80%">
          <stop offset="0" stopColor={lighten(base, 0.45)} />
          <stop offset="0.55" stopColor={base} />
          <stop offset="1" stopColor={darken(base, 0.28)} />
        </radialGradient>
      </defs>
      <ellipse cx={0} cy={13} rx={13} ry={2.6} fill="#000" opacity={0.12} />
      {/* braided cord loop */}
      <circle cx={0} cy={0} r={13} fill="none" stroke={BRACELET_CORD} strokeWidth={4.4} />
      <circle cx={0} cy={0} r={13} fill="none" stroke={darken(BRACELET_CORD, 0.1)} strokeWidth={1} strokeDasharray="2 3" opacity={0.6} />
      {/* colourful beads threaded on the cord */}
      {Array.from({ length: 8 }, (_, i) => {
        const a = (Math.PI / 4) * i - Math.PI / 2
        const x = Math.cos(a) * 13
        const y = Math.sin(a) * 13
        return <circle key={i} cx={x} cy={y} r={3} fill={`url(#${id})`} stroke={darken(base, 0.4)} strokeWidth={0.8} />
      })}
      <ellipse cx={-4} cy={-11} rx={2.2} ry={1.2} fill="#fff" opacity={0.6} transform="rotate(-30 -4 -11)" />
    </g>
  )
}

/** Marti's small blue travel suitcase: rounded shell, a telescoping handle and two wheels. */
export function SuitcaseBlue({ variant }: PropProps) {
  const id = useGid()
  const base = colorOf(variant, '#0EA5E9')
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={lighten(base, 0.3)} />
          <stop offset="0.5" stopColor={base} />
          <stop offset="1" stopColor={darken(base, 0.25)} />
        </linearGradient>
      </defs>
      <ellipse cx={0} cy={19} rx={18} ry={2.6} fill="#000" opacity={0.15} />
      {/* handle */}
      <path d="M-4 -22 V-12 M4 -22 V-12" stroke="#475569" strokeWidth={2.4} />
      <rect x={-6} y={-24.4} width={12} height={4.4} rx={2.2} fill="#64748B" stroke="#334155" strokeWidth={1} />
      {/* shell */}
      <rect x={-18} y={-12} width={36} height={30} rx={7} fill={`url(#${id})`} stroke={darken(base, 0.5)} strokeWidth={1.6} />
      <path d="M-18 2 H18" stroke={darken(base, 0.5)} strokeWidth={1.2} opacity={0.6} />
      <rect x={-6} y={-6} width={12} height={9} rx={2} fill={lighten(base, 0.45)} stroke={darken(base, 0.45)} strokeWidth={1} />
      <path d="M-14 -8 V14 M14 -8 V14" stroke={lighten(base, 0.35)} strokeWidth={1} opacity={0.6} />
      {/* wheels */}
      {[-10, 10].map((x) => (
        <circle key={x} cx={x} cy={17.6} r={3.2} fill="#334155" stroke="#0F172A" strokeWidth={1} />
      ))}
      {/* ribbon tag */}
      <path d="M12 -12 L18 -18 L18 -9 Z" fill="#F8FAFC" stroke={darken(base, 0.5)} strokeWidth={1} />
    </g>
  )
}

import { Girl } from '../characters/Girl'
import { isGirlLookKey } from '../characters/looks'
import { darken, lighten, useGid } from '../colors'
import type { PropProps } from '../types'

/**
 * Props of the older-kids stories (D38). Like the other props they are drawn around (0, 0), and
 * `OBJECT_BOX` in layout.ts says how far the base is below the centre.
 */

/** A friend standing beside the hero: the same figure as the heroine, in her own colours. */
export function GirlFriend({ variant }: PropProps) {
  const look = isGirlLookKey(variant) ? variant : 'hana'
  return (
    <g transform="translate(-50 -50)">
      <ellipse cx={50} cy={99} rx={24} ry={5} fill="#1a3a22" opacity={0.18} />
      <Girl look={look} pose="stand" />
    </g>
  )
}

/** `shadow-big`: tall, soft, wavy smoke with two glowing eyes. Friendly, no teeth, no claws. */
export function Shadow({ variant }: PropProps) {
  const id = useGid()
  if (variant === 'small') return <ShadowSmall id={id} />
  return (
    <g className="stage-sway" style={{ transformOrigin: '0px 50px' }}>
      <defs>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8B5CF6" stopOpacity="0.95" />
          <stop offset="0.6" stopColor="#5B21B6" stopOpacity="0.95" />
          <stop offset="1" stopColor="#3B0F7A" stopOpacity="0.8" />
        </linearGradient>
        <radialGradient id={`${id}e`}>
          <stop offset="0" stopColor="#FEF9C3" stopOpacity="0.95" />
          <stop offset="1" stopColor="#FDE047" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path
        d="M0 -50 C13 -50 20 -39 19 -27 C18 -15 26 -8 28 6 C30 20 25 33 31 44 C25 49 21 43 15 48 C10 53 6 45 0 50 C-6 45 -10 53 -15 48 C-21 43 -25 49 -31 44 C-25 33 -30 20 -28 6 C-26 -8 -18 -15 -19 -27 C-20 -39 -13 -50 0 -50 Z"
        fill={`url(#${id}b)`}
        stroke="#2E1065"
        strokeWidth={1.4}
        strokeLinejoin="round"
        strokeOpacity={0.6}
      />
      <path d="M-14 -16 C-17 -4 -14 12 -16 30 M12 -10 C15 4 13 18 15 34" fill="none" stroke="#C4B5FD" strokeWidth={1.4} strokeLinecap="round" opacity={0.35} />
      <g className="stage-bob" fill="#A78BFA" opacity={0.5}>
        <ellipse cx={-30} cy={22} rx={9} ry={5} />
        <ellipse cx={31} cy={14} rx={9} ry={5} />
      </g>
      <circle cx={-8} cy={-30} r={11} fill={`url(#${id}e)`} />
      <circle cx={8} cy={-30} r={11} fill={`url(#${id}e)`} />
      <g className="stage-blink">
        <ellipse cx={-8} cy={-30} rx={3.8} ry={5} fill="#FEF08A" />
        <ellipse cx={8} cy={-30} rx={3.8} ry={5} fill="#FEF08A" />
        <ellipse cx={-7.4} cy={-28.6} rx={1.6} ry={2.3} fill="#4C1D95" />
        <ellipse cx={8.6} cy={-28.6} rx={1.6} ry={2.3} fill="#4C1D95" />
        <circle cx={-9} cy={-32} r={1.1} fill="#fff" />
        <circle cx={7} cy={-32} r={1.1} fill="#fff" />
      </g>
    </g>
  )
}

function ShadowSmall({ id }: { id: string }) {
  return (
    <g className="stage-bob">
      <defs>
        <radialGradient id={`${id}s`} cx="40%" cy="30%" r="80%">
          <stop offset="0" stopColor="#A78BFA" />
          <stop offset="1" stopColor="#5B21B6" />
        </radialGradient>
      </defs>
      <path d="M-15 3 C-17 -9 -8 -16 0 -16 C9 -16 17 -9 15 3 C17 8 12 14 9 10 C6 16 3 11 0 15 C-3 11 -6 16 -9 10 C-12 14 -17 8 -15 3 Z" fill={`url(#${id}s)`} stroke="#3B0F7A" strokeWidth={1.2} strokeLinejoin="round" strokeOpacity={0.7} />
      <path d="M13 -2 C20 -4 22 -10 18 -13" fill="none" stroke="#7C3AED" strokeWidth={3} strokeLinecap="round" opacity={0.8} />
      <g className="stage-blink">
        <ellipse cx={-5.2} cy={-3.5} rx={4.4} ry={5} fill="#fff" />
        <ellipse cx={5.2} cy={-3.5} rx={4.4} ry={5} fill="#fff" />
        <circle cx={-4.4} cy={-2.8} r={2.2} fill="#2E1065" />
        <circle cx={5.8} cy={-2.8} r={2.2} fill="#2E1065" />
        <circle cx={-5.2} cy={-4.2} r={0.9} fill="#fff" />
        <circle cx={5} cy={-4.2} r={0.9} fill="#fff" />
      </g>
      <path d="M-2.4 6 Q0 8 2.4 6" fill="none" stroke="#2E1065" strokeWidth={1.1} strokeLinecap="round" />
    </g>
  )
}

export function MicrophoneGold() {
  const id = useGid()
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <defs>
        <radialGradient id={`${id}a`}>
          <stop offset="0" stopColor="#FEF08A" stopOpacity="0.85" />
          <stop offset="1" stopColor="#FACC15" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}g`} cx="35%" cy="30%" r="80%">
          <stop offset="0" stopColor="#FFF7C2" />
          <stop offset="0.5" stopColor="#FACC15" />
          <stop offset="1" stopColor="#B7791F" />
        </radialGradient>
        <linearGradient id={`${id}h`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#B7791F" />
          <stop offset="0.4" stopColor="#FDE68A" />
          <stop offset="1" stopColor="#CA8A04" />
        </linearGradient>
      </defs>
      <g className="stage-pulse"><circle cx={0} cy={-8} r={27} fill={`url(#${id}a)`} /></g>
      <path d="M-5 6 L5 6 L3.6 24 Q0 27 -3.6 24 Z" fill={`url(#${id}h)`} stroke="#8A5A0B" strokeWidth={1.2} />
      <rect x={-6.4} y={2} width={12.8} height={5} rx={2} fill={`url(#${id}h)`} stroke="#8A5A0B" strokeWidth={1.2} />
      <circle cx={0} cy={-13} r={13} fill={`url(#${id}g)`} stroke="#8A5A0B" strokeWidth={1.4} />
      <path d="M-12.4 -16 Q0 -10 12.4 -16 M-11 -8.6 Q0 -3 11 -8.6 M0 -26 Q-6 -13 0 0 M0 -26 Q6 -13 0 0" fill="none" stroke="#8A5A0B" strokeWidth={0.8} opacity={0.55} />
      <ellipse cx={-5} cy={-19} rx={3.2} ry={2} fill="#fff" opacity={0.7} transform="rotate(-30 -5 -19)" />
      <path d="M0 9.4 l1.1 2.3 l2.5 0.3 l-1.9 1.7 l0.5 2.5 l-2.2 -1.3 l-2.2 1.3 l0.5 -2.5 l-1.9 -1.7 l2.5 -0.3 z" fill="#fff" stroke="#8A5A0B" strokeWidth={0.6} />
      <path className="stage-twinkle" d="M17 -26 l1.4 3.4 l3.4 1.4 l-3.4 1.4 l-1.4 3.4 l-1.4 -3.4 l-3.4 -1.4 l3.4 -1.4 z" fill="#fff" />
      <path className="stage-twinkle" style={{ animationDelay: '0.8s' }} d="M-19 -4 l1 2.4 l2.4 1 l-2.4 1 l-1 2.4 l-1 -2.4 l-2.4 -1 l2.4 -1 z" fill="#FEF08A" />
    </g>
  )
}

export function BoxBrown() {
  const id = useGid()
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D9A566" />
          <stop offset="1" stopColor="#B07A3F" />
        </linearGradient>
      </defs>
      <ellipse cx={0} cy={22} rx={28} ry={3.4} fill="#000" opacity={0.15} />
      {/* open top: dark inside, two flaps */}
      <path d="M-24 -4 L-20 -13 L20 -13 L24 -4 Z" fill="#3B2412" stroke="#5E3A17" strokeWidth={1.4} />
      <path d="M-24 -4 L-20 -13 L-30 -22 L-33 -8 Z" fill="#C8924F" stroke="#5E3A17" strokeWidth={1.4} />
      <path d="M24 -4 L20 -13 L28 -26 L34 -14 Z" fill="#BF8745" stroke="#5E3A17" strokeWidth={1.4} />
      <path d="M-4 -12 C-2 -15 2 -15 4 -12" fill="none" stroke="#E7B97C" strokeWidth={1.2} opacity={0.8} />
      <rect x={-24} y={-4} width={48} height={26} rx={2.4} fill={`url(#${id})`} stroke="#5E3A17" strokeWidth={1.5} />
      <rect x={-3.6} y={-4} width={7.2} height={14} fill="#F1D9A6" opacity={0.85} />
      <rect x={-12} y={9} width={9} height={7} rx={1} fill="#fff" opacity={0.85} stroke="#5E3A17" strokeWidth={0.8} />
      <path d="M12 6 L12 16 M16 6 L16 16" stroke="#8A5A2B" strokeWidth={1} opacity={0.6} />
      <path d="M-22 -2 H22" stroke="#EBC58C" strokeWidth={1} opacity={0.6} />
    </g>
  )
}

export function PuppyBrown() {
  const id = useGid()
  const fur = '#B07238'
  const dark = '#7A4720'
  const line = '#4A2A12'
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <defs>
        <radialGradient id={id} cx="40%" cy="30%" r="85%">
          <stop offset="0" stopColor={lighten(fur, 0.3)} />
          <stop offset="0.6" stopColor={fur} />
          <stop offset="1" stopColor={darken(fur, 0.25)} />
        </radialGradient>
      </defs>
      <ellipse cx={0} cy={23} rx={18} ry={3} fill="#000" opacity={0.15} />
      <g className="stage-wag" style={{ transformOrigin: '13px 19px' }}>
        <path d="M12 20 C22 21 25 13 22 6" fill="none" stroke={line} strokeWidth={6.4} />
        <path d="M12 20 C22 21 25 13 22 6" fill="none" stroke={fur} strokeWidth={4.4} />
      </g>
      {/* body */}
      <path d="M-13 22 C-17 8 -11 -2 0 -2 C11 -2 17 8 13 22 Z" fill={`url(#${id})`} stroke={line} strokeWidth={1.5} />
      <ellipse cx={0} cy={11} rx={6.6} ry={9} fill="#FFF7EA" />
      <path d="M-5.4 14 v8 M5.4 14 v8" stroke={line} strokeWidth={0.8} opacity={0.5} fill="none" />
      <ellipse cx={-5.4} cy={21.4} rx={4.6} ry={2.4} fill="#FFF7EA" stroke={line} strokeWidth={1.2} />
      <ellipse cx={5.4} cy={21.4} rx={4.6} ry={2.4} fill="#FFF7EA" stroke={line} strokeWidth={1.2} />
      {/* ears */}
      <path d="M-9 -17 C-18 -17 -19 -3 -15 3 C-11 2 -8 -4 -7 -12 Z" fill={dark} stroke={line} strokeWidth={1.4} />
      <path d="M9 -17 C18 -17 19 -3 15 3 C11 2 8 -4 7 -12 Z" fill={dark} stroke={line} strokeWidth={1.4} />
      {/* head */}
      <path d="M0 -22 C10 -22 15 -15 14 -8 C13 -1 7 3 0 3 C-7 3 -13 -1 -14 -8 C-15 -15 -10 -22 0 -22 Z" fill={`url(#${id})`} stroke={line} strokeWidth={1.5} />
      {/* white patch: blaze and muzzle */}
      <path d="M-2.6 -21.8 C-1 -21.2 1 -21.2 2.6 -21.8 C3.4 -14 5 -9 7 -6 C5 -1 -5 -1 -7 -6 C-5 -9 -3.4 -14 -2.6 -21.8 Z" fill="#FFF7EA" />
      <ellipse cx={-6.4} cy={-9.4} rx={3.6} ry={4} fill={dark} opacity={0.9} />
      <ellipse cx={-5.6} cy={-9} rx={2.2} ry={2.6} fill="#2A1A33" />
      <ellipse cx={5.6} cy={-9} rx={2.2} ry={2.6} fill="#2A1A33" />
      <circle cx={-6.2} cy={-10} r={0.8} fill="#fff" />
      <circle cx={5} cy={-10} r={0.8} fill="#fff" />
      <path d="M-2.6 -4.8 Q0 -7 2.6 -4.8 Q1.6 -2.4 0 -2.2 Q-1.6 -2.4 -2.6 -4.8Z" fill="#2A1A33" />
      <path d="M0 -2.2 V0 M-3 0 Q0 2.6 3 0" fill="none" stroke="#2A1A33" strokeWidth={0.9} />
      <path d="M-1.6 0.6 Q0 5.4 1.6 0.6 Z" fill="#FF8FA3" stroke="#C2475F" strokeWidth={0.6} />
      <path d="M-9 4 Q0 8 9 4 L8.4 7.4 Q0 11 -8.4 7.4 Z" fill="#EF4444" stroke="#9B1C1C" strokeWidth={1} />
      <circle cx={0} cy={9} r={1.6} fill="#FACC15" stroke="#B7791F" strokeWidth={0.6} />
    </g>
  )
}

export function MilkWhite() {
  const id = useGid()
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#F1F5F9" />
          <stop offset="0.5" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#CBD5E1" />
        </linearGradient>
      </defs>
      <ellipse cx={0} cy={22} rx={19} ry={2.6} fill="#000" opacity={0.14} />
      <path d="M-17 8 C-16 19 -9 22 0 22 C9 22 16 19 17 8 Z" fill={`url(#${id})`} stroke="#64748B" strokeWidth={1.4} />
      <path d="M-16.4 12 C-8 15 8 15 16.4 12" fill="none" stroke="#60A5FA" strokeWidth={2} />
      <path d="M-14 17 C-8 19.4 8 19.4 14 17" fill="none" stroke="#93C5FD" strokeWidth={1} />
      <ellipse cx={0} cy={8} rx={17.4} ry={4.8} fill="#E2E8F0" stroke="#64748B" strokeWidth={1.4} />
      <ellipse cx={0} cy={8.4} rx={14.6} ry={3.3} fill="#fff" />
      <ellipse cx={-4} cy={7.8} rx={4.6} ry={1} fill="#DBEAFE" opacity={0.8} />
      <g className="stage-bob" fill="#fff" stroke="#93C5FD" strokeWidth={0.7}>
        <path d="M-1 3 C-3 -1 0 -3 0 -5 C0 -3 3 -1 1 3 Z" />
      </g>
    </g>
  )
}

export function PhonePurple() {
  const id = useGid()
  return (
    <g strokeLinejoin="round" strokeLinecap="round" transform="rotate(-5)">
      <defs>
        <linearGradient id={`${id}c`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#A855F7" />
          <stop offset="1" stopColor="#6D28D9" />
        </linearGradient>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#22D3EE" />
          <stop offset="0.55" stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#F472B6" />
        </linearGradient>
        <radialGradient id={`${id}a`}>
          <stop offset="0" stopColor="#C4B5FD" stopOpacity="0.55" />
          <stop offset="1" stopColor="#C4B5FD" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx={0} cy={0} rx={28} ry={34} fill={`url(#${id}a)`} />
      <ellipse cx={2} cy={28} rx={15} ry={2.6} fill="#000" opacity={0.15} />
      <rect x={-14} y={-28} width={28} height={56} rx={6} fill={`url(#${id}c)`} stroke="#3B0F7A" strokeWidth={1.5} />
      <rect x={-11} y={-25} width={22} height={50} rx={3.6} fill={`url(#${id}s)`} stroke="#1F1147" strokeWidth={0.8} />
      <circle cx={0} cy={-22.4} r={1.1} fill="#1F1147" />
      <path d="M0 -3 C-8 -9 -5 -15 0 -11 C5 -15 8 -9 0 -3 Z" fill="#fff" opacity={0.95} />
      <rect x={-8} y={4} width={13} height={4.6} rx={2.3} fill="#fff" opacity={0.85} />
      <rect x={-3} y={11} width={11} height={4.6} rx={2.3} fill="#fff" opacity={0.6} />
      <rect x={-8} y={18} width={9} height={3.6} rx={1.8} fill="#fff" opacity={0.45} />
      <path d="M-9 -23 L-3 -23 L-9 -14 Z" fill="#fff" opacity={0.18} />
    </g>
  )
}

export function PosterBlue() {
  const id = useGid()
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#60A5FA" />
          <stop offset="1" stopColor="#2563EB" />
        </linearGradient>
      </defs>
      <rect x={-16} y={-23} width={34} height={48} rx={1.4} fill="#000" opacity={0.12} />
      <rect x={-18} y={-26} width={34} height={48} rx={1.6} fill={`url(#${id})`} stroke="#1E3A8A" strokeWidth={1.4} />
      <rect x={-15} y={-23} width={28} height={42} rx={1} fill="none" stroke="#DBEAFE" strokeWidth={1} />
      <circle cx={-1} cy={-12} r={8.6} fill="#FFF7EA" />
      <path d="M-7 -17 C-12 -16 -12 -8 -10 -6 C-8 -8 -7 -12 -6 -15 Z M5 -17 C10 -16 10 -8 8 -6 C6 -8 5 -12 4 -15 Z" fill="#8A5A2B" />
      <circle cx={-1} cy={-12} r={7.4} fill="#C98A4B" />
      <ellipse cx={-1} cy={-9.4} rx={3.6} ry={2.8} fill="#FFF7EA" />
      <circle cx={-4} cy={-13.4} r={1} fill="#2A1A33" />
      <circle cx={2} cy={-13.4} r={1} fill="#2A1A33" />
      <ellipse cx={-1} cy={-10.6} rx={1.3} ry={0.9} fill="#2A1A33" />
      <g fill="#fff">
        <ellipse cx={-1} cy={10} rx={5.4} ry={4.6} />
        <ellipse cx={-8} cy={3.6} rx={2} ry={2.6} />
        <ellipse cx={-3} cy={0.4} rx={2} ry={2.6} />
        <ellipse cx={3.4} cy={0.4} rx={2} ry={2.6} />
        <ellipse cx={8.4} cy={3.6} rx={2} ry={2.6} />
      </g>
      <rect x={-12} y={-29} width={11} height={5} fill="#FDE68A" opacity={0.8} transform="rotate(-8 -6 -26)" />
      <rect x={6} y={-29} width={11} height={5} fill="#FDE68A" opacity={0.8} transform="rotate(8 11 -26)" />
    </g>
  )
}

export function SkateboardPink() {
  const id = useGid()
  return (
    <g strokeLinejoin="round" strokeLinecap="round" transform="translate(0 3)">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F9A8D4" />
          <stop offset="1" stopColor="#DB2777" />
        </linearGradient>
      </defs>
      <ellipse cx={0} cy={14} rx={30} ry={2.8} fill="#000" opacity={0.15} />
      <path d="M-30 -8 Q-31 -12 -27 -11 Q-22 -4 -16 -3 L16 -3 Q22 -4 27 -11 Q31 -12 30 -8 Q27 1 16 1 L-16 1 Q-27 1 -30 -8 Z" fill={`url(#${id})`} stroke="#831843" strokeWidth={1.5} />
      <path d="M-24 -5 Q-18 -2 -14 -2 L14 -2 Q18 -2 24 -5" fill="none" stroke="#fff" strokeWidth={1.2} opacity={0.55} />
      <path d="M0 -3 l1.4 2.2 l2.5 0.5 l-1.8 1.8 l0.4 2.5 l-2.5 -1.2 l-2.5 1.2 l0.4 -2.5 l-1.8 -1.8 l2.5 -0.5 z" fill="#FDE047" stroke="#B7791F" strokeWidth={0.5} transform="translate(0 -1.4) scale(0.8)" />
      <rect x={-20} y={1} width={8} height={3} fill="#475569" />
      <rect x={12} y={1} width={8} height={3} fill="#475569" />
      {[-16, 16].map((x) => (
        <g key={x}>
          <circle cx={x} cy={8.4} r={5.2} fill="#67E8F9" stroke="#0E7490" strokeWidth={1.3} />
          <circle cx={x} cy={8.4} r={1.9} fill="#F8FAFC" stroke="#0E7490" strokeWidth={0.8} />
        </g>
      ))}
    </g>
  )
}

/** Three-tier pink cake. With `bitten` the middle tier has a big bite on the left, where the puppy sits, and crumbs lie around. */
export function Cake({ variant }: PropProps) {
  const id = useGid()
  const bitten = variant === 'bitten'
  const edge = '#9D2B6B'
  const middle = bitten
    ? 'M-16 -10 H16 V-9 Q3 -7.4 4.6 -2 Q-2.4 0 3.6 4 Q3.6 8.2 16 9 V10 H-16 Z'
    : 'M-16 -10 H16 V10 H-16 Z'
  return (
    <g strokeLinejoin="round" strokeLinecap="round" transform={bitten ? 'scale(-1 1)' : undefined}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FBCFE8" />
          <stop offset="0.5" stopColor="#F472B6" />
          <stop offset="1" stopColor="#DB2777" />
        </linearGradient>
      </defs>
      <ellipse cx={0} cy={29} rx={30} ry={3.6} fill="#E5E7EB" stroke="#94A3B8" strokeWidth={1.2} />
      <rect x={-22} y={8} width={44} height={22} rx={3} fill={`url(#${id})`} stroke={edge} strokeWidth={1.4} />
      <path d={`${middle}`} fill={`url(#${id})`} stroke={edge} strokeWidth={1.4} transform="translate(0 -0.5)" />
      <rect x={-10} y={-24} width={20} height={16} rx={2.6} fill={`url(#${id})`} stroke={edge} strokeWidth={1.4} />
      {bitten && <path d="M16 -8.6 Q3 -7 4.6 -2.2 Q-2.4 -0.2 3.6 3.6 Q3.6 7.6 16 8.4" fill="none" stroke="#FFE3B3" strokeWidth={2.4} />}
      {/* cream drips */}
      <path d="M-22 10 Q-18 14 -15 10 Q-11 15 -7 10 Q-3 14 1 10 Q5 15 9 10 Q13 14 17 10 Q20 13 22 10 V8 H-22 Z" fill="#FFF7FB" stroke={edge} strokeWidth={1} />
      <path d={bitten ? 'M-16 -9 Q-12 -5 -9 -9 Q-5 -4 -1 -9 Q3 -5 6 -9 L9.4 -9 V-11 H-16 Z' : 'M-16 -9 Q-12 -5 -9 -9 Q-5 -4 -1 -9 Q3 -5 7 -9 Q11 -5 16 -9 V-11 H-16 Z'} fill="#FFF7FB" stroke={edge} strokeWidth={1} />
      <path d="M-10 -23 Q-6 -19 -3 -23 Q1 -18 4 -23 Q7 -20 10 -23 V-25 H-10 Z" fill="#FFF7FB" stroke={edge} strokeWidth={1} />
      {/* top: strawberry */}
      <path d="M0 -26 C-5 -27 -6 -33 0 -34 C6 -33 5 -27 0 -26 Z" fill="#EF4444" stroke="#991B1B" strokeWidth={1} />
      <path d="M-2 -34 L0 -36 L2 -34 Z" fill="#22C55E" stroke="#15803D" strokeWidth={0.6} />
      {/* sprinkles */}
      <g strokeWidth={1.5}>
        {[
          [-16, 18, '#FACC15'], [-8, 22, '#22D3EE'], [0, 17, '#fff'], [9, 23, '#FACC15'], [16, 17, '#22D3EE'], [-3, 26, '#A78BFA'],
          [-7, -3, '#fff'], [3, 3, '#FACC15'], [-12, 5, '#22D3EE'], [-4, -18, '#22D3EE'], [5, -14, '#FACC15'],
        ].map(([x, y, c]) => (
          <path key={`${x}${y}`} d={`M${x} ${y} l1.8 0.8`} stroke={c as string} />
        ))}
      </g>
      {bitten && (
        <g fill="#F9A8D4" stroke="#BE185D" strokeWidth={0.6}>
          <rect x={14} y={22} width={3.4} height={2.6} rx={0.8} transform="rotate(20 15 23)" />
          <rect x={22} y={26} width={2.6} height={2.2} rx={0.8} />
          <rect x={26} y={28.6} width={2} height={1.6} rx={0.6} />
          <rect x={10.6} y={10.4} width={2.6} height={2.2} rx={0.8} transform="rotate(-18 12 11)" />
        </g>
      )}
    </g>
  )
}

/** Cafe table with a long cloth; a small puppy tail pokes out from under it. */
export function TableTail() {
  const id = useGid()
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FFF1F2" />
          <stop offset="0.5" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#FBCFE8" />
        </linearGradient>
      </defs>
      <ellipse cx={0} cy={25} rx={26} ry={2.8} fill="#000" opacity={0.15} />
      <g className="stage-wag" style={{ transformOrigin: '19px 23px' }}>
        <path d="M18 23 C29 24 34 15 30 7" fill="none" stroke="#4A2A12" strokeWidth={6.4} />
        <path d="M18 23 C29 24 34 15 30 7" fill="none" stroke="#B07238" strokeWidth={4.4} />
        <path d="M31 10 C31.4 8.6 30.6 7.6 30 7" fill="none" stroke="#FFF7EA" strokeWidth={4.4} />
      </g>
      <path d="M-22 -14 L-26 23 Q-20 27 -14 24 Q-7 28 0 24 Q7 28 14 24 Q20 27 26 23 L22 -14 Z" fill={`url(#${id})`} stroke="#BE185D" strokeWidth={1.4} />
      <path d="M-12 -12 L-14.4 24 M-4 -12 L-5 25 M4 -12 L5 25 M12 -12 L14.4 24" stroke="#F9A8D4" strokeWidth={1.6} fill="none" opacity={0.7} />
      <ellipse cx={0} cy={-14} rx={23} ry={5.6} fill="#FFF7FB" stroke="#BE185D" strokeWidth={1.4} />
      <ellipse cx={0} cy={-14.4} rx={19} ry={3.6} fill="#FFFFFF" opacity={0.9} />
      {/* cup */}
      <ellipse cx={-7} cy={-15} rx={7} ry={2} fill="#E2E8F0" stroke="#64748B" strokeWidth={1} />
      <path d="M-11.6 -23 L-2.4 -23 L-3.4 -16 Q-7 -14 -10.6 -16 Z" fill="#fff" stroke="#64748B" strokeWidth={1.1} />
      <path d="M-2.6 -21.6 Q1.6 -21.4 1 -18 Q0 -16.6 -3 -17.2" fill="none" stroke="#64748B" strokeWidth={1.1} />
      <ellipse cx={-7} cy={-22.8} rx={4.6} ry={1.1} fill="#92400E" />
      <path className="stage-bob" d="M-8 -26 q-2 -3 0 -5 M-5 -26 q-2 -3 0 -5" fill="none" stroke="#CBD5E1" strokeWidth={1} />
    </g>
  )
}

import type { ReactNode } from 'react'
import { Bat } from '../characters/Bat'
import { Fox } from '../characters/Fox'
import { Hedgehog } from '../characters/Hedgehog'
import { Owl } from '../characters/Owl'
import { darken, lighten, useGid } from '../colors'
import type { PropProps } from '../types'

/**
 * Twinkle Hollow companions (D43): the catalogue only ever names one of the four
 * forest friends per animal (`fox: ['nova']`, ...), so each is its own fixed look,
 * the same way `girl-<name>` reuses the heroine figure. Each one shares the exact
 * drawing used when the friend is the page's hero (same figure, D38 pattern), scaled
 * down and recentred on (0, 0) like the other small companions (e.g. `puppy`).
 */
const S = 0.5

function Companion({ children }: { children: ReactNode }) {
  return (
    <g transform={`translate(${-50 * S} ${-50 * S}) scale(${S})`}>
      <ellipse cx={50} cy={99} rx={26} ry={6} fill="#1a3a22" opacity={0.18} />
      {children}
    </g>
  )
}

/** `fox-nova`: the little fox cub standing beside another friend. */
export function FoxNova() {
  return (
    <Companion>
      <Fox primary="#EA580C" secondary="#FBBF24" mood="happy" />
    </Companion>
  )
}

/** `owl-juniper`: the young owl perched beside another friend. */
export function OwlJuniper() {
  return (
    <Companion>
      <Owl primary="#A78BFA" secondary="#F8FAFC" mood="happy" />
    </Companion>
  )
}

/** `hedgehog-pepper`: the little hedgehog beside another friend. */
export function HedgehogPepper() {
  return (
    <Companion>
      <Hedgehog primary="#D97706" secondary="#FBCFE8" mood="happy" />
    </Companion>
  )
}

/** `bat-willow`: the shy bat beside another friend, wings shining because she is happy here. */
export function BatWillow() {
  return (
    <Companion>
      <Bat primary="#6B7280" secondary="#C4B5FD" mood="happy" />
    </Companion>
  )
}

/** `firefly-gold`: a tiny glowing firefly, one of the little lights of the valley (D43). */
export function FireflyGold({ variant }: PropProps) {
  const id = useGid()
  const c = variant === 'gold' ? '#FFD76A' : lighten('#FFD76A', 0.1)
  return (
    <g strokeLinejoin="round" strokeLinecap="round" className="stage-bob">
      <defs>
        <radialGradient id={`${id}g`}>
          <stop offset="0" stopColor="#FFF6CC" stopOpacity="0.9" />
          <stop offset="1" stopColor={c} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}b`} cx="35%" cy="30%" r="85%">
          <stop offset="0" stopColor={lighten(c, 0.4)} />
          <stop offset="1" stopColor={darken(c, 0.3)} />
        </radialGradient>
      </defs>
      <circle className="stage-pulse" cx={0} cy={1} r={10} fill={`url(#${id}g)`} />
      {/* two tiny wings */}
      <g className="stage-flutter" style={{ transformOrigin: '0px -1px' }}>
        <ellipse cx={-3.4} cy={-2.4} rx={3.4} ry={2} fill="#fff" opacity={0.55} transform="rotate(-20 -3.4 -2.4)" />
        <ellipse cx={3.4} cy={-2.4} rx={3.4} ry={2} fill="#fff" opacity={0.55} transform="rotate(20 3.4 -2.4)" />
      </g>
      {/* body */}
      <ellipse cx={0} cy={0.5} rx={2.6} ry={1.8} fill="#4a3452" />
      <ellipse className="stage-twinkle" cx={0} cy={2.6} rx={2.3} ry={2.6} fill={`url(#${id}b)`} stroke={darken(c, 0.4)} strokeWidth={0.5} />
    </g>
  )
}

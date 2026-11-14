/**
 * Look table for the boy characters (D44, Friends). Mirrors `looks.ts`: one drawing (`Boy.tsx`)
 * reads a row of this table, so a hero and a `boy-<variant>` friend are the same figure.
 * `primaryColor` and `secondaryColor` from the story replace the two main outfit colours.
 */
export type BoyLookKey = 'promyk' | 'figiel' | 'skrzat'
export type BoyHairStyle = 'spiky' | 'messy' | 'curly'
export type BoyTopStyle = 'jacket' | 'tee' | 'hoodie'

export interface BoyLook {
  skin: string
  hair: string
  hairLight: string
  hairShade: string
  hairStyle: BoyHairStyle
  eye: string
  top: BoyTopStyle
  /** Pants colour; `null` means the secondary colour. */
  pants: string | null
  shoe: string
  /** Trim colour used for stripes, zips and soles. */
  neon: string
  glasses: boolean
  freckles: boolean
  /** Colours used when the story does not give any, and by `boy-<variant>` friends. */
  primary: string
  secondary: string
}

export const BOY_LOOKS: Record<BoyLookKey, BoyLook> = {
  promyk: {
    skin: '#FFD9B0',
    hair: '#F2C14E',
    hairLight: '#FFE49B',
    hairShade: '#C9922A',
    hairStyle: 'spiky',
    eye: '#2F6B4E',
    top: 'jacket',
    pants: '#1E293B',
    shoe: '#F8FAFC',
    neon: '#0EA5E9',
    glasses: false,
    freckles: false,
    primary: '#F59E0B',
    secondary: '#0EA5E9',
  },
  figiel: {
    skin: '#F3C9A0',
    hair: '#6B4226',
    hairLight: '#A97C50',
    hairShade: '#432A16',
    hairStyle: 'messy',
    eye: '#3B2A1A',
    top: 'tee',
    pants: '#2B4A94',
    shoe: '#EF4444',
    neon: '#FACC15',
    glasses: true,
    freckles: true,
    primary: '#22C55E',
    secondary: '#FACC15',
  },
  skrzat: {
    skin: '#E8B98A',
    hair: '#3D2B1F',
    hairLight: '#6B4E3A',
    hairShade: '#241910',
    hairStyle: 'curly',
    eye: '#3B2A1A',
    top: 'hoodie',
    pants: '#334155',
    shoe: '#F8FAFC',
    neon: '#14B8A6',
    glasses: false,
    freckles: false,
    primary: '#14B8A6',
    secondary: '#F8FAFC',
  },
}

/** Catalogue variant (`boy-promyk`) to look: the variant name is the character name. */
export function isBoyLookKey(variant: string): variant is BoyLookKey {
  return variant in BOY_LOOKS
}

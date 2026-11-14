/**
 * Look table for the girl characters (D38). One drawing (`Girl.tsx`) reads a row of this table,
 * so a heroine and a `girl-<variant>` friend are the same figure. `primaryColor` and
 * `secondaryColor` from the story replace the two main outfit colours; the rest is fixed.
 */
export type GirlLookKey = 'yuna' | 'hana' | 'sora' | 'queen' | 'ruby' | 'lena' | 'amy' | 'marti' | 'rozyczka' | 'kredka' | 'iskierka'
export type HairStyle = 'ponytail' | 'wavy' | 'buns' | 'queen' | 'curly' | 'braids' | 'bob'
export type TopStyle = 'jacket' | 'bomber' | 'track' | 'gown' | 'denim' | 'hoodie' | 'sweater'

export interface GirlLook {
  skin: string
  hair: string
  hairLight: string
  hairShade: string
  /** Colour of the hair ends (dip-dye), blended from the middle of long hair. */
  hairTip?: string
  hairStyle: HairStyle
  eye: string
  top: TopStyle
  /** Pants or leggings colour; `null` means the secondary colour. */
  pants: string | null
  skirt: boolean
  shoe: string
  /** Neon or trim colour used for stripes, soles and the headset. */
  neon: string
  headset: boolean
  glasses: boolean
  backpack: boolean
  freckles: boolean
  crown: boolean
  /** Sad, pretty eyes: the brows stay a little lifted in calm moods. */
  sad: boolean
  /** Colours used when the story does not give any, and by `girl-<variant>` friends. */
  primary: string
  secondary: string
}

export const GIRL_LOOKS: Record<GirlLookKey, GirlLook> = {
  yuna: {
    skin: '#FFDCC4',
    hair: '#1E2A5E',
    hairLight: '#4B63B8',
    hairShade: '#101A40',
    hairTip: '#22D3EE',
    hairStyle: 'ponytail',
    eye: '#2A6FDB',
    top: 'jacket',
    pants: null,
    skirt: false,
    shoe: '#F8FAFC',
    neon: '#22D3EE',
    headset: true,
    glasses: false,
    backpack: false,
    freckles: false,
    crown: false,
    sad: false,
    primary: '#22D3EE',
    secondary: '#1E293B',
  },
  hana: {
    skin: '#FBD5BA',
    hair: '#F2B73A',
    hairLight: '#FFE08A',
    hairShade: '#C9861A',
    hairStyle: 'wavy',
    eye: '#8B5A2B',
    top: 'bomber',
    pants: '#2E1065',
    skirt: true,
    shoe: '#F8FAFC',
    neon: '#67E8F9',
    headset: true,
    glasses: false,
    backpack: false,
    freckles: false,
    crown: false,
    sad: false,
    primary: '#F472B6',
    secondary: '#4C1D95',
  },
  sora: {
    skin: '#EBBD94',
    hair: '#4A2C20',
    hairLight: '#8A5A42',
    hairShade: '#2A160F',
    hairStyle: 'buns',
    eye: '#4A2C20',
    top: 'track',
    pants: null,
    skirt: false,
    shoe: '#FACC15',
    neon: '#FDE047',
    headset: true,
    glasses: false,
    backpack: false,
    freckles: false,
    crown: false,
    sad: false,
    primary: '#FACC15',
    secondary: '#111827',
  },
  queen: {
    skin: '#F3E6F6',
    hair: '#D9CFF2',
    hairLight: '#FFFFFF',
    hairShade: '#A99BD6',
    hairTip: '#B9A6EE',
    hairStyle: 'queen',
    eye: '#7C5CD6',
    top: 'gown',
    pants: null,
    skirt: false,
    shoe: '#C4B5FD',
    neon: '#E9D5FF',
    headset: false,
    glasses: false,
    backpack: false,
    freckles: false,
    crown: true,
    sad: true,
    primary: '#6D28D9',
    secondary: '#C4B5FD',
  },
  ruby: {
    skin: '#FFE2D2',
    hair: '#D2531E',
    hairLight: '#FF9355',
    hairShade: '#8F3010',
    hairStyle: 'curly',
    eye: '#2F8F5B',
    top: 'denim',
    pants: '#2B4A94',
    skirt: false,
    shoe: '#EF4444',
    neon: '#F8FAFC',
    headset: false,
    glasses: false,
    backpack: false,
    freckles: true,
    crown: false,
    sad: false,
    primary: '#EF4444',
    secondary: '#1D4ED8',
  },
  lena: {
    skin: '#8A5638',
    hair: '#1B1722',
    hairLight: '#524862',
    hairShade: '#0A080E',
    hairStyle: 'braids',
    eye: '#3A2418',
    top: 'hoodie',
    pants: '#334155',
    skirt: false,
    shoe: '#F8FAFC',
    neon: '#14B8A6',
    headset: false,
    glasses: false,
    backpack: false,
    freckles: false,
    crown: false,
    sad: false,
    primary: '#14B8A6',
    secondary: '#F8FAFC',
  },
  amy: {
    skin: '#D9A577',
    hair: '#F2CB62',
    hairLight: '#FFEBA3',
    hairShade: '#C99A2E',
    hairStyle: 'bob',
    eye: '#5B3A1E',
    top: 'sweater',
    pants: '#3E5CA8',
    skirt: false,
    shoe: '#F8FAFC',
    neon: '#FDBA74',
    headset: false,
    glasses: true,
    backpack: true,
    freckles: false,
    crown: false,
    sad: false,
    primary: '#F59E0B',
    secondary: '#7C3AED',
  },
  // Friends (D44): the crew's four girls, flat bright creator-studio style.
  marti: {
    skin: '#FDD9BA',
    hair: '#6B3F21',
    hairLight: '#C98A52',
    hairShade: '#4A2814',
    hairTip: '#C98A52',
    hairStyle: 'ponytail',
    eye: '#6B4226',
    top: 'hoodie',
    pants: '#1E293B',
    skirt: false,
    shoe: '#F8FAFC',
    neon: '#F97316',
    headset: false,
    glasses: false,
    backpack: false,
    freckles: false,
    crown: false,
    sad: false,
    primary: '#0EA5E9',
    secondary: '#F97316',
  },
  rozyczka: {
    skin: '#FFE1C8',
    hair: '#F2A7C0',
    hairLight: '#FFD3E3',
    hairShade: '#C76E95',
    hairStyle: 'buns',
    eye: '#7A4B2E',
    top: 'sweater',
    pants: '#F9D8E0',
    skirt: false,
    shoe: '#F8FAFC',
    neon: '#FB7185',
    headset: false,
    glasses: false,
    backpack: false,
    freckles: true,
    crown: false,
    sad: false,
    primary: '#FB7185',
    secondary: '#FDE68A',
  },
  kredka: {
    skin: '#E7B98F',
    hair: '#4B2E83',
    hairLight: '#8D6AC9',
    hairShade: '#2E1A57',
    hairStyle: 'curly',
    eye: '#2F6B4E',
    top: 'denim',
    pants: null,
    skirt: false,
    shoe: '#FACC15',
    neon: '#F472B6',
    headset: false,
    glasses: false,
    backpack: false,
    freckles: false,
    crown: false,
    sad: false,
    primary: '#8B5CF6',
    secondary: '#FACC15',
  },
  iskierka: {
    skin: '#FBD2B0',
    hair: '#F7D046',
    hairLight: '#FFEA9E',
    hairShade: '#C9A422',
    hairStyle: 'bob',
    eye: '#3B2A1A',
    top: 'jacket',
    pants: null,
    skirt: false,
    shoe: '#67E8F9',
    neon: '#FDE047',
    headset: false,
    glasses: false,
    backpack: false,
    freckles: false,
    crown: false,
    sad: false,
    primary: '#FACC15',
    secondary: '#38BDF8',
  },
}

/** Catalogue variant (`girl-queen`) to look; the only name that differs from the character is `queen`. */
export function isGirlLookKey(variant: string): variant is GirlLookKey {
  return variant in GIRL_LOOKS
}

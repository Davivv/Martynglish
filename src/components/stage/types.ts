import type { CharacterMood } from '../../types/story'

export interface CharacterProps {
  primary: string
  secondary?: string
  mood: CharacterMood
}

export interface PropProps {
  /** Variant part of the `props` entry: a colour name or a number. */
  variant: string
}

export interface BackgroundProps {
  /** Unused by most backgrounds, reserved for theme tweaks. */
  className?: string
}

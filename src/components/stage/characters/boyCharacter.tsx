import type { ReactNode } from 'react'
import type { CharacterProps } from '../types'
import { Boy } from './Boy'
import type { BoyLookKey } from './boyLooks'

/** Character component for `CHARACTER_DRAWINGS`: the same figure with the story's colours and mood. */
export function boyCharacter(look: BoyLookKey) {
  return function BoyCharacter({ primary, secondary, mood }: CharacterProps): ReactNode {
    return <Boy look={look} primary={primary} secondary={secondary} pose={mood} />
  }
}

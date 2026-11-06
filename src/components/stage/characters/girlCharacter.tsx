import type { ReactNode } from 'react'
import type { CharacterProps } from '../types'
import { Girl } from './Girl'
import type { GirlLookKey } from './looks'

/** Character component for `CHARACTER_DRAWINGS`: the same figure with the story's colours and mood. */
export function girlCharacter(look: GirlLookKey) {
  return function GirlCharacter({ primary, secondary, mood }: CharacterProps): ReactNode {
    return <Girl look={look} primary={primary} secondary={secondary} pose={mood} />
  }
}

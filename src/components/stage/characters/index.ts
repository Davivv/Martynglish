import type { ComponentType } from 'react'
import type { PrimaryCharacter } from '../../../types/story'
import type { CharacterProps } from '../types'
import { Bunny } from './Bunny'
import { Cat } from './Cat'
import { Dino } from './Dino'
import { Dog } from './Dog'
import { Panda } from './Panda'
import { PrincessPony } from './PrincessPony'

/** One drawing per `PRIMARY_CHARACTERS` entry. A test keeps this map complete. */
export const CHARACTER_DRAWINGS: Record<PrimaryCharacter, ComponentType<CharacterProps>> = {
  cat: Cat,
  dog: Dog,
  'princess-pony': PrincessPony,
  dino: Dino,
  panda: Panda,
  bunny: Bunny,
}

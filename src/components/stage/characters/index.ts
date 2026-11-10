import type { ComponentType } from 'react'
import type { PrimaryCharacter } from '../../../types/story'
import type { CharacterProps } from '../types'
import { Bat } from './Bat'
import { Bunny } from './Bunny'
import { Cat } from './Cat'
import { Dino } from './Dino'
import { Dog } from './Dog'
import { Fox } from './Fox'
import { girlCharacter } from './girlCharacter'
import { Hedgehog } from './Hedgehog'
import type { GirlLookKey } from './looks'
import { Owl } from './Owl'
import { Panda } from './Panda'
import { PrincessPony } from './PrincessPony'

/** Girl heroes (D38) and the look-table row each one uses. */
export const GIRL_HEROES: Partial<Record<PrimaryCharacter, GirlLookKey>> = {
  yuna: 'yuna',
  hana: 'hana',
  sora: 'sora',
  'shadow-queen': 'queen',
  ruby: 'ruby',
  lena: 'lena',
  amy: 'amy',
}

/** Half width of the ground shadow under a hero: a slim girl needs a narrower one than a round animal. */
export function heroShadowRx(character: PrimaryCharacter): number {
  return character in GIRL_HEROES ? 25 : 50
}

/** One drawing per `PRIMARY_CHARACTERS` entry. A test keeps this map complete. */
export const CHARACTER_DRAWINGS: Record<PrimaryCharacter, ComponentType<CharacterProps>> = {
  cat: Cat,
  dog: Dog,
  'princess-pony': PrincessPony,
  dino: Dino,
  panda: Panda,
  bunny: Bunny,
  yuna: girlCharacter('yuna'),
  hana: girlCharacter('hana'),
  sora: girlCharacter('sora'),
  'shadow-queen': girlCharacter('queen'),
  ruby: girlCharacter('ruby'),
  lena: girlCharacter('lena'),
  amy: girlCharacter('amy'),
  nova: Fox,
  juniper: Owl,
  pepper: Hedgehog,
  willow: Bat,
}

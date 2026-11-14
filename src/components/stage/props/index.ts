import type { ComponentType } from 'react'
import type { PropProps } from '../types'
import { Bird, Butterfly, Fish } from './animals'
import { Apple, Banana, Chocolate, IceCream, Pizza } from './food'
import { BatWillow, FireflyGold, FoxNova, HedgehogPepper, OwlJuniper } from './forest'
import { Flower, Shell, Tree } from './nature'
import { Cloud, Moon, Rainbow, Star, Sun } from './sky'
import { Ball, Balloon, Heart } from './toys'
import {
  BoxBrown,
  Cake,
  GirlFriend,
  MicrophoneGold,
  MilkWhite,
  PhonePurple,
  PosterBlue,
  PuppyBrown,
  Shadow,
  SkateboardPink,
  TableTail,
} from './scene'
import { BlanketRed, BoyFriend, Bracelet, CameraBlack, HatYellow, HoodieOrange, LightWhite, SuitcaseBlue } from './studio'

/** One drawing per `PROP_OBJECTS` key. A test keeps this map complete. */
export const PROP_DRAWINGS: Record<string, ComponentType<PropProps>> = {
  apple: Apple,
  ball: Ball,
  balloon: Balloon,
  banana: Banana,
  bat: BatWillow,
  bird: Bird,
  // Friends (D45): the park picnic blanket.
  blanket: BlanketRed,
  // Friends (D44): boy friends standing beside the hero, same pattern as `girl` below.
  boy: BoyFriend,
  box: BoxBrown,
  // Friends (D45): friendship bracelets made in the art corner.
  bracelet: Bracelet,
  butterfly: Butterfly,
  cake: Cake,
  // Friends (D44): the studio's camera, hoodie, stage light and Marti's suitcase.
  camera: CameraBlack,
  chocolate: Chocolate,
  cloud: Cloud,
  firefly: FireflyGold,
  fish: Fish,
  flower: Flower,
  fox: FoxNova,
  girl: GirlFriend,
  // Friends (D45): Iskierka's sun hat from the windy park day.
  hat: HatYellow,
  heart: Heart,
  hedgehog: HedgehogPepper,
  hoodie: HoodieOrange,
  icecream: IceCream,
  light: LightWhite,
  microphone: MicrophoneGold,
  milk: MilkWhite,
  moon: Moon,
  owl: OwlJuniper,
  phone: PhonePurple,
  // Friends (D45): the fruit pizza from the kitchen challenge.
  pizza: Pizza,
  poster: PosterBlue,
  puppy: PuppyBrown,
  rainbow: Rainbow,
  shadow: Shadow,
  shell: Shell,
  skateboard: SkateboardPink,
  star: Star,
  suitcase: SuitcaseBlue,
  sun: Sun,
  table: TableTail,
  tree: Tree,
}

/** Objects that belong high up, in the sky. Everything else stands on the ground. */
export const SKY_OBJECTS: ReadonlySet<string> = new Set([
  'sun',
  'moon',
  'cloud',
  'star',
  'rainbow',
  'bird',
  'butterfly',
  'balloon',
])

/** Objects hung on the wall: they use the high slots like the sky ones, but are not sky. */
export const WALL_OBJECTS: ReadonlySet<string> = new Set(['poster'])

/** Splits a `props` entry such as `flower-pink` into object and variant. */
export function parseProp(prop: string): { object: string; variant: string } {
  const cut = prop.lastIndexOf('-')
  return cut < 0 ? { object: prop, variant: '' } : { object: prop.slice(0, cut), variant: prop.slice(cut + 1) }
}

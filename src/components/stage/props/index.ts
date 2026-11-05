import type { ComponentType } from 'react'
import type { PropProps } from '../types'
import { Bird, Butterfly, Fish } from './animals'
import { Apple, Banana, Chocolate, IceCream } from './food'
import { Flower, Shell, Tree } from './nature'
import { Cloud, Moon, Rainbow, Star, Sun } from './sky'
import { Ball, Balloon, Heart } from './toys'

/** One drawing per `PROP_OBJECTS` key. A test keeps this map complete. */
export const PROP_DRAWINGS: Record<string, ComponentType<PropProps>> = {
  apple: Apple,
  ball: Ball,
  balloon: Balloon,
  banana: Banana,
  bird: Bird,
  butterfly: Butterfly,
  chocolate: Chocolate,
  cloud: Cloud,
  fish: Fish,
  flower: Flower,
  heart: Heart,
  icecream: IceCream,
  moon: Moon,
  rainbow: Rainbow,
  shell: Shell,
  star: Star,
  sun: Sun,
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

/** Splits a `props` entry such as `flower-pink` into object and variant. */
export function parseProp(prop: string): { object: string; variant: string } {
  const cut = prop.lastIndexOf('-')
  return cut < 0 ? { object: prop, variant: '' } : { object: prop.slice(0, cut), variant: prop.slice(cut + 1) }
}

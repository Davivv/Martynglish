import type { ComponentType } from 'react'
import type { BackgroundTheme } from '../../../types/story'
import { Beach } from './Beach'
import { Cafe } from './Cafe'
import { Castle } from './Castle'
import { Clubhouse } from './Clubhouse'
import { Concert } from './Concert'
import { DarkCity, NeonCity } from './City'
import { DuskValley } from './DuskValley'
import { HollowTree } from './HollowTree'
import { IceCreamShop } from './IceCream'
import { Kitchen } from './Kitchen'
import { Meadow } from './Meadow'
import { NightSky } from './NightSky'
import { Park } from './Park'
import { Rooftop } from './Rooftop'
import { Studio } from './Studio'
import { Town } from './Town'

/** One drawing per `BACKGROUND_THEMES` entry. A test keeps this map complete. */
export const BACKGROUND_DRAWINGS: Record<BackgroundTheme, ComponentType> = {
  meadow: Meadow,
  park: Park,
  castle: Castle,
  icecream: IceCreamShop,
  beach: Beach,
  'night-sky': NightSky,
  'neon-city': NeonCity,
  'dark-city': DarkCity,
  concert: Concert,
  rooftop: Rooftop,
  town: Town,
  clubhouse: Clubhouse,
  cafe: Cafe,
  'dusk-valley': DuskValley,
  'hollow-tree': HollowTree,
  studio: Studio,
  kitchen: Kitchen,
}

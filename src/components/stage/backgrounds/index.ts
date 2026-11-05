import type { ComponentType } from 'react'
import type { BackgroundTheme } from '../../../types/story'
import { Beach } from './Beach'
import { Castle } from './Castle'
import { IceCreamShop } from './IceCream'
import { Meadow } from './Meadow'
import { NightSky } from './NightSky'
import { Park } from './Park'

/** One drawing per `BACKGROUND_THEMES` entry. A test keeps this map complete. */
export const BACKGROUND_DRAWINGS: Record<BackgroundTheme, ComponentType> = {
  meadow: Meadow,
  park: Park,
  castle: Castle,
  icecream: IceCreamShop,
  beach: Beach,
  'night-sky': NightSky,
}

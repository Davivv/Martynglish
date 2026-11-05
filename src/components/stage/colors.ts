import { useId } from 'react'

/** Named colours used by `props` variants (see PROP_OBJECTS in propCatalog.mjs). */
export const NAMED_COLORS: Record<string, string> = {
  red: '#EF4444',
  orange: '#F97316',
  yellow: '#FACC15',
  green: '#22C55E',
  blue: '#3B82F6',
  purple: '#9333EA',
  pink: '#EC4899',
  white: '#FFFFFF',
  brown: '#7C4A21',
}

function parseHex(hex: string): [number, number, number] {
  let h = hex.trim().replace('#', '')
  if (h.length === 3) h = h.replace(/./g, (c) => c + c)
  const n = Number.parseInt(h.slice(0, 6), 16)
  if (Number.isNaN(n) || h.length < 6) return [147, 51, 234]
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function toHex([r, g, b]: [number, number, number]): string {
  return `#${[r, g, b].map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('')}`
}

/** Mixes `hex` towards `target` by `amount` (0..1). */
export function mix(hex: string, target: string, amount: number): string {
  const a = parseHex(hex)
  const b = parseHex(target)
  return toHex([0, 1, 2].map((i) => a[i] + (b[i] - a[i]) * amount) as [number, number, number])
}

export const lighten = (hex: string, amount: number) => mix(hex, '#ffffff', amount)
/** Darkening keeps a little warmth so outlines do not turn grey. */
export const darken = (hex: string, amount: number) => mix(hex, '#2a1038', amount)

/** Colour with a name or a raw hex, falls back to `fallback`. */
export function colorOf(name: string, fallback = '#EF4444'): string {
  if (name.startsWith('#')) return name
  return NAMED_COLORS[name] ?? fallback
}

/** Unique, selector-safe id prefix for gradients (several stages can share a page). */
export function useGid(): string {
  return `g${useId().replace(/[^a-zA-Z0-9]/g, '')}`
}

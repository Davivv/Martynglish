/** Small deterministic random numbers, so a scene looks the same on every render. */
export function seeded(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

/** Window grid of one building as a few `path` strings (one per colour), not hundreds of nodes. */
export function windowPaths(x: number, top: number, base: number, w: number, colors: readonly string[], rand: () => number, litShare: number) {
  const cols = Math.max(1, Math.floor((w - 4) / 7))
  const rows = Math.max(1, Math.floor((base - top - 8) / 9))
  const paths = new Map<string, string>()
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const color = rand() < litShare ? colors[Math.floor(rand() * (colors.length - 1)) + 1] : colors[0]
      const wx = x + 3.5 + c * ((w - 7) / cols) + 0.6
      const wy = top + 6 + r * 9
      paths.set(color, `${paths.get(color) ?? ''}M${wx.toFixed(1)} ${wy.toFixed(1)}h4v5h-4z`)
    }
  }
  return [...paths.entries()]
}

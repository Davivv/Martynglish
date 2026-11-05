/** Scene canvas: 400 x 240 user units. The hero stands on y = 156, the horizon is near y = 128. */
export const W = 400
export const H = 240

interface DriftCloudProps {
  y: number
  scale?: number
  duration: number
  /** Negative values start the cloud part-way across the sky. */
  delay: number
  opacity?: number
  tint?: string
}

/**
 * Soft background cloud. It has no outline and low opacity, so it cannot be mistaken
 * for a `cloud-white` prop that the child is supposed to count.
 */
export function DriftCloud({ y, scale = 1, duration, delay, opacity = 0.55, tint = '#ffffff' }: DriftCloudProps) {
  return (
    <g transform={`translate(0 ${y}) scale(${scale})`} opacity={opacity}>
      <g className="stage-drift" style={{ animationDuration: `${duration}s`, animationDelay: `${delay}s` }}>
        <path d="M-80 12 C-96 12 -96 -6 -80 -6 C-80 -22 -52 -24 -46 -10 C-36 -26 -6 -20 -8 -2 C6 -2 6 12 -8 12 Z" fill={tint} />
      </g>
    </g>
  )
}

/** Tiny twinkling dot used for night stars. */
export function Twinkle({ x, y, r, delay, color = '#fff' }: { x: number; y: number; r: number; delay: number; color?: string }) {
  return <circle className="stage-twinkle" style={{ animationDelay: `${delay}s` }} cx={x} cy={y} r={r} fill={color} />
}

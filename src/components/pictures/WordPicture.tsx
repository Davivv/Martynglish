import { useLayoutEffect, useRef, useState } from 'react'
import type { PictureSpec } from '../../data/wordPictures'
import { CHARACTER_DRAWINGS } from '../stage/characters'
import { darken } from '../stage/colors'
import { PROP_DRAWINGS, parseProp } from '../stage/props'

interface WordPictureProps {
  picture: PictureSpec
  className?: string
}

const MARGIN = 4
const BASE_VIEWBOX = '0 0 100 100'

/** Draws a prop or a hero. The drawings have no common bounding box, so the viewBox is fitted after mount. */
function DrawnPicture({ picture }: { picture: Extract<PictureSpec, { kind: 'prop' | 'character' }> }) {
  const groupRef = useRef<SVGGElement>(null)
  const [viewBox, setViewBox] = useState(BASE_VIEWBOX)

  useLayoutEffect(() => {
    const box = groupRef.current?.getBBox()
    if (box && box.width > 0 && box.height > 0) {
      setViewBox(`${box.x - MARGIN} ${box.y - MARGIN} ${box.width + 2 * MARGIN} ${box.height + 2 * MARGIN}`)
    }
  }, [picture])

  let drawing = null
  if (picture.kind === 'prop') {
    const { object, variant } = parseProp(picture.prop)
    const Prop = PROP_DRAWINGS[object]
    drawing = Prop ? <Prop variant={variant} /> : null
  } else {
    const Hero = CHARACTER_DRAWINGS[picture.character]
    drawing = <Hero primary={picture.color} mood="happy" />
  }

  return (
    <svg viewBox={viewBox} preserveAspectRatio="xMidYMid meet" className="block h-full w-full" aria-hidden="true">
      <g ref={groupRef}>{drawing}</g>
    </svg>
  )
}

/** A word picture that fills its parent. Colour and number pictures carry no text the child would need to read. */
export function WordPicture({ picture, className = '' }: WordPictureProps) {
  const box = `h-full w-full ${className}`
  if (picture.kind === 'color') {
    return (
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className={box} aria-hidden="true">
        <path
          d="M50 8 C68 6 90 18 92 42 C94 64 80 90 54 92 C28 94 8 78 8 52 C8 28 30 10 50 8 Z"
          fill={picture.color}
          stroke={darken(picture.color, 0.45)}
          strokeWidth={4}
          strokeLinejoin="round"
        />
        <ellipse cx={34} cy={30} rx={11} ry={6} fill="#fff" opacity={0.45} transform="rotate(-30 34 30)" />
      </svg>
    )
  }
  if (picture.kind === 'count') {
    const gap = 16
    const start = 50 - ((picture.count - 1) * gap) / 2
    return (
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className={box} aria-hidden="true">
        <text x={50} y={64} textAnchor="middle" fontSize={68} fontWeight={700} fill="#6D28D9">
          {picture.count}
        </text>
        {Array.from({ length: picture.count }, (_, i) => (
          <circle key={i} cx={start + i * gap} cy={84} r={6} fill="#F59E0B" stroke="#B45309" strokeWidth={1.5} />
        ))}
      </svg>
    )
  }
  return (
    <div className={box}>
      <DrawnPicture picture={picture} />
    </div>
  )
}

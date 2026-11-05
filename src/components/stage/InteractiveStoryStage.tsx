import type { SceneVisualConfig } from '../../types/story'

export interface InteractiveStoryStageProps {
  visualConfig: SceneVisualConfig
  /** Local illustration from the repo. When set, it replaces the vector scene, the tap stays. */
  imageUrl?: string
  altText: string
  /** Speech bubble text. Without it, a tap shows no bubble. */
  interactiveSoundText?: string
  /** Without it the stage is a static picture (library covers, flashcards). */
  onCharacterTap?: (text: string) => void
  className?: string
}

/** Placeholder with the final interface. The stage-artist agent replaces the body. */
export function InteractiveStoryStage({ altText, className }: InteractiveStoryStageProps) {
  return (
    <div role="img" aria-label={altText} className={`h-full w-full bg-sky-100 ${className ?? ''}`} />
  )
}

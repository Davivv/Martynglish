import type { Story } from '../types/story'
import { loadProgress, saveProgress } from './storage'

/** Stars = number of stories read at least once. The per-story counter is separate. */
export function countStars(progress: Record<string, number>, stories: readonly Pick<Story, 'id'>[]): number {
  return stories.filter((s) => (progress[s.id] ?? 0) > 0).length
}

export function withCompletion(progress: Record<string, number>, storyId: string): Record<string, number> {
  return { ...progress, [storyId]: (progress[storyId] ?? 0) + 1 }
}

/** Returns the new number of completions of the story. */
export function recordCompletion(storyId: string): number {
  const next = withCompletion(loadProgress(), storyId)
  saveProgress(next)
  return next[storyId]
}

export { loadProgress }

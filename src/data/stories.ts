import type { Story, StoryPage } from '../types/story'
import { loadCustomStories, saveCustomStories } from '../utils/storage'
import rawStories from './stories.json'

export const builtInStories = rawStories as unknown as Story[]

/** Stories added from the phone (Uncle Zone), stored on this device only (D22). */
export function getCustomStories(): Story[] {
  const builtInIds = new Set(builtInStories.map((s) => s.id))
  return loadCustomStories().filter((s) => !builtInIds.has(s.id))
}

/** Returns false when the id collides with a built-in story. An existing custom story with the same id is replaced. */
export function addCustomStory(story: Story): boolean {
  if (builtInStories.some((s) => s.id === story.id)) return false
  const others = getCustomStories().filter((s) => s.id !== story.id)
  saveCustomStories([...others, story])
  return true
}

export function removeCustomStory(id: string): void {
  saveCustomStories(getCustomStories().filter((s) => s.id !== id))
}

export function getAllStories(): Story[] {
  return [...builtInStories, ...getCustomStories()]
}

export function findStoryPage(
  stories: Story[],
  storyId: string,
  pageNumber: number,
): { story: Story; page: StoryPage } | undefined {
  const story = stories.find((s) => s.id === storyId)
  const page = story?.pages.find((p) => p.pageNumber === pageNumber)
  return story && page ? { story, page } : undefined
}

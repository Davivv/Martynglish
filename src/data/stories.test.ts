import { describe, expect, it } from 'vitest'
import { builtInStories, findStoryPage } from './stories'

describe('findStoryPage', () => {
  it('returns undefined for a removed story or page, so flashcards render without a scene', () => {
    expect(findStoryPage(builtInStories, 'deleted-story', 1)).toBeUndefined()
    expect(findStoryPage(builtInStories, builtInStories[0].id, 999)).toBeUndefined()
    expect(findStoryPage(builtInStories, builtInStories[0].id, 1)?.page.pageNumber).toBe(1)
  })
})

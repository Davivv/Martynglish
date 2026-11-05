// CLI of the Story Guardian: npm run guardian [path-to-stories.json]
// Exit code 1 stops `npm run build` through the prebuild script.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  SUCCESS_MESSAGE,
  formatIssue,
  validateStories,
} from '../src/utils/storyGuardianCore.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const storiesPath = path.resolve(process.argv[2] ?? path.join(root, 'src/data/stories.json'))

/** @param {string} url */
function getImageSize(url) {
  try {
    return fs.statSync(path.join(root, 'public', url)).size
  } catch {
    return null
  }
}

function readStories() {
  try {
    return { stories: JSON.parse(fs.readFileSync(storiesPath, 'utf8')) }
  } catch (error) {
    return { failure: error instanceof Error ? error.message : String(error) }
  }
}

function main() {
  console.log(`🛡️  Strażnik Bajek: ${path.relative(root, storiesPath)}\n`)

  const { stories, failure } = readStories()
  if (failure) {
    console.log(`❌ Nie mogę odczytać bajek: ${failure}`)
    return 1
  }

  const report = validateStories(stories, { getImageSize })

  if (Array.isArray(stories)) {
    const failed = new Set(report.errors.map((issue) => issue.storyId))
    for (const story of stories) {
      const pages = Array.isArray(story?.pages) ? story.pages.length : 0
      console.log(`${failed.has(story?.id) ? '✗' : '✓'} ${story?.id ?? '(bez id)'}: stron ${pages}`)
    }
    console.log()
  }

  for (const issue of report.warnings) console.log(`⚠️  ${formatIssue(issue)}`)
  for (const issue of report.errors) console.log(`❌ ${formatIssue(issue)}`)
  if (report.warnings.length + report.errors.length > 0) console.log()

  console.log(
    `Bajki: ${report.storyCount}, strony: ${report.pageCount}, ` +
      `błędy: ${report.errors.length}, ostrzeżenia: ${report.warnings.length}`,
  )

  if (report.errors.length > 0) {
    console.log('❌ GUARDIAN CHECK FAILED')
    return 1
  }
  console.log(SUCCESS_MESSAGE)
  return 0
}

// exitCode, not exit(): pipe writes are async on Windows and a long report would be cut off.
process.exitCode = main()

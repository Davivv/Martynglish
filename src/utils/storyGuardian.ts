// Entry point of the Guardian for the app. All rules live in storyGuardianCore.mjs (D15).
export {
  SUCCESS_MESSAGE,
  flashcardOf,
  formatIssue,
  validateImportedStory,
  validateStories,
} from './storyGuardianCore.mjs'

export type { GuardianIssue, GuardianOptions, GuardianReport } from './storyGuardianCore.mjs'

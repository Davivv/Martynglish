// PostToolUse (Write|Edit): po zmianie src/data/stories.json uruchamia Strażnika.
// Exit 2 odsyła raport Strażnika do agenta, który zapisał plik.
import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

const projectDir = process.env.CLAUDE_PROJECT_DIR ?? process.cwd()
const guardian = path.join(projectDir, 'scripts', 'story-guardian.mjs')

const input = JSON.parse(readFileSync(0, 'utf8') || '{}')
const filePath = String(input.tool_input?.file_path ?? '').replaceAll('\\', '/')

if (!filePath.endsWith('src/data/stories.json') || !existsSync(guardian)) process.exit(0)

const { status, stdout, stderr } = spawnSync(process.execPath, [guardian], {
  cwd: projectDir,
  encoding: 'utf8',
})

if (status !== 0) {
  process.stderr.write(`Strażnik odrzucił src/data/stories.json:\n${stdout}${stderr}`)
  // exitCode, not exit(): pipe writes are async on Windows and a long report would be cut off
  process.exitCode = 2
}

import fs from 'node:fs'
import path from 'node:path'

const hookSource = path.resolve('scripts', 'hooks', 'commit-msg')
const hookTarget = path.resolve('.git')
const hookTarget2 = path.resolve('.git', 'hooks', 'commit-msg')

const stats = fs.statSync(hookTarget)
let target = ''

if (stats.isFile()) {
  // MonoRepo was cloned, so read the actual git dir from .git and write to this dir instead
  const content = fs.readFileSync(hookTarget).toString('utf-8')
  const relativePath = content.replace('gitdir: ', '')
  const resolvedPath = path.resolve(relativePath)
  const absolutePath = path.join(resolvedPath, 'hooks', 'commit-msg').replace('\n', '')

  target = absolutePath
  fs.copyFileSync(hookSource, absolutePath)
  fs.chmodSync(absolutePath, 0o755)
} else {
  // Submodule was cloned, so write directly to the hooks directory of this project
  target = hookTarget2
  fs.copyFileSync(hookSource, hookTarget2)
  fs.chmodSync(hookTarget, 0o755)
}

console.log('✅ Git hook installed:', target)

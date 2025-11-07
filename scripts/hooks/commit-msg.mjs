import fs from 'node:fs'
import path from 'node:path'

const hookSource = path.resolve('scripts', 'hooks', 'commit-msg')
const hookTarget = path.resolve('.git', 'hooks', 'commit-msg')

fs.copyFileSync(hookSource, hookTarget)
fs.chmodSync(hookTarget, 0o755)

console.log('✅ Git hook installed:', hookTarget)

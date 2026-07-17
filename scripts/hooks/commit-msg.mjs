import fs from 'node:fs'
import path from 'node:path'

const hookSource = path.resolve('scripts', 'hooks', 'commit-msg')
const gitPath = path.resolve('.git')

const stats = fs.statSync(gitPath)
let hooksDirectory

if (stats.isFile()) {
  const content = fs.readFileSync(gitPath, 'utf8')
  const relativePath = content.replace('gitdir: ', '')
  hooksDirectory = path.join(path.resolve(relativePath.trim()), 'hooks')
} else {
  hooksDirectory = path.join(gitPath, 'hooks')
}

const target = path.join(hooksDirectory, 'commit-msg')
fs.mkdirSync(hooksDirectory, { recursive: true })
fs.copyFileSync(hookSource, target)
fs.chmodSync(target, 0o755)

console.log('✅ Git hook installed:', target)

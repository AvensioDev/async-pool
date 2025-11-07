import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

(() => {
  const iifePath = join('.', 'dist', `pool.iife.js`)

  const fixIIFE = () => {
    const fileIIFE = readFileSync(iifePath)
    const fileContentIIFE = fileIIFE.toString()
    const newFileContentIIFE = fileContentIIFE.replace(/\({}\);/g, '(this);')
    writeFileSync(iifePath, newFileContentIIFE)
  }

  fixIIFE()
})()

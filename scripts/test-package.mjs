import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const require = createRequire(import.meta.url)
const esm = await import(pathToFileURL(resolve('dist/pool.es.js')).href)
const cjs = require(resolve('dist/pool.cjs'))

for (const entry of [esm, cjs]) {
  assert.equal(typeof entry.createPool, 'function')

  const pool = entry.createPool(1)
  assert.deepEqual(await Promise.all([pool(() => 'first'), pool(async () => 'second')]), ['first', 'second'])
}

/**
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

import path from 'node:path'
import { updateRulesTableContent } from './update-rules-table.ts'

async function main() {
  await updateRulesTableContent(
    2,
    path.resolve(import.meta.dirname, '../README.md'),
    path.resolve(import.meta.dirname, '../src/rules'),
    name => `https://eslint-plugin.kazupon.dev/rules/${name}.html`
  )
}

await main()

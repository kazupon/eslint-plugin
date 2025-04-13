/**
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

import path from 'node:path'
import { updateRulesTableContent } from './update-rules-table.ts'

async function main() {
  await updateRulesTableContent(
    1,
    path.resolve(import.meta.dirname, '../docs/rules/index.md'),
    path.resolve(import.meta.dirname, '../src/rules'),
    name => `./${name}.md`
  )
}

await main()

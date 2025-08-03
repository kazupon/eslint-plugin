/**
 * This script is inspired from tools script of `eslint-plugin-module-interop`
 *
 * @see https://github.com/ota-meshi/eslint-plugin-module-interop/tree/main/tools/update-readme.ts
 *
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

import fs from 'node:fs'
import os from 'node:os'
import { renderRulesTableContent } from './render-rules.ts'

const isWin = os.platform().startsWith('win')

/**
 * Update the rules table content in the specified target file.
 *
 * @param categoryLevel - The level of the category in the table. For example, if you want to render a table under a heading like "## Category", set this to 2.
 * @param targetFile - The path to the target file where the rules table will be updated.
 * @param rulesRootPath - The root path of the rules directory. This is where the rules are loaded from.
 * @param resolveRulePath - A function to resolve the path for a rule.
 */
export async function updateRulesTableContent(
  categoryLevel: number,
  targetFile: string,
  rulesRootPath: string,
  resolveRulePath: (ruleName: string) => string
): Promise<void> {
  const pkg = await import('../package.json', { with: { type: 'json' } }).then(m => m.default || m)

  let insertText = `\n${await renderRulesTableContent({
    categoryLevel,
    pluginName: pkg.name,
    rulesRootPath,
    namespace: '@kazupon',
    resolveRulePath
  })}\n`

  if (isWin) {
    insertText = insertText
      .replaceAll(/\r?\n/gu, '\n')
      .replaceAll('\r', '\n')
      .replaceAll('\n', '\r\n')
  }

  const newTargetFile = fs
    .readFileSync(targetFile, 'utf8')
    .replace(
      /<!--RULES_TABLE_START-->[\s\S]*<!--RULES_TABLE_END-->/u,
      `<!--RULES_TABLE_START-->${insertText}<!--RULES_TABLE_END-->`
    )
  fs.writeFileSync(targetFile, newTargetFile, 'utf8')
}

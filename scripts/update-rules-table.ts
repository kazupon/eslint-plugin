/**
 * This script is inspired from tools script of `eslint-plugin-module-interop`
 * @see https://github.com/ota-meshi/eslint-plugin-module-interop/tree/main/tools/update-readme.ts
 *
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

import fs from 'node:fs'
import os from 'node:os'
import { renderRulesTableContent } from './render-rules.ts'

const isWin = os.platform().startsWith('win')

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

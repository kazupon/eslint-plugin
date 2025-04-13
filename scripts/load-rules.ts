/**
 * This script is inspired from tools script of `eslint-plugin-module-interop`
 * @see https://github.com/ota-meshi/eslint-plugin-module-interop/tree/main/tools/lib/load-rules.ts
 *
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

import fs from 'node:fs'
import path from 'node:path'

import type { RuleModule } from '@typescript-eslint/utils/eslint-utils'
import type { RuleMetaDataForScript } from './types.ts'

/**
 * Load rules
 * @param root A root path of rules
 * @param ns A namespace of rule id
 * @returns Loaded rules
 */
export async function loadRules(
  rootPath: string,
  ns: string = ''
): Promise<RuleModule<string, unknown[], RuleMetaDataForScript>[]> {
  const rules: Promise<RuleModule<string, unknown[], RuleMetaDataForScript>>[] = []
  const names = fs
    .readdirSync(rootPath)
    .filter(n => n.endsWith('.ts'))
    .filter(n => n !== 'index.ts')
    .filter(n => !n.endsWith('.test.ts'))
  for (const name of names) {
    const ruleName = name.replace(/\.ts$/u, '')
    const ruleId = ns ? `${ns}/${ruleName}` : ruleName

    rules.push(
      import(path.join(rootPath, name))
        .then(m => m.default || m)
        .then(rule => {
          rule.meta.docs.ruleName = ruleName
          rule.meta.docs.ruleId = ruleId
          return rule
        })
    )
  }
  return Promise.all<RuleModule<string, unknown[], RuleMetaDataForScript>>(rules)
}

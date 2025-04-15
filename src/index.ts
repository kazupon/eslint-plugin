/**
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

import { rules } from './rules/index.ts'
import { name, namespace, version } from './utils/meta.ts'

import type { ESLint, Linter } from 'eslint'

export const plugin: ESLint.Plugin = {
  meta: {
    name,
    version
  },
  rules
}

const commentConfig: Linter.Config[] = [
  {
    name: '@kazupon/eslint-plugin/comment',
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    ignores: ['**/*.md', '**/*.md/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: {
      [namespace]: plugin
    },
    rules: Object.entries(rules).reduce(
      (rules, [ruleName, rule]) => {
        const ruleId =
          rule.meta?.docs?.ruleId || (namespace ? `${namespace}/${ruleName}` : ruleName)
        rules[ruleId] = rule.meta?.docs?.defaultSeverity || 'warn'
        return rules
      },
      Object.create(null) as Linter.RulesRecord
    )
  }
]

export const configs: ESLint.Plugin['configs'] = {
  recommended: [...commentConfig],
  comment: commentConfig
} satisfies ESLint.Plugin['configs']

plugin.configs = configs

/** @alias */
export default plugin

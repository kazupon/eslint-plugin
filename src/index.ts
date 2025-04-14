/**
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

import { rules } from './rules/index.ts'
import { name, namespace, version } from './utils/meta.ts'

// import type { Linter } from '@typescript-eslint/utils/ts-eslint'
import type { ESLint, Linter as ESLinter } from 'eslint'

export const plugin: ESLint.Plugin = {
  meta: {
    name,
    version
  },
  // @ts-expect-error -- TODO: we need to fix this, and `utils/rule.ts` too!
  rules
}

const commentConfig: ESLinter.Config[] = [
  {
    name: '@kazupon/eslint-plugin/comment',
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    ignores: ['**/*.md', '**/*.md/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: {
      [namespace]: plugin
    },
    rules: Object.entries(rules).reduce(
      (rules, [ruleName, rule]) => {
        const ruleId = rule.meta.docs?.ruleId || (namespace ? `${namespace}/${ruleName}` : ruleName)
        rules[ruleId] = rule.meta.docs?.defaultSeverity || 'warn'
        return rules
      },
      Object.create(null) as ESLinter.RulesRecord
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

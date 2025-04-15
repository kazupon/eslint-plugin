/**
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

import { rules } from './rules/index.ts'
import { name, namespace, version } from './utils/constants.ts'

import type { ESLint, Linter } from 'eslint'

type PluginConfigs = {
  recommended: Linter.Config<Linter.RulesRecord>[]
  comment: Linter.Config<Linter.RulesRecord>[]
}
export const plugin: Omit<ESLint.Plugin, 'configs'> & { configs: PluginConfigs } = {
  meta: {
    name,
    version
  },
  rules,
  configs: {} as PluginConfigs
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

export const configs: {
  recommended: typeof commentConfig
  comment: typeof commentConfig
} = {
  recommended: [...commentConfig],
  comment: commentConfig
}

plugin.configs = configs

/** @alias */
export default plugin

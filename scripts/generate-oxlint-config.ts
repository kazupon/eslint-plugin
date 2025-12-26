/**
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

import { promises as fs } from 'node:fs'
import path from 'node:path'
import enforceHeaderComment from '../src/rules/enforce-header-comment.ts'
import { rules } from '../src/rules/index.ts'
import { resolveRuleName } from '../src/utils/config.ts'
import { GLOB_FILES } from '../src/utils/constants.ts'
import { getMetadata } from './utils.ts'
import { enforceHeaderCommentIgnores } from '../src/index.ts'

import type { Oxlintrc, DummyRuleMap } from './oxlint-config.d.ts'
import type { RuleModule } from '../src/utils/types.ts'

function resolveRules(rules: Record<string, RuleModule>, ruleNames: string[]): DummyRuleMap {
  return ruleNames.reduce(
    (acc, ruleName) => {
      const rule = rules[ruleName]
      if (rule.meta?.docs?.ruleName === ruleName) {
        const ruleId = rule.meta?.docs?.ruleId || resolveRuleName(ruleName)
        const severity = rule.meta?.docs?.defaultSeverity || 'warn'
        if (rule.meta?.defaultOptions) {
          acc[ruleId] = [severity, rule.meta?.defaultOptions[0]]
        } else {
          acc[ruleId] = severity
        }
      }
      return acc
    },
    Object.create(null) as DummyRuleMap
  )
}

async function main() {
  await fs.mkdir(path.resolve(import.meta.dirname, '../oxlint'), { recursive: true })

  const metadata = getMetadata()
  const baseRules = resolveRules(rules, Object.keys(rules))

  const config: Oxlintrc = {
    overrides: [
      {
        files: [GLOB_FILES],
        jsPlugins: [metadata.__NAME__],
        rules: baseRules
      },
      {
        files: enforceHeaderCommentIgnores,
        rules: {
          [enforceHeaderComment.meta?.docs?.ruleId || resolveRuleName('enforce-header-comment')]:
            'off'
        }
      }
    ]
  }

  await fs.writeFile(
    path.resolve(import.meta.dirname, '../oxlint/recommended.json'),
    JSON.stringify(config, null, 2),
    'utf8'
  )
}

await main()

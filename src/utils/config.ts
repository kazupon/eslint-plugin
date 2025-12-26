/**
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

import { rules } from '../rules/index.ts'
import { NAMESPACE, NAME } from './constants.ts'

import type { RuleModule } from '../utils/types.ts'
import type { Linter } from 'eslint'

/**
 * Resolve rule name
 *
 * @param ruleName - The rule name
 * @returns The resolved rule name
 */
export function resolveRuleName(ruleName: string): string {
  return NAMESPACE ? `${NAMESPACE}/${ruleName}` : ruleName
}

/**
 * Get namespaced rules
 *
 * @param rules - All rules
 * @param ruleNames - The rule names to include
 * @param defaultSeverity - The default severity level
 * @returns Namespaced rules
 */
function getNamespacedRulesRecord(
  rules: Record<string, RuleModule>,
  ruleNames: string[],
  defaultSeverity: string = 'warn'
): Record<string, string> {
  return Object.entries(rules).reduce(
    (rulesRecord, [ruleName, rule]) => {
      if (!ruleNames.includes(ruleName)) {
        return rulesRecord
      }
      if (rule.meta?.docs?.recommended) {
        const ruleId = rule.meta?.docs?.ruleId || resolveConfigName(ruleName)
        rulesRecord[ruleId] = rule.meta?.docs?.defaultSeverity || defaultSeverity
      }
      return rulesRecord
    },
    Object.create(null) as Record<string, string>
  )
}

/**
 * Resolve config name
 *
 * @param name - The config name
 * @returns The resolved config name
 */
export function resolveConfigName(name: string): string {
  return `${NAME}/${name}`
}

/**
 * The rules to be enforced in the header comment.
 */
export const enforceHeaderCommentRuleOnly: Linter.RulesRecord = getNamespacedRulesRecord(rules, [
  'enforce-header-comment'
]) as Linter.RulesRecord

const baseRulesNames: string[] = Object.keys(rules).filter(
  name => name !== 'enforce-header-comment'
)

/**
 * The base rules excluding the header comment enforcement rule.
 */
export const baseRules: Linter.RulesRecord = getNamespacedRulesRecord(
  rules,
  baseRulesNames
) as Linter.RulesRecord

/**
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

import type { RestRuleMetaData } from '../src/utils/rule.ts'

export type RuleMetaDataForScript = RestRuleMetaData & {
  ruleName: string
  ruleId: string
}

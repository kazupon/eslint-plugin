/**
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

import enforceHeaderComment from './enforce-header-comment.ts'

import type { RuleModule } from '@typescript-eslint/utils/ts-eslint'
import type { RestRuleMetaData } from '../utils/rule.ts'

export const rules: Record<string, RuleModule<string, readonly unknown[], RestRuleMetaData>> = {
  'enforce-header-comment': enforceHeaderComment
}

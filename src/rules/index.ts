import type { Rule } from 'eslint'
import commentRequireHeader from './comment-require-header.ts'

export const rules: Record<string, Rule.RuleModule> = {
  'comment-require-header': commentRequireHeader
}

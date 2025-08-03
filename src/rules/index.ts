/**
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

import enforceHeaderComment from './enforce-header-comment.ts'
import noTagComments from './no-tag-comments.ts'
import preferInlineCodeWordsComments from './prefer-inline-code-words-comments.ts'
import preferScopeOnTagComment from './prefer-scope-on-tag-comment.ts'

import type { RuleModule } from '../utils/types.ts'

export const rules: Record<string, RuleModule> = {
  'enforce-header-comment': enforceHeaderComment,
  'no-tag-comments': noTagComments,
  'prefer-scope-on-tag-comment': preferScopeOnTagComment,
  'prefer-inline-code-words-comments': preferInlineCodeWordsComments
}

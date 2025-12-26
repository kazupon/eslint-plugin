/**
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

import enforceHeaderComment from './enforce-header-comment.ts'
import noTagComments, { DEFAULT_TAGS as NO_TAG_COMMENTS_TAGS } from './no-tag-comments.ts'
import preferInlineCodeWordsComments from './prefer-inline-code-words-comments.ts'
import preferScopeOnTagComment, {
  DEFAULT_TAGS as PREFER_SCOPE_ON_TAG_COMMENT_TAGS,
  DEFAULT_DIRECTIVES as PREFER_SCOPE_ON_TAG_COMMENT_DIRECTIVES
} from './prefer-scope-on-tag-comment.ts'

import type { RuleModule } from '../utils/types.ts'

export const defaultOptions = {
  'no-tag-comments': {
    tags: NO_TAG_COMMENTS_TAGS
  },
  'prefer-scope-on-tag-comment': {
    tags: PREFER_SCOPE_ON_TAG_COMMENT_TAGS,
    directives: PREFER_SCOPE_ON_TAG_COMMENT_DIRECTIVES
  }
}

export const rules: Record<string, RuleModule> = {
  'enforce-header-comment': enforceHeaderComment,
  'no-tag-comments': noTagComments,
  'prefer-scope-on-tag-comment': preferScopeOnTagComment,
  'prefer-inline-code-words-comments': preferInlineCodeWordsComments
}

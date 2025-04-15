/**
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

import enforceHeaderComment from './enforce-header-comment.ts'

import type { RuleModule } from '../utils/types.ts'

export const rules: Record<string, RuleModule> = {
  'enforce-header-comment': enforceHeaderComment
}

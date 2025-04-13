/**
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

import enforceHeaderComment from './enforce-header-comment.ts'

import type { Linter } from '@typescript-eslint/utils/ts-eslint'

export const rules: Linter.PluginRules = {
  'enforce-header-comment': enforceHeaderComment
}

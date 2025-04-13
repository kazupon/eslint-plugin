/**
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

import commentEnforceHeader from './comment-enforce-header.ts'

import type { Linter } from '@typescript-eslint/utils/ts-eslint'

export const rules: Linter.PluginRules = {
  'comment-enforce-header': commentEnforceHeader
}

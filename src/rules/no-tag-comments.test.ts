/**
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

import { run } from 'eslint-vitest-rule-tester'
import rule from './no-tag-comments.ts'

import type { InvalidTestCase, ValidTestCase } from 'eslint-vitest-rule-tester'

const valids: ValidTestCase[] = []

const invalids: InvalidTestCase[] = []

run({
  name: 'no-tag-comments',
  rule,
  valid: valids,
  invalid: invalids
})

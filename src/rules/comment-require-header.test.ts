import { run } from 'eslint-vitest-rule-tester'
import rule from './comment-require-header.ts'

import type { InvalidTestCase, ValidTestCase } from 'eslint-vitest-rule-tester'

const valids: ValidTestCase[] = [
  // TODO: add valid test cases
]

const invalids: InvalidTestCase[] = [
  // TODO: add invalid test cases
]

run({
  rule,
  valid: valids,
  invalid: invalids
})

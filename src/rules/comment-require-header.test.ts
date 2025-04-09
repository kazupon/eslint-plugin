import { run } from 'eslint-vitest-rule-tester'
import rule from './comment-require-header.ts'

import type { InvalidTestCase, ValidTestCase } from 'eslint-vitest-rule-tester'

const valids: ValidTestCase[] = [
  {
    filename: 'eslint.config.ts',
    code: `/**
  * @author kazupon
  * @license MIT
  */
import { defineConfig } from "eslint/config"
`
  }
]

const invalids: InvalidTestCase[] = [
  {
    filename: 'index.ts',
    description: 'should require header',
    code: 'import { foo } from "bar"',
    errors: [
      { message: 'Header comment is required' },
      { message: 'Header comment need `@author` tag' },
      { message: 'Header comment need `@license` tag' }
    ]
  },
  {
    filename: 'index.ts',
    description: 'should require `@author` tag in header',
    code: `/**
  * @license MIT
  */
import { foo } from "bar"
`,
    errors: [
      { message: 'Header comment is required' },
      { message: 'Header comment need `@author` tag' }
    ]
  },
  {
    filename: 'index.ts',
    description: 'should require `@author` tag in header',
    code: `/**
  * @author kazupon
  */
import { foo } from "bar"
`,
    errors: [
      { message: 'Header comment is required' },
      { message: 'Header comment need `@license` tag' }
    ]
  },
  {
    filename: 'index.ts',
    description: 'should require `@author` and `@license` tag in header',
    code: `/**
  * copyright (c) kazupon coprporation
  */
import { foo } from "bar"
`,
    errors: [
      { message: 'Header comment need `@author` tag' },
      { message: 'Header comment need `@license` tag' }
    ]
  },
  {
    filename: 'index.ts',
    description: 'should require the value in `@author` tag',
    code: `/**
  * @author
  * @license MIT
  */
import { foo } from "bar"
`,
    errors: [{ message: '`@author` tag need a value' }]
  },
  {
    filename: 'index.ts',
    description: 'should require the value in `@license` tag',
    code: `/**
  * @author kazupon
  * @license
  */
import { foo } from "bar"
`,
    errors: [{ message: '`@license` tag need a value' }]
  },
  {
    filename: 'index.ts',
    description: 'should require the values in `@author` and `@license` tag',
    code: `/**
  * @author
  * @license
  */
import { foo } from "bar"
`,
    errors: [{ message: '`@author` tag need a value' }, { message: '`@license` tag need a value' }]
  }
]

run({
  name: 'comment-require-header',
  rule,
  valid: valids,
  invalid: invalids
})

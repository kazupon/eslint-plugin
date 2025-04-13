/**
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

import { run } from 'eslint-vitest-rule-tester'
import rule from './comment-enforce-header.ts'

import type { InvalidTestCase, ValidTestCase } from 'eslint-vitest-rule-tester'

const valids: ValidTestCase[] = [
  {
    filename: 'eslint.config.js',
    description: 'single header comment',
    code: `/**
 * @author kazupon
 * @license MIT
 */

import { defineConfig } from 'eslint/config'

export default defineConfig({})
`
  },
  {
    filename: 'index.js',
    description: 'multiple header comments case',
    code: `/**
 * This module is a sample module
 * @module
 */
/**
 * @author kazupon
 * @license MIT
 */

/**
 * NOTE: This is a sample module
 */

/**
 * add two numbers
 * @param a first number
 * @param b second number
 * @returns sum of a and b
 */
export function add(a, b) {
  return a + b
}`
  },
  {
    filename: 'eslint.config.js',
    description: 'header comment with multiple tags',
    code: `/**
 * This module is estlint config.
 * @module
 * @author kazupon
 * @license MIT
 */

import { defineConfig } from 'eslint/config'

export default defineConfig({})
`
  },
  {
    filename: 'index.js',
    description: 'header comment with standalone license',
    code: `/**
 * @author kazupon
 * @license
 * Copyright (c) 2025 Example Corporation Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * entry point
 */
async function main() {
  console.log('Hello, world!')
}

// fire!
await main()
`
  }
]

const invalids: InvalidTestCase[] = [
  {
    filename: 'index.js',
    description: 'should enforce header',
    code: `import { foo } from 'bar'`,
    errors: [
      { message: 'Header comment is enforced' },
      { message: 'Header comment need `@author` tag' },
      { message: 'Header comment need `@license` tag' }
    ]
  },
  {
    filename: 'index.js',
    description: 'should require `@author` and `@license` tag in header',
    code: `/**
 * copyright (c) kazupon coprporation
 */
`,
    errors: [
      { message: 'Header comment need `@author` tag' },
      { message: 'Header comment need `@license` tag' }
    ]
  },
  {
    filename: 'index.js',
    description: 'should enforce `@author` tag in header',
    code: `/**
 * @license MIT
 */

import { foo } from 'bar'
`,
    errors: [{ message: 'Header comment need `@author` tag' }]
  },
  {
    filename: 'index.js',
    description: 'should enforce `@author` tag in header',
    code: `/**
 * @author kazupon
 */

import { foo } from 'bar'
`,
    errors: [{ message: 'Header comment need `@license` tag' }]
  },
  {
    filename: 'index.js',
    description: 'should enforce the value in `@author` tag',
    code: `/**
 * @author
 * @license MIT
 */

import { foo } from 'bar'
`,
    errors: [{ message: 'Header `@author` tag need a value' }]
  },
  {
    filename: 'index.js',
    description: 'should enforce the value in `@license` tag',
    code: `/**
 * @author kazupon
 * @license
 */

import { foo } from 'bar'
`,
    errors: [{ message: 'Header `@license` tag need a value' }]
  },
  {
    filename: 'index.js',
    description: 'should enforce the values in `@author` and `@license` tag',
    code: `/**
 * @author
 * @license
 */

import { foo } from 'bar'
`,
    errors: [
      { message: 'Header `@author` tag need a value' },
      { message: 'Header `@license` tag need a value' }
    ]
  },
  {
    filename: 'index.js',
    description: 'should enforce the value in `@author` tag in multiple header comments',
    code: `/**
 * This module is a sample module
 * @module
 */
/**
 * @author
 * @license MIT
 */

/**
 * NOTE: This is a sample module
 */

/**
 * add two numbers
 * @param a first number
 * @param b second number
 * @returns sum of a and b
 */
export function add(a, b) {
  return a + b
}`,
    errors: [{ message: 'Header `@author` tag need a value' }]
  },
  {
    filename: 'index.js',
    description: 'should enforce the `@author` and `@license` tag in multiple header comments',
    code: `/**
 * This module is a sample module
 * @module
 */

/**
 * NOTE: This is a sample module
 */

/**
 * add two numbers
 * @param a first number
 * @param b second number
 * @returns sum of a and b
 */
export function add(a, b) {
  return a + b
}`,
    errors: [
      { message: 'Header comment need `@author` tag' },
      { message: 'Header comment need `@license` tag' }
    ]
  }
]

run({
  name: 'comment-enforce-header',
  rule,
  valid: valids,
  invalid: invalids
})

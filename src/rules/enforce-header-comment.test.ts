import rule from './enforce-header-comment.ts'
import { run } from '../utils/tester.ts'

import type { ValidTestCase, InvalidTestCase } from '../utils/tester.ts'

const valid: ValidTestCase[] = [
  {
    description: 'single header comment',
    filename: 'eslint.config.js',
    code: `/**
 * @author kazupon
 * @license MIT
 */

import { defineConfig } from 'eslint/config'

export default defineConfig({})
`
  },
  {
    description: 'multiple header comments',
    filename: 'index.js',
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
    description: 'header comment with multiple tags',
    filename: 'eslint.config.js',
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
    description: 'header comment with standalone license',
    filename: 'index.js',
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

const invalid: InvalidTestCase[] = [
  {
    description: 'should enforce header',
    filename: 'index.js',
    code: `import { foo } from 'bar'`,
    errors: [
      { message: 'Header comment is enforced' },
      { message: 'Header comment need `@author` tag' },
      { message: 'Header comment need `@license` tag' }
    ]
  },
  {
    description: 'should require `@author` and `@license` tag in header',
    filename: 'index.js',
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
    description: 'should enforce `@author` and `@license` tag in header',
    filename: 'index.js',
    code: `/**
 * @license MIT
 */

import { foo } from 'bar'
`,
    errors: [{ message: 'Header comment need `@author` tag' }]
  },
  {
    description: 'should enforce `@author` tag in header',
    filename: 'index.js',
    code: `/**
 * @author kazupon
 */

import { foo } from 'bar'
`,
    errors: [{ message: 'Header comment need `@license` tag' }]
  },
  {
    description: 'should enforce the value in `@author` and `@license` tag',
    filename: 'index.js',
    code: `/**
 * @author
 * @license MIT
 */

import { foo } from 'bar'
`,
    errors: [{ message: 'Header `@author` tag need a value' }]
  },
  {
    description: 'should enforce the value in `@license` tag',
    filename: 'index.js',
    code: `/**
 * @author kazupon
 * @license
 */

import { foo } from 'bar'
`,
    errors: [{ message: 'Header `@license` tag need a value' }]
  },
  {
    description: 'should enforce the values in `@author` and `@license` tag',
    filename: 'index.js',
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
    description: 'should enforce the `@author` tag in multiple header comments',
    filename: 'index.js',
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
    description: 'should enforce the `@license` tag in multiple header comments',
    filename: 'index.js',
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
  },
  {
    description: 'header comment with standalone license and missing tags',
    filename: 'index.js',
    code: `/**
 * The entry for usage generator.
 * @example
 * \`\`\`js
 * import { generate } from 'gunshi/generator'
 * \`\`\`
 * @module
 */

import { cli } from './cli.ts'
import { create } from './utils.ts'
`,
    errors: [
      { message: 'Header comment need `@author` tag' },
      { message: 'Header comment need `@license` tag' }
    ]
  }
]

run({
  name: 'enforce-header-comment',
  rule,
  linter: ['eslint', 'oxlint'],
  valid,
  invalid
})

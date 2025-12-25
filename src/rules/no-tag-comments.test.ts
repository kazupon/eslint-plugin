/**
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

import { run } from 'eslint-vitest-rule-tester'
import rule from './no-tag-comments.ts'

import type { InvalidTestCase, ValidTestCase } from 'eslint-vitest-rule-tester'

const valids: ValidTestCase[] = [
  {
    filename: 'index.js',
    description: 'no tag comments',
    code: `function loop() {
  let result = 0

  let condition = true
  let counter = 0
  while (condition) {
    // something bad logic ...
    counter++
    if (counter === 5) {
      condition = false
    }
  }

  return result
}`
  },
  {
    filename: 'index.js',
    description: 'comment with TODO is allowed by default',
    code: `// TODO: implement this function later`
  },
  {
    filename: 'index.js',
    description: 'tags in middle of comment are allowed',
    code: `// This is not a FIXME at the start`
  },
  {
    filename: 'index.js',
    description: 'block comment without tags',
    code: `/**
 * This is a regular block comment
 * without any tags
 */`
  },
  {
    filename: 'index.js',
    description: 'with custom tags option - FIXME is allowed',
    options: [{ tags: ['ISSUE'] }],
    code: `// FIXME: \`FIXME\` tag is not report, so rule options are overridden by 'ISSUE'`
  }
]

const invalids: InvalidTestCase[] = [
  {
    filename: 'index.js',
    description: 'FIXME tag in line comment',
    code: `// FIXME: \`loop\` function has infinify loop ...
function loop() {
  let result = 0

  let condition = true
  let counter = 0
  while (condition) {
    // BUG: cannot exit loop, because ...
    // something bad logic ...
    counter++
  }

  return result
}`,
    errors: [
      {
        message: "Exist 'FIXME' tag comment",
        line: 1,
        column: 4,
        endColumn: 9
      },
      {
        message: "Exist 'BUG' tag comment",
        line: 8,
        column: 8,
        endColumn: 11
      }
    ]
  },
  {
    filename: 'index.js',
    description: 'FIXME tag in block comment',
    code: `/**
 * FIXME:
 * \`loop\` function has infinify loop ...
 */
function loop() {
  let result = 0

  let condition = true
  let counter = 0
  while (condition) {
    /**
     * BUG:
     * cannot exit loop, because ...
     */

    // something bad logic ...
    counter++
  }

  return result
}`,
    errors: [
      {
        message: "Exist 'FIXME' tag comment",
        line: 2,
        column: 4,
        endColumn: 9
      },
      {
        message: "Exist 'BUG' tag comment",
        line: 12,
        column: 8,
        endColumn: 11
      }
    ]
  },
  {
    filename: 'index.js',
    description: 'with custom tags option - ISSUE tag',
    options: [{ tags: ['ISSUE'] }],
    code: `// Line comment case
// ISSUE: This code has still issues...

/* Block comment case */
/*
 * ISSUE:
 * This code has still issues...
 */

// FIXME: \`FIXME\` tag is not report, so rule options are overridden by 'ISSUE'`,
    errors: [
      {
        message: "Exist 'ISSUE' tag comment",
        line: 2,
        column: 4,
        endColumn: 9
      },
      {
        message: "Exist 'ISSUE' tag comment",
        line: 6,
        column: 4,
        endColumn: 9
      }
    ]
  },
  {
    filename: 'index.js',
    description: 'BUG tag at start of comment',
    code: `// BUG: this is a bug`,
    errors: [
      {
        message: "Exist 'BUG' tag comment",
        line: 1,
        column: 4,
        endColumn: 7
      }
    ]
  },
  {
    filename: 'index.js',
    description: 'tag with no colon should still be detected',
    code: `// FIXME this should also be detected`,
    errors: [
      {
        message: "Exist 'FIXME' tag comment",
        line: 1,
        column: 4,
        endColumn: 9
      }
    ]
  }
]

// eslint-disable-next-line @typescript-eslint/no-floating-promises -- ignore
run({
  name: 'no-tag-comments',
  rule,
  valid: valids,
  invalid: invalids
})

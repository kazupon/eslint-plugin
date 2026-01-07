import { run, getLinter } from '../utils/tester.ts'
import rule from './prefer-inline-code-words-comments.ts'

import type { ValidTestCase, InvalidTestCase } from '../utils/tester.ts'

const valid: ValidTestCase[] = [
  {
    filename: 'index.js',
    description: 'no options provided - no checks performed',
    code: '// you can output with using console.log'
  },
  {
    filename: 'index.js',
    description: 'line comment with inline code already present',
    options: [{ words: ['console.log'] }],
    code: '// you can output with using `console.log`'
  },
  {
    filename: 'index.js',
    description: 'block comment with inline code already present',
    options: [{ words: ['fetch'] }],
    code: '/* load user data via `fetch` */'
  },
  {
    filename: 'index.js',
    description: 'jsdoc style comment with inline code already present',
    options: [{ words: ['fetch'] }],
    code: `/**
 * Get a blog article.
 *
 * This API is used by \`fetch\` internally
 *
 * @params id - An blog ID
 * @returns A blog article data
 */`
  },
  {
    filename: 'index.js',
    description: 'multiple words, all wrapped in inline code',
    options: [{ words: ['console.log', 'fetch'] }],
    code: `// you can output with using \`console.log\`
console.log('hello world!')

/* load user data via \`fetch\` */
const data = await fetch('https://example.com/api/users/1')`
  },
  {
    filename: 'index.js',
    description: 'word not in the list is not checked',
    options: [{ words: ['console.log'] }],
    code: '// use fetch to load data'
  },
  {
    filename: 'index.js',
    description: 'word as part of larger word is not matched',
    options: [{ words: ['log'] }],
    code: '// use logging to output'
  },
  {
    filename: 'index.js',
    description: 'word as standalone is matched',
    options: [{ words: ['log'] }],
    code: '// use `log` to output'
  },
  {
    filename: 'index.js',
    description: 'case sensitive matching',
    options: [{ words: ['fetch'] }],
    code: '// use FETCH to load data'
  }
]

const invalid: InvalidTestCase[] = [
  {
    filename: 'index.js',
    description: 'line comment missing inline code',
    options: [{ words: ['console.log'] }],
    code: '// you can output with using console.log',
    output: '// you can output with using `console.log`',
    errors: [
      {
        message: 'The word "console.log" should be wrapped in inline code',
        line: 1,
        column: 30,
        endColumn: 41
      }
    ]
  },
  {
    filename: 'index.js',
    description: 'block comment missing inline code',
    options: [{ words: ['fetch'] }],
    code: '/* load user data via fetch */',
    output: '/* load user data via `fetch` */',
    errors: [
      {
        message: 'The word "fetch" should be wrapped in inline code',
        line: 1,
        column: 23,
        endColumn: 28
      }
    ]
  },
  {
    filename: 'index.js',
    description: 'jsdoc style comment missing inline code',
    options: [{ words: ['fetch'] }],
    code: `/**
 * Get a blog article.
 *
 * This API is used by fetch internally
 *
 * @params id - An blog ID
 * @returns A blog article data
 */`,
    output: `/**
 * Get a blog article.
 *
 * This API is used by \`fetch\` internally
 *
 * @params id - An blog ID
 * @returns A blog article data
 */`,
    errors: [
      {
        message: 'The word "fetch" should be wrapped in inline code',
        line: 4,
        column: 24,
        endColumn: 29
      }
    ]
  },
  {
    filename: 'index.js',
    description: 'multiple occurrences in single comment',
    options: [{ words: ['fetch'] }],
    code: '// use fetch to load data, fetch is async',
    output: '// use `fetch` to load data, `fetch` is async',
    errors: [
      {
        message: 'The word "fetch" should be wrapped in inline code',
        line: 1,
        column: 8,
        endColumn: 13
      },
      {
        message: 'The word "fetch" should be wrapped in inline code',
        line: 1,
        column: 28,
        endColumn: 33
      }
    ]
  },
  {
    filename: 'index.js',
    description: 'multiple words missing inline code',
    options: [{ words: ['console.log', 'fetch'] }],
    code: `// you can output with using console.log
console.log('hello world!')

/* load user data via fetch */
const data = await fetch('https://example.com/api/users/1')`,
    output: `// you can output with using \`console.log\`
console.log('hello world!')

/* load user data via \`fetch\` */
const data = await fetch('https://example.com/api/users/1')`,
    errors: [
      {
        message: 'The word "console.log" should be wrapped in inline code',
        line: 1,
        column: 30,
        endColumn: 41
      },
      {
        message: 'The word "fetch" should be wrapped in inline code',
        line: 4,
        column: 23,
        endColumn: 28
      }
    ]
  },
  {
    filename: 'index.js',
    description: 'multiline comment with missing inline code',
    options: [{ words: ['console.log', 'fetch'] }],
    code: `/**
 * Get a blog article.
 *
 * This API is used by fetch internally
 * and outputs results with console.log
 *
 * @params id - An blog ID
 * @returns A blog article data
 */
export function getBlogArticle(id) {
  // something logic ...
}`,
    output: `/**
 * Get a blog article.
 *
 * This API is used by \`fetch\` internally
 * and outputs results with \`console.log\`
 *
 * @params id - An blog ID
 * @returns A blog article data
 */
export function getBlogArticle(id) {
  // something logic ...
}`,
    errors: [
      {
        message: 'The word "fetch" should be wrapped in inline code',
        line: 4,
        column: 24,
        endColumn: 29
      },
      {
        message: 'The word "console.log" should be wrapped in inline code',
        line: 5,
        column: 29,
        endColumn: 40
      }
    ]
  }
]

run({
  name: 'prefer-inline-code-words-comments',
  rule,
  linter: getLinter(),
  valid,
  invalid
})

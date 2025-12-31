import { run } from '../utils/tester.ts'
import rule from './prefer-scope-on-tag-comment.ts'

import type { ValidTestCase, InvalidTestCase } from '../utils/tester.ts'

const valid: ValidTestCase[] = [
  {
    filename: 'index.js',
    description: 'TODO with scope',
    code: `// TODO(kazupon): This is todo comment`
  },
  {
    filename: 'index.js',
    description: 'TODO with scope in block comment',
    code: `/* TODO(kazupon): This is todo comment */`
  },
  {
    filename: 'index.js',
    description: 'FIXME with team scope',
    code: `// FIXME(auth-team): Fix authentication issue`
  },
  {
    filename: 'index.js',
    description: 'TODO with ticket number scope',
    code: `// TODO(ISSUE-123): Implement new feature`
  },
  {
    filename: 'index.js',
    description: 'HACK with module scope',
    code: `// HACK(frontend): Temporary workaround for rendering`
  },
  {
    filename: 'index.js',
    description: 'BUG with author scope',
    code: `// BUG(kazupon): This code has still bug ...`
  },
  {
    filename: 'index.js',
    description: 'NOTE with scope',
    code: `// NOTE(security): Check permissions here`
  },
  {
    filename: 'index.js',
    description: 'no tag comment',
    code: `// This is just a regular comment`
  },
  {
    filename: 'index.js',
    description: 'tag in middle of comment',
    code: `// This is not a TODO at the start`
  },
  {
    filename: 'index.js',
    description: 'block comment with scope',
    code: `/**
 * TODO(john): Implement this function
 * with proper error handling
 */`
  },
  {
    filename: 'index.js',
    description: 'JSDoc style comment with scope',
    code: `/**
 * FIXME(alice): Fix memory leak
 * in the event handler
 */`
  },
  {
    filename: 'index.js',
    description: 'custom tags option - only check specified tags',
    options: [{ tags: ['CUSTOM'] }],
    code: `// TODO: This TODO is not checked
// CUSTOM(dev): This custom tag has scope`
  },
  {
    filename: 'index.js',
    description: 'custom tags option with ISSUE tag',
    options: [{ tags: ['ISSUE'] }],
    code: `// ISSUE(kazupon): This code has still issue ...
// TODO: This TODO is not reported`
  },
  {
    filename: 'index.js',
    description: 'scope with numbers and special characters',
    code: `// TODO(user-123_456): Complex scope identifier`
  },
  {
    filename: 'index.js',
    description: 'scope with dots',
    code: `// TODO(v1.2.3): Version-based scope`
  },
  {
    filename: 'index.js',
    description: 'scope on `eslint-disable` directive at block comment with rule',
    code: `/* eslint no-alert: 'error' */
/* eslint-disable no-alert -- NOTE(kazupon): To avoid something */
alert("foo");
/* eslint-enable no-alert */
`
  },
  {
    filename: 'index.js',
    description: 'scope on `eslint-disable-line` directive at line comment',
    code: `/* eslint no-alert: 'error' */
alert("foo"); // eslint-disable-line no-alert -- NOTE(kazupon): To avoid something
`
  },
  {
    filename: 'index.js',
    description: 'scope on `eslint-disable-next-line` directive at block comment',
    code: `/* eslint quotes: 'error' */
/* eslint semi: 'error' */
/* eslint-disable-next-line
   quotes,
   semi
   --
   NOTE(kazupon): To suppress for warning styles
*/
const b = '1'
`
  },
  {
    filename: 'index.js',
    description: 'scope on typescript comment directive `@ts-expect-error`',
    code: `// @ts-expect-error -- TODO(kazupon): We should be taken care of it later`
  },
  {
    filename: 'index.js',
    description: 'scope on typescript comment directive `@ts-ignore` without terminator',
    code: `// @ts-ignore NOTE(kazupon): We should be taken care of it later`
  },
  {
    filename: 'index.js',
    description: 'scope on custom directive',
    options: [{ directives: ['custom-directive'] }],
    code: `// custom-directive -- NOTE(kazupon): This is custom directive comment with terminator
/* custom-directive NOTE(kazupon): This is custom directive comment without terminator */
`
  }
]

const invalid: InvalidTestCase[] = [
  {
    filename: 'index.js',
    description: 'TODO without scope',
    code: `// TODO: This is todo comment`,
    errors: [
      {
        message: "Tag comment 'TODO' is missing a scope. Use format: TODO(scope)",
        line: 1,
        column: 4,
        endColumn: 8
      }
    ]
  },
  {
    filename: 'index.js',
    description: 'TODO without scope in block comment',
    code: `/* TODO: This is todo comment */`,
    errors: [
      {
        message: "Tag comment 'TODO' is missing a scope. Use format: TODO(scope)",
        line: 1,
        column: 4,
        endColumn: 8
      }
    ]
  },
  {
    filename: 'index.js',
    description: 'FIXME without scope',
    code: `// FIXME: Fix this bug`,
    errors: [
      {
        message: "Tag comment 'FIXME' is missing a scope. Use format: FIXME(scope)",
        line: 1,
        column: 4,
        endColumn: 9
      }
    ]
  },
  {
    filename: 'index.js',
    description: 'HACK without scope',
    code: `// HACK: Temporary workaround`,
    errors: [
      {
        message: "Tag comment 'HACK' is missing a scope. Use format: HACK(scope)",
        line: 1,
        column: 4,
        endColumn: 8
      }
    ]
  },
  {
    filename: 'index.js',
    description: 'BUG without scope',
    code: `// BUG: This code has still bug ...`,
    errors: [
      {
        message: "Tag comment 'BUG' is missing a scope. Use format: BUG(scope)",
        line: 1,
        column: 4,
        endColumn: 7
      }
    ]
  },
  {
    filename: 'index.js',
    description: 'NOTE without scope',
    code: `// NOTE: Important information`,
    errors: [
      {
        message: "Tag comment 'NOTE' is missing a scope. Use format: NOTE(scope)",
        line: 1,
        column: 4,
        endColumn: 8
      }
    ]
  },
  {
    filename: 'index.js',
    description: 'tag with no colon',
    code: `// TODO this should also be detected`,
    errors: [
      {
        message: "Tag comment 'TODO' is missing a scope. Use format: TODO(scope)",
        line: 1,
        column: 4,
        endColumn: 8
      }
    ]
  },
  {
    filename: 'index.js',
    description: 'empty parentheses should be invalid',
    code: `// TODO(): Empty scope`,
    errors: [
      {
        message: "Tag comment 'TODO' is missing a scope. Use format: TODO(scope)",
        line: 1,
        column: 4,
        endColumn: 8
      }
    ]
  },
  {
    filename: 'index.js',
    description: 'whitespace-only scope should be invalid',
    code: `// TODO(   ): Whitespace only`,
    errors: [
      {
        message: "Tag comment 'TODO' is missing a scope. Use format: TODO(scope)",
        line: 1,
        column: 4,
        endColumn: 8
      }
    ]
  },
  {
    filename: 'index.js',
    description: 'block comment without scope',
    code: `/**
 * TODO:
 * Implement this function
 */`,
    errors: [
      {
        message: "Tag comment 'TODO' is missing a scope. Use format: TODO(scope)",
        line: 2,
        column: 4,
        endColumn: 8
      }
    ]
  },
  {
    filename: 'index.js',
    description: 'JSDoc style comment without scope',
    code: `/**
 * FIXME:
 * Fix memory leak
 */`,
    errors: [
      {
        message: "Tag comment 'FIXME' is missing a scope. Use format: FIXME(scope)",
        line: 2,
        column: 4,
        endColumn: 9
      }
    ]
  },
  {
    filename: 'index.js',
    description: 'multiple tags without scope',
    code: `// TODO: First task
// FIXME: Second issue
/* HACK: Third workaround */`,
    errors: [
      {
        message: "Tag comment 'TODO' is missing a scope. Use format: TODO(scope)",
        line: 1,
        column: 4,
        endColumn: 8
      },
      {
        message: "Tag comment 'FIXME' is missing a scope. Use format: FIXME(scope)",
        line: 2,
        column: 4,
        endColumn: 9
      },
      {
        message: "Tag comment 'HACK' is missing a scope. Use format: HACK(scope)",
        line: 3,
        column: 4,
        endColumn: 8
      }
    ]
  },
  {
    filename: 'index.js',
    description: 'custom tags option',
    options: [{ tags: ['CUSTOM', 'SPECIAL'] }],
    code: `// CUSTOM: Custom tag without scope
// SPECIAL: Special tag without scope
// TODO: This TODO is not checked`,
    errors: [
      {
        message: "Tag comment 'CUSTOM' is missing a scope. Use format: CUSTOM(scope)",
        line: 1,
        column: 4,
        endColumn: 10
      },
      {
        message: "Tag comment 'SPECIAL' is missing a scope. Use format: SPECIAL(scope)",
        line: 2,
        column: 4,
        endColumn: 11
      }
    ]
  },
  {
    filename: 'index.js',
    description: 'scope on `eslint-disable` directive at block comment with rule',
    code: `/* eslint no-alert: 'error' */
/* eslint-disable no-alert -- NOTE: To avoid something */
alert("foo");
/* eslint-enable no-alert */
`,
    errors: [
      {
        message: "Tag comment 'NOTE' is missing a scope. Use format: NOTE(scope)",
        line: 2,
        column: 31,
        endColumn: 35
      }
    ]
  },
  {
    filename: 'index.js',
    description: 'scope on `eslint-disable-line` directive at line comment',
    code: `/* eslint no-alert: 'error' */
alert("foo"); // eslint-disable-line no-alert -- NOTE: To avoid something
`,
    errors: [
      {
        message: "Tag comment 'NOTE' is missing a scope. Use format: NOTE(scope)",
        line: 2,
        column: 50,
        endColumn: 54
      }
    ]
  },
  {
    filename: 'index.js',
    description: 'scope on `eslint-disable-next-line` directive at block comment',
    code: `/* eslint quotes: 'error' */
/* eslint semi: 'error' */
/* eslint-disable-next-line
   quotes,
   semi
   --
   NOTE: To suppress for warning styles
*/
const b = '1'
`,
    errors: [
      {
        message: "Tag comment 'NOTE' is missing a scope. Use format: NOTE(scope)",
        line: 7,
        column: 4,
        endColumn: 8
      }
    ]
  },
  {
    filename: 'index.js',
    description: 'scope on typescript comment directive `@ts-expect-error`',
    code: `// @ts-expect-error -- TODO: We should be taken care of it later`,
    errors: [
      {
        message: "Tag comment 'TODO' is missing a scope. Use format: TODO(scope)",
        line: 1,
        column: 24,
        endColumn: 28
      }
    ]
  },
  {
    filename: 'index.js',
    description: 'scope on typescript comment directive `@ts-ignore` without terminator',
    code: `// @ts-ignore NOTE: We should be taken care of it later`,
    errors: [
      {
        message: "Tag comment 'NOTE' is missing a scope. Use format: NOTE(scope)",
        line: 1,
        column: 15,
        endColumn: 19
      }
    ]
  },
  {
    filename: 'index.js',
    description: 'scope on custom directive',
    options: [{ directives: ['custom-directive'] }],
    code: `// custom-directive -- NOTE: This is custom directive comment with terminator
/* custom-directive NOTE: This is custom directive comment without terminator */
`,
    errors: [
      {
        message: "Tag comment 'NOTE' is missing a scope. Use format: NOTE(scope)",
        line: 1,
        column: 24,
        endColumn: 28
      },
      {
        message: "Tag comment 'NOTE' is missing a scope. Use format: NOTE(scope)",
        line: 2,
        column: 21,
        endColumn: 25
      }
    ]
  }
]

run({
  name: 'prefer-scope-on-tag-comment',
  rule,
  linter: ['eslint', 'oxlint'],
  valid,
  invalid
})

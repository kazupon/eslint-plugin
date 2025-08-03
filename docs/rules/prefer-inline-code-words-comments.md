---
pageClass: 'rule-details'
sidebarDepth: 0
title: '@kazupon/prefer-inline-code-words-comments'
description: 'enforce the use of inline code for specific words on comments'
since: 'v0.6.0'
---

# @kazupon/prefer-inline-code-words-comments

> enforce the use of inline code for specific words on comments

- 🔧 The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## Rule Details

This rule enforces that specific words or phrases are always wrapped in inline code (backticks) when they appear in Comments. This is useful for:

- Ensuring technical terms, API names, or function names are consistently formatted as code
- Maintaining consistent styling for programming-related terminology
- Automatically applying code formatting to specified words

### Fail

Some examples of **incorrect** code for this rule:

<eslint-code-block>

`{ words: ["console.log", "fetch"] }` options:

<!-- eslint-skip -->

```js
/* eslint @kazupon/prefer-inline-code-words-comments: ['error', { words: ['console.log', 'fetch'] }] */

/* ✗ BAD */

// you can output with using console.log
console.log('hello world!')

/* load user data via fetch */
const data = await fetch('https://example.com/api/users/1')

/**
 * Get a blog article.
 *
 * This API is used by fetch internally
 *
 * @params id - An blog ID
 * @returns A blog article data
 */
export function getBlogArticle(id) {
  // something logic ...
}
```

</eslint-code-block>

### Pass

Some examples of **correct** code for this rule:

<eslint-code-block>

`{ words: ["console.log", "fetch"] }` options:

<!-- eslint-skip -->

```js
/* eslint @kazupon/prefer-inline-code-words-comments: ['error', { words: ['console.log', 'fetch'] }] */

/* ✓ GOOD */

// you can output with using `console.log`
console.log('hello world!')

/* load user data via `fetch` */
const data = await fetch('https://example.com/api/users/1')

/**
 * Get a blog article.
 *
 * This API is used by `fetch` internally
 *
 * @params id - An blog ID
 * @returns A blog article data
 */
export function getBlogArticle(id) {
  // something logic ...
}
```

</eslint-code-block>

## 🔧 Options

This rule requires configuration of the words that should be wrapped in inline code.

```json
{
  "@kazupon/prefer-inline-code-words-comments": [
    "error",
    {
      "words": ["console.log", "fetch"]
    }
  ]
}
```

- `words` (required):
  - Strings representing the words that should always be wrapped in inline code when they appear in comments.

## Related rules

Nothing.

## Version

This rule was introduced in `@kazupon/eslint-plugin` v0.6.0

## Implementation

- [Rule source](https://github.com/kazupon/eslint-plugin/blob/main/src/rules/prefer-inline-code-words-comments.ts)
- [Test source](https://github.com/kazupon/eslint-plugin/blob/main/src/rules/prefer-inline-code-words-comments.ts)

---
pageClass: 'rule-details'
sidebarDepth: 0
title: '@kazupon/no-tag-comments'
description: 'no tag comments'
since: 'v0.2.0'
---

# @kazupon/no-tag-comments

> disallow tag comments

## Rule Details

This rule reports comments where tag are used.

Comments with tags such as `FIXME`, `BUG` and `ISSUE` should generally be fixed before shipping to production.

Tags only detect the **start** of comments.

<!-- eslint-skip -->

### Fail

Some examples of **incorrect** code for this rule:

<eslint-code-block>

default `{ tags: ['FIXME', 'BUG'] }` options:

<!-- eslint-skip -->

```js
/* eslint @kazupon/no-tag-comments: 'error' */

/* ✗ BAD */
// FIXME: `loop` function has infinify loop ...
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
}
```

for block comments:

<!-- eslint-skip -->

```js
/* eslint @kazupon/no-tag-comments: 'error' */

/* ✗ BAD */
/**
 * FIXME:
 * `loop` function has infinify loop ...
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
}
```

`{ tags: ['ISSUE'] }` options:

<!-- eslint-skip -->

```js
/* eslint @kazupon/no-tag-comments: ['error', { tags: ['ISSUE']}] */

/* ✗ BAD */
// Line comment case
// ISSUE: This code has still issues...

/* Block comment case */
/* eslint-disable-next-line @stylistic/multiline-comment-style */
/*
 * ISSUE:
 * This code has still issues...
 */

// FIXME: `FIXME` tag is not report, so rule options are overridden by 'ISSUE'
```

</eslint-code-block>

### Pass

Some examples of **correct** code for this rule:

<eslint-code-block>

default `{ tags: ['FIXME', 'BUG'] }` options:

<!-- eslint-skip -->

```js
/* eslint @kazupon/no-tag-comments: 'error' */

/* ✓ GOOD */
function loop() {
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
}
```

`{ tags: ['ISSUE'] }` options:

<!-- eslint-skip -->

```js
/* eslint @kazupon/no-tag-comments: ['error', { tags: ['ISSUE']}] */

/* ✓ GOOD */
// Line comment case
// This code was fixed!

/* Block comment case */
/* eslint-disable-next-line @stylistic/multiline-comment-style */
/*
 * ISSUE:
 * This code was fixed!
 */

// FIXME: `FIXME` tag is not report, so rule options are overridden by 'ISSUE'
```

</eslint-code-block>

## Options

```json
{
  "@kazupon/no-tag-comments": [
    "error",
    {
      "tags": ["FIXME", "BUG"]
    }
  ]
}
```

- `tags`: specify the tags to be able to lint. If you don't set any options, it set to `["FIXME", "BUG"]` as default.

## Related rules

Nothing.

## Version

This rule was introduced in `@kazupon/eslint-plugin` v0.2.0

## Implementation

- [Rule source](https://github.com/kazupon/eslint-plugin/blob/main/src/rules/no-tag-comments.ts)
- [Test source](https://github.com/kazupon/eslint-plugin/blob/main/src/rules/no-tag-comments.test.ts)

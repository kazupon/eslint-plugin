---
pageClass: 'rule-details'
sidebarDepth: 0
title: '@kazupon/prefer-scope-on-tag-comment'
description: 'Enforce adding a scope to tag comments'
since: 'v0.4.0'
---

# @kazupon/prefer-scope-on-tag-comment

> Enforce adding a scope to tag comments

## Rule Details

This rule enforces that tag comments (like `TODO`, `FIXME`, etc.) include a scope identifier in parentheses. The scope can be an author name, team name, ticket number, module name, or any other identifier that provides context about the comment.

### Fail

Some examples of **incorrect** code for this rule:

<eslint-code-block>

default `{ tags: ["TODO", "FIXME", "HACK", "BUG", "NOTE"] }` options:

<!-- eslint-skip -->

```js
/* eslint @kazupon/prefer-scope-on-tag-comment: 'error' */

/* ✗ BAD */

// TODO: This is todo comment
/* TODO: This is todo comment */
/**
 * TODO:
 * This is todo multiline comment
 */

// FIXME: Fix this bug
/* FIXME: Fix this bug */

// BUG: This code has still bug ...

// HACK: Temporary workaround
```

`{ tags: ['ISSUE'] }` options:

<!-- eslint-skip -->

```js
/* eslint @kazupon/prefer-scope-on-tag-comment: ['error', { tags: ['ISSUE'] }] */

/* ✗ BAD */

// ISSUE: This code has still issue ...

// TODO: `TODO` tag is not reported
```

For comment directives, default `{ directives: ["eslint-disable", "eslint-disable-next-line", "eslint-disable-line", "@ts-expect-error", "@ts-ignore", "@ts-nocheck"] }`

<!-- eslint-skip -->

```js
/* eslint no-alert: 'error' */
/* eslint quotes: 'error' */
/* eslint semi: 'error' */
/* eslint @kazupon/prefer-scope-on-tag-comment: 'error' */

/* ✗ BAD */

/* eslint-disable no-alert -- NOTE: To avoid something */
alert("foo");
/* eslint-enable no-alert */

alert("foo"); // eslint-disable-line no-alert -- NOTE: To avoid something

/* eslint-disable-next-line
   quotes,
   semi
   --
   NOTE: To suppress for warning styles
*/
const b = '1'

// @ts-expect-error -- TODO: We should be taken care of it later
// @ts-ignore NOTE: To avoid something reasons ...
```

`{ directives: ['custom-directive'] }` options:

<!-- eslint-skip -->

```js
/* eslint @kazupon/prefer-scope-on-tag-comment: ['error', { directives: ['custom-directive'] }] */

/* ✗ BAD */

// custom-directive -- NOTE: This is custom directive comment

/* custom-directive NOTE: This is custom directive comment */

// eslint-disable -- NOTE: `eslint-disable` directive is not reported
```

</eslint-code-block>

### Pass

Some examples of **correct** code for this rule:

<eslint-code-block>

default `{ tags: ["TODO", "FIXME", "HACK", "BUG", "NOTE"] }` options:

<!-- eslint-skip -->

```js
/* eslint @kazupon/prefer-scope-on-tag-comment: 'error' */

/* ✓ GOOD */

// TODO(kazupon): This is todo comment
/* TODO(auth-team): This is todo comment */
/**
 * TODO(next):
 * This is todo multiline comment
 */

// FIXME(ISSUE-123): Fix this bug
/* FIXME(john): Fix this bug */

// BUG(kazupon): This code has still bug ...

// HACK(frontend): Temporary workaround
// NOTE(security): Check permissions here
```

`{ tags: ['ISSUE'] }` options:

<!-- eslint-skip -->

```js
/* eslint @kazupon/prefer-scope-on-tag-comment: ['error', { tags: ['ISSUE'] }] */

/* ✓ GOOD */

// ISSUE(kazupon): This code has still issue ...

// TODO: `TODO` tag is not reported
```

For comment directives, default `{ directives: ["eslint-disable", "eslint-disable-next-line", "eslint-disable-line", "@ts-expect-error", "@ts-ignore", "@ts-nocheck"] }`

<!-- eslint-skip -->

```js
/* eslint no-alert: 'error' */
/* eslint quotes: 'error' */
/* eslint semi: 'error' */
/* eslint @kazupon/prefer-scope-on-tag-comment: 'error' */

/* ✗ BAD */

/* eslint-disable no-alert -- NOTE(kazupon): To avoid something */
alert("foo");
/* eslint-enable no-alert */

alert("foo"); // eslint-disable-line no-alert -- NOTE(kazupon): To avoid something

/* eslint-disable-next-line
   quotes,
   semi
   --
   NOTE(kazupon): To suppress for warning styles
*/
const b = '1'

// @ts-expect-error -- TODO(milestone-1): We should be taken care of it later
// @ts-ignore NOTE(kazupon): To avoid something reasons ...
```

`{ directives: ['custom-directive'] }` options:

<!-- eslint-skip -->

```js
/* eslint @kazupon/prefer-scope-on-tag-comment: ['error', { directives: ['custom-directive'] }] */

/* ✗ BAD */

// custom-directive -- NOTE(kazupon): This is custom directive comment

/* custom-directive NOTE(kazupon): This is custom directive comment */

// eslint-disable -- NOTE: `eslint-disable` directive is not reported
```

</eslint-code-block>

## 🔧 Options

```json
{
  "@kazupon/prefer-scope-on-tag-comment": [
    "error",
    {
      "tags": ["TODO", "FIXME", "HACK", "BUG", "NOTE"],
      "directives": [
        "eslint-disable",
        "eslint-disable-next-line",
        "eslint-disable-line",
        "@ts-expect-error",
        "@ts-ignore",
        "@ts-nocheck"
      ]
    }
  ]
}
```

- **`tags`** (default: `["TODO", "FIXME", "HACK", "BUG", "NOTE"]`)
  - Tag keywords to check
- **`directive`** (default: `["eslint-disable", "eslint-disable-next-line", "eslint-disable-line", "@ts-expect-error", "@ts-ignore", "@ts-nocheck"]`)
  - Include tag checks for comment directives

## 🔗 See Also

- [no-warning-comments](https://eslint.org/docs/latest/rules/no-warning-comments)
- [no-tag-comments](./no-tag-comments.md)

---
pageClass: 'rule-details'
sidebarDepth: 0
title: '@kazupon/comment-enforce-header'
description: 'enforce header comment'
since: 'v0.1.0'
---

# @kazupon/comment-enforce-header

> enforce header comment

## Rule Details

This rule enforce header comment for JavaScript / TypeScript source code file.

The header comment must be JSDoc style and must include the `@author` and `@license` tags.

<!-- eslint-disable markdown/no-missing-label-refs -->

> [!IMPORTANT]
> If you are sure that you want to write the header comment before the code itself, you **have to insert a line**. Otherwise, the comment written immediately before the code itself will be recognized as JSDoc for that code.

<!-- eslint-enable markdown/no-missing-label-refs -->

<!-- eslint-skip -->

### Fail

Some examples of **incorrect** code for this rule:

<eslint-code-block>

<!-- eslint-skip -->

```js
/* eslint @kazupon/comment-enforce-header: 'error' */

/* ✗ BAD */
import { foo } from 'bar'
```

<!-- eslint-skip -->

```js
/* eslint @kazupon/comment-enforce-header: 'error' */

/* ✗ BAD */
/**
 * copyright (c) kazupon coprporation
 */
```

<!-- eslint-skip -->

```js
/* eslint @kazupon/comment-enforce-header: 'error' */

/* ✗ BAD */
/**
 * @license MIT
 */

import { foo } from 'bar'
```

<!-- eslint-skip -->

```js
/* eslint @kazupon/comment-enforce-header: 'error' */

/* ✗ BAD */
/**
 * @author kazupon
 */

import { foo } from 'bar'
```

<!-- eslint-skip -->

```js
/* eslint @kazupon/comment-enforce-header: 'error' */

/* ✗ BAD */
/**
 * @author
 * @license MIT
 */

import { foo } from 'bar'
```

<!-- eslint-skip -->

```js
/* eslint @kazupon/comment-enforce-header: 'error' */

/* ✗ BAD */
/**
 * @author kazupon
 * @license
 */

import { foo } from 'bar'
```

<!-- eslint-skip -->

```js
/* eslint @kazupon/comment-enforce-header: 'error' */

/* ✗ BAD */
/**
 * @author
 * @license
 */

import { foo } from 'bar'
```

<!-- eslint-skip -->

```js
/* eslint @kazupon/comment-enforce-header: 'error' */

/**
 * This module is a sample module
 * @module
 */
/* ✗ BAD */
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
}
```

<!-- eslint-skip -->

```js
/* eslint @kazupon/comment-enforce-header: 'error' */

/**
 * This module is a sample module
 * @module
 */

/* ✗ BAD */
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
}
```

</eslint-code-block>

### Pass

Some examples of **correct** code for this rule:

<eslint-code-block>

<!-- eslint-skip -->

```js
/* eslint @kazupon/comment-enforce-header: 'error' */

/* ✓ GOOD */
/**
 * @author kazupon
 * @license MIT
 */

import { foo } from 'bar'
```

<!-- eslint-skip -->

```js
/* eslint @kazupon/comment-enforce-header: 'error' */

/* ✓ GOOD */
/**
 * This module is a sample module
 * @module
 */
/**
 * @author kazupon
 * @license MIT
 */

/**
 * add two numbers
 * @param a first number
 * @param b second number
 * @returns sum of a and b
 */
export function add(a, b) {
  return a + b
}
```

```js
/**
 * This module is estlint config.
 * @module
 * @author kazupon
 * @license MIT
 */

import { defineConfig } from 'eslint/config'

export default defineConfig({
  // something config ...
})
```

```js
/**
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
```

</eslint-code-block>

## Options

Nothing.

## Related rules

Nothing.

## Version

This rule was introduced in `@kazupon/eslint-plugin` v0.1.0

## Implementation

- [Rule source](https://github.com/kazupon/eslint-plugin/blob/main/src/rules/comment-enforce-header.ts)
- [Test source](https://github.com/kazupon/eslint-plugin/blob/main/src/rules/comment-enforce-header.test.ts)

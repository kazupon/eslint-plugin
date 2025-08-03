# @kazupon/eslint-plugin

ESLint plugin for @kazupon

<!-- eslint-disable markdown/no-missing-label-refs -->

> [!WARNING]
> This eslint-plugin is a rule that I’ve made as I needed it to advance the open-source project.
> Therefore, updates are often made, and sometimes there are also destructive changes.
> This eslint-plugin is open-source, so you can use it for your own projects, but please keep in mind that this plugin is specialized for my own use.
> Of course, since it is open-source, you are free to fork it and use it yourself 😉.

<!-- eslint-enable markdown/no-missing-label-refs -->

## 💿 Installation

```sh
# npm
npm install --save-dev @kazupon/eslint-plugin

## yarn
yarn add -D @kazupon/eslint-plugin

## pnpm
pnpm add -D @kazupon/eslint-plugin

## bum
bun add -D @kazupon/eslint-plugin
```

## 📋 Requirements

- **ESLint**: v9 or later
- **Configuration**: flat config style `eslint.config.[js|ts]`, not support legacy config style `.eslintrc`
- **Node.js**: v20 or later

## 🚀 Usage

Example `eslint.config.js`:

```js
import { defineConfig } from 'eslint/config'
import kazupon from '@kazupon/eslint-plugin'

export default defineConfig(
  ...kazupon.configs.recommended,
  {
    // ...
  }

  // ... something other configurations
)
```

## ✅ Rules

The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) automatically fixes problems reported by rules which have a wrench 🔧 below.
The rules with the following star ⭐ are included in the configs.

<!--RULES_TABLE_START-->

### @kazupon/eslint-plugin Rules

| Rule ID                                                                                                                      | Description                                                   | Category | Fixable | RECOMMENDED |
| :--------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------ | :------- | :-----: | :---------: |
| [@kazupon/enforce-header-comment](https://eslint-plugin.kazupon.dev/rules/enforce-header-comment.html)                       | Enforce heading the comment in source code file               | Comment  |         |     ⭐      |
| [@kazupon/no-tag-comments](https://eslint-plugin.kazupon.dev/rules/no-tag-comments.html)                                     | disallow tag comments                                         | Comment  |         |     ⭐      |
| [@kazupon/prefer-inline-code-words-comments](https://eslint-plugin.kazupon.dev/rules/prefer-inline-code-words-comments.html) | enforce the use of inline code for specific words on comments | Comment  |   🔧    |             |
| [@kazupon/prefer-scope-on-tag-comment](https://eslint-plugin.kazupon.dev/rules/prefer-scope-on-tag-comment.html)             | enforce adding a scope to tag comments                        | Comment  |         |     ⭐      |

<!--RULES_TABLE_END-->

## 🙌 Contributing guidelines

If you are interested in contributing to `gunshi`, I highly recommend checking out [the contributing guidelines](/CONTRIBUTING.md) here. You'll find all the relevant information such as [how to make a PR](/CONTRIBUTING.md#pull-request-guidelines), [how to setup development](/CONTRIBUTING.md#development-setup)) etc., there.

## 💖 Credits

This project is inspired by:

- `README.md` and `docs/**/*.md`, inspired by [ota-meshi](https://github.com/ota-meshi)

Thank you!

## ©️ License

[MIT](http://opensource.org/licenses/MIT)

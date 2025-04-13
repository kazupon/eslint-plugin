# @kazupon/eslint-plugin

ESLint plugin for @kazupon

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
  // ... something other configrations
)
```

## ✅ Rules

<!--RULES_TABLE_START-->

<!--RULES_TABLE_END-->

## 🙌 Contributing guidelines

If you are interested in contributing to `gunshi`, I highly recommend checking out [the contributing guidelines](/CONTRIBUTING.md) here. You'll find all the relevant information such as [how to make a PR](/CONTRIBUTING.md#pull-request-guidelines), [how to setup development](/CONTRIBUTING.md#development-setup)) etc., there.

## ©️ License

[MIT](http://opensource.org/licenses/MIT)

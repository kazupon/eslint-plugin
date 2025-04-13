# Getting Started

## Install

::: code-group

```sh [npm]
npm install --save-dev @kazupon/eslint-plugin
```

```sh [pnpm]
pnpm add -D @kazupon/eslint-plugin
```

```sh [yarn]
yarn add -D @kazupon/eslint-plugin
```

```sh [bun]
bun add -D @kazupon/eslint-plugin
```

:::

## Requirements

- **ESLint**: v9 or later
- **Configuration**: flat config style `eslint.config.[js|ts]`, not support legacy config style `.eslintrc`
- **Node.js**: v20 or later

## Usage

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

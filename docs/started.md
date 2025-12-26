# Getting Started

## Installation

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
- **oxlint**: v1.35 or later
- **Configuration**:
  - ESLint: flat config style `eslint.config.[js|ts]`, not support legacy config style `.eslintrc`
  - oxlint: json or jsonc style like `.oxlintrc.json` or `.oxlintrc.jsonc`
- **Node.js**: v20 or later

## Usage

### ESLint

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

### oxlint

Example [oxlint configuration file](https://oxc.rs/docs/guide/usage/linter/config.html) such as `.oxlintrc.json`:

<!-- eslint-skip -->

```jsonc
{
  // ...

  "extends": ["./node_modules/@kazupon/eslint-config/oxlint/recommended.json"]

  // ...
}
```

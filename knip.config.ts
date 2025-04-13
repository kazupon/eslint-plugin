/**
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  entry: [
    'src/index.ts',
    'eslint.config.ts',
    'tsdown.config.ts',
    'docs/.vitepress/config.ts',
    'docs/.vitepress/theme/index.ts',
    'scripts/*.ts'
  ],
  ignoreDependencies: ['lint-staged']
}

export default config

import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  entry: ['docs/.vitepress/config.ts', 'docs/.vitepress/theme/index.ts', 'scripts/*.ts'],
  ignoreDependencies: ['lint-staged', '@kazupon/prettier-config']
}

export default config

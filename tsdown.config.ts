// eslint-disable-next-line @kazupon/enforce-header-comment

import { defineConfig } from 'tsdown'

const config: ReturnType<typeof defineConfig> = defineConfig({
  entry: ['./src/index.ts'],
  outDir: 'lib',
  publint: true,
  dts: true,
  external: ['@typescript-eslint/utils']
})

export default config

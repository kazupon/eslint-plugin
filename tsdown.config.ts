import { defineConfig } from 'tsdown'
import pkg from './package.json' with { type: 'json' }

import type { UserConfig } from 'tsdown'

const config: UserConfig = defineConfig({
  entry: ['./src/index.ts'],
  define: {
    __NAME__: JSON.stringify(pkg.name),
    __VERSION__: JSON.stringify(pkg.version),
    __NAMESPACE__: JSON.stringify(pkg.name.split('/')[0])
  },
  outDir: 'lib',
  publint: true,
  clean: true,
  dts: true
})

export default config

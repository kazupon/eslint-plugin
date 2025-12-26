import { defineConfig } from 'tsdown'
import { getMetadata } from './scripts/utils.ts'

import type { UserConfig } from 'tsdown'

const metadata = getMetadata()

const config: UserConfig = defineConfig({
  entry: ['./src/index.ts'],
  define: {
    __NAMESPACE__: JSON.stringify(metadata.__NAMESPACE__),
    __NAME__: JSON.stringify(metadata.__NAME__),
    __VERSION__: JSON.stringify(metadata.__VERSION__)
  },
  outDir: 'lib',
  publint: true,
  clean: true,
  dts: true
})

export default config

/**
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client'
import '@shikijs/vitepress-twoslash/style.css'
import DefaultTheme from 'vitepress/theme' // eslint-disable-line import/no-named-as-default
import './style.css'
// eslint-disable-next-line import/no-unresolved
import 'virtual:group-icons.css'
import type { EnhanceAppContext, Theme } from 'vitepress'

const theme: Theme = {
  ...DefaultTheme,
  enhanceApp({ app }: EnhanceAppContext) {
    app.use(TwoslashFloatingVue as never)
  }
}

export default theme

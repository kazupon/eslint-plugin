/**
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { createTwoslasher as createTwoslasherESLint } from 'twoslash-eslint'
import eslint4b from 'vite-plugin-eslint4b'
import { defineConfig } from 'vitepress'
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons'
import { plugin } from '../../src/index.ts'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: '@kazupon/eslint-plugin',
  description: 'ESLint Plugin for @kazupon',
  head: [],
  lastUpdated: true,

  themeConfig: {
    search: {
      provider: 'local',
      options: {
        detailedView: true
      }
    },

    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Introduction', link: '/' },
      { text: 'Guide', link: '/guide/setup' },
      { text: 'Rules', link: '/rules/' }
    ],

    sidebar: [
      {
        text: 'Guide',
        items: [{ text: 'Setup', link: '/guide/setup' }]
      },
      {
        text: 'Rules',
        collapsed: false,
        items: []
      }
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/kazupon/eslint-plugin' }],

    editLink: {
      pattern: 'https://github.com/kazupon/eslint-plugin/edit/main/docs/:path'
    }
  },

  markdown: {
    config(md) {
      md.use(groupIconMdPlugin)
    },
    codeTransformers: [
      transformerTwoslash({
        explicitTrigger: false, // Required for v-menu to work.
        langs: ['js'],
        filter(lang, code) {
          if (!lang.startsWith('json') && lang.startsWith('js')) {
            return code.includes('eslint')
          }
          return false
        },
        errorRendering: 'hover',
        twoslasher: createTwoslasherESLint({
          eslintConfig: [
            {
              files: ['*', '**/*'],
              plugins: {
                '@kazupon': plugin
              },
              languageOptions: {
                globals: {
                  require: 'readonly'
                }
              }
            }
          ]
        })
      })
    ]
  },

  vite: {
    plugins: [groupIconVitePlugin(), eslint4b()],
    define: {
      'process.env.NODE_DEBUG': 'false'
    }
  }
})

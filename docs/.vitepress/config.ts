/**
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import child_process from 'node:child_process'
import { createTwoslasher as createTwoslasherESLint } from 'twoslash-eslint'
import eslint4b from 'vite-plugin-eslint4b'
import { defineConfig } from 'vitepress'
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons'
import { plugin } from '../../src/index.ts'

import type { DefaultTheme, UserConfig } from 'vitepress'

function updateRulesIndex() {
  child_process.execSync('pnpm docs:rules')
}

// eslint-disable-next-line unicorn/no-anonymous-default-export
export default async (): Promise<UserConfig<DefaultTheme.Config>> => {
  // Update rules index
  updateRulesIndex()

  // https://vitepress.dev/reference/site-config
  return defineConfig({
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
        {
          text: 'Introduction',
          link: '/'
        },
        {
          text: 'Getting Started',
          link: '/started'
        },
        {
          text: 'Rules',
          items: []
        }
      ],

      sidebar: [
        {
          text: 'Introduction',
          link: '/'
        },
        {
          text: 'Getting Started',
          link: '/started'
        },
        {
          text: 'Available Rules',
          link: '/rules/'
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
}

// eslint-disable-next-line @kazupon/enforce-header-comment -- NOTE(kazupon): This file is configuration file

import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import child_process from 'node:child_process'
import { createTwoslasher as createTwoslasherESLint } from 'twoslash-eslint'
import eslint4b from 'vite-plugin-eslint4b'
import { defineConfig } from 'vitepress'
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons'
import pkg from '../../package.json' with { type: 'json' }
import { plugin } from '../../src/index.ts'
import { rules } from '../../src/rules/index.ts'

import type { DefaultTheme, UserConfig } from 'vitepress'

function updateRulesIndex() {
  child_process.execSync('pnpm docs:rules')
}

// eslint-disable-next-line unicorn/no-anonymous-default-export -- NOTE(kazupon): This file is configuration file
export default async (): Promise<UserConfig<DefaultTheme.Config>> => {
  // Update rules index
  updateRulesIndex()

  // get rules for sidebar
  const sidebarRulesItems = Object.entries(rules).map(([ruleName, _rule]) => {
    return {
      text: ruleName,
      link: `/rules/${ruleName}`
    }
  })

  // https://vitepress.dev/reference/site-config
  return defineConfig({
    title: pkg.name,
    description: pkg.description,
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
          link: '/rules/'
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
          text: `${pkg.name} Rules`,
          collapsed: false,
          items: sidebarRulesItems
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

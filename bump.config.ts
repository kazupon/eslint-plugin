/**
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

import { defineConfig } from 'bumpp'
import { updateChangelog } from 'gh-changelogen'

export default defineConfig({
  files: ['package.json'],
  all: true,
  commit: 'release: v%s',
  tag: true,
  push: true,
  // NOTE(kazupon): write `CHANGELOG.md` from the release notes that GitHub generates for the new tag,
  // so that the changelog enters the release commit together with the version
  execute: async operation => {
    await updateChangelog({
      repository: 'kazupon/eslint-plugin',
      tagName: `v${operation.state.newVersion}`,
      source: 'generated-notes',
      targetCommitish: 'HEAD',
      output: 'CHANGELOG.md'
    })
  }
})

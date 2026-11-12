/**
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

/**
 * NOTE(kazupon):
 * Check that `pnpm release` can push the release commit and the tag.
 * bumpp runs this as the `preversion` script, after the confirmation and before it updates any file,
 * so a failed check leaves the working tree as it is.
 *
 * bumpp pushes the branch first, and stops before pushing the tag when the push of the branch fails,
 * for example when the local branch is behind the remote one.
 * Rebasing and pushing the branch after that leaves the tag on a commit that is not on the branch.
 */

import { execFileSync } from 'node:child_process'

const RELEASE_BRANCH = 'main'
const REMOTE = 'origin'

function git(...args: string[]): string {
  // keep the leading spaces, such as ` M` of `git status --porcelain`
  return execFileSync('git', args, { encoding: 'utf8' }).trimEnd()
}

function check(): string[] {
  const errors: string[] = []

  const branch = git('rev-parse', '--abbrev-ref', 'HEAD')
  if (branch !== RELEASE_BRANCH) {
    errors.push(`Release from \`${RELEASE_BRANCH}\`, not from \`${branch}\`.`)
  }

  // bumpp commits every tracked change (`all: true` in `bump.config.ts`)
  const status = git('status', '--porcelain')
  if (status !== '') {
    errors.push(`Commit or stash the changes before releasing:\n${status}`)
  }

  git('fetch', '--quiet', REMOTE, RELEASE_BRANCH)
  const head = git('rev-parse', 'HEAD')
  const remoteHead = git('rev-parse', `${REMOTE}/${RELEASE_BRANCH}`)
  if (head !== remoteHead) {
    const [behind, ahead] = git(
      'rev-list',
      '--left-right',
      '--count',
      `${REMOTE}/${RELEASE_BRANCH}...HEAD`
    ).split(/\s+/)
    errors.push(
      `\`HEAD\` is not \`${REMOTE}/${RELEASE_BRANCH}\` (behind ${behind}, ahead ${ahead}). Pull or push \`${RELEASE_BRANCH}\` before releasing.`
    )
  }

  // gh-changelogen calls the API of GitHub to generate the release notes in `bump.config.ts`
  if (!process.env.GH_TOKEN && !process.env.GITHUB_TOKEN) {
    errors.push('Set `GH_TOKEN` (e.g. `GH_TOKEN="$(gh auth token)" pnpm release`).')
  }

  return errors
}

const errors = check()
if (errors.length > 0) {
  for (const error of errors) {
    console.error(`✖ ${error}`)
  }
  process.exit(1)
}

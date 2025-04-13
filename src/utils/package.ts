/**
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

import fs from 'node:fs'

type PackageJson = typeof import('../../package.json')

export function readPackageJson(path: URL): PackageJson {
  return JSON.parse(fs.readFileSync(path, 'utf8')) as PackageJson
}

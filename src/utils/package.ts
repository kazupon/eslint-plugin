import fs from 'node:fs'

type PakcageJson = typeof import('../../package.json')

export function readPackageJson(path: URL): PakcageJson {
  return JSON.parse(fs.readFileSync(path, 'utf8')) as PakcageJson
}

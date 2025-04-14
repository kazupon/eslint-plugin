/**
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

import { readPackageJson } from './package.ts'

const pkg = readPackageJson(new URL('../../package.json', import.meta.url))

/**
 * The plugin name.
 */
export const name: string = pkg.name

/**
 * The plugin version.
 */
export const version: string = pkg.version

/**
 * The namespace for rules
 */
export const namespace: string = pkg.name.split('/')[0]

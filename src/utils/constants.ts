/**
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

/**
 * The plugin name.
 */
export const NAME: string = typeof __NAME__ === 'undefined' ? '@kazupon/eslint-plugin' : __NAME__

/**
 * The plugin version.
 */
export const VERSION: string = typeof __VERSION__ === 'undefined' ? '0.0.0' : __VERSION__

/**
 * The namespace for rules
 */
export const NAMESPACE: string = typeof __NAMESPACE__ === 'undefined' ? '@kazupon' : __NAMESPACE__

/**
 * The file extensions to be linted.
 */
const EXTENSIONS: string = ['js', 'mjs', 'cjs', 'ts', 'mts', 'cts', 'jsx', 'tsx'].join(',')

/**
 * The markdown glob patterns.
 */
export const GLOB_MARKDOWN: string = `**/*.md`

/**
 * The code files glob patterns based on markdown glob patterns.
 */
export const GLOB_MARKDOWN_CODES: string = `${GLOB_MARKDOWN}/**/*.{${EXTENSIONS}}`

/**
 * The glob patterns for all code files.
 */
export const GLOB_FILES: string = `**/*.{${EXTENSIONS}}`

/**
 * The glob patterns for all config files.
 */
export const GLOB_CONFIG_FILES: string = `**/*.config.{${EXTENSIONS}}`

/**
 * The glob patterns for test files.
 */
export const TEST_GLOB_FILES: string = `**/*.{test,spec}.{${EXTENSIONS}}`

/**
 * The glob patterns for test declaration files.
 */
export const TEST_DTS_GLOB_FILES: string = `**/*.{test,spec}.d.{ts,tsx}`

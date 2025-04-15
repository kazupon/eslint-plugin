/**
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

/**
 * The plugin name.
 */
export const name: string = typeof __NAME__ === 'undefined' ? '@kazupon/eslint-plugin' : __NAME__

/**
 * The plugin version.
 */
export const version: string = typeof __VERSION__ === 'undefined' ? '0.0.0' : __VERSION__

/**
 * The namespace for rules
 */
export const namespace: string = typeof __NAMESPACE__ === 'undefined' ? '@kazupon' : __NAMESPACE__

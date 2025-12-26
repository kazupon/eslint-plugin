/**
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

import pkg from '../package.json' with { type: 'json' }

type Metadata = {
  __NAME__: string
  __VERSION__: string
  __NAMESPACE__: string
}

/**
 * Get metadata from package.json
 *
 * @returns The metadata object
 */
export function getMetadata(): Metadata {
  return {
    __NAME__: pkg.name,
    __VERSION__: pkg.version,
    __NAMESPACE__: pkg.name.split('/')[0]
  }
}

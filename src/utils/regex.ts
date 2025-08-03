/**
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

/**
 * Escape special regex characters in a string
 *
 * @param str - The string to escape
 * @returns The escaped string
 */
function escapeRegExp(str: string): string {
  return str.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`)
}

/**
 * Create a regex pattern with word boundaries
 *
 * @param word - The word to match
 * @param flags - Optional regex flags
 * @returns A RegExp that matches the word with boundaries
 */
export function createWordBoundaryRegex(word: string, flags = 'g'): RegExp {
  const escapedWord = escapeRegExp(word)
  return new RegExp(`\\b${escapedWord}\\b`, flags)
}

/**
 * Check if a word at a given index is wrapped with specific delimiters
 *
 * @param text - The text to check
 * @param index - The starting index of the word
 * @param word - The word to check
 * @param startDelimiter - The starting delimiter (default: '`')
 * @param endDelimiter - The ending delimiter (default: '`')
 * @returns True if the word is wrapped with the delimiters
 */
export function isWordWrapped(
  text: string,
  index: number,
  word: string,
  startDelimiter = '`',
  endDelimiter = '`'
): boolean {
  const beforeIndex = index - 1
  const afterIndex = index + word.length
  return (
    beforeIndex >= 0 &&
    afterIndex < text.length &&
    text[beforeIndex] === startDelimiter &&
    text[afterIndex] === endDelimiter
  )
}

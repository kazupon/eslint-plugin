/**
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

/**
 * Parse array options with defaults
 *
 * @typeParam T - The type of the options object
 *
 * @param options - The options object that may contain array fields
 * @param arrayFields - Object mapping field names to their default arrays
 * @returns The parsed options with default arrays applied
 */
export function parseArrayOptions<T extends Record<string, unknown>>(
  options: T | undefined,
  arrayFields: Record<string, unknown[]>
): T {
  const result = options ? { ...options } : ({} as T)

  for (const [field, defaultArray] of Object.entries(arrayFields)) {
    if (!result[field] || !Array.isArray(result[field])) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- NOTE(kazupon): This is a generic utility function
      ;(result as any)[field] = defaultArray
    }
  }

  return result
}

/**
 * Utility functions for generating and handling URL slugs
 */

/**
 * Generate a URL-friendly slug from a string
 * @param text - The text to convert to slug
 * @returns A URL-friendly slug
 */
export function generateSlug(text: string): string {
  return (
    text
      .toLowerCase()
      .trim()
      // Replace spaces and special characters with hyphens
      .replace(/[\s\W-]+/g, '-')
      // Remove leading/trailing hyphens
      .replace(/^-+|-+$/g, '')
      // Ensure no consecutive hyphens
      .replace(/-+/g, '-')
  )
}

/**
 * Create a unique slug by combining name and ID
 * @param name - The name to slugify
 * @param id - The ID to append
 * @returns A unique slug in format "name-id"
 */
export function createUniqueSlug(name: string, id: number): string {
  const baseSlug = generateSlug(name)
  return `${baseSlug}-${id}`
}

/**
 * Extract ID from a slug that ends with "-{id}"
 * @param slug - The slug to extract ID from
 * @returns The extracted ID or null if not found
 */
export function extractIdFromSlug(slug: string): number | null {
  const match = slug.match(/-([0-9]+)$/)
  return match ? parseInt(match[1], 10) : null
}

/**
 * Validate if a slug matches the expected format for a given name and ID
 * @param slug - The slug to validate
 * @param name - The expected name
 * @param id - The expected ID
 * @returns True if the slug is valid for the given name and ID
 */
export function validateSlug(slug: string, name: string, id: number): boolean {
  const expectedSlug = createUniqueSlug(name, id)
  return slug === expectedSlug
}

/**
 * Generate a URL-friendly slug from a title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .substring(0, 60) // Limit length
}

/**
 * Generate a unique slug by appending a short ID
 */
export function generateUniqueSlug(title: string, id: string): string {
  const baseSlug = generateSlug(title)
  const shortId = id.substring(0, 8) // Use first 8 chars of Firebase ID
  return `${baseSlug}-${shortId}`
}

/**
 * Extract the ID from a slug
 */
export function extractIdFromSlug(slug: string): string | null {
  // Slug format: "job-title-abc12345"
  // Extract last segment after final hyphen (if it looks like an ID)
  const parts = slug.split('-')
  const lastPart = parts[parts.length - 1]
  
  // If last part is 8+ alphanumeric chars, it's likely an ID fragment
  if (lastPart && lastPart.length >= 8 && /^[a-zA-Z0-9]+$/.test(lastPart)) {
    return lastPart
  }
  
  return null
}

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function resolveImageUrl(imageUrl: string): string {
  if (!imageUrl) return imageUrl

  // Keep absolute URLs (e.g., Supabase/public CDN) untouched.
  if (/^https?:\/\//i.test(imageUrl)) {
    return imageUrl
  }

  // Only rewrite local bundled seed images.
  // Keep other root-relative URLs (e.g., API/storage paths from DB) untouched.
  if (imageUrl.startsWith('/Photo/')) {
    return `${import.meta.env.BASE_URL}${imageUrl.slice(1)}`
  }

  return imageUrl
}

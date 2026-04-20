import { supabase } from './supabase'

export async function uploadRecipeImage(userId: string, imageFile: File): Promise<string> {
  const fileExt = imageFile.name.split('.').pop()?.toLowerCase() || 'jpg'
  const objectPath = `${userId}/${crypto.randomUUID()}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('recipes')
    .upload(objectPath, imageFile, {
      cacheControl: '3600',
      upsert: false,
      contentType: imageFile.type || undefined,
    })

  if (uploadError) {
    throw uploadError
  }

  const { data } = supabase.storage
    .from('recipes')
    .getPublicUrl(objectPath)

  // Add a short cache-buster so newly uploaded images are reflected immediately.
  return `${data.publicUrl}?v=${Date.now()}`
}

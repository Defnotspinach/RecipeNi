export type User = {
  id: string
  fullName: string
  email: string
  avatarUrl?: string
  // Don't actually include password in a real app's frontend state, but kept for MVP typings as requested
  password?: string 
}

export type Recipe = {
  id: string
  title: string
  description: string
  category: string
  prepTime: number
  cookTime: number
  servings: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  ingredients: string[]
  steps: string[]
  imageUrl: string
  notes?: string
  isPublic: boolean
  authorId: string
  authorName: string
  favoriteCount: number
  createdAt: string
}

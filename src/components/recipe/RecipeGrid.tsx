import { Recipe } from '../../types'
import RecipeCard from './RecipeCard'

interface RecipeGridProps {
  recipes: Recipe[]
  emptyMessage?: string
}

export default function RecipeGrid({ recipes, emptyMessage = "No recipes found." }: RecipeGridProps) {
  if (recipes.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground border border-dashed rounded-xl">
        <p>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {recipes.map(recipe => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  )
}

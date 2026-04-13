import { useState } from 'react'
import { Recipe } from '../../types'
import RecipeCard from './RecipeCard'
import { ChevronLeft, ChevronRight, ChevronsLeft } from 'lucide-react'

interface RecipeGridProps {
  recipes: Recipe[]
  emptyMessage?: string
  allowDelete?: boolean
}

export default function RecipeGrid({ recipes, emptyMessage = "No recipes found.", allowDelete = false }: RecipeGridProps) {
  const [currentPage, setCurrentPage] = useState(1)
  
  if (recipes.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground border border-dashed rounded-xl">
        <p>{emptyMessage}</p>
      </div>
    )
  }

  const itemsPerPage = 8
  const totalPages = Math.ceil(recipes.length / itemsPerPage)
  
  const currentRecipes = recipes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const goToFirst = () => setCurrentPage(1)
  const goToPrev = () => setCurrentPage(prev => Math.max(1, prev - 1))
  const goToNext = () => setCurrentPage(prev => Math.min(totalPages, prev + 1))

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentRecipes.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} allowDelete={allowDelete} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4 border-t border-muted/30">
          <button
            onClick={goToFirst}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-4 py-2 rounded-md font-medium text-sm transition-colors border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronsLeft className="h-4 w-4" />
            <span className="hidden sm:inline">First</span>
          </button>
          
          <button
            onClick={goToPrev}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-4 py-2 rounded-md font-medium text-sm transition-colors border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Previous</span>
          </button>
          
          <span className="text-sm font-medium px-4">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={goToNext}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-4 py-2 rounded-md font-medium text-sm transition-colors border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}

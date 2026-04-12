import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Clock, User } from 'lucide-react'
import { Recipe } from '../../types'
import { useAppStore } from '../../store/useAppStore'
import { resolveImageUrl } from '../../lib/utils'

interface RecipeCardProps {
  recipe: Recipe
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const { user, favorites, toggleFavorite, setLoginPromptOpen } = useAppStore()
  const isFavorite = favorites.includes(recipe.id)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault() // prevent navigation if wrapped in Link
    e.stopPropagation() // prevent triggering the card's onClick
    if (!user) {
      setLoginPromptOpen(true)
      return
    }
    toggleFavorite(recipe.id)
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 400)
  }

  const handleCardClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault()
      setLoginPromptOpen(true)
    }
  }

  return (
    <Link 
      to={`/recipe/${recipe.id}`} 
      onClick={handleCardClick}
      className="group flex flex-col bg-card rounded-xl overflow-hidden border shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-300"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img 
          src={resolveImageUrl(recipe.imageUrl)} 
          alt={recipe.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        <button 
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-2 rounded-full bg-background/80 hover:bg-background backdrop-blur-sm text-foreground transition-colors shadow-sm"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={`h-4 w-4 transition-transform duration-300 ${isAnimating ? 'animate-pop' : 'hover:scale-110'} ${isFavorite ? "fill-destructive stroke-destructive" : "stroke-foreground"}`} />
        </button>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="font-semibold text-lg leading-tight line-clamp-1 group-hover:text-primary transition-colors">{recipe.title}</h3>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
          {recipe.description}
        </p>
        <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground pt-4 border-t">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>{recipe.prepTime + recipe.cookTime}m</span>
          </div>
          <div className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" />
            <span className="line-clamp-1">{recipe.authorName}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

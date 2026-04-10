import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Heart, Clock, Users, ChefHat, ArrowLeft, Play } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import CookingMode from '../components/recipe/CookingMode'
import { resolveImageUrl } from '../lib/utils'

export default function RecipeDetail() {
  const { id } = useParams()
  const { recipes, user, favorites, toggleFavorite, setLoginPromptOpen } = useAppStore()
  const [isCooking, setIsCooking] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  
  const recipe = recipes.find(r => r.id === id)
  
  if (!recipe) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Recipe not found!</h2>
        <Link to="/recipes" className="text-primary hover:underline">Back to explore</Link>
      </div>
    )
  }

  const isFavorite = favorites.includes(recipe.id)

  const handleFavoriteClick = () => {
    if (!user) {
      setLoginPromptOpen(true)
      return
    }
    toggleFavorite(recipe.id)
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 400)
  }

  return (
    <article className="pb-20">
      {/* Recipe Hero */}
      <div className="relative w-full h-[40vh] md:h-[50vh] bg-muted">
        <img src={resolveImageUrl(recipe.imageUrl)} alt={recipe.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        
        <div className="absolute top-4 left-4 z-10">
          <Link to="/recipes" className="flex items-center gap-2 text-white bg-black/30 hover:bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-md text-sm font-medium transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white">
          <div className="container mx-auto max-w-4xl">
            <span className="inline-block px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              {recipe.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">{recipe.title}</h1>
            <p className="text-white/80 text-lg max-w-2xl mb-6">{recipe.description}</p>
            
            <div className="flex flex-wrap items-center gap-6 text-sm font-medium">
              <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                <ChefHat className="h-5 w-5 text-primary" />
                <span>Recipe ni {recipe.authorName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-300" />
                <span>{recipe.prepTime + recipe.cookTime} mins total</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-300" />
                <span>Serves {recipe.servings}</span>
              </div>
              
              <div className="ml-auto flex items-center gap-3">
                <button 
                  onClick={() => {
                    if (!user) {
                      setLoginPromptOpen(true)
                      return
                    }
                    setIsCooking(true)
                  }}
                  className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg transition-transform duration-300 hover:scale-105 active:scale-95 shadow-md font-bold"
                >
                  <Play className="h-4 w-4 fill-current" />
                  <span>Start Cooking</span>
                </button>
                <button 
                  onClick={handleFavoriteClick}
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-lg transition-colors border border-white/10"
                >
                  <Heart className={`h-5 w-5 transition-transform duration-300 ${isAnimating ? 'animate-pop' : ''} ${isFavorite ? "fill-destructive stroke-destructive" : "stroke-white"}`} />
                  <span className="hidden sm:inline">{isFavorite ? 'Saved' : 'Save'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Ingredients */}
          <div className="md:col-span-1">
            <h2 className="text-2xl font-bold tracking-tight mb-6 flex items-center gap-2 border-b pb-2">
              Ingredients
            </h2>
            <ul className="space-y-3">
              {(Array.isArray(recipe.ingredients) ? recipe.ingredients : []).map((ingredient, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0"></div>
                  <span className="text-foreground/90">{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Steps */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold tracking-tight mb-6 flex items-center gap-2 border-b pb-2">
              Instructions
            </h2>
            <ul className="space-y-8">
              {(Array.isArray(recipe.steps) ? recipe.steps : []).map((step, i) => (
                <li key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center border border-primary/20">
                    {i + 1}
                  </div>
                  <div className="pt-1 text-foreground/90 leading-relaxed text-lg">
                    {step}
                  </div>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {isCooking && (
        <CookingMode recipe={recipe} onClose={() => setIsCooking(false)} />
      )}
    </article>
  )
}

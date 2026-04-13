import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import RecipeGrid from '../components/recipe/RecipeGrid'

export default function Explore() {
  const { user, recipes } = useAppStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = useMemo(() => {
    const cats = new Set(recipes.map(r => r.category))
    return Array.from(cats)
  }, [recipes])

  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            recipe.ingredients.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCategory = selectedCategory ? recipe.category === selectedCategory : true
      return matchesSearch && matchesCategory
    })
  }, [recipes, searchQuery, selectedCategory])

  const userRecipes = useMemo(() => {
    if (!user) return []
    return filteredRecipes.filter(r => r.authorId === user.id)
  }, [filteredRecipes, user])

  const otherRecipes = useMemo(() => {
    if (!user) return filteredRecipes
    return filteredRecipes.filter(r => r.authorId !== user.id)
  }, [filteredRecipes, user])

  return (
    <div className="container mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Explore Recipes</h1>
          <p className="text-muted-foreground">Discover new Filipino dishes to try at home.</p>
        </div>
        
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search dishes, ingredients..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 w-full sm:w-64 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
            />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === null 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {user && (
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-6 border-b pb-2">
            <h2 className="text-2xl font-bold">Your Recipes</h2>
          </div>
          <RecipeGrid 
            recipes={userRecipes} 
            allowDelete
            emptyMessage="You haven't submitted any recipes matching this search." 
          />
        </div>
      )}

      <div>
        <div className="flex items-center gap-2 mb-6 border-b pb-2">
          <h2 className="text-2xl font-bold">
            {user ? 'Community Recipes' : 'All Recipes'}
          </h2>
        </div>
        <RecipeGrid 
          recipes={otherRecipes} 
          emptyMessage="No community recipes found matching your criteria."
        />
      </div>
    </div>
  )
}

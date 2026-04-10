import { Navigate } from 'react-router-dom'
import { BookOpen, Heart } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import RecipeGrid from '../components/recipe/RecipeGrid'

export default function Dashboard() {
  const { user, recipes, favorites } = useAppStore()

  if (!user) {
    return <Navigate to="/" replace />
  }

  const userRecipes = recipes.filter(r => r.authorId === user.id)
  const userFavorites = recipes.filter(r => favorites.includes(r.id))

  return (
    <div className="container mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome, {user.fullName.split(' ')[0]}!</h1>
        <p className="text-muted-foreground">Manage your recipes and saved favorites here.</p>
      </div>

      <div className="space-y-16">
        <section>
          <div className="flex items-center gap-2 mb-6 border-b pb-2">
            <Heart className="h-6 w-6 text-destructive" />
            <h2 className="text-2xl font-bold">Saved Recipes</h2>
          </div>
          <RecipeGrid 
            recipes={userFavorites} 
            emptyMessage="You haven't saved any recipes yet. Explore and save your favorites!" 
          />
        </section>

        <section>
          <div className="flex items-center gap-2 mb-6 border-b pb-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">My Recipes</h2>
          </div>
          <RecipeGrid 
            recipes={userRecipes} 
            emptyMessage="You haven't submitted any recipes. Share your family's favorite dish!" 
          />
        </section>
      </div>
    </div>
  )
}

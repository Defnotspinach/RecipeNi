import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabase'
import { User, Recipe } from '../types'
import { SEED_RECIPES } from '../data/seed'

interface AppState {
  user: User | null
  recipes: Recipe[]
  favorites: string[] // Array of recipe IDs
  theme: 'light' | 'dark'
  isSupabaseSeeded: boolean
  
  // Actions
  setUser: (user: User | null) => void
  fetchRecipes: () => Promise<void>
  fetchFavorites: (userId: string) => Promise<void>
  addRecipe: (recipe: Recipe) => Promise<void>
  toggleFavorite: (recipeId: string) => Promise<void>
  toggleTheme: () => void
  seedDatabase: () => Promise<void>
  updateSeedPhotos: () => Promise<void>
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      recipes: [],
      favorites: [],
      theme: 'light',
      isSupabaseSeeded: false,
      
      setUser: (user) => set({ user }),

      fetchRecipes: async () => {
        const { data, error } = await supabase.from('recipes').select('*').order('createdAt', { ascending: false })
        if (error) {
          // If DB schema is missing, still render local seed data so the app remains usable.
          if (error.code === 'PGRST205') {
            console.warn('recipes table is missing. Showing local seed recipes until schema is created.')
            set({ recipes: SEED_RECIPES })
            return
          }
          console.error('Error fetching recipes:', error)
          return
        }

        // Auto-inject seed data if the database is completely empty
        if (data && data.length === 0) {
          console.log("Database is empty, automatically injecting seed examples...")
          get().seedDatabase()
          return
        }

        set({ recipes: data || [] })
      },

      fetchFavorites: async (userId) => {
        const { data, error } = await supabase.from('favorites').select('recipeId').eq('userId', userId)
        if (error) {
          console.error('Error fetching favorites:', error)
          return
        }
        set({ favorites: data.map(f => f.recipeId) })
      },

      addRecipe: async (recipe) => {
        const { error } = await supabase.from('recipes').insert([recipe])
        if (error) {
          console.error('Error adding recipe:', error)
          if (error.code === 'PGRST205') {
            alert('Missing Supabase table: public.recipes. Run supabase/init.sql in SQL Editor first.')
            return
          }
          alert("Failed to submit recipe. Are you authenticated?")
          return
        }
        // Optimistic UI update
        set((state) => ({ recipes: [recipe, ...state.recipes] }))
      },

      toggleFavorite: async (recipeId) => {
        const state = get()
        if (!state.user) return

        const isFavorite = state.favorites.includes(recipeId)
        
        if (isFavorite) {
          // Remove from Supabase
          const { error } = await supabase
            .from('favorites')
            .delete()
            .match({ userId: state.user.id, recipeId })
          
          if (!error) {
            set({ favorites: state.favorites.filter(id => id !== recipeId) })
          }
        } else {
          // Add to Supabase
          const { error } = await supabase
            .from('favorites')
            .insert([{ userId: state.user.id, recipeId }])
            
          if (!error) {
            set({ favorites: [...state.favorites, recipeId] })
          }
        }
      },

      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'light' ? 'dark' : 'light' 
      })),

      seedDatabase: async () => {
        const { error } = await supabase
          .from('recipes')
          .upsert(SEED_RECIPES, { onConflict: 'id' })
        if (error) {
          console.error('Error seeding data:', error)
          if (error.code === 'PGRST205') {
            alert('Missing Supabase table: public.recipes. Run supabase/init.sql in SQL Editor first.')
          }
          return
        }
        set({ isSupabaseSeeded: true })
        get().fetchRecipes()
        console.log('Seed data successfully injected to Supabase!')
      },

      updateSeedPhotos: async () => {
        let success = true;
        for (const recipe of SEED_RECIPES) {
          const { error } = await supabase
            .from('recipes')
            .update({ imageUrl: recipe.imageUrl })
            .eq('id', recipe.id);
          
          if (error) success = false;
        }
        
        if (success) {
          get().fetchRecipes();
          alert('Successfully updated all recipe photos to your local images!');
        } else {
          alert('There was an error updating some photos.');
        }
      }
    }),
    {
      name: 'recipeni-config-v1', // saves to local storage
      partialize: (state) => ({ theme: state.theme, isSupabaseSeeded: state.isSupabaseSeeded }), // Only persist theme and seed status
    }
  )
)

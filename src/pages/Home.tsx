import { Link } from 'react-router-dom'
import { ArrowRight, Utensils } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import RecipeGrid from '../components/recipe/RecipeGrid'

export default function Home() {
  const recipes = useAppStore(state => state.recipes)
  // Get top 4 recipes for featured section
  const featuredRecipes = [...recipes].sort((a, b) => b.favoriteCount - a.favoriteCount).slice(0, 4)

  return (
    <div className="flex flex-col w-full animate-in fade-in zoom-in-95 duration-700 ease-out fill-mode-both">
      {/* Hero Section */}
      <section className="relative w-full min-h-[calc(100vh-64px)] bg-gradient-to-b from-primary/10 via-primary/5 to-background flex flex-col items-center justify-center py-20 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6 border border-primary/20">
            <Utensils className="h-4 w-4" />
            <span>Discover authentic Filipino flavors</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground max-w-3xl mb-6 leading-tight">
            The Digital Home for <br className="hidden md:block"/>
            <span className="text-primary relative whitespace-nowrap">
              Filipino Food Culture
              <span className="absolute -bottom-2 left-0 w-full h-3 bg-primary/20 -z-10 rounded-full"></span>
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10">
            More than just a list of ingredients. RecipeNi is where we share the stories, traditions, and memories behind every "Recipe ni Mama".
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/recipes" className="px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/30 hover:bg-primary/90 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
              Explore Recipes <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        
        {/* Abstract background shapes */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute top-0 right-0 translate-x-1/4 w-[500px] h-[500px] bg-secondary rounded-full blur-3xl -z-10"></div>
      </section>

      {/* Story & Description Section */}
      <section className="py-24 bg-card relative overflow-hidden border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16 max-w-6xl mx-auto">
            <div className="w-full lg:w-1/2 space-y-6">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Preserving Our Culinary Heritage</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                RecipeNi is more than just a cookbook, it's a community-driven initiative dedicated to safeguarding the rich, diverse flavors of the Philippines. From the bustling streets of Manila to the peaceful provinces, every recipe tells a family story. 
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Whether you're looking for your grandmother's authentic Sinigang blending, or want to share your own modernized Adobo twist, our platform connects food lovers through the universal language of traditional, home-cooked Filipino food.
              </p>
              
              <div className="pt-6 flex gap-8 border-t border-border mt-8">
                <div>
                  <h4 className="text-4xl font-black text-primary mb-1 tracking-tighter">500+</h4>
                  <p className="text-sm text-foreground font-bold uppercase tracking-wider">Authentic Recipes</p>
                </div>
                <div>
                  <h4 className="text-4xl font-black text-primary mb-1 tracking-tighter">10k+</h4>
                  <p className="text-sm text-foreground font-bold uppercase tracking-wider">Home Cooks</p>
                </div>
              </div>
            </div>
            
            <div className="w-full lg:w-1/2 relative mt-12 lg:mt-0">
              <div className="aspect-square rounded-full bg-primary/20 absolute -inset-6 blur-3xl -z-10"></div>
              
              <div className="relative z-10 w-full aspect-video md:aspect-square group overflow-hidden rounded-3xl shadow-2xl border-4 border-background/50">
                <img 
                  src="/Photo/kareKare.jpg" 
                  alt="Rich Kare-kare" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              
              <div className="absolute -bottom-8 -left-8 w-40 h-40 md:w-56 md:h-56 z-20 overflow-hidden rounded-full shadow-2xl border-4 border-background hover:rotate-6 transition-transform duration-500">
                <img 
                  src="/Photo/HaloHalo.jpg" 
                  alt="Halo-halo" 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-black/10 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Featured Classics</h2>
            <p className="text-muted-foreground">The most loved recipes from our community.</p>
          </div>
          <Link to="/recipes" className="hidden sm:flex items-center gap-1 text-primary font-medium hover:underline">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        
        <RecipeGrid recipes={featuredRecipes} />
        
        <div className="mt-8 text-center sm:hidden">
          <Link to="/recipes" className="inline-flex items-center gap-1 text-primary font-medium hover:underline">
            View all recipes <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}

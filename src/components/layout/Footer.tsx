import { ChefHat } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs">
          <div className="flex items-center gap-2 text-foreground">
            <ChefHat className="h-5 w-5 text-primary" />
            <span className="font-bold tracking-tight">Recipe<span className="text-primary">Ni</span></span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} RecipeNi. All recipes ni Mama at Lola.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

import { Link, useNavigate } from 'react-router-dom'
import { ChefHat, Search, User as UserIcon, LogOut, Moon, Sun } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { supabase } from '../../lib/supabase'

export default function Navbar() {
  const { user, theme, toggleTheme } = useAppStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/auth')
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between relative">
        
        {/* Left: Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
              <ChefHat className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:block">RecipeNi</span>
          </Link>
        </div>

        {/* Center: Navigation Links */}
        <div className="hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:flex items-center gap-8 text-sm font-bold text-muted-foreground">
          <Link to="/" className="hover:text-foreground hover:bg-muted/50 px-4 py-2 rounded-full transition-all">Home</Link>
          <Link to="/recipes" className="hover:text-foreground hover:bg-muted/50 px-4 py-2 rounded-full transition-all">Explore</Link>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link to="/recipes" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Search">
            <Search className="h-5 w-5" />
          </Link>
          
          <button 
            onClick={toggleTheme} 
            className="relative inline-flex items-center justify-center w-9 h-9 rounded-full text-muted-foreground hover:text-primary hover:bg-muted/50 transition-colors focus:outline-none"
            aria-label="Toggle theme"
          >
            <Sun className={`absolute h-5 w-5 transition-all duration-500 transform ${theme === 'dark' ? 'scale-100 rotate-0 opacity-100' : 'scale-0 -rotate-90 opacity-0'}`} />
            <Moon className={`absolute h-5 w-5 transition-all duration-500 transform ${theme === 'dark' ? 'scale-0 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'}`} />
          </button>
          
          <div className="flex items-center gap-2 ml-2">
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors focus:outline-none py-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary overflow-hidden shrink-0">
                    <UserIcon className="h-4 w-4" />
                  </div>
                  <span className="hidden sm:inline-block max-w-[120px] truncate font-semibold">{user.fullName.split(' ')[0]}</span>
                </button>
                <div className="absolute right-0 top-full w-48 pt-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50">
                  <div className="bg-card border rounded-xl shadow-lg py-1 overflow-hidden">
                    <div className="px-4 py-2 border-b">
                    <p className="text-sm font-medium text-foreground truncate">{user.fullName}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 hover:bg-muted text-foreground text-sm transition-colors">
                    <UserIcon className="h-4 w-4" /> Dashboard
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-destructive/10 hover:text-destructive text-sm transition-colors text-left font-medium"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link 
                to="/auth"
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-full font-medium transition-all shadow-sm hover:shadow hover:-translate-y-0.5"
              >
                <UserIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

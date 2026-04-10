import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChefHat, Eye, EyeOff, Facebook } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { resolveImageUrl } from '../lib/utils'

const AUTH_SHOWCASE_SLIDES = [
  {
    imageUrl: '/Photo/chickenAdobo.jpg',
    alt: 'Chicken Adobo',
    title: 'Classic Chicken Adobo',
    author: 'Lola Rosa',
    category: 'Main Course',
    prep: '15m',
    cook: '40m',
    progressWidth: '66%',
    headline: 'Discover your next favorite dish',
    description: 'Explore authentic Filipino recipes crafted by home cooks across the Philippines.'
  },
  {
    imageUrl: '/Photo/kareKare.jpg',
    alt: 'Kare-Kare',
    title: 'Traditional Kare-Kare',
    author: 'Kuya Jun',
    category: 'Fiesta Favorite',
    prep: '30m',
    cook: '180m',
    progressWidth: '82%',
    headline: 'Cook bold flavors with confidence',
    description: 'Follow clear instructions, rich visuals, and timing tips that make each step easier.'
  },
  {
    imageUrl: '/Photo/sinigangNaBaboy.jpeg',
    alt: 'Sinigang na Baboy',
    title: 'Sinigang na Baboy',
    author: 'Tita Baby',
    category: 'Comfort Soup',
    prep: '20m',
    cook: '60m',
    progressWidth: '58%',
    headline: 'Bring family recipes to life',
    description: 'Save, discover, and share dishes that turn simple meals into memorable moments.'
  }
]

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showcaseIndex, setShowcaseIndex] = useState(0)
  const [typedHeadline, setTypedHeadline] = useState('')
  
  const navigate = useNavigate()
  const currentSlide = AUTH_SHOWCASE_SLIDES[showcaseIndex]

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setShowcaseIndex((prev) => (prev + 1) % AUTH_SHOWCASE_SLIDES.length)
    }, 4200)

    return () => clearInterval(slideTimer)
  }, [])

  useEffect(() => {
    setTypedHeadline('')
    const text = currentSlide.headline
    let i = 0

    const typeTimer = setInterval(() => {
      i += 1
      setTypedHeadline(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(typeTimer)
      }
    }, 35)

    return () => clearInterval(typeTimer)
  }, [currentSlide.headline])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        if (error) throw error
        navigate('/') 
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName } 
          }
        })
        if (error) throw error
        alert("Sign up successful! Please log in now.")
        setIsLogin(true)
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-[100dvh] overflow-hidden flex animate-in fade-in duration-700">
      
      {/* Left Form Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-12 lg:px-20 xl:px-28 bg-background relative z-10 overflow-hidden py-4">
        
        {/* Brand Logo */}
        <div className="absolute top-8 left-8 md:left-16 lg:left-24 xl:left-32 flex items-center gap-2">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
            <ChefHat className="h-5 w-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">RecipeNi</span>
        </div>

        <div className="w-full flex justify-center">
          <div key={isLogin ? 'auth-login' : 'auth-signup'} className="max-w-md w-full mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-center">
              {isLogin ? 'Sign in' : 'Create Account'}
            </h1>
            <p className="text-muted-foreground text-sm font-medium mb-6 text-center">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError(null)
                }} 
                className="text-foreground underline underline-offset-4 font-semibold hover:text-primary transition-colors"
              >
                {isLogin ? 'Create now' : 'Sign in'}
              </button>
            </p>

          <form onSubmit={handleAuth} className="space-y-4">
            
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm font-medium p-3 rounded-lg border border-destructive/20">
                {error}
              </div>
            )}

            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-semibold tracking-wide">Full Name</label>
                <input 
                  required
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-muted hover:border-muted-foreground/30 rounded-xl bg-background focus:bg-background outline-none focus:border-primary transition-all text-sm" 
                  placeholder="Juan Dela Cruz"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold tracking-wide">Email</label>
              <input 
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-muted hover:border-muted-foreground/30 rounded-xl bg-background focus:bg-background outline-none focus:border-primary transition-all text-sm" 
                placeholder="juan@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold tracking-wide">Password</label>
              <div className="relative">
                <input 
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-muted hover:border-muted-foreground/30 rounded-xl bg-background focus:bg-background outline-none focus:border-primary transition-all text-sm pr-12" 
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-muted text-primary focus:ring-primary h-4 w-4 accent-primary" />
                  <span className="text-sm font-medium text-muted-foreground">Save account</span>
                </label>
                <button type="button" className="text-sm font-bold text-foreground hover:text-primary transition-colors hover:underline">
                  Forgot Password?
                </button>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3.5 rounded-xl transition-all shadow-md mt-4 disabled:opacity-70"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign in' : 'Create Account')}
            </button>
            
          </form>

          <div className="relative flex items-center py-4 mt-1">
            <div className="flex-grow border-t border-muted"></div>
            <span className="flex-shrink-0 mx-4 text-xs font-semibold tracking-widest text-muted-foreground uppercase">OR</span>
            <div className="flex-grow border-t border-muted"></div>
          </div>

          <div className="space-y-3">
            <button 
              type="button" 
              disabled
              aria-disabled="true"
              className="w-full flex items-center justify-between gap-3 px-4 py-3.5 border-2 border-muted rounded-xl text-sm font-bold opacity-80 cursor-not-allowed"
            >
              <span className="flex items-center gap-3">
                <svg viewBox="0 0 24 24" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-primary/15 text-primary px-2 py-1 rounded-md">
                Coming soon
              </span>
            </button>
            <button 
              type="button" 
              disabled
              aria-disabled="true"
              className="w-full flex items-center justify-between gap-3 px-4 py-3.5 border-2 border-muted rounded-xl text-sm font-bold opacity-80 cursor-not-allowed"
            >
              <span className="flex items-center gap-3">
                <Facebook className="h-5 w-5 text-[#1877F2] fill-current" />
                Continue with Facebook
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-primary/15 text-primary px-2 py-1 rounded-md">
                Coming soon
              </span>
            </button>
          </div>
        </div>
      </div>
      </div>

      {/* Right Decorative Section */}
      <div className="hidden md:flex md:w-1/2 bg-primary items-center justify-center relative overflow-hidden p-10 lg:p-16">
        
        {/* Abstract Background Elements */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary-foreground/5 blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-black/10 blur-3xl"></div>

        <div className="relative z-10 w-full max-w-lg">
          {/* Mockup Recipe Card */}
          <div className="bg-card w-full rounded-2xl shadow-2xl overflow-hidden border border-border/50 animate-in slide-in-from-right-16 duration-1000">
            <div className="h-48 bg-muted relative">
              <img 
                key={currentSlide.imageUrl}
                src={resolveImageUrl(currentSlide.imageUrl)} 
                alt={currentSlide.alt}
                className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-500"
              />
              <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-foreground">
                Featured
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-xl mb-1">{currentSlide.title}</h3>
                  <p className="text-muted-foreground text-sm">By {currentSlide.author}</p>
                </div>
                <div className="bg-primary/10 text-primary px-2.5 py-1 rounded-md text-xs font-bold">
                  {currentSlide.category}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-700" style={{ width: currentSlide.progressWidth }}></div>
                </div>
                <div className="flex justify-between text-xs font-medium text-muted-foreground">
                  <span>Prep: {currentSlide.prep}</span>
                  <span>Cook: {currentSlide.cook}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center text-primary-foreground">
            <h2 className="text-3xl font-bold mb-4 tracking-tight min-h-[2.5rem]">
              <span className="typing-caret">{typedHeadline}</span>
            </h2>
            <p className="text-primary-foreground/80 leading-relaxed text-lg">
              {currentSlide.description}
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}

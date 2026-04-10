import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChefHat, Eye, EyeOff, Facebook } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const navigate = useNavigate()

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

  const handleOAuth = async (provider: 'google' | 'facebook') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
      })
      if (error) throw error
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen flex animate-in fade-in duration-700">
      
      {/* Left Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 xl:px-32 bg-background relative z-10">
        
        {/* Brand Logo */}
        <div className="absolute top-8 left-8 md:left-16 lg:left-24 xl:left-32 flex items-center gap-2">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
            <ChefHat className="h-5 w-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">RecipeNi</span>
        </div>

        <div className="max-w-md w-full mx-auto lg:mx-0 mt-20">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">
            {isLogin ? 'Sign in' : 'Create Account'}
          </h1>
          <p className="text-muted-foreground text-sm font-medium mb-10">
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

          <form onSubmit={handleAuth} className="space-y-6">
            
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

          <div className="relative flex items-center py-6 mt-2">
            <div className="flex-grow border-t border-muted"></div>
            <span className="flex-shrink-0 mx-4 text-xs font-semibold tracking-widest text-muted-foreground uppercase">OR</span>
            <div className="flex-grow border-t border-muted"></div>
          </div>

          <div className="space-y-3">
            <button 
              onClick={() => handleOAuth('google')}
              type="button" 
              className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border-2 border-muted hover:bg-muted/30 rounded-xl text-sm font-bold transition-colors"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
            <button 
              onClick={() => handleOAuth('facebook')}
              type="button" 
              className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border-2 border-muted hover:bg-muted/30 rounded-xl text-sm font-bold transition-colors"
            >
              <Facebook className="h-5 w-5 text-[#1877F2] fill-current" />
              Continue with Facebook
            </button>
          </div>
        </div>
      </div>

      {/* Right Decorative Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center relative overflow-hidden p-16">
        
        {/* Abstract Background Elements */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary-foreground/5 blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-black/10 blur-3xl"></div>

        <div className="relative z-10 w-full max-w-lg">
          {/* Mockup Recipe Card */}
          <div className="bg-card w-full rounded-2xl shadow-2xl overflow-hidden border border-border/50 animate-in slide-in-from-right-16 duration-1000">
            <div className="h-48 bg-muted relative">
              <img 
                src="https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=1000" 
                alt="Adobo Preview" 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-foreground">
                Featured
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-xl mb-1">Classic Chicken Adobo</h3>
                  <p className="text-muted-foreground text-sm">By Lola Rosa</p>
                </div>
                <div className="bg-primary/10 text-primary px-2.5 py-1 rounded-md text-xs font-bold">
                  Main Course
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-2/3"></div>
                </div>
                <div className="flex justify-between text-xs font-medium text-muted-foreground">
                  <span>Prep: 15m</span>
                  <span>Cook: 40m</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center text-primary-foreground">
            <h2 className="text-3xl font-bold mb-4 tracking-tight">Discover your next favorite dish</h2>
            <p className="text-primary-foreground/80 leading-relaxed text-lg">
              Explore hundreds of authentic Filipino recipes submitted by our community. Bring home the taste of tradition.
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}

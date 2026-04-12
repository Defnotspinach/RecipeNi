import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { supabase } from './lib/supabase'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import SplashScreen from './components/layout/SplashScreen'
import { useAppStore } from './store/useAppStore'
import Home from './pages/Home'
import Explore from './pages/Explore'
import RecipeDetail from './pages/RecipeDetail'
import Dashboard from './pages/Dashboard'
import SubmitRecipe from './pages/SubmitRecipe'
import Auth from './pages/Auth'
import LoginPromptModal from './components/ui/LoginPromptModal'
import GlobalToast from './components/ui/GlobalToast'

function App() {
  const theme = useAppStore(state => state.theme)
  const fetchRecipes = useAppStore(state => state.fetchRecipes)
  const setUser = useAppStore(state => state.setUser)
  const fetchFavorites = useAppStore(state => state.fetchFavorites)
  const [showSplash, setShowSplash] = useState(true)

  // Initialization & Auth Listener
  useEffect(() => {
    fetchRecipes() // Load initial cloud data

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          fullName: session.user.user_metadata?.full_name || 'Anonymous Chef',
          avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200'
        })
        fetchFavorites(session.user.id)
      } else {
        setUser(null)
      }
    })

    // Listen for sign-in/sign-out changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          fullName: session.user.user_metadata?.full_name || 'Anonymous Chef',
          avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200'
        })
        fetchFavorites(session.user.id)
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Dark Node Handler
  useEffect(() => {
    const root = window.document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  return (
    <>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      <Router>
        <LoginPromptModal />
        <GlobalToast />
        <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recipes" element={<Explore />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/submit" element={<SubmitRecipe />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
    </>
  )
}

export default App

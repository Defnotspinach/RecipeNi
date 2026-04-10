import { useAppStore } from '../../store/useAppStore'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, X, LogIn } from 'lucide-react'

export default function LoginPromptModal() {
  const { isLoginPromptOpen, setLoginPromptOpen } = useAppStore()
  const navigate = useNavigate()

  if (!isLoginPromptOpen) return null

  return (
    <div className="fixed inset-0 z-[110] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-card w-full max-w-sm rounded-2xl border shadow-2xl overflow-hidden relative">
        <button 
          onClick={() => setLoginPromptOpen(false)}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors p-1"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="p-8 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <LogIn className="h-8 w-8 text-primary" />
          </div>
          
          <h2 className="text-2xl font-bold tracking-tight mb-2">Sign in Required</h2>
          <p className="text-muted-foreground mb-8">
            You need to be logged in to save your favorite recipes. Create an account to start building your cookbook!
          </p>
          
          <div className="flex flex-col gap-3 w-full">
            <button 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded-xl transition-all shadow-md"
              onClick={() => {
                setLoginPromptOpen(false)
                navigate('/auth')
              }}
            >
              Log In directly
            </button>
            <button 
              className="w-full bg-muted hover:bg-muted/80 text-foreground font-bold py-3 rounded-xl transition-all"
              onClick={() => setLoginPromptOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

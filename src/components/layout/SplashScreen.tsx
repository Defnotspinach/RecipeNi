import { useState, useEffect } from 'react'
import { ChefHat } from 'lucide-react'

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [isFadingOut, setIsFadingOut] = useState(false)

  useEffect(() => {
    // Show splash for 1.8 seconds, then trigger fade out animation
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true)
    }, 1900)

    // Wait for the fade out animation to finish (500ms) before removing component
    const finishTimer = setTimeout(() => {
      onFinish()
    }, 2300)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(finishTimer)
    }
  }, [onFinish])

  return (
    <div
      className={`fixed inset-0 z-[200] bg-background flex flex-col items-center justify-center transition-all duration-500 ease-in-out ${isFadingOut ? 'opacity-0 -translate-y-8 pointer-events-none' : 'opacity-100'}`}
    >
      <div className="flex flex-col items-center animate-in zoom-in-95 duration-1000">
        <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <ChefHat className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
          Recipe<span className="text-primary">Ni</span>
        </h1>
        <p className="text-muted-foreground font-medium mt-3 tracking-wide">
          Cooking up your recipes...
        </p>
      </div>
    </div>
  )
}

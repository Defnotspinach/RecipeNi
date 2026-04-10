import { useState, useEffect } from 'react'
import { X, CheckCircle, ArrowRight, ChefHat } from 'lucide-react'
import { Recipe } from '../../types'

interface CookingModeProps {
  recipe: Recipe
  onClose: () => void
}

export default function CookingMode({ recipe, onClose }: CookingModeProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const stepDurationSeconds = 15
  const [timeLeft, setTimeLeft] = useState(stepDurationSeconds) // Fixed 15 seconds per step as per requirements
  const [timerActive, setTimerActive] = useState(true)
  const [isFinished, setIsFinished] = useState(false)

  const steps = recipe.steps
  const isLastStep = currentStepIndex === steps.length - 1

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined

    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setTimerActive(false)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [timerActive, timeLeft])

  const handleNextStep = () => {
    if (isLastStep) return
    setCurrentStepIndex((prev) => prev + 1)
    setTimeLeft(stepDurationSeconds) // Reset timer to 15s for the next task
    setTimerActive(true)
  }

  const handleFinish = () => {
    setIsFinished(true)
  }

  const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100
  const timerProgressPercentage = Math.max(0, Math.min(100, (timeLeft / stepDurationSeconds) * 100))

  if (isFinished) {
    return (
      <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md flex flex-col items-center justify-center p-4">
        <div className="bg-card border shadow-xl rounded-2xl p-8 md:p-12 max-w-lg w-full text-center animate-in zoom-in-95 duration-500 fade-in flex flex-col items-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-500" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight mb-3">Master Chef!</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Congratulations! You've successfully cooked <strong className="text-foreground">{recipe.title}</strong>. Time to enjoy your delicious creation!
          </p>
          <button 
            onClick={onClose}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3.5 rounded-xl transition-all shadow-md hover:-translate-y-1"
          >
            Return to Recipe
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md flex flex-col pt-safe">
      {/* Header / Progress Bar */}
      <div className="w-full bg-card border-b shadow-sm">
        <div className="h-1.5 w-full bg-muted">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ChefHat className="h-6 w-6 text-primary" />
            <span className="font-bold hidden sm:inline-block tracking-tight text-lg">Cooking: {recipe.title}</span>
          </div>
          <div className="text-sm font-medium text-muted-foreground mr-auto sm:ml-4 sm:mr-0 pl-3 border-l border-border hidden md:block">
            Step {currentStepIndex + 1} of {steps.length}
          </div>
          
          <button 
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors font-medium flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <span className="hidden sm:inline">Exit Cooking Mode</span>
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto w-full container mx-auto px-4 py-8 md:py-16 flex flex-col">
        
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full justify-center">
          
          <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary font-bold rounded-full text-sm uppercase tracking-wide w-max">
            Step {currentStepIndex + 1}
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {steps[currentStepIndex]}
          </h2>

          {/* Timer Output */}
          <div className="p-6 md:p-8 rounded-2xl bg-muted border flex flex-col items-center justify-center text-center mt-auto animate-in fade-in duration-700">
            {timeLeft > 0 ? (
              <>
                <div className="text-5xl md:text-7xl font-bold tracking-tighter text-primary mb-2 font-mono">
                  00:{timeLeft.toString().padStart(2, '0')}
                </div>
                <p className="text-muted-foreground font-medium">Remaining time for this task...</p>

                <div className="w-full max-w-xl mt-5">
                  <div className="h-4 rounded-full border border-border/70 bg-background/70 overflow-hidden shadow-inner">
                    <div
                      className="liquid-progress h-full transition-all duration-700 ease-linear"
                      style={{ width: `${timerProgressPercentage}%` }}
                    >
                      <div className="liquid-flow" />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center animate-in zoom-in-95 duration-300">
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <h3 className="text-2xl font-bold mb-2">Timer finished!</h3>
                <p className="text-muted-foreground">Ready to move on?</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Footer Actions */}
      <div className="w-full bg-card border-t p-4 md:p-6 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="container mx-auto flex justify-between items-center max-w-4xl">
          <div className="text-sm font-medium text-muted-foreground">
            {isLastStep ? "Final Step!" : `${steps.length - currentStepIndex - 1} steps remaining`}
          </div>
          
          <div className="flex gap-4">
            {timeLeft === 0 && (
              isLastStep ? (
                <button 
                  onClick={handleFinish}
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-bold text-lg transition-all animate-in zoom-in flex items-center gap-2 shadow-lg hover:-translate-y-1"
                >
                  <CheckCircle className="h-5 w-5" /> Finish Cooking
                </button>
              ) : (
                <button 
                  onClick={handleNextStep}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full font-bold text-lg transition-all animate-in slide-in-from-right-4 flex items-center gap-2 shadow-lg hover:-translate-y-1"
                >
                  Next Step <ArrowRight className="h-5 w-5" />
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

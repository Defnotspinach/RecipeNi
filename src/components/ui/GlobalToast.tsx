import { useAppStore } from '../../store/useAppStore'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function GlobalToast() {
  const { toast, setToast } = useAppStore()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (toast) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 2700) // start exit animation slightly before state clears
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
    }
  }, [toast])

  if (!toast) return null

  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-green-500" />,
    error: <AlertCircle className="h-5 w-5 text-destructive" />,
    info: <Info className="h-5 w-5 text-blue-500" />
  }

  const bgColors = {
    success: 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400',
    error: 'bg-destructive/10 border-destructive/20 text-destructive dark:text-red-400',
    info: 'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400'
  }

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex items-end justify-end p-4 pointer-events-none sm:p-6 sm:items-start">
      <div 
        className={`pointer-events-auto w-full max-w-sm overflow-hidden rounded-xl bg-card border shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-300 transform ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-2 opacity-0 scale-95'} ${bgColors[toast.type]}`}
      >
        <div className="p-4 flex items-start gap-3">
          <div className="flex-shrink-0">
            {icons[toast.type]}
          </div>
          <div className="flex-1 pt-0.5">
            <p className="text-sm font-semibold">
              {toast.message}
            </p>
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <button
              type="button"
              className="inline-flex rounded-md p-1 hover:bg-black/5 dark:hover:bg-white/10 focus:outline-none transition-colors"
              onClick={() => {
                setIsVisible(false)
                setTimeout(() => setToast(null), 300)
              }}
            >
              <span className="sr-only">Close</span>
              <X className="h-4 w-4 opacity-70" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

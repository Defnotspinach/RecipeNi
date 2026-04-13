import { createPortal } from 'react-dom'
import { X, Trash2, Loader2 } from 'lucide-react'

interface ConfirmDeleteModalProps {
  isOpen: boolean
  isDeleting?: boolean
  recipeTitle: string
  onClose: () => void
  onConfirm: () => void
}

export default function ConfirmDeleteModal({ 
  isOpen, 
  isDeleting = false,
  recipeTitle, 
  onClose, 
  onConfirm 
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null

  const modalContent = (
    <div 
      className="fixed inset-0 z-[110] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200"
      onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
    >
      <div 
        className="bg-card w-full max-w-sm rounded-2xl border shadow-2xl overflow-hidden relative"
        onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
      >
        <button 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors p-1"
          disabled={isDeleting}
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="p-8 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
            <Trash2 className="h-8 w-8 text-destructive" />
          </div>
          
          <h2 className="text-2xl font-bold tracking-tight mb-2">Delete Recipe</h2>
          <p className="text-muted-foreground mb-8 text-sm">
            Are you sure you want to delete <span className="font-semibold text-foreground">"{recipeTitle}"</span>? This action cannot be undone.
          </p>
          
          <div className="flex flex-col gap-3 w-full">
            <button 
              className="w-full h-12 flex items-center justify-center gap-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold rounded-xl transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onConfirm(); }}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Recipe"
              )}
            </button>
            <button 
              className="w-full h-12 flex items-center justify-center bg-muted hover:bg-muted/80 text-foreground font-bold rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }}
              disabled={isDeleting}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

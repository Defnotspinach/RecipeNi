import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { BookOpen, Clock, ImageIcon, ListChecks, Utensils, ChefHat, Save, UploadCloud, X } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { supabase } from '../lib/supabase'
import { Recipe } from '../types'

export default function SubmitRecipe() {
  const { user, addRecipe, showToast } = useAppStore()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Main',
    prepTime: '',
    cookTime: '',
    servings: '',
    difficulty: 'Medium',
    ingredientsText: '',
    stepsText: '',
  })
  
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  // Basic validation check to enable/disable submit button
  const isValid = formData.title && formData.description && formData.ingredientsText && formData.stepsText && (imagePreview !== null)

  if (!user) {
    return <Navigate to="/" replace />
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const clearImage = () => {
    setImageFile(null)
    setImagePreview(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isValid) return
    setIsUploading(true)

    let finalImageUrl = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1000'

    // Handle real file upload to Supabase Storage
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('recipes')
        .upload(fileName, imageFile)

      if (uploadError) {
        console.error('Error uploading image:', uploadError)
        showToast('Failed to upload the image. Please verify your purely public bucket "recipes" exists.', 'error')
        setIsUploading(false)
        return
      }

      // Grab the public URL to save to our database
      const { data: { publicUrl } } = supabase.storage
        .from('recipes')
        .getPublicUrl(fileName)
        
      finalImageUrl = publicUrl
    }

    const newRecipe: Recipe = {
      id: `r_${Date.now()}`,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      prepTime: parseInt(formData.prepTime) || 0,
      cookTime: parseInt(formData.cookTime) || 0,
      servings: parseInt(formData.servings) || 1,
      difficulty: formData.difficulty as any,
      ingredients: formData.ingredientsText.split('\n').filter(i => i.trim()),
      steps: formData.stepsText.split('\n').filter(s => s.trim()),
      imageUrl: finalImageUrl,
      isPublic: true,
      authorId: user.id,
      authorName: user.fullName,
      favoriteCount: 0,
      createdAt: new Date().toISOString()
    }

    await addRecipe(newRecipe)
    setIsUploading(false)
    navigate('/dashboard')
  }

  return (
    <div className="bg-muted/10 min-h-screen pb-20 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both">
      {/* Header Banner */}
      <div className="bg-primary/10 border-b border-primary/20 pt-16 pb-24 text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="mx-auto w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-6">
            <ChefHat className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">Share Your Recipe</h1>
          <p className="text-lg text-muted-foreground">
            Have a family favorite? Add your secret "Recipe ni Mama" to our growing community.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl -mt-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Overview */}
          <div className="bg-card border rounded-2xl shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6 border-b pb-4">
              <BookOpen className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">General Information</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Recipe Title</label>
                <input 
                  required 
                  name="title" 
                  value={formData.title} 
                  onChange={handleChange} 
                  className="w-full border rounded-xl px-4 py-3 bg-muted/50 focus:bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-all placeholder:text-muted-foreground/70" 
                  placeholder="e.g. Lola's Signature Kare-Kare" 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Short Description</label>
                <textarea 
                  required 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  rows={3} 
                  className="w-full border rounded-xl px-4 py-3 bg-muted/50 focus:bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-all placeholder:text-muted-foreground/70" 
                  placeholder="What makes this dish special? Tell us the story behind it."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                    <Utensils className="h-4 w-4 text-muted-foreground" /> Category
                  </label>
                  <select 
                    name="category" 
                    value={formData.category} 
                    onChange={handleChange} 
                    className="w-full border rounded-xl px-4 py-3 bg-muted/50 outline-none focus:ring-2 focus:ring-primary/50 appearance-none font-medium text-foreground"
                  >
                    <option value="Main">Main Course</option>
                    <option value="Soup">Soup</option>
                    <option value="Noodles">Noodles</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Snack">Snack</option>
                  </select>
                </div>
              </div>

              {/* Enhanced File Uploader */}
              <div className="mt-6 border-t pt-6">
                <label className="flex items-center gap-2 text-sm font-semibold mb-3">
                  <ImageIcon className="h-4 w-4 text-muted-foreground" /> Cover Photo
                </label>
                
                {!imagePreview ? (
                  <div className="w-full border-2 border-dashed border-muted-foreground/30 rounded-2xl p-8 hover:bg-muted/50 transition-colors flex flex-col items-center justify-center text-center cursor-pointer relative group">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <UploadCloud className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg mb-1">Upload a photo</h3>
                    <p className="text-muted-foreground text-sm max-w-xs">
                      Drag and drop your mouth-watering photo here, or click to browse.
                    </p>
                  </div>
                ) : (
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden border">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute top-0 left-0 w-full rounded-t-2xl p-4 bg-gradient-to-b from-black/60 to-transparent flex justify-between items-start">
                      <span className="text-white text-xs font-bold px-2 py-1 bg-black/40 backdrop-blur-md rounded-md">
                        Preview Selected
                      </span>
                      <button 
                        type="button" 
                        onClick={clearImage}
                        className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-lg transition-transform hover:scale-110"
                        aria-label="Remove image"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Section 2: Details metrics */}
          <div className="bg-card border rounded-2xl shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6 border-b pb-4">
              <Clock className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">Time & Difficulty</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-muted-foreground">Difficulty</label>
                <select name="difficulty" value={formData.difficulty} onChange={handleChange} className="w-full border rounded-xl px-3 py-2.5 bg-muted/50 outline-none focus:ring-2 focus:ring-primary/50 font-medium">
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-muted-foreground">Prep (mins)</label>
                <input type="number" required name="prepTime" value={formData.prepTime} onChange={handleChange} className="w-full border rounded-xl px-3 py-2.5 bg-muted/50 outline-none focus:ring-2 focus:ring-primary/50" min="0" placeholder="15" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-muted-foreground">Cook (mins)</label>
                <input type="number" required name="cookTime" value={formData.cookTime} onChange={handleChange} className="w-full border rounded-xl px-3 py-2.5 bg-muted/50 outline-none focus:ring-2 focus:ring-primary/50" min="0" placeholder="45" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-muted-foreground">Servings</label>
                <input type="number" required name="servings" value={formData.servings} onChange={handleChange} className="w-full border rounded-xl px-3 py-2.5 bg-muted/50 outline-none focus:ring-2 focus:ring-primary/50" min="1" placeholder="4" />
              </div>
            </div>
          </div>

          {/* Section 3: Ingredients & Steps */}
          <div className="bg-card border rounded-2xl shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6 border-b pb-4">
              <ListChecks className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">Preparation</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="mb-2">
                  <label className="block text-base font-semibold">Ingredients</label>
                  <p className="text-xs text-muted-foreground">List one ingredient per line.</p>
                </div>
                <textarea 
                  required 
                  name="ingredientsText" 
                  value={formData.ingredientsText} 
                  onChange={handleChange} 
                  rows={8} 
                  className="w-full border rounded-xl px-4 py-3 bg-muted/50 focus:bg-background outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono text-sm leading-relaxed" 
                  placeholder="1 kg chicken chunks&#10;1/2 cup soy sauce&#10;..."
                />
              </div>
              <div>
                <div className="mb-2">
                  <label className="block text-base font-semibold">Instructions</label>
                  <p className="text-xs text-muted-foreground">List one step per line in order.</p>
                </div>
                <textarea 
                  required 
                  name="stepsText" 
                  value={formData.stepsText} 
                  onChange={handleChange} 
                  rows={8} 
                  className="w-full border rounded-xl px-4 py-3 bg-muted/50 focus:bg-background outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono text-sm leading-relaxed" 
                  placeholder="Marinate the chicken...&#10;Heat oil in pan...&#10;..."
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              type="submit" 
              disabled={!isValid || isUploading}
              className={`flex items-center gap-2 px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-md
                ${(isValid && !isUploading)
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-1' 
                  : 'bg-muted text-muted-foreground cursor-not-allowed border'
                }`}
            >
              {isUploading ? (
                <>
                  <UploadCloud className="h-5 w-5 animate-bounce" />
                  Uploading...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Publish Recipe
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAppStore } from '../../store/useAppStore';
import { Recipe } from '../../types';
import { X, UploadCloud, FileText, Image as ImageIcon, Save, Loader2, Wand2 } from 'lucide-react';

interface QuickAddRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickAddRecipeModal({ isOpen, onClose }: QuickAddRecipeModalProps) {
  const { user, addRecipe, showToast } = useAppStore();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Main',
    prepTime: '15',
    cookTime: '30',
    servings: '4',
    difficulty: 'Medium',
    ingredientsText: '',
    stepsText: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        title: '',
        description: '',
        category: 'Main',
        prepTime: '15',
        cookTime: '30',
        servings: '4',
        difficulty: 'Medium',
        ingredientsText: '',
        stepsText: '',
      });
      setImageFile(null);
      setImagePreview(null);
    }
  }, [isOpen]);

  if (!isOpen || !user) return null;

  const isValid = formData.title && formData.ingredientsText && formData.stepsText && imagePreview;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (file: File) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleTextNoteDrop = (text: string) => {
    let title = formData.title;
    let description = formData.description;
    let ingredients = formData.ingredientsText;
    let instructions = formData.stepsText;

    const lines = text.split('\n');
    let currentSection = 'description';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lowerLine = line.toLowerCase().trim();

      if (lowerLine === 'ingredients' || lowerLine === 'what you need') {
        currentSection = 'ingredients';
        continue;
      } else if (lowerLine === 'instructions' || lowerLine === 'steps' || lowerLine === 'directions' || lowerLine === 'method' || lowerLine === 'how to make') {
        currentSection = 'instructions';
        continue;
      }

      if (currentSection === 'description') {
        if (i === 0 && !title) {
          title = line.trim();
        } else {
          description += (description ? '\n' : '') + line;
        }
      } else if (currentSection === 'ingredients') {
        bulletsToText(line, val => ingredients += (ingredients ? '\n' : '') + val);
      } else if (currentSection === 'instructions') {
        bulletsToText(line, val => instructions += (instructions ? '\n' : '') + val);
      }
    }

    setFormData(prev => ({
      ...prev,
      title: title || prev.title,
      description: description.trim() || prev.description,
      ingredientsText: ingredients.trim() || prev.ingredientsText,
      stepsText: instructions.trim() || prev.stepsText
    }));

    showToast('Auto-filled sections from note!', 'success');
  };

  const bulletsToText = (line: string, appender: (val: string) => void) => {
    const clean = line.replace(/^[\-\*\•\d\.]+\s*/, '').trim();
    if (clean) appender(clean);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        handleImageSelect(file);
      } else if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            handleTextNoteDrop(event.target.result as string);
          }
        };
        reader.readAsText(file);
      } else {
        showToast('Unsupported file type. Please drop an image or text file.', 'error');
      }
    } else {
      const text = e.dataTransfer.getData('text/plain');
      if (text) {
        handleTextNoteDrop(text);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setIsUploading(true);

    let finalImageUrl = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1000';

    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('recipes')
        .upload(fileName, imageFile);

      if (uploadError) {
        showToast('Failed to upload image. Using default.', 'error');
      } else {
        const { data: { publicUrl } } = supabase.storage
          .from('recipes')
          .getPublicUrl(fileName);
        finalImageUrl = publicUrl;
      }
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
    };

    await addRecipe(newRecipe);
    setIsUploading(false);
    showToast('Recipe added successfully!', 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-center items-center p-0 md:px-6 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full max-w-4xl bg-card border-x border-t rounded-t-2xl shadow-2xl flex flex-col h-[95vh] overflow-y-auto relative transition-all ${isDraggingFile ? 'ring-4 ring-primary border-primary scale-[1.01]' : ''
          }`}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b shrink-0 bg-muted/30">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Wand2 className="h-6 w-6 text-primary" />
              Quick Add Recipe
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Drag & drop a photo, or drag a text/Notes file to auto-fill sections!
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body - scrollable area */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">

          {isDraggingFile && (
            <div className="absolute inset-0 z-10 bg-primary/10 backdrop-blur-sm flex flex-col items-center justify-center border-4 border-dashed border-primary rounded-2xl m-2">
              <UploadCloud className="h-16 w-16 text-primary mb-4 animate-bounce" />
              <h3 className="text-2xl font-bold text-primary">Drop it like it's hot!</h3>
              <p className="text-primary/80 font-medium">Drop an image or text file to parse</p>
            </div>
          )}

          <form id="quick-add-form" onSubmit={handleSubmit} className="space-y-6">

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Left Column: Image & Details */}
              <div className="lg:col-span-1 space-y-6">

                {/* Image Upload Area */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-muted-foreground" /> Cover Photo
                  </label>
                  {!imagePreview ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full aspect-square border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors text-center p-4 group"
                    >
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <UploadCloud className="h-6 w-6 text-primary" />
                      </div>
                      <span className="text-sm font-bold">Click or Drop Photo</span>
                    </div>
                  ) : (
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden border group">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => { setImageFile(null); setImagePreview(null); }}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transform hover:scale-110 transition-transform"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={(e) => e.target.files?.[0] && handleImageSelect(e.target.files[0])}
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Category</label>
                    <select name="category" value={formData.category} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 bg-muted/50 outline-none focus:ring-2 focus:ring-primary/50 text-sm">
                      <option value="Main">Main Course</option>
                      <option value="Soup">Soup</option>
                      <option value="Noodles">Noodles</option>
                      <option value="Dessert">Dessert</option>
                      <option value="Snack">Snack</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-muted-foreground">Prep (m)</label>
                      <input type="number" name="prepTime" value={formData.prepTime} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 bg-muted/50 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-muted-foreground">Cook (m)</label>
                      <input type="number" name="cookTime" value={formData.cookTime} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 bg-muted/50 text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-muted-foreground">Serves</label>
                      <input type="number" name="servings" value={formData.servings} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 bg-muted/50 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-muted-foreground">Difficulty</label>
                      <select name="difficulty" value={formData.difficulty} onChange={handleChange} className="w-full border rounded-lg px-2 py-2 bg-muted/50 text-sm">
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Text Content */}
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1 text-foreground">Recipe Title</label>
                  <input
                    required
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2.5 bg-muted/50 focus:bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium"
                    placeholder="e.g. Lola's Signature Adobo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-foreground">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={2}
                    className="w-full border rounded-lg px-3 py-2 bg-muted/50 focus:bg-background focus:ring-2 focus:ring-primary/50 outline-none text-sm resize-none"
                    placeholder="A quick summary..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1 flex items-center gap-1">
                      <FileText className="h-4 w-4 text-muted-foreground" /> Ingredients
                    </label>
                    <textarea
                      required
                      name="ingredientsText"
                      value={formData.ingredientsText}
                      onChange={handleChange}
                      rows={8}
                      className="w-full border rounded-lg px-3 py-2 bg-muted/50 focus:bg-background focus:ring-2 focus:ring-primary/50 outline-none text-sm font-mono whitespace-pre-wrap resize-none"
                      placeholder="1 cup rice&#10;2 cups water..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1 flex items-center gap-1">
                      <FileText className="h-4 w-4 text-muted-foreground" /> Instructions
                    </label>
                    <textarea
                      required
                      name="stepsText"
                      value={formData.stepsText}
                      onChange={handleChange}
                      rows={8}
                      className="w-full border rounded-lg px-3 py-2 bg-muted/50 focus:bg-background focus:ring-2 focus:ring-primary/50 outline-none text-sm font-mono whitespace-pre-wrap resize-none"
                      placeholder="Wash the rice...&#10;Cook for 20 mins..."
                    />
                  </div>
                </div>

                {/* Note Drop Zone */}
                <div
                  className="w-full border-2 border-dashed border-primary/40 bg-primary/5 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-primary/10 transition-colors text-center relative overflow-hidden group mt-2"
                >
                  <input
                    type="file"
                    accept=".txt,.md,text/plain"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    title="Click to select or drag and drop a note here"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        const file = e.target.files[0];
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          if (event.target?.result) handleTextNoteDrop(event.target.result as string);
                        };
                        reader.readAsText(file);
                        e.target.value = '';
                      }
                    }}
                  />
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full group-hover:scale-110 transition-transform">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-primary">Upload a Recipe Note (.txt)</p>
                      <p className="text-xs text-muted-foreground mt-0.5">We'll auto-extract the Title, Ingredients & Instructions!</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-muted/10 shrink-0 flex justify-end gap-3 mt-auto">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg font-medium hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            form="quick-add-form"
            type="submit"
            disabled={!isValid || isUploading}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold transition-all shadow-sm
              ${(isValid && !isUploading)
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-muted text-muted-foreground cursor-not-allowed border'
              }`}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Save Recipe
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

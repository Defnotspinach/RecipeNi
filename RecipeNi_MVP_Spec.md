# RecipeNi — Filipino Recipe Sharing Platform

## Overview

**RecipeNi** is a modern, high-performance Filipino recipe-sharing platform.  
The name is inspired by how Filipinos naturally refer to dishes: *“Recipe ni Mama”*, *“Recipe ni Lola”*.  

This creates a strong emotional and cultural connection, turning every recipe into a story, not just a list of ingredients.

This MVP focuses on:
- Clean, modern SaaS-level UI/UX
- High usability and responsiveness
- Strong content structure
- Local-first state management (no backend yet)
- Scalable architecture for future expansion

---

## Product Vision

RecipeNi is not just a recipe website.

It is a **digital home for Filipino food culture**, where users can:
- Discover authentic Filipino dishes
- Share their own family recipes
- Save and revisit favorites
- Explore regional cuisine

The goal is to feel **premium, curated, and personal**, not like a generic food blog.

---

## Tech Stack

### Frontend
- Vite
- React
- TypeScript

### UI & Styling
- shadcn/ui
- Tailwind CSS
- lucide-react (icons only, no emojis)

### State Management
- Zustand (temporary/local state only)

### Routing
- React Router

---

## Core Design Principles

### 1. Modern SaaS Feel
- Clean layouts
- Strong spacing system
- Clear hierarchy
- Smooth transitions

### 2. Editorial + Product Hybrid
- Large typography (hero sections)
- Image-first content
- Balanced with structured UI (cards, filters, dashboards)

### 3. Filipino Identity
- Warm, inviting tones
- Cultural authenticity
- Real Filipino dish content

### 4. Dual Theme Support
- Light Mode (default)
- Dark Mode (carefully designed, not inverted)

---

## Features (MVP Scope)

### Public Users (Guest)

Guests can:
- Browse recipes
- Search and filter recipes
- View recipe details
- Explore categories

Guests cannot:
- Add recipes
- Favorite recipes (persistently)
- Access dashboard

---

### Authenticated Users

Users can:
- Sign up / log in
- Submit recipes
- Choose recipe visibility (public/private)
- Favorite recipes
- Manage their own recipes
- Access dashboard

---

## Data Models

### User
```ts
type User = {
  id: string
  fullName: string
  email: string
  password: string
}
```

### Recipe
```ts
type Recipe = {
  id: string
  title: string
  description: string
  category: string
  prepTime: number
  cookTime: number
  servings: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  ingredients: string[]
  steps: string[]
  imageUrl: string
  notes?: string
  isPublic: boolean
  authorId: string
  authorName: string
  favoriteCount: number
  createdAt: string
}
```

---

## Folder Structure

```
src/
├── components/
├── pages/
├── store/
├── data/
├── hooks/
├── types/
├── lib/
├── App.tsx
├── main.tsx
```

---

## Seed Data (Filipino Recipes)

- Chicken Adobo
- Pork Sinigang
- Kare-Kare
- Pancit Canton
- Bicol Express
- Tinola
- Laing
- Leche Flan
- Halo-Halo
- Tapsilog

---

## Final Notes

RecipeNi should feel like:
- A modern startup product
- A culturally rooted platform
- A polished MVP ready for demo or pitching

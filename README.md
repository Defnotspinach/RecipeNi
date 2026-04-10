# RecipeNi 🍲

**The Digital Home for Filipino Food Culture.**

RecipeNi is a modern, full-stack web application designed to be a community-driven platform for discovering, sharing, and preserving authentic Filipino recipes. It's more than just a list of ingredients; it's where we share the stories, traditions, and memories behind every "Recipe ni Mama".

## ✨ Features

-   **🔐 User Authentication**: Secure sign-up and sign-in with email/password, plus OAuth options for Google and Facebook.
-   **🍳 Explore & Discover**: Browse a grid of beautiful recipe cards.
-   **🔍 Powerful Search & Filter**: Easily find recipes by title, ingredients, or category.
-   **📖 Detailed Recipe View**: A clean, focused view with ingredients, step-by-step instructions, and author details.
-   **👨‍🍳 Interactive Cooking Mode**: A step-by-step, full-screen guide with a timer for each instruction to help you cook along without touching your device.
-   **✍️ Submit Your Own Recipes**: A multi-step form to share your family's recipes, complete with image uploads to Supabase Storage.
-   **❤️ Personalized Dashboard**: Logged-in users get a personal space to view their submitted recipes and manage their collection of saved favorites.
-   **🌙 Dark/Light Mode**: A sleek, user-selectable dark mode for comfortable viewing in any lighting.
-   **📱 Fully Responsive**: A seamless experience across desktop, tablet, and mobile devices.

## 📸 Screenshots

*Add your screenshots in the sections below to showcase the application's pages.*

### Home Page
*(Your Screenshot Here)*

### Explore Page
*(Your Screenshot Here)*

### Recipe Detail Page
*(Your Screenshot Here)*

### Cooking Mode
*(Your Screenshot Here)*

### Authentication (Login/Sign Up) Page
*(Your Screenshot Here)*

### User Dashboard
*(Your Screenshot Here)*

### Submit Recipe Page
*(Your Screenshot Here)*

## 🛠️ Tech Stack

-   **Frontend**: [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/), [lucide-react](https://lucide.dev/) (for icons)
-   **State Management**: [Zustand](https://github.com/pmndrs/zustand)
-   **Backend as a Service**: [Supabase](https://supabase.io/)
    -   **Authentication**: Manages user sign-up and login.
    -   **Database**: PostgreSQL for storing recipe and user data.
    -   **Storage**: For handling image uploads.
-   **Routing**: [React Router DOM](https://reactrouter.com/)

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later recommended)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
-   A free [Supabase](https://supabase.io/) account

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/recipeni.git
    cd recipeni
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up your environment variables:**
    -   Create a Supabase project from your [Supabase dashboard](https://app.supabase.io).
    -   Go to `Project Settings` > `API`.
    -   Create a new file named `.env` in the root of your project.
    -   Copy the contents of `.env.example` into your new `.env` file.
    -   Find your **Project URL** and **anon public key** in your Supabase API settings and paste them into your `.env` file.

    Your `.env` file should look like this:
    ```
    VITE_SUPABASE_URL="YOUR_SUPABASE_URL"
    VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
    ```

4.  **Set up Supabase Storage:**
    -   In your Supabase project dashboard, go to the `Storage` section.
    -   Create a new **public** bucket named `recipes`. This is where recipe images will be stored.

5.  **Run the development server:**
    ```sh
    npm run dev
    ```
    The application should now be running on `http://localhost:5173` (or another port if 5173 is busy).

## 📄 License

This project is licensed under the MIT License. You are free to use, modify, and distribute it as you see fit.

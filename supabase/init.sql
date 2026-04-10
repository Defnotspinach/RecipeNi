-- Run this in Supabase SQL Editor for your RecipeNi project.
-- Creates the tables used by the app: profiles, recipes, and favorites.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  "fullName" text not null,
  "avatarUrl" text,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, "fullName", "avatarUrl")
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    null
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
after insert on auth.users
for each row execute function public.handle_new_user_profile();

create table if not exists public.recipes (
  id text primary key,
  title text not null,
  description text not null,
  category text not null,
  "prepTime" integer not null,
  "cookTime" integer not null,
  servings integer not null,
  difficulty text not null check (difficulty in ('Easy', 'Medium', 'Hard')),
  ingredients text[] not null,
  steps text[] not null,
  "imageUrl" text not null,
  notes text,
  "isPublic" boolean not null default true,
  "authorId" text not null,
  "authorName" text not null,
  "favoriteCount" integer not null default 0,
  "createdAt" timestamptz not null default now()
);

create table if not exists public.favorites (
  "userId" uuid not null references auth.users(id) on delete cascade,
  "recipeId" text not null references public.recipes(id) on delete cascade,
  "createdAt" timestamptz not null default now(),
  primary key ("userId", "recipeId")
);

alter table public.profiles enable row level security;
alter table public.recipes enable row level security;
alter table public.favorites enable row level security;

-- Profiles are user-scoped.
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Public read access for recipes (anonymous and authenticated users).
drop policy if exists "recipes_select_public" on public.recipes;
create policy "recipes_select_public"
  on public.recipes
  for select
  to anon, authenticated
  using (true);

-- Allow recipe inserts for authenticated owners.
-- Also allow anon/auth insertion of seed records with authorId = 'admin'.
drop policy if exists "recipes_insert_public" on public.recipes;
drop policy if exists "recipes_insert_owner_or_seed" on public.recipes;
create policy "recipes_insert_owner_or_seed"
  on public.recipes
  for insert
  to anon, authenticated
  with check (
    "authorId" = 'admin'
    or auth.uid()::text = "authorId"
  );

drop policy if exists "recipes_update_public" on public.recipes;
drop policy if exists "recipes_update_owner" on public.recipes;
create policy "recipes_update_owner"
  on public.recipes
  for update
  to authenticated
  using (auth.uid()::text = "authorId")
  with check (auth.uid()::text = "authorId");

-- Favorites are user-scoped.
drop policy if exists "favorites_select_own" on public.favorites;
create policy "favorites_select_own"
  on public.favorites
  for select
  to authenticated
  using (auth.uid() = "userId");

drop policy if exists "favorites_insert_own" on public.favorites;
create policy "favorites_insert_own"
  on public.favorites
  for insert
  to authenticated
  with check (auth.uid() = "userId");

drop policy if exists "favorites_delete_own" on public.favorites;
create policy "favorites_delete_own"
  on public.favorites
  for delete
  to authenticated
  using (auth.uid() = "userId");

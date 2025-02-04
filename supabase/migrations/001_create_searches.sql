-- Create searches table
create table if not exists public.searches (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) not null,
  urls text[] not null,
  results jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (Row Level Security)
alter table searches enable row level security;

-- Create policy to allow users to see only their searches
create policy "Users can view their own searches"
  on searches for select
  using (auth.uid() = user_id);

-- Create policy to allow users to insert their own searches
create policy "Users can insert their own searches"
  on searches for insert
  with check (auth.uid() = user_id); 
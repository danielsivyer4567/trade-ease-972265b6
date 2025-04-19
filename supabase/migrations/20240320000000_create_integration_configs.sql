-- Create the integration_configs table
create table if not exists public.integration_configs (
  id uuid default uuid_generate_v4() primary key,
  integration_name text not null,
  api_key text,
  client_id text,
  status text default 'connected',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.integration_configs enable row level security;

-- Create policies
create policy "Users can view their own organization's integration configs"
  on public.integration_configs
  for select
  using (auth.uid() is not null);

create policy "Users can insert integration configs"
  on public.integration_configs
  for insert
  with check (auth.uid() is not null);

create policy "Users can update their own organization's integration configs"
  on public.integration_configs
  for update
  using (auth.uid() is not null);

-- Grant access to authenticated users
grant all on public.integration_configs to authenticated;
grant all on public.integration_configs to service_role; 
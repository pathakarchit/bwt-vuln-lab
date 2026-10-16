-- BuildWithThis vuln-lab v1. Planted issues are marked V1-V10, decoys D1-D4. Fake data only.

-- V1: notes table, RLS never enabled
create table public.notes (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  text text not null,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.notes to anon, authenticated;

-- V2: profiles with RLS on but "any logged-in user" policies
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  phone text,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "Authenticated users can view profiles" on public.profiles for select to authenticated using (true);
create policy "Authenticated users can update profiles" on public.profiles for update to authenticated using (true);
create policy "Users can insert their profile" on public.profiles for insert to authenticated with check (auth.uid() = id);

create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email);
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- D2: todos with a correct owner-only policy
create table public.todos (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null
);
alter table public.todos enable row level security;
create policy "Owners manage their todos" on public.todos for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- V7: view exposing auth.users emails (runs as owner, so it bypasses RLS)
create view public.user_emails as select id, email, created_at, last_sign_in_at from auth.users;
grant select on public.user_emails to anon, authenticated;

-- V5: public bucket anyone can list and upload to
insert into storage.buckets (id, name, public) values ('uploads', 'uploads', true);
create policy "Anyone can read uploads" on storage.objects for select to anon, authenticated using (bucket_id = 'uploads');
create policy "Anyone can upload" on storage.objects for insert to anon, authenticated with check (bucket_id = 'uploads');

-- D4: public-read bucket for a logo, no list/insert policies
insert into storage.buckets (id, name, public) values ('public-assets', 'public-assets', true);

-- Fake seed rows (no real data)
insert into public.notes (text) values ('Welcome to the lab (fake data)'), ('Second fake note');

-- V10 (amended, see test script): SECURITY DEFINER function that skips RLS, no ownership check,
-- mutable search_path, executable by anon
create function public.delete_note(note_id bigint) returns void
language plpgsql security definer as $$
begin
  delete from public.notes where id = note_id;
  delete from public.todos where id = note_id;
end; $$;
grant execute on function public.delete_note(bigint) to anon, authenticated;

-- Canonical fix set for vuln-lab-v1-fixed (test script section 7)
-- V1
alter table public.notes enable row level security;
create policy "Owners read notes" on public.notes for select to authenticated using ((select auth.uid()) = user_id);
create policy "Owners insert notes" on public.notes for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Owners delete notes" on public.notes for delete to authenticated using ((select auth.uid()) = user_id);
revoke all on public.notes from anon;
-- V2
drop policy "Authenticated users can view profiles" on public.profiles;
drop policy "Authenticated users can update profiles" on public.profiles;
create policy "Users view own profile" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "Users update own profile" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
-- V7
drop view public.user_emails;
-- V5
update storage.buckets set public = false where id = 'uploads';
drop policy "Anyone can read uploads" on storage.objects;
drop policy "Anyone can upload" on storage.objects;
create policy "Owners read own uploads" on storage.objects for select to authenticated using (bucket_id = 'uploads' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "Owners upload to own folder" on storage.objects for insert to authenticated with check (bucket_id = 'uploads' and (storage.foldername(name))[1] = (select auth.uid())::text);
-- V10
create or replace function public.delete_note(note_id bigint) returns void
language plpgsql security invoker set search_path = '' as $$
begin
  delete from public.notes where id = note_id and user_id = (select auth.uid());
  delete from public.todos where id = note_id and user_id = (select auth.uid());
end; $$;
revoke execute on function public.delete_note(bigint) from anon, public;

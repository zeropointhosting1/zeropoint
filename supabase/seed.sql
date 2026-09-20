-- Optional starter data. Safe to skip or edit before first run.
-- Applied automatically by `supabase db reset` / the db-init container on first boot.

insert into public.racks (name, size_u, location)
values ('Lab Rack', 10, 'Network Closet')
on conflict do nothing;

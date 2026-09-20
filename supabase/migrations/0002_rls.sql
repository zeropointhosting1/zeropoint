-- ZeroPoint Lab Docs — row level security
-- Read: public (this is a published homelab-documentation site — anyone can
-- view it, signed in or not). Write: admin or editor only. Role changes:
-- admin only (enforced by the prevent_role_self_escalation trigger in 0001).
-- profiles itself stays authenticated-only read, so visitor emails aren't
-- exposed publicly.

create or replace function public.is_editor()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'editor')
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- profiles ------------------------------------------------------------

alter table public.profiles enable row level security;

create policy profiles_select on public.profiles
  for select to authenticated using (true);

create policy profiles_update_own_or_admin on public.profiles
  for update to authenticated
  using (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());

-- Generic read/write policy for the rest of the schema -----------------
-- (select: any authenticated user; insert/update/delete: editor or admin)

do $$
declare
  t text;
  tables text[] := array[
    'networks', 'devices', 'device_interfaces', 'virtual_machines',
    'services', 'service_dependencies', 'ip_addresses', 'connections',
    'racks', 'rack_items', 'runbooks', 'changes', 'notes', 'tags',
    'topology_nodes'
  ];
begin
  foreach t in array tables loop
    execute format('alter table public.%I enable row level security;', t);

    execute format(
      'create policy %I on public.%I for select to anon, authenticated using (true);',
      t || '_select', t
    );

    execute format(
      'create policy %I on public.%I for insert to authenticated with check (public.is_editor());',
      t || '_insert', t
    );

    execute format(
      'create policy %I on public.%I for update to authenticated using (public.is_editor()) with check (public.is_editor());',
      t || '_update', t
    );

    execute format(
      'create policy %I on public.%I for delete to authenticated using (public.is_editor());',
      t || '_delete', t
    );
  end loop;
end $$;

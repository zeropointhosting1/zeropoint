-- ZeroPoint Lab Docs — initial schema
-- Extensions, enums, tables, indexes, and updated_at triggers.
-- RLS policies live in 0002_rls.sql.

create extension if not exists "pgcrypto";

-- ==================================================
-- ENUMS
-- ==================================================

create type user_role as enum ('admin', 'editor', 'viewer');

create type device_type as enum (
  'router', 'firewall', 'switch', 'access_point', 'server',
  'hypervisor', 'desktop', 'laptop', 'iot', 'other'
);

create type device_status as enum ('active', 'inactive', 'retired', 'planned');

create type vm_lifecycle_status as enum (
  'production', 'testing', 'lab', 'stopped', 'retired'
);

create type ip_type as enum (
  'static', 'dhcp_reservation', 'dynamic', 'gateway', 'infrastructure'
);

create type connection_type as enum ('ethernet', 'fiber', 'wifi', 'other');

create type vlan_behavior as enum (
  'access', 'trunk', 'wan', 'management', 'storage', 'other'
);

create type runbook_category as enum (
  'networking', 'proxmox', 'linux', 'windows', 'unifi',
  'security', 'applications', 'hardware'
);

create type change_category as enum (
  'network', 'hardware', 'virtualization', 'service', 'security', 'maintenance'
);

create type change_result as enum ('success', 'partial', 'failed');

create type topology_view as enum ('physical', 'logical');

-- ==================================================
-- updated_at helper
-- ==================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ==================================================
-- PROFILES
-- ==================================================

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  role user_role not null default 'viewer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- First user to sign in becomes admin automatically; everyone after is viewer
-- until an admin promotes them (single-admin V1 deployment model).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (
    new.id,
    new.email,
    (case when exists (select 1 from public.profiles) then 'viewer' else 'admin' end)::user_role
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.prevent_role_self_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role <> old.role and auth.uid() = old.id then
    if not exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') then
      new.role = old.role;
    end if;
  end if;
  return new;
end;
$$;

create trigger profiles_prevent_self_escalation
  before update on public.profiles
  for each row execute function public.prevent_role_self_escalation();

-- ==================================================
-- NETWORKS (VLANs / subnets)
-- ==================================================

create table public.networks (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  vlan_id integer,
  subnet cidr,
  gateway inet,
  dhcp_range_start inet,
  dhcp_range_end inet,
  dns text[] not null default '{}',
  ssid text,
  purpose text,
  firewall_notes text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index networks_vlan_id_key on public.networks (vlan_id) where vlan_id is not null;

create trigger networks_set_updated_at
  before update on public.networks
  for each row execute function public.set_updated_at();

-- ==================================================
-- DEVICES
-- ==================================================

create table public.devices (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type device_type not null default 'other',
  manufacturer text,
  model text,
  serial_number text,
  role text,
  location text,
  management_ip inet,
  mac_address macaddr,
  network_id uuid references public.networks (id) on delete set null,
  cpu text,
  ram text,
  storage text,
  nic_info text,
  hypervisor_type text,
  status device_status not null default 'active',
  notes text,
  custom_fields jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index devices_network_id_idx on public.devices (network_id);
create index devices_type_idx on public.devices (type);
create index devices_status_idx on public.devices (status);

create trigger devices_set_updated_at
  before update on public.devices
  for each row execute function public.set_updated_at();

-- ==================================================
-- DEVICE INTERFACES
-- ==================================================

create table public.device_interfaces (
  id uuid primary key default gen_random_uuid(),
  device_id uuid not null references public.devices (id) on delete cascade,
  name text not null,
  mac_address macaddr,
  ip_address inet,
  network_id uuid references public.networks (id) on delete set null,
  type text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index device_interfaces_device_id_idx on public.device_interfaces (device_id);
create index device_interfaces_network_id_idx on public.device_interfaces (network_id);

create trigger device_interfaces_set_updated_at
  before update on public.device_interfaces
  for each row execute function public.set_updated_at();

-- ==================================================
-- VIRTUAL MACHINES
-- ==================================================

create table public.virtual_machines (
  id uuid primary key default gen_random_uuid(),
  vmid integer,
  name text not null,
  host_device_id uuid references public.devices (id) on delete set null,
  os text,
  ip_address inet,
  network_id uuid references public.networks (id) on delete set null,
  cpu_cores integer,
  ram_mb integer,
  storage_gb integer,
  purpose text,
  lifecycle_status vm_lifecycle_status not null default 'lab',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index virtual_machines_host_device_id_idx on public.virtual_machines (host_device_id);
create index virtual_machines_network_id_idx on public.virtual_machines (network_id);
create index virtual_machines_lifecycle_status_idx on public.virtual_machines (lifecycle_status);

create trigger virtual_machines_set_updated_at
  before update on public.virtual_machines
  for each row execute function public.set_updated_at();

-- ==================================================
-- SERVICES
-- ==================================================

create table public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  host_device_id uuid references public.devices (id) on delete set null,
  host_vm_id uuid references public.virtual_machines (id) on delete set null,
  ip_hostname text,
  port integer,
  protocol text,
  url_path text,
  purpose text,
  backup_method text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint services_single_host check (host_device_id is null or host_vm_id is null)
);

create index services_host_device_id_idx on public.services (host_device_id);
create index services_host_vm_id_idx on public.services (host_vm_id);

create trigger services_set_updated_at
  before update on public.services
  for each row execute function public.set_updated_at();

create table public.service_dependencies (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services (id) on delete cascade,
  depends_on_service_id uuid not null references public.services (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint service_dependencies_no_self_ref check (service_id <> depends_on_service_id),
  constraint service_dependencies_unique unique (service_id, depends_on_service_id)
);

create index service_dependencies_service_id_idx on public.service_dependencies (service_id);
create index service_dependencies_depends_on_idx on public.service_dependencies (depends_on_service_id);

-- ==================================================
-- IP ADDRESSES (IPAM)
-- ==================================================

create table public.ip_addresses (
  id uuid primary key default gen_random_uuid(),
  ip_address inet not null,
  hostname text,
  network_id uuid references public.networks (id) on delete cascade,
  device_id uuid references public.devices (id) on delete set null,
  vm_id uuid references public.virtual_machines (id) on delete set null,
  type ip_type not null default 'static',
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ip_addresses_unique_ip unique (ip_address)
);

create index ip_addresses_network_id_idx on public.ip_addresses (network_id);
create index ip_addresses_device_id_idx on public.ip_addresses (device_id);
create index ip_addresses_vm_id_idx on public.ip_addresses (vm_id);

create trigger ip_addresses_set_updated_at
  before update on public.ip_addresses
  for each row execute function public.set_updated_at();

-- ==================================================
-- CONNECTIONS (physical topology)
-- ==================================================

create table public.connections (
  id uuid primary key default gen_random_uuid(),
  source_device_id uuid not null references public.devices (id) on delete cascade,
  source_interface text,
  destination_device_id uuid not null references public.devices (id) on delete cascade,
  destination_interface text,
  connection_type connection_type not null default 'ethernet',
  speed text,
  vlan_behavior vlan_behavior not null default 'access',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index connections_source_device_id_idx on public.connections (source_device_id);
create index connections_destination_device_id_idx on public.connections (destination_device_id);

create trigger connections_set_updated_at
  before update on public.connections
  for each row execute function public.set_updated_at();

-- ==================================================
-- RACKS
-- ==================================================

create table public.racks (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  size_u integer not null default 10,
  location text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger racks_set_updated_at
  before update on public.racks
  for each row execute function public.set_updated_at();

create table public.rack_items (
  id uuid primary key default gen_random_uuid(),
  rack_id uuid not null references public.racks (id) on delete cascade,
  device_id uuid references public.devices (id) on delete set null,
  label text,
  start_unit integer not null,
  height_u integer not null default 1,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint rack_items_has_name check (device_id is not null or label is not null)
);

create index rack_items_rack_id_idx on public.rack_items (rack_id);
create index rack_items_device_id_idx on public.rack_items (device_id);

create trigger rack_items_set_updated_at
  before update on public.rack_items
  for each row execute function public.set_updated_at();

-- ==================================================
-- RUNBOOKS
-- ==================================================

create table public.runbooks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category runbook_category not null default 'applications',
  symptoms text,
  cause text,
  prerequisites text,
  resolution_steps text,
  commands text,
  verification text,
  rollback text,
  notes text,
  related_device_ids uuid[] not null default '{}',
  related_service_ids uuid[] not null default '{}',
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index runbooks_category_idx on public.runbooks (category);

create trigger runbooks_set_updated_at
  before update on public.runbooks
  for each row execute function public.set_updated_at();

-- ==================================================
-- CHANGE LOG
-- ==================================================

create table public.changes (
  id uuid primary key default gen_random_uuid(),
  occurred_at timestamptz not null default now(),
  title text not null,
  category change_category not null default 'maintenance',
  description text,
  reason text,
  result change_result not null default 'success',
  rollback_info text,
  notes text,
  affected_device_ids uuid[] not null default '{}',
  affected_service_ids uuid[] not null default '{}',
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index changes_occurred_at_idx on public.changes (occurred_at desc);
create index changes_category_idx on public.changes (category);

create trigger changes_set_updated_at
  before update on public.changes
  for each row execute function public.set_updated_at();

-- ==================================================
-- NOTES + TAGS
-- ==================================================

create table public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create table public.notes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  folder text,
  content text,
  tags text[] not null default '{}',
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index notes_folder_idx on public.notes (folder);
create index notes_tags_idx on public.notes using gin (tags);

create trigger notes_set_updated_at
  before update on public.notes
  for each row execute function public.set_updated_at();

-- ==================================================
-- TOPOLOGY NODE POSITIONS (physical + logical diagrams)
-- ==================================================

create table public.topology_nodes (
  id uuid primary key default gen_random_uuid(),
  view topology_view not null,
  node_type text not null,
  node_id uuid not null,
  x double precision not null default 0,
  y double precision not null default 0,
  updated_at timestamptz not null default now(),
  constraint topology_nodes_unique unique (view, node_type, node_id)
);

create trigger topology_nodes_set_updated_at
  before update on public.topology_nodes
  for each row execute function public.set_updated_at();

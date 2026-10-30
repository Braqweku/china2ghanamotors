-- Orders submitted via the Source and Fleet forms, and their tracking history.
-- Only the server (service role / secret key) reads and writes these tables;
-- RLS is enabled with no policies, so there is no public access.

create table public.orders (
  reference text primary key,
  source text not null check (source in ('sourcing', 'fleet')),
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  summary text not null,
  current_stage text not null default 'received' check (current_stage in (
    'received', 'sourcing', 'selected', 'verification', 'inspection', 'purchased',
    'ready_to_ship', 'in_transit', 'arrived_ghana', 'clearing', 'ready_for_delivery', 'delivered'
  )),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tracking_events (
  id bigint generated always as identity primary key,
  reference text not null references public.orders (reference) on delete cascade,
  stage text not null check (stage in (
    'received', 'sourcing', 'selected', 'verification', 'inspection', 'purchased',
    'ready_to_ship', 'in_transit', 'arrived_ghana', 'clearing', 'ready_for_delivery', 'delivered'
  )),
  note text,
  created_at timestamptz not null default now()
);

create index tracking_events_reference_created_at_idx
  on public.tracking_events (reference, created_at);

alter table public.orders enable row level security;
alter table public.tracking_events enable row level security;

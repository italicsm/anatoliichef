-- Anatolii Lukianchuk — database schema
-- Run in the Supabase SQL editor, then seed.sql.
--
-- The model mirrors app/lib/types.ts. Its one governing rule: a dish carries
-- no price and no menu membership. Both live on `placements`, so the same dish
-- can appear in Фуршет and Банкет at different prices without ever being
-- duplicated. See docs/DECISIONS.md.

-- ---------------------------------------------------------------- menu types

create table if not exists menu_types (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title jsonb not null,
  description jsonb not null default '{}'::jsonb,
  photo text,
  position integer not null default 0
);

-- ----------------------------------------------------------------- categories

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  menu_type_id uuid not null references menu_types (id) on delete cascade,
  slug text not null,
  title jsonb not null,
  position integer not null default 0,
  unique (menu_type_id, slug)
);

create index if not exists categories_menu_type_idx
  on categories (menu_type_id, position);

-- --------------------------------------------------------------------- dishes

create table if not exists dishes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title jsonb not null,
  description jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Several photos per dish is a CMS requirement, so it is a table and not a
-- column — a column would have meant a migration later.
create table if not exists dish_photos (
  id uuid primary key default gen_random_uuid(),
  dish_id uuid not null references dishes (id) on delete cascade,
  url text not null,
  alt jsonb not null default '{}'::jsonb,
  position integer not null default 0,
  unique (dish_id, url)
);

-- ----------------------------------------------------------------- placements

-- price is integer cents: floats drift once a cart starts summing them.
create table if not exists placements (
  id uuid primary key default gen_random_uuid(),
  dish_id uuid not null references dishes (id) on delete cascade,
  category_id uuid not null references categories (id) on delete cascade,
  price integer not null check (price >= 0),
  portion text,
  position integer not null default 0,
  unique (dish_id, category_id)
);

create index if not exists placements_category_idx
  on placements (category_id, position);

-- --------------------------------------------------------------------- orders

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  number text not null unique,
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  event_date text,
  guests text,
  comment text,
  total integer not null check (total >= 0)
);

-- Order lines are deliberately denormalised: an order is a historical record
-- of what was agreed. If it read prices and titles through placements, then
-- editing the menu would silently rewrite past orders.
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders (id) on delete cascade,
  placement_id uuid references placements (id) on delete set null,
  menu_slug text not null,
  category_title text not null,
  dish_title text not null,
  portion text,
  price integer not null check (price >= 0),
  quantity integer not null check (quantity > 0)
);

create index if not exists order_items_order_idx on order_items (order_id);

-- ------------------------------------------------------------ row level security

alter table menu_types enable row level security;
alter table categories enable row level security;
alter table dishes enable row level security;
alter table dish_photos enable row level security;
alter table placements enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- The menu is public and read-only for anonymous visitors.
drop policy if exists "menu_types are readable" on menu_types;
create policy "menu_types are readable" on menu_types for select using (true);

drop policy if exists "categories are readable" on categories;
create policy "categories are readable" on categories for select using (true);

drop policy if exists "dishes are readable" on dishes;
create policy "dishes are readable" on dishes for select using (true);

drop policy if exists "dish_photos are readable" on dish_photos;
create policy "dish_photos are readable" on dish_photos for select using (true);

drop policy if exists "placements are readable" on placements;
create policy "placements are readable" on placements for select using (true);

-- No policies on orders and order_items on purpose. With row level security on
-- and no policy, the anon key can neither read nor write them: orders are
-- created and listed only through the server, using the service role key.
-- Writes to the menu tables are equally server-only for the same reason.

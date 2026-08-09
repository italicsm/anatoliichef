-- Migration 002: order workflow, category covers, image storage.
-- Additive only: no column is dropped or renamed, so it is safe to re-run.

-- ------------------------------------------------------------- order status

alter table orders
  add column if not exists status text not null default 'new';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'orders_status_check'
  ) then
    alter table orders
      add constraint orders_status_check
      check (status in ('new', 'confirmed', 'done', 'cancelled'));
  end if;
end $$;

create index if not exists orders_created_idx on orders (created_at desc);

-- ---------------------------------------------------------- category covers

alter table categories
  add column if not exists photo text;

-- ------------------------------------------------------------------ storage

-- Public bucket: the menu is public anyway, and public URLs let next/image
-- optimise them without signing every request.
insert into storage.buckets (id, name, public)
values ('menu', 'menu', true)
on conflict (id) do update set public = true;

drop policy if exists "menu images are readable" on storage.objects;
create policy "menu images are readable"
  on storage.objects for select
  using (bucket_id = 'menu');

-- No insert, update or delete policies on purpose: uploads go through the
-- service role key from server actions, exactly like every other write.

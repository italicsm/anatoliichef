-- A guest who has not chosen dishes yet still needs a way to ask for a dinner.
--
-- That request carries exactly the fields an order already carries — name,
-- phone, date, guests, comment — and differs only in having no items and no
-- total. A second table would have duplicated the columns, the numbering, the
-- notification path and the admin screen, and would have split the chef's
-- inbox in two. One column tells them apart instead.

alter table orders
  add column if not exists kind text not null default 'order';

alter table orders
  drop constraint if exists orders_kind_check;

alter table orders
  add constraint orders_kind_check check (kind in ('order', 'booking'));

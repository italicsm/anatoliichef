-- Migration 003: editable page content.
--
-- One row per block, shape defined by the key. A table per section would mean
-- a migration every time a block becomes editable; this way it is a new key
-- and a new form.

create table if not exists site_content (
  key text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table site_content enable row level security;

drop policy if exists "site content is readable" on site_content;
create policy "site content is readable"
  on site_content for select using (true);

-- Writes stay server-only, like every other table.

insert into site_content (key, data) values
  ('about', '{
     "heading": {"en": "Meet Anatolii", "uk": "Знайомтесь: Анатолій"},
     "body": {"en": "I am Anatolii Lukianchuk, a private chef based in Barcelona.\n\nFor many years I have been creating dining experiences where every detail matters — from carefully selected ingredients to elegant presentation and warm hospitality.\n\nI work with private dinners, buffet catering, family celebrations and corporate events, composing a unique menu for every client.\n\nMy philosophy is simple: outstanding food, honest products and unforgettable moments around one table."},
     "specialities": {"en": "Private Dining\nBuffet Catering\nCorporate Events\nFamily Celebrations\nChef at Home"},
     "quote": {"en": "The best memories begin around one table."},
     "photo": "/photo/tolic/tolic3.jpg"
   }'::jsonb),
  ('contact', '{
     "heading": {"en": "Let’s create something memorable together."},
     "body": {"en": "Whether you’re planning an intimate dinner, a buffet or a corporate event, I would be delighted to create a unique culinary experience for you."},
     "availability": {"en": "Available in Barcelona and surrounding areas."},
     "phone": "+34 600 000 000",
     "email": "hello@anatoliilukianchuk.com",
     "location": {"en": "Barcelona, Spain"},
     "telegram": "https://t.me/anatoliichef",
     "whatsapp": "https://wa.me/34600000000",
     "instagram": "https://instagram.com/anatoliichef",
     "facebook": "https://facebook.com/anatoliichef"
   }'::jsonb)
on conflict (key) do nothing;

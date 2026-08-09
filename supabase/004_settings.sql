-- Migration 004: server-side settings.
--
-- Holds secrets that the owner must be able to rotate without a deploy — the
-- translation API key today, anything similar later.
--
-- Row level security is on and there is deliberately NO policy: with RLS
-- enabled and no policy, the publishable key can neither read nor write this
-- table. Only the service role, used inside server actions, can touch it.

create table if not exists app_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

alter table app_settings enable row level security;

-- Intentionally empty: no policies at all.

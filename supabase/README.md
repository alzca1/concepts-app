# Supabase setup

Database schema and configuration for the managed backend.

## One-time setup

1. Create the project in [supabase.com/dashboard](https://supabase.com/dashboard)
   (Free tier is enough for a family-scale use case).
2. Open **SQL Editor → New query**, paste the contents of `schema.sql`
   and click **Run**.
3. In **Settings → API** copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`
4. Create `.env.local` at the repo root with those two variables.
5. In **Authentication → Providers → Email**, confirm:
   - Email provider: enabled
   - Confirm email: on (recommended)
   - Secure password: on

## What `schema.sql` creates

- `public.concepts` table with `user_id` FK to `auth.users`, automatic
  `updated_at` trigger, and indexes on `user_id` and `tag`.
- Row-Level Security policy so every read/write is filtered by
  `auth.uid()` — the only access path is the user's own session.

## Re-running the script

`schema.sql` is **idempotent for objects** (`create … if not exists`,
`create or replace function`) but the trigger and policy are not.
Re-running on a populated project will fail at those steps; drop
them first or only run this script on a fresh database.

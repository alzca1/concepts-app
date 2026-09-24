/**
 * Shape of a row in the `public.concepts` Postgres table.
 * Mirrors the columns declared in `supabase/schema.sql`.
 */
export interface ConceptRow {
  id: string;
  user_id: string;
  front: string;
  back: string;
  tag: string;
  created_at: string;
  updated_at: string;
}

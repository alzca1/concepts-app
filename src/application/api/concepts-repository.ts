/**
 * Concepts repository: typed wrapper around the Supabase table.
 * Every read/write is scoped to the signed-in user by the row-level
 * security policy in supabase/schema.sql.
 */
import type { Concept, ConceptInput } from "./types";
import { supabase } from "./supabase-client";
import type { ConceptRow } from "./utils/interfaces";

/** Maps a DB row to the domain `Concept` shape used by the UI. */
function fromRow(row: ConceptRow): Concept {
  return {
    id: row.id,
    front: row.front,
    back: row.back,
    tag: row.tag,
    createdAt: Date.parse(row.created_at),
  };
}

/** Lists the current user's cards, newest first. */
export async function listConcepts(): Promise<Concept[]> {
  const { data, error } = await supabase
    .from("concepts")
    .select("id, user_id, front, back, tag, created_at, updated_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(fromRow);
}

/** Creates a card owned by the signed-in user. */
export async function createConcept(input: ConceptInput): Promise<Concept> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { data, error } = await supabase
    .from("concepts")
    .insert({
      user_id: user.id,
      front: input.front,
      back: input.back,
      tag: input.tag,
    })
    .select("id, user_id, front, back, tag, created_at, updated_at")
    .single();
  if (error) throw error;
  return fromRow(data);
}

/** Updates a card owned by the signed-in user. */
export async function updateConcept(
  id: string,
  input: ConceptInput,
): Promise<Concept> {
  const { data, error } = await supabase
    .from("concepts")
    .update({ front: input.front, back: input.back, tag: input.tag })
    .eq("id", id)
    .select("id, user_id, front, back, tag, created_at, updated_at")
    .single();
  if (error) throw error;
  return fromRow(data);
}

/** Deletes a card owned by the signed-in user. */
export async function deleteConcept(id: string): Promise<void> {
  const { error } = await supabase.from("concepts").delete().eq("id", id);
  if (error) throw error;
}

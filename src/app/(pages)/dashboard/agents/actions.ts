"use server";

import { revalidatePath } from "next/cache";

import { hashToken, issueToken } from "@/lib/mcp/tokens";
import { createClient } from "@/lib/supabase/server";

export type TokenState = { error?: string; message?: string; token?: string };

async function officerClient() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  const { data: profile, error: profileError } = await supabase.from("profiles")
    .select("is_officer").eq("id", user.id).single();
  return !profileError && profile?.is_officer ? { supabase, user } : null;
}

export async function createAgentToken(_previous: TokenState, form: FormData): Promise<TokenState> {
  const label = String(form.get("label") ?? "").trim();
  if (!label || label.length > 80) return { error: "Enter a token name of up to 80 characters." };
  try {
    const officer = await officerClient();
    if (!officer) return { error: "Sign in with an officer account to manage agent access." };
    const token = issueToken();
    const { error } = await officer.supabase.from("officer_agent_tokens").insert({
      profile_id: officer.user.id, label, token_hash: hashToken(token),
    });
    if (error) return { error: "Unable to create a token. Check that the calendar MCP database migration has been applied." };
    revalidatePath("/dashboard/agents");
    return { token, message: "Token created. Copy it now; it will not be shown again." };
  } catch {
    return { error: "Unable to reach the membership service. Please try again." };
  }
}

export async function revokeAgentToken(_previous: TokenState, form: FormData): Promise<TokenState> {
  const id = String(form.get("token_id") ?? "");
  if (!/^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/i.test(id)) return { error: "Choose a valid token." };
  try {
    const officer = await officerClient();
    if (!officer) return { error: "Sign in with an officer account to manage agent access." };
    const { data, error } = await officer.supabase.from("officer_agent_tokens")
      .update({ revoked_at: new Date().toISOString() }).eq("id", id)
      .eq("profile_id", officer.user.id).is("revoked_at", null).select("id");
    if (error || !data?.length) return { error: "Unable to revoke this token. Refresh and try again." };
    revalidatePath("/dashboard/agents");
    return { message: "Agent access revoked." };
  } catch {
    return { error: "Unable to reach the membership service. Please try again." };
  }
}

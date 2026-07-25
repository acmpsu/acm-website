"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { COMMITTEES } from "@/lib/constants";

export type ActionState = { error?: string; message?: string };

export async function updateProfile(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  const gradYearRaw = String(formData.get("grad_year") ?? "").trim();
  const gradYear = gradYearRaw ? Number(gradYearRaw) : null;
  if (gradYear !== null && !Number.isInteger(gradYear)) {
    return { error: "Graduation year must be a number" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: String(formData.get("full_name") ?? "").trim() || null,
      major: String(formData.get("major") ?? "").trim() || null,
      grad_year: gradYear,
    })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { message: "Profile saved" };
}

export async function toggleCommittee(formData: FormData) {
  const committeeId = String(formData.get("committee_id") ?? "");
  const isMember = String(formData.get("is_member") ?? "") === "true";

  if (!COMMITTEES.some((committee) => committee.id === committeeId)) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  if (isMember) {
    await supabase
      .from("committee_members")
      .delete()
      .eq("profile_id", user.id)
      .eq("committee_id", committeeId);
  } else {
    await supabase
      .from("committee_members")
      .insert({ profile_id: user.id, committee_id: committeeId });
  }

  revalidatePath("/dashboard");
}

export async function checkIn(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const code = String(formData.get("code") ?? "").trim();
  if (!code) return { error: "Enter the check-in code" };

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("check_in", { code });
  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  const result = String(data);
  return result.startsWith("Checked in") ? { message: result } : { error: result };
}

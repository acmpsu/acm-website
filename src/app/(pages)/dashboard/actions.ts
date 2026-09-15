"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { COMMITTEES } from "@/lib/constants";
import { EVENT_CATEGORIES } from "@/lib/events";
import { easternWallTimeToIso } from "@/lib/eastern";

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

export async function createEvent(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_officer")
    .eq("id", user.id)
    .single();
  if (!profile?.is_officer) return { error: "Only officers can add events" };

  const title = String(formData.get("title") ?? "").trim();
  const date = String(formData.get("date") ?? "").trim();
  const startTime = String(formData.get("start_time") ?? "").trim();
  const endTime = String(formData.get("end_time") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim() || null;
  const categoryRaw = String(formData.get("category") ?? "").trim();
  const committeeId = String(formData.get("committee_id") ?? "").trim();
  const checkinCode = String(formData.get("checkin_code") ?? "").trim();

  if (!title) return { error: "Enter a title" };
  if (!date || !startTime) return { error: "Enter a date and start time" };
  if (!checkinCode) return { error: "Enter a check-in code" };

  const category = EVENT_CATEGORIES.includes(categoryRaw as (typeof EVENT_CATEGORIES)[number])
    ? categoryRaw
    : null;
  const committee =
    COMMITTEES.some((committee) => committee.id === committeeId) ? committeeId : null;

  const startsAt = easternWallTimeToIso(date, startTime);
  const endsAt = endTime ? easternWallTimeToIso(date, endTime) : null;
  if (!startsAt) return { error: "Enter a valid start time" };
  if (endTime && !endsAt) return { error: "Enter a valid end time" };
  if (endsAt && endsAt <= startsAt) return { error: "End time must be after the start time" };

  const { error } = await supabase.from("events").insert({
    title,
    starts_at: startsAt,
    ends_at: endsAt,
    location,
    category,
    committee_id: committee,
    checkin_code: checkinCode,
  });

  if (error) {
    if (error.code === "23505") return { error: "That check-in code is already in use" };
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/events");
  return { message: `Event added. Check-in code: ${checkinCode}` };
}

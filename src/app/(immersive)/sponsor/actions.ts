"use server";

import { z } from "zod";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export type InquiryState = {
  status: "idle" | "sent" | "error";
  error?: string;
  /** Echoed back on error so the form can refill what the visitor typed. */
  values?: { email: string; message: string };
};

// Mirrors the checks on public.sponsor_inquiries (migration 202610290002).
const inquiry = z.object({
  email: z.string().trim().email("Enter a valid email address").max(254, "That email is too long"),
  message: z.string().trim().min(1, "Tell us a little about how you'd like to partner").max(5000, "Keep your message under 5,000 characters"),
});

export async function submitSponsorInquiry(_prev: InquiryState, formData: FormData): Promise<InquiryState> {
  // Hidden from people; bots that fill every field get a quiet success and nothing is stored.
  if (String(formData.get("company_site") ?? "")) return { status: "sent" };

  const values = { email: String(formData.get("email") ?? ""), message: String(formData.get("message") ?? "") };
  const parsed = inquiry.safeParse(values);
  if (!parsed.success) return { status: "error", error: parsed.error.issues[0]?.message, values };

  if (!isSupabaseConfigured) {
    return { status: "error", error: "Inquiries can't be sent right now. Please try again later", values };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("sponsor_inquiries").insert(parsed.data);
  if (error) return { status: "error", error: "Your message couldn't be sent. Please try again", values };

  return { status: "sent" };
}

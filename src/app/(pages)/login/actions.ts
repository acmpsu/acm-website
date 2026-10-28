"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; message?: string };

function readCredentials(formData: FormData) {
  return {
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
    fullName: String(formData.get("full_name") ?? "").trim(),
    next: String(formData.get("next") ?? "/dashboard"),
  };
}

function safeNext(next: string) {
  return next.startsWith("/") ? next : "/dashboard";
}

/**
 * Maps Supabase auth errors to user-facing copy. Invalid credentials are
 * reported specifically; anything else falls back to a generic message so we
 * never leak internal detail.
 */
function toUserError(message: string): string {
  const normalized = message.toLowerCase();
  if (normalized.includes("invalid login credentials")) {
    return "That email and password don't match. Please try again.";
  }
  if (normalized.includes("email not confirmed")) {
    return "Please confirm your email address, then sign in.";
  }
  if (normalized.includes("rate limit") || normalized.includes("too many")) {
    return "Too many attempts. Please wait a moment and try again.";
  }
  return "Something went wrong signing you in. Please try again.";
}

export async function signIn(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const { email, password, next } = readCredentials(formData);
  if (!email || !password) return { error: "Enter your email and password." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: toUserError(error.message) };

  revalidatePath("/", "layout");
  redirect(safeNext(next));
}

export async function signUp(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const { email, password, fullName, next } = readCredentials(formData);
  if (!email || !password) return { error: "Enter your email and password." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName || null } },
  });
  if (error) {
    const normalized = error.message.toLowerCase();
    if (normalized.includes("already registered") || normalized.includes("already been registered")) {
      return { error: "An account with this email already exists. Try signing in instead." };
    }
    return { error: "Something went wrong creating your account. Please try again." };
  }

  // With email confirmation on, Supabase returns a user but no session.
  if (!data.session) {
    return { message: "Check your email to confirm your account, then sign in." };
  }

  revalidatePath("/", "layout");
  redirect(safeNext(next));
}

/** Sends a one-time sign-in code / magic link to the given email. */
export async function sendEmailCode(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const { email } = readCredentials(formData);
  if (!email) return { error: "Enter your email address." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: false },
  });
  if (error) {
    const normalized = error.message.toLowerCase();
    if (normalized.includes("rate limit") || normalized.includes("too many")) {
      return { error: "Too many attempts. Please wait a moment and try again." };
    }
    return { error: "We couldn't send a sign-in code. Please try again." };
  }

  return { message: "Check your email for a sign-in link." };
}

/** Sends a password-reset email to the given address. */
export async function sendPasswordReset(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const { email } = readCredentials(formData);
  if (!email) return { error: "Enter your email address." };

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) {
    const normalized = error.message.toLowerCase();
    if (normalized.includes("rate limit") || normalized.includes("too many")) {
      return { error: "Too many attempts. Please wait a moment and try again." };
    }
    return { error: "We couldn't send a reset email. Please try again." };
  }

  return { message: "If that email has an account, a reset link is on its way." };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

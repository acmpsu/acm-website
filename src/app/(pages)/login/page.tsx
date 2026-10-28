import { isSupabaseConfigured } from "@/lib/supabase/env";

import { AuthMeadow } from "./AuthMeadow";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Sign in — Penn State ACM" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const safeNext = next && next.startsWith("/") ? next : "/dashboard";

  return (
    // Break out of the constrained <main> container for a full-bleed backdrop.
    <div className="relative left-1/2 right-1/2 -mx-[50vw] -my-12 w-screen min-h-[calc(100vh-60px)] overflow-hidden bg-[#9fb98a]">
      <AuthMeadow />

      <div className="relative z-10 flex min-h-[calc(100vh-60px)] items-center justify-center px-4 py-12 sm:py-16">
        {isSupabaseConfigured ? (
          <LoginForm next={safeNext} />
        ) : (
          <div className="font-[family-name:var(--font-red-hat)] w-full max-w-[420px] rounded-2xl border border-white/60 bg-[var(--auth-card)] p-6 shadow-[0px_12px_46px_0px_rgba(10,28,41,0.1)]">
            <p className="text-[14px] font-semibold text-[var(--azure-12)]">Login is not configured yet</p>
            <p className="mt-2 text-[13px] leading-[1.6] text-[var(--auth-muted)]">
              Add <code className="font-mono">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
              <code className="font-mono">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> to{" "}
              <code className="font-mono">.env.local</code>, then run{" "}
              <code className="font-mono">supabase/schema.sql</code> in the Supabase SQL editor.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

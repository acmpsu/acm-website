import { isSupabaseConfigured } from "@/lib/supabase/env";

import { LoginForm } from "./LoginForm";

export const metadata = { title: "Login — Penn State ACM" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const configured = isSupabaseConfigured;

  return (
    <div className="flex flex-col items-center py-8">
      <div className="w-full max-w-[420px]">
        <h1 className="mb-3 text-[clamp(28px,3vw,42px)] font-extrabold leading-[1.1] tracking-[-0.03em] text-[var(--navy-dk)]">
          Member login
        </h1>
        <p className="mb-8 text-[15px] leading-[1.75] text-[var(--slate)]">
          Sign in to track your committees and event attendance. Any email address works
        </p>
      </div>

      {configured ? (
        <LoginForm next={next && next.startsWith("/") ? next : "/dashboard"} />
      ) : (
        <div className="w-full max-w-[420px] rounded border border-[var(--border)] bg-[var(--bg-alt)] p-6">
          <p className="text-[13px] font-semibold text-[var(--navy-dk)]">Login is not configured yet</p>
          <p className="mt-2 text-[13px] leading-[1.6] text-[var(--slate)]">
            Add <code className="font-mono">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code className="font-mono">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> to{" "}
            <code className="font-mono">.env.local</code>, then run{" "}
            <code className="font-mono">supabase/schema.sql</code> in the Supabase SQL editor
          </p>
        </div>
      )}
    </div>
  );
}

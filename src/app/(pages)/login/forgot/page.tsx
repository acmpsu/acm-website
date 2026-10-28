import { isSupabaseConfigured } from "@/lib/supabase/env";

import { AuthMeadow } from "../AuthMeadow";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export const metadata = { title: "Reset password — Penn State ACM" };

export default function ForgotPasswordPage() {
  return (
    <div className="relative left-1/2 right-1/2 -mx-[50vw] -my-12 w-screen min-h-[calc(100vh-60px)] overflow-hidden bg-[#9fb98a]">
      <AuthMeadow />

      <div className="relative z-10 flex min-h-[calc(100vh-60px)] items-center justify-center px-4 py-12 sm:py-16">
        {isSupabaseConfigured ? (
          <ForgotPasswordForm />
        ) : (
          <div className="font-[family-name:var(--font-red-hat)] w-full max-w-[420px] rounded-2xl border border-white/60 bg-[var(--auth-card)] p-6 shadow-[0px_12px_46px_0px_rgba(10,28,41,0.1)]">
            <p className="text-[14px] font-semibold text-[var(--azure-12)]">Login is not configured yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

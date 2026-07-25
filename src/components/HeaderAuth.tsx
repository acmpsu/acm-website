import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { AccountMenu } from "@/components/ui/account-menu";

const buttonClass =
  "rounded-md bg-[var(--navy)] px-[18px] py-[7px] text-[13px] font-semibold text-white transition hover:bg-[var(--navy-dk)]";

/** Renders Login, or the member's dashboard link plus sign-out, depending on session. */
export async function HeaderAuth() {
  if (!isSupabaseConfigured) {
    return (
      <Link href="/login" className={buttonClass}>
        Login
      </Link>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <Link href="/login" className={buttonClass}>
        Login
      </Link>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  return <AccountMenu email={user.email ?? ""} fullName={profile?.full_name ?? null} />;
}

import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { AccountMenu } from "@/components/ui/account-menu";

// Figma utility-nav pill: deep navy fill, Red Hat Display, pill radius.
const buttonClass =
  "inline-flex h-11 items-center justify-center rounded-[var(--radius-pill)] bg-[var(--azure-12)] px-6 text-[15px] font-medium font-[family-name:var(--font-red-hat)] text-white transition-[background,box-shadow] duration-[var(--dur-base)] ease-[var(--ease-out)] hover:bg-[var(--azure-16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--azure-36)] focus-visible:ring-offset-2";

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

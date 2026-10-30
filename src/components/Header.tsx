import { SiteNav, type NavAccount } from "@/components/site/SiteNav";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

async function currentAccount(): Promise<NavAccount | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();
  return { email: user.email ?? "", fullName: profile?.full_name ?? null };
}

/** Floating site navigation (Figma "Sticky Site Navigation", 483:162), shared by every page. */
export async function Header() {
  return <SiteNav account={await currentAccount()} />;
}

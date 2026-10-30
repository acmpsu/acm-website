import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { AgentTokenPanel, type AgentToken } from "./AgentTokenPanel";

export const metadata = { title: "Calendar agent access — Penn State ACM" };
export const dynamic = "force-dynamic";

export default async function AgentAccessPage() {
  if (!isSupabaseConfigured) redirect("/login?next=/dashboard/agents");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard/agents");
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_officer")
    .eq("id", user.id)
    .single();
  if (!profile?.is_officer)
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Officer access required</h1>
        <p>Only officers can connect an agent to publish calendar events.</p>
        <Link href="/dashboard" className="underline">
          Return to membership
        </Link>
      </div>
    );
  const { data, error } = await supabase
    .from("officer_agent_tokens")
    .select("id, label, created_at, expires_at, revoked_at")
    .eq("profile_id", user.id)
    .order("created_at", { ascending: false })
    .returns<AgentToken[]>();

  return (
    <div className="space-y-12 text-[var(--navy-dk)]">
      <header className="space-y-4">
        <Link href="/dashboard" className="text-sm underline">
          Return to membership
        </Link>
        <h1 className="text-3xl font-bold md:text-4xl">
          Connect your calendar assistant
        </h1>
        <p className="max-w-prose text-base leading-relaxed text-[var(--slate)]">
          Let your agent publish ACM events using your officer access. Review
          the details with your assistant before it posts to the public
          calendar.
        </p>
      </header>
      <section className="space-y-6" aria-labelledby="connect-heading">
        <h2 id="connect-heading" className="text-2xl font-semibold">
          Manage agent access
        </h2>
        {error ? (
          <p role="alert">
            Agent access is unavailable. Ask a site administrator to apply the
            calendar MCP migration, then refresh this page.
          </p>
        ) : (
          <AgentTokenPanel tokens={data ?? []} />
        )}
      </section>
      <section
        className="max-w-prose space-y-4"
        aria-labelledby="setup-heading"
      >
        <h2 id="setup-heading" className="text-2xl font-semibold">
          Connect an agent
        </h2>
        <ol className="list-decimal space-y-4 pl-6 leading-relaxed">
          <li>
            Create a token and save it in your agent’s private credential
            settings.
          </li>
          <li>
            Add this website’s{" "}
            <code className="break-all font-mono text-sm">/api/mcp</code> URL as
            a Streamable HTTP MCP server, using your token for Bearer
            authentication.
          </li>
          <li>
            Ask your assistant to list event options, check the calendar, and
            create an event. Include the date, Eastern time, location and
            check-in code.
          </li>
        </ol>
        <p className="text-sm text-[var(--slate)]">
          Agent access can read the calendar and create events. It cannot change
          memberships, edit events, or delete events. The assistant should keep
          each event’s request ID when retrying.
        </p>
        <Link
          href="/events"
          className="inline-flex min-h-11 items-center text-[var(--navy)] underline"
        >
          View the calendar
        </Link>
      </section>
    </div>
  );
}

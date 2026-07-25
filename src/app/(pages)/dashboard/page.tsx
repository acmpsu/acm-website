import Image from "next/image";
import { redirect } from "next/navigation";

import { COMMITTEES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

import { CheckInForm, ProfileForm } from "./DashboardForms";
import { toggleCommittee } from "./actions";

export const metadata = { title: "My membership — Penn State ACM" };

type AttendanceRow = {
  checked_in_at: string;
  events: { title: string; starts_at: string; location: string | null } | null;
};

export default async function DashboardPage() {
  // Middleware can't gate this route until Supabase is configured, so guard here too.
  if (!isSupabaseConfigured) redirect("/login");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard");

  const [{ data: profile }, { data: memberships }, { data: attendance }] = await Promise.all([
    supabase.from("profiles").select("full_name, major, grad_year, is_officer").eq("id", user.id).single(),
    supabase.from("committee_members").select("committee_id").eq("profile_id", user.id),
    supabase
      .from("attendance")
      .select("checked_in_at, events(title, starts_at, location)")
      .eq("profile_id", user.id)
      .order("checked_in_at", { ascending: false })
      .returns<AttendanceRow[]>(),
  ]);

  const joined = new Set((memberships ?? []).map((row) => row.committee_id));

  return (
    <div className="space-y-16">
      <section>
        <h1 className="mb-3 text-[clamp(28px,3vw,42px)] font-extrabold leading-[1.1] tracking-[-0.03em] text-[var(--navy-dk)]">
          My membership
        </h1>
        <p className="text-[15px] leading-[1.75] text-[var(--slate)]">
          Signed in as {user.email}
          {profile?.is_officer ? " · Officer" : ""}
        </p>
      </section>

      <section id="profile">
        <h2 className="mb-6 text-[18px] font-semibold text-[var(--navy-dk)]">Profile</h2>
        <ProfileForm
          profile={{
            full_name: profile?.full_name ?? null,
            major: profile?.major ?? null,
            grad_year: profile?.grad_year ?? null,
          }}
        />
      </section>

      <section id="my-committees">
        <h2 className="mb-2 text-[18px] font-semibold text-[var(--navy-dk)]">Committees</h2>
        <p className="mb-6 text-[15px] leading-[1.75] text-[var(--slate)]">
          Join as many as you like. You can leave at any time
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COMMITTEES.map((committee) => {
            const isMember = joined.has(committee.id);
            return (
              <form action={toggleCommittee} key={committee.id}>
                <input type="hidden" name="committee_id" value={committee.id} />
                <input type="hidden" name="is_member" value={String(isMember)} />
                <button
                  type="submit"
                  aria-pressed={isMember}
                  className={`flex w-full items-center gap-3 rounded border p-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--navy)] ${
                    isMember
                      ? "border-[var(--navy)] bg-white"
                      : "border-[var(--border)] bg-[var(--bg-alt)] hover:border-[#b0bdd4] hover:bg-white"
                  }`}
                >
                  <span className="relative h-9 w-9 shrink-0">
                    <Image
                      src={committee.logo}
                      alt=""
                      fill
                      sizes="36px"
                      className="object-contain"
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13px] font-semibold text-[var(--navy-dk)]">
                      {committee.shortName}
                    </span>
                    <span className="mt-0.5 block text-[12px] text-[var(--slate)]">
                      {isMember ? "Joined — tap to leave" : "Tap to join"}
                    </span>
                  </span>
                </button>
              </form>
            );
          })}
        </div>
      </section>

      <section id="attendance">
        <h2 className="mb-2 text-[18px] font-semibold text-[var(--navy-dk)]">Event attendance</h2>
        <p className="mb-6 text-[15px] leading-[1.75] text-[var(--slate)]">
          Enter the code announced at an event to record your attendance
        </p>

        <CheckInForm />

        <div className="mt-8">
          <h3 className="mb-4 text-[14px] font-semibold text-[var(--navy-dk)]">History</h3>
          {attendance && attendance.length > 0 ? (
            <ul className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
              {attendance.map((row) => (
                <li key={`${row.events?.title}-${row.checked_in_at}`} className="flex flex-wrap items-baseline justify-between gap-2 py-3">
                  <span className="text-[14px] font-medium text-[var(--navy-dk)]">
                    {row.events?.title ?? "Event"}
                  </span>
                  <span className="text-[13px] text-[var(--slate)]">
                    {new Date(row.checked_in_at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[13px] text-[var(--slate)]">No events yet</p>
          )}
        </div>
      </section>
    </div>
  );
}

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
    <div className="relative left-1/2 right-1/2 -mx-[50vw] -mb-12 -mt-[calc(var(--site-header-height)+3rem)] w-screen min-h-svh overflow-hidden bg-[#9fb98a] pt-[var(--site-header-height)]">
      <AuthMeadow />

      <div className="relative z-10 flex min-h-[calc(100svh-var(--site-header-height))] items-center justify-center px-4 py-12 sm:py-16">
        {/* Supabase isn't configured yet; render the sign-in UI anyway so the page
            looks complete. Auth server actions won't succeed until the keys land. */}
        <LoginForm next={safeNext} />
      </div>
    </div>
  );
}

import { COMMITTEES, PRIMARY_NAV, UTILITY_NAV } from "@/lib/constants";
import { HeaderAuth } from "@/components/HeaderAuth";
import { NavBarClient } from "./NavBarClient";

/**
 * Shared site navigation (new ACM Figma design). Server component so the auth
 * slot (Login button / account menu) stays server-rendered; the interactive
 * shell is delegated to NavBarClient.
 */
export function NavBar() {
  const committees = COMMITTEES.map((c) => ({
    label: c.shortName,
    href: `/committees#${c.id}`,
  }));

  return (
    <NavBarClient
      primary={[...PRIMARY_NAV]}
      utility={[...UTILITY_NAV]}
      committees={committees}
      authSlot={<HeaderAuth />}
    />
  );
}

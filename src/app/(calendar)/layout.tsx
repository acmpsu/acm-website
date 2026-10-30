import { SiteShell } from "@/components/site/SiteShell";

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteShell layout="full-bleed">{children}</SiteShell>;
}

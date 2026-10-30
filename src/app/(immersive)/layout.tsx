import { SiteShell } from "@/components/site/SiteShell";

// Full-bleed pages: unlike (pages), content is not boxed into a centered column.
export default function ImmersiveLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell layout="full-bleed">{children}</SiteShell>;
}

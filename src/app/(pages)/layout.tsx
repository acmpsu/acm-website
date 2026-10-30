import { SiteShell } from "@/components/site/SiteShell";

export default function PagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SiteShell layout="contained">{children}</SiteShell>;
}

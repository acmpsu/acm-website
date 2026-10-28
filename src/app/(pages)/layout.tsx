import { NavBar, SiteFooter, Container } from "@/components/shell";

export default function PagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <NavBar />
      <main className="flex-1">
        <Container as="div" className="py-10 sm:py-14">
          {children}
        </Container>
      </main>
      <SiteFooter />
    </div>
  );
}

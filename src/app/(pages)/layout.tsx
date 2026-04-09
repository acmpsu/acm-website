import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function PagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-6xl mx-auto w-full px-8 py-12">{children}</main>
      <Footer />
    </div>
  );
}

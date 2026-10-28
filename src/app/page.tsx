import { NavBar, SiteFooter } from "@/components/shell";
import { Hero } from "@/components/Hero";
import { Partners } from "@/components/Partners";
import { Committees } from "@/components/Committees";
import { News } from "@/components/News";
import { JoinUs } from "@/components/JoinUs";

export default function Home() {
  return (
    <div className="home-snap flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1">
        <Hero />
        <Partners />
        <Committees />
        <News />
        <JoinUs />
      </main>
      <SiteFooter />
    </div>
  );
}

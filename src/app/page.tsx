import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Committees } from "@/components/Committees";
import { News } from "@/components/News";
import { JoinUs } from "@/components/JoinUs";
import { Footer } from "@/components/Footer";
import { UpcomingEvents } from "@/components/events/UpcomingEvents";
import { SponsorsSection } from "@/components/sponsors/SponsorsSection";

export default function Home() {
  return (
    <div className="home-snap min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <SponsorsSection />
        <Committees />
        <UpcomingEvents />
        <News />
        <JoinUs />
      </main>
      <Footer />
    </div>
  );
}

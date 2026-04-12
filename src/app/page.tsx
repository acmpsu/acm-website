import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Partners } from "@/components/Partners";
import { Committees } from "@/components/Committees";
import { News } from "@/components/News";
import { JoinUs } from "@/components/JoinUs";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="home-snap min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Partners />
        <Committees />
        <News />
        <JoinUs />
      </main>
      <Footer />
    </div>
  );
}

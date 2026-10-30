import { AboutSection } from "@/components/home/AboutSection";
import { ContactSection } from "@/components/home/ContactSection";
import { HomeHero } from "@/components/home/HomeHero";
import { PartnersSection } from "@/components/home/PartnersSection";
import { SiteShell } from "@/components/site/SiteShell";
import { SponsorsSection } from "@/components/sponsors/SponsorsSection";
import { ScrollStack, StackAnchor } from "@/components/ui/ScrollStack";

// Section order follows the Figma "ACM 2026 Website Frame" (50:325); Events lives on /events.
export default function Home() {
  return (
    <SiteShell layout="full-bleed" footerCredits>
      <ScrollStack overlap="figma" fullScreen>
        <HomeHero />
        <StackAnchor id="about" />
        <AboutSection />
        <StackAnchor id="sponsors" />
        <SponsorsSection />
        <StackAnchor id="partners" />
        <PartnersSection />
        <StackAnchor id="contact" />
        <ContactSection />
      </ScrollStack>
    </SiteShell>
  );
}

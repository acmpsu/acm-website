import Image from "next/image";
import Link from "next/link";

import { CONTACT_LINKS, PRIMARY_NAV, UTILITY_NAV } from "@/lib/constants";
import {
  DiscordIcon,
  GroupMeIcon,
  InstagramIcon,
  LinkedinIcon,
  OrgPageIcon,
} from "@/components/ui/brand-icons";
import { Container } from "./Container";

const SOCIAL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Discord: DiscordIcon,
  GroupMe: GroupMeIcon,
  Instagram: InstagramIcon,
  LinkedIn: LinkedinIcon,
  "Org Page": OrgPageIcon,
};

const navLinks = [...PRIMARY_NAV, ...UTILITY_NAV];

/**
 * Shared site footer, built on the design-system tokens (navy surface, Red Hat
 * type, token spacing). Structure only — branding, sitemap, social links, and
 * copyright. The Figma's decorative sky/cloud artwork is intentionally NOT
 * reproduced here: those assets are being produced separately and should be
 * dropped in as a background layer once available.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-[var(--azure-12)] text-white">
      <Container className="py-14 sm:py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="inline-flex w-fit items-center gap-3" aria-label="Penn State ACM — home">
              <Image src="/logos/acm.png" alt="ACM" width={48} height={48} className="h-12 w-12" />
              <span className="font-[family-name:var(--font-red-hat)] text-lg font-bold">Penn State ACM</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-white/80">
              The Association for Computing Machinery at Penn State — learn, build, and connect
              with the campus computing community.
            </p>
          </div>

          {/* Sitemap */}
          <nav aria-label="Footer" className="flex flex-col gap-3">
            <h2 className="font-[family-name:var(--font-red-hat-mono)] text-xs font-medium uppercase tracking-[0.16em] text-white/60">
              Explore
            </h2>
            <ul className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/85 transition-colors duration-[var(--dur-fast)] hover:text-white focus-visible:text-white focus-visible:outline-none"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Connect */}
          <div className="flex flex-col gap-3">
            <h2 className="font-[family-name:var(--font-red-hat-mono)] text-xs font-medium uppercase tracking-[0.16em] text-white/60">
              Connect
            </h2>
            <ul className="flex flex-col gap-2">
              {CONTACT_LINKS.map((link) => {
                const Icon = SOCIAL_ICONS[link.label];
                return (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-white/85 transition-colors duration-[var(--dur-fast)] hover:text-white focus-visible:text-white focus-visible:outline-none"
                    >
                      {Icon ? <Icon className="h-4 w-4" /> : null}
                      <span>{link.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/15 pt-6 text-xs text-white/60 sm:flex-row">
          <p>© {year} Penn State ACM. All rights reserved.</p>
          <p>Built by the ACM Dev Team.</p>
        </div>
      </Container>
    </footer>
  );
}

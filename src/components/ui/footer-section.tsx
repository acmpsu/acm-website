import Image from 'next/image';
import Link from 'next/link';

import { CONTACT_LINKS } from '@/lib/constants';
import { InstagramIcon, LinkedinIcon } from '@/components/ui/brand-icons';

interface SocialLink {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface TextLink {
  title: string;
  href: string;
}

const SOCIAL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Instagram: InstagramIcon,
  LinkedIn: LinkedinIcon,
};

const socialLinks: SocialLink[] = CONTACT_LINKS.filter((link) => link.group === 'social').map(
  (link) => ({ title: link.label, href: link.href, icon: SOCIAL_ICONS[link.label] })
);

const officialLinks: TextLink[] = CONTACT_LINKS.filter((link) => link.group === 'official').map(
  (link) => ({ title: link.label, href: link.href })
);

export function FooterSection() {
  return (
    <footer className="relative w-full border-t border-slate-200 bg-white px-6 py-8 md:py-10 lg:py-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 text-center md:flex-row md:items-center md:justify-between md:text-left">
        <div className="flex flex-col items-center gap-4 md:flex-row md:items-center md:gap-5">
          <Image src="/logos/acm.png" alt="ACM" width={40} height={40} />
          <div>
            <p className="text-sm font-semibold tracking-wide text-slate-900">Penn State ACM</p>
            <p className="mt-1 text-xs text-slate-500">© {new Date().getFullYear()} All rights reserved</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 md:items-end">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 text-xs font-medium text-slate-700 md:justify-end">
            {socialLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 transition hover:text-blue-800"
              >
                <link.icon className="h-3.5 w-3.5" />
                <span>{link.title}</span>
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-3 text-xs font-medium text-slate-700 md:justify-end">
            {officialLinks.map((link, index) => (
              <span key={link.title} className="inline-flex items-center gap-2">
                <Link
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-blue-800"
                >
                  {link.title}
                </Link>
                {index < officialLinks.length - 1 ? <span className="text-slate-300">|</span> : null}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}


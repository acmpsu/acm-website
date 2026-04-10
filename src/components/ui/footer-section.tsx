'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import type { ComponentProps, ReactNode } from 'react';

interface SocialLink {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface TextLink {
  title: string;
  href: string;
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2.8" y="2.8" width="18.4" height="18.4" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.8" r="1.1" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="5" cy="6.3" r="1.7" />
      <line x1="5" y1="10" x2="5" y2="19" />
      <line x1="9" y1="10" x2="9" y2="19" />
      <path d="M9 13.2c0-1.9 1.5-3.4 3.4-3.4S16 11.3 16 13.2V19" />
      <line x1="16" y1="14.2" x2="16" y2="19" />
    </svg>
  );
}

const socialLinks: SocialLink[] = [
  {
    title: 'Instagram',
    href: 'https://www.instagram.com/pennstateacm/',
    icon: InstagramIcon,
  },
  {
    title: 'LinkedIn',
    href: 'https://www.linkedin.com/company/acmpsu/',
    icon: LinkedinIcon,
  },
];

const officialLinks: TextLink[] = [
  { title: 'Org Page', href: 'https://discover.psu.edu/organization/association-for-computing-machinery' },
  { title: 'Discord', href: 'https://discord.gg/zkqYjGxVsh' },
  { title: 'GroupMe', href: 'https://groupme.com/join_group/113864937/hfRpqc64' },
];

export function FooterSection() {
  return (
    <footer className="relative w-full border-t border-gray-200 bg-gradient-to-b from-white to-gray-100 px-6 py-5 lg:py-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 text-center">
        <AnimatedContainer className="flex flex-col items-center gap-3">
            <Image src="/logos/acm.png" alt="ACM" width={40} height={40} />
            <div>
              <p className="text-sm font-semibold tracking-wide text-gray-900">Penn State ACM</p>
              <p className="mt-1 text-xs text-gray-500">© {new Date().getFullYear()} All rights reserved.</p>
            </div>
        </AnimatedContainer>

        <AnimatedContainer delay={0.15} className="flex flex-col items-center gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-500">Links</p>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs font-medium text-gray-700">
            {socialLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 transition hover:text-gray-900"
              >
                <link.icon className="h-3.5 w-3.5" />
                <span>{link.title}</span>
              </Link>
            ))}
            <span className="text-gray-300">|</span>
            {officialLinks.map((link, index) => (
              <span key={link.title} className="inline-flex items-center gap-2">
                <Link
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-gray-900"
                >
                  {link.title}
                </Link>
                {index < officialLinks.length - 1 ? <span className="text-gray-300">|</span> : null}
              </span>
            ))}
          </div>
        </AnimatedContainer>

        <AnimatedContainer delay={0.25} className="w-full border-t border-gray-200 pt-2 text-center">
          <p className="text-xs text-gray-600">Created by Dev Team</p>
        </AnimatedContainer>
      </div>
    </footer>
  );
}

type ViewAnimationProps = {
  delay?: number;
  className?: ComponentProps<typeof motion.div>['className'];
  children: ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return children;
  }

  return (
    <motion.div
      initial={{ filter: 'blur(4px)', translateY: 6, opacity: 0 }}
      whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.55 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
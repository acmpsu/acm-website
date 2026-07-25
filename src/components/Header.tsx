import Image from "next/image";
import Link from "next/link";
import { NAV_ITEMS } from "@/lib/constants";
import { ShiftingDropDown } from "@/components/ui/shifting-dropdown";
import { CommitteesDropDown } from "@/components/ui/committees-dropdown";
import { ResourcesDropDown } from "@/components/ui/resources-dropdown";
import { MobileMenu } from "@/components/ui/mobile-menu";
import { HeaderAuth } from "@/components/HeaderAuth";

export function Header() {
  // Filter out items that have dropdown components
  const regularNavItems = NAV_ITEMS.filter(
    (item) => item.label !== "Committees" && item.label !== "Initiatives" && item.label !== "Resources"
  );

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[1160px] items-center justify-between h-[60px] px-8">
        <Link href="/" className="flex items-center gap-2.5 text-inherit no-underline">
          <Image src="/logos/acm.png" alt="ACM" width={34} height={34} loading="eager" />
          <span className="hidden text-[13px] font-bold tracking-[0.01em] text-[var(--navy-dk)] sm:block">
            Penn State ACM
          </span>
        </Link>

        <div className="flex items-center gap-5">
          <nav className="hidden items-center gap-6 lg:flex">
            {regularNavItems.slice(0, 1).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[13px] font-medium text-[var(--navy-dk)] transition hover:text-[var(--navy)]"
              >
                {item.label}
              </Link>
            ))}
            <CommitteesDropDown />
            <ShiftingDropDown />
            <ResourcesDropDown />
            {regularNavItems.slice(1).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[13px] font-medium text-[var(--navy-dk)] transition hover:text-[var(--navy)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <MobileMenu />

          <HeaderAuth />
        </div>
      </div>
    </header>
  );
}

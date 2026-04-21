import Image from "next/image";
import Link from "next/link";
import { NAV_ITEMS } from "@/lib/constants";
import { ShiftingDropDown } from "@/components/ui/shifting-dropdown";
import { CommitteesDropDown } from "@/components/ui/committees-dropdown";
import { MobileMenu } from "@/components/ui/mobile-menu";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[1160px] items-center justify-between px-8 h-[60px]">
        <Link href="/" className="flex items-center gap-2.5 text-inherit no-underline">
          <Image src="/logos/acm.png" alt="ACM" width={34} height={34} loading="eager" />
          <span className="hidden text-[13px] font-bold tracking-[0.01em] text-[var(--navy-dk)] sm:block">
            Penn State ACM
          </span>
        </Link>

        <div className="flex items-center gap-7">
          <nav className="hidden items-center gap-7 lg:flex">
            {NAV_ITEMS.slice(0, 1).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[13px] font-medium text-[var(--slate)] transition hover:text-[var(--navy-dk)]"
              >
                {item.label}
              </Link>
            ))}
            <CommitteesDropDown />
            <ShiftingDropDown />
            {NAV_ITEMS.slice(1).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[13px] font-medium text-[var(--slate)] transition hover:text-[var(--navy-dk)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <MobileMenu />

          <Link
            href="/login"
            className="rounded-md bg-[var(--navy)] px-[18px] py-[7px] text-[13px] font-semibold text-white transition hover:bg-[var(--navy-dk)]"
          >
            Login
          </Link>
        </div>
      </div>
    </header>
  );
}

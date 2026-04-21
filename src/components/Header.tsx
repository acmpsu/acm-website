import Image from "next/image";
import Link from "next/link";
import { NAV_ITEMS } from "@/lib/constants";
import { ShiftingDropDown } from "@/components/ui/shifting-dropdown";
import { CommitteesDropDown } from "@/components/ui/committees-dropdown";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white px-6 py-3">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logos/acm.png" alt="ACM" width={46} height={46} loading="eager" />
          <p className="hidden text-sm font-semibold tracking-wide text-slate-900 sm:block">Penn State ACM</p>
        </Link>
        <div className="flex items-center gap-6">
          <nav className="hidden items-center gap-7 text-sm font-medium text-slate-700 lg:flex">
            {NAV_ITEMS.slice(0, 1).map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-blue-700">
                {item.label}
              </Link>
            ))}
            <CommitteesDropDown />
            <ShiftingDropDown />
            {NAV_ITEMS.slice(1).map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-blue-700">
                {item.label}
              </Link>
            ))}
          </nav>
          <button className="whitespace-nowrap rounded-full bg-blue-900 px-5 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-blue-950">
            Login
          </button>
        </div>
      </div>
    </header>
  );
}

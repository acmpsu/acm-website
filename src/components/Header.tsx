import Image from "next/image";
import Link from "next/link";
import { NAV_ITEMS } from "@/lib/constants";

export function Header() {
  return (
    <header className="bg-white border-b border-gray-300 py-3 px-8">
      <div className="flex items-center justify-between">
        <Link href="/">
          <Image src="/logos/acm.png" alt="ACM" width={56} height={56} className="mr-12" />
        </Link>
        <div className="flex items-center gap-8">
          <nav className="hidden lg:flex gap-8 text-sm font-medium text-gray-800">
            {NAV_ITEMS.map((item) => (
              <a key={item.href} href={item.href} className="hover:text-gray-600">
                {item.label}
              </a>
            ))}
          </nav>
          <button className="bg-blue-900 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-blue-950 transition whitespace-nowrap">
            Login
          </button>
        </div>
      </div>
    </header>
  );
}

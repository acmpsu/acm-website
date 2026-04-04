import Image from "next/image";
import { FOOTER_ITEMS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-gray-200 py-12 px-6" id="icpc">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Image src="/logos/acm.png" alt="ACM" width={56} height={56} />
        <div className="flex gap-6">
          {FOOTER_ITEMS.map((item) => (
            <a key={item.href} href={item.href} className="text-sm font-medium text-black">
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

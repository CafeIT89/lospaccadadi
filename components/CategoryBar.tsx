"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const categories = [
  { label: "Tutte", href: "/notizie" },
  { label: "Crowdfunding", href: "/categoria/crowdfunding" },
  { label: "Dungeon Crawler", href: "/categoria/dungeon-crawler" },
  { label: "Miniature", href: "/categoria/miniature" },
];

export default function CategoryBar() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-brand-border bg-surface">
      <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto px-6 py-4">
        {categories.map((category) => {
          const isActive = pathname === category.href;

          return (
            <Link
              key={category.href}
              href={category.href}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition ${
                isActive
                  ? "border-primary bg-primary text-black"
                  : "border-brand-border text-muted hover:border-primary hover:text-primary"
              }`}
            >
              {category.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
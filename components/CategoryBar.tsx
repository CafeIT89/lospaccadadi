import Link from "next/link";

const categories = [
  { label: "Tutte", href: "/notizie" },
  { label: "Crowdfunding", href: "/categoria/crowdfunding" },
  { label: "Dungeon Crawler", href: "/categoria/dungeon-crawler" },
  { label: "Miniature", href: "/categoria/miniature" },
];

export default function CategoryBar() {
  return (
    <nav className="border-b border-brand-border bg-surface">
      <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto px-6 py-4">
        {categories.map((category) => (
          <Link
            key={category.href}
            href={category.href}
            className="whitespace-nowrap rounded-full border border-brand-border px-4 py-2 text-sm font-semibold text-muted transition hover:border-primary hover:text-primary"
          >
            {category.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
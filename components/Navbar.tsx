"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/tg-ludico", label: "TG Ludico" },
    { href: "/settimanale", label: "Il Settimanale" },
    { href: "/gamefound", label: "Gamefound Updates" },
    { href: "/recensioni", label: "Recensioni" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-brand-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link href="/">
          <Image
            src="/logo-spaccadadi.png"
            alt="Lo Spacca Dadi"
            width={300}
            height={100}
            className="h-14 w-auto"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="transition hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg p-2 text-primary transition hover:bg-surface md:hidden"
          aria-label="Apri menu"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-brand-border bg-surface md:hidden">
          <div className="flex flex-col p-6">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-3"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
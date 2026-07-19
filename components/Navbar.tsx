import Image from "next/image";

export default function Navbar() {
  return (
    <header className="border-b border-yellow-400/20 bg-black">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="/" className="flex items-center gap-3">
          <Image
            src="/logo-spaccadadi.png"
            alt="Logo Lo Spacca Dadi"
            width={64}
            height={64}
            className="h-14 w-14 rounded-xl object-cover"
            priority
          />

          <span className="text-xl font-black uppercase tracking-wide text-yellow-400">
            Lo Spacca Dadi
          </span>
        </a>

        <nav className="hidden gap-8 text-sm font-semibold text-zinc-300 md:flex">
          <a href="#" className="transition hover:text-yellow-400">
            TG Ludico
          </a>

          <a href="#" className="transition hover:text-yellow-400">
            Crowdfunding
          </a>

          <a href="#" className="transition hover:text-yellow-400">
            Giochi
          </a>

          <a href="#" className="transition hover:text-yellow-400">
            Chi sono
          </a>
        </nav>
      </div>
    </header>
  );
}
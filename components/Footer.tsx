export default function Footer() {
  return (
    <footer className="border-t border-brand-border bg-black">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-heading text-2xl uppercase text-primary">
            Lo Spacca Dadi
          </p>

          <p className="mt-2 text-sm text-muted">
            News, crowdfunding e approfondimenti sui giochi da tavolo.
          </p>
        </div>

        <nav className="flex flex-wrap gap-5 text-sm text-zinc-300">
          <a href="#" className="transition hover:text-primary">
            TG Ludico
          </a>

          <a href="#" className="transition hover:text-primary">
            Crowdfunding
          </a>

          <a href="#" className="transition hover:text-primary">
            Giochi
          </a>

          <a href="#" className="transition hover:text-primary">
            Chi sono
          </a>
        </nav>
      </div>

      <div className="border-t border-brand-border">
        <div className="mx-auto max-w-7xl px-6 py-5 text-sm text-muted">
          © {new Date().getFullYear()} Lo Spacca Dadi. Tutti i diritti riservati.
        </div>
      </div>
    </footer>
  );
}
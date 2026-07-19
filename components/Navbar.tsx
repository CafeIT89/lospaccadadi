export default function Navbar() {
  return (
    <header className="border-b border-zinc-800">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <h1 className="text-2xl font-bold text-orange-500">
          LoSpaccaDadi
        </h1>

        <nav className="flex gap-8 text-sm text-zinc-300">
          <a href="#" className="hover:text-white">
            TG Ludico
          </a>

          <a href="#" className="hover:text-white">
            Crowdfunding
          </a>

          <a href="#" className="hover:text-white">
            Giochi
          </a>

          <a href="#" className="hover:text-white">
            Chi sono
          </a>
        </nav>
      </div>
    </header>
  );
}
export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* Navbar */}
      <header className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <h1 className="text-2xl font-bold text-orange-500">
            LoSpaccaDadi
          </h1>

          <nav className="flex gap-8 text-sm text-zinc-300">
            <a href="#" className="hover:text-white">TG Ludico</a>
            <a href="#" className="hover:text-white">Crowdfunding</a>
            <a href="#" className="hover:text-white">Giochi</a>
            <a href="#" className="hover:text-white">Chi sono</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <span className="rounded-full bg-orange-500/20 px-4 py-2 text-sm text-orange-400">
          IA per i giochi da tavolo
        </span>

        <h2 className="mt-8 text-6xl font-black leading-tight">
          Le notizie che contano.
          <br />
          Senza perdere ore a cercarle.
        </h2>

        <p className="mt-8 max-w-2xl text-xl text-zinc-400">
          LoSpaccaDadi raccoglie automaticamente le notizie più importanti
          da BoardGameGeek, Kickstarter e Gamefound e le trasforma
          in un briefing quotidiano.
        </p>

        <div className="mt-10 flex gap-4">
          <button className="rounded-xl bg-orange-500 px-6 py-3 font-semibold hover:bg-orange-400">
            Leggi TG Ludico
          </button>

          <button className="rounded-xl border border-zinc-700 px-6 py-3 hover:bg-zinc-900">
            Crowdfunding Radar
          </button>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 pb-24">
  <div className="grid gap-6 md:grid-cols-3">
    <article className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <span className="text-sm font-semibold text-orange-400">
        TG LUDICO
      </span>

      <h3 className="mt-4 text-2xl font-bold">
        Il briefing quotidiano
      </h3>

      <p className="mt-3 text-zinc-400">
        Le notizie più importanti dal mondo dei giochi da tavolo,
        selezionate e riassunte ogni giorno.
      </p>

      <a
        href="#"
        className="mt-6 inline-block font-semibold text-orange-400 hover:text-orange-300"
      >
        Leggi il briefing →
      </a>
    </article>

    <article className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <span className="text-sm font-semibold text-orange-400">
        CROWDFUNDING
      </span>

      <h3 className="mt-4 text-2xl font-bold">
        Campaign Radar
      </h3>

      <p className="mt-3 text-zinc-400">
        Kickstarter e Gamefound sotto osservazione, con focus su dungeon
        crawler, boss battler e giochi con miniature.
      </p>

      <a
        href="#"
        className="mt-6 inline-block font-semibold text-orange-400 hover:text-orange-300"
      >
        Scopri le campagne →
      </a>
    </article>

    <article className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <span className="text-sm font-semibold text-orange-400">
        GIOCO DEL GIORNO
      </span>

      <h3 className="mt-4 text-2xl font-bold">
        Una scoperta al giorno
      </h3>

      <p className="mt-3 text-zinc-400">
        Un titolo selezionato tra campagne, giochi narrativi, legacy,
        cooperativi e miniature.
      </p>

      <a
        href="#"
        className="mt-6 inline-block font-semibold text-orange-400 hover:text-orange-300"
      >
        Scopri il gioco →
      </a>
    </article>
  </div>
</section>
    </main>
  );
}
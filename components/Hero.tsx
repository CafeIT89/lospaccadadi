export default function Hero() {
  return (
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
  );
}
export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <section className="max-w-6xl mx-auto px-6 py-24">
        <span className="text-orange-500 font-semibold tracking-widest uppercase">
          LoSpaccaDadi
        </span>

        <h1 className="mt-6 text-6xl font-black leading-tight">
          News, AI e Crowdfunding
          <br />
          per i giochi da tavolo
        </h1>

        <p className="mt-8 text-xl text-zinc-400 max-w-2xl">
          Ogni giorno analizziamo centinaia di fonti e selezioniamo solo le
          notizie davvero importanti per gli appassionati di giochi da tavolo.
        </p>

        <div className="mt-10 flex gap-4">
          <button className="rounded-xl bg-orange-500 px-6 py-3 font-semibold hover:bg-orange-400">
            Leggi il TG Ludico
          </button>

          <button className="rounded-xl border border-zinc-700 px-6 py-3 hover:bg-zinc-900">
            Scopri il progetto
          </button>
        </div>
      </section>
    </main>
  );
}
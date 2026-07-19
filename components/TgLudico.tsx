export default function TgLudico() {
  return (
    <section
      id="tg-ludico"
      className="border-b border-brand-border bg-background"
    >
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
            TG Ludico di oggi
          </p>

          <h2 className="mt-4 font-heading text-4xl uppercase leading-tight text-white md:text-6xl">
            Le notizie più importanti,
            <span className="text-primary"> senza rumore.</span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-muted">
            Una selezione quotidiana dedicata soprattutto a dungeon crawler,
            boss battler, giochi narrativi, miniature e campagne
            crowdfunding.
          </p>
        </div>

        <article className="mt-10 rounded-3xl border border-brand-border bg-surface p-8 md:p-10">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-full bg-primary px-3 py-1 font-bold text-black">
              Apertura
            </span>

            <span className="text-muted">Edizione demo</span>
          </div>

          <h3 className="mt-6 font-heading text-3xl uppercase text-white md:text-5xl">
            Il briefing quotidiano di Lo Spacca Dadi
          </h3>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
            Qui comparirà la notizia principale del giorno, accompagnata da
            sintesi, contesto e analisi editoriale. Per ora usiamo un contenuto
            dimostrativo; in seguito collegheremo questa sezione ai dati reali.
          </p>

          <a
            href="#"
            className="mt-8 inline-flex rounded-xl bg-primary px-6 py-3 font-bold text-black transition hover:bg-primary-hover"
          >
            Leggi il TG Ludico
          </a>
        </article>
      </div>
    </section>
  );
}
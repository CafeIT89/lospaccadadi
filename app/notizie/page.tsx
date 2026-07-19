import Link from "next/link";

const news = [
  {
    slug: "nuova-campagna-fantasy",
    category: "Crowdfunding",
    title: "Una nuova campagna fantasy entra nel radar",
    excerpt:
      "Prime impressioni, punti di forza e aspetti da tenere d'occhio prima del pledge.",
  },
  {
    slug: "campagne-narrative-lunghe",
    category: "Dungeon Crawler",
    title: "Il ritorno delle campagne narrative lunghe",
    excerpt:
      "Perché i giochi cooperativi a campagna continuano a conquistare il pubblico.",
  },
  {
    slug: "miniature-e-gioco",
    category: "Miniature",
    title: "Quando le miniature migliorano davvero il gioco",
    excerpt:
      "Produzione spettacolare, ma anche leggibilità, atmosfera e presenza al tavolo.",
  },
];

export default function NewsPage() {
  return (
    <main className="min-h-screen bg-background text-white">
      <section className="border-b border-brand-border">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
            Archivio
          </p>

          <h1 className="mt-4 font-heading text-5xl uppercase md:text-7xl">
            Notizie
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
            Tutte le notizie di Lo Spacca Dadi dedicate a giochi da tavolo,
            crowdfunding, dungeon crawler, miniature e giochi narrativi.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-20 md:grid-cols-2 lg:grid-cols-3">
          {news.map((item) => (
            <article
              key={item.slug}
              className="rounded-3xl border border-brand-border bg-surface p-7 transition hover:-translate-y-1 hover:border-primary"
            >
              <span className="text-sm font-bold uppercase tracking-[0.15em] text-primary">
                {item.category}
              </span>

              <h2 className="mt-5 font-heading text-3xl uppercase leading-tight">
                {item.title}
              </h2>

              <p className="mt-4 leading-7 text-muted">{item.excerpt}</p>

              <Link
                href={`/notizie/${item.slug}`}
                className="mt-6 inline-flex font-semibold text-primary hover:text-primary-hover"
              >
                Leggi la notizia →
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
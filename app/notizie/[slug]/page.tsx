import Link from "next/link";
import { notFound } from "next/navigation";

const articles = {
  "nuova-campagna-fantasy": {
    category: "Crowdfunding",
    title: "Una nuova campagna fantasy entra nel radar",
    date: "19 luglio 2026",
    excerpt:
      "Prime impressioni, punti di forza e aspetti da tenere d'occhio prima del pledge.",
    content: [
      "Il mondo del crowdfunding ludico continua a proporre nuovi progetti fantasy, spesso accompagnati da miniature, campagne narrative e sistemi di progressione.",
      "Prima di partecipare è importante osservare con attenzione il regolamento, la qualità della comunicazione, i tempi di consegna previsti e l'esperienza dell'editore.",
      "Questa campagna sarà seguita nei prossimi aggiornamenti di Lo Spacca Dadi, con particolare attenzione alla struttura degli scenari e alla varietà delle scelte offerte ai giocatori.",
    ],
  },
  "campagne-narrative-lunghe": {
    category: "Dungeon Crawler",
    title: "Il ritorno delle campagne narrative lunghe",
    date: "18 luglio 2026",
    excerpt:
      "Perché i giochi cooperativi a campagna continuano a conquistare il pubblico.",
    content: [
      "Le campagne narrative lunghe continuano ad attirare giocatori interessati a vivere storie che si sviluppano partita dopo partita.",
      "La crescita dei personaggi e le decisioni permanenti aiutano a creare un legame più forte con il gruppo e con il mondo di gioco.",
      "La sfida principale resta mantenere alta la qualità dell'esperienza anche dopo molte sessioni.",
    ],
  },
  "miniature-e-gioco": {
    category: "Miniature",
    title: "Quando le miniature migliorano davvero il gioco",
    date: "17 luglio 2026",
    excerpt:
      "Produzione spettacolare, ma anche leggibilità, atmosfera e presenza al tavolo.",
    content: [
      "Le miniature possono aumentare l'impatto visivo di un gioco, ma non sempre migliorano davvero l'esperienza.",
      "Quando aiutano a leggere meglio la posizione dei personaggi e rendono più chiaro lo stato della partita, diventano parte integrante del design.",
      "Il valore non dipende soltanto dalla quantità, ma dal modo in cui vengono utilizzate durante il gioco.",
    ],
  },
};

type ArticleSlug = keyof typeof articles;

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articles[slug as ArticleSlug];

  if (!article) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background text-white">
      <article>
        <header className="border-b border-brand-border">
          <div className="mx-auto max-w-4xl px-6 py-20">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              {article.category}
            </span>

            <h1 className="mt-5 font-heading text-5xl uppercase leading-tight md:text-7xl">
              {article.title}
            </h1>

            <p className="mt-6 text-xl leading-8 text-muted">
              {article.excerpt}
            </p>

            <p className="mt-6 text-sm text-muted">{article.date}</p>
          </div>
        </header>

        <div className="mx-auto max-w-4xl px-6 py-16">
          <div className="aspect-[16/9] rounded-3xl border border-brand-border bg-[radial-gradient(circle_at_top_right,rgba(254,236,0,0.35),transparent_45%)]">
            <div className="flex h-full items-center justify-center">
              <span className="font-heading text-8xl text-primary/20">
                LSD
              </span>
            </div>
          </div>

          <div className="mt-12 space-y-6 text-lg leading-9 text-muted">
            {article.content.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <Link
            href="/notizie"
            className="mt-12 inline-flex rounded-xl border border-brand-border px-6 py-3 font-semibold text-primary transition hover:border-primary"
          >
            ← Torna alle notizie
          </Link>
        </div>
      </article>
    </main>
  );
}
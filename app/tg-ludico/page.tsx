import Link from "next/link";
import { getTgLudicoNews } from "@/lib/tg-ludico";

export const revalidate = 3600;

export default async function TgLudicoPage() {
  const tgArticles = await getTgLudicoNews();

  return (
    <main className="min-h-screen bg-background text-white">
      <header className="border-b border-brand-border">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
            Le notizie della settimana
          </p>

          <h1 className="mt-5 font-heading text-5xl uppercase md:text-7xl">
            TG Ludico
          </h1>

          <p className="mt-6 max-w-2xl text-xl leading-8 text-muted">
            Le cinque notizie più importanti dal mondo dei giochi da tavolo.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-16">
        {tgArticles.length === 0 ? (
          <p className="text-lg text-muted">
            Nessuna notizia disponibile.
          </p>
        ) : (
          <div className="space-y-6">
            {tgArticles.map((article, index) => (
              <article
                key={article.url}
                className="grid gap-6 rounded-3xl border border-brand-border bg-surface p-6 md:grid-cols-[80px_1fr]"
              >
                <div className="font-heading text-6xl text-primary">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.15em] text-primary">
                    {article.source}
                  </p>

                  <h2 className="mt-4 font-heading text-3xl uppercase">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary"
                    >
                      {article.title}
                    </a>
                  </h2>

                  <p className="mt-4 text-muted">
                    {article.excerpt}
                  </p>

                  <p className="mt-5 text-sm text-muted">
                    {new Date(article.publishedAt).toLocaleDateString("it-IT")}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
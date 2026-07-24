import { getWeeklyEditionPreview } from "@/lib/tg-ludico-weekly-preview";

export const revalidate = 1800;

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default async function TgLudicoPreviewPage() {
  const edition = await getWeeklyEditionPreview({
    year: 2026,
    week: 30,
    periodStart: "2026-07-20",
    periodEnd: "2026-07-26",
  });

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <header className="mb-12 border-b border-white/50 pb-8">
          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-yellow-400">
            Anteprima editoriale
          </p>

          <h1 className="text-4xl font-bold text-white md:text-5xl">
            {edition.title}
          </h1>

          <p className="mt-3 text-lg text-yellow-400">
            {edition.periodStart} → {edition.periodEnd}
          </p>
        </header>

        <div className="space-y-12">
          {edition.articles.map((article) => {
            const articleId = slugify(
  article.originalTitle || article.title
);

            return (
              <article
                id={articleId}
                key={article.originalUrl}
                className="scroll-mt-24 rounded-2xl border border-white/60 bg-black p-6 md:p-8"
              >
                <header className="mb-6">
                  <p className="mb-3 text-sm font-bold text-yellow-400">
                    {article.category}
                  </p>

                  <h2 className="max-w-4xl text-3xl font-bold leading-tight text-white md:text-4xl">
                    {article.title}
                  </h2>

                  {article.subtitle ? (
                    <p className="mt-4 max-w-4xl text-lg leading-7 text-white/80">
                      {article.subtitle}
                    </p>
                  ) : null}

                  <p className="mt-4 text-sm text-white/70">
                    Fonte:{" "}
                    <span className="font-semibold text-yellow-400">
                      {article.source}
                    </span>
                  </p>
                </header>

                {article.keyPoints.length > 0 ? (
                  <section className="mb-8">
                    <h3 className="mb-4 text-2xl font-bold text-yellow-400">
                      Punti chiave
                    </h3>

                    <ul className="space-y-3 pl-6 text-base leading-7 text-white">
                      {article.keyPoints.map((point, index) => (
                        <li
                          key={`${article.originalUrl}-point-${index}`}
                          className="list-disc marker:text-yellow-400"
                        >
                          {point}
                        </li>
                      ))}
                    </ul>
                  </section>
                ) : null}

                {article.article ? (
                  <section className="border-t border-white/30 pt-7">
                    <h3 className="mb-4 text-2xl font-bold text-yellow-400">
                      Articolo
                    </h3>

                    <div className="whitespace-pre-line text-base leading-8 text-white">
                      {article.article}
                    </div>
                  </section>
                ) : null}

                <footer className="mt-8">
                  <a
                    href={article.originalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 font-semibold text-yellow-400 transition hover:text-yellow-300 hover:underline"
                  >
                    Leggi la fonte originale
                    <span aria-hidden="true">↗</span>
                  </a>
                </footer>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
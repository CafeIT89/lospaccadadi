import Link from "next/link";
import { notFound } from "next/navigation";
import { articles } from "@/data/articles";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const categoryArticles = articles.filter(
    (article) => article.categorySlug === slug
  );

  if (categoryArticles.length === 0) {
    notFound();
  }

  const categoryName = categoryArticles[0].category;

  return (
    <main className="min-h-screen bg-background text-white">
      <section className="border-b border-brand-border">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
            Categoria
          </p>

          <h1 className="mt-4 font-heading text-5xl uppercase md:text-7xl">
            {categoryName}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
            Tutti gli articoli pubblicati nella categoria {categoryName}.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-20 md:grid-cols-2 lg:grid-cols-3">
          {categoryArticles.map((article) => (
            <article
              key={article.slug}
              className="rounded-3xl border border-brand-border bg-surface p-7 transition hover:-translate-y-1 hover:border-primary"
            >
              <span className="text-sm font-bold uppercase tracking-[0.15em] text-primary">
                {article.category}
              </span>

              <h2 className="mt-5 font-heading text-3xl uppercase leading-tight">
                {article.title}
              </h2>

              <p className="mt-4 leading-7 text-muted">
                {article.excerpt}
              </p>

              <Link
                href={`/notizie/${article.slug}`}
                className="mt-6 inline-flex font-semibold text-primary transition hover:text-primary-hover"
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
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles } from "@/data/articles";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);

  if (!article) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background text-white">
      <article>
        <header className="border-b border-brand-border">
          <div className="mx-auto max-w-4xl px-6 py-20">
            <nav className="mb-8 text-sm text-muted">
              <Link href="/" className="transition hover:text-primary">
                Home
              </Link>

              <span className="mx-2">/</span>

              <Link
                href="/notizie"
                className="transition hover:text-primary"
              >
                Notizie
              </Link>

              <span className="mx-2">/</span>

              <span className="text-white">{article.title}</span>
            </nav>

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

          <section className="mt-20 border-t border-brand-border pt-12">
            <h2 className="font-heading text-3xl uppercase text-white">
              Potrebbero interessarti
            </h2>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {articles
                .filter((item) => item.slug !== article.slug)
                .slice(0, 2)
                .map((item) => (
                  <Link
                    key={item.slug}
                    href={`/notizie/${item.slug}`}
                    className="rounded-2xl border border-brand-border bg-surface p-6 transition hover:-translate-y-1 hover:border-primary"
                  >
                    <Link
  href={`/categoria/${item.categorySlug}`}
  className="text-sm font-bold uppercase tracking-[0.15em] text-primary transition hover:text-primary-hover"
>
  {item.category}
</Link>

                    <h3 className="mt-4 font-heading text-2xl uppercase text-white">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-muted">{item.excerpt}</p>
                  </Link>
                ))}
            </div>
          </section>

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
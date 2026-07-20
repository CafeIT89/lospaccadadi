import Image from "next/image";
import { getRecensioni } from "@/lib/recensioni";

export const revalidate = 3600;

export default async function RecensioniPage() {
  const videos = await getRecensioni();

  return (
    <main className="min-h-screen bg-background text-white">
      <header className="border-b border-brand-border">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
            I giochi sotto la lente
          </p>

          <h1 className="mt-5 font-heading text-5xl uppercase md:text-7xl">
            Recensioni
          </h1>

          <p className="mt-6 max-w-2xl text-xl leading-8 text-muted">
            Tutte le recensioni dei giochi da tavolo pubblicate su Lo Spacca
            Dadi.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-16">
        {videos.length === 0 ? (
          <p className="text-lg text-muted">
            Nessuna recensione disponibile.
          </p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <article
                key={video.videoId}
                className="overflow-hidden rounded-3xl border border-brand-border bg-surface"
              >
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    width={480}
                    height={360}
                    className="aspect-video w-full object-cover"
                  />
                </a>

                <div className="p-6">
                  <p className="text-sm font-bold uppercase tracking-[0.15em] text-primary">
                    Recensione
                  </p>

                  <h2 className="mt-4 font-heading text-2xl uppercase">
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition hover:text-primary"
                    >
                      {video.title}
                    </a>
                  </h2>

                  {video.publishedAt && (
                    <p className="mt-5 text-sm text-muted">
                      {new Date(video.publishedAt).toLocaleDateString("it-IT")}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
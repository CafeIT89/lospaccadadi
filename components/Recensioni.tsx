import Image from "next/image";
import Link from "next/link";
import { getRecensioni } from "@/lib/recensioni";

export default async function Recensioni() {
  const videos = await getRecensioni();
  const latestVideos = videos.slice(0, 3);

  return (
    <section className="border-t border-brand-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              I giochi sotto la lente
            </p>

            <h2 className="mt-4 font-heading text-4xl uppercase md:text-6xl">
              Recensioni
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
              Le ultime recensioni pubblicate sul canale Lo Spacca Dadi.
            </p>
          </div>

          <Link
            href="/recensioni"
            className="inline-flex w-fit items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wide text-black transition hover:opacity-80"
          >
            Guarda tutte le recensioni
          </Link>
        </div>

        {latestVideos.length === 0 ? (
          <p className="mt-12 text-lg text-muted">
            Nessuna recensione disponibile.
          </p>
        ) : (
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {latestVideos.map((video) => (
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

                  <h3 className="mt-4 font-heading text-2xl uppercase">
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition hover:text-primary"
                    >
                      {video.title}
                    </a>
                  </h3>

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
      </div>
    </section>
  );
}
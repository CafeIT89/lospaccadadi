import Image from "next/image";
import Link from "next/link";
import { getSettimanaleVideos } from "@/lib/settimanale";

export default async function Settimanale() {
  const videos = await getSettimanaleVideos();
  const latestVideos = videos.slice(0, 3);

  return (
    <section
      id="settimanale"
      className="border-b border-brand-border bg-background"
    >
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              Video settimanali
            </p>

            <h2 className="mt-4 font-heading text-4xl uppercase md:text-6xl">
              Il Settimanale
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
              Gli ultimi episodi pubblicati sul canale YouTube di Lo Spacca
              Dadi.
            </p>
          </div>

          <Link
            href="/settimanale"
            className="inline-flex rounded-xl bg-primary px-6 py-3 font-bold text-black transition hover:bg-primary-hover"
          >
            Guarda tutti gli episodi
          </Link>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {latestVideos.map((video) => (
            <a
              key={video.videoId}
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="overflow-hidden rounded-3xl border border-brand-border bg-surface transition hover:border-primary"
            >
              <Image
                src={video.thumbnail}
                alt={video.title}
                width={480}
                height={270}
                className="aspect-video w-full object-cover"
              />

              <div className="p-6">
                <h3 className="font-heading text-2xl uppercase">
                  {video.title}
                </h3>

                <p className="mt-4 text-sm text-muted">
                  {new Date(video.publishedAt).toLocaleDateString("it-IT")}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
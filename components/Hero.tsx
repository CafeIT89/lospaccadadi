import Image from "next/image";
import { Play } from "lucide-react";

import { getSettimanaleVideos } from "@/lib/settimanale";

export default async function Hero() {
  const videos = await getSettimanaleVideos();
  const latestVideo = videos[0];

  return (
    <section className="relative overflow-hidden border-b border-brand-border bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_50%,rgba(254,236,0,0.14),transparent_34%)]" />

      <div className="relative mx-auto grid min-h-[680px] max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8">
        <div>
          <span className="inline-flex rounded-full border border-brand-border bg-primary/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Al servizio dei giocatori
          </span>

          <h1 className="mt-8 max-w-3xl font-heading text-6xl uppercase leading-[0.95] tracking-tight text-white sm:text-7xl lg:text-8xl">
            Le notizie
            <br />
            <span className="text-primary">che contano.</span>
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-muted md:text-xl">
            Lo Spacca Dadi seleziona ogni giorno le notizie più importanti da
            BoardGameGeek, Kickstarter e Gamefound e le trasforma in un
            briefing rapido, chiaro e utile.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#tg-ludico"
              className="rounded-xl bg-primary px-6 py-3 text-center font-bold text-black transition hover:bg-primary-hover"
            >
              Leggi il TG Ludico
            </a>

            <a
              href="#crowdfunding"
              className="rounded-xl border border-brand-border px-6 py-3 text-center font-semibold text-primary transition hover:bg-primary/10"
            >
              Crowdfunding Radar
            </a>
          </div>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <div className="absolute h-80 w-80 rounded-full bg-primary/20 blur-3xl" />

          {latestVideo ? (
            <a
              href={latestVideo.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Guarda ${latestVideo.title} su YouTube`}
              className="group relative w-full max-w-xl overflow-hidden rounded-[2rem] border border-brand-border bg-surface/80 p-3 shadow-2xl shadow-black/50 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-primary"
            >
              <div className="relative aspect-video overflow-hidden rounded-[1.4rem] bg-black">
                <Image
                  src={latestVideo.thumbnail}
                  alt={latestVideo.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                  priority
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-black shadow-xl transition duration-300 group-hover:scale-110 group-hover:bg-white">
                    <Play
                      size={34}
                      fill="currentColor"
                      className="ml-1"
                      aria-hidden="true"
                    />
                  </span>
                </div>

                <div className="absolute bottom-5 left-5">
                  <span className="rounded-full bg-black/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-primary backdrop-blur">
                    Ultimo episodio • Il Settimanale
                  </span>
                </div>
              </div>
            </a>
          ) : (
            <div className="relative w-full max-w-xl rounded-[2rem] border border-brand-border bg-surface/80 p-8 text-center shadow-2xl shadow-black/50 backdrop-blur">
              <p className="font-heading text-2xl uppercase text-white">
                Il Settimanale
              </p>

              <p className="mt-3 text-sm leading-6 text-muted">
                L&apos;ultimo episodio non è momentaneamente disponibile.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
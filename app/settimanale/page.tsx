import Image from "next/image";
import { getSettimanaleVideos } from "@/lib/settimanale";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Il Settimanale",
  description:
    "Video settimanali dedicati ai giochi da tavolo, con approfondimenti, novità e consigli.",
};

export const revalidate = 3600;

export default async function SettimanalePage() {
  const videos = await getSettimanaleVideos();

  return (
    <main className="min-h-screen bg-background text-white">
      <header className="border-b border-brand-border">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
            Lo Spacca Dadi
          </p>

          <h1 className="mt-5 font-heading text-5xl uppercase md:text-7xl">
            Il Settimanale
          </h1>

          <p className="mt-6 max-w-2xl text-xl text-muted">
            Tutti gli episodi della playlist YouTube.
          </p>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-16 md:grid-cols-2 xl:grid-cols-3">
        {videos.map((video) => (
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
              className="w-full"
            />

            <div className="p-6">
              <h2 className="font-heading text-2xl uppercase">
                {video.title}
              </h2>

              <p className="mt-4 text-sm text-muted">
                {new Date(video.publishedAt).toLocaleDateString("it-IT")}
              </p>
            </div>
          </a>
        ))}
      </section>
    </main>
  );
}
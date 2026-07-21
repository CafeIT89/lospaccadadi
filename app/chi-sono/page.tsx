import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chi sono",
  description:
    "Scopri chi c'è dietro Lo Spacca Dadi e la passione per il mondo dei giochi da tavolo.",
};

export default function ChiSonoPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-brand-border">
        <div className="mx-auto max-w-7xl px-6 py-16">

          <Image
            src="/images/banner-youtube.png"
            alt="Lo Spacca Dadi"
            width={1920}
            height={1080}
            className="w-full rounded-3xl border border-brand-border object-cover"
          />

          <div className="mx-auto mt-16 max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              Chi sono
            </p>

            <h1 className="mt-4 font-heading text-5xl uppercase text-white md:text-7xl">
              Lo Spacca Dadi
            </h1>

            <div className="mt-10 space-y-6 text-lg leading-8 text-muted">
              <p>
                <strong className="text-white">
                  Recensioni, Tutorial e Unboxing! Ah, e dadi, OVVIAMENTE! 🎲
                </strong>
              </p>

              <p>
                Il canale nasce con l’idea di voler parlare, divertire e dare
                informazioni riguardo il fantastico mondo dei giochi da tavolo,
                specialmente per quelli cooperativi e pieni di dadi!
              </p>

              <p>
                Troverai consigli, recensioni, tutorial, unboxing e qualunque
                altra cosa possa venire in mente durante il naturale percorso
                delle cose!
              </p>

              <p className="font-semibold text-white">
                Buon gioco, Giocatori!

                Per richieste commerciali, contattami al lospaccadadi@gmail.com
              </p>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chi sono",
  description:
    "Scopri chi c'è dietro Lo Spacca Dadi e la passione per il mondo dei giochi da tavolo.",
};

const brands = [
  {
    name: "Awaken Realms",
    logo: "/images/brands/Awaken Realms.png",
  },
  {
    name: "Bell's On Games",
    logo: "/images/brands/bell's on games.jpg",
  },
  {
    name: "Chip Theory Games",
    logo: "/images/brands/chip theory games.webp",
  },
  {
    name: "Knights Creations",
    logo: "/images/brands/knight creations.png",
  },
  {
    name: "Little Rocket Games",
    logo: "/images/brands/little rocket games.png",
  },
  {
    name: "Ludus Magnus Studio",
    logo: "/images/brands/Ludus Magnus Studio.png",
  },
  {
    name: "Magma Games",
    logo: "/images/brands/Magma Games.webp",
  },
  {
    name: "Metamorph Games",
    logo: "/images/brands/Metamorph Games.webp",
  },
  {
    name: "Red Glove",
    logo: "/images/brands/Red Glove.png",
  },
  {
    name: "Smart Flamingo",
    logo: "/images/brands/Smart Flamingo.png",
  },
];

export default function ChiSonoPage() {
  return (
    <main className="min-h-screen bg-background text-white">
      <section className="border-b border-brand-border">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <Image
              src="/images/banner-youtube.png"
              alt="Lo Spacca Dadi"
              width={1920}
              height={1080}
              className="w-full rounded-3xl border border-brand-border object-cover"
              priority
            />
          </div>

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
              </p>

              <p>
                Per richieste commerciali, contattami a{" "}
                <a
                  href="mailto:lospaccadadi@gmail.com"
                  className="font-semibold text-primary transition hover:text-primary-hover"
                >
                  lospaccadadi@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-brand-border bg-surface/30">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              Collaborazioni
            </p>

            <h2 className="mt-4 font-heading text-4xl uppercase text-white md:text-6xl">
              Brand con cui ho collaborato
            </h2>

            <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-muted">
              Nel corso degli anni ho avuto il piacere di collaborare con
              editori e realtà del settore dei giochi da tavolo, realizzando
              recensioni, anteprime, tutorial, unboxing e contenuti dedicati.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {brands.map((brand) => (
              <div
                key={brand.name}
                className="group flex min-h-40 items-center justify-center rounded-3xl border border-brand-border bg-surface p-6 transition duration-300 hover:-translate-y-1 hover:border-primary"
              >
                <div className="relative h-20 w-full">
                  <Image
                    src={brand.logo}
                    alt={`Logo ${brand.name}`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-contain transition duration-300 group-hover:scale-105"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
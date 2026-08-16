import Link from "next/link";
import type { Metadata } from "next";

import {
  getAvailableLetters,
  getStampe3DGames,
} from "@/data/stampe-3d";

export const metadata: Metadata = {
  title: "Stampe 3D",
  description:
    "Archivio di progetti per la stampa 3D dedicati ai giochi da tavolo.",

  robots: {
    index: false,
    follow: false,
  },
};

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function Stampe3DPage() {
  const games = getStampe3DGames();
  const availableLetters = new Set(getAvailableLetters());

  return (
    <main className="min-h-screen bg-background text-white">
      <section className="border-b border-brand-border">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
            Archivio della community
          </p>

          <h1 className="mt-5 font-heading text-5xl uppercase md:text-7xl">
            Stampe 3D
          </h1>

          <p className="mt-6 max-w-3xl text-xl leading-8 text-muted">
            Raccolte curate di progetti per la stampa 3D dedicati ai giochi da
            tavolo.
          </p>
        </div>
      </section>
<section className="mx-auto max-w-7xl px-6 py-14">
  <div>
    <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
      Esplora per lettera
    </p>

    <h2 className="mt-4 font-heading text-4xl uppercase md:text-5xl">
      Indice alfabetico
    </h2>

    <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
      Seleziona una lettera per vedere i giochi disponibili nell&apos;archivio.
    </p>
  </div>

  <div className="mt-8 flex flex-wrap gap-3">
    {ALPHABET.map((letter) => {
      const isAvailable = availableLetters.has(letter);

      if (!isAvailable) {
        return (
          <span
            key={letter}
            className="flex h-12 w-12 cursor-not-allowed items-center justify-center rounded-xl border border-brand-border bg-background font-heading text-xl uppercase text-muted/40"
            aria-disabled="true"
          >
            {letter}
          </span>
        );
      }

      return (
        <Link
          key={letter}
          href={`/stampe-3d/${letter.toLowerCase()}`}
          className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary bg-background font-heading text-xl uppercase text-white transition hover:-translate-y-0.5 hover:bg-primary hover:text-black"
        >
          {letter}
        </Link>
      );
    })}
  </div>
</section>
     <section className="mx-auto max-w-7xl px-6 pb-14">
  <div className="rounded-3xl border border-brand-border bg-surface p-6 md:p-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.15em] text-primary">
                Italiano
              </p>

              <h2 className="mt-3 font-heading text-2xl uppercase text-white">
                Informazioni sull&apos;archivio
              </h2>

              <div className="mt-4 space-y-4 text-sm leading-7 text-muted">
                <p>
                  Questa sezione nasce esclusivamente come archivio gratuito a
                  servizio della community dei giocatori, con lo scopo di
                  raccogliere e rendere più semplici da trovare progetti e
                  risorse per la stampa 3D dedicati ai giochi da tavolo.
                </p>

                <p>
                  Lo Spacca Dadi non è autore, proprietario o venditore dei
                  progetti raccolti in queste pagine e non riceve alcun
                  compenso, commissione o altro beneficio economico dai link
                  pubblicati, salvo ove diversamente ed esplicitamente
                  indicato.
                </p>

                <p>
                  Tutti i progetti appartengono ai rispettivi autori e vengono
                  collegati alle loro pagine originali. Per licenze, condizioni
                  d&apos;uso, download e diritti sui singoli progetti, fate
                  sempre riferimento alle informazioni fornite dai rispettivi
                  creatori.
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.15em] text-primary">
                English
              </p>

              <h2 className="mt-3 font-heading text-2xl uppercase text-white">
                About this archive
              </h2>

              <div className="mt-4 space-y-4 text-sm leading-7 text-muted">
                <p>
                  This section is provided exclusively as a free archive for the
                  gaming community, created to collect and make it easier to
                  discover 3D-printing projects and resources related to board
                  games.
                </p>

                <p>
                  Lo Spacca Dadi is not the author, owner, or seller of the
                  projects listed on these pages and receives no payment,
                  commission, or other financial benefit from the published
                  links, unless explicitly stated otherwise.
                </p>

                <p>
                  All projects remain the property of their respective creators
                  and are linked to their original pages. For licenses, terms of
                  use, downloads, and rights related to individual projects,
                  always refer to the information provided by their respective
                  creators.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    
        <div className="mt-12 rounded-3xl border border-brand-border bg-surface p-6">
          <p className="text-sm text-muted">
            Giochi attualmente presenti nell&apos;archivio:{" "}
            <strong className="text-white">{games.length}</strong>
          </p>
        </div>
    
    </main>
  );
}
import Image from "next/image";

const games = [
  {
    title: "The Witcher - Il Vecchio Mondo",
    url: "https://boardgamegeek.com/boardgame/331106/the-witcher-old-world",
    image: "/games/the-witcher-old-world.png",
  },
  {
    title: "Kinfire Delve - Callous' Lab",
    url: "https://boardgamegeek.com/boardgame/406174/kinfire-delve-callous-lab",
    image: "/games/kinfire-delve-callous-lab.png",
  },
  {
    title: "Dragons of Etchinstone",
    url: "https://boardgamegeek.com/boardgame/367086/dragons-of-etchinstone",
    image: "/games/dragons-of-etchinstone.png",
  },
  {
    title: "Grimcoven",
    url: "https://boardgamegeek.com/boardgame/415845/grimcoven",
    image: "/games/grimcoven.png",
  },
  {
    title: "Too Many Bones",
    url: "https://boardgamegeek.com/boardgame/192135/too-many-bones",
    image: "/games/too-many-bones.png",
  },
];

export default function CheCosaGiochiamoSidebar() {
  return (
    <aside className="rounded-3xl border border-brand-border bg-surface p-5">
      <div className="border-b border-brand-border pb-4">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
          Sul nostro tavolo
        </p>

        <h2 className="mt-2 font-heading text-2xl uppercase leading-tight tracking-[0.06em] text-white">
          Che cosa giochiamo?
        </h2>
      </div>

      <div>
        {games.map((game) => (
          <a
            key={game.url}
            href={game.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex gap-3 border-b border-brand-border py-4 last:border-b-0"
          >
            <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-background">
              <Image
                src={game.image}
                alt={game.title}
                fill
                sizes="64px"
                className="object-cover transition duration-300 group-hover:scale-105"
              />
            </div>

            <div className="flex min-w-0 items-center">
              <h3 className="text-sm font-bold leading-5 text-white transition group-hover:text-primary">
                {game.title}
              </h3>
            </div>
          </a>
        ))}
      </div>

      <p className="mt-4 text-xs leading-5 text-muted">
        I giochi che stiamo portando sul tavolo in questo periodo.
      </p>
    </aside>
  );
}
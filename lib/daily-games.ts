export type DailyGame = {
  title: string;
  url: string;
  image: string;
};

export const games: DailyGame[] = [
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
  {
    title: "Runar",
    url: "https://boardgamegeek.com/boardgame/369995/runar",
    image: "/games/runar.png",
  },
  {
    title: "The Breach",
    url: "https://boardgamegeek.com/boardgame/359927/the-breach",
    image: "/games/the-breach.png",
  },
  {
    title: "Cloudspire",
    url: "https://boardgamegeek.com/boardgame/262211/cloudspire",
    image: "/games/cloudspire.png",
  },
  {
    title: "Labyrinth Chronicles",
    url: "https://boardgamegeek.com/boardgame/440136/labyrinth-chronicles",
    image: "/games/labyrinth-chronicles.png",
  },
  {
    title: "Dune - Guerra per Arrakis",
    url: "https://boardgamegeek.com/boardgame/367150/dune-war-for-arrakis",
    image: "/games/dune-war-for-arrakis.png",
  },
  {
    title: "La Guerra dell'Anello",
    url: "https://boardgamegeek.com/boardgame/9609/war-of-the-ring",
    image: "/games/war-of-the-ring.png",
  },
  {
    title: "Final Girl",
    url: "https://boardgamegeek.com/boardgame/277659/final-girl",
    image: "/games/final-girl.png",
  },
  {
    title: "Z Horde",
    url: "https://boardgamegeek.com/boardgame/472461/z-horde",
    image: "/games/z-horde.png",
  },
];

function createSeedFromDate(date: Date): number {
  const dateString = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Rome",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

  let seed = 0;

  for (let i = 0; i < dateString.length; i++) {
    seed = (seed * 31 + dateString.charCodeAt(i)) >>> 0;
  }

  return seed;
}

function seededRandom(seed: number) {
  let value = seed;

  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

export function getDailyGames(
  count = 5,
  date = new Date()
): DailyGame[] {
  const random = seededRandom(createSeedFromDate(date));
  const shuffled = [...games];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, Math.min(count, shuffled.length));
}
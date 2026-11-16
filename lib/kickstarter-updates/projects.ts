
export type KickstarterTrackedProject = {
  name: string;
  creator: string;
  slug: string;
  fallbackImage?: string;
};

export const KICKSTARTER_PROJECTS: KickstarterTrackedProject[] = [
  {
    name: "Camp Grizzly: Second Edition",
    creator: "trickortreatstudios",
    slug: "camp-grizzly-second-edition-all-new-expansion-material",
  },
  {
    name: "Dice Throne Nexus",
    creator: "dicethrone",
    slug: "dice-throne-nexus",
  },
  {
    name: "Origins of Light: A Final Fantasy Board Game",
    creator: "kessent",
    slug: "origins-of-light-a-final-fantasy-board-game",
  },
  {
    name: "Accidental Heroes",
    creator: "lucky-duck-games",
    slug: "accidental-heroes-0",
  },
  {
    name: "Terminator 2: The Board Game",
    creator: "cationarts",
    slug: "terminator-2-the-board-game",
    fallbackImage:
      "https://i.kickstarter.com/assets/055/881/420/fa65c1fbbdf90f8a849aa322e66eec52_original.png?fit=scale-down&origin=ugc&q=100&v=1794562630&width=680&sig=3XMClWzkKoWoh293dzjMaxJ5MFEJmdNbqu3W%2BNzO0RQ%3D",
  },
];

import fs from "node:fs/promises";
import path from "node:path";

const API_URL =
  "https://gamefound.com/api/public/projects/getActiveCrowdfundingProjects";

const OUTPUT_PATH = path.join(
  process.cwd(),
  "data",
  "gamefound-ranking.json"
);

type GamefoundProject = {
  backerCount: number;
  campaignEndDate: string;
  campaignGoal: number;
  campaignStartDate: string;
  commentCount: number;
  creatorName: string;
  creatorUrlName: string;
  currencyShortName: string;
  fundsGathered: number;
  projectHomeUrl: string;
  projectImageUrl: string;
  projectName: string;
  projectType: number;
  projectUrlName: string;
  rewardCount: number;
  shortDescription: string;
  updateCount: number;
};

type RankingProject = {
  name: string;
  creator: string;
  url: string;
  image: string;
  fundsGathered: number;
  currency: string;
  backerCount: number;
  campaignEndDate: string;
};

type RankingFile = {
  updatedAt: string;
  projects: RankingProject[];
};

async function readExistingFile(): Promise<RankingFile | null> {
  try {
    const content = await fs.readFile(
      OUTPUT_PATH,
      "utf8"
    );

    return JSON.parse(content) as RankingFile;
  } catch {
    return null;
  }
}

function projectsAreEqual(
  current: RankingProject[],
  previous: RankingProject[]
): boolean {
  return JSON.stringify(current) === JSON.stringify(previous);
}

async function main() {
  console.log(
    "[Gamefound Ranking] Recupero campagne attive..."
  );

  const response = await fetch(API_URL, {
    headers: {
      Accept: "application/json",
      "User-Agent": "LoSpaccaDadi/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Gamefound API ha restituito ${response.status} ${response.statusText}`
    );
  }

  const projects =
    (await response.json()) as GamefoundProject[];

  console.log(
    `[Gamefound Ranking] ${projects.length} campagne ricevute.`
  );

  const ranking: RankingProject[] = projects
    .filter(
      (project) =>
        project.projectName &&
        project.projectHomeUrl &&
        Number.isFinite(project.fundsGathered)
    )
    .sort(
      (a, b) =>
        b.fundsGathered - a.fundsGathered
    )
    .slice(0, 5)
    .map((project) => ({
      name: project.projectName,
      creator: project.creatorName,
      url: project.projectHomeUrl,
      image: project.projectImageUrl,
      fundsGathered: project.fundsGathered,
      currency: project.currencyShortName,
      backerCount: project.backerCount,
      campaignEndDate: project.campaignEndDate,
    }));

  console.table(
    ranking.map((project, index) => ({
      posizione: index + 1,
      progetto: project.name,
      raccolto: project.fundsGathered,
      valuta: project.currency,
      backer: project.backerCount,
    }))
  );

  const existing = await readExistingFile();

  if (
    existing &&
    projectsAreEqual(ranking, existing.projects)
  ) {
    console.log(
      "[Gamefound Ranking] Nessuna modifica rilevata. Il file non verrà riscritto."
    );

    return;
  }

  const output: RankingFile = {
    updatedAt: new Date().toISOString(),
    projects: ranking,
  };

  await fs.mkdir(path.dirname(OUTPUT_PATH), {
    recursive: true,
  });

  await fs.writeFile(
    OUTPUT_PATH,
    JSON.stringify(output, null, 2) + "\n",
    "utf8"
  );

  console.log(
    `[Gamefound Ranking] Classifica aggiornata: salvate ${ranking.length} campagne.`
  );
}

main().catch((error) => {
  console.error(
    "[Gamefound Ranking] Aggiornamento fallito."
  );

  console.error(error);

  process.exit(1);
});
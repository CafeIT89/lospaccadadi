export type GamefoundProject = {
  title: string;
  description: string;
  image: string;
  url: string;
  endDate: string;
  backers: number;
  raised: number;
  goal: number;
  currency: string;
};

type GamefoundApiProject = {
  backerCount?: number;
  campaignEndDate?: string;
  campaignGoal?: number;
  currencyShortName?: string;
  fundsGathered?: number;
  projectName?: string;
  shortDescription?: string;
  projectHomeUrl?: string;
  projectImageUrl?: string;
};

const GAMEFOUND_API =
  "https://gamefound.com/api/public/projects/getActiveCrowdfundingProjects";

export async function getGamefoundProjects(): Promise<GamefoundProject[]> {
  try {
    const response = await fetch(GAMEFOUND_API, {
      next: {
        revalidate: 3600,
      },
    });

    if (!response.ok) {
      throw new Error(`Errore Gamefound: ${response.status}`);
    }

    const data = (await response.json()) as GamefoundApiProject[];

    return data
      .filter(
        (project) =>
          project.projectName &&
          project.projectHomeUrl &&
          project.projectImageUrl
      )
      .slice(0, 4)
      .map((project) => ({
        title: project.projectName ?? "",
        description: project.shortDescription ?? "",
        image: project.projectImageUrl ?? "",
        url: project.projectHomeUrl ?? "",
        endDate: project.campaignEndDate ?? "",
        backers: project.backerCount ?? 0,
        raised: project.fundsGathered ?? 0,
        goal: project.campaignGoal ?? 0,
        currency: project.currencyShortName ?? "",
      }));
  } catch (error) {
    console.error("Errore nel caricamento di Gamefound:", error);
    return [];
  }
}
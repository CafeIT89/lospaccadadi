import * as cheerio from "cheerio";

export type KickstarterProject = {
  title: string;
  description: string;
  image: string;
  url: string;
};

const URL =
  "https://www.kickstarter.com/discover/categories/games/tabletop%20games?sort=newest";

export async function getKickstarterProjects(): Promise<KickstarterProject[]> {
  try {
    const response = await fetch(URL, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
      next: {
        revalidate: 3600,
      },
    });

    if (!response.ok) {
      throw new Error("Errore nel recupero Kickstarter");
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const projects: KickstarterProject[] = [];

    $("div[data-project]").each((_, element) => {
      if (projects.length >= 2) return;

      const raw = $(element).attr("data-project");
      if (!raw) return;

      try {
        const project = JSON.parse(raw);

        projects.push({
          title: project.name,
          description: project.blurb,
          image: project.photo?.full || project.photo?.little || "",
          url: `https://www.kickstarter.com/projects/${project.slug}`,
        });
      } catch {}
    });

    return projects;
  } catch (error) {
    console.error(error);
    return [];
  }
}
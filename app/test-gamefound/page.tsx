import Image from "next/image";
import { getGamefoundProjects } from "@/lib/gamefound";

export const revalidate = 3600;

export default async function TestGamefoundPage() {
  const projects = await getGamefoundProjects();

  return (
    <main className="min-h-screen bg-background px-6 py-16 text-white">
      <div className="mx-auto max-w-7xl">
        <h1 className="font-heading text-5xl uppercase text-primary">
          Test Gamefound
        </h1>

        {projects.length === 0 ? (
          <p className="mt-10 text-muted">
            Nessuna campagna trovata.
          </p>
        ) : (
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {projects.map((project) => (
              <article
                key={project.url}
                className="overflow-hidden rounded-3xl border border-brand-border bg-surface"
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  width={800}
                  height={450}
                  className="aspect-video w-full object-cover"
                />

                <div className="p-6">
                  <p className="text-sm font-bold uppercase tracking-[0.15em] text-primary">
                    Gamefound
                  </p>

                  <h2 className="mt-4 font-heading text-3xl uppercase">
                    {project.title}
                  </h2>

                  <p className="mt-4 text-muted">
                    {project.description}
                  </p>

                  <div className="mt-5 space-y-1 text-sm text-muted">
                    <p>
                      Raccolti: {project.raised.toLocaleString("it-IT")}{" "}
                      {project.currency}
                    </p>

                    <p>
                      Obiettivo: {project.goal.toLocaleString("it-IT")}{" "}
                      {project.currency}
                    </p>

                    <p>
                      Sostenitori: {project.backers.toLocaleString("it-IT")}
                    </p>
                  </div>

                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-bold uppercase text-black"
                  >
                    Vai alla campagna
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
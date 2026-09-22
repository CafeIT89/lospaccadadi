export type RiepilogoRegole = {
  name: string;
  slug: string;
  description?: string;
  file: string;
  type: string;
  letters?: string[];
};

export const RIEPILOGHI: RiepilogoRegole[] = [
  {
    name: "Cloudspire",
    slug: "cloudspire",
    description: "Riepilogo delle regole di Cloudspire.",
    file: "/pdf/riepiloghi/cloudspire-riepilogo-regole.pdf",
    type: "Scheda riepilogativa",
  },
  {
    name: "Dragons of Etchinstone",
    slug: "dragons-of-etchinstone",
    description: "Riepilogo delle regole di Dragons of Etchinstone.",
    file: "/pdf/riepiloghi/dragons-of-etchinstone-riepilogo-regole.pdf",
    type: "Scheda riepilogativa",
  },
 {
  name: "Marvel Zombies / X-Men Resistance",
  slug: "marvel-zombies-x-men-resistance",
  description:
    "Tabelle riepilogative per tenere traccia delle missioni di Marvel Zombies, X-Men Resistance e delle relative espansioni.",
  file: "/file-utili/marvel-zombies-tabella-missioni.pdf",
  type: "Tabella missioni",
  letters: ["M", "X"],
},
];

export function getRiepilogoLetters(
  riepilogo: RiepilogoRegole
): string[] {
  if (riepilogo.letters && riepilogo.letters.length > 0) {
    return riepilogo.letters.map((letter) => letter.toUpperCase());
  }

  return [riepilogo.name.charAt(0).toUpperCase()];
}
export function getRiepiloghi(): RiepilogoRegole[] {
  return [...RIEPILOGHI].sort((a, b) =>
    a.name.localeCompare(b.name, "it")
  );
}
export function getRiepilogoLetter(
  riepilogo: RiepilogoRegole
): string {
  return getRiepilogoLetters(riepilogo)[0];
}

export function getRiepiloghiByLetter(
  letter: string
): RiepilogoRegole[] {
  const normalizedLetter = letter.toUpperCase();

  return getRiepiloghi().filter((riepilogo) =>
    getRiepilogoLetters(riepilogo).includes(normalizedLetter)
  );
}

export function getAvailableRiepiloghiLetters(): string[] {
  return Array.from(
    new Set(
      RIEPILOGHI.flatMap((riepilogo) =>
        getRiepilogoLetters(riepilogo)
      )
    )
  ).sort();
}

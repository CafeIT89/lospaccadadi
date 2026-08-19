export type RiepilogoRegole = {
  name: string;
  slug: string;
  description?: string;
  file: string;
};

export const RIEPILOGHI: RiepilogoRegole[] = [
   {
    name: "Cloudspire",
    slug: "cloudspire",
    description:
      "Riepilogo delle regole di Cloudspire.",
    file:
      "/pdf/riepiloghi/cloudspire-riepilogo-regole.pdf",
  },
  {
    name: "Dragons of Etchinstone",
    slug: "dragons-of-etchinstone",
    description:
      "Riepilogo delle regole di Dragons of Etchinstone.",
    file:
      "/pdf/riepiloghi/dragons-of-etchinstone-riepilogo-regole.pdf",
  },
];

export function getRiepiloghi(): RiepilogoRegole[] {
  return [...RIEPILOGHI].sort((a, b) =>
    a.name.localeCompare(b.name, "it")
  );
}

export function getRiepilogoLetter(
  riepilogo: RiepilogoRegole
): string {
  return riepilogo.name.charAt(0).toUpperCase();
}

export function getRiepiloghiByLetter(
  letter: string
): RiepilogoRegole[] {
  const normalizedLetter = letter.toUpperCase();

  return getRiepiloghi().filter(
    (riepilogo) =>
      getRiepilogoLetter(riepilogo) === normalizedLetter
  );
}

export function getAvailableRiepiloghiLetters(): string[] {
  return Array.from(
    new Set(
      RIEPILOGHI.map((riepilogo) =>
        getRiepilogoLetter(riepilogo)
      )
    )
  ).sort();
}

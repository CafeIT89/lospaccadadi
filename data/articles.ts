export const articles = [
  {
    slug: "nuova-campagna-fantasy",
    category: "Crowdfunding",
    categorySlug: "crowdfunding",
    title: "Una nuova campagna fantasy entra nel radar",
    date: "19 luglio 2026",
    excerpt:
      "Prime impressioni, punti di forza e aspetti da tenere d'occhio prima del pledge.",
    content: [
      "Il mondo del crowdfunding ludico continua a proporre nuovi progetti fantasy.",
      "Prima di partecipare è importante osservare il regolamento e i tempi di consegna.",
      "Questa campagna sarà seguita nei prossimi aggiornamenti.",
    ],
  },
  {
    slug: "campagne-narrative-lunghe",
    category: "Dungeon Crawler",
    categorySlug: "dungeon-crawler",
    title: "Il ritorno delle campagne narrative lunghe",
    date: "18 luglio 2026",
    excerpt:
      "Perché i giochi cooperativi a campagna continuano a conquistare il pubblico.",
    content: [
      "Le campagne narrative lunghe continuano ad attirare molti giocatori.",
      "La crescita dei personaggi crea un forte legame con il gruppo.",
      "La sfida principale è mantenere alta la qualità nel tempo.",
    ],
  },
  {
    slug: "miniature-e-gioco",
    category: "Miniature",
    categorySlug: "miniature",
    title: "Quando le miniature migliorano davvero il gioco",
    date: "17 luglio 2026",
    excerpt:
      "Produzione spettacolare, ma anche leggibilità, atmosfera e presenza al tavolo.",
    content: [
      "Le miniature possono aumentare l'impatto visivo del gioco.",
      "Sono utili quando migliorano la leggibilità della partita.",
      "Il valore dipende da come vengono integrate nel design.",
    ],
  },
];

export type Article = (typeof articles)[number];
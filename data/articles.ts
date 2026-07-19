export const articles = [
  {
    slug: "nuova-campagna-fantasy",
    category: "Crowdfunding",
    title: "Una nuova campagna fantasy entra nel radar",
    date: "19 luglio 2026",
    excerpt:
      "Prime impressioni, punti di forza e aspetti da tenere d'occhio prima del pledge.",
    content: [
      "Il mondo del crowdfunding ludico continua a proporre nuovi progetti fantasy, spesso accompagnati da miniature, campagne narrative e sistemi di progressione.",
      "Prima di partecipare è importante osservare con attenzione il regolamento, la qualità della comunicazione, i tempi di consegna previsti e l'esperienza dell'editore.",
      "Questa campagna sarà seguita nei prossimi aggiornamenti di Lo Spacca Dadi, con particolare attenzione alla struttura degli scenari e alla varietà delle scelte offerte ai giocatori.",
    ],
  },
  {
    slug: "campagne-narrative-lunghe",
    category: "Dungeon Crawler",
    title: "Il ritorno delle campagne narrative lunghe",
    date: "18 luglio 2026",
    excerpt:
      "Perché i giochi cooperativi a campagna continuano a conquistare il pubblico.",
    content: [
      "Le campagne narrative lunghe continuano ad attirare giocatori interessati a vivere storie che si sviluppano partita dopo partita.",
      "La crescita dei personaggi e le decisioni permanenti aiutano a creare un legame più forte con il gruppo e con il mondo di gioco.",
      "La sfida principale resta mantenere alta la qualità dell'esperienza anche dopo molte sessioni.",
    ],
  },
  {
    slug: "miniature-e-gioco",
    category: "Miniature",
    title: "Quando le miniature migliorano davvero il gioco",
    date: "17 luglio 2026",
    excerpt:
      "Produzione spettacolare, ma anche leggibilità, atmosfera e presenza al tavolo.",
    content: [
      "Le miniature possono aumentare l'impatto visivo di un gioco, ma non sempre migliorano davvero l'esperienza.",
      "Quando aiutano a leggere meglio la posizione dei personaggi e rendono più chiaro lo stato della partita, diventano parte integrante del design.",
      "Il valore non dipende soltanto dalla quantità, ma dal modo in cui vengono utilizzate durante il gioco.",
    ],
  },
];

export type Article = (typeof articles)[number];
/** Inserted every 4th search result as editorial aside. */
export const FILM_FACTS: string[] = [
  "The first Academy Awards ceremony lasted only 15 minutes.",
  "Some films use real archival footage blended seamlessly with new material.",
  "Silent films often had live musical accompaniment unique to each venue.",
  "Many classic noir films were shot on a shoestring in under two weeks.",
  "Practical effects still outperform CGI for certain textures and light.",
];

export function factForIndex(index: number): string {
  return FILM_FACTS[index % FILM_FACTS.length];
}

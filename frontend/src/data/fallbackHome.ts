import type { MovieDetail, MovieSummary } from "../services/api";

/**
 * Offline / API-unreachable fallbacks so Home always has something to render.
 * Shown only when the device cannot reach the backend at all.
 */

export const FALLBACK_FEATURED_FILM: MovieDetail = {
  id: 238,
  title: "The Godfather",
  poster_path: "/3bhkrj58Vtu7enYsLkXQUMdBMEP.jpg",
  backdrop_path: "/tmU7GeKVybMWFButWEGl2M4GeiP.jpg",
  release_date: "1972-03-14",
  vote_average: 8.7,
  vote_count: 1_900_000,
  overview:
    "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
  runtime: 175,
  genres: [
    { id: 18, name: "Drama" },
    { id: 80, name: "Crime" },
  ],
  cast: [],
  crew: [{ name: "Francis Ford Coppola", job: "Director" }],
  tagline: "An offer you can't refuse.",
  keywords: [],
};

export const FALLBACK_RECOMMENDATIONS: MovieSummary[] = [
  {
    id: 278,
    title: "The Shawshank Redemption",
    poster_path: "/lyQBXzOQSuE59IsHyhrp0qIiPAz.jpg",
    release_date: "1994-09-23",
    vote_average: 8.7,
    vote_count: 1,
  },
  {
    id: 424,
    title: "Schindler's List",
    poster_path: "/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
    release_date: "1993-11-29",
    vote_average: 8.6,
    vote_count: 1,
  },
  {
    id: 680,
    title: "Pulp Fiction",
    poster_path: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    release_date: "1994-09-10",
    vote_average: 8.5,
    vote_count: 1,
  },
  {
    id: 13,
    title: "Forrest Gump",
    poster_path: "/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
    release_date: "1994-07-06",
    vote_average: 8.5,
    vote_count: 1,
  },
];

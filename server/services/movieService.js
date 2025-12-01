import Movie from "../models/Movie.js";

export async function getPopularMovies(limit = 5) {
  return Movie.find({}).sort({ vote_average: -1 }).limit(limit);
}

export async function getMoviesByGenre(genreName, limit = 10) {
  if (!genreName) return [];

  const normalized = genreName.toLowerCase();
  const movies = await Movie.find({});

  return movies
    .filter((m) =>
      m.genres?.some((g) =>
        typeof g === "string"
          ? g.toLowerCase().includes(normalized)
          : g?.name?.toLowerCase().includes(normalized)
      )
    )
    .slice(0, limit);
}

export async function getRandomRecommendations(limit = 5) {
  const movies = await Movie.find({});
  return movies.sort(() => 0.5 - Math.random()).slice(0, limit);
}

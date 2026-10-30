// TMDB는 page query를 1부터 500까지만 받아요.
export const TMDB_MAX_PAGE = 500;

export function parsePage(value: unknown) {
  const page = Number(value);
  return Number.isInteger(page) && page >= 1 && page <= TMDB_MAX_PAGE ? page : undefined;
}

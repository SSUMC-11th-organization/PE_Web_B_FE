import { useQueries, useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { favoriteQueries } from "../../api/favorites/favorites";
import { movieQueries } from "../../api/movies/movie-queries";
import { useAuthStore } from "../../stores/auth-store";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { BookmarkButton } from "../bookmark-button";
import { MovieImage } from "../movies/movie-image";
import Pagination from "../movies/pagination";
export function FavoritesGrid() {
  const token = useAuthStore((state) => state.accessToken);
  const favorites = useQuery(favoriteQueries.list(token));
  const [selectedPage, setSelectedPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil((favorites.data?.length ?? 0) / 5));
  const page = Math.min(selectedPage, totalPages);
  const visible = (favorites.data ?? []).slice((page - 1) * 5, page * 5);
  const movies = useQueries({
    queries: visible.map((favorite) => movieQueries.detail(favorite.movieId)),
  });
  if (favorites.isLoading) return <p role="status">즐겨찾기를 불러오는 중이에요.</p>;
  if (favorites.isError)
    return (
      <div role="alert">
        <p>즐겨찾기를 불러오지 못했어요.</p>
        <button type="button" onClick={() => void favorites.refetch()}>
          다시 시도
        </button>
      </div>
    );
  if (!favorites.data?.length)
    return (
      <p className="py-8 text-sm text-[#606774]">
        아직 즐겨찾기한 영화가 없어요. 영화 상세에서 추가해 보세요.
      </p>
    );
  return (
    <>
      <div className="profile-movie-grid">
        {visible.map((favorite, index) => {
          const query = movies[index];
          return (
            <article key={favorite.favoriteId}>
              {query.data ? (
                <>
                  <Link to="/movies/$movieId" params={{ movieId: String(favorite.movieId) }}>
                    <MovieImage
                      className="profile-poster"
                      src={getTmdbPosterUrl(query.data.poster_path)}
                      alt={`${query.data.title} 포스터`}
                    />
                    <h3>{query.data.title}</h3>
                  </Link>
                  <p>{query.data.release_date}</p>
                </>
              ) : query.isError ? (
                <div className="rounded-lg border p-4" role="alert">
                  <p>영화 #{favorite.movieId} 정보를 불러오지 못했어요.</p>
                  <button type="button" onClick={() => void query.refetch()}>
                    영화 정보 다시 시도
                  </button>
                </div>
              ) : (
                <p role="status">영화 정보 확인 중…</p>
              )}
              <div className="mt-3">
                <BookmarkButton movieId={favorite.movieId} />
              </div>
            </article>
          );
        })}
      </div>
      <Pagination page={page} totalPages={totalPages} onPageChange={setSelectedPage} />
    </>
  );
}

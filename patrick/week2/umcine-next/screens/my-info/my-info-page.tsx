"use client";

import Link from "next/link";
import { useQueries, useQuery } from "@tanstack/react-query";
import { getMe } from "@/api/members/me";
import { favoriteQueries } from "@/api/favorites/favorite-queries";
import { movieQueries } from "@/api/movies/movie-queries";
import { ErrorMessage } from "@/components/error-message";
import { getTmdbPosterUrl } from "@/utils/movies/tmdb-image";
import { useAuthStore } from "@/stores/auth-store";

export function MyInfoPage() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  // 1) 즐겨찾기 목록: 서버는 movieId만 알려줘요
  const favoritesQuery = useQuery(favoriteQueries.list());
  const favorites = favoritesQuery.data ?? [];

  // 2) 각 movieId로 TMDB에서 제목과 포스터를 가져와요
  const movieResults = useQueries({
    queries: favorites.map((favorite) => movieQueries.detail(favorite.movieId)),
  });

  return (
    <div className="mx-auto w-full max-w-5xl px-12 pb-16">
      <div className="flex items-center justify-between py-4">
        <h1 className="m-0 text-2xl font-bold text-gray-900">내 정보</h1>
        <Link
          href="/my-info/edit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white no-underline hover:bg-blue-700"
        >
          정보 수정
        </Link>
      </div>

      <section className="border-t border-gray-200 py-6">
        <h2 className="m-0 mb-4 text-sm font-bold text-gray-900">기본 정보</h2>
        <div className="flex items-center gap-6">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-600">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-7 w-7"
              fill="currentColor"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21a8 8 0 0 1 16 0z" />
            </svg>
          </div>
          <dl className="m-0 grid flex-1 grid-cols-2 gap-6">
            <div>
              <dt className="text-xs text-gray-400">닉네임</dt>
              <dd className="m-0 mt-1 text-sm font-bold text-gray-900">
                {meQuery.data?.nickname ?? "-"}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-gray-400">이메일</dt>
              <dd className="m-0 mt-1 text-sm font-bold text-gray-900">
                {meQuery.data?.email ?? "-"}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="border-t border-gray-200 py-6">
        <h2 className="m-0 mb-4 text-sm font-bold text-gray-900">내 즐겨찾기</h2>

        {favoritesQuery.isPending ? (
          <p className="m-0 text-sm text-gray-500">
            즐겨찾기를 불러오는 중이에요.
          </p>
        ) : favoritesQuery.isError ? (
          <ErrorMessage
            message="즐겨찾기를 불러오지 못했어요."
            onRetry={() => favoritesQuery.refetch()}
          />
        ) : favorites.length === 0 ? (
          <p className="m-0 text-sm text-gray-500">즐겨찾기한 영화가 없어요.</p>
        ) : (
          <ul className="m-0 grid list-none grid-cols-2 gap-6 p-0 sm:grid-cols-3 md:grid-cols-5">
            {favorites.map((favorite, index) => {
              const movie = movieResults[index]?.data;
              const posterUrl = movie ? getTmdbPosterUrl(movie.poster_path) : null;

              return (
                <li key={favorite.favoriteId} className="flex flex-col gap-2">
                  <Link
                    href={`/movies/${favorite.movieId}`}
                    className="flex flex-col gap-2 text-inherit no-underline"
                  >
                    {posterUrl ? (
                      <img
                        src={posterUrl}
                        alt={movie?.title}
                        className="aspect-[2/3] w-full rounded-2xl bg-gray-200 object-cover"
                      />
                    ) : (
                      <div className="flex aspect-[2/3] w-full items-center justify-center rounded-2xl bg-gray-200 text-sm text-gray-500">
                        {movie ? "이미지 없음" : "불러오는 중"}
                      </div>
                    )}
                    <h3 className="m-0 text-sm font-bold leading-[1.35]">
                      {movie?.title ?? "영화 정보를 불러오는 중"}
                    </h3>
                  </Link>
                  <p className="m-0 text-xs text-gray-400">
                    {movie?.release_date ?? ""}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
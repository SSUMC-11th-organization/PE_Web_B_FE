"use client";

import Link from "next/link";
import { useQueries } from "@tanstack/react-query";
import { useState } from "react";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { ProfileAvatar } from "../../components/members/profile-avatar";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { useFavoritesQuery } from "../../hooks/use-favorites";
import { useLogout } from "../../hooks/use-logout";
import { useMeQuery } from "../../hooks/use-me-query";
import { useAuthStore } from "../../stores/auth-store";

// 한 페이지에 5개씩 2줄을 보여 줘요
const BOOKMARKS_PER_PAGE = 10;

export function ProfilePage() {
    const meQuery = useMeQuery();
    const favoritesQuery = useFavoritesQuery();
    const logout = useLogout();
    const profileImageUrl = useAuthStore((state) => state.profileImageUrl);
    const [page, setPage] = useState(1);

    // GET /favorites로 받은 영화 번호로 TMDB 상세 정보를 불러와요
    const bookmarkedMovieIds = favoritesQuery.data?.map((favorite) => favorite.movieId) ?? [];

    const totalPages = Math.max(1, Math.ceil(bookmarkedMovieIds.length / BOOKMARKS_PER_PAGE));
    // 마지막 페이지의 영화를 모두 해제해도 빈 페이지에 머물지 않게 해요
    const currentPage = Math.min(page, totalPages);
    const pageMovieIds = bookmarkedMovieIds.slice(
        (currentPage - 1) * BOOKMARKS_PER_PAGE,
        currentPage * BOOKMARKS_PER_PAGE,
    );

    // 영화 상세 페이지와 같은 query key를 써서 cache를 함께 사용해요
    const movieQueries = useQueries({
        queries: pageMovieIds.map((movieId) => ({
            queryKey: ["movies", "detail", movieId],
            queryFn: () => getMovieDetail(movieId),
        })),
    });
    const movies = movieQueries.flatMap((query) => (query.data ? [query.data] : []));
    const isPending = favoritesQuery.isPending || movieQueries.some((query) => query.isPending);
    const isError = favoritesQuery.isError || movieQueries.some((query) => query.isError);
    const member = meQuery.data;

    return (
        <main className="flex flex-1 flex-col px-4 py-6 sm:px-10 lg:px-20">
            <div className="flex items-center justify-between gap-4 border-b border-line pb-5">
                <h1 className="text-[38px] leading-[44px] font-bold tracking-[-1.71px] text-ink">내 정보</h1>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={logout}
                        className="flex h-9 shrink-0 cursor-pointer items-center rounded-lg border border-line bg-surface px-4 text-[13px] font-extrabold text-ink-secondary transition-colors hover:text-ink"
                    >
                        로그아웃
                    </button>
                    <Link
                        href="/profile/edit"
                        className="flex h-9 shrink-0 items-center rounded-lg bg-action px-4 text-[13px] font-extrabold text-white transition-colors hover:bg-action-hover"
                    >
                        정보 수정
                    </Link>
                </div>
            </div>

            <section className="flex flex-col gap-4 border-b border-line py-6">
                <h2 className="text-lg font-bold text-ink">기본 정보</h2>
                <div className="flex items-center gap-6">
                    <ProfileAvatar imageUrl={profileImageUrl} />
                    <dl className="grid min-w-0 flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="flex min-w-0 flex-col gap-1.5">
                            <dt className="text-xs text-ink-tertiary">닉네임</dt>
                            <dd className="truncate text-[15px] font-bold text-ink">{member?.nickname ?? (meQuery.isError ? "-" : "불러오는 중")}</dd>
                        </div>
                        <div className="flex min-w-0 flex-col gap-1.5">
                            <dt className="text-xs text-ink-tertiary">이메일</dt>
                            <dd className="truncate text-[15px] font-bold text-ink">{member?.email ?? (meQuery.isError ? "-" : "불러오는 중")}</dd>
                        </div>
                    </dl>
                </div>
            </section>

            <section className="flex flex-col gap-5 py-6">
                <h2 className="text-lg font-bold text-ink">내 즐겨찾기</h2>
                {isError ? (
                    <p className="py-16 text-center text-sm text-ink-tertiary">즐겨찾기를 불러오지 못했어요.</p>
                ) : isPending ? (
                    <p className="py-16 text-center text-sm text-ink-tertiary">즐겨찾기를 불러오는 중이에요.</p>
                ) : bookmarkedMovieIds.length === 0 ? (
                    <p className="py-16 text-center text-sm text-ink-tertiary">즐겨찾기한 영화가 없어요.</p>
                ) : (
                    <MovieGrid movies={movies} />
                )}
                {bookmarkedMovieIds.length > 0 && (
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
                )}
            </section>
        </main>
    );
}

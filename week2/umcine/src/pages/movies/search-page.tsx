import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import type { SubmitEvent } from "react";
import { movies } from "../../data/movies";

export function SearchPage() {
    const { query } = useSearch({ from: "/search" });
    const navigate = useNavigate({ from: "/search" });

    const normalizedQuery = query?.trim().toLowerCase() ?? "";
    const searchResults = normalizedQuery
        ? movies.filter(
            (movie) =>
                movie.title.toLowerCase().includes(normalizedQuery) ||
                movie.originalTitle.toLowerCase().includes(normalizedQuery),
        )
        : [];

    function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const nextQuery = String(formData.get("query") ?? "").trim();
        navigate({
            search: nextQuery ? { query: nextQuery } : {},
        });
    }

    return (
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 pt-7 pb-14 sm:px-10">
            <h1 className="mt-2 mb-6 text-[26px] font-bold">영화 검색</h1>

            <form onSubmit={handleSubmit} className="flex gap-2">
                <div className="relative flex-1">
                    <img
                        className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 opacity-50"
                        src="/icons/search.svg"
                        alt=""
                    />
                    {/* URL의 query가 바뀌면 key가 바뀌어 입력창이 새 검색어로 초기화돼요 */}
                    <input
                        key={query}
                        name="query"
                        type="search"
                        aria-label="검색어"
                        placeholder="영화 제목이나 원제를 입력해 주세요"
                        defaultValue={query ?? ""}
                        className="h-11 w-full rounded-lg border border-[#e5e5e7] pr-3 pl-10 text-[15px] outline-none placeholder:text-[#9a9a9a] focus:border-[#2563eb]"
                    />
                </div>
                <button
                    type="submit"
                    className="h-11 cursor-pointer rounded-lg bg-[#2563eb] px-5 text-[15px] whitespace-nowrap text-white transition-colors hover:bg-[#1d4ed8]"
                >
                    검색
                </button>
            </form>

            {!normalizedQuery ? (
                <p className="py-20 text-center text-[15px] text-[#9a9a9a]">
                    검색어를 입력해 주세요.
                </p>
            ) : (
                <section className="mt-8">
                    <div className="mb-4 flex items-baseline gap-2">
                        <h2 className="text-lg font-semibold">‘{query}’ 검색 결과</h2>
                        <p className="text-sm text-[#9a9a9a]">영화 {searchResults.length}편</p>
                    </div>

                    {searchResults.length === 0 ? (
                        <p className="py-20 text-center text-[15px] text-[#9a9a9a]">
                            ‘{query}’와 일치하는 영화가 없어요.
                        </p>
                    ) : (
                        <ul className="flex flex-col divide-y divide-[#ebebeb]">
                            {searchResults.map((movie) => (
                                <li key={movie.id}>
                                    <Link
                                        to="/movies/$movieId"
                                        params={{ movieId: String(movie.id) }}
                                        className="flex gap-4 rounded-[10px] py-4 transition-colors hover:bg-[#f4f4f5] sm:gap-5 sm:px-3"
                                    >
                                        <img
                                            className="aspect-2/3 w-24 shrink-0 rounded-lg object-cover sm:w-28"
                                            src={movie.posterPath}
                                            alt={`${movie.title} 포스터`}
                                        />
                                        <div className="min-w-0">
                                            <h3 className="text-base font-semibold">{movie.title}</h3>
                                            <p className="mt-0.5 text-sm text-[#4b4b4b]">{movie.originalTitle}</p>
                                            <p className="mt-1 text-[13px] text-[#9a9a9a]">{movie.releaseDate}</p>
                                            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[#4b4b4b]">
                                                {movie.overview}
                                            </p>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            )}
        </main>
    );
}

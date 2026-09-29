import { useState } from "react";

import MovieGrid from "../../components/movies/movie-grid";
import { Footer } from "../../components/layout/footer";
import { movies } from "../../data/movies";
import type { Movie } from "../../types/movie";

export function MovieListPage() {
const [movieList, setMovieList] = useState<Movie[]>(movies);

function handleToggleBookmark(movieId: number) {
setMovieList((currentMovies) =>
    currentMovies.map((movie) =>
    movie.id === movieId
        ? { ...movie, isBookmarked: !movie.isBookmarked }
        : movie,
    ),
);
}

return (
<div className="flex min-h-[calc(100vh-91px)] flex-col bg-[#f6f7f9]">
    <main className="w-full flex-1 px-5 pb-12 pt-6 sm:px-10 lg:px-20">
    <h1 className="mb-5 text-[38px] leading-[44px] font-bold tracking-[-1.71px] text-[#17191e]">영화 목록</h1>
    <MovieGrid
        movies={movieList}
        onToggleBookmark={handleToggleBookmark}
    />
    </main>

    <Footer />
</div>
);
}

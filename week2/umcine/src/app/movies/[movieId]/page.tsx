import { Suspense } from "react";
import { MovieDetailPage } from "@/screens/movies/movie-detail-page";

interface MovieDetailRouteProps {
    params: Promise<{ movieId: string }>;
}

export default function Page({ params }: MovieDetailRouteProps) {
    return (
        <Suspense
            fallback={
                <main className="flex flex-1 items-center justify-center py-20 text-sm text-ink-tertiary">
                    영화 정보를 불러오는 중이에요.
                </main>
            }
        >
            <MovieDetailScreen params={params} />
        </Suspense>
    );
}

async function MovieDetailScreen({ params }: MovieDetailRouteProps) {
    const { movieId } = await params;
    return <MovieDetailPage movieIdParam={movieId} />;
}

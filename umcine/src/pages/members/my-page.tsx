import { useQueries, useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { favoriteQueries } from "../../api/favorites/queries";
import { memberQueries } from "../../api/members/queries";
import { movieQueries } from "../../api/movies/queries";
import StatusMessage from "../../components/common/status-message";
import BookmarkButton from "../../components/movies/bookmark-button";
import MoviePoster from "../../components/movies/movie-poster";
import { useMeQuery, useMyMemberId } from "../../hooks/use-me";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

const sectionTitleClass = "text-2xl font-bold tracking-[-0.8px] text-text-primary";

export function MyPage() {
  return (
    <main className="mx-auto max-w-[1440px] px-4 pt-6 pb-16 md:px-20">
      <h1 className="mb-8 text-[38px] leading-[44px] font-bold tracking-[-1.71px] text-text-primary">
        내 정보
      </h1>
      <ProfileSection />
      <FavoritesSection />
      <RatingsSection />
    </main>
  );
}

function ProfileSection() {
  const meQuery = useMeQuery();

  return (
    <section className="mb-12">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className={sectionTitleClass}>프로필</h2>
        <Link
          className="flex h-10 items-center gap-1.5 rounded-lg border border-border-default bg-bg-surface px-4 text-sm font-bold text-text-secondary hover:bg-bg-page"
          to="/my/edit"
        >
          <img className="size-4" src="/icons/edit.svg" alt="" />
          수정하기
        </Link>
      </div>
      {meQuery.isPending ? (
        <StatusMessage message="내 정보를 불러오는 중이에요." />
      ) : meQuery.isError ? (
        <StatusMessage message="내 정보를 불러오지 못했어요." onRetry={() => meQuery.refetch()} />
      ) : (
        <div className="flex flex-col gap-6 rounded-[10px] border border-border-default bg-bg-surface p-6 md:flex-row md:items-center">
          <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-bg-page">
            <img className="size-10" src="/icons/person.svg" alt="" />
          </div>
          <dl className="grid flex-1 gap-4 text-sm sm:grid-cols-3">
            <div>
              <dt className="mb-1 text-text-tertiary">닉네임</dt>
              <dd className="text-lg font-bold text-text-primary">{meQuery.data.nickname}</dd>
            </div>
            <div>
              <dt className="mb-1 text-text-tertiary">이메일</dt>
              <dd className="flex items-center gap-1.5 font-medium text-text-primary">
                <img className="size-4" src="/icons/mail.svg" alt="" />
                {meQuery.data.email}
              </dd>
            </div>
            <div>
              <dt className="mb-1 text-text-tertiary">가입일</dt>
              <dd className="text-text-secondary">{meQuery.data.createdAt.slice(0, 10)}</dd>
            </div>
          </dl>
        </div>
      )}
    </section>
  );
}

// GET /favorites — 즐겨찾기에는 movieId만 있어서 TMDB 상세(영화 상세와 같은 캐시)로 제목 · 포스터를 채워요.
function FavoritesSection() {
  const favoritesQuery = useQuery(favoriteQueries.list());
  const favorites = favoritesQuery.data ?? [];
  const movieQueryResults = useQueries({
    queries: favorites.map((favorite) => movieQueries.detail(favorite.movieId)),
  });

  function renderContent() {
    if (favoritesQuery.isPending) return <StatusMessage message="즐겨찾기를 불러오는 중이에요." />;
    if (favoritesQuery.isError) {
      return (
        <StatusMessage message="즐겨찾기를 불러오지 못했어요." onRetry={() => favoritesQuery.refetch()} />
      );
    }
    if (favorites.length === 0) return <StatusMessage message="아직 즐겨찾기한 영화가 없어요." />;

    return (
      <ul className="grid grid-cols-2 gap-x-[18px] gap-y-5 sm:grid-cols-3 lg:grid-cols-5">
        {favorites.map((favorite, index) => {
          const movie = movieQueryResults[index]?.data;
          return (
            <li key={favorite.movieId} className="relative">
              <Link
                className="group flex flex-col gap-1"
                to="/movies/$movieId"
                params={{ movieId: String(favorite.movieId) }}
              >
                <MoviePoster
                  className="h-[240px] w-full rounded-[10px]"
                  imageClassName="transition-transform duration-300 group-hover:scale-105"
                  src={getTmdbPosterUrl(movie?.poster_path ?? null)}
                  alt={movie?.title ?? "영화 포스터"}
                />
                <h3 className="mt-[5px] truncate text-sm font-extrabold text-text-primary">
                  {movie?.title ?? `영화 #${favorite.movieId}`}
                </h3>
              </Link>
              <BookmarkButton className="absolute top-2 right-2" movieId={favorite.movieId} />
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <section className="mb-12">
      <h2 className={`${sectionTitleClass} mb-5`}>
        즐겨찾기
        {favoritesQuery.isSuccess && (
          <span className="ml-3 text-sm font-normal text-text-tertiary">{favorites.length}개</span>
        )}
      </h2>
      {renderContent()}
    </section>
  );
}

// 7주차에는 회원 번호를 직접 입력했지만, 이제 로그인한 내 회원 번호로 조회해요.
function RatingsSection() {
  const memberId = useMyMemberId();
  const ratingsQuery = useQuery(memberQueries.ratings(memberId));
  const ratings = ratingsQuery.data ?? [];
  const movieQueryResults = useQueries({
    queries: ratings.map((rating) => movieQueries.detail(rating.movieId)),
  });

  function renderContent() {
    if (memberId === null) return <StatusMessage message="회원 번호를 확인할 수 없어요." />;
    if (ratingsQuery.isPending) return <StatusMessage message="평점을 불러오는 중이에요." />;
    if (ratingsQuery.isError) {
      return <StatusMessage message="평점을 불러오지 못했어요." onRetry={() => ratingsQuery.refetch()} />;
    }
    if (ratings.length === 0) return <StatusMessage message="아직 남긴 평점이 없어요." />;

    return (
      <ul className="flex flex-col gap-4">
        {ratings.map((rating, index) => {
          const movie = movieQueryResults[index]?.data;
          return (
            <li
              key={rating.ratingId}
              className="flex gap-5 rounded-[10px] border border-border-default bg-bg-surface p-4"
            >
              <MoviePoster
                className="h-[130px] w-[90px] shrink-0 rounded-lg"
                src={getTmdbPosterUrl(movie?.poster_path ?? null)}
                alt={`${movie?.title ?? "영화"} 포스터`}
              />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <h3 className="text-lg font-extrabold text-text-primary">
                  {movie?.title ?? `영화 #${rating.movieId}`}
                </h3>
                <p className="flex items-center gap-0.5" aria-label={`별점 ${rating.score}점`}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <img
                      key={star}
                      className="size-4"
                      src={star <= rating.score ? "/icons/star.svg" : "/icons/star-outline.svg"}
                      alt=""
                    />
                  ))}
                  <span className="ml-1 text-sm font-bold text-text-primary">{rating.score}</span>
                </p>
                <p className="mt-1 text-sm text-text-secondary">{rating.comment || "코멘트가 없어요."}</p>
                <div className="mt-auto flex items-center justify-between gap-3">
                  <p className="text-xs text-text-tertiary">{rating.createdAt.slice(0, 10)}</p>
                  <Link
                    className="text-sm font-bold text-action-primary hover:underline"
                    to="/movies/$movieId"
                    params={{ movieId: String(rating.movieId) }}
                  >
                    상세 보기
                  </Link>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <section>
      <h2 className={`${sectionTitleClass} mb-5`}>
        내 평점
        {ratingsQuery.isSuccess && (
          <span className="ml-3 text-sm font-normal text-text-tertiary">{ratings.length}개</span>
        )}
      </h2>
      {renderContent()}
    </section>
  );
}

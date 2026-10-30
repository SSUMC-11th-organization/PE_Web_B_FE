// TMDB API 이용 약관에 따라 로고와 출처 문구를 표시해요.
export function Footer() {
  return (
    <footer className="border-t border-border-default bg-bg-surface px-4 py-6 md:px-20">
      <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-3 sm:flex-row sm:items-center">
        <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer" aria-label="TMDB">
          <img className="h-4 w-auto" src="/images/logos/tmdb-logo.svg" alt="TMDB 로고" />
        </a>
        <p className="text-xs text-text-tertiary">
          This product uses the TMDB API but is not endorsed or certified by TMDB.
        </p>
      </div>
    </footer>
  )
}

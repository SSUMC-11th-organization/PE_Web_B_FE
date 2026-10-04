export function Footer() {
  return (
    <footer className="flex items-center justify-end gap-2 border-t border-line bg-surface px-4 py-4 text-xs text-ink-secondary sm:px-10 lg:px-20">
      <img className="size-6" src="/images/logos/tmdb-logo.svg" alt="" />
      <p>
        This product uses the TMDB API but is not endorsed or certified by{" "}
        <a
          className="underline"
          href="https://www.themoviedb.org/?language=ko"
          target="_blank"
          rel="noreferrer"
        >
          TMDB
        </a>
        .
      </p>
    </footer>
  );
}

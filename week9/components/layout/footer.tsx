function Footer() {
  return (
    <footer className="flex items-center justify-end gap-2 border-t border-line bg-surface px-20 py-4">
      <img src="/images/logos/tmdb-logo.svg" alt="" className="size-6" />
      <p className="text-xs text-ink-2">
        This product uses the TMDB API but is not endorsed or certified by{" "}
        <a
          href="https://www.themoviedb.org/?language=ko"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          TMDB
        </a>
        .
      </p>
    </footer>
  );
}

export default Footer;

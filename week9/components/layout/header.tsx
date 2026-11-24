import Link from "next/link";
import HeaderAuthButton from "./header-auth-button";
import HeaderNav from "./header-nav";

function Header() {
  return (
    <header className="flex items-center justify-between border-b border-line bg-surface px-20 py-6">
      <div className="flex items-center gap-[42px]">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg border-2 border-ink">
            <img src="/icons/movie-icons/movie.svg" alt="" className="size-6" />
          </span>
          <span className="text-xl font-black tracking-[-0.7px]">UMCine</span>
        </Link>

        <HeaderNav />
      </div>

      <div className="flex items-center gap-2.5">
        <Link
          href="/search"
          aria-label="검색"
          className="flex size-[42px] items-center justify-center rounded-lg border border-line bg-surface hover:bg-page"
        >
          <img src="/icons/movie-icons/search.svg" alt="" className="size-6" />
        </Link>
        <HeaderAuthButton />
      </div>
    </header>
  );
}

export default Header;

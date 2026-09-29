import { Link } from '@tanstack/react-router'

const menuItemClass = 'border-b-2 pb-1 text-sm'
const activeMenuProps = { className: 'border-text-primary font-bold text-text-primary' }
const inactiveMenuProps = { className: 'border-transparent font-medium text-text-tertiary' }

export function Header() {
  return (
    <header className="flex w-full items-center justify-between gap-2 border-b border-border-default bg-bg-surface px-4 py-4 md:px-20">
      <div className="flex items-center gap-6 md:gap-10">
        <Link className="flex items-center gap-2" to="/">
          <img className="size-6" src="/icons/movie.svg" alt="" />
          <span className="text-xl font-black tracking-[-0.7px] text-text-primary">UMCine</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            className={menuItemClass}
            activeProps={activeMenuProps}
            inactiveProps={inactiveMenuProps}
            activeOptions={{ exact: true }}
            to="/"
          >
            영화
          </Link>
          <Link
            className={menuItemClass}
            activeProps={activeMenuProps}
            inactiveProps={inactiveMenuProps}
            to="/search"
          >
            검색
          </Link>
          <a className={`${menuItemClass} ${inactiveMenuProps.className}`} href="#">
            내 정보
          </a>
        </nav>
      </div>
      <div className="flex items-center gap-2">
        <Link
          className="flex size-[42px] items-center justify-center rounded-lg hover:bg-bg-page"
          to="/search"
          aria-label="영화 검색"
        >
          <img src="/icons/search.svg" alt="" />
        </Link>
        <button
          className="h-[42px] cursor-pointer rounded-lg bg-action-primary px-4 text-sm font-bold text-white"
          type="button"
        >
          로그인
        </button>
      </div>
    </header>
  )
}

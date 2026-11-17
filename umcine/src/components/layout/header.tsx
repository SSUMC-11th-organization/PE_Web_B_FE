import { Link } from '@tanstack/react-router'
import { useMeQuery } from '../../hooks/use-me'
import { useLogout } from '../../hooks/use-logout'
import { useAuthStore } from '../../stores/auth-store'

const menuItemClass = 'border-b-2 pb-1 text-sm'
const activeMenuProps = { className: 'border-text-primary font-bold text-text-primary' }
const inactiveMenuProps = { className: 'border-transparent font-medium text-text-tertiary' }
const subButtonClass =
  'hidden h-[42px] cursor-pointer items-center rounded-lg px-4 text-sm font-bold text-text-secondary hover:bg-bg-page sm:flex'
const primaryButtonClass =
  'flex h-[42px] items-center rounded-lg bg-action-primary px-4 text-sm font-bold text-white'

export function Header() {
  const accessToken = useAuthStore((state) => state.accessToken)
  // 토큰이 있을 때만 내 정보를 조회해요. 401이면 authApi가 토큰을 비워 로그인 링크로 바뀌어요.
  const meQuery = useMeQuery()
  const logout = useLogout()

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
          <Link
            className={menuItemClass}
            activeProps={activeMenuProps}
            inactiveProps={inactiveMenuProps}
            to="/my"
          >
            내 정보
          </Link>
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
        {!accessToken ? (
          <>
            <Link className={subButtonClass} to="/signup">
              회원가입
            </Link>
            <Link className={primaryButtonClass} to="/login">
              로그인
            </Link>
          </>
        ) : meQuery.isLoading ? (
          // enabled가 false일 때도 isPending은 참이라, 실제 첫 요청 중인지는 isLoading으로 확인해요.
          <span className="h-[42px] w-24 animate-pulse rounded-lg bg-gray-200" aria-label="내 정보를 불러오는 중" />
        ) : (
          <>
            <button className={subButtonClass} type="button" onClick={logout}>
              로그아웃
            </button>
            <Link className={primaryButtonClass} to="/my">
              {meQuery.data ? `${meQuery.data.nickname}님` : '마이페이지'}
            </Link>
          </>
        )}
      </div>
    </header>
  )
}

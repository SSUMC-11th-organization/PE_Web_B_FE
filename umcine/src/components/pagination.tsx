import { cn } from '../utils/cn'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const buttonClass = 'flex size-9 cursor-pointer items-center justify-center rounded-[7px]'
const navButtonClass = cn(
  buttonClass,
  'border border-border-default bg-bg-surface disabled:cursor-not-allowed disabled:opacity-40',
)

// TMDB는 페이지가 최대 500개까지 있으므로 현재 페이지 주변 5개만 보여 줘요.
const VISIBLE_PAGE_COUNT = 5

function getVisiblePages(currentPage: number, totalPages: number) {
  const count = Math.min(VISIBLE_PAGE_COUNT, totalPages)
  const start = Math.min(
    Math.max(currentPage - Math.floor(count / 2), 1),
    totalPages - count + 1,
  )
  return Array.from({ length: count }, (_, index) => start + index)
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = getVisiblePages(currentPage, totalPages)

  return (
    <nav className="mt-8 flex items-center justify-center gap-3" aria-label="페이지네이션">
      <button
        type="button"
        className={navButtonClass}
        disabled={currentPage === 1}
        aria-label="이전 페이지"
        onClick={() => onPageChange(currentPage - 1)}
      >
        <img src="/icons/chevron-left.svg" alt="" />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          className={cn(
            buttonClass,
            'text-sm font-bold',
            page === currentPage ? 'bg-action-primary text-white' : 'text-text-primary',
          )}
          aria-current={page === currentPage ? 'page' : undefined}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        className={navButtonClass}
        disabled={currentPage >= totalPages}
        aria-label="다음 페이지"
        onClick={() => onPageChange(currentPage + 1)}
      >
        <img src="/icons/chevron-right.svg" alt="" />
      </button>
    </nav>
  )
}

export default Pagination

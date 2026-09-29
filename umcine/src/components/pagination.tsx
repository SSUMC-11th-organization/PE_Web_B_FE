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

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

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
        disabled={currentPage === totalPages}
        aria-label="다음 페이지"
        onClick={() => onPageChange(currentPage + 1)}
      >
        <img src="/icons/chevron-right.svg" alt="" />
      </button>
    </nav>
  )
}

export default Pagination

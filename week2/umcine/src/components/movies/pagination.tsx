import { cn } from "../../utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const arrowButtonClassName =
  "flex size-6 cursor-pointer items-center justify-center disabled:cursor-not-allowed disabled:opacity-30";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      className="flex items-center justify-center gap-3"
      aria-label="영화 목록 페이지"
    >
      <button
        type="button"
        className={arrowButtonClassName}
        aria-label="이전 페이지"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <img className="size-6" src="/icons/chevron-left.svg" alt="" />
      </button>

      <div className="flex items-center gap-1">
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            className={cn(
              "flex size-9 cursor-pointer items-center justify-center rounded-[7px] text-[13px] font-bold transition-colors",
              page === currentPage
                ? "bg-ink text-white"
                : "text-ink-secondary hover:bg-line",
            )}
            aria-current={page === currentPage ? "page" : undefined}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        type="button"
        className={arrowButtonClassName}
        aria-label="다음 페이지"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <img className="size-6" src="/icons/chevron-right.svg" alt="" />
      </button>
    </nav>
  );
}

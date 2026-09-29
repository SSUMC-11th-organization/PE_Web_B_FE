import { cn } from "../../utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const pageButtonClassName =
  "flex h-9 min-w-9 cursor-pointer items-center justify-center rounded-lg border px-2.5 text-[15px] transition-colors";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      className="mt-10 flex items-center justify-center gap-2"
      aria-label="페이지 이동"
    >
      <button
        type="button"
        className={cn(
          pageButtonClassName,
          "border-[#e5e5e7] bg-white enabled:hover:bg-[#f4f4f5] disabled:cursor-not-allowed disabled:opacity-35",
        )}
        aria-label="이전 페이지"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <img className="size-5" src="/icons/chevron-left.svg" alt="" />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          className={cn(
            pageButtonClassName,
            page === currentPage
              ? "border-[#2563eb] bg-[#2563eb] text-white"
              : "border-[#e5e5e7] bg-white text-[#1a1a1a] hover:bg-[#f4f4f5]",
          )}
          aria-current={page === currentPage ? "page" : undefined}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        className={cn(
          pageButtonClassName,
          "border-[#e5e5e7] bg-white enabled:hover:bg-[#f4f4f5] disabled:cursor-not-allowed disabled:opacity-35",
        )}
        aria-label="다음 페이지"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <img className="size-5" src="/icons/chevron-right.svg" alt="" />
      </button>
    </nav>
  );
}

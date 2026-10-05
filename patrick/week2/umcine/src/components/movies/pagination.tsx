import { useState } from "react";
import { cn } from "../../utils/cn";

const PAGE_NUMBERS = [1, 2, 3, 4, 5];

export function Pagination() {
  const [page, setPage] = useState(1);

  return (
    <nav
      className="flex items-center justify-center gap-2 px-12 py-2"
      aria-label="페이지"
    >
      <button
        type="button"
        className="min-w-8 h-8 border-0 bg-transparent text-gray-500 rounded-lg cursor-pointer"
        onClick={() => setPage((current) => Math.max(1, current - 1))}
      >
        <img src="/icons/chevron-left.svg" alt="이전" className="h-4 w-4 mx-auto" />
      </button>
      {PAGE_NUMBERS.map((number) => (
        <button
          key={number}
          type="button"
          className={cn(
            "min-w-8 h-8 border-0 bg-transparent text-gray-500 rounded-lg cursor-pointer",
            page === number && "bg-gray-900 text-white",
          )}
          onClick={() => setPage(number)}
        >
          {number}
        </button>
      ))}
      <button
        type="button"
        className="min-w-8 h-8 border-0 bg-transparent text-gray-500 rounded-lg cursor-pointer"
        onClick={() => setPage((current) => Math.min(5, current + 1))}
      >
        <img src="/icons/chevron-right.svg" alt="다음" className="h-4 w-4 mx-auto" />
      </button>
    </nav>
  );
}
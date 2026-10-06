import { useBookmarkStore } from '../../stores/bookmark-store'
import { cn } from '../../utils/cn'

interface BookmarkButtonProps {
  movieId: number
  className?: string
}

function BookmarkButton({ movieId, className }: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) => state.bookmarkedMovieIds.includes(movieId))
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark)

  return (
    <button
      type="button"
      className={cn(
        'flex size-[34px] shrink-0 cursor-pointer items-center justify-center rounded-lg border p-0',
        isBookmarked ? 'border-action-primary bg-action-primary' : 'border-white bg-text-primary',
        className,
      )}
      aria-pressed={isBookmarked}
      aria-label={isBookmarked ? '북마크 해제' : '북마크 추가'}
      onClick={() => toggleBookmark(movieId)}
    >
      <img
        className="size-5 invert brightness-200"
        src={isBookmarked ? '/icons/bookmark.svg' : '/icons/bookmark-outline.svg'}
        alt=""
      />
    </button>
  )
}

export default BookmarkButton

import { useBookmarkStore } from "../../stores/bookmark-store";
import { cn } from "../../utils/cn";

interface BookmarkButtonProps {
    movieId: number;
    movieTitle: string;
    /** icon: 포스터 위 아이콘 버튼, label: 글자가 함께 있는 버튼 */
    variant?: "icon" | "label";
    className?: string;
}

export function BookmarkButton({
    movieId,
    movieTitle,
    variant = "icon",
    className,
}: BookmarkButtonProps) {
    const isBookmarked = useBookmarkStore((state) =>
        state.bookmarkedMovieIds.includes(movieId),
    );
    const toggleBookmark = useBookmarkStore(
        (state) => state.toggleBookmark,
    );
    const iconSrc = isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg";

    if (variant === "label") {
        return (
            <button
                type="button"
                className={cn(
                    "flex h-[42px] cursor-pointer items-center justify-center gap-2 rounded-lg px-4 text-sm font-extrabold whitespace-nowrap text-white transition-colors",
                    isBookmarked ? "bg-ink hover:bg-ink/85" : "bg-action hover:bg-action-hover",
                    className,
                )}
                aria-pressed={isBookmarked}
                onClick={() => toggleBookmark(movieId)}
            >
                <img className="size-4 brightness-0 invert" src={iconSrc} alt="" />
                {isBookmarked ? "즐겨찾기 해제" : "즐겨찾기"}
            </button>
        );
    }

    return (
        <button
            type="button"
            className={cn(
                "flex size-[34px] shrink-0 cursor-pointer items-center justify-center rounded-lg border transition-colors",
                isBookmarked ? "border-action bg-action" : "border-white bg-ink",
                className,
            )}
            aria-pressed={isBookmarked}
            aria-label={`${movieTitle} 즐겨찾기 ${isBookmarked ? "해제" : "추가"}`}
            onClick={() => toggleBookmark(movieId)}
        >
            <img className="size-6 brightness-0 invert" src={iconSrc} alt="" />
        </button>
    );
}

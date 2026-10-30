import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BookmarkState {
  bookmarkedMovieIds: number[];
  toggleBookmark: (movieId: number) => void;
}

// 목록, 검색, 상세 화면이 같은 북마크 상태를 쓰고, localStorage에 저장해 새로고침 뒤에도 유지해요.
export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set) => ({
      bookmarkedMovieIds: [],
      toggleBookmark: (movieId) =>
        set((state) => ({
          bookmarkedMovieIds: state.bookmarkedMovieIds.includes(movieId)
            ? state.bookmarkedMovieIds.filter((id) => id !== movieId)
            : [...state.bookmarkedMovieIds, movieId],
        })),
    }),
    {
      name: "umcine-bookmark-store",
      partialize: (state) => ({ bookmarkedMovieIds: state.bookmarkedMovieIds }),
    },
  ),
);

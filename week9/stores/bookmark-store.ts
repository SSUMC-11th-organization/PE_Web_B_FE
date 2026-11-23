import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createBrowserStorage } from "@/utils/browser-storage";

interface BookmarkStore {
  bookmarkedMovieIds: number[];
  toggleBookmark: (movieId: number) => void;
}

export const useBookmarkStore = create<BookmarkStore>()(
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
      storage: createBrowserStorage(),
      // 서버 HTML과 첫 렌더링 결과가 같도록, 저장된 값은 Providers에서 나중에 불러와요.
      skipHydration: true,
      partialize: (state) => ({
        bookmarkedMovieIds: state.bookmarkedMovieIds,
      }),
    },
  ),
);

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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
            storage: createJSONStorage(() => localStorage),
            // 서버 HTML과 첫 화면이 같도록 store를 만들 때 바로 불러오지 않고, Providers에서 hydration 뒤에 불러와요
            skipHydration: true,
            partialize: (state) => ({
                bookmarkedMovieIds: state.bookmarkedMovieIds,
            }),
        },
    ),
);
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CardSize = "small" | "large";

interface ViewSettingsStore {
  cardSize: CardSize;
  setCardSize: (cardSize: CardSize) => void;
}

export const useViewSettingsStore = create<ViewSettingsStore>()(
  persist(
    (set) => ({
      cardSize: "small",
      setCardSize: (cardSize) => set({ cardSize }),
    }),
    {
      name: "umcine-view-settings",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        cardSize: state.cardSize,
      }),
      // 서버에는 localStorage가 없어서 브라우저에서 화면이 뜬 뒤 providers.tsx에서 읽어 와요.
      skipHydration: true,
    },
  ),
);
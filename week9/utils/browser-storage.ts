import { createJSONStorage, type StateStorage } from "zustand/middleware";

const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

// 서버에는 localStorage가 없으므로 아무 일도 하지 않는 저장소를 대신 써요.
export const createBrowserStorage = <T>() =>
  createJSONStorage<T>(() => (typeof window === "undefined" ? noopStorage : window.localStorage));

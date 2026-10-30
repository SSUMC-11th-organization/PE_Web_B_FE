import { useEffect, useState, type DependencyList } from "react";

type AsyncState<T> =
  | { status: "loading" }
  | { status: "error"; error: unknown }
  | { status: "success"; data: T };

type AsyncResult<T> = AsyncState<T> & { retry: () => void };

// 비동기 요청의 로딩, 오류, 성공 상태를 관리해요.
// deps가 바뀌거나 컴포넌트가 사라지면 이전 요청은 취소돼요.
export function useAsync<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  deps: DependencyList,
): AsyncResult<T> {
  const [state, setState] = useState<AsyncState<T>>({ status: "loading" });
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: "loading" });

    fetcher(controller.signal)
      .then((data) => setState({ status: "success", data }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setState({ status: "error", error });
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, retryCount]);

  return { ...state, retry: () => setRetryCount((count) => count + 1) };
}

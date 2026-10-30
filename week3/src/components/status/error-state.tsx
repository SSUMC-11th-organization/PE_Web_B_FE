import { isHTTPError } from "ky";

interface ErrorStateProps {
  error: unknown;
  onRetry: () => void;
}

const getErrorMessage = (error: unknown) => {
  if (isHTTPError(error)) {
    if (error.response.status === 401) return "TMDB 인증에 실패했어요. 액세스 토큰을 확인해 주세요.";
    return `서버에서 오류가 발생했어요. (${error.response.status})`;
  }
  return "네트워크 연결을 확인해 주세요.";
};

function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div role="alert" className="flex flex-col items-center justify-center gap-3 py-32">
      <p className="text-lg font-bold">영화 정보를 불러오지 못했어요.</p>
      <p className="text-sm text-ink-2">{getErrorMessage(error)}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-2 h-[42px] rounded-lg bg-ink px-4 text-sm font-extrabold text-white"
      >
        다시 시도
      </button>
    </div>
  );
}

export default ErrorState;

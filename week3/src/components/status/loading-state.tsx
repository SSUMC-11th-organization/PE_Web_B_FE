interface LoadingStateProps {
  message?: string;
}

function LoadingState({ message = "영화 정보를 불러오는 중이에요." }: LoadingStateProps) {
  return (
    <div role="status" className="flex flex-col items-center justify-center gap-4 py-32">
      <span className="size-8 animate-spin rounded-full border-[3px] border-line border-t-primary" />
      <p className="text-sm text-ink-2">{message}</p>
    </div>
  );
}

export default LoadingState;

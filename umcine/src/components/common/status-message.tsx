import { cn } from '../../utils/cn'

interface StatusMessageProps {
  message: string
  className?: string
  onRetry?: () => void
}

// 로딩, 오류, 빈 결과 안내를 같은 모양으로 보여 줘요. onRetry가 있으면 다시 시도 버튼을 함께 그려요.
function StatusMessage({ message, className, onRetry }: StatusMessageProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-4 rounded-[10px] bg-bg-surface py-16 text-center text-sm text-text-secondary',
        className,
      )}
      role={onRetry ? 'alert' : 'status'}
    >
      <p>{message}</p>
      {onRetry && (
        <button
          type="button"
          className="h-10 cursor-pointer rounded-lg bg-action-primary px-4 text-sm font-bold text-white"
          onClick={onRetry}
        >
          다시 시도
        </button>
      )}
    </div>
  )
}

export default StatusMessage

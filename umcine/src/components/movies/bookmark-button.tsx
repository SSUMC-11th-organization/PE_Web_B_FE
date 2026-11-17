import { useNavigate } from '@tanstack/react-router'
import { useIsFavorite, useToggleFavoriteMutation } from '../../hooks/use-favorite'
import { useAuthStore } from '../../stores/auth-store'
import { cn } from '../../utils/cn'

interface BookmarkButtonProps {
  movieId: number
  className?: string
  // "status": GET /favorites/{movieId}로 확인(상세), "list": GET /favorites 목록으로 확인(카드 여러 개)
  source?: 'status' | 'list'
}

// 4주차의 localStorage 북마크를 서버 즐겨찾기 API로 바꿨어요. 원본이 서버에 있는 서버 상태라 query 캐시로 관리해요.
function BookmarkButton({ movieId, className, source = 'list' }: BookmarkButtonProps) {
  const navigate = useNavigate()
  const isLoggedIn = useAuthStore((state) => Boolean(state.accessToken))
  const { isFavorite, isLoading } = useIsFavorite(movieId, source)
  const toggleMutation = useToggleFavoriteMutation(movieId)

  const handleClick = () => {
    if (!isLoggedIn) {
      alert('로그인 후 즐겨찾기할 수 있어요.')
      navigate({ to: '/login' })
      return
    }
    if (toggleMutation.isPending) return
    toggleMutation.mutate(!isFavorite)
  }

  return (
    <button
      type="button"
      className={cn(
        'flex size-[34px] shrink-0 cursor-pointer items-center justify-center rounded-lg border p-0 disabled:cursor-wait',
        isFavorite ? 'border-action-primary bg-action-primary' : 'border-white bg-text-primary',
        className,
      )}
      disabled={isLoading || toggleMutation.isPending}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
      onClick={handleClick}
    >
      <img
        className={cn('size-5 invert brightness-200', isLoading && 'opacity-40')}
        src={isFavorite ? '/icons/bookmark.svg' : '/icons/bookmark-outline.svg'}
        alt=""
      />
    </button>
  )
}

export default BookmarkButton

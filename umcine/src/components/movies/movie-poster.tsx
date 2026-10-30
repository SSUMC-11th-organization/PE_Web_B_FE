import { cn } from '../../utils/cn'

interface MoviePosterProps {
  src: string | null
  alt: string
  className?: string
  imageClassName?: string
}

// URL이 있을 때만 <img>를 그리고, 없으면 같은 크기의 회색 영역에 '이미지 없음'을 보여 줘요.
function MoviePoster({ src, alt, className, imageClassName }: MoviePosterProps) {
  return (
    <div className={cn('overflow-hidden bg-border-default', className)}>
      {src ? (
        <img className={cn('size-full object-cover', imageClassName)} src={src} alt={alt} />
      ) : (
        <div className="flex size-full items-center justify-center text-sm font-medium text-text-tertiary">
          이미지 없음
        </div>
      )}
    </div>
  )
}

export default MoviePoster

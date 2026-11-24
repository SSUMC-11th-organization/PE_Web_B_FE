import Image from 'next/image'
import { cn } from '../../utils/cn'

interface MoviePosterProps {
  src: string | null
  alt: string
  className?: string
  imageClassName?: string
  // 화면에서 포스터가 차지하는 너비예요. next/image가 이 값에 맞는 크기의 파일을 골라 줘요.
  sizes?: string
}

// URL이 있을 때만 이미지를 그리고, 없으면 같은 크기의 회색 영역에 '이미지 없음'을 보여 줘요.
// <img> 대신 next/image를 사용해 TMDB 원본(w500) 대신 화면 크기에 맞춘 webp/avif 파일을 받아요.
// 부모 div가 크기를 정하고, fill로 그 영역을 채워요.
function MoviePoster({ src, alt, className, imageClassName, sizes = '(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw' }: MoviePosterProps) {
  return (
    <div className={cn('relative overflow-hidden bg-border-default', className)}>
      {src ? (
        <Image className={cn('object-cover', imageClassName)} src={src} alt={alt} fill sizes={sizes} />
      ) : (
        <div className="flex size-full items-center justify-center text-sm font-medium text-text-tertiary">
          이미지 없음
        </div>
      )}
    </div>
  )
}

export default MoviePoster

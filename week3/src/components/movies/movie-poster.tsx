import { cn } from "../../utils/cn";

interface MoviePosterProps {
  src: string | null;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
}

// 포스터가 없는 영화는 아이콘으로 대신 보여줘요.
function MoviePoster({ src, alt, className, loading }: MoviePosterProps) {
  if (!src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn("flex items-center justify-center bg-line", className)}
      >
        <img src="/icons/movie-icons/movie.svg" alt="" className="size-8 opacity-40" />
      </div>
    );
  }

  return <img src={src} alt={alt} loading={loading} className={cn("object-cover", className)} />;
}

export default MoviePoster;

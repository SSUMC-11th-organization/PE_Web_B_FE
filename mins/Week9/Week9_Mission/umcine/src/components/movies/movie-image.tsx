import Image from "next/image";

interface MovieImageProps {
  src: string | null;
  alt: string;
  className?: string;
}
export function MovieImage({ src, alt, className = "" }: MovieImageProps) {
  return src ? (
    <Image
      className={className}
      src={src}
      alt={alt}
      width={src.includes("w1280") ? 1280 : 500}
      height={src.includes("w1280") ? 720 : 750}
      sizes={
        src.includes("w1280") ? "100vw" : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 260px"
      }
    />
  ) : (
    <div
      className={`flex items-center justify-center bg-gray-200 text-sm text-gray-600 ${className}`}
      role="img"
      aria-label={alt}
    >
      이미지 없음
    </div>
  );
}

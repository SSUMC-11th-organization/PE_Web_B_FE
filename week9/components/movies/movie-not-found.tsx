import Link from "next/link";

function MovieNotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 py-40">
      <p className="text-lg text-ink-2">영화를 찾을 수 없어요.</p>
      <Link href="/" className="text-sm font-bold text-primary">
        영화 목록으로 돌아가기
      </Link>
    </main>
  );
}

export default MovieNotFound;

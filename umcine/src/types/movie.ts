// 영화 카드가 화면에 그릴 때 쓰는 UI 타입이에요. TMDB 응답 타입과 분리해 두면 API가 바뀌어도 adapter만 고치면 돼요.
export interface MovieCardItem {
  id: number;
  title: string;
  originalTitle: string;
  releaseDate: string;
  posterUrl: string | null;
  overview: string;
}

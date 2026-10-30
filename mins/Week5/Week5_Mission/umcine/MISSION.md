# 5주차 미션 기록

## 구현
- 순수 fetch: `src/api/movies/get-movies-with-fetch.ts`에서 Authorization, language/page query, response.ok 검사 구현.
- 순수 fetch 요청은 Network에서 확인 완료. 제출 화면에서는 임시 확인 UI를 제거함.
- ky 2.2.0 공통 인스턴스와 목록·검색·상세 API 함수 분리.
- 목록/검색/상세 응답 모델 작성. 목록 카드 adapter로 서버 타입과 UI 타입 분리.
- 공통 요청 훅에서 로딩/오류/성공 관리 및 Effect cleanup으로 이전 응답 무시.
- 빈 검색어는 요청하지 않으며 빈 결과 안내 표시.
- 잘못된 상세 ID는 요청하지 않음. 404와 일반 요청 오류 구분.
- 포스터/배경 경로가 null이면 같은 영역에 회색 «이미지 없음» 표시.
- 상세의 원제, 개봉일, 장르, 상영 시간, 태그라인, 줄거리와 이미지 연결.
- Zustand 북마크 유지. 로컬 영화 ID와 TMDB ID가 혼동되지 않도록 TMDB 전용 storage key 사용.
- 기존 Footer의 TMDB 로고와 출처 문구 유지, 빈 검색 화면에도 표시.

## 선택 미션
- 실패한 요청의 다시 시도 버튼 구현.
- 목록 카드 adapter 구현.
- URL 페이지 번호 연동은 미구현.

## 확인 완료
- pnpm build 통과 (TypeScript 검사 포함).
- pnpm lint 통과.
- .env.local이 Git ignore 대상임을 확인.
- 로컬 환경 변수를 사용하는 실제 TMDB 요청: 인기 목록 200 (20편), 검색 200, 상세 200, 존재하지 않는 영화 404.
- 위 응답 확인은 Node에서 수행했으며 브라우저 CORS/Console/UI 검증을 대신하지 않음.

## 브라우저에서 최종 확인할 것
1. pnpm dev 재시작 후 목록에서 실제 영화 카드와 TMDB 출처 확인.
2. 순수 fetch 요청의 status 200, language=ko-KR, page=1과 Response의 results 확인 기록은 Notion에 보관.
3. /search에서 빈 검색어 안내, 검색 결과, 무작위 문자열의 빈 결과 확인.
4. 영화 카드 클릭 후 상세 정보 확인. 상세 URL 복사 후 직접 접속 및 새로고침.
5. /search?query=인셉션 직접 접속 및 새로고침.
6. /movies/abc, /movies/0에서 잘못된 번호 안내, /movies/999999999에서 찾을 수 없음 안내.
7. DevTools Network의 Offline으로 바꾸고 새로고침하여 오류 표시 확인. 온라인 복구 후 다시 시도로 정상 복구 확인.
8. 북마크가 목록/검색/상세에 반영되고 새로고침 후 유지되는지 확인.
9. Console의 미처리 오류 확인. StrictMode 때문에 개발 중 요청이 두 번 보일 수 있음.

브라우저에서 확인한 결과와 직접 이해한 핵심 코드를 Notion 미션 기록에 정리한 뒤 제출.
토큰이나 Authorization 헤더 값이 포함된 캡처는 공유하지 않기.

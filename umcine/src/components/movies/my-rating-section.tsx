import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useState, type SubmitEvent } from 'react'
import type { MemberRating } from '../../api/members/models'
import { memberQueries } from '../../api/members/queries'
import { useMyMemberId } from '../../hooks/use-me'
import {
  useCreateRatingMutation,
  useDeleteRatingMutation,
  useUpdateRatingMutation,
} from '../../hooks/use-rating-mutations'
import { useAuthStore } from '../../stores/auth-store'
import { cn } from '../../utils/cn'

const COMMENT_MAX_LENGTH = 200
const STARS = [1, 2, 3, 4, 5]

const boxClass = 'mt-8 rounded-xl border border-white/15 bg-black/40 p-5 text-white backdrop-blur-sm'
const buttonClass =
  'h-10 cursor-pointer rounded-lg px-4 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-40'

interface MyRatingSectionProps {
  movieId: number
}

// 영화 상세의 내 평점 영역이에요. 내 평점 목록(GET /members/{memberId}/ratings)에서 이 영화의 평점을 찾아요.
export function MyRatingSection({ movieId }: MyRatingSectionProps) {
  const isLoggedIn = useAuthStore((state) => Boolean(state.accessToken))
  const memberId = useMyMemberId()
  const ratingsQuery = useQuery({ ...memberQueries.ratings(memberId), enabled: isLoggedIn && memberId !== null })

  if (!isLoggedIn) {
    return (
      <section className={boxClass}>
        <h2 className="mb-2 text-lg font-bold">내 평점</h2>
        <p className="text-sm text-white/70">
          <Link className="font-bold text-white underline" to="/login">
            로그인
          </Link>
          하면 평점을 남길 수 있어요.
        </p>
      </section>
    )
  }

  if (memberId === null) {
    return (
      <section className={boxClass}>
        <p className="text-sm text-white/70">회원 번호를 확인할 수 없어 평점을 불러오지 못했어요.</p>
      </section>
    )
  }

  if (ratingsQuery.isPending) {
    return (
      <section className={boxClass} aria-busy="true">
        <div className="h-24 animate-pulse rounded-lg bg-white/10" />
      </section>
    )
  }

  if (ratingsQuery.isError) {
    return (
      <section className={boxClass}>
        <p className="mb-3 text-sm text-white/70">평점을 불러오지 못했어요.</p>
        <button className={`${buttonClass} bg-action-primary`} type="button" onClick={() => ratingsQuery.refetch()}>
          다시 시도
        </button>
      </section>
    )
  }

  const myRating = ratingsQuery.data.find((rating) => rating.movieId === movieId) ?? null

  // 평점이 생기거나 사라지면 key가 바뀌어 폼 상태를 새로 시작해요.
  return <RatingBox key={myRating?.ratingId ?? 'new'} movieId={movieId} memberId={memberId} myRating={myRating} />
}

interface RatingBoxProps {
  movieId: number
  memberId: number
  myRating: MemberRating | null
}

function RatingBox({ movieId, memberId, myRating }: RatingBoxProps) {
  const [isEditing, setIsEditing] = useState(myRating === null)
  const [score, setScore] = useState(myRating?.score ?? 0)
  const [comment, setComment] = useState(myRating?.comment ?? '')

  const createMutation = useCreateRatingMutation(memberId)
  const updateMutation = useUpdateRatingMutation(memberId)
  const deleteMutation = useDeleteRatingMutation(memberId)
  const isPending = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending

  const trimmedComment = comment.trim()
  const canSubmit = score >= 1 && score <= 5 && trimmedComment.length <= COMMENT_MAX_LENGTH && !isPending

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!canSubmit) return

    const body = { score, comment: trimmedComment || null }
    if (myRating) {
      updateMutation.mutate({ ratingId: myRating.ratingId, ...body }, { onSuccess: () => setIsEditing(false) })
    } else {
      createMutation.mutate({ movieId, ...body })
    }
  }

  const handleDelete = () => {
    if (!myRating || isPending) return
    deleteMutation.mutate(myRating.ratingId)
  }

  const handleCancel = () => {
    setScore(myRating?.score ?? 0)
    setComment(myRating?.comment ?? '')
    setIsEditing(false)
  }

  if (myRating && !isEditing) {
    return (
      <section className={boxClass}>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold">내 평점</h2>
          <div className="flex gap-2">
            <button
              className={`${buttonClass} border border-white/40`}
              type="button"
              disabled={isPending}
              onClick={() => setIsEditing(true)}
            >
              수정
            </button>
            <button
              className={`${buttonClass} bg-red-600`}
              type="button"
              disabled={isPending}
              onClick={handleDelete}
            >
              {deleteMutation.isPending ? '삭제 중' : '삭제'}
            </button>
          </div>
        </div>
        <StarDisplay score={myRating.score} />
        <p className="mt-2 text-sm text-white/80">{myRating.comment || '코멘트가 없어요.'}</p>
      </section>
    )
  }

  return (
    <section className={boxClass}>
      <h2 className="mb-3 text-lg font-bold">{myRating ? '내 평점 수정' : '평점 남기기'}</h2>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit} noValidate>
        <fieldset className="flex items-center gap-1" disabled={isPending}>
          <legend className="sr-only">별점</legend>
          {STARS.map((star) => (
            <button
              key={star}
              className="cursor-pointer p-0.5"
              type="button"
              aria-label={`${star}점`}
              aria-pressed={score === star}
              onClick={() => setScore(star)}
            >
              <img
                // 아이콘이 검은색이라 어두운 배경에서 보이도록 흰색으로 반전해요.
                className="size-7 invert"
                src={star <= score ? '/icons/star.svg' : '/icons/star-outline.svg'}
                alt=""
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-white/70">{score > 0 ? `${score}점` : '별점을 골라 주세요'}</span>
        </fieldset>

        <label className="sr-only" htmlFor="rating-comment">
          코멘트
        </label>
        <textarea
          id="rating-comment"
          className="min-h-20 resize-none rounded-lg border border-white/20 bg-white/10 p-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-white/60"
          placeholder="영화에 대한 한 줄 평을 남겨 주세요 (선택)"
          value={comment}
          disabled={isPending}
          onChange={(e) => setComment(e.target.value)}
        />
        <p className={cn('text-right text-xs', trimmedComment.length > COMMENT_MAX_LENGTH ? 'text-red-400' : 'text-white/50')}>
          {trimmedComment.length}/{COMMENT_MAX_LENGTH}
        </p>

        <div className="flex justify-end gap-2">
          {myRating && (
            <button
              className={`${buttonClass} border border-white/40`}
              type="button"
              disabled={isPending}
              onClick={handleCancel}
            >
              취소
            </button>
          )}
          <button className={`${buttonClass} bg-action-primary`} type="submit" disabled={!canSubmit}>
            {isPending ? '저장 중' : myRating ? '수정하기' : '등록하기'}
          </button>
        </div>
      </form>
    </section>
  )
}

function StarDisplay({ score }: { score: number }) {
  return (
    <p className="flex items-center gap-0.5" aria-label={`별점 ${score}점`}>
      {STARS.map((star) => (
        <img
          key={star}
          className="size-5 invert"
          src={star <= score ? '/icons/star.svg' : '/icons/star-outline.svg'}
          alt=""
        />
      ))}
      <span className="ml-1 text-sm font-bold">{score}</span>
    </p>
  )
}

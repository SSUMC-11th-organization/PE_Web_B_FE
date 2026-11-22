import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ratingQueries } from "@/api/ratings/rating-queries";
import { ErrorMessage } from "@/components/error-message";
import { useCreateRatingMutation } from "@/hooks/use-create-rating-mutation";
import { useDeleteRatingMutation } from "@/hooks/use-delete-rating-mutation";
import { useUpdateRatingMutation } from "@/hooks/use-update-rating-mutation";
import { useAuthStore } from "@/stores/auth-store";
import { getMemberIdFromToken } from "@/utils/auth/get-member-id-from-token";

const SCORES = [1, 2, 3, 4, 5];
const MAX_COMMENT_LENGTH = 500;

interface RatingFormProps {
  initialScore: number;
  initialComment: string;
  submitLabel: string;
  isPending: boolean;
  onSubmit: (values: { score: number; comment?: string }) => void;
  onCancel?: () => void;
}

// 평점 등록과 수정에 함께 쓰는 입력 폼이에요
function RatingForm({
  initialScore,
  initialComment,
  submitLabel,
  isPending,
  onSubmit,
  onCancel,
}: RatingFormProps) {
  const [score, setScore] = useState(initialScore);
  const [comment, setComment] = useState(initialComment);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPending) return;

    const trimmedComment = comment.trim();
    onSubmit({ score, comment: trimmedComment || undefined });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        별점
        <select
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
          disabled={isPending}
        >
          {SCORES.map((value) => (
            <option key={value} value={value}>
              {value}점
            </option>
          ))}
        </select>
      </label>
      <label>
        후기
        <textarea
          value={comment}
          maxLength={MAX_COMMENT_LENGTH}
          onChange={(e) => setComment(e.target.value)}
          disabled={isPending}
        />
      </label>
      <button type="submit" disabled={isPending}>
        {isPending ? "저장 중" : submitLabel}
      </button>
      {onCancel && (
        <button type="button" onClick={onCancel} disabled={isPending}>
          취소
        </button>
      )}
    </form>
  );
}

interface MovieRatingSectionProps {
  movieId: number;
}

export function MovieRatingSection({ movieId }: MovieRatingSectionProps) {
  const accessToken = useAuthStore((state) => state.accessToken);
  // 내 정보 조회 응답에는 memberId가 없어서 토큰의 sub에서 꺼내요
  const memberId = getMemberIdFromToken(accessToken);

  const ratingsQuery = useQuery({
    ...ratingQueries.byMember(memberId ?? 0),
    enabled: memberId !== null,
  });

  const createMutation = useCreateRatingMutation();
  const updateMutation = useUpdateRatingMutation();
  const deleteMutation = useDeleteRatingMutation();
  const [isEditing, setIsEditing] = useState(false);

  if (memberId === null) {
    return (
      <section>
        <h2>내 평점</h2>
        <p>
          로그인하면 평점을 남길 수 있어요. <Link to="/login">로그인</Link>
        </p>
      </section>
    );
  }

  if (ratingsQuery.isPending) {
    return (
      <section>
        <h2>내 평점</h2>
        <p>평점을 불러오는 중이에요.</p>
      </section>
    );
  }

  if (ratingsQuery.isError) {
    return (
      <section>
        <h2>내 평점</h2>
        <ErrorMessage
          message="평점을 불러오지 못했어요."
          onRetry={() => ratingsQuery.refetch()}
        />
      </section>
    );
  }

  // 내 평점 목록 중에서 이 영화의 평점을 찾아요
  const myRating = ratingsQuery.data.find((rating) => rating.movieId === movieId);

  if (!myRating) {
    return (
      <section>
        <h2>내 평점</h2>
        <RatingForm
          initialScore={5}
          initialComment=""
          submitLabel="평점 등록"
          isPending={createMutation.isPending}
          onSubmit={({ score, comment }) =>
            createMutation.mutate({ movieId, score, comment })
          }
        />
      </section>
    );
  }

  if (isEditing) {
    return (
      <section>
        <h2>내 평점</h2>
        <RatingForm
          initialScore={myRating.score}
          initialComment={myRating.comment ?? ""}
          submitLabel="수정 완료"
          isPending={updateMutation.isPending}
          onSubmit={({ score, comment }) =>
            updateMutation.mutate(
              { ratingId: myRating.ratingId, score, comment },
              { onSuccess: () => setIsEditing(false) },
            )
          }
          onCancel={() => setIsEditing(false)}
        />
      </section>
    );
  }

  const handleDelete = () => {
    if (deleteMutation.isPending) return;
    if (window.confirm("평점을 삭제할까요?")) {
      deleteMutation.mutate(myRating.ratingId);
    }
  };

  return (
    <section>
      <h2>내 평점</h2>
      <p>{myRating.score}점</p>
      {myRating.comment && <p>{myRating.comment}</p>}
      <button type="button" onClick={() => setIsEditing(true)}>
        수정
      </button>
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleteMutation.isPending}
      >
        {deleteMutation.isPending ? "삭제 중" : "삭제"}
      </button>
    </section>
  );
}

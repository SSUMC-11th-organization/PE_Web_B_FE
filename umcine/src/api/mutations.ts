import { mutationOptions } from "@tanstack/react-query";
import { login } from "./auth/login";
import { addFavorite, removeFavorite } from "./favorites/favorites";
import { signup } from "./members/signup";
import { updateMe } from "./members/update-me";
import { createRating, deleteRating, updateRating } from "./ratings/ratings";

// 선택 미션: mutationOptions로 mutationKey · mutationFn을 한곳에 모아요.
// 화면마다 다른 성공 · 실패 처리(alert, 이동, 캐시 갱신)는 각 훅에서 펼쳐서(...) 덧붙여요.
export const authMutations = {
  login: () => mutationOptions({ mutationKey: ["auth", "login"], mutationFn: login }),
  signup: () => mutationOptions({ mutationKey: ["members", "signup"], mutationFn: signup }),
};

export const memberMutations = {
  updateMe: () => mutationOptions({ mutationKey: ["members", "me", "update"], mutationFn: updateMe }),
};

export const favoriteMutations = {
  // true면 추가, false면 해제 요청을 보내요.
  toggle: (movieId: number) =>
    mutationOptions({
      mutationKey: ["favorites", "toggle", movieId],
      mutationFn: (nextIsFavorite: boolean) =>
        nextIsFavorite ? addFavorite({ movieId }) : removeFavorite(movieId),
    }),
};

export const ratingMutations = {
  create: () => mutationOptions({ mutationKey: ["ratings", "create"], mutationFn: createRating }),
  update: () => mutationOptions({ mutationKey: ["ratings", "update"], mutationFn: updateRating }),
  remove: () => mutationOptions({ mutationKey: ["ratings", "delete"], mutationFn: deleteRating }),
};

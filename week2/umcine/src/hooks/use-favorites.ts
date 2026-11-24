import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    addFavorite,
    getFavoriteStatus,
    getFavorites,
    removeFavorite,
    type Favorite,
} from "../api/favorites/favorites";
import { favoriteKeys } from "../api/query-keys";
import { getApiErrorMessage } from "../api/get-api-error-message";
import { useAuthStore } from "../stores/auth-store";

// 내 즐겨찾기 목록: 마이페이지와 영화 카드가 함께 써요.
export function useFavoritesQuery(enabled = true) {
    const accessToken = useAuthStore((state) => state.accessToken);

    return useQuery({
        queryKey: favoriteKeys.list,
        queryFn: getFavorites,
        enabled: Boolean(accessToken) && enabled,
        retry: false,
    });
}

// 영화 상세에서 이 영화를 즐겨찾기했는지 조회해요.
export function useFavoriteStatusQuery(movieId: number, enabled = true) {
    const accessToken = useAuthStore((state) => state.accessToken);

    return useQuery({
        queryKey: favoriteKeys.status(movieId),
        queryFn: () => getFavoriteStatus(movieId),
        enabled: Boolean(accessToken) && enabled,
        retry: false,
    });
}

interface ToggleFavoriteVariables {
    movieId: number;
    /** 요청을 보내기 전의 즐겨찾기 여부 */
    isFavorite: boolean;
}

export function useToggleFavoriteMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ movieId, isFavorite }: ToggleFavoriteVariables): Promise<void> => {
            if (isFavorite) await removeFavorite(movieId);
            else await addFavorite(movieId);
        },
        // 버튼을 누르자마자 바뀐 상태를 보여주고, 실패하면 되돌려요.
        onMutate: async ({ movieId, isFavorite }) => {
            await queryClient.cancelQueries({ queryKey: favoriteKeys.all });

            const previousStatus = queryClient.getQueryData<boolean>(favoriteKeys.status(movieId));
            const previousList = queryClient.getQueryData<Favorite[]>(favoriteKeys.list);

            queryClient.setQueryData<boolean>(favoriteKeys.status(movieId), !isFavorite);
            queryClient.setQueryData<Favorite[]>(favoriteKeys.list, (favorites) => {
                if (!favorites) return favorites;
                if (isFavorite) return favorites.filter((favorite) => favorite.movieId !== movieId);
                // favoriteId는 서버 응답 후 다시 조회해서 채워요.
                return [{ favoriteId: -movieId, movieId, createdAt: new Date().toISOString() }, ...favorites];
            });

            return { previousStatus, previousList };
        },
        onError: (error, { movieId }, context) => {
            queryClient.setQueryData(favoriteKeys.status(movieId), context?.previousStatus);
            queryClient.setQueryData(favoriteKeys.list, context?.previousList);
            alert(getApiErrorMessage(error, "즐겨찾기를 바꾸지 못했어요. 다시 시도해 주세요."));
        },
        // 성공, 실패와 관계없이 서버의 최신 목록으로 맞춰요.
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: favoriteKeys.all });
        },
    });
}

import useSWR from "swr";
import fetcher from "@/lib/utils/fetcher";
import { backendUrl } from "@/lib/config";
import { ResponseGetBoardReviewRank } from "@/lib/types/camps/response";

function useBoardReviewRankList() {
  const { isLoading, data, error, mutate } = useSWR<
    ResponseGetBoardReviewRank[]
  >(backendUrl + `/api/camps/reviews/board/rank`, fetcher);

  return {
    isLoading,
    boardReviewRanks: data,
    error,
    mutate,
  };
}

export default useBoardReviewRankList;

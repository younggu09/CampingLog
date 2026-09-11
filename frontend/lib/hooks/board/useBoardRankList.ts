import useSWR from "swr";
import fetcher from "@/lib/utils/fetcher";
import { ResponseGetBoardRank } from "@/lib/types/board/response";
import { backendUrl } from "@/lib/config";

function useBoardRankList() {
  const key = `${backendUrl}/api/boards/rank`;
  const { isLoading, data, error, mutate } = useSWR<ResponseGetBoardRank[]>(
    key,
    fetcher
  );

  return {
    isLoading,
    boardsRank: data,
    error,
    mutate,
  };
}

export default useBoardRankList;

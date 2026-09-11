import useSWR from "swr";
import fetcher from "@/lib/utils/fetcher";
import { ResponseGetBoardDetail } from "@/lib/types/board/response";

export default function useBoardDetail(boardId: string | null) {
  // boardId가 있을 때만 API를 호출합니다.
  const key = boardId ? `/api/boards/${boardId}` : null;

  const { data, error, isLoading, mutate } = useSWR<ResponseGetBoardDetail>(
    key,
    fetcher
  );

  return {
    board: data,
    error,
    isLoading,
    mutate,
  };
}

import useSWR from "swr";
import fetcher from "@/lib/utils/fetcher";
import { ResponseGetBoardByCategoryWrapper } from "@/lib/types/board/response";

function useBoardList(category: string, page: number = 1, size: number = 10) {
  const key = category
    ? `/api/boards/category?category=${category}&page=${page}&size=${size}`
    : null;

  const { data, error, isLoading, mutate } =
    useSWR<ResponseGetBoardByCategoryWrapper>(key, fetcher);

  return {
    paginatedData: data,
    boards: data?.content,
    isLoading,
    error,
    mutate,
  };
}

export default useBoardList;

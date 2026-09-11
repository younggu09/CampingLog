import useSWR from "swr";
import fetcher from "@/lib/utils/fetcher";
import { ResponseGetBoardByKeywordWrapper } from "@/lib/types/board/response";

export default function useBoardSearch(
  keyword: string,
  category: string,
  page: number,
  size: number
) {
  const url = `/api/boards/search?keyword=${keyword}&category=${category}&page=${page}&size=${size}`;

  const { data, error, isLoading } = useSWR<ResponseGetBoardByKeywordWrapper>(
    keyword ? url : null,
    fetcher
  );

  return {
    paginatedData: data,
    boards: data?.content,
    isLoading,
    error,
  };
}

import useSWR from "swr";
import fetcher from "@/lib/utils/fetcher";
import { backendUrl } from "@/lib/config";
import { ResponseGetCampWrapper } from "@/lib/types/camps/response";

function useCampList<T>(pageNo: number, size: number) {
  const { isLoading, data, error, mutate } = useSWR<ResponseGetCampWrapper<T>>(
    `${backendUrl}/api/camps/list?pageNo=${pageNo}&size=${size}`,
    fetcher
  );

  return {
    isLoading,
    campLatestList: data?.items || [],
    paginationData: data ? {
      currentPage: data.page,
      totalPages: data.totalPage,
      totalCount: data.totalCount,
      hasNext: data.hasNext,
      size: data.size
    } : null,
    error,
    mutate,
  };
}
export default useCampList;
import useSWR from "swr";
import fetcher from "@/lib/utils/fetcher";
import { backendUrl } from "@/lib/config";
import { ResponseGetMember } from "@/lib/types/member/response";

function useMemberDetail() {
  const { isLoading, data, error, mutate } = useSWR<ResponseGetMember>(
    `${backendUrl}/api/members/mypage`,
    fetcher
  );

  return {
    isLoading,
    member: data ?? null,
    error,
    mutate,
  };
}

export default useMemberDetail;

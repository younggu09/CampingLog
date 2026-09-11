import useSWR from "swr";
import fetcher from "@/lib/utils/fetcher";
import { backendUrl } from "@/lib/config";
import { ResponseGetMemberActivitySummary } from "@/lib/types/member/response";

function useMemberActivitySummary() {
  const { data, error, mutate } = useSWR<ResponseGetMemberActivitySummary>(
    `${backendUrl}/api/members/mypage/summary`,
    fetcher
  );

  return {
    activitySummary: data,
    error,
    mutate,
  };
}

export default useMemberActivitySummary;

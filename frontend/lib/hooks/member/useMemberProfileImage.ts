import useSWR from "swr";
import fetcher from "@/lib/utils/fetcher";
import { backendUrl } from "@/lib/config";
import { ResponseGetMemberProfileImage } from "@/lib/types/member/response";

function useMemberProfileImage() {
  const { data, error, mutate } = useSWR<ResponseGetMemberProfileImage>(
    `${backendUrl}/api/members/mypage/profile-image`,
    fetcher
  );

  return {
    profileImage: data?.profileImage,
    error,
    mutate,
  };
}

export default useMemberProfileImage;

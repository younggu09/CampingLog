import { ResponseGetRanking } from "@/lib/types/member/response";
import Image from "next/image";
import { backendUrl, imageUrl } from "@/lib/config";

async function fetchRankings(): Promise<ResponseGetRanking[]> {
  const res = await fetch(`${backendUrl}/api/members/rank`, {
    next: { revalidate: 604800 },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch Rankings");
  }
  const data = await res.json();
  return data;
}

export default async function MembersRankServer() {
  let rankings: ResponseGetRanking[] = [];
  try {
    rankings = await fetchRankings();
  } catch (error) {
    return <div>Error loading Rankings</div>;
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <h3 className="font-bold text-sm mb-3 text-gray-700">명예의 캠핑로거</h3>
      <div className="space-y-2">
        {rankings.map((ranking, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md transition-colors"
          >
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-600">
                {index + 1}등
              </span>
              {/* ✅ 뱃지 이미지 */}
              <Image
                src={`/image/${ranking.memberGrade}.png`}
                alt={`${ranking.memberGrade} 배지`}
                width={24}
                height={24}
              />
              {/* 프로필 이미지 */}
              <Image
                src={
                  ranking.profileImage
                    ? `${imageUrl}/images/member/profile/${ranking.profileImage}`
                    : "/image/default.png"
                }
                alt={`${ranking.nickname} 프로필`}
                width={32}
                height={32}
                className="rounded-full"
              />

              {/* 닉네임 */}
              <span className="font-medium text-gray-700 text-sm">
                {ranking.nickname}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

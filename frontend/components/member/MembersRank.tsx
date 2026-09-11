// components/RankingList.tsx
"use client";

import { useState, useEffect } from "react";
import { ResponseGetRanking } from "@/lib/types/member/response";
import Image from "next/image";
import { backendUrl } from "@/lib/config";

function MembersRank() {
  const [rankings, setRankings] = useState<ResponseGetRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const imageRoot = process.env.NEXT_PUBLIC_IMAGE_ROOT_URL || "";
  useEffect(() => {
    async function fetchRankings() {
      try {
        const response = await fetch(`${backendUrl}/api/members/rank`);
        if (!response.ok) throw new Error("Failed to fetch");

        const data = await response.json();
        setRankings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchRankings();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
                src={`/image/${ranking.memberGrade}.png`.toLocaleLowerCase()}
                alt={`${ranking.memberGrade} 배지`}
                width={24}
                height={24}
              />
              {/* 프로필 이미지 */}
              <Image
                src={
                  ranking.profileImage
                    ? `${imageRoot}/images/member/profile/${ranking.profileImage}`
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

export default MembersRank;

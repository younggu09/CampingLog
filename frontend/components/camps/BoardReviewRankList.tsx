"use client";

import Link from "next/link";
import useBoardReviewRankList from "@/lib/hooks/camps/useBoardReviewRankList";
import Image from "next/image";
import campDefault from "@/public/image/camp-default.png";
import { Star } from "lucide-react";

function BoardReviewRankList() {
  // useBoards 훅 사용
  const { isLoading, boardReviewRanks, error } = useBoardReviewRankList();

  console.log("캠핑 revalidate");
  // 로딩 상태 처리
  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  // 에러 상태 처리
  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error: {error.message}
      </div>
    );
  }

  // 데이터가 없을 때 처리
  if (!boardReviewRanks || boardReviewRanks.length === 0) {
    return <div className="text-center py-8">게시글이 없습니다.</div>;
  }

  return (
    <div className="mt-6">
      <h3 className="font-bold text-lg mb-4 text-gray-800 flex items-center space-x-2">
        <span>🏕️ 캠핑장 정보</span>
      </h3>
      <div className="grid grid-cols-3 gap-4">
        {boardReviewRanks.map((board, index) => (
          <Link key={index} href={`/camps/detail/${board.mapX}/${board.mapY}`}>
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <Image
                src={board.firstImageUrl || campDefault}
                alt={"캠핑장 이미지"}
                width={400}
                height={256}
                className="w-full h-32 object-cover"
              />
              <div className="p-3">
                <h4 className="font-medium text-gray-800 text-sm mb-1 line-clamp-2">
                  {board.facltNm}
                </h4>
                <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                  <div className="flex gap-1">
                    <Star
                      className="w-3 h-3 mt-0.5 text-[#4A6920]"
                      fill="currentColor"
                    />
                    {board.reviewAverage.toFixed(1).toString()}
                  </div>
                  <span>
                    {board.doNm} {board.sigunguNm}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default BoardReviewRankList;

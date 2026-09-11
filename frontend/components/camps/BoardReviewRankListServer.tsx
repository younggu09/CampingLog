import Link from "next/link";
import Image from "next/image";
import campDefault from "@/public/image/camp-default.png";
import { Star } from "lucide-react";
import { ResponseGetBoardReviewRank } from "@/lib/types/camps/response";
import { backendUrl } from "@/lib/config";

async function fetchBoardReviewRankList(): Promise<
  ResponseGetBoardReviewRank[]
> {
  const res = await fetch(`${backendUrl}/api/camps/reviews/board/rank`, {
    next: { revalidate: 604800 },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch BoardReviewRankList");
  }
  const data = res.json();
  return data;
}

export default async function BoardReviewRankListServer() {
  let boardReviewRanks: ResponseGetBoardReviewRank[] = [];
  try {
    boardReviewRanks = await fetchBoardReviewRankList();
  } catch (error) {
    return <div>Error loading BoardReviewRankList</div>;
  }

  return (
    <div className="mt-6">
      <h3 className="font-bold text-lg mb-4 text-gray-800 flex items-center space-x-2">
        <span>🏕️ 캠핑장 정보</span>
      </h3>
      <div className="grid grid-cols-3 gap-4">
        {boardReviewRanks.map((board, index) => (
          <Link
            key={index}
            href={`${backendUrl}/camps/detail/${board.mapX}/${board.mapY}`}
          >
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

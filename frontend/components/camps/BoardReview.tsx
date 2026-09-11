"use client";

import { ResponseGetBoardReview } from "@/lib/types/camps/response";
import StarRating from "./StarRating";

interface BoardReviewProps {
    camp: ResponseGetBoardReview;
}


function BoardReview({ camp }: BoardReviewProps ) {
    const reviewAverage = camp?.reviewAverage ?? 0.0;
    const reviewCount = camp?.reviewCount ?? 0;

    return (
        <div className="mt-30 mb-10 text-center">
            {/* 별점 정보 */}
            <div className="flex justify-center items-center gap-4 mb-2">
                <StarRating reviewAverage={reviewAverage} starSize="w-8 h-8" gap="gap-3"/>
                <div className="flex gap-1">
                    <div className="text-4xl font-bold pb-2 text-black">
                        {reviewAverage.toFixed(1)}
                    </div>
                    <div className="text-gray-600 pt-2 text-2xl">
                        ({reviewCount})
                    </div>
                </div>
            </div>
            {/* 제목 */}
            <div className="text-2xl font-bold mt-4  text-[#4A6920] border-b-3 border-[#4A6920] w-24 mx-auto pb-1">리 뷰</div>
        </div>
    );
}

export default BoardReview;
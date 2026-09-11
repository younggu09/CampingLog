"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import useCampDetail from "@/lib/hooks/camps/useCampDetail";
import useBoardReview from "@/lib/hooks/camps/useBoardReview";
import useReviewList from "@/lib/hooks/camps/useReviewList"; // 리뷰 목록 훅 import
import CampDetail from "@/components/camps/CampDetail";
import BoardReview from "@/components/camps/BoardReview";
import ReviewList from "@/components/camps/ReviewList";
import AddReview from "@/components/camps/AddReview";

interface Params {
    mapX: string;
    mapY: string;
}

export default function CampDetailPage() {
    const params = useParams();
    const mapX: string = params.mapX as string;
    const mapY: string = params.mapY as string;

    const { campDetail, isLoading, error } = useCampDetail(mapX, mapY);
    const { boardReview, isLoading: reviewBoardLoading, error: reviewBoardError } = useBoardReview(mapX, mapY);

    const [refreshKey, setRefreshKey] = useState(0);

    // 리뷰 목록 가져오기 (refreshKey가 바뀌면 재조회)
    const { reviewList, isLoading: reviewListLoading, error: reviewListError } = useReviewList(mapX, mapY, refreshKey);

    if (isLoading || reviewBoardLoading || reviewListLoading) {
        return (
            <div className="max-w-[1200px] mx-auto p-2">
                <div className="text-center py-10">로딩 중...</div>
            </div>
        );
    }

    if (error || reviewBoardError || reviewListError) {
        return (
            <div className="max-w-[1200px] mx-auto p-2">
                <div className="text-center py-10 text-red-500">
                    에러 발생: {error || reviewBoardError || reviewListError}
                </div>
            </div>
        );
    }

    if (!campDetail) {
        return (
            <div className="max-w-[1200px] mx-auto p-2">
                <div className="text-center py-10">캠핑장 정보를 찾을 수 없습니다.</div>
            </div>
        );
    }

    if (!boardReview) {
        return (
            <div className="max-w-[1200px] mx-auto p-2">
                <div className="text-center py-10">리뷰 정보를 찾을 수 없습니다.</div>
            </div>
        );
    }

    return (
        <div className="max-w-[1200px] mx-auto p-2">
            <h1 className="text-2xl font-bold mt-3 mb-2">캠핑장 상세</h1>
            <CampDetail camp={campDetail} />
            <BoardReview camp={boardReview} />
            <AddReview
                mapX={mapX}
                mapY={mapY}
                onSuccess={() => setRefreshKey(prev => prev + 1)}
            />
            <ReviewList reviewList={reviewList} mapX={mapX} mapY={mapY} />
        </div>
    );
}
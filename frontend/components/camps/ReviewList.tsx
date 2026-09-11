"use client";

import { useState } from "react";
import Image from "next/image";
import StarRating from "./StarRating";
import {
  ResponseGetCampWrapper,
  ResponseGetReviewList,
} from "@/lib/types/camps/response";

interface ReviewListProps {
  reviewList: ResponseGetCampWrapper<ResponseGetReviewList> | null;
  mapX: string;
  mapY: string;
}

function ReviewList({ reviewList, mapX, mapY }: ReviewListProps) {
  const PAGE_SIZE = 4;
  const [reviews, setReviews] = useState(reviewList?.items ?? []);
  const [page, setPage] = useState(reviewList?.page ?? 0);
  const [hasNext, setHasNext] = useState(reviewList?.hasNext ?? false);

  if (!reviews || reviews.length === 0) {
    return <div>리뷰가 없습니다.</div>;
  }

  const handleShowMore = async () => {
    const nextPage = page + 1;
    const url = `/api/camps/reviews/${mapX}/${mapY}?pageNo=${nextPage}&size=${PAGE_SIZE}`;
    console.log("fetch URL:", url);
    const res = await fetch(url);
    const data = await res.json();
    console.log("받아온 리뷰:", data.items);
    setReviews((prev) => [...prev, ...(data.items ?? [])]);
    setPage(data.page);
    setHasNext(data.hasNext);
  };

  return (
    <div>
      {reviews.map((review) => (
        <div
          key={review.createAt + review.email}
          className="flex items-center gap-6 py-6 border-b"
        >
          <img
            src={`http://localhost:8001/images/review/${review.reviewImage}`}
            alt="리뷰 이미지"
            width={120}
            height={120}
            className="rounded-xl object-cover"
            onError={(e) => {
              e.currentTarget.src = "/image/camp-default.png";
            }}
          />
          <div className="flex-1">
            <div className="flex flex-col gap-5">
              <StarRating reviewAverage={review.reviewScore} />
              <div className="flex justify-between">
                <div className="mb-2 font-medium">{review.reviewContent}</div>
                <div className="flex items-center gap-2 text-[#4A6920] mb-1">
                  <span className="ml-2 text-gray-700">{review.nickname}</span>
                  <span className="ml-2 text-gray-500">
                    {new Date(review.createAt).toLocaleString("ko-KR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      {hasNext && (
        <div className="flex justify-center mt-8 mb-4">
          <button
            className="px-4 py-2 bg-[#4A6920] text-white rounded"
            onClick={handleShowMore}
          >
            더보기
          </button>
        </div>
      )}
    </div>
  );
}

export default ReviewList;

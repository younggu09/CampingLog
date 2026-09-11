import { useEffect, useState } from "react";

export default function useReviewList(mapX: string, mapY: string, refreshKey?: number) {
  const [reviewList, setReviewList] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsLoading(true);
    setError("");
    fetch(`/api/camps/reviews/${mapX}/${mapY}`)
      .then(res => res.json())
      .then(data => setReviewList(data))
      .catch(err => setError("리뷰 목록을 불러오지 못했습니다."))
      .finally(() => setIsLoading(false));
  }, [mapX, mapY, refreshKey]);

  return { reviewList, isLoading, error };
}
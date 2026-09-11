import { Star, StarHalf } from "lucide-react";

interface StarRatingProps {
  reviewAverage: number;
  starSize?: string; // 별 크기
  gap?: string;      // 별 사이 간격
}

export default function StarRating({
  reviewAverage,
  starSize = "w-5 h-5",
  gap = "gap-1"
}: StarRatingProps) {
  const starColor = "#4A6920";
  return (
    <span className={`flex items-center ${gap}`}>
      {[1, 2, 3, 4, 5].map((i) =>
        reviewAverage >= i ? (
          <Star key={i} className={starSize} color={starColor} fill={starColor} />
        ) : reviewAverage >= i - 0.5 ? (
          <StarHalf key={i} className={starSize} color={starColor} fill={starColor} />
        ) : (
          <span key={i} />
        )
      )}
    </span>
  );
}
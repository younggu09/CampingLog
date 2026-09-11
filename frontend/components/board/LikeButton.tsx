"use client";

import { ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LikeButtonProps {
  isLiked: boolean;
  likeCount: number;
  onClick: () => void;
}

export default function LikeButton({
  isLiked,
  likeCount,
  onClick,
}: LikeButtonProps) {
  return (
    <div className="flex justify-center my-8">
      <Button
        onClick={onClick}
        variant={isLiked ? "camping-solid" : "outline"}
        className="flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-200 ease-in-out transform hover:scale-105"
      >
        <ThumbsUp
          fill={isLiked ? "currentColor" : "none"}
          className={`w-5 h-5 transition-colors ${
            isLiked ? "text-white" : "text-campinggreen"
          }`}
        />
        <span className="text-lg font-semibold">{likeCount}</span>
      </Button>
    </div>
  );
}

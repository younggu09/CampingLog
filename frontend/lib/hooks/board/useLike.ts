import { useState, useEffect } from "react";
import { addLikeRequest, removeLikeRequest } from "@/lib/api/like";
import { ResponseToggleLike } from "@/lib/types/board/response";

interface UseLikeProps {
  boardId: string;
  initialIsLiked: boolean;
  initialLikeCount: number;
}

export default function useLike({
  boardId,
  initialIsLiked,
  initialLikeCount,
}: UseLikeProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  useEffect(() => {
    setIsLiked(initialIsLiked);
    setLikeCount(initialLikeCount);
  }, [initialIsLiked, initialLikeCount]);

  const handleLikeClick = async () => {
    if (!boardId) {
      alert("잘못된 접근입니다.");
      return;
    }

    const originalIsLiked = isLiked;
    const originalLikeCount = likeCount;

    setIsLiked((originalIsLiked) => !originalIsLiked);
    setLikeCount(
      originalIsLiked ? originalLikeCount - 1 : originalLikeCount + 1
    );

    try {
      let response: ResponseToggleLike;
      if (originalIsLiked) {
        response = await removeLikeRequest(boardId);
      } else {
        response = await addLikeRequest(boardId);
      }

      setIsLiked(response.liked);
      setLikeCount(response.likeCount);
    } catch (error) {
      console.error("좋아요 처리 실패:", error);
      setIsLiked(originalIsLiked);
      setLikeCount(originalLikeCount);
      alert("요청에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return { isLiked, likeCount, handleLikeClick };
}

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BoardForm from "@/components/board/BoardForm";
import { ResponseGetBoardDetail } from "@/lib/types/board/response"; // 게시글 상세 정보 타입 (필요시 생성)

export default function BoardEditPage() {
  const params = useParams();
  const boardId = params.boardId as string;

  const [initialData, setInitialData] = useState<ResponseGetBoardDetail | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!boardId) return;

    const fetchBoardData = async () => {
      try {
        const token = localStorage.getItem("Authorization");
        if (!token) {
          throw new Error("로그인이 필요합니다.");
        }

        // 백엔드에 특정 게시글의 데이터를 요청하는 API
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_ROOT_URL}/api/boards/${boardId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          throw new Error("게시글 정보를 불러오는 데 실패했습니다.");
        }

        const data: ResponseGetBoardDetail = await response.json();
        setInitialData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "알 수 없는 오류 발생");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBoardData();
  }, [boardId]);

  if (isLoading) return <div>데이터를 불러오는 중...</div>;
  if (error) return <div>오류: {error}</div>;
  if (!initialData) return <div>게시글 정보가 없습니다.</div>;

  // BoardForm에 '수정 모드'임을 알리는 props와 기존 데이터를 전달합니다.
  return (
    <BoardForm isEditMode={true} boardId={boardId} initialData={initialData} />
  );
}

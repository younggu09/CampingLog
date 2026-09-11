"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ConfirmModal from "@/components/common/ConfirmModal";
import CommentSection from "@/components/comment/CommentSection";
import { ResponseGetBoardDetail } from "@/lib/types/board/response";
import { ResponseGetMember } from "@/lib/types/member/response";

// 1. 좋아요 기능을 위한 훅과 컴포넌트를 임포트합니다.
import useLike from "@/lib/hooks/board/useLike";
import LikeButton from "@/components/board/LikeButton";

export default function BoardDetailPage() {
  const router = useRouter();
  const params = useParams();
  const boardId = params.boardId as string;

  const [board, setBoard] = useState<ResponseGetBoardDetail | null>(null);
  const [currentUser, setCurrentUser] = useState<ResponseGetMember | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 2. useLike 훅을 호출하여 상태와 핸들러를 가져옵니다.
  //    board 데이터가 로드되기 전의 초기값을 제공합니다.
  const { isLiked, likeCount, handleLikeClick } = useLike({
    boardId,
    initialIsLiked: board?.isLiked ?? false,
    initialLikeCount: board?.likeCount ?? 0,
  });

  useEffect(() => {
    if (!boardId) return;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("Authorization");

        // 3. 게시글 상세 정보를 가져올 때, 인증 토큰을 함께 보냅니다.
        //    백엔드는 이 토큰을 보고 현재 유저의 좋아요 여부(isLiked)를 계산해줘야 합니다.
        const boardRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_ROOT_URL}/api/boards/${boardId}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        if (!boardRes.ok) throw new Error("게시글을 불러오는 데 실패했습니다.");
        const boardData: ResponseGetBoardDetail = await boardRes.json();
        setBoard(boardData);

        // 로그인한 사용자 정보 가져오기 (작성자 확인용)
        if (token) {
          const userRes = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_ROOT_URL}/api/members/mypage`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (userRes.ok) {
            const userData: ResponseGetMember = await userRes.json();
            setCurrentUser(userData);
          }
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [boardId]);

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem("Authorization");
      if (!token) {
        alert("삭제 권한이 없습니다. 로그인 후 다시 시도해주세요.");
        return;
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_ROOT_URL}/api/boards/${boardId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 204) {
        alert("게시글이 삭제되었습니다.");
        router.push("/board");
      } else {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("삭제 실패:", error);
      alert(error instanceof Error ? error.message : "알 수 없는 오류 발생");
    } finally {
      setIsModalOpen(false);
    }
  };

  // 로딩 및 에러 상태 처리 (기존과 동일)
  if (isLoading) {
    return <div className="text-center mt-10">게시글을 불러오는 중...</div>;
  }
  if (error) {
    return <div className="text-center mt-10 text-red-500">오류: {error}</div>;
  }
  if (!board) {
    return <div className="text-center mt-10">게시글 정보가 없습니다.</div>;
  }

  // 작성자와 현재 로그인 유저가 같은지 확인
  const isAuthor = currentUser?.email === board.email;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* 게시글 내용 섹션 */}
      <div className="bg-white shadow-md rounded-lg p-8">
        <div className="border-b pb-4 mb-4">
          <p className="text-sm text-gray-500 mb-2">{board.categoryName}</p>
          <h1 className="text-3xl font-bold text-gray-900">{board.title}</h1>
          <div className="flex items-center justify-between text-sm text-gray-500 mt-3">
            <span>작성자: {board.nickname}</span>
            <span>{new Date(board.createdAt).toLocaleString()}</span>
          </div>
        </div>
        {/* 이미지가 있을 때만 보여주기 */}
        {board.boardImage && (
          <img
            src={board.boardImage}
            alt="게시글 이미지"
            className="max-w-full max-h-96 rounded-lg mb-6 mx-auto"
          />
        )}

        <div
          className="prose max-w-none mt-6 mb-8"
          dangerouslySetInnerHTML={{
            __html: board.content.replace(/\n/g, "<br />"),
          }}
        />

        {/* 4. LikeButton 컴포넌트를 원하는 위치에 배치하고, 훅에서 받은 값들을 전달합니다. */}
        <LikeButton
          isLiked={isLiked}
          likeCount={likeCount}
          onClick={handleLikeClick}
        />

        {/* 작성자일 경우에만 수정/삭제 버튼 표시 */}
        {isAuthor && (
          <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
            <button
              onClick={() => router.push(`/board/${boardId}/edit`)}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              수정
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              삭제
            </button>
          </div>
        )}
      </div>

      {/* 댓글 섹션 추가 */}
      <CommentSection boardId={boardId} />

      {/* 확인 모달 컴포넌트 */}
      <ConfirmModal
        isOpen={isModalOpen}
        title="게시글 삭제"
        message="정말로 이 게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        onConfirm={handleDeleteConfirm}
        onClose={() => setIsModalOpen(false)}
        confirmText="삭제"
        cancelText="취소"
      />
    </div>
  );
}

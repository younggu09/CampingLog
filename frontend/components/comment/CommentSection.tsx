"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useCommentList from "@/lib/hooks/comment/useCommentList";
import CommentItem from "./CommentItem";
import Pagination from "../common/Pagination";

interface CommentSectionProps {
  boardId: string;
}

export default function CommentSection({ boardId }: CommentSectionProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const COMMENT_PAGE_SIZE = 3;

  const { paginatedComments, comments, isLoading, error, mutate } =
    useCommentList(boardId, currentPage, COMMENT_PAGE_SIZE);

  // 댓글 등록 핸들러 (기존과 동일)
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("Authorization");
      if (!token) {
        alert("로그인이 필요합니다.");
        router.push("/login");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_ROOT_URL}/api/boards/${boardId}/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: newComment }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "댓글 등록에 실패했습니다.");
      }

      alert("댓글이 등록되었습니다.");
      setNewComment("");
      mutate();
    } catch (error) {
      console.error("댓글 등록 실패:", error);
      alert(error instanceof Error ? error.message : "알 수 없는 오류 발생");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 페이지네이션 로직 수정 ---
  const totalPages = paginatedComments?.totalPages ?? 1;
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const prevPage = () => {
    if (hasPrev) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (hasNext) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-4">
        댓글 {paginatedComments ? `(${paginatedComments.totalComments})` : ""}
      </h2>

      {/* 댓글 입력 폼 (기존과 동일) */}
      <form onSubmit={handleCommentSubmit} className="mb-8">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full p-2 border rounded-md"
          rows={3}
          placeholder="따뜻한 댓글을 남겨주세요."
          disabled={isSubmitting}
        />
        <div className="text-right mt-2">
          <button
            type="submit"
            className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 disabled:bg-gray-400"
            disabled={isSubmitting}
          >
            {isSubmitting ? "등록 중..." : "댓글 등록"}
          </button>
        </div>
      </form>

      {/* 댓글 목록 (기존과 동일) */}
      <div className="space-y-6">
        {isLoading && <p>댓글을 불러오는 중...</p>}
        {error && <p>댓글을 불러오는데 실패했습니다.</p>}
        {comments && comments.length > 0
          ? comments.map((comment) => (
              <CommentItem
                key={comment.commentId}
                comment={comment}
                boardId={boardId}
                mutate={mutate}
              />
            ))
          : !isLoading && <p>아직 댓글이 없습니다.</p>}
      </div>

      {/* 댓글 페이지네이션 (props 전달 방식 수정) */}
      <div className="mt-8">
        {paginatedComments && paginatedComments.totalPages > 1 && (
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            hasPrev={hasPrev}
            hasNext={hasNext}
            goToPage={goToPage}
            prevPage={prevPage}
            nextPage={nextPage}
          />
        )}
      </div>
    </div>
  );
}

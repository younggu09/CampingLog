import { useState, useEffect } from "react";
import { ResponseGetComments } from "@/lib/types/board/response";
import { ResponseGetMember } from "@/lib/types/member/response";
import { format } from "date-fns";
import ConfirmModal from "../common/ConfirmModal";

interface CommentItemProps {
  comment: ResponseGetComments;
  boardId: string;
  mutate: () => void;
}

export default function CommentItem({
  comment,
  boardId,
  mutate,
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<ResponseGetMember | null>(
    null
  );

  // 컴포넌트가 마운트될 때 로그인한 사용자 정보를 가져옵니다.
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem("Authorization");
      if (token) {
        try {
          const userRes = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_ROOT_URL}/api/members/mypage`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (userRes.ok) {
            const userData: ResponseGetMember = await userRes.json();
            setCurrentUser(userData);
          }
        } catch (error) {
          console.error("사용자 정보를 가져오는데 실패했습니다.", error);
        }
      }
    };
    fetchCurrentUser();
  }, []); // 빈 배열을 전달하여 컴포넌트가 처음 렌더링될 때 한 번만 실행되도록 합니다.

  // 작성자 여부 확인
  const isAuthor = currentUser?.email === comment.email;

  // 댓글 수정 핸들러
  const handleUpdate = async () => {
    if (editedContent.trim() === "") {
      alert("댓글 내용을 입력해주세요.");
      return;
    }
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("Authorization");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_ROOT_URL}/api/boards/${boardId}/comments/${comment.commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: editedContent }),
        }
      );

      if (!response.ok) throw new Error("댓글 수정에 실패했습니다.");

      alert("댓글이 수정되었습니다.");
      mutate();
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "오류 발생");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 댓글 삭제 핸들러
  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("Authorization");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_ROOT_URL}/api/boards/${boardId}/comments/${comment.commentId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "댓글 삭제에 실패했습니다.");
      }

      alert("댓글이 삭제되었습니다.");
      mutate();
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "오류 발생");
    } finally {
      setIsModalOpen(false);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex space-x-3 border-t pt-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold text-gray-600">
            {comment.nickname.charAt(0)}
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-gray-800">
                {comment.nickname}
              </span>
              <span className="text-xs text-gray-500 ml-2">
                {format(new Date(comment.createdAt), "yyyy.MM.dd HH:mm")}
              </span>
            </div>
            {isAuthor && !isEditing && (
              <div className="text-xs space-x-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-gray-500 hover:text-gray-800"
                >
                  수정
                </button>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-gray-500 hover:text-red-600"
                >
                  삭제
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="mt-2">
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full p-2 border rounded-md text-sm"
                rows={3}
                disabled={isSubmitting}
              />
              <div className="text-right text-xs space-x-2 mt-1">
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-gray-500 hover:text-gray-800"
                  disabled={isSubmitting}
                >
                  취소
                </button>
                <button
                  onClick={handleUpdate}
                  className="text-campinggreen hover:font-semibold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "저장 중..." : "저장"}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-800 mt-1 whitespace-pre-wrap">
              {comment.content}
            </p>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        title="댓글 삭제"
        message="정말로 이 댓글을 삭제하시겠습니까?"
        onConfirm={handleDelete}
        onClose={() => setIsModalOpen(false)}
        confirmText="삭제"
      />
    </>
  );
}

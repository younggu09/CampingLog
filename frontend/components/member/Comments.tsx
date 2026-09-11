"use client";

import useMemberComments from "@/lib/hooks/member/useMemberComments";
import Pagination from "@/components/common/Pagination";
import Link from "next/link";

export default function Comments(){
  const {
    comments,
    isLoading,
    error,
    page,
    totalPages,
    hasNext,
    hasPrev,
    nextPage,
    prevPage,
    goToPage,
  } = useMemberComments(1);

  if (isLoading) return <p className="text-center py-6">불러오는 중...</p>;
  if (error) return <p className="text-center py-6 text-red-500">{error.message}</p>;
  if (comments.length === 0) return <p className="text-center py-6 text-gray-500">작성한 댓글이 없습니다.</p>;

  return (
    <div className="flex flex-col min-h-full">
      {/* 제목 */}
      <h2 className="text-xl font-bold mb-6">- 내 댓글 조회</h2>

      {/* 게시글 리스트 */}
      <ul className="space-y-5 basis-2/3">
        {comments.map((c) => (
          <li key={c.commentId}>
            <Link
              href={`/board/${c.boardId}`}
              className="block bg-[#FFF9E6] rounded-xl p-4 flex gap-4 
              hover:shadow-md hover:bg-[#fff3cc] transition cursor-pointer 
              min-h-36 sm:min-h-36 lg:min-h-36"
            >
            <div className="flex-1">
              <p className="text-sm text-gray-600 line-clamp-2">{c.content}</p>
              <p className="text-xs text-gray-400 mt-2">{c.createdAt}</p>
            </div>
          </Link>
          </li>
        ))}
      </ul>
    {/* ✅ 리스트 바로 아래 고정 페이지네이션 */}
      <div className="mt-4">
      <Pagination
        page={page}
        totalPages={totalPages}
        hasPrev={hasPrev}
        hasNext={hasNext}
        goToPage={goToPage}
        prevPage={prevPage}
        nextPage={nextPage}
        maxVisible={4}
      />
    </div>
    </div>
  );
}
"use client";

import { ResponseGetBoardByCategory } from "@/lib/types/board/response";
import Link from "next/link";
import { MessageSquare, ThumbsUp, Eye } from "lucide-react"; // 아이콘 추가

interface BoardListItemProps {
  board: ResponseGetBoardByCategory;
}

export default function BoardListItem({ board }: BoardListItemProps) {
  // 1. 날짜 포맷팅 함수 (YYYY.MM.DD 형식으로 변환)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  };

  // 2. 본문 내용은 2줄만 보이도록 스타일로 처리 (CSS line-clamp 사용)
  //    (기존 글자 수 제한 로직보다 더 깔끔합니다)

  return (
    // 3. Link에 전체 아이템을 감싸고, hover 효과를 추가합니다.
    <Link
      href={`/board/${board.boardId}`}
      passHref
      className="block w-full p-6 border-b border-gray-200 hover:bg-gray-50 transition-colors"
    >
      <div className="flex space-x-6">
        {/* 이미지 부분은 주석 처리 유지 */}
        {/* <div className="relative w-48 h-32 flex-shrink-0"> ... </div> */}
        <div className="w-48 h-32 flex-shrink-0 bg-gray-200 rounded-lg" />

        <div className="flex flex-col flex-1">
          {/* --- 상단: 카테고리, 등록일 --- */}
          <div className="flex items-center justify-between mb-2">
            <span className="inline-block bg-[#7a8a65] text-white text-xs px-2 py-1 rounded">
              {board.categoryName}
            </span>
            <span className="text-sm text-gray-400">
              {/* board.createdAt 속성이 있다고 가정합니다. */}
              {formatDate(board.createdAt)}
            </span>
          </div>

          {/* --- 중단: 제목, 내용 --- */}
          <div className="flex-grow space-y-2">
            <h3 className="text-xl font-bold text-gray-800 truncate">
              {board.title}
            </h3>
            <p className="text-gray-600 leading-relaxed line-clamp-2">
              {board.content}
            </p>
          </div>

          {/* --- 하단: 댓글, 좋아요, 조회수 --- */}
          <div className="flex items-center justify-end space-x-4 text-sm text-gray-500 mt-4">
            <div className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              {/* board.commentCount 속성이 있다고 가정합니다. */}
              <span>{board.commentCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <ThumbsUp className="w-4 h-4" />
              {/* board.likeCount 속성이 있다고 가정합니다. */}
              <span>{board.likeCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{board.viewCount}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

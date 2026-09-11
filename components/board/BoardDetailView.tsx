import { ResponseGetBoardDetail } from "@/lib/types/board/response";
import { format } from "date-fns";

interface BoardDetailViewProps {
  board: ResponseGetBoardDetail;
}

export default function BoardDetailView({ board }: BoardDetailViewProps) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      {/* 카테고리 */}
      {board.categoryName && (
        <div className="mb-4">
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
            {board.categoryName}
          </span>
        </div>
      )}

      {/* 제목 */}
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{board.title}</h1>

      {/* 작성자 정보 */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-6 border-b pb-4">
        <span>작성자: {board.nickname}</span>
        <span>{format(new Date(board.createdAt), "yyyy.MM.dd HH:mm")}</span>
      </div>

      {/* 본문 내용 */}
      <div
        className="prose max-w-none mb-8"
        dangerouslySetInnerHTML={{ __html: board.content }}
      />

      {/* 이미지 (있을 경우) */}
      {board.boardImage && (
        <div className="mb-8">
          <img
            src={board.boardImage}
            alt={board.title}
            className="w-full h-auto rounded-lg"
          />
        </div>
      )}

      {/* 조회수 및 좋아요 */}
      <div className="flex items-center justify-end space-x-4 text-gray-500">
        <span>조회수 {board.viewCount}</span>
        <span>좋아요 {board.likeCount}</span>
      </div>
    </div>
  );
}

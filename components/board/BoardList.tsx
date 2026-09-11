import { ResponseGetBoardByCategory } from "@/lib/types/board/response";
import BoardListItem from "./BoardListItem";

interface BoardListProps {
  boards: ResponseGetBoardByCategory[];
}

const BoardList = ({ boards }: BoardListProps) => {
  // 게시글 데이터가 없거나 비어있는 경우
  if (!boards || boards.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">게시글이 없습니다.</div>
    );
  }

  return (
    <div className="space-y-4">
      {boards.map((board) => (
        <BoardListItem key={board.boardId} board={board} />
      ))}
    </div>
  );
};

export default BoardList;

import Image from "next/image";
import Link from "next/link";
import { ResponseGetBoardRank } from "@/lib/types/board/response";
import { backendUrl, imageUrl } from "@/lib/config";

async function fetchBoardsRank(): Promise<ResponseGetBoardRank[]> {
  const res = await fetch(`${backendUrl}/api/boards/rank`, {
    next: { revalidate: 604800 },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch BoardsRank");
  }
  const data = await res.json();
  return data;
}

export default async function BoardsRankServer() {
  let boardsRank: ResponseGetBoardRank[] = [];
  try {
    boardsRank = await fetchBoardsRank();
  } catch (error) {
    return <div>Error loading BoardsRank</div>;
  }

  const mainBoard = boardsRank[0];
  const subBoards = boardsRank.slice(1);

  return (
    <div>
      {/* 메인 포스트 */}
      {/* 2. Link 컴포넌트로 감싸고, 동적 경로를 href에 넣어줍니다. */}
      <Link href={`/board/${mainBoard.boardId}`} passHref>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4 cursor-pointer hover:shadow-lg transition-shadow duration-300">
          <div className="relative">
            <Image
              src={`${imageUrl}/images/board/${mainBoard.boardImage}`}
              alt="캠핑장 이미지"
              width={400}
              height={256}
              className="w-full h-64 object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <h2 className="text-white text-lg font-bold mb-2 leading-tight">
                {mainBoard.title}
              </h2>
              <div className="flex items-center justify-between text-white/80 text-sm">
                <span>{mainBoard.nickname}</span>
                <div className="flex items-center space-x-4">
                  <span>조회 {mainBoard.viewCount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* 서브 포스트들 */}
      <div className="grid grid-cols-2 gap-4">
        {subBoards.map((board) => (
          // 3. 각 서브 포스트도 Link로 감싸줍니다. key는 Link 컴포넌트로 이동합니다.
          <Link href={`/board/${board.boardId}`} key={board.boardId} passHref>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
              <div className="relative">
                <Image
                  src={`${imageUrl}/images/board/${board.boardImage}`}
                  alt="캠핑 이미지"
                  width={400}
                  height={256}
                  className="w-full h-24 object-cover"
                />
              </div>
              <div className="p-3">
                <h3 className="font-medium text-gray-800 text-sm leading-tight mb-2 line-clamp-2">
                  {board.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{board.nickname}</span>
                  <div className="flex items-center space-x-2">
                    <span>조회 {board.viewCount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

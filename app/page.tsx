import BoardsRank from "@/components/board/BoardsRank";
import BoardsRankServer from "@/components/board/BoardsRankServer";
import BoardReviewRankList from "@/components/camps/BoardReviewRankList";
import BoardReviewRankListServer from "@/components/camps/BoardReviewRankListServer";
import MembersRank from "@/components/member/MembersRank";
import MembersRankServer from "@/components/member/MembersRankServer";

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-3">
            {/* <BoardsRankServer /> */}
            <BoardsRank />
          </div>

          <div className="col-span-1">
            {/* <MembersRankServer /> */}
            <MembersRank />
          </div>
        </div>

        {/* <BoardReviewRankListServer /> */}
        <BoardReviewRankList />
      </div>
    </div>
  );
}

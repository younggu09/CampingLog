import BoardForm from "@/components/board/BoardForm";
import { Suspense } from "react";

// 페이지 제목 등 메타데이터 설정 (선택 사항)
export const metadata = {
  title: "새 게시글 작성 - 캠핑로그",
  description: "새로운 캠핑로그 게시글을 작성합니다.",
};

export default function BoardNewPage() {
  return (
    // 전체 페이지의 배경색과 여백을 설정합니다.
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      {/* 폼을 감싸는 컨테이너, 중앙 정렬 및 최대 너비를 지정합니다. */}
      <main className="max-w-4xl mx-auto px-4">
        {/* Suspense는 페이지 로딩 시 fallback UI를 보여줄 때 유용합니다. */}
        <Suspense fallback={<div>Loading...</div>}>
          <BoardForm />
        </Suspense>
      </main>
    </div>
  );
}

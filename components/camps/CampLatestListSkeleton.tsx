function CampLatestListSkeleton() {
  return (
    <div className="max-w-[1200px] mx-auto p-2">
      <div className="flex items-center gap-4 mb-4">
        {/* 제목 */}
        <div className="h-8 w-36 mt-3 mb-2 bg-gray-200 rounded animate-pulse" />
        {/* 검색 input */}
        <div className="h-10 w-64 bg-gray-200 rounded animate-pulse" />
        {/* 버튼 */}
        <div className="h-10 w-20 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* 검색 중/오류 메시지 자리 */}
      <div className="h-6 w-32 mb-3 bg-gray-100 rounded animate-pulse" />

      {/* 캠핑장 스켈레톤 카드 4개 배치 */}
      <div className="flex flex-col items-center justify-center gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-[#FAF6F0] w-full block rounded-lg shadow-sm overflow-hidden animate-pulse"
          >
            <div className="flex flex-row items-center">
              <div className="w-64 h-40 p-5 flex items-center">
                <div className="w-full h-full rounded-lg bg-gray-200" />
              </div>
              <div className="flex-1 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="rounded-lg px-2 py-1 bg-gray-300 w-16 h-6"></div>
                  <div className="bg-gray-300 h-6 w-24 rounded"></div>
                </div>
                <div className="flex items-center mb-2 gap-3">
                  <div className="flex items-center gap-1 mt-2">
                    <div className="bg-gray-300 w-4 h-4 rounded" />
                    <div className="bg-gray-300 w-24 h-4 rounded" />
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <div className="bg-gray-300 w-4 h-4 rounded" />
                    <div className="bg-gray-300 w-16 h-4 rounded" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-gray-300 h-4 w-32 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 페이지네이션 영역 스켈레톤 */}
      <div className="flex justify-center mt-8 gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}

export default CampLatestListSkeleton;

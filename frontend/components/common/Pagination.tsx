"use client";

interface Pagination {
  page: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
  goToPage: (page: number) => void;
  prevPage: () => void;
  nextPage: () => void;
  maxVisible?: number; // 기본 4개
}

export default function Pagination({
  page,
  totalPages,
  hasPrev,
  hasNext,
  goToPage,
  prevPage,
  nextPage,
  maxVisible = 4,
}: Pagination) {
  const getPageNumbers = () => {
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxVisible + 1);
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-1 sm:gap-2">
    {/* 맨 처음 */}
    <button
      className="px-2 py-1 sm:px-3 sm:py-1 border rounded-md disabled:opacity-50 hover:bg-gray-200 text-sm sm:text-base"
      onClick={() => goToPage(1)}
      disabled={page === 1}
    >
      {"<<"}
    </button>

    {/* 이전 */}
    <button
      className="px-2 py-1 sm:px-3 sm:py-1 border rounded-md disabled:opacity-50 hover:bg-gray-200 text-sm sm:text-base"
      onClick={prevPage}
      disabled={!hasPrev}
    >
      {"<"}
    </button>

    {/* 페이지 번호 */}
    {getPageNumbers().map((num) => (
      <button
        key={num}
        onClick={() => goToPage(num)}
        className={`px-2 py-1 sm:px-3 sm:py-1 border rounded-md text-sm sm:text-base transition-colors ${
          num === page
            ? "bg-campingorange text-white font-bold"
            : "hover:bg-gray-200 hover:text-campingorange-600"
        }`}
      >
        {num}
      </button>
    ))}

    {/* 다음 */}
    <button
      className="px-2 py-1 sm:px-3 sm:py-1 border rounded-md disabled:opacity-50 hover:bg-gray-200 text-sm sm:text-base"
      onClick={nextPage}
      disabled={!hasNext}
    >
      {">"}
    </button>

    {/* 맨 끝 */}
    <button
      className="px-2 py-1 sm:px-3 sm:py-1 border rounded-md disabled:opacity-50 hover:bg-gray-200 text-sm sm:text-base"
      onClick={() => goToPage(totalPages)}
      disabled={page === totalPages}
    >
      {">>"}
    </button>
  </div>
  );
}

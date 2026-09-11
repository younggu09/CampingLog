"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import BoardList from "@/components/board/BoardList";
import Pagination from "@/components/common/Pagination";
import useBoardList from "@/lib/hooks/board/useBoardList";
import useBoardSearch from "@/lib/hooks/board/useBoardSearch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function BoardCategoryPage() {
  const params = useParams();
  const category = Array.isArray(params.category)
    ? params.category[0]
    : params.category;
  const categoryName = decodeURIComponent(category || "");

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState("");
  const PAGE_SIZE = 10;

  const { paginatedData: categoryData, isLoading: isCategoryLoading } =
    useBoardList(
      !submittedSearchTerm ? categoryName : "",
      currentPage,
      PAGE_SIZE
    );

  const { paginatedData: searchData, isLoading: isSearchLoading } =
    useBoardSearch(submittedSearchTerm, categoryName, currentPage, PAGE_SIZE);

  const isSearching = !!submittedSearchTerm;
  const isLoading = isSearching ? isSearchLoading : isCategoryLoading;
  const paginatedData = isSearching ? searchData : categoryData;
  const boards = paginatedData?.content || paginatedData?.content || [];
  const totalPages = paginatedData?.totalPages ?? 1;

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };
  const prevPage = () => {
    if (hasPrev) setCurrentPage(currentPage - 1);
  };
  const nextPage = () => {
    if (hasNext) setCurrentPage(currentPage + 1);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setSubmittedSearchTerm("");
    } else {
      setSubmittedSearchTerm(searchTerm);
    }
    setCurrentPage(1);
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">
          {isSearching
            ? `"${submittedSearchTerm}" 검색 결과`
            : `${categoryName}`}
        </h1>
        <Link href="/board/new" passHref>
          <Button variant={"camping-solid"}>글쓰기</Button>
        </Link>
      </div>

      {/* --- 2. 검색 컨트롤 바 (정렬 UI 제거) --- */}
      <div className="flex justify-start items-center border-t-2 border-b py-4 mb-6">
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <Button variant="outline" className="hidden sm:flex">
            제목
          </Button>
          <div className="relative">
            <Input
              type="text"
              placeholder="검색어를 입력하세요"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-48 sm:w-64"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              <Search className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </form>
      </div>

      {isLoading ? (
        <div className="text-center py-20">로딩 중...</div>
      ) : boards.length > 0 ? (
        <>
          <BoardList boards={boards} />
          <div className="mt-8">
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              hasPrev={hasPrev}
              hasNext={hasNext}
              goToPage={goToPage}
              prevPage={prevPage}
              nextPage={nextPage}
            />
          </div>
        </>
      ) : (
        <div className="text-center py-20 text-gray-500">
          {isSearching ? "검색 결과가 없습니다." : "게시글이 없습니다."}
        </div>
      )}
    </main>
  );
}

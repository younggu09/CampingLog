"use client";

import { backendUrl } from "@/lib/config";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useCampList from "@/lib/hooks/camps/useCampList";
import {
  ResponseGetCampLatestList,
  ResponseGetCampByKeywordList,
  ResponseGetCampWrapper,
} from "@/lib/types/camps/response";
import CampLatestList from "@/components/camps/CampLatestList";
import Pagination from "@/components/common/Pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CampListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlKeyword = searchParams.get("keyword") ?? ""; // ← 렌더링 시점마다 최신값
  const PAGE_SIZE = 4;

  // keyword를 쿼리 파라미터로 관리
  const [keyword, setKeyword] = useState(searchParams.get("keyword") ?? "");
  const pageNo = Number(searchParams.get("pageNo") ?? 1);
  const size = Number(searchParams.get("size") ?? PAGE_SIZE);

  const [currentPage, setCurrentPage] = useState(pageNo);

  // 검색 관련 상태
  const [searchResults, setSearchResults] =
    useState<ResponseGetCampWrapper<ResponseGetCampByKeywordList> | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const { isLoading, campLatestList, paginationData, error } =
    useCampList<ResponseGetCampLatestList>(currentPage, PAGE_SIZE);

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handlePrevPage = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNextPage = () =>
    paginationData &&
    currentPage < paginationData.totalPages &&
    setCurrentPage(currentPage + 1);

  // 검색 버튼 클릭 시: keyword를 쿼리 파라미터로 넘김
  const handleSearch = () => {
    router.push(
      `/camps/list?keyword=${encodeURIComponent(
        keyword
      )}&pageNo=1&size=${PAGE_SIZE}`
    );
  };

  // 페이지네이션 클릭 시: keyword를 쿼리 파라미터로 넘김
  const handleSearchPage = (page: number) => {
    router.push(
      `/camps/list?keyword=${encodeURIComponent(
        keyword
      )}&pageNo=${page}&size=${PAGE_SIZE}`
    );
  };

  // 검색 결과 fetch
  useEffect(() => {
    const urlKeyword = searchParams.get("keyword") ?? "";
    const urlPageNo = Number(searchParams.get("pageNo") ?? 1);
    const urlSize = Number(searchParams.get("size") ?? PAGE_SIZE);

    if (!urlKeyword.trim()) {
      setSearchResults(null);
      return;
    }
    setSearchLoading(true);
    setSearchError(null);
    fetch(
      `${backendUrl}/api/camps/keyword?keyword=${encodeURIComponent(
        urlKeyword
      )}&pageNo=${urlPageNo}&size=${urlSize}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("검색 결과를 불러올 수 없습니다.");
        return res.json();
      })
      .then((data: ResponseGetCampWrapper<ResponseGetCampByKeywordList>) => {
        setSearchResults(data);
        setCurrentPage(urlPageNo);
      })
      .catch((err) => setSearchError(err.message))
      .finally(() => setSearchLoading(false));
  }, [searchParams]); // ← keyword가 아니라 searchParams만 의존성에 둡니다

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="max-w-[1200px] mx-auto p-2">
      <div className="flex items-center gap-4 mb-4">
        <h1 className="text-2xl font-bold mt-3 mb-2">캠핑장 목록</h1>
        <Input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="캠핑장명 검색"
          className="w-64"
        />
        <Button onClick={handleSearch} variant="default" size="default">
          검색
        </Button>
      </div>

      {/* 검색 결과 */}
      {searchLoading && <p>검색 중...</p>}
      {searchError && <p className="text-red-500">{searchError}</p>}

      {urlKeyword ? (
        searchResults &&
        searchResults.items &&
        searchResults.items.length > 0 ? (
          <>
            <CampLatestList camps={searchResults.items} />
            <Pagination
              page={searchResults.page}
              totalPages={searchResults.totalPage}
              hasPrev={searchResults.page > 1}
              hasNext={searchResults.hasNext}
              goToPage={handleSearchPage}
              prevPage={() => handleSearchPage(searchResults.page - 1)}
              nextPage={() => handleSearchPage(searchResults.page + 1)}
              maxVisible={5}
            />
          </>
        ) : !searchError ? (
          <p>검색 결과가 없습니다.</p>
        ) : null
      ) : (
        <>
          <CampLatestList camps={campLatestList} />
          {paginationData && (
            <Pagination
              page={currentPage}
              totalPages={paginationData.totalPages}
              hasPrev={currentPage > 1}
              hasNext={paginationData.hasNext}
              goToPage={handlePageChange}
              prevPage={handlePrevPage}
              nextPage={handleNextPage}
              maxVisible={5}
            />
          )}
        </>
      )}
    </div>
  );
}

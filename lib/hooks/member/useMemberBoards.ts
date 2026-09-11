"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ResponseGetMemberBoards } from "@/lib/types/member/response";

type BoardsListResponse = {
  items: ResponseGetMemberBoards[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
};

export interface MemberBoardsLists {
  boards: ResponseGetMemberBoards[];
  isLoading: boolean;
  error: Error | null;
  page: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  hasNext: boolean;
  hasPrev: boolean;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (n: number) => void;
  refetch: () => void;
}

function normalizeResponse(json: BoardsListResponse) {
  return {
    items: json.items,
    pageNo: json.page,
    totalPages: json.totalPages,
    totalElements: json.totalElements,
    pageSize: json.size,
    hasNext: !json.last,
    hasPrev: !json.first,
  };
}

export default function useMemberBoards(initialPage = 1): MemberBoardsLists {
  const [boards, setBoards] = useState<ResponseGetMemberBoards[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const [page, setPage] = useState<number>(initialPage);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(0);
  const [hasNext, setHasNext] = useState<boolean>(false);
  const [hasPrev, setHasPrev] = useState<boolean>(false);

  const abortRef = useRef<AbortController | null>(null);

  const endpoint = useMemo(() => {
    const base = process.env.NEXT_PUBLIC_BACKEND_ROOT_URL ?? "";
    return `${base}/api/members/mypage/boards?pageNo=${page}`;
  }, [page]);

  const fetchBoards = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);
    setError(null);

    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("Authorization") : null;
      if (!token) throw new Error("로그인이 필요합니다.");

      const res = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error(`(${res.status}) 내 게시글 목록을 불러오지 못했습니다.`);
      }

      const json = (await res.json()) as BoardsListResponse;
      const norm = normalizeResponse(json);

      setBoards(norm.items);
      setTotalPages(norm.totalPages);
      setTotalElements(norm.totalElements);
      setPageSize(norm.pageSize);
      setHasNext(norm.hasNext);
      setHasPrev(norm.hasPrev);

      if (norm.pageNo !== page) {
        setPage(norm.pageNo);
      }
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") {
      // 그냥 무시 (사용자가 페이지 이동했거나, StrictMode double invoke일 때)
      return;
      }
      if (e instanceof Error) {
        setError(e);
      } else {
        setError(new Error("게시글 불러오는 중 오류"));
      }
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, page]);

  useEffect(() => {
    fetchBoards();
    return () => abortRef.current?.abort();
  }, [fetchBoards]);

  const nextPage = useCallback(() => {
    if (hasNext) setPage((p) => p + 1);
  }, [hasNext]);

  const prevPage = useCallback(() => {
    if (hasPrev) setPage((p) => Math.max(1, p - 1));
  }, [hasPrev]);

  const goToPage = useCallback(
    (n: number) => {
      const target = Math.min(Math.max(1, n), totalPages || 1);
      setPage(target);
    },
    [totalPages]
  );

  const refetch = useCallback(() => {
    fetchBoards();
  }, [fetchBoards]);

  return {
    boards,
    isLoading,
    error,
    page,
    totalPages,
    totalElements,
    pageSize,
    hasNext,
    hasPrev,
    nextPage,
    prevPage,
    goToPage,
    refetch,
  };
}

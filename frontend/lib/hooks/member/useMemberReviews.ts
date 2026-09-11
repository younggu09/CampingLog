"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ResponseGetMemberReviews } from "@/lib/types/member/response";


type ReviewsListResponse = {
  content: ResponseGetMemberReviews[];
  page: number;          // 서버는 1-based
  size: number;
  totalElements: number;
  totalPage: number;
  hasNext: boolean;
};

export interface MemberReviewsLists {
  reviews: ResponseGetMemberReviews[];
  isLoading: boolean;
  error: Error | null;
  page: number;          // 프론트는 0-based
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

function normalizeResponse(json: ReviewsListResponse) {
  return {
    items: json.content,
    pageNo: json.page - 1,              // 서버(1-based) → 프론트(0-based)
    totalPages: json.totalPage,
    totalElements: json.totalElements,
    pageSize: json.size,
    hasNext: json.hasNext,
    hasPrev: (json.page - 1) > 0,
  };
}

export default function useMemberReviews(initialPage = 0): MemberReviewsLists {
  const [reviews, setReviews] = useState<ResponseGetMemberReviews[]>([]);
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
    return `${base}/api/members/mypage/reviews?pageNo=${page+1}&size=4`;
  }, [page]);

  const fetchReviews = useCallback(async () => {
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
        throw new Error(`(${res.status}) 내 리뷰 목록을 불러오지 못했습니다.`);
      }

      const json = (await res.json()) as ReviewsListResponse;
      const norm = normalizeResponse(json);

      setReviews(norm.items);
      setTotalPages(norm.totalPages);
      setTotalElements(norm.totalElements);
      setPageSize(norm.pageSize);
      setHasNext(norm.hasNext);
      setHasPrev(norm.hasPrev);

    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") {
        return; // 페이지 이동 or StrictMode double invoke
      }
      if (e instanceof Error) {
        setError(e);
      } else {
        setError(new Error("리뷰 불러오는 중 오류"));
      }
    } finally {
      setIsLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchReviews();
    return () => abortRef.current?.abort();
  }, [fetchReviews]);

  const nextPage = useCallback(() => {
    if (hasNext) setPage((p) => p + 1);
  }, [hasNext]);

  const prevPage = useCallback(() => {
    if (hasPrev) setPage((p) => Math.max(0, p - 1));
  }, [hasPrev]);

  const goToPage = useCallback(
    (n: number) => {
      const target = Math.min(Math.max(0, n - 1), (totalPages || 1) - 1);
      setPage(target);
    },
    [totalPages]
  );

  const refetch = useCallback(() => {
    fetchReviews();
  }, [fetchReviews]);

  return {
    reviews,
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

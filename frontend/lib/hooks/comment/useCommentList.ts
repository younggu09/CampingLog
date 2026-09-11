import useSWR from "swr";
import fetcher from "@/lib/utils/fetcher";
import { ResponseGetCommentWrapper } from "@/lib/types/board/response";

export default function useCommentList(
  boardId: string | null,
  page: number = 1,
  size: number = 10
) {
  // boardId가 있을 때만 API를 호출하도록 key를 동적으로 생성합니다.
  const key = boardId
    ? `/api/boards/${boardId}/comments?page=${page}&size=${size}`
    : null;

  // useSWR의 제네릭으로 응답 타입을 지정해줍니다.
  const { data, error, isLoading, mutate } = useSWR<ResponseGetCommentWrapper>(
    key,
    fetcher
  );

  return {
    // 페이지 정보가 포함된 전체 응답 데이터
    paginatedComments: data,
    // 편의를 위해 실제 댓글 목록(배열)도 따로 분리해서 반환합니다.
    comments: data?.content,
    isLoading,
    error,
    mutate,
  };
}

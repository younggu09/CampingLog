import { RequestAddLike } from "@/lib/types/board/request";

/**
 * 좋아요 추가 요청 (POST)
 * - 이 함수는 브라우저(클라이언트)에서 실행됩니다.
 * - localStorage에서 토큰을 가져와 헤더에 담아 Next.js API 라우트로 요청을 보냅니다.
 * @param boardId 게시글 ID
 */
export const addLikeRequest = async (boardId: string) => {
  const token = localStorage.getItem("Authorization");
  if (!token) {
    // 로그인하지 않은 사용자는 요청을 보낼 수 없음
    throw new Error("로그인이 필요합니다.");
  }

  // 백엔드 API 명세에 따라 body는 비워두거나 필요한 데이터를 넣습니다.
  // 여기서는 email을 토큰에서 추출하므로 빈 객체를 보냅니다.
  const body: Partial<RequestAddLike> = {};

  const response = await fetch(`/api/boards/${boardId}/likes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // 실제 백엔드로 전달될 인증 토큰
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "좋아요 추가에 실패했습니다.");
  }
  // 1. 서버의 응답 데이터를 그대로 반환합니다.
  return response.json();
};

/**
 * 좋아요 취소 요청 (DELETE)
 * - 이 함수는 브라우저(클라이언트)에서 실행됩니다.
 * - localStorage에서 토큰을 가져와 헤더에 담아 Next.js API 라우트로 요청을 보냅니다.
 * @param boardId 게시글 ID
 */
export const removeLikeRequest = async (boardId: string) => {
  const token = localStorage.getItem("Authorization");
  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  const response = await fetch(`/api/boards/${boardId}/likes`, {
    method: "DELETE",
    headers: {
      // DELETE 요청에도 누가 요청했는지 알려주기 위해 토큰이 필요
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "좋아요 취소에 실패했습니다.");
  }
  // 2. 서버의 응답 데이터를 그대로 반환합니다.
  return response.json();
};

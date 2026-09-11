import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_ROOT_URL;

// GET, POST, DELETE 모든 함수를 수정해야 합니다.

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ boardId: string }> } // 1. params에서 commentId 제거
) {
  // 2. 프론트엔드에서 보낸 요청 헤더에서 인증 토큰을 가져옵니다.
  const token = request.headers.get("Authorization");
  const { boardId } = await params;

  const response = await fetch(
    // 3. 올바른 게시글 좋아요 API 주소로 수정합니다.
    `${BACKEND_URL}/api/boards/${boardId}/likes`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 4. 백엔드로 인증 토큰을 전달합니다.
        Authorization: token ?? "",
      },
      body: JSON.stringify({}), // 백엔드 API 스펙에 따라 빈 body를 보냅니다.
    }
  );
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ boardId: string }> } // 1. params에서 commentId 제거
) {
  // 2. 프론트엔드에서 보낸 요청 헤더에서 인증 토큰을 가져옵니다.
  const token = request.headers.get("Authorization");
  const { boardId } = await params;

  const response = await fetch(
    // 3. 올바른 게시글 좋아요 API 주소로 수정합니다.
    `${BACKEND_URL}/api/boards/${boardId}/likes`,
    {
      method: "DELETE",
      headers: {
        // 4. 백엔드로 인증 토큰을 전달합니다.
        Authorization: token ?? "",
      },
    }
  );

  // DELETE 요청은 성공 시 body가 비어있을 수 있으므로 상태 코드로 처리
  if (response.ok) {
    return NextResponse.json(
      { message: "좋아요가 취소되었습니다." },
      { status: 200 }
    );
  }

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

// 참고: 게시글 좋아요 목록을 가져오는 GET 요청이 필요하다면 아래와 같이 구현할 수 있습니다.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ boardId: string }> }
) {
  const token = request.headers.get("Authorization");
  const { boardId } = await params;

  const response = await fetch(`${BACKEND_URL}/api/boards/${boardId}/likes`, {
    headers: {
      Authorization: token ?? "",
    },
  });
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

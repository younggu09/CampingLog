import { NextResponse } from "next/server";
import { cookies } from "next/headers"; // 쿠키를 가져오기 위해 임포트

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_ROOT_URL;

export async function POST(request: Request) {
  // 1. 클라이언트 요청에 담긴 쿠키에서 accessToken을 가져옵니다.
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  // 2. 토큰이 없으면 인증 오류 응답을 보냅니다.
  if (!accessToken) {
    return NextResponse.json(
      { message: "인증 토큰이 없습니다. 로그인 후 다시 시도해주세요." },
      { status: 401 }
    );
  }

  try {
    // 3. 프론트엔드 폼에서 보낸 JSON 데이터를 추출합니다.
    const postData = await request.json();

    // 4. 백엔드로 보내는 fetch 요청 헤더에 JWT를 추가합니다.
    const response = await fetch(`${BACKEND_URL}/api/boards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // "Bearer" 접두사와 함께 토큰을 Authorization 헤더에 담아 보냅니다.
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(postData),
    });

    // 5. 백엔드가 응답 본문을 보냈는지 확인합니다.
    const responseText = await response.text();
    if (!responseText) {
      // 응답이 비어있고, 상태 코드가 성공(2xx)이 아니라면 에러로 처리
      if (!response.ok) {
        return NextResponse.json(
          { message: `서버 에러: ${response.status}` },
          { status: response.status }
        );
      }
      // 성공했지만 응답이 없는 경우 (예: 204 No Content)
      return new NextResponse(null, { status: response.status });
    }

    const data = JSON.parse(responseText);

    // 6. 백엔드가 보낸 응답 상태(status)와 데이터를 그대로 클라이언트에 전달합니다.
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("/api/boards POST Error:", error);
    return NextResponse.json(
      { message: "서버 내부 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

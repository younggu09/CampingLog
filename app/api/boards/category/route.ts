import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_ROOT_URL;

export async function GET(request: Request) {
  // 들어온 요청에서 URL의 쿼리 파라미터를 가져옵니다.
  const { searchParams } = new URL(request.url);

  // 백엔드로 전달할 전체 쿼리 문자열을 그대로 가져옵니다.
  // 이렇게 하면 category, page, size 등 모든 파라미터를 한 번에 처리할 수 있습니다.
  const queryString = searchParams.toString();

  // 백엔드로 보낼 최종 URL을 만듭니다.
  const targetUrl = `${BACKEND_URL}/api/boards/category?${queryString}`;

  try {
    // 완성된 URL로 백엔드에 요청을 보냅니다.
    const response = await fetch(targetUrl);
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("백엔드 API 호출 에러:", error);
    return NextResponse.json(
      { message: "백엔드 서버 통신 중 에러가 발생했습니다." },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_ROOT_URL;

export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization");

  // 기본 옵션
  const options: RequestInit = { method: "GET", headers: {} };

  // 토큰이 있을 때만 Authorization 헤더 추가
  if (token) {
    (options.headers as Record<string, string>).Authorization = token;
  }

  const res = await fetch(`${BACKEND_URL}/api/members/rank`, options);
  const data = await res.json();

  return NextResponse.json(data, { status: res.status });
}

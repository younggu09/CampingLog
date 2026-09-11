import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_ROOT_URL;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get("keyword");
  const category = searchParams.get("category");
  const page = searchParams.get("page");
  const size = searchParams.get("size");

  if (!keyword) {
    return NextResponse.json(
      { message: "검색어가 필요합니다." },
      { status: 400 }
    );
  }

  const response = await fetch(
    `${BACKEND_URL}/api/boards/search?keyword=${keyword}&category=${category}&page=${page}&size=${size}`
  );
  const data = await response.json();

  return NextResponse.json(data);
}

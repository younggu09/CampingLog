import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_ROOT_URL;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ boardId: string }> }
) {
  const sp = req.nextUrl.searchParams;
  const page = sp.get("page") ?? "1";
  const size = sp.get("size") ?? "10";
  const { boardId } = await params;

  const url = new URL(`${BACKEND_URL}/api/boards/${boardId}/comments`);
  url.searchParams.set("page", page);
  url.searchParams.set("size", size);

  const res = await fetch(url.toString(), {
    method: "GET",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(req.headers.get("authorization")
        ? { Authorization: req.headers.get("authorization") as string }
        : {}),
    },
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, {
    status: res.status,
    headers: { "Cache-Control": "no-store" },
  });
}

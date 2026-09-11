import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_ROOT_URL;

export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization");

  const res = await fetch(`${BACKEND_URL}/api/members/mypage`, {
    method: "GET",
    headers: {
      Authorization: token ?? "",
    },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function PUT(req: NextRequest) {
  const token = req.headers.get("authorization");
  const body = await req.json();

  const res = await fetch(`${BACKEND_URL}/api/members/mypage`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ?? "",
    },
    body: JSON.stringify(body),
  });
  if (res.status === 204) {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(req: NextRequest) {
  const token = req.headers.get("authorization");

  const res = await fetch(`${BACKEND_URL}/api/members`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ?? "",
    },
    cache: "no-store",
  });
  
  if (res.status === 204) {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } else {
    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: { "Content-Type": contentType || "text/plain; charset=UTF-8" },
    });
  }
}

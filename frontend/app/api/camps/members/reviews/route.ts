import { NextResponse } from "next/server";
import { backendUrl } from "@/lib/config";

export async function POST(request: Request) {
  try {
    const body = await request.json();


    const res = await fetch(`${backendUrl}/api/camps/members/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: request.headers.get("Authorization") || "",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: "리뷰 등록 실패" }, { status: 500 });
  }
}

// PUT: 리뷰 수정 프록시
export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const res = await fetch(`${backendUrl}/api/camps/members/reviews`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: request.headers.get("Authorization") || "",
      },
      body: JSON.stringify(body),
    });

    if (res.status === 204 || res.ok) {
      // 204는 body가 없으므로 빈 객체 반환
      return NextResponse.json({}, { status: 204 });
    }

    // body가 있을 때만 json 파싱
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: text };
    }
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: "리뷰 수정 실패" }, { status: 500 });
  }

  
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    const body = { id };

    const res = await fetch(`${backendUrl}/api/camps/members/reviews`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: request.headers.get("Authorization") || "",
      },
      body: JSON.stringify(body),
    });

    if (res.status === 204) {
      return NextResponse.json({}, { status: 204 });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: "리뷰 삭제 실패" }, { status: 500 });
  }
}
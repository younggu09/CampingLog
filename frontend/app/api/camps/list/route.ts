import { NextResponse } from "next/server";
import { ResponseGetCampLatestList } from "@/lib/types/camps/response";
import { ResponseGetCampWrapper } from "@/lib/types/camps/response";
import { backendUrl } from "@/lib/config";

export async function GET(request: Request) {
  try {
    const {searchParams} = new URL(request.url);
    const pageNo: number = parseInt(searchParams.get('pageNo') || '1');
    const size: number = parseInt(searchParams.get('size') || '4');

    // 유효성 검사 추가
    if (isNaN(pageNo) || pageNo < 1) {
      return NextResponse.json(
        { error: "Invalid pageNo parameter" },
        { status: 400 }
      );
    }

    if (isNaN(size) || size < 1) {
      return NextResponse.json(
        { error: "Invalid size parameter" },
        { status: 400 }
      );
    }

    const res = await fetch(`${backendUrl}/api/camps/list?pageNo=${pageNo}&size=${size}`);
    if (!res.ok) {
      throw new Error(
        `Failed to fetch camp latest list: ${res.status} ${res.statusText}`
      );
    }

    const data: ResponseGetCampWrapper<ResponseGetCampLatestList> = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching camp latest list:", error);
    return NextResponse.json(
      { error: "Failed to fetch camp latest list" },
      { status: 500 }
    );
  }
}
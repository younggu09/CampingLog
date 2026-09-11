import { NextResponse } from "next/server";
import {
  ResponseGetCampWrapper,
  ResponseGetReviewList,
} from "@/lib/types/camps/response";
import { backendUrl } from "@/lib/config";

interface Params {
  mapX: string;
  mapY: string;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<Params> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const pageNo = searchParams.get("pageNo") ?? "0";
    const size = searchParams.get("size") ?? "4";
    console.log("리뷰 API 호출됨", pageNo, size); // 로그 추가

    const { mapX, mapY } = await params;

    if (!mapX || !mapY) {
      return new Response("Missing mapX or mapY", { status: 400 });
    }

    // 리뷰 목록 API로 변경!
    const response = await fetch(
      `${backendUrl}/api/camps/reviews/${mapX}/${mapY}?pageNo=${pageNo}&size=${size}`
    );

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `Camping reviews not found: ${response.status} ${response.statusText}`,
        },
        { status: response.status }
      );
    }

    const data: ResponseGetCampWrapper<ResponseGetReviewList> =
      await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { ResponseGetBoardReview } from "@/lib/types/camps/response";
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
    const { mapX, mapY } = await params;

    if (!mapX || !mapY) {
      return new Response("Missing mapX or mapY", { status: 400 });
    }

    // Backend 리뷰 API 호출
    const response = await fetch(
      `${backendUrl}/api/camps/reviews/board/${mapX}/${mapY}`
    );

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `Camping site not found: ${response.status} ${response.statusText}`,
        },
        { status: response.status }
      );
    }

    const data: ResponseGetBoardReview = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

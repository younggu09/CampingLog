import { NextResponse } from "next/server";
import {
  ResponseGetCampDetail,
  ResponseGetBoardReview,
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

    const { mapX, mapY } = await params;

    if (!mapX || !mapY) {
      return new Response("Missing mapX or mapY", { status: 400 });
    }

    // Fetch camping site details from the database or external API
    const campDetail = await fetch(
      `${backendUrl}/api/camps/detail/${mapX}/${mapY}?pageNo=${pageNo}&size=${size}`
    );

    if (!campDetail.ok) {
      return NextResponse.json(
        {
          error: `Camping site not found: ${campDetail.status} ${campDetail.statusText}`,
        },
        { status: campDetail.status }
      );
    }

    const data: ResponseGetCampDetail = await campDetail.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching camp detail:", error);
    return NextResponse.json(
      { error: "Failed to fetch camp detail" },
      { status: 500 }
    );
  }
}

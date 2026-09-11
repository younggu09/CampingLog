import { NextResponse } from "next/server";
import { backendUrl } from "@/lib/config";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get("keyword") ?? "";
    const pageNo = searchParams.get("page") ?? "1";
    const size = searchParams.get("size") ?? "4";

    try {
        const res = await fetch(
            `${backendUrl}/api/camps/keyword?keyword=${encodeURIComponent(keyword)}&pageNo=${pageNo}&size=${size}`
        );
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching camp by keyword:", error);
        return NextResponse.error();
    }
}
import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_ROOT_URL;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ boardId: string }> }
) {
  const { boardId } = await params;
  const response = await fetch(`${BACKEND_URL}/api/boards/${boardId}`);
  const data = await response.json();

  return NextResponse.json(data);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ boardId: string }> }
) {
  const { boardId } = await params;
  const response = await fetch(`${BACKEND_URL}/api/boards/${boardId}`, {
    method: "PUT",
    body: request.body,
  });
  const data = await response.json();

  return NextResponse.json(data);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ boardId: string }> }
) {
  const { boardId } = await params;
  const response = await fetch(`${BACKEND_URL}/api/boards/${boardId}`, {
    method: "DELETE",
  });
  const data = await response.json();

  return NextResponse.json(data);
}

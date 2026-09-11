"use client";

import { useState } from "react";
import { RequestAddReview } from "@/lib/types/camps/request";
import { backendUrl } from "@/lib/config";

interface AddReviewProps {
  mapX: string;
  mapY: string;
  onSuccess?: () => void;
}

export default function AddReview({ mapX, mapY, onSuccess }: AddReviewProps) {
  const [reviewContent, setReviewContent] = useState("");
  const [reviewScore, setReviewScore] = useState(0.5); // 최소값 0.5로 변경
  const [reviewImage, setReviewImage] = useState(""); // 필드명 변경
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 이미지 파일 선택 및 업로드
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);

      const formData = new FormData();
      formData.append("image", file);

      try {
        const res = await fetch("http://localhost:8001/images/review", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) {
          throw new Error("이미지 업로드 실패");
        }
        const data = await res.json();
        const filename = data.file?.filename || "";
        setReviewImage(filename); // 필드명 변경
      } catch (err) {
        alert("이미지 업로드에 실패했습니다.");
        setReviewImage("");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // 이미지가 없으면 기본 이미지 파일명으로 설정
    const imageToSend = reviewImage || "/public/image/camp-default.png"; 

    const body: RequestAddReview = {
      mapX,
      mapY,
      reviewContent,
      reviewScore: parseFloat(String(reviewScore)),
      reviewImage: imageToSend,
    };

    // JWT 토큰 가져오기 (예: localStorage)
    const token = localStorage.getItem("Authorization");

    try {
      const res = await fetch(`${backendUrl}/api/camps/members/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errMsg = await res.text();
        throw new Error("리뷰 등록에 실패했습니다.\n" + errMsg);
      }

      setReviewContent("");
      setReviewScore(0.5);
      setReviewImage("");
      setImageFile(null);
      if (onSuccess) onSuccess();
      alert("리뷰가 등록되었습니다!");
    } catch (err: any) {
      setError(err.message || "에러가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 border rounded">
      <textarea
        value={reviewContent}
        onChange={e => setReviewContent(e.target.value)}
        placeholder="리뷰 내용을 입력하세요"
        required
        className="border p-2 rounded"
        maxLength={500}
      />
      <input
        type="number"
        min={0.5}
        max={5}
        step={0.5}
        value={reviewScore}
        onChange={e => setReviewScore(Number(e.target.value))}
        placeholder="별점 (0.5~5)"
        required
        className="border p-2 rounded"
      />
      <div>
        <label className="block mb-2 font-medium">이미지 업로드</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-2 border-gray-300 rounded-md"
        />
        {reviewImage && (
          <img
            src={`http://localhost:8001/images/review/${reviewImage}`}
            alt="미리보기"
            className="mt-4 max-h-48 rounded"
          />
        )}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-[#4A6920] text-white px-4 py-2 rounded"
      >
        {loading ? "등록 중..." : "리뷰 등록"}
      </button>
      {error && <div className="text-red-500 whitespace-pre-line">{error}</div>}
    </form>
  );
}





import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 백엔드(Spring) API 주소
    const backendUrl = "http://localhost:8080/api/camps/members/reviews";

    const res = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: "리뷰 등록 실패" }, { status: 500 });
  }
}



"use client";

import useMemberReviews from "@/lib/hooks/member/useMemberReviews";
import Pagination from "@/components/common/Pagination";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { backendUrl } from "@/lib/config";
import ConfirmModal from "@/components/common/ConfirmModal";

type Review = {
  id: number;
  facltNm: string;
  reviewContent: string;
  reviewScore: number;
  reviewImage?: string;
  firstImageUrl?: string;
  mapX: string;
  mapY: string;
  createAt: string;
};

export default function Reviews() {
  const {
    reviews,
    isLoading,
    error,
    page,
    totalPages,
    hasNext,
    hasPrev,
    nextPage,
    prevPage,
    goToPage,
  } = useMemberReviews(0);

  // 모달 상태
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editReview, setEditReview] = useState<Review | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editScore, setEditScore] = useState(0.5);
  const [editImage, setEditImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  // 삭제 관련 상태
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  // 삭제 버튼 클릭 시 모달 오픈
  const handleDeleteClick = (reviewId: number) => {
    setDeleteTargetId(reviewId);
    setConfirmModalOpen(true);
  };

  // 실제 삭제 처리
  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      const token = localStorage.getItem("Authorization");
      const res = await fetch(`${backendUrl}/api/camps/members/reviews`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: deleteTargetId }),
      });
      if (!res.ok) {
        const errMsg = await res.text();
        let errorMessage = errMsg;
        try {
          const json = JSON.parse(errMsg);
          errorMessage = json.message || JSON.stringify(json);
        } catch {
          // errMsg가 JSON이 아니면 그대로 사용
        }
        alert("리뷰 삭제 실패\n" + errorMessage);
      } else {
        alert("리뷰가 삭제되었습니다!");
        // TODO: 삭제 후 리뷰 목록 새로고침 필요
      }
    } catch (err) {
      alert("리뷰 삭제 중 에러 발생");
    }
    setConfirmModalOpen(false);
    setDeleteTargetId(null);
  };

  // 삭제 취소
  const handleCancelDelete = () => {
    setConfirmModalOpen(false);
    setDeleteTargetId(null);
  };

  // 수정 모달 오픈
  const handleEdit = (review: Review) => {
    setEditReview(review);
    setEditContent(review.reviewContent); // 기존 내용
    setEditScore(review.reviewScore); // 기존 별점
    setEditImage(review.reviewImage || ""); // 기존 이미지
    setImageFile(null);
    setModalError("");
    setEditModalOpen(true);
  };

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
        // Content-Type 확인 및 분기
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          const filename = data.file?.filename || "";
          setEditImage(filename);
        } else {
          const text = await res.text();
          throw new Error("서버 응답이 올바른 JSON이 아닙니다: " + text);
        }
      } catch (err) {
        alert("이미지 업로드에 실패했습니다.");
        setEditImage("");
      }
    }
  };

  // 수정 모달 닫기
  const handleCloseModal = () => {
    setEditModalOpen(false);
    setEditReview(null);
    setImageFile(null);
    setModalError("");
  };

  // 수정 저장 핸들러 (API 연동 필요)
  const handleSaveEdit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editReview) return;
    setLoading(true);
    setModalError("");

    // JWT 토큰 가져오기 (예: localStorage)
    const token = localStorage.getItem("Authorization");

    const body = {
      id: editReview.id,
      newReviewContent: editContent,
      newReviewScore: editScore,
      newReviewImage: editImage,
    };

    try {
      const res = await fetch(`${backendUrl}/api/camps/members/reviews`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const errMsg = await res.text();
        throw new Error("리뷰 수정 실패\n" + errMsg);
      }
      alert("리뷰가 수정되었습니다!");
      handleCloseModal();
      // TODO: 수정 후 리뷰 목록 새로고침 필요
    } catch (err: any) {
      setModalError(err.message || "에러가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <p className="text-center py-6">불러오는 중...</p>;
  if (error)
    return <p className="text-center py-6 text-red-500">{error.message}</p>;
  if (reviews.length === 0)
    return (
      <p className="text-center py-6 text-gray-500">작성한 리뷰가 없습니다.</p>
    );

  return (
    <div className="flex flex-col min-h-full">
      {/* 제목 */}
      <h2 className="text-xl font-bold mb-6">- 내 리뷰 조회</h2>

      {/* 리뷰 리스트 */}
      <ul className="space-y-5 basis-2/3">
        {reviews.map((r) => (
          <li key={r.id}>
            <div className="flex gap-4 bg-[#E6F7FF] rounded-xl p-4 hover:shadow-md hover:bg-[#d6f0ff] transition cursor-pointer min-h-36">
              {/* 리뷰 상세로 이동하는 Link */}
              <Link
                href={`/camps/detail/${r.mapX}/${r.mapY}`}
                className="flex flex-1 gap-4"
              >
                {/* 썸네일 이미지 */}
                <div className="w-28 h-20 relative flex-shrink-0">
                  <Image
                    src={r.firstImageUrl || "/image/camp-default.png"}
                    alt={r.facltNm}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                {/* 내용 */}
                <div className="flex-1">
                  <h3 className="font-bold text-base">{r.facltNm}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {r.reviewContent}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    ⭐ {r.reviewScore} / 5
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(r.createAt).toLocaleString()}
                  </p>
                </div>
              </Link>
              {/* 수정/삭제 버튼 - 리뷰 박스 오른쪽 */}
              <div className="flex flex-row gap-2 items-center">
                <Button
                  variant="camping-outline"
                  size="sm"
                  // @ts-ignore
                  onClick={() => handleEdit(r)}
                >
                  수정
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  // @ts-ignore
                  onClick={() => handleDeleteClick(r.id)}
                >
                  삭제
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* ✅ 리스트 바로 아래 고정 페이지네이션 */}
      <div className="mt-4">
        <Pagination
          page={page + 1}
          totalPages={totalPages}
          hasPrev={hasPrev}
          hasNext={hasNext}
          goToPage={goToPage}
          prevPage={prevPage}
          nextPage={nextPage}
          maxVisible={4}
        />
      </div>

      {/* 수정 모달 (AddReview 폼과 동일) */}
      {editModalOpen && editReview && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form
            onSubmit={handleSaveEdit}
            className="flex flex-col gap-4 p-4 border rounded bg-white w-[350px] shadow-lg relative"
          >
            <h3 className="font-bold text-lg mb-2">리뷰 수정</h3>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
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
              value={editScore}
              onChange={(e) => setEditScore(Number(e.target.value))}
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
              {editImage && (
                <img
                  src={`http://localhost:8001/images/review/${editImage}`}
                  alt="미리보기"
                  className="mt-4 max-h-48 rounded"
                />
              )}
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={handleCloseModal}
              >
                취소
              </Button>
              <Button
                // @ts-ignore
                variant="camping"
                size="sm"
                type="submit"
                disabled={loading}
              >
                {loading ? "수정 중..." : "수정"}
              </Button>
            </div>
            {modalError && (
              <div className="text-red-500 whitespace-pre-line">
                {modalError}
              </div>
            )}
          </form>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={confirmModalOpen}
        title="리뷰 삭제"
        message="정말로 이 리뷰를 삭제하시겠습니까?"
        onConfirm={handleConfirmDelete}
        onClose={handleCancelDelete}
        confirmText="삭제"
        cancelText="취소"
      />
    </div>
  );
}

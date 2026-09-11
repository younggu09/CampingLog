"use client";

import Link from "next/link";
import {
  ResponseGetMember,
  ResponseGetMemberActivitySummary,
} from "@/lib/types/member/response";
import { useEffect, useRef, useState } from "react";

interface MemberMypageProps {
  member: ResponseGetMember | null;
  profileImage?: string;
  activitySummary?: ResponseGetMemberActivitySummary;
}

function Mypage({ member, profileImage, activitySummary }: MemberMypageProps) {
  const [currentProfileUrl, setCurrentProfileUrl] = useState<string>(
    profileImage || "/image/profile-default.png"
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profileImage) setCurrentProfileUrl(profileImage);
  }, [profileImage]);

  if (!member) {
    return (
      <div className="text-center py-8">회원 정보를 불러올 수 없습니다.</div>
    );
  }

  const openFilePicker = () => fileInputRef.current?.click();

  // 파일 선택만 담당 (업로드는 따로 '저장' 버튼에서)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleCancel = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("업로드할 이미지를 먼저 선택해주세요.");
      return;
    }

    const token = localStorage.getItem("Authorization");
    if (!token) {
      alert("로그인이 필요합니다.");
      window.location.href = "/login";
      return;
    }

    setIsUploading(true);
    try {
      // 1) 이미지 서버 업로드
      const formData = new FormData();
      formData.append("image", selectedFile);

      const imageServer =
        process.env.NEXT_PUBLIC_IMAGE_ROOT_URL || "http://localhost:8888";
      const uploadRes = await fetch(`${imageServer}/images/member`, {
        method: "POST",
        body: formData,
      });
      if (!uploadRes.ok) throw new Error("이미지 업로드 실패");

      const data = await uploadRes.json();
      const uploadedUrl = data?.file?.url || "";

      // 2) 백엔드에 최종 반영
      const backend = process.env.NEXT_PUBLIC_BACKEND_ROOT_URL;
      const saveRes = await fetch(
        `${backend}/api/members/mypage/profile-image`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ profileImage: uploadedUrl }),
        }
      );
      if (!saveRes.ok) {
        const err = await saveRes.json().catch(() => ({}));
        throw new Error(err.message || "프로필 이미지 저장 실패");
      }

      // 3) 화면 갱신 및 초기화
      setCurrentProfileUrl(uploadedUrl);
      alert("프로필 이미지가 변경되었습니다.");
      handleCancel();
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "업로드 중 오류가 발생했습니다."
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main>
      <div className="grid grid-cols-3 gap-6">
        {/* 프로필 (왼쪽) */}
        <div className="col-span-1 flex flex-col items-center">
          <img
            src={currentProfileUrl}
            alt="프로필 이미지"
            className="w-40 h-40 object-cover rounded-full mb-4 border"
          />

          {/* 숨긴 파일 입력 */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* 버튼 영역 */}
          {!selectedFile ? (
            <button
              onClick={openFilePicker}
              className="px-3 py-2 bg-gray-200 rounded-lg text-sm"
              disabled={isUploading}
            >
              사진 수정
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleUpload}
                className="px-3 py-2 bg-campinggreen text-white rounded-lg text-sm disabled:opacity-60"
                disabled={isUploading}
              >
                {isUploading ? "업로드 중..." : "저장"}
              </button>
              <button
                onClick={handleCancel}
                className="px-3 py-2 bg-gray-200 rounded-lg text-sm"
                disabled={isUploading}
              >
                취소
              </button>
            </div>
          )}
          {/* 선택한 파일명 간단 노출 (미리보기는 없음) */}
          {selectedFile && (
            <p className="mt-2 text-xs text-gray-500">{selectedFile.name}</p>
          )}
        </div>

        {/* 활동요약 + 회원상세 (오른쪽) */}
        <div className="col-span-2 flex flex-col gap-6">
          <div className="bg-[#FFF9E6] rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold">내 활동 요약</h4>
              {member?.memberGrade && (
                <img
                  src={`/image/${member.memberGrade}.png`}
                  alt={`${member.memberGrade} 뱃지`}
                  className="w-24 h-24"
                />
              )}
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>작성한 게시글</span>
                <span>{activitySummary?.boardCount ?? 0}개</span>
              </div>
              <div className="flex justify-between">
                <span>작성한 댓글</span>
                <span>{activitySummary?.commentCount ?? 0}개</span>
              </div>
              <div className="flex justify-between">
                <span>작성한 리뷰</span>
                <span>{activitySummary?.reviewCount ?? 0}개</span>
              </div>
              <div className="flex justify-between">
                <span>받은 좋아요</span>
                <span>{activitySummary?.likeCount ?? 0}개</span>
              </div>
              <div className="flex justify-between">
                <span>가입 일자</span>
                <span>{member?.joinDate ?? "-"}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#F0F9F9] rounded-lg p-4 shadow-sm">
            <h4 className="font-bold mb-3">내 계정 정보</h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>이메일</span>
                <span>{member?.email}</span>
              </div>
              <div className="flex justify-between">
                <span>닉네임</span>
                <span>{member?.nickname}</span>
              </div>
              <div className="flex justify-between">
                <span>이름</span>
                <span>{member?.name}</span>
              </div>
              <div className="flex justify-between">
                <span>전화번호</span>
                <span>{member?.phoneNumber}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex gap-3 mt-6 justify-end">
        <Link href="/mypage/password?next=edit">
          <button className="bg-campinggreen text-white px-4 py-2 rounded-md">
            개인정보 수정
          </button>
        </Link>
        <Link href="/mypage/password?next=withdraw">
          <button className="bg-red-500 text-white px-4 py-2 rounded-md">
            회원 탈퇴
          </button>
        </Link>
      </div>
    </main>
  );
}

export default Mypage;

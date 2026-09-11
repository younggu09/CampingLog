"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useMemberPassword from "@/lib/hooks/member/useMemberPassword";
import ConfirmModal from "@/components/common/ConfirmModal";

export default function Password() {
  const [password, setPassword] = useState("");
  const { verifyPassword, isLoading, error, isSuccess } = useMemberPassword();

  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawCompleteModalOpen, setWithdrawCompleteModalOpen] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await verifyPassword(password);
    if (!ok) return;

    if (next === "edit") {
      router.push("/mypage/edit");
    } else if (next === "withdraw") {
      setWithdrawModalOpen(true);
    }
  };

  const handleWithdraw = async () => {
    try {
      const token = localStorage.getItem("Authorization");
      const res = await fetch("/api/members/mypage", {
        method: "DELETE",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });

      if (res.ok) {
        localStorage.removeItem("Authorization");
        setWithdrawModalOpen(false);
        setWithdrawCompleteModalOpen(true);
      } else {
        // 실패시 메시지 표시(선택)
        console.error("탈퇴 실패");
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
  <div className="max-w-md mx-auto mt-20 bg-white border border-gray-300 rounded-3xl shadow-sm p-10">
    <h2 className="text-2xl font-bold mb-6 text-center">비밀번호 확인</h2> 
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6">
      <div className="w-full">
        <input
          type="password"
          className="w-full border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="비밀번호를 입력하세요"
        />
      </div>

      <button
        type="submit"
        className="w-32 bg-green-700 text-white py-2 rounded-md font-bold hover:bg-green-800 transition"
        disabled={isLoading}
      >
        {isLoading ? "확인중..." : "확인"}
      </button>

      {/* 🔽 error는 Error 객체이므로 .message를 출력해야 함 */}
      {error && <p className="text-red-500 text-sm">{error.message}</p>}

      {isSuccess && <p className="text-green-600 text-sm">인증 성공!</p>}
    </form>

   {/* 탈퇴 확인 모달 */}
      <ConfirmModal
        isOpen={withdrawModalOpen}
        title="회원 탈퇴"
        message="정말 탈퇴하시겠습니까?"
        onConfirm={handleWithdraw}
        onClose={() => router.push("/mypage")} 
        confirmText="탈퇴"
        cancelText="취소"
      />

      {/* 탈퇴 완료 모달 */}
      <ConfirmModal
        isOpen={withdrawCompleteModalOpen}
        title="알림"
        message="탈퇴가 완료되었습니다."
        onConfirm={() => router.push("/")}
        onClose={() => setWithdrawCompleteModalOpen(false)}
        confirmText="확인"
        cancelText=""
      />
    </div>  
  );
}

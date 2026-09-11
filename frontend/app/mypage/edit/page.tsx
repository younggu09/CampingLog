"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmModal from "@/components/common/ConfirmModal";

export default function EditMypage() {
  const [email, setEmail] = useState("");       // 읽기 전용
  const [name, setName] = useState("");         // 읽기 전용
  const [nickname, setNickname] = useState(""); // 수정 가능
  const [phoneNumber, setPhoneNumber] = useState(""); // 수정 가능
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

    const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  // ✅ 기존 회원정보 조회
  useEffect(() => {
    const fetchMember = async () => {
      try {
        const token = localStorage.getItem("Authorization");
        const res = await fetch("/api/members/mypage", {
          method: "GET",
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });

        if (!res.ok) throw new Error("회원 정보를 불러오지 못했습니다.");

        const data = await res.json();
        setEmail(data.email ?? "");
        setName(data.name ?? "");
        setNickname(data.nickname ?? "");
        setPhoneNumber(data.phoneNumber ?? "");
      } catch (err) {
        setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, []);

  // ✅ 수정 요청
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const token = localStorage.getItem("Authorization");

      const res = await fetch("/api/members/mypage", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ nickname, phoneNumber }),
      });

      if (res.ok) {
        setModalOpen(true); // ✅ alert → 모달 열기
      } else {
        const data = await res.json();
        throw new Error(data.message || "회원정보 수정 실패");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "회원정보 수정 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <p className="text-center py-6">불러오는 중...</p>;
  if (error) return <p className="text-center py-6 text-red-500">{error}</p>;

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white border border-gray-300 rounded-2xl shadow p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">회원정보 수정</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 이메일 (읽기 전용) */}
        <div>
          <label className="block mb-1 font-medium">이메일</label>
          <input type="email" value={email} disabled className="w-full border rounded-md px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed" />
        </div>

        {/* 이름 (읽기 전용) */}
        <div>
          <label className="block mb-1 font-medium">이름</label>
          <input type="text" value={name} disabled className="w-full border rounded-md px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed" />
        </div>

        {/* 닉네임 (수정 가능) */}
        <div>
          <label className="block mb-1 font-medium">닉네임</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>

        {/* 전화번호 (수정 가능) */}
        <div>
          <label className="block mb-1 font-medium">전화번호</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => router.push("/mypage")}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
          >
            취소
          </button>
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            저장
          </button>
        </div>
      </form>
      {/* ✅ 공통 ConfirmModal */}
      <ConfirmModal
        isOpen={modalOpen}
        title="알림"
        message="회원정보가 수정되었습니다."
        onConfirm={() => {
          setModalOpen(false);
          router.push("/mypage");
        }}
        onClose={() => setModalOpen(false)}
        confirmText="확인"
        cancelText="닫기"
      />
    </div>
  );
}

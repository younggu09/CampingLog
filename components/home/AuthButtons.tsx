"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import defaultImg from "@/public/image/default.png";
import Image from "next/image";
import tokenManager from "@/lib/utils/customFetch"; // 토큰 관리 모듈 경로 맞게 수정
import { useRouter } from "next/navigation";

export default function AuthButtons() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileImg, setProfileImg] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("Authorization");
    if (!token) {
      // 토큰 없으면 프로필 API 호출 안 함, 상태도 초기화
      setIsLoggedIn(false);
      setProfileImg("");
      return;
    }

    const fetchProfileImage = async () => {
      try {
        const response = await tokenManager.fetchWithAuth(
          `${process.env.NEXT_PUBLIC_BACKEND_ROOT_URL}/api/members/mypage/profile-image`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "same-origin",
          }
        );

        if (!response.ok) {
          throw new Error("프로필 이미지 불러오기 실패");
        }

        const data = await response.json();
        setIsLoggedIn(true);
        if (data.profileImage) {
          setProfileImg(
            process.env.NEXT_PUBLIC_IMAGE_ROOT_URL + data.profileImage
          );
        } else {
          setProfileImg("");
        }
      } catch (error) {
        setIsLoggedIn(false);
        setProfileImg("");
      }
    };

    fetchProfileImage();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("Authorization");
    setIsLoggedIn(false);
    setProfileImg("");
    router.push("/");
  };

  if (isLoggedIn) {
    return (
      <div className="flex items-center gap-3">
        <Link href="/mypage" prefetch={false}>
          <Image
            src={profileImg || defaultImg}
            alt="프로필"
            width={32}
            height={32}
            className="h-8 w-8 rounded-full"
          />
        </Link>
        <button onClick={handleLogout} className="px-3 py-1 border rounded">
          로그아웃
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Link href="/signup">
        <button className="px-4 py-2 border border-campinggreen bg-white text-campinggreen rounded-md hover:border-campingorange hover:text-campingorange transition-colors duration-200">
          회원가입
        </button>
      </Link>
      <Link
        href="/login"
        className="px-4 py-2 border border-campinggreen bg-campinggreen text-white rounded-md hover:border-campingorange hover:bg-campingorange transition-colors duration-200"
        prefetch={false}
      >
        로그인
      </Link>
    </div>
  );
}

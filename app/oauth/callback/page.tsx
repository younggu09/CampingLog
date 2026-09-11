"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OAuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // useSearchParams 대신 window.location 사용
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("Authorization", token);
      console.log("카카오 콜백 실행");
      router.replace("/");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return <div>로그인 처리 중...</div>;
}

import { useState, useCallback } from "react";

export default function useMemberPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const verifyPassword = useCallback(async (password: string) : Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const token = localStorage.getItem("Authorization");
      const endpoint =
        process.env.NEXT_PUBLIC_BACKEND_ROOT_URL +
        "/api/members/mypage/password/verify";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        let msg = "비밀번호 확인에 실패했습니다.";
        try {
          const errData = await res.json();
          if (errData?.message) msg = errData.message;
        } catch {}
        throw new Error(msg);
      }

      // 서버가 204/빈문자열/OK 등으로 응답하더라도 성공으로 처리
      const text = await res.text();
      const success = text.trim() === "" || text.trim().toLowerCase() === "ok";
      setIsSuccess(success);
      return success; // ✅ 반드시 boolean 반환
    } catch (e: any) {
      setError(e instanceof Error ? e : new Error("인증 실패"));
      setIsSuccess(false);
      return false;   // ✅ 실패도 false 반환
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { verifyPassword, isLoading, error, isSuccess };
}

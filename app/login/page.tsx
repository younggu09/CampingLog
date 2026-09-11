"use client";

import { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  MessageCircle,
} from "lucide-react";
import { backendUrl } from "@/lib/config";

// 타입 정의
interface LoginFormData {
  email: string;
  password: string;
}

interface LoginErrors {
  email?: string;
  password?: string;
  general?: string;
}

interface KakaoLoginResponse {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  refresh_token_expires_in: number;
}

export default function Page() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isKakaoLoading, setIsKakaoLoading] = useState<boolean>(false);

  // 카카오 SDK 설정
  const KAKAO_REDIRECT_URI = "http://localhost:8080/oauth2/authorization/kakao"; // 실제 리다이렉트 URI로 변경

  // 이메일 유효성 검사
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 폼 유효성 검사
  const validateForm = (): LoginErrors => {
    const newErrors: LoginErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "올바른 이메일 형식을 입력해주세요.";
    }

    if (!formData.password) {
      newErrors.password = "비밀번호를 입력해주세요.";
    } else if (formData.password.length < 6) {
      newErrors.password = "비밀번호는 6자 이상 입력해주세요.";
    }

    return newErrors;
  };

  // 입력 필드 변경 처리
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 실시간 에러 제거
    if (errors[name as keyof LoginErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch(backendUrl + "/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      console.log(response);

      if (!response.ok) {
        if (response.status === 400) {
          try {
            const errorData = await response.json();
            setErrors({
              general:
                errorData.message ||
                "이메일 또는 비밀번호가 올바르지 않습니다.",
            });
          } catch (e) {
            setErrors({
              general: "이메일 또는 비밀번호가 올바르지 않습니다.",
            });
          }
        } else {
          setErrors({
            general:
              "로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
          });
        }
        return;
      }

      // 성공 시 토큰 처리
      const token =
        response.headers.get("Authorization") ||
        response.headers.get("authorization");
      if (token) {
        const jwt = token.startsWith("Bearer ") ? token.slice(7) : token;
        localStorage.setItem("Authorization", jwt); // 또는 sessionStorage
        console.log("로그인 성공!");
        alert("로그인 성공!");
        window.location.href = "/";
      } else {
        // JSON에서 토큰 찾기
        try {
          const data = await response.json();
          if (data.accessToken || data.token) {
            localStorage.setItem(
              "Authorization",
              data.accessToken || data.token
            );
            console.log("로그인 성공:", data);
            alert("로그인 성공!");
            window.location.href = "/";
          } else {
            setErrors({
              general: "토큰을 받을 수 없습니다.",
            });
          }
        } catch (e) {
          console.error("응답 파싱 오류:", e);
          setErrors({
            general: "응답 처리 중 오류가 발생했습니다.",
          });
        }
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      setErrors({
        general: "네트워크 오류가 발생했습니다. 연결을 확인해주세요.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 카카오 로그인 처리
  const handleKakaoLogin = async (): Promise<void> => {
    setIsKakaoLoading(true);

    try {
      // 카카오 로그인 페이지로 리다이렉트
      window.location.href = KAKAO_REDIRECT_URI;
    } catch (error) {
      console.error("카카오 로그인 오류:", error);
      alert("카카오 로그인 중 오류가 발생했습니다.");
      setIsKakaoLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-8 py-6 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            캠핑로그 로그인
          </h1>
          <p className="text-yellow-100 text-sm">
            캠핑의 모든 순간을 기록해보세요
          </p>
        </div>

        {/* 폼 */}
        <div className="px-8 py-8">
          {/* 카카오 로그인 버튼 */}
          <button
            onClick={handleKakaoLogin}
            disabled={isKakaoLoading}
            className="w-full flex items-center justify-center gap-3 py-4 px-4 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] mb-6"
          >
            {isKakaoLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                카카오 로그인 중...
              </div>
            ) : (
              <>
                <MessageCircle className="w-6 h-6" />
                카카오로 3초만에 시작하기
              </>
            )}
          </button>

          {/* 구분선 */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">
                또는 이메일로 로그인
              </span>
            </div>
          </div>

          {/* 일반 로그인 폼 */}
          <div className="space-y-6">
            {/* 전체 에러 메시지 */}
            {errors.general && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-700 text-sm">{errors.general}</span>
              </div>
            )}

            {/* 이메일 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이메일
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="이메일을 입력하세요"
                  className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* 비밀번호 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="비밀번호를 입력하세요"
                  className={`w-full pl-11 pr-11 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* 로그인 버튼 */}
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:from-yellow-600 hover:to-orange-600 focus:ring-4 focus:ring-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  로그인 중...
                </div>
              ) : (
                "로그인"
              )}
            </button>
          </div>

          {/* 회원가입 링크 */}
          <div className="text-center mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              아직 계정이 없으신가요?{" "}
              <button className="text-yellow-600 hover:underline font-medium">
                회원가입하기
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

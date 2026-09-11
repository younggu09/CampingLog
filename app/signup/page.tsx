"use client";

import { useState } from "react";
import { backendUrl } from "@/lib/config";

import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Phone,
  Calendar,
  UserPlus,
  Check,
  X,
} from "lucide-react";
import Link from "next/link";

// 타입 정의
interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  nickname: string;
  birthday: string;
  phoneNumber: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  name?: string;
  nickname?: string;
  birthday?: string;
  phoneNumber?: string;
}

interface PasswordStrength {
  strength: number;
  text: string;
  color: string;
}

interface SignupRequest {
  email: string;
  password: string;
  name: string;
  nickname: string;
  birthday: string;
  phoneNumber: string;
}

export default function Page() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    nickname: "",
    birthday: "",
    phoneNumber: "",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isEmailChecking, setIsEmailChecking] = useState<boolean>(false);
  const [isNicknameChecking, setIsNicknameChecking] = useState<boolean>(false);
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
  const [nicknameAvailable, setNicknameAvailable] = useState<boolean | null>(
    null
  );

  // 유효성 검사 함수들
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
    return phoneRegex.test(phone);
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    // 이메일 검증
    if (!formData.email.trim()) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (formData.email.length > 100) {
      newErrors.email = "이메일은 100자 이하로 입력해주세요.";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "올바른 이메일 형식을 입력해주세요.";
    } else if (emailAvailable === false) {
      newErrors.email = "이미 사용 중인 이메일입니다.";
    }

    // 비밀번호 검증
    if (!formData.password) {
      newErrors.password = "비밀번호를 입력해주세요.";
    } else if (formData.password.length < 8) {
      newErrors.password = "비밀번호는 8자 이상 입력해주세요.";
    } else if (formData.password.length > 100) {
      newErrors.password = "비밀번호는 100자 이하로 입력해주세요.";
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.";
    }

    // 비밀번호 확인
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호 확인을 입력해주세요.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    }

    // 이름 검증
    if (!formData.name.trim()) {
      newErrors.name = "이름을 입력해주세요.";
    } else if (formData.name.trim().length > 50) {
      newErrors.name = "이름은 50자 이하로 입력해주세요.";
    }

    // 닉네임 검증
    if (!formData.nickname.trim()) {
      newErrors.nickname = "닉네임을 입력해주세요.";
    } else if (formData.nickname.trim().length > 50) {
      newErrors.nickname = "닉네임은 50자 이하로 입력해주세요.";
    } else if (nicknameAvailable === false) {
      newErrors.nickname = "이미 사용 중인 닉네임입니다.";
    }

    // 생년월일 검증
    if (!formData.birthday) {
      newErrors.birthday = "생년월일을 입력해주세요.";
    } else {
      const today = new Date();
      const birthDate = new Date(formData.birthday);
      const age = today.getFullYear() - birthDate.getFullYear();

      if (birthDate > today) {
        newErrors.birthday = "올바른 생년월일을 입력해주세요.";
      } else if (age < 14) {
        newErrors.birthday = "만 14세 이상만 가입할 수 있습니다.";
      }
    }

    // 휴대폰 번호 검증
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "휴대폰 번호를 입력해주세요.";
    } else if (formData.phoneNumber.length > 20) {
      newErrors.phoneNumber = "휴대폰 번호는 20자 이하로 입력해주세요.";
    } else if (!validatePhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber = "올바른 휴대폰 번호를 입력해주세요.";
    }

    return newErrors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 실시간 에러 제거
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // 이메일이나 닉네임 변경 시 중복 체크 결과 초기화
    if (name === "email") {
      setEmailAvailable(null);
    }
    if (name === "nickname") {
      setNicknameAvailable(null);
    }
  };

  // 이메일 중복 체크 (fetch 사용)
  const checkEmailAvailability = async (): Promise<void> => {
    if (!formData.email || !validateEmail(formData.email)) {
      return;
    }

    setIsEmailChecking(true);
    try {
      const response = await fetch(
        backendUrl +
          `/api/members/email-availability?email=${encodeURIComponent(
            formData.email
          )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // 200: 사용 가능한 이메일
        setEmailAvailable(true);
        console.log("이메일 사용가능 확인");
      } else if (response.status === 400) {
        // 400: 이미 사용 중인 이메일 (중복)
        setEmailAvailable(false);
      } else {
        // 기타 오류
        console.error("이메일 중복 체크 오류:", response.status);
        alert("이메일 중복 확인 중 오류가 발생했습니다.");
        setEmailAvailable(null);
      }
    } catch (error) {
      console.error("이메일 중복 체크 오류:", error);
      alert("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
      setEmailAvailable(null);
    } finally {
      setIsEmailChecking(false);
    }
  };

  // 닉네임 중복 체크 (fetch 사용)
  const checkNicknameAvailability = async (): Promise<void> => {
    if (!formData.nickname.trim()) {
      return;
    }

    setIsNicknameChecking(true);
    try {
      const response = await fetch(
        backendUrl +
          `/api/members/nickname-availability?nickname=${encodeURIComponent(
            formData.nickname
          )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // 200: 사용 가능한 닉네임
        setNicknameAvailable(true);
      } else if (response.status === 400) {
        // 400: 이미 사용 중인 닉네임 (중복)
        setNicknameAvailable(false);
      } else {
        // 기타 오류
        console.error("닉네임 중복 체크 오류:", response.status);
        alert("닉네임 중복 확인 중 오류가 발생했습니다.");
        setNicknameAvailable(null);
      }
    } catch (error) {
      console.error("닉네임 중복 체크 오류:", error);
      alert("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
      setNicknameAvailable(null);
    } finally {
      setIsNicknameChecking(false);
    }
  };

  // 회원가입 처리 (fetch 사용)
  const handleSubmit = async (): Promise<void> => {
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // 중복 체크가 완료되지 않은 경우
    if (emailAvailable === null || nicknameAvailable === null) {
      alert("이메일과 닉네임 중복 체크를 완료해주세요.");
      return;
    }

    if (!emailAvailable || !nicknameAvailable) {
      alert("이미 사용 중인 이메일 또는 닉네임입니다.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 백엔드로 전송할 데이터 준비
      const requestData: SignupRequest = {
        email: formData.email.trim(),
        password: formData.password,
        name: formData.name.trim(),
        nickname: formData.nickname.trim(),
        birthday: formData.birthday, // yyyy-MM-dd 형식
        phoneNumber: formData.phoneNumber.trim(),
      };

      // fetch를 사용한 POST 요청
      const response = await fetch(backendUrl + "/api/members", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (response.status === 201) {
        // 200: 회원가입 성공
        alert("회원가입이 완료되었습니다!");

        // 성공 후 폼 초기화
        setFormData({
          email: "",
          password: "",
          confirmPassword: "",
          name: "",
          nickname: "",
          birthday: "",
          phoneNumber: "",
        });
        setEmailAvailable(null);
        setNicknameAvailable(null);
        setErrors({});

        // 로그인 페이지로 이동하는 대신 알림만 표시
        // 실제 프로젝트에서는 window.location.href = '/login' 또는 router.push('/login') 사용
        window.location.href = "/login";
        console.log("회원가입 성공 - 로그인 페이지로 이동 필요");
      } else if (response.status === 400) {
        // 400: 중복된 이메일/닉네임 또는 유효성 검사 실패
        try {
          const errorData = await response.json();
          alert(errorData.message || "입력 정보를 다시 확인해주세요.");
        } catch {
          alert("입력 정보를 다시 확인해주세요.");
        }
      } else {
        // 기타 서버 오류
        try {
          const errorData = await response.json();
          alert(errorData.message || "서버 오류가 발생했습니다.");
        } catch {
          alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        }
      }
    } catch (error) {
      console.error("회원가입 오류:", error);

      if (error instanceof TypeError && error.message.includes("fetch")) {
        alert("서버에 연결할 수 없습니다. 네트워크를 확인해주세요.");
      } else {
        alert("알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrength = (password: string): PasswordStrength => {
    if (password.length === 0)
      return { strength: 0, text: "", color: "bg-gray-200" };
    if (password.length < 6)
      return { strength: 25, text: "약함", color: "bg-red-500" };
    if (password.length < 8)
      return { strength: 50, text: "보통", color: "bg-yellow-500" };
    if (validatePassword(password))
      return { strength: 100, text: "강함", color: "bg-green-500" };
    return { strength: 75, text: "양호", color: "bg-blue-500" };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-emerald-600 to-blue-600 px-8 py-6 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            캠핑로그 회원가입
          </h1>
          <p className="text-emerald-100 text-sm">
            캠핑의 모든 순간을 기록해보세요
          </p>
        </div>

        {/* 폼 */}
        <div className="px-8 py-8">
          <div className="space-y-6">
            {/* 이메일 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이메일 <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="이메일을 입력하세요"
                    maxLength={100}
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                      errors.email
                        ? "border-red-500"
                        : emailAvailable === true
                        ? "border-green-500"
                        : emailAvailable === false
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {emailAvailable === true && (
                    <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
                  )}
                  {emailAvailable === false && (
                    <X className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 w-5 h-5" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={checkEmailAvailability}
                  disabled={
                    isEmailChecking ||
                    !formData.email ||
                    !validateEmail(formData.email)
                  }
                  className="px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium whitespace-nowrap"
                >
                  {isEmailChecking ? "확인 중..." : "중복확인"}
                </button>
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
              {emailAvailable === true && (
                <p className="text-green-600 text-xs mt-1">
                  사용 가능한 이메일입니다.
                </p>
              )}
              {emailAvailable === false && (
                <p className="text-red-500 text-xs mt-1">
                  이미 사용 중인 이메일입니다.
                </p>
              )}
            </div>

            {/* 비밀번호 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="비밀번호를 입력하세요"
                  maxLength={100}
                  className={`w-full pl-11 pr-11 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
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

              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: `${passwordStrength.strength}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600">
                      {passwordStrength.text}
                    </span>
                  </div>
                </div>
              )}

              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호 확인 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="비밀번호를 다시 입력하세요"
                  className={`w-full pl-11 pr-11 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : formData.confirmPassword &&
                        formData.password === formData.confirmPassword
                      ? "border-green-500"
                      : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
              {formData.confirmPassword &&
                formData.password === formData.confirmPassword && (
                  <p className="text-green-600 text-xs mt-1">
                    비밀번호가 일치합니다.
                  </p>
                )}
            </div>

            {/* 이름 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이름 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="이름을 입력하세요"
                  maxLength={50}
                  className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* 닉네임 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                닉네임 <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="nickname"
                    value={formData.nickname}
                    onChange={handleInputChange}
                    placeholder="닉네임을 입력하세요"
                    maxLength={50}
                    className={`w-full pl-11 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                      errors.nickname
                        ? "border-red-500"
                        : nicknameAvailable === true
                        ? "border-green-500"
                        : nicknameAvailable === false
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {nicknameAvailable === true && (
                    <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
                  )}
                  {nicknameAvailable === false && (
                    <X className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 w-5 h-5" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={checkNicknameAvailability}
                  disabled={isNicknameChecking || !formData.nickname.trim()}
                  className="px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium whitespace-nowrap"
                >
                  {isNicknameChecking ? "확인 중..." : "중복확인"}
                </button>
              </div>
              {errors.nickname && (
                <p className="text-red-500 text-xs mt-1">{errors.nickname}</p>
              )}
              {nicknameAvailable === true && (
                <p className="text-green-600 text-xs mt-1">
                  사용 가능한 닉네임입니다.
                </p>
              )}
              {nicknameAvailable === false && (
                <p className="text-red-500 text-xs mt-1">
                  이미 사용 중인 닉네임입니다.
                </p>
              )}
            </div>

            {/* 생년월일 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                생년월일 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleInputChange}
                  max={new Date().toISOString().split("T")[0]}
                  className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                    errors.birthday ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {errors.birthday && (
                <p className="text-red-500 text-xs mt-1">{errors.birthday}</p>
              )}
            </div>

            {/* 휴대폰 번호 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                휴대폰 번호 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="010-0000-0000"
                  maxLength={20}
                  className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                    errors.phoneNumber ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {errors.phoneNumber && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phoneNumber}
                </p>
              )}
            </div>
          </div>

          {/* 제출 버튼 */}
          <div className="mt-8">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 text-white py-4 px-4 rounded-lg font-medium hover:from-emerald-700 hover:to-blue-700 focus:ring-4 focus:ring-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  회원가입 중...
                </div>
              ) : (
                "캠핑로그 시작하기"
              )}
            </button>
          </div>

          {/* 로그인 링크 */}
          <div className="text-center mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              이미 계정이 있으신가요?{" "}
              <Link href="/login">
                <button className="text-emerald-600 hover:underline font-medium">
                  로그인하기
                </button>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

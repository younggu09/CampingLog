"use client";
import { useEffect, useState } from "react";
import Mypage from "@/components/member/Mypage";

import {
  ResponseGetMember,
  ResponseGetMemberActivitySummary,
} from "@/lib/types/member/response";

export default function MemberMypage() {
  const [member, setMember] = useState<ResponseGetMember | null>(null);
  const [profileImage, setProfileImage] = useState<string | undefined>(undefined);
  const [activitySummary, setActivitySummary] =
    useState<ResponseGetMemberActivitySummary | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("Authorization");
        if (!token) throw new Error("로그인이 필요합니다.");

        // 회원 상세
        const memberRes = await fetch(
          process.env.NEXT_PUBLIC_BACKEND_ROOT_URL + "/api/members/mypage",
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,  
            },
          }
        );
        if (!memberRes.ok) throw new Error("회원 정보 불러오기 실패");
        const memberData: ResponseGetMember = await memberRes.json();
        setMember(memberData);

        // 프로필 이미지
        const IMG_ROOT = process.env.NEXT_PUBLIC_IMAGE_ROOT_URL!;  // http://localhost:8888
        const DEFAULT_PROFILE = `${IMG_ROOT}/images/member/profile/default.png`; // public 폴더 기본 이미지

        if (memberData.profileImage) {
        // 예: "member/profile/abc.png" 또는 "/member/profile/abc.png"
        const path = memberData.profileImage.startsWith("/")
            ? memberData.profileImage
            : `/${memberData.profileImage}`;

        setProfileImage(`${IMG_ROOT}${path}`);
        } else {
        setProfileImage(DEFAULT_PROFILE);
        }

        // 활동 요약
        const summaryRes = await fetch(
          process.env.NEXT_PUBLIC_BACKEND_ROOT_URL + "/api/members/mypage/summary",
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,   
            },
          }
        );
        if (summaryRes.ok) {
          const summaryData: ResponseGetMemberActivitySummary =
            await summaryRes.json();
          setActivitySummary(summaryData);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("마이페이지 불러오는 중 오류 발생");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
      <Mypage
        member={member}
        profileImage={profileImage}
        activitySummary={activitySummary}
      />
  );
}

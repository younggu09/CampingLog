"use client";

import Sidebar from "@/components/member/Sidebar";
import { usePathname } from "next/navigation";

export default function MypageLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const HIDDEN_PATHS = ["/mypage/password", "/mypage/edit"];
  const hideSidebar = HIDDEN_PATHS.includes(pathname);
  
  return (
    <main>
      <div className="container mx-auto p-6">
        <div className="flex gap-6">
        {/* 왼쪽: 사이드바 */}
        {!hideSidebar && (
          <Sidebar />
        )}

          {/* 오른쪽: 페이지별 컨텐츠 */}
          <div className="flex-1 bg-white border border-gray-300 rounded-3xl shadow-sm p-6">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}

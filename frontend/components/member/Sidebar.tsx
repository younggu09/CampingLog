"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Sidebar() {
  const pathname = usePathname();

  const linkClass = (href: string, activeColor = "text-campinggreen-600") =>
    `block px-2 py-1 rounded-lg cursor-pointer hover:bg-gray-200 hover:${activeColor} ${
      pathname === href ? `bg-gray-200 ${activeColor} font-bold` : ""
    }`;

  return (
    <div className="w-56 border border-gray-300 rounded-3xl shadow-sm p-4 bg-transparent min-h-screen">
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-500 underline mb-2">
            <Link href="/mypage">마이페이지</Link>
        </h3>
        <h3 className="font-bold text-gray-700 mb-2">나의 커뮤니티 활동</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>
            <Link 
              href="/mypage/boards" 
              className={linkClass("/mypage/boards")}>
              - 내 게시글 조회
            </Link>
          </li>
          <li>
            <Link
              href="/mypage/comments"
              className={linkClass("/mypage/comments")}>
              - 내 댓글 조회
            </Link>
          </li>
        </ul>
      </div>

      {/* <div className="mb-6">
        <hr className="border-gray-300 mb-3" />
        <h3 className="font-bold text-gray-700 mb-2">나의 쇼핑몰 활동</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>- 장바구니 조회</li>
          <li>- 주문 조회</li>
        </ul>
      </div> */}

      <div>
        <hr className="border-gray-300 mb-3" />
        <h3 className="font-bold text-gray-700 mb-2">나의 캠핑장 리뷰 활동</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>
            <Link
              href="/mypage/camps"
              className={linkClass("/mypage/camps")}>
              - 내가 쓴 리뷰 조회
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;

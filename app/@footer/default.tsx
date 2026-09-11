import Image from "next/image";
import footerImg from "@/public/image/footer.png";
export default function Footer() {
  return (
    <footer className="flex justify-items-center bg-campingsig py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <div className="flex-shrink-0">
            <Image src={footerImg} alt="캠핑로그" className="w-auto" />
          </div>

          <div className="text-sm text-gray-600 space-y-1">
            <div className="mb-3">
              <span className="font-semibold text-gray-800">이용약관</span>
              <span className="mx-2">|</span>
              <span className="font-semibold text-gray-800">
                개인정보 취급방침
              </span>
            </div>

            <div className="space-y-1">
              <div>
                <span className="text-gray-500">대표자명 :</span>
                <span className="ml-2">염윤호</span>
                <span className="ml-2">최의걸</span>
                <span className="ml-2">이창훈</span>
                <span className="ml-2">황서이</span>
                <span className="mx-2">|</span>
                <span className="text-gray-500">주소 :</span>
                <span className="ml-2">서울특별시 금천구 가산디지털 1로</span>
              </div>

              <div>
                <span className="text-gray-500">사업자등록번호 :</span>
                <span className="ml-2">123-45-67890</span>
                <span className="mx-2">|</span>
                <span className="text-gray-500">통신판매업 신고번호 :</span>
                <span className="ml-2">제2025-서울강남-1234호</span>
              </div>

              <div>
                <span className="text-gray-500">전화번호 :</span>
                <span className="ml-2">02-1234-5678</span>
                <span className="mx-2">|</span>
                <span className="text-gray-500">이메일 :</span>
                <span className="ml-2">campinglog@google.com</span>
              </div>
            </div>

            <div className="pt-3 text-gray-400 text-xs">
              Copyright © 2025 CampingLog. All Rights Reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

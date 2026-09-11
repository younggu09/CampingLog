import Link from "next/link";
import AuthButtons from "@/components/home/AuthButtons";
import Image from "next/image";
import logoImg from "@/public/image/logo.png";

const communityCategories = [
  { name: "캠핑장", href: "/boards/캠핑장" },
  { name: "캠핑장비", href: "/boards/캠핑장비" },
  { name: "초보꿀팁", href: "/boards/초보꿀팁" },
];

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-white shadow">
      <div className="flex items-center gap-6">
        <Link href="/">
          <Image src={logoImg} alt="Logo" className="h-8 w-30" />
        </Link>
        {/* 커뮤니티 드롭다운 메뉴 */}
        <div className="relative group">
          <Link
            href="/boards/캠핑장"
            className="px-4 py-2 text-gray-600 hover:text-campinggreen font-medium transition-colors duration-200"
          >
            커뮤니티
          </Link>

          <div className="absolute left-1/2 -translate-x-1/2 top-full w-auto opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto transform translate-y-2 group-hover:translate-y-0">
            {/* 투명한 브릿지 */}
            <div className="h-2 w-full"></div>

            <div className="bg-white rounded-lg shadow-xl border border-gray-100 py-2 min-w-[160px]">
              {communityCategories.map((category, index) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-campingorange hover:text-white transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <Link
          href="/camps/list"
          className="px-4 py-2 hover:text-campinggreen hover:border-b-2 hover:border-campinggreen transition-all duration-75"
        >
          캠핑
        </Link>
      </div>
      <AuthButtons />
    </header>
  );
}

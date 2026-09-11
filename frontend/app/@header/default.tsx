import Link from "next/link";
import AuthButtons from "@/components/home/AuthButtons";
import Image from "next/image";
import logoImg from "@/public/image/logo.png";

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-white shadow">
      <div className="flex items-center gap-6">
        <Link href="/">
          <Image src={logoImg} alt="Logo" className="h-8 w-30" />
        </Link>
        <Link
          href="/boards/캠핑장"
          className="hover:text-campingsig hover:border-b-2 hover:border-campingsig transition-all duration-75"
        >
          커뮤니티
        </Link>
        <Link
          href="/camps/list"
          className="hover:text-campingsig hover:border-b-2 hover:border-campingsig transition-all duration-75"
        >
          캠핑
        </Link>
      </div>
      <AuthButtons />
    </header>
  );
}

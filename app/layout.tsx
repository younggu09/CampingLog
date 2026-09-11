import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "캠핑 로그",
  description: "캠핑 정보를 확인할 수 있는 사이트",
};

interface RootLayoutProps {
  children: React.ReactNode;
  header: React.ReactNode;
  footer: React.ReactNode;
}

export default function RootLayout(props: Readonly<RootLayoutProps>) {
  const { children, header, footer } = props;

  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col`}
      >
        {header}
        <main className="flex-1">{children}</main>
        {footer}
      </body>
    </html>
  );
}

"use client";

import Password from "@/components/member/Password";
import { Suspense } from "react";

export default function PasswordPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#fdfaf5]">
      <Suspense fallback={<div>Loading...</div>}>
        <Password />
      </Suspense>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL ?? "";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (pathname === "/login") { setChecked(true); return; }

    const token = localStorage.getItem("admin_token");
    if (!token) { router.replace("/login"); return; }

    // 토큰 유효성 서버 확인
    fetch(`${API}/api/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (r.ok) {
          setChecked(true);
        } else {
          localStorage.removeItem("admin_token");
          router.replace("/login");
        }
      })
      .catch(() => {
        // 백엔드 연결 불가 시 토큰 있으면 통과 (개발 편의)
        if (token) setChecked(true);
        else router.replace("/login");
      });
  }, [pathname, router]);

  if (!checked && pathname !== "/login") {
    return (
      <div className="min-h-screen bg-[#07070f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}

import type { Metadata } from "next";
import "./globals.css";
import AdminShell from "@/components/AdminShell";

export const metadata: Metadata = {
  title: "마이리즈 Admin",
  description: "마이리즈 관리자 페이지",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen flex bg-[#07070f]">
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}

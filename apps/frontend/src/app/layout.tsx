import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "마이리즈 — 세상에 하나뿐인 나만의 피규어",
  description: "3D 스캔부터 수작업 도색까지, 완전 맞춤 제작 피규어 & 커스텀 굿즈 전문 브랜드",
  keywords: ["커스텀 피규어", "3D 피규어", "맞춤 제작", "웨딩 피규어", "굿즈 제작"],
  openGraph: {
    title: "마이리즈 — 세상에 하나뿐인 나만의 피규어",
    description: "3D 스캔부터 수작업 도색까지, 완전 맞춤 제작 피규어 & 커스텀 굿즈 전문 브랜드",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className="h-full" suppressHydrationWarning>
      <body className="min-h-full flex flex-col antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}

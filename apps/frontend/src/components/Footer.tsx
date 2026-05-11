"use client";

import { ArrowUp } from "lucide-react";

function IconInstagram() {
  return <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>;
}
function IconYoutube() {
  return <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>;
}
function IconX() {
  return <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
}

const footerLinks = {
  제품: [
    { label: "커스텀 풀바디 피규어", href: "#collection" },
    { label: "웨딩 커플 피규어", href: "#collection" },
    { label: "케이크 토퍼", href: "#collection" },
    { label: "미니 키링 피규어", href: "#collection" },
    { label: "아크릴 굿즈", href: "#collection" },
  ],
  제작안내: [
    { label: "제작 과정 안내", href: "#process" },
    { label: "제작 기간 & 가격", href: "#contact" },
    { label: "3D 스캔 안내", href: "#brand" },
    { label: "소재 & 마감", href: "#brand" },
  ],
  고객지원: [
    { label: "커스텀 주문 문의", href: "#contact" },
    { label: "완성 작품 갤러리", href: "#gallery" },
    { label: "고객 후기", href: "#social" },
    { label: "자주 묻는 질문", href: "#contact" },
  ],
  브랜드: [
    { label: "마이리즈 소개", href: "#brand" },
    { label: "인스타그램", href: "#" },
    { label: "공지사항", href: "#" },
    { label: "이용약관", href: "#" },
  ],
};

const socials = [
  { icon: IconInstagram, href: "#", label: "인스타그램" },
  { icon: IconYoutube, href: "#", label: "유튜브" },
  { icon: IconX, href: "#", label: "X" },
];

export default function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="bg-rose-50 border-t border-rose-100 text-slate-400 relative">
      {/* CTA strip */}
      <div className="relative overflow-hidden py-14 px-6">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-100 via-pink-50 to-fuchsia-100" />
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-slate-800 text-2xl lg:text-3xl font-black mb-2">
              지금 바로 나만의 피규어를 만들어보세요
            </h3>
            <p className="text-slate-500">
              상담은 무료입니다. 원하는 스타일을 알려주세요.
            </p>
          </div>
          <button
            onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
            className="btn-primary shrink-0"
          >
            <span>무료 상담 신청</span>
          </button>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-400 to-fuchsia-500 flex items-center justify-center shadow-[0_0_12px_rgba(244,63,94,0.3)]">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="w-4 h-4">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                </svg>
              </div>
              <span className="text-xl font-black tracking-[0.15em] text-slate-800">마이리즈</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              3D 스캔부터 수작업 도색까지, 세상에 하나뿐인 커스텀 피규어 전문 브랜드
            </p>
            <div className="flex gap-2">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 bg-white border border-rose-200 hover:border-rose-400 hover:bg-rose-50 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 text-slate-400 hover:text-rose-500"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-slate-600 font-bold text-xs mb-4 tracking-[0.2em] uppercase">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-slate-400 text-sm hover:text-rose-500 transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-rose-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 text-center sm:text-left">
            <p>© 2026 마이리즈. All rights reserved.</p>
            <p className="mt-1">사업자등록번호: 123-45-67890 | 대표: 홍길동 | 서울특별시 마포구</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <a href="#" className="hover:text-slate-600 transition-colors">개인정보처리방침</a>
            <span>|</span>
            <a href="#" className="hover:text-slate-600 transition-colors">이용약관</a>
          </div>
        </div>
      </div>

      {/* Scroll to top */}
      <button
        onClick={scrollTop}
        className="fixed bottom-8 right-8 w-12 h-12 bg-white border border-rose-200 rounded-full flex items-center justify-center text-rose-500 hover:bg-rose-50 hover:border-rose-400 hover:scale-110 transition-all duration-300 z-30 shadow-lg shadow-rose-200/50"
        aria-label="맨 위로"
      >
        <ArrowUp size={18} />
      </button>
    </footer>
  );
}

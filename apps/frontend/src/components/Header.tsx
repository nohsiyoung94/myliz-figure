"use client";

import { useState, useEffect } from "react";
import { Menu, X, ShoppingBag, Search } from "lucide-react";

const navLinks = [
  { label: "피규어", href: "#collection" },
  { label: "커스텀 굿즈", href: "#collection" },
  { label: "제작 과정", href: "#process" },
  { label: "갤러리", href: "#gallery" },
  { label: "문의", href: "#contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/90 backdrop-blur-xl border-b border-rose-100 shadow-sm shadow-rose-100"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-2.5 group"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-400 to-fuchsia-500 flex items-center justify-center shadow-[0_0_12px_rgba(244,63,94,0.4)]">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="w-4 h-4">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                </svg>
              </div>
              <span className="text-xl font-black tracking-[0.15em] text-slate-800 group-hover:text-gradient transition-all duration-300">
                마이리즈
              </span>
            </button>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.href + link.label}
                  onClick={() => handleNavClick(link.href)}
                  className="text-sm font-medium tracking-wide text-slate-500 hover:text-rose-500 transition-colors duration-300 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-rose-400 group-hover:w-full transition-all duration-300" />
                </button>
              ))}
            </nav>

            {/* Right */}
            <div className="flex items-center gap-3">
              <button className="hidden lg:flex p-2 text-slate-400 hover:text-rose-500 transition-colors" aria-label="검색">
                <Search size={18} />
              </button>
              <button className="relative p-2 text-slate-400 hover:text-rose-500 transition-colors" aria-label="장바구니">
                <ShoppingBag size={18} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-400 rounded-full" />
              </button>
              <button
                className="hidden lg:flex btn-primary text-sm py-2 px-5"
                onClick={() => handleNavClick("#contact")}
              >
                <span>주문하기</span>
              </button>
              <button
                className="lg:hidden p-2 text-slate-500 hover:text-slate-800 transition-colors"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="메뉴"
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 bg-rose-50/98 backdrop-blur-xl transition-all duration-500 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col pt-28 px-8 gap-2">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.href)}
              className="text-left text-2xl font-bold text-slate-600 hover:text-rose-500 transition-colors py-3 border-b border-rose-100"
            >
              {link.label}
            </button>
          ))}
          <button
            className="mt-8 btn-primary text-center text-lg"
            onClick={() => handleNavClick("#contact")}
          >
            <span>커스텀 주문하기</span>
          </button>
        </div>
      </div>
    </>
  );
}

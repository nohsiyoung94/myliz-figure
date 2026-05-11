"use client";

import { useEffect, useState, useCallback } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  href: string;
  order: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4001";

const FALLBACK: Banner[] = [
  {
    id: 0,
    title: "세상에 하나뿐인\n나만의 피규어",
    subtitle: "3D 스캔부터 수작업 도색까지, 당신만을 위한 커스텀 피규어",
    image: "https://picsum.photos/seed/banner-fig1/1600/900",
    href: "#contact",
    order: 0,
  },
];

export default function HeroSection() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/banners`)
      .then((r) => r.json())
      .then((data: Banner[]) => {
        const normalized = data.map((b) => ({
          ...b,
          image: b.image.startsWith("/uploads/") ? `${API_URL}${b.image}` : b.image,
        }));
        setBanners(normalized.length ? normalized : FALLBACK);
      })
      .catch(() => setBanners(FALLBACK));
  }, []);

  const goTo = useCallback((idx: number) => {
    if (animating || banners.length <= 1) return;
    setAnimating(true);
    setCurrent(idx);
    setTimeout(() => setAnimating(false), 700);
  }, [animating, banners.length]);

  const next = useCallback(() => goTo((current + 1) % banners.length), [current, banners.length, goTo]);
  const prev = useCallback(() => goTo((current - 1 + banners.length) % banners.length), [current, banners.length, goTo]);

  // Auto-advance every 5s
  useEffect(() => {
    if (banners.length <= 1) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [banners.length, next]);

  const handleNavClick = (href: string) => {
    if (href.startsWith("#")) {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.open(href, "_blank");
    }
  };

  if (banners.length === 0) {
    return <section className="w-full h-screen bg-rose-50 animate-pulse" />;
  }

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Slides track */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map((banner) => (
          <div key={banner.id} className="relative w-full h-full shrink-0">
            {/* Background image */}
            <img
              src={banner.image}
              alt={banner.title}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-rose-950/70 via-rose-900/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-rose-950/50 via-transparent to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
                <div className="max-w-xl">
                  {/* Label */}
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-300 animate-pulse" />
                    <span className="text-white/80 text-xs font-semibold tracking-[0.3em] uppercase">마이리즈 Studio</span>
                  </div>

                  {/* Title */}
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.05] tracking-tight mb-5 whitespace-pre-line drop-shadow-lg">
                    {banner.title}
                  </h1>

                  {/* Subtitle */}
                  <p className="text-white/75 text-base sm:text-lg leading-relaxed mb-8 max-w-md drop-shadow">
                    {banner.subtitle}
                  </p>

                  {/* CTA */}
                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={() => handleNavClick(banner.href)}
                      className="btn-primary flex items-center gap-2"
                    >
                      <span>자세히 보기</span>
                      <ArrowRight size={16} />
                    </button>
                    <button
                      onClick={() => handleNavClick("#contact")}
                      className="flex items-center gap-2 px-8 py-3.5 rounded-full border border-white/40 text-white font-semibold hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                    >
                      무료 상담하기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Prev / Next arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-all duration-300 z-20"
            aria-label="이전"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-all duration-300 z-20"
            aria-label="다음"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-500 ${
                i === current
                  ? "bg-white w-7 h-2"
                  : "bg-white/40 w-2 h-2 hover:bg-white/70"
              }`}
              aria-label={`슬라이드 ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Slide counter */}
      {banners.length > 1 && (
        <div className="absolute bottom-8 right-6 lg:right-8 text-white/40 text-xs font-mono z-20">
          <span className="text-white font-bold">{String(current + 1).padStart(2, "0")}</span>
          {" / "}
          {String(banners.length).padStart(2, "0")}
        </div>
      )}
    </section>
  );
}

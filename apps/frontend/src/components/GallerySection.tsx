"use client";

import { useEffect, useRef, useState } from "react";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryItem {
  id: number;
  title: string;
  image: string;
  size: "tall" | "wide" | "square";
  order: number;
}

// ▼ 백엔드 API 주소 (배포 시 NEXT_PUBLIC_API_URL 환경변수로 변경)
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4001";

const sizeClass = { tall: "row-span-2", wide: "col-span-2", square: "" };

export default function GallerySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    // ▼ GET /api/gallery — 갤러리 목록 가져오기
    fetch(`${API_URL}/api/gallery`)
      .then((r) => r.json())
      .then((data: GalleryItem[]) => {
        setItems(data.map((item) => ({
          ...item,
          image: item.image?.startsWith("/uploads/") ? `${API_URL}${item.image}` : (item.image ?? ""),
        })));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (items.length === 0) return;
    const handleKey = (e: KeyboardEvent) => {
      if (lightbox === null) return;
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((p) => p !== null ? (p + 1) % items.length : null);
      if (e.key === "ArrowLeft") setLightbox((p) => p !== null ? (p - 1 + items.length) % items.length : null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightbox, items.length]);

  return (
    <section id="gallery" ref={sectionRef} className="py-24 lg:py-32 bg-rose-50 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] rounded-full bg-fuchsia-200/15 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <p className="text-rose-500 text-sm font-semibold tracking-[0.3em] uppercase mb-4">Gallery</p>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-800 mb-6">
            완성 작품{" "}
            <span className="text-gradient">갤러리</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            실제로 제작된 작품들을 직접 확인해보세요
          </p>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-2 lg:grid-cols-4 auto-rows-[180px] gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl bg-rose-100 animate-pulse" />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && items.length === 0 && (
          <p className="text-center text-slate-400 py-20">등록된 작품이 없습니다.</p>
        )}

        {/* Grid */}
        {!loading && items.length > 0 && (
          <div className={`grid grid-cols-2 lg:grid-cols-4 auto-rows-[180px] gap-3 transition-all duration-1000 delay-200 ${visible ? "opacity-100" : "opacity-0"}`}>
            {items.map((item, i) => (
              <div
                key={item.id}
                className={`relative overflow-hidden rounded-xl group cursor-pointer border border-rose-200 hover:border-rose-400/50 transition-colors shadow-sm ${sizeClass[item.size]}`}
                onClick={() => setLightbox(i)}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* Title — always visible */}
                {item.title && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-rose-950/70 to-transparent px-3 py-3 pointer-events-none">
                    <p className="text-white text-xs font-semibold leading-snug drop-shadow-md line-clamp-2">{item.title}</p>
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-transparent group-hover:bg-rose-900/20 transition-all duration-300 flex items-start justify-end p-2">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-8 h-8 rounded-full bg-white/90 border border-rose-200 flex items-center justify-center">
                      <ZoomIn className="text-rose-500" size={15} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox !== null && items[lightbox] && (
        <div
          className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-xl flex items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-4xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={items[lightbox].image}
              alt={items[lightbox].title}
              className="w-full h-auto rounded-2xl max-h-[78vh] object-contain border border-rose-200 shadow-2xl shadow-rose-200/30"
            />
            {items[lightbox].title && (
              <p className="text-slate-800 text-center mt-4 font-semibold">{items[lightbox].title}</p>
            )}
            <p className="text-slate-400 text-center text-sm mt-1">{lightbox + 1} / {items.length}</p>

            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-12 right-0 text-slate-400 hover:text-rose-500 transition-colors"
            >
              <X size={26} />
            </button>
            <button
              onClick={() => setLightbox((lightbox - 1 + items.length) % items.length)}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-14 w-12 h-12 bg-white border border-rose-200 rounded-full flex items-center justify-center text-slate-500 hover:text-rose-500 hover:border-rose-400 transition-all hover:scale-110 shadow-md"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setLightbox((lightbox + 1) % items.length)}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-14 w-12 h-12 bg-white border border-rose-200 rounded-full flex items-center justify-center text-slate-500 hover:text-rose-500 hover:border-rose-400 transition-all hover:scale-110 shadow-md"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

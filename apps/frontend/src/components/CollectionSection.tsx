"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Star } from "lucide-react";

interface Product {
  id: number;
  name: string;
  desc: string;
  price: string;
  category: string;
  image: string;
  badge: string;
  badgeColor: string;
  rating: number;
  reviews: number;
  order: number;
}

// ▼ 백엔드 API 주소 (배포 시 NEXT_PUBLIC_API_URL 환경변수로 변경)
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4001";

const CATEGORY_LABELS: Record<string, string> = {
  all: "전체", figure: "피규어", wedding: "웨딩/커플", goods: "굿즈",
};

export default function CollectionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    // ▼ GET /api/products — 제품 목록 가져오기
    fetch(`${API_URL}/api/products`)
      .then((r) => r.json())
      .then((data: Product[]) => {
        setProducts(data.map((p) => ({
          ...p,
          image: p.image?.startsWith("/uploads/") ? `${API_URL}${p.image}` : (p.image ?? ""),
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

  // 실제 등록된 카테고리만 필터 탭으로 표시
  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category)))];
  const filtered = filter === "all" ? products : products.filter((p) => p.category === filter);

  return (
    <section id="collection" ref={sectionRef} className="py-24 lg:py-32 bg-rose-50 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full bg-rose-200/15 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className={`flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6 transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div>
            <p className="text-rose-500 text-sm font-semibold tracking-[0.3em] uppercase mb-4">Products</p>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-800 leading-tight">
              제품 라인업
              <br />
              <span className="text-gradient">무엇이든 만들어드립니다</span>
            </h2>
          </div>

          {/* Filter — 제품이 있을 때만 표시 */}
          {!loading && products.length > 1 && categories.length > 2 && (
            <div className="flex gap-2 bg-white rounded-full p-1.5 self-start lg:self-auto shadow-sm border border-rose-100">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    filter === cat
                      ? "bg-gradient-to-r from-rose-500 to-fuchsia-500 text-white shadow-md shadow-rose-200"
                      : "text-slate-400 hover:text-slate-700"
                  }`}
                >
                  {CATEGORY_LABELS[cat] ?? cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-rose-100 animate-pulse bg-white">
                <div className="aspect-[4/3] bg-rose-100" />
                <div className="p-5 space-y-2">
                  <div className="h-4 bg-rose-100 rounded w-3/4" />
                  <div className="h-3 bg-rose-50 rounded w-1/2" />
                  <div className="h-5 bg-rose-100 rounded w-1/3 mt-3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && products.length === 0 && (
          <p className="text-center text-slate-400 py-20">등록된 제품이 없습니다.</p>
        )}

        {/* Grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((item, i) => (
              <div
                key={item.id}
                className={`group bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-700 hover:scale-[1.02] hover:shadow-xl hover:shadow-rose-200/40 border border-rose-100 ${
                  visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-rose-50">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-rose-200 text-4xl font-black">
                      FX
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-rose-900/20 via-transparent to-transparent opacity-70" />

                  {item.badge && (
                    <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold ${
                      item.badgeColor === "fuchsia"
                        ? "bg-fuchsia-100 border border-fuchsia-300 text-fuchsia-600"
                        : "bg-rose-100 border border-rose-300 text-rose-600"
                    }`}>
                      {item.badge}
                    </div>
                  )}

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="btn-primary flex items-center gap-2 text-sm">
                      <span>자세히 보기</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-slate-800 text-base">{item.name}</h3>
                    {item.rating > 0 && (
                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        <Star size={12} className="text-amber-400 fill-amber-400" />
                        <span className="text-amber-500 text-xs font-semibold">{item.rating}</span>
                        {item.reviews > 0 && <span className="text-slate-300 text-xs">({item.reviews})</span>}
                      </div>
                    )}
                  </div>
                  {item.desc && <p className="text-slate-400 text-sm mb-3">{item.desc}</p>}
                  <div className="flex items-center justify-between">
                    <span className="text-gradient font-black text-lg">{item.price}</span>
                    <button className="text-rose-500 hover:text-rose-700 text-sm font-medium flex items-center gap-1 transition-colors group/btn">
                      <span>주문</span>
                      <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* More */}
        {!loading && products.length > 0 && (
          <div className={`text-center mt-12 transition-all duration-1000 delay-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <button className="btn-outline">전체 제품 보기</button>
          </div>
        )}
      </div>
    </section>
  );
}

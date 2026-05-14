"use client";

import { useEffect, useRef, useState } from "react";
import { Heart, MessageCircle, Star } from "lucide-react";

// ▼ 백엔드 API 주소 (배포 시 NEXT_PUBLIC_API_URL 환경변수로 변경)
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4001";

function IconInstagram({ size = 24 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

const posts = [
  { seed: "fig-sns1", likes: "2.4k", comments: "87", caption: "웨딩 피규어 완성! 너무 실물같아요 💍" },
  { seed: "fig-sns2", likes: "3.1k", comments: "124", caption: "3D 스캔 작업 중 ✨" },
  { seed: "fig-sns3", likes: "1.8k", comments: "56", caption: "수작업 도색의 섬세함 🎨" },
  { seed: "fig-sns4", likes: "4.2k", comments: "201", caption: "고객님 피규어 완성! 어때요? 😍" },
  { seed: "fig-sns5", likes: "2.7k", comments: "93", caption: "미니 키링 신규 출시 🎉" },
  { seed: "fig-sns6", likes: "1.5k", comments: "44", caption: "출력 완료, 이제 도색 시작!" },
];

interface Review {
  id: number;
  name: string;
  handle: string;
  avatar: string;
  rating: number;
  text: string;
  product: string;
  order: number;
}

export default function SocialSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    // ▼ GET /api/reviews — 리뷰 목록 가져오기
    fetch(`${API_URL}/api/reviews`)
      .then((r) => r.json())
      .then((data: Review[]) => {
        setReviews(data.map((r) => ({
          ...r,
          avatar: r.avatar?.startsWith("/uploads/") ? `${API_URL}${r.avatar}` : (r.avatar ?? ""),
        })));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="social" ref={sectionRef} className="py-24 lg:py-32 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-rose-200/15 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Instagram header */}
        <div className={`text-center mb-12 transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="text-rose-400">
              <IconInstagram size={20} />
            </div>
            <p className="text-rose-500 text-sm font-semibold tracking-[0.3em] uppercase">Instagram</p>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-800 mb-4">
            <span className="text-gradient">@마이리즈_official</span>
          </h2>
          <p className="text-slate-400 text-lg">팔로우하고 최신 작품을 가장 먼저 만나보세요</p>
        </div>

        {/* Instagram grid */}
        <div className={`grid grid-cols-3 lg:grid-cols-6 gap-2 mb-8 transition-all duration-1000 delay-200 ${visible ? "opacity-100" : "opacity-0"}`}>
          {posts.map((post) => (
            <div key={post.seed} className="group relative aspect-square overflow-hidden rounded-xl cursor-pointer border border-rose-100">
              <img
                src={`https://picsum.photos/seed/${post.seed}/400/400`}
                alt={post.caption}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-transparent group-hover:bg-rose-900/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex items-center gap-3 text-white text-xs drop-shadow-md">
                  <span className="flex items-center gap-1">
                    <Heart size={14} fill="white" />
                    {post.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle size={14} fill="white" />
                    {post.comments}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Follow button */}
        <div className={`text-center mb-24 transition-all duration-1000 delay-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <button className="btn-primary flex items-center gap-2 mx-auto">
            <IconInstagram size={18} />
            <span>인스타그램 팔로우</span>
          </button>
        </div>

        {/* Reviews */}
        {reviews.length > 0 && (
          <div className={`transition-all duration-1000 delay-400 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <div className="text-center mb-12">
              <p className="text-rose-500 text-sm font-semibold tracking-[0.3em] uppercase mb-4">Reviews</p>
              <h3 className="text-3xl lg:text-4xl font-black text-slate-800">
                고객들의 <span className="text-gradient">진짜 후기</span>
              </h3>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {reviews.map((review, i) => (
                <div
                  key={review.id}
                  className={`bg-rose-50 border border-rose-100 rounded-2xl p-6 hover:bg-white hover:shadow-lg hover:shadow-rose-100 transition-all duration-500 ${
                    visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                  }`}
                  style={{ transitionDelay: `${(i + 4) * 100}ms` }}
                >
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: Math.min(review.rating, 5) }).map((_, j) => (
                      <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>

                  {review.product && (
                    <div className="inline-flex items-center gap-1.5 mb-3 px-3 py-1 rounded-full bg-rose-100 border border-rose-200">
                      <span className="text-rose-500 text-xs font-semibold">{review.product}</span>
                    </div>
                  )}

                  <p className="text-slate-600 leading-relaxed mb-6 text-sm">
                    &ldquo;{review.text}&rdquo;
                  </p>

                  <div className="flex items-center gap-3 pt-4 border-t border-rose-100">
                    {review.avatar ? (
                      <img
                        src={review.avatar}
                        alt={review.name}
                        className="w-10 h-10 rounded-full object-cover border border-rose-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-400 font-bold text-sm shrink-0">
                        {review.name[0]}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{review.name}</p>
                      {review.handle && <p className="text-slate-400 text-xs">{review.handle}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

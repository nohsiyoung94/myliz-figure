"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Play } from "lucide-react";

interface Reel {
  id: number;
  title: string;
  caption: string;
  thumbnail: string;
  video: string;
  href: string;
  order: number;
}

// ▼ 백엔드 API 주소 (배포 시 NEXT_PUBLIC_API_URL 환경변수로 변경)
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export default function ReelsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ▼ GET /api/reels — 릴스(영상) 목록 가져오기
    fetch(`${API_URL}/api/reels`)
      .then((r) => r.json())
      .then((data: Reel[]) => {
        setReels(data.map((r) => ({
          ...r,
          thumbnail: r.thumbnail?.startsWith("/uploads/") ? `${API_URL}${r.thumbnail}` : (r.thumbnail ?? ""),
          video: r.video?.startsWith("/uploads/") ? `${API_URL}${r.video}` : (r.video ?? ""),
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

  return (
    <section id="reels" ref={sectionRef} className="py-24 lg:py-32 bg-rose-50 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute top-0 left-1/3 w-[500px] h-[400px] rounded-full bg-fuchsia-200/15 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-14 transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <p className="text-rose-500 text-sm font-semibold tracking-[0.3em] uppercase mb-4">
            Video Review
          </p>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-800 mb-4">
            고객 영상{" "}
            <span className="text-gradient">리얼 후기</span>
          </h2>
          <p className="text-slate-400 text-lg">
            실제 고객분들이 직접 찍은 피규어 수령 영상
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-rose-200 animate-pulse bg-white">
                <div className="aspect-video bg-rose-100" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-rose-100 rounded w-2/3" />
                  <div className="h-3 bg-rose-50 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : reels.length === 0 ? (
          <p className="text-center text-slate-400 py-20">등록된 영상이 없습니다.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reels.map((reel, i) => (
              <div
                key={reel.id}
                className={`group transition-all duration-700 ${
                  visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                {/* Card */}
                <div className="relative rounded-2xl overflow-hidden border border-rose-200 hover:border-rose-400/50 bg-white transition-all duration-300 hover:shadow-xl hover:shadow-rose-100 hover:scale-[1.02]">
                  <div className="relative aspect-video overflow-hidden">
                    {reel.video ? (
                      <>
                        <video
                          src={reel.video}
                          poster={reel.thumbnail || undefined}
                          className="w-full h-full object-cover"
                          muted
                          loop
                          playsInline
                          preload="metadata"
                          onMouseEnter={(e) => (e.currentTarget as HTMLVideoElement).play()}
                          onMouseLeave={(e) => { const v = e.currentTarget as HTMLVideoElement; v.pause(); v.currentTime = 0; }}
                        />
                        {/* Play icon hint */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity">
                          <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg">
                            <Play size={20} className="text-rose-500 ml-1" fill="currentColor" />
                          </div>
                        </div>
                      </>
                    ) : reel.thumbnail ? (
                      <img
                        src={reel.thumbnail}
                        alt={reel.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-rose-100 flex items-center justify-center">
                        <Play size={32} className="text-rose-300" />
                      </div>
                    )}

                    {/* Brand watermark */}
                    <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-black text-slate-700 tracking-wide border border-rose-200">
                      마이리즈
                    </div>

                    {/* Caption overlay */}
                    {reel.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-rose-900/60 to-transparent px-3 py-3">
                        <p className="text-white text-xs font-semibold leading-snug drop-shadow-lg line-clamp-2">
                          {reel.caption}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Below card */}
                <div className="flex items-center justify-between mt-3 px-1">
                  <h3 className="text-slate-800 font-bold text-sm">{reel.title}</h3>
                  {reel.href && (
                    <a
                      href={reel.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full border border-rose-200 hover:border-rose-400 hover:bg-rose-50 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all duration-300 shrink-0"
                      aria-label="영상 보기"
                    >
                      <ArrowRight size={14} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

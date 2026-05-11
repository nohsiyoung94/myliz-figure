"use client";

import { useEffect, useRef, useState } from "react";
import { ScanLine, Paintbrush, Leaf, Sparkles } from "lucide-react";

const stats = [
  { value: "1,200+", label: "완성 작품" },
  { value: "98%", label: "재주문율" },
  { value: "3~4주", label: "평균 제작 기간" },
  { value: "4.9★", label: "평균 고객 평점" },
];

const values = [
  {
    icon: ScanLine,
    title: "정밀 3D 스캔",
    description: "산업용 3D 스캐너로 얼굴과 체형을 0.1mm 단위까지 정밀하게 측정합니다.",
    color: "rose",
  },
  {
    icon: Paintbrush,
    title: "수작업 도색",
    description: "숙련된 아티스트가 에어브러시와 붓으로 한 땀 한 땀 채색합니다.",
    color: "fuchsia",
  },
  {
    icon: Leaf,
    title: "친환경 소재",
    description: "무독성 FDA 인증 수지와 친환경 도료만을 사용해 안전하게 제작합니다.",
    color: "rose",
  },
  {
    icon: Sparkles,
    title: "완전 맞춤 제작",
    description: "헤어스타일, 의상, 포즈, 표정 모두 원하는 대로 100% 커스터마이징.",
    color: "fuchsia",
  },
];

export default function BrandSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="brand" ref={sectionRef} className="py-24 lg:py-32 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent to-rose-300/50" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-fuchsia-200/15 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-rose-200/15 blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-16 lg:mb-24 transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <p className="text-rose-500 text-sm font-semibold tracking-[0.3em] uppercase mb-4">
            Our Technology
          </p>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-800 mb-6 leading-tight">
            왜 마이리즈인가요?
            <br />
            <span className="text-gradient">기술이 다릅니다</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
            단순한 피규어가 아닙니다. 산업용 3D 기술과 예술적 감각이 결합된
            세상에 단 하나뿐인 오브제를 만들어드립니다.
          </p>
        </div>

        {/* Split content */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">
          {/* Visual */}
          <div className={`relative transition-all duration-1000 delay-200 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}>
            <div className="relative aspect-square max-w-md mx-auto">
              <div className="rounded-3xl overflow-hidden neon-border-cyan relative">
                <img
                  src="https://picsum.photos/seed/figure-craft/600/600"
                  alt="3D 피규어 제작"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-rose-100/40 to-transparent" />
                <div className="absolute inset-0 grid-bg opacity-20" />
              </div>

              {/* Floating card */}
              <div className="absolute -bottom-6 -right-4 glass-card neon-border-cyan p-4 rounded-2xl shadow-lg shadow-rose-200/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-fuchsia-500 flex items-center justify-center">
                    <ScanLine size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-slate-800 font-bold text-sm">3D 스캔 완료</p>
                    <p className="text-rose-500 text-xs">정밀도 0.1mm</p>
                  </div>
                </div>
              </div>

              {/* Top badge */}
              <div className="absolute -top-4 -left-4 glass-card neon-border-violet p-3 rounded-xl shadow-lg shadow-fuchsia-100">
                <p className="text-fuchsia-500 text-xs font-bold">★ 4.9</p>
                <p className="text-slate-500 text-xs">고객 평점</p>
              </div>
            </div>
          </div>

          {/* Text */}
          <div className={`transition-all duration-1000 delay-300 ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}>
            <h3 className="text-3xl lg:text-4xl font-black text-slate-800 mb-6 leading-snug">
              당신의 이야기를
              <br />
              <span className="text-gradient">입체로 영원히</span>
            </h3>
            <p className="text-slate-500 text-lg leading-relaxed mb-6">
              웨딩 기념, 생일 선물, 캐릭터 재현 — 어떤 순간이든 피규어로 만들어
              영원히 간직할 수 있습니다. 2019년 설립 이후 1,200개 이상의 작품을
              완성하며 업계 최고의 품질을 이어가고 있습니다.
            </p>
            <p className="text-slate-500 text-lg leading-relaxed mb-8">
              모든 피규어는 3D 스캔 → 모델링 → 프린팅 → 수작업 도색 →
              검수 단계를 거쳐 완성됩니다. 단 하나, 당신만을 위한 작품입니다.
            </p>
            <button
              onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
              className="btn-primary flex items-center gap-2 w-fit"
            >
              <span>무료 상담 신청</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 mb-24 transition-all duration-1000 delay-400 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          {stats.map((s) => (
            <div key={s.label} className="glass-card neon-border-cyan rounded-2xl p-6 text-center hover:bg-rose-50 transition-colors duration-300 shadow-sm">
              <p className="text-3xl lg:text-4xl font-black text-gradient mb-2">{s.value}</p>
              <p className="text-slate-400 text-sm">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Values grid */}
        <div className={`grid sm:grid-cols-2 lg:grid-cols-4 gap-4 transition-all duration-1000 delay-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          {values.map((v, i) => {
            const Icon = v.icon;
            const isRose = v.color === "rose";
            return (
              <div
                key={v.title}
                className={`glass-card ${isRose ? "neon-border-cyan hover:bg-rose-50" : "neon-border-violet hover:bg-fuchsia-50"} rounded-2xl p-6 transition-all duration-300 group shadow-sm`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${isRose ? "from-rose-400 to-rose-500" : "from-fuchsia-400 to-fuchsia-600"} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={22} className="text-white" />
                </div>
                <h4 className="font-bold text-slate-800 mb-2">{v.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{v.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

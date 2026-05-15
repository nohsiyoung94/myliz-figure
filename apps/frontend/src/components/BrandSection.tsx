"use client";

import { useEffect, useRef, useState } from "react";
import { ScanLine, Quote, Heart, Camera } from "lucide-react";

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
        <div className={`text-center mb-16 transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <p className="text-rose-500 text-sm font-semibold tracking-[0.3em] uppercase mb-4">
            About Myliz
          </p>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-800 mb-8 leading-tight">
            마이리즈 <span className="text-gradient">소개</span>
          </h2>

          {/* Pull quote */}
          <div className="relative inline-block max-w-3xl mx-auto px-4">
            <Quote
              size={36}
              className="absolute -top-2 -left-2 text-rose-200 rotate-180"
              aria-hidden
            />
            <Quote
              size={36}
              className="absolute -bottom-2 -right-2 text-fuchsia-200"
              aria-hidden
            />
            <p className="text-2xl lg:text-3xl font-bold text-slate-700 leading-relaxed px-8 py-2">
              소중한 순간을 <span className="text-gradient">오래도록</span> 간직할 수 있도록
            </p>
          </div>
        </div>

        {/* Brand story */}
        <div className={`max-w-4xl mx-auto mb-16 transition-all duration-1000 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="bg-white rounded-3xl p-8 lg:p-12 neon-border-cyan shadow-lg shadow-rose-100">
            <p className="text-slate-600 text-base lg:text-lg leading-relaxed mb-5">
              <span className="font-bold text-slate-800">마이리즈</span>는 최고의 순간과 추억을 특별한 작품으로 만드는{" "}
              <span className="font-semibold text-rose-500">3D 피규어 &amp; 커스터마이징 전문 브랜드</span>입니다.
            </p>
            <p className="text-slate-600 text-base lg:text-lg leading-relaxed">
              가족, 연인, 아이, 반려동물, 스포츠 선수, 웨딩, 졸업, 기념일 등
              각자의 소중한 이야기를 담아{" "}
              <span className="font-semibold text-fuchsia-500">세상에 단 하나뿐인 피규어와 굿즈</span>를 제작합니다.
            </p>
          </div>
        </div>

        {/* Highlight pair */}
        <div className={`grid lg:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto mb-16 transition-all duration-1000 delay-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="bg-white rounded-3xl p-8 neon-border-cyan shadow-lg shadow-rose-100 hover:-translate-y-1 transition-transform duration-300">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-400 to-rose-500 flex items-center justify-center mb-4 shadow-lg">
              <ScanLine size={22} className="text-white" />
            </div>
            <h3 className="text-xl lg:text-2xl font-black text-slate-800 mb-3">
              특별한 순간을 <span className="text-gradient">입체적으로</span>
            </h3>
            <p className="text-slate-500 leading-relaxed">
              마이리즈는 최신 3D 스캐닝과 디자인 기술을 활용하여 실제 모습과 감성을 그대로 담은 3D 피규어를 제작합니다.
              단순한 기념품이 아닌, 추억과 감동을 오래 간직할 수 있는 작품을 만드는 것이 마이리즈의 목표입니다.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 neon-border-violet shadow-lg shadow-fuchsia-100 hover:-translate-y-1 transition-transform duration-300">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-fuchsia-400 to-fuchsia-600 flex items-center justify-center mb-4 shadow-lg">
              <Camera size={22} className="text-white" />
            </div>
            <h3 className="text-xl lg:text-2xl font-black text-slate-800 mb-3">
              당신의 추억을 <span className="text-gradient">작품으로</span>
            </h3>
            <p className="text-slate-500 leading-relaxed">
              고객이 원하는 사진 한 장만 있어도 다양한 맞춤형 굿즈로 제작이 가능합니다.
              사진 속 순간이 세상에 하나뿐인 특별한 굿즈가 됩니다.
            </p>
          </div>
        </div>

        {/* Closing message */}
        <div className={`max-w-3xl mx-auto mb-24 text-center transition-all duration-1000 delay-400 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-rose-400 to-fuchsia-500 mb-6 shadow-lg shadow-rose-200">
            <Heart size={24} className="text-white" fill="currentColor" />
          </div>
          <p className="text-slate-600 text-lg lg:text-xl leading-relaxed mb-4">
            마이리즈는 단순히 피규어 및 굿즈를 제작하는 것이 아니라
            <br className="hidden md:block" />
            사람들의 <span className="font-bold text-slate-800">소중한 순간과 추억을 형태로 남기는 브랜드</span>가 되고자 합니다.
          </p>
          <p className="text-slate-500 leading-relaxed mb-8">
            누군가의 행복했던 순간, 사랑하는 사람과의 기억,
            평생 간직하고 싶은 이야기를 마이리즈만의 감성으로 특별하게 제작해드립니다.
          </p>
          <p className="text-rose-500 font-bold text-lg">
            지금 마이리즈와 함께, 소중한 추억을 오래도록 간직해보세요.
          </p>
          <button
            onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
            className="btn-primary mt-8"
          >
            무료 상담 신청
          </button>
        </div>
      </div>
    </section>
  );
}

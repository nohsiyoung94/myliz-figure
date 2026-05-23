"use client";

import { useEffect, useRef, useState } from "react";
import {
  Building2,
  TrendingUp,
  GraduationCap,
  Handshake,
  ClipboardList,
  Search,
  FileSignature,
  Rocket,
  Phone,
  MessageCircle,
  Mail,
} from "lucide-react";

export default function FranchiseSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const benefits = [
    {
      icon: Building2,
      title: "검증된 브랜드력",
      desc: "수많은 커스텀 제작 경험과 누적된 고객 신뢰를 그대로 이어받습니다.",
    },
    {
      icon: TrendingUp,
      title: "안정적인 수익 모델",
      desc: "피규어·굿즈·즉석 제작까지 다양한 단가 구성으로 회전율과 마진을 동시에.",
    },
    {
      icon: GraduationCap,
      title: "본사 직접 교육",
      desc: "3D 스캔, 도색, 장비 운용, 응대까지 개업 전 1:1 실무 교육을 제공합니다.",
    },
    {
      icon: Handshake,
      title: "지속 운영 지원",
      desc: "상권 분석, 마케팅 자료, 신메뉴/신상품 업데이트까지 오픈 이후에도 함께합니다.",
    },
  ];

  const steps = [
    { icon: ClipboardList, label: "01. 창업 상담", desc: "예산·지역·운영 형태 등 기본 상담" },
    { icon: Search, label: "02. 상권 분석", desc: "후보지 분석 및 예상 매출 시뮬레이션" },
    { icon: FileSignature, label: "03. 계약 & 인테리어", desc: "계약 체결 후 매장 셋업 및 장비 입고" },
    { icon: GraduationCap, label: "04. 실무 교육", desc: "본사에서 제작·운영 전반 1:1 교육" },
    { icon: Rocket, label: "05. 오픈 & 운영지원", desc: "오픈 마케팅 및 지속 운영 지원" },
  ];

  return (
    <section
      id="franchise"
      ref={sectionRef}
      className="py-24 lg:py-32 bg-rose-50/60 relative overflow-hidden border-t border-rose-100"
    >
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-rose-100/50 blur-[150px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-fuchsia-100/50 blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <p className="text-rose-500 text-sm font-semibold tracking-[0.3em] uppercase mb-4">Franchise</p>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-800 mb-6">
            마이리즈와{" "}
            <span className="text-gradient">함께 창업</span>하세요
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto break-keep">
            검증된 제작 노하우와 브랜드력을 그대로 이어받아, 안정적인 커스텀 굿즈 매장을 시작할 수 있습니다.
          </p>
        </div>

        {/* Benefits */}
        <div className={`grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16 transition-all duration-1000 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                className="bg-white border border-rose-100 rounded-3xl p-7 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-400 to-fuchsia-500 flex items-center justify-center mb-5 shadow-md shadow-rose-200">
                  <Icon size={20} className="text-white" />
                </div>
                <h3 className="text-lg font-black text-slate-800 mb-2">{b.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed break-keep">{b.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Process steps */}
        <div className={`mb-16 transition-all duration-1000 delay-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="bg-white border border-rose-100 rounded-3xl p-8 lg:p-10 shadow-sm">
            <h3 className="text-2xl font-black text-slate-800 mb-8 text-center">
              창업 진행 절차
            </h3>
            <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {steps.map((s) => {
                const Icon = s.icon;
                return (
                  <li
                    key={s.label}
                    className="flex flex-col items-center text-center gap-3 bg-rose-50 border border-rose-100 rounded-2xl py-6 px-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-fuchsia-500 flex items-center justify-center shadow-sm shadow-rose-200">
                      <Icon size={18} className="text-white" />
                    </div>
                    <span className="text-rose-500 font-black text-sm tracking-wide">{s.label}</span>
                    <span className="text-slate-500 text-xs leading-relaxed break-keep">{s.desc}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className={`bg-gradient-to-r from-rose-400 to-fuchsia-500 rounded-3xl p-8 lg:p-12 text-center shadow-lg shadow-rose-200/60 transition-all duration-1000 delay-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <h3 className="text-2xl lg:text-3xl font-black text-white mb-3">
            창업 상담은 100% 무료입니다
          </h3>
          <p className="text-white/90 text-base lg:text-lg mb-8 break-keep">
            관심 있으시면 부담 없이 문의해주세요. 담당자가 직접 안내해드립니다.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="tel:031-894-5773"
              className="flex items-center gap-2 px-6 py-4 bg-white text-rose-500 font-bold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <Phone size={18} />
              <span>(031) 894-5773</span>
            </a>
            <a
              href="https://pf.kakao.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-4 bg-[#FEE500] text-[#3C1E1E] font-bold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <MessageCircle size={18} fill="#3C1E1E" />
              <span>카카오톡 창업상담</span>
            </a>
            <a
              href="mailto:3dmyliz@naver.com?subject=창업문의"
              className="flex items-center gap-2 px-6 py-4 bg-white/10 backdrop-blur border border-white/40 text-white font-bold rounded-xl hover:bg-white/20 hover:-translate-y-0.5 transition-all"
            >
              <Mail size={18} />
              <span>이메일 문의</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

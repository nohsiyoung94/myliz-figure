"use client";

import { useEffect, useRef, useState } from "react";
import {
  User,
  Camera,
  KeyRound,
  Award,
  Zap,
  Smartphone,
  type LucideIcon,
} from "lucide-react";

interface SubItem {
  icon: LucideIcon;
  title: string;
  desc: string;
  items: string[];
  notice?: string;
  image?: string;
  gradient: string;
}

interface Lineup {
  num: string;
  label: string;
  heading: string;
  subs: SubItem[];
}

const lineups: Lineup[] = [
  {
    num: "01",
    label: "Lineup 1",
    heading: "3D 피규어",
    subs: [
      {
        icon: User,
        title: "3D 전신 피규어",
        desc: "실제 인물의 표정과 분위기를 섬세하게 표현한 고퀄리티 커스텀 피규어 제작",
        gradient: "from-rose-400 via-pink-400 to-fuchsia-500",
        items: [
          "커플 & 웨딩 피규어",
          "가족 피규어",
          "유소년 스포츠 선수 피규어",
          "반려동물 피규어",
          "부모님 감사 선물",
          "퇴직·승진·우승 기념 트로피 피규어",
          "군 전역, 승진 기념패",
          "골프 등 우승 트로피",
          "바디 프로필을 넘어 바디 피규어 (바디빌딩, 필라테스 등)",
          "돌아가신 부모님을 기리며 납골당용 흉상 피규어",
        ],
      },
      {
        icon: Camera,
        title: "사진으로 만드는 3D 피규어",
        desc: "직접 스캔하러 오실 수 없거나, 깜짝 선물의 경우 사진으로 피규어 제작 가능",
        gradient: "from-fuchsia-400 via-rose-400 to-orange-300",
        items: [
          "깜짝 선물을 위한 전신, 흉상 피규어",
          "돌아가신 부모님을 추억하며 사진으로 피규어 제작",
          "납골당용 (반신) 흉상 피규어",
          "움직임이 많은 반려동물",
          "무지개 다리 건넌 반려견을 추억하며 사진으로 피규어 제작",
        ],
        notice:
          "사진으로 3D 피규어 제작의 경우, 스캔에 비해 품질이 다소 떨어질 수 있으며, 디자이너의 노력과 정성으로 모델링 추가 비용이 발생하며 제작 기간이 길어질 수 있습니다.",
      },
    ],
  },
  {
    num: "02",
    label: "Lineup 2",
    heading: "커스텀 굿즈",
    subs: [
      {
        icon: KeyRound,
        title: "아크릴 키링, 스탠드 (등신대)",
        desc: "선명한 인쇄와 감각적인 디자인으로 소장 가치 높은 굿즈 제작",
        gradient: "from-pink-300 via-rose-300 to-fuchsia-400",
        items: [
          "웨딩 커플 굿즈",
          "캐릭터 굿즈",
          "아이돌 / 팬굿즈",
          "스포츠 선수 굿즈",
          "단체 행사 기념품",
          "학교·동호회 굿즈",
          "가족, 연인 굿즈",
          "반려동물 굿즈",
        ],
      },
      {
        icon: Award,
        title: "메탈 키링, 마그네틱, 뱃지",
        desc: "선명한 인쇄와 감각적인 디자인으로 소장 가치 높은 굿즈 제작",
        gradient: "from-slate-400 via-rose-300 to-amber-300",
        items: [
          "웨딩 커플 굿즈",
          "캐릭터 굿즈",
          "아이돌 / 팬굿즈",
          "스포츠 선수 굿즈",
          "단체 행사 기념품",
          "학교·동호회 굿즈",
          "가족, 연인 굿즈",
          "반려동물 굿즈",
          "냉장고 부착 마그네틱",
        ],
      },
    ],
  },
  {
    num: "03",
    label: "Lineup 3",
    heading: "레이저 각인 & 폰케이스",
    subs: [
      {
        icon: Zap,
        title: "레이저 각인",
        desc: "레이저 각인은 단순한 인쇄가 아닌 오래 남는 특별한 기록입니다. 원하는 문구·로고·사진·그림 등을 활용해 다양한 굿즈를 맞춤 제작합니다.",
        gradient: "from-amber-300 via-orange-300 to-rose-400",
        items: [
          "반려동물 인식표 (이름 및 전화번호)",
          "QR 코드 각인",
          "주방용 식도 이름 각인 (프로페셔널 쉐프 느낌)",
          "선명하고 정교한 디테일",
          "쉽게 지워지지 않는 높은 내구성",
          "소량 제작 가능 · 이름·문구·로고 맞춤",
          "감성적인 디자인 커스터마이징",
          "반려동물·커플·가족 기념 제작 가능",
        ],
      },
      {
        icon: Smartphone,
        title: "폰케이스",
        desc: "좋아하는 사진과 추억을 담아 세상에 하나뿐인 나만의 폰 케이스 제작",
        gradient: "from-fuchsia-400 via-purple-300 to-rose-400",
        items: [
          "가족사진",
          "아이 사진",
          "커플사진",
          "반려동물 사진",
          "여행 추억 사진",
          "삼성 갤럭시 · 아이폰 모두 가능",
        ],
      },
    ],
  },
];

export default function ProductLineupSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="lineup"
      ref={sectionRef}
      className="py-24 lg:py-32 bg-white relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-rose-100/40 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-fuchsia-100/40 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div
          className={`text-center mb-16 lg:mb-20 transition-all duration-1000 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <p className="text-rose-500 text-sm font-semibold tracking-[0.3em] uppercase mb-4">
            Product Lineup
          </p>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-800 leading-tight mb-5">
            마이리즈 <span className="text-gradient">제품 라인업</span>
          </h2>
          <p className="text-slate-500 text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
            3D 피규어부터 굿즈, 레이저 각인까지 — 소중한 순간을 담는 모든 형태의 제품을 만들어드립니다.
          </p>
        </div>

        {/* Lineups */}
        <div className="space-y-16 lg:space-y-20">
          {lineups.map((lineup, lIdx) => (
            <div
              key={lineup.num}
              className={`transition-all duration-1000 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${lIdx * 150}ms` }}
            >
              {/* Lineup Header */}
              <div className="flex items-center gap-5 mb-8">
                <div className="flex items-center justify-center w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-fuchsia-500 text-white font-black text-xl lg:text-2xl shadow-lg shadow-rose-200">
                  {lineup.num}
                </div>
                <div>
                  <p className="text-rose-400 text-xs font-bold tracking-[0.3em] uppercase mb-1">
                    {lineup.label}
                  </p>
                  <h3 className="text-2xl lg:text-3xl font-black text-slate-800">
                    {lineup.heading}
                  </h3>
                </div>
              </div>

              {/* Sub-cards */}
              <div className="grid lg:grid-cols-2 gap-5 lg:gap-6">
                {lineup.subs.map((sub) => {
                  const Icon = sub.icon;
                  return (
                    <div
                      key={sub.title}
                      className="group relative bg-white rounded-2xl border border-rose-100 overflow-hidden hover:shadow-xl hover:shadow-rose-200/40 hover:border-rose-300 transition-all duration-500 flex flex-col"
                    >
                      {/* Hero image / gradient */}
                      <div
                        className={`relative aspect-[16/9] overflow-hidden bg-gradient-to-br ${sub.gradient}`}
                      >
                        {sub.image ? (
                          <img
                            src={sub.image}
                            alt={sub.title}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <>
                            <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_30%,white_0,transparent_45%),radial-gradient(circle_at_80%_70%,white_0,transparent_45%)]" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="flex flex-col items-center gap-3 text-white">
                                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg group-hover:scale-110 transition-transform duration-500">
                                  <Icon size={36} strokeWidth={1.8} />
                                </div>
                                <span className="text-xs font-semibold tracking-[0.3em] uppercase drop-shadow-sm">
                                  {sub.title}
                                </span>
                              </div>
                            </div>
                          </>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                      </div>

                      {/* Body */}
                      <div className="p-6 lg:p-7 flex-1 flex flex-col">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-rose-50 text-rose-500 group-hover:bg-gradient-to-br group-hover:from-rose-500 group-hover:to-fuchsia-500 group-hover:text-white transition-all duration-300">
                            <Icon size={20} strokeWidth={2} />
                          </div>
                          <h4 className="text-lg lg:text-xl font-bold text-slate-800">
                            {sub.title}
                          </h4>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed mb-5">
                          {sub.desc}
                        </p>
                        <ul className="space-y-2">
                          {sub.items.map((item) => (
                            <li
                              key={item}
                              className="flex items-start gap-2.5 text-slate-600 text-sm"
                            >
                              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                              <span className="leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                        {sub.notice && (
                          <p className="mt-5 pt-4 border-t border-rose-100 text-rose-500 text-xs leading-relaxed">
                            ※ {sub.notice}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

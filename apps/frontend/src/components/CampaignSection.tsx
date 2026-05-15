"use client";

import { useEffect, useRef, useState } from "react";
import { ScanLine, Layers, Printer, Sparkles } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: ScanLine,
    title: "스캔",
    desc: "최첨단 고성능 3D 스캐너로 빠르고 정밀하게 촬영합니다. 자연스러운 포즈 연출은 물론 의상과 소품까지 그대로 담아냅니다.",
    detail: ["고성능 3D 스캐너 촬영", "빠르고 정밀한 데이터 수집", "자연스러운 포즈 연출", "의상 및 소품 표현 가능"],
    color: "rose",
    duration: "당일 촬영",
  },
  {
    step: "02",
    icon: Layers,
    title: "3D 렌더링 · 보정",
    desc: "스캔한 데이터를 기반으로 전문 프로그램을 활용해 3D 모델링과 디테일 보정을 진행합니다. 피부 표현, 의상 주름, 헤어스타일, 컬러 등을 다듬어 보다 자연스럽고 완성도 높은 피규어 데이터로 제작합니다.",
    detail: ["얼굴 및 표정 디테일 수정", "색감 및 질감 보정", "출력용 데이터 최적화", "피규어 비율 및 안정성 조정"],
    color: "fuchsia",
    duration: "3~5일",
  },
  {
    step: "03",
    icon: Printer,
    title: "프린팅",
    desc: "완성된 3D 데이터를 고해상도 3D 프린터로 출력합니다. 섬세한 표현이 가능한 장비를 사용하여 작은 디테일까지 정교하게 구현하며 실제 인물의 분위기를 최대한 살려 제작합니다.",
    detail: ["고해상도 출력", "세밀한 컬러 표현", "다양한 사이즈 제작 가능", "안정감 있는 출력 구조 설계"],
    color: "rose",
    duration: "5~7일",
  },
  {
    step: "04",
    icon: Sparkles,
    title: "마감",
    desc: "출력된 피규어는 전문 후가공 과정을 거쳐 최종 완성됩니다. 서포트 제거, 표면 정리, 컬러 보정, 코팅 작업 등을 통해 더욱 자연스럽고 고급스러운 결과물을 완성합니다.",
    detail: ["표면 정리 및 샌딩", "컬러 디테일 보정", "보호 코팅 작업", "최종 품질 검수"],
    color: "fuchsia",
    duration: "2~3일",
  },
];

export default function CampaignSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const t = setInterval(() => setActiveStep((p) => (p + 1) % steps.length), 3000);
    return () => clearInterval(t);
  }, [visible]);

  return (
    <section id="process" ref={sectionRef} className="py-24 lg:py-32 bg-white relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full bg-fuchsia-200/15 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <p className="text-rose-500 text-sm font-semibold tracking-[0.3em] uppercase mb-4">
            How We Make It
          </p>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-800 mb-6">
            제작 과정
            <br />
            <span className="text-gradient">4단계로 완성됩니다</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            상담부터 배송까지 평균 3~4주. 모든 단계에서 진행 상황을 실시간으로 공유해드립니다.
          </p>
        </div>

        {/* Steps */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Step list */}
          <div className={`space-y-4 transition-all duration-1000 delay-200 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}>
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isActive = activeStep === i;
              const isRose = step.color === "rose";
              return (
                <button
                  key={step.step}
                  onClick={() => setActiveStep(i)}
                  className={`w-full text-left rounded-2xl p-5 transition-all duration-500 ${
                    isActive
                      ? isRose
                        ? "bg-white neon-border-cyan shadow-lg shadow-rose-100"
                        : "bg-white neon-border-violet shadow-lg shadow-fuchsia-100"
                      : "bg-white border border-rose-100 hover:border-rose-200"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isActive
                        ? `bg-gradient-to-br ${isRose ? "from-rose-400 to-rose-500" : "from-fuchsia-400 to-fuchsia-600"}`
                        : "bg-rose-50"
                    }`}>
                      <Icon size={20} className={isActive ? "text-white" : "text-slate-400"} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`text-xs font-bold tracking-widest ${isActive ? (isRose ? "text-rose-500" : "text-fuchsia-500") : "text-slate-300"}`}>
                          STEP {step.step}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? "bg-rose-100 text-rose-600" : "bg-slate-50 text-slate-300"}`}>
                          {step.duration}
                        </span>
                      </div>
                      <h3 className={`font-bold text-base mb-1 transition-colors ${isActive ? "text-slate-800" : "text-slate-400"}`}>
                        {step.title}
                      </h3>
                      {isActive && (
                        <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                      )}
                    </div>
                  </div>

                  {/* Progress bar */}
                  {isActive && (
                    <div className="mt-4 h-px bg-rose-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${isRose ? "from-rose-400 to-rose-500" : "from-fuchsia-400 to-fuchsia-600"} transition-all duration-[3000ms]`}
                        style={{ width: "100%" }}
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Detail panel */}
          <div className={`transition-all duration-1000 delay-400 ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}>
            {(() => {
              const step = steps[activeStep];
              const Icon = step.icon;
              const isRose = step.color === "rose";
              return (
                <div className={`bg-white rounded-3xl p-8 ${isRose ? "neon-border-cyan shadow-xl shadow-rose-100" : "neon-border-violet shadow-xl shadow-fuchsia-100"} transition-all duration-500`}>
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${isRose ? "from-rose-400 to-rose-500" : "from-fuchsia-400 to-fuchsia-600"} flex items-center justify-center shadow-lg`}>
                      <Icon size={30} className="text-white" />
                    </div>
                    <div>
                      <p className={`text-xs font-bold tracking-widest ${isRose ? "text-rose-500" : "text-fuchsia-500"}`}>
                        STEP {step.step}
                      </p>
                      <h3 className="text-2xl font-black text-slate-800">{step.title}</h3>
                    </div>
                  </div>

                  <p className="text-slate-500 leading-relaxed mb-6">{step.desc}</p>

                  {/* Checklist */}
                  <div className="space-y-3">
                    {step.detail.map((d) => (
                      <div key={d} className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border ${isRose ? "border-rose-300 bg-rose-50" : "border-fuchsia-300 bg-fuchsia-50"} flex items-center justify-center shrink-0`}>
                          <div className={`w-2 h-2 rounded-full ${isRose ? "bg-rose-400" : "bg-fuchsia-400"}`} />
                        </div>
                        <span className="text-slate-600 text-sm">{d}</span>
                      </div>
                    ))}
                  </div>

                  {/* Image */}
                  <div className="mt-6 rounded-xl overflow-hidden aspect-video relative">
                    <img
                      src={`https://picsum.photos/seed/process-${activeStep + 1}/640/360`}
                      alt={step.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-rose-100/30 to-transparent" />
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </section>
  );
}

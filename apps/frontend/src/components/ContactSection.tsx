"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertCircle, Loader2, MessageCircle, Timer } from "lucide-react";

// ▼ 백엔드 API 주소 (배포 시 NEXT_PUBLIC_API_URL 환경변수로 변경)
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", type: "", size: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      // ▼ POST /api/contact — 문의 내용 전송
      const res = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setForm({ name: "", email: "", type: "", size: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const info = [
    { icon: Phone, label: "전화", value: "(031) 894-5773" },
    { icon: Mail, label: "이메일", value: "3dmyliz@naver.com" },
    { icon: MapPin, label: "주소", value: "경기도 의정부시 오목로 205번길 21 골든플라자 123호" },
    { icon: Clock, label: "영업시간", value: "11:00 – 19:00 (정기 휴무 없음)" },
  ];

  const productionTimes = [
    { label: "피규어", value: "2주" },
    { label: "아크릴 키링 · 스탠드", value: "3일" },
    { label: "메탈 키링 · 뱃지 · 마그네틱", value: "즉석 제작" },
    { label: "폰케이스", value: "30분" },
    { label: "레이저 각인", value: "즉석 제작" },
  ];

  const inputClass = "w-full px-4 py-3 bg-white border border-rose-200 rounded-xl text-slate-800 placeholder-rose-300 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all text-sm";

  return (
    <section id="contact" ref={sectionRef} className="py-24 lg:py-32 bg-white relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-rose-100/40 blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <p className="text-rose-500 text-sm font-semibold tracking-[0.3em] uppercase mb-4">Contact</p>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-800 mb-6">
            커스텀 주문{" "}
            <span className="text-gradient">문의하기</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            어떤 피규어를 원하시든 상담부터 시작하세요. 친절하게 안내해드립니다.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Info */}
          <div className={`space-y-6 transition-all duration-1000 delay-200 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}>
            {/* 연락처 정보 카드 */}
            <div className="bg-rose-50 border border-rose-100 rounded-3xl p-8 lg:p-10">
              <h3 className="text-xl font-black text-slate-800 mb-8">연락처 정보</h3>

              <div className="space-y-5 mb-8">
                {info.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-fuchsia-500 flex items-center justify-center shrink-0 mt-0.5 shadow-sm shadow-rose-200">
                        <Icon size={16} className="text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-slate-400 text-xs mb-0.5">{item.label}</p>
                        <p className="text-slate-800 font-medium text-sm break-keep">{item.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 카카오톡 채널 + QR */}
              <div className="bg-white border border-rose-200 rounded-2xl p-5 mb-6">
                <div className="flex items-center gap-4">
                  <a
                    href="https://pf.kakao.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#FEE500] text-[#3C1E1E] font-bold text-sm shadow-sm hover:brightness-95 transition-all shrink-0"
                  >
                    <MessageCircle size={18} fill="#3C1E1E" />
                    <span>카카오톡 상담</span>
                  </a>
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src="/kakao-qr.png"
                      alt="카카오톡 QR"
                      className="w-16 h-16 rounded-lg border border-rose-200 object-cover bg-white"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                    />
                    <p className="text-slate-400 text-xs leading-relaxed">
                      QR을 스캔하면<br />바로 상담 가능합니다
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-rose-200">
                <p className="text-slate-500 text-sm leading-relaxed mb-4">
                  상담은 무료입니다. 부담 없이 문의주세요!
                  사진이나 참고 이미지를 함께 보내주시면 더욱 정확한 견적을 드릴 수 있어요.
                </p>
                <div className="flex gap-3">
                  {[
                    { label: "견적 회신", value: "24시간 내" },
                    { label: "제작 기간", value: "30분 ~ 2주" },
                  ].map((t) => (
                    <div key={t.label} className="flex-1 bg-white border border-rose-200 rounded-xl p-3 text-center shadow-sm">
                      <p className="text-gradient font-black text-lg">{t.value}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{t.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Form */}
          <div className={`transition-all duration-1000 delay-300 ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}>
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center h-full gap-5 text-center py-20 bg-rose-50 border border-rose-100 rounded-3xl p-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-rose-200">
                  <CheckCircle size={30} className="text-white" />
                </div>
                <h3 className="text-2xl font-black text-slate-800">문의 완료!</h3>
                <p className="text-slate-500">24시간 내에 연락드리겠습니다.</p>
                <button
                  onClick={() => setStatus("idle")}
                  className="text-rose-400 text-sm underline underline-offset-4 hover:text-rose-600 transition-colors"
                >
                  다시 문의하기
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white border border-rose-100 rounded-3xl p-8 space-y-5 shadow-sm">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-2 tracking-wider uppercase">이름 *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="홍길동"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-2 tracking-wider uppercase">이메일 *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="example@email.com"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-2 tracking-wider uppercase">주문 유형</label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                      className={inputClass}
                    >
                      <option value="" className="bg-white">선택해주세요</option>
                      <option value="fullbody" className="bg-white">3D 피규어</option>
                      <option value="wedding" className="bg-white">웨딩 / 커플 피규어</option>
                      <option value="fullbody-photo" className="bg-white">전신 (사진 제작)</option>
                      <option value="bust-photo" className="bg-white">흉상 (사진 제작)</option>
                      <option value="phone-case" className="bg-white">커스텀 폰케이스</option>
                      <option value="acrylic-keyring" className="bg-white">아크릴 키링</option>
                      <option value="acrylic-stand" className="bg-white">아크릴 스탠드 (등신대)</option>
                      <option value="metal-round-keyring" className="bg-white">메탈 원형 키링</option>
                      <option value="metal-round-badge" className="bg-white">메탈 원형 뱃지</option>
                      <option value="metal-round-magnet" className="bg-white">메탈 원형 마그넷</option>
                      <option value="metal-square-magnet" className="bg-white">메탈 사각 마그넷</option>
                      <option value="laser-engraving" className="bg-white">레이저 각인</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-2 tracking-wider uppercase">사이즈 / 옵션</label>
                    <select
                      value={form.size}
                      onChange={(e) => setForm({ ...form, size: e.target.value })}
                      className={inputClass}
                    >
                      <option value="" className="bg-white">사이즈 선택</option>
                      <option value="9" className="bg-white">피규어 9cm</option>
                      <option value="12" className="bg-white">피규어 12cm</option>
                      <option value="15" className="bg-white">피규어 15cm</option>
                      <option value="18" className="bg-white">피규어 18cm</option>
                      <option value="20" className="bg-white">피규어 20cm</option>
                      <option value="small" className="bg-white">아크릴 키링 (소)</option>
                      <option value="medium" className="bg-white">아크릴 키링 (중)</option>
                      <option value="large" className="bg-white">아크릴 키링 (대)</option>
                      <option value="a-small" className="bg-white">아크릴 스탠드 (소)</option>
                      <option value="a-medium" className="bg-white">아크릴 스탠드 (중)</option>
                      <option value="a-large" className="bg-white">아크릴 스탠드 (대)</option>
                      <option value="none" className="bg-white">선택사항 없음</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2 tracking-wider uppercase">문의 내용 *</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="원하시는 피규어 스타일, 참고 이미지, 납기일 등을 알려주세요..."
                    className={`${inputClass} resize-none`}
                  />
                </div>

                {status === "error" && (
                  <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                    <AlertCircle size={15} className="shrink-0" />
                    <span>전송에 실패했습니다. 잠시 후 다시 시도해주세요.</span>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? (
                    <><Loader2 size={16} className="animate-spin" /><span>전송 중...</span></>
                  ) : (
                    <><Send size={16} /><span>문의 보내기</span></>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* 제작 기간 카드 (풀폭) */}
        <div className={`mt-10 lg:mt-16 transition-all duration-1000 delay-400 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="bg-white border border-rose-100 rounded-3xl p-10 lg:p-12 shadow-sm">
            <div className="flex items-center gap-5 mb-10">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-rose-400 to-fuchsia-500 flex items-center justify-center shadow-md shadow-rose-200">
                <Timer size={32} className="text-white" />
              </div>
              <h3 className="text-3xl font-black text-slate-800">제작 기간</h3>
            </div>
            <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {productionTimes.map((p) => (
                <li key={p.label} className="flex flex-col items-center justify-center gap-3 bg-rose-50 border border-rose-100 rounded-2xl py-8 px-4 text-center">
                  <span className="text-slate-600 text-sm break-keep">{p.label}</span>
                  <span className="text-rose-500 font-black text-2xl">{p.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

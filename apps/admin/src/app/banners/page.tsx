"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Save, ExternalLink, AlertTriangle, ChevronUp, ChevronDown, Image } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

const API = process.env.NEXT_PUBLIC_API_URL ?? "";

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  href: string;
  order: number;
}

const empty: Omit<Banner, "id" | "order"> = { title: "", subtitle: "", image: "", href: "" };

function Modal({
  banner,
  onClose,
  onSave,
}: {
  banner: Partial<Banner> | null;
  onClose: () => void;
  onSave: (data: Omit<Banner, "id" | "order">) => void;
}) {
  const [form, setForm] = useState<Omit<Banner, "id" | "order">>(
    banner ? { title: banner.title ?? "", subtitle: banner.subtitle ?? "", image: banner.image ?? "", href: banner.href ?? "" } : { ...empty }
  );

  if (!banner) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(7,7,15,0.85)" }}>
      <div className="w-full max-w-2xl glass-card rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="text-white font-black text-base">{"id" in banner && banner.id ? "배너 수정" : "새 배너"}</h2>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors"><X size={18} /></button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-white/40 text-xs uppercase tracking-wider mb-1.5">배너 이미지</label>
            <ImageUpload value={form.image} onChange={(url) => setForm({ ...form, image: url })} aspect="aspect-video" />
          </div>
          <div>
            <label className="block text-white/40 text-xs uppercase tracking-wider mb-1.5">제목 (줄바꿈 가능)</label>
            <textarea
              rows={2}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder={"세상에 하나뿐인\n나만의 피규어"}
              className="resize-none"
            />
          </div>
          <div>
            <label className="block text-white/40 text-xs uppercase tracking-wider mb-1.5">부제목</label>
            <input
              type="text"
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              placeholder="3D 스캔부터 수작업 도색까지..."
            />
          </div>
          <div>
            <label className="block text-white/40 text-xs uppercase tracking-wider mb-1.5">링크 (버튼 클릭 시 이동)</label>
            <input
              type="text"
              value={form.href}
              onChange={(e) => setForm({ ...form, href: e.target.value })}
              placeholder="#contact"
            />
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-white/5">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all text-sm font-medium">취소</button>
          <button
            onClick={() => onSave(form)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Save size={14} /> 저장
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirm({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(7,7,15,0.85)" }}>
      <div className="glass-card rounded-2xl p-6 max-w-sm w-full text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto">
          <AlertTriangle size={20} className="text-red-400" />
        </div>
        <h3 className="text-white font-black">배너를 삭제할까요?</h3>
        <p className="text-white/40 text-sm">삭제 후 복구할 수 없습니다.</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white transition-all text-sm">취소</button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 transition-all text-sm font-semibold">삭제</button>
        </div>
      </div>
    </div>
  );
}

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState<Partial<Banner> | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch(`${API}/api/banners`);
      setBanners(await r.json());
      setError("");
    } catch { setError("백엔드 서버에 연결할 수 없습니다."); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function handleSave(data: Omit<Banner, "id" | "order">) {
    if ("id" in (modal ?? {}) && (modal as Banner).id) {
      await fetch(`${API}/api/banners/${(modal as Banner).id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    } else {
      await fetch(`${API}/api/banners`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    }
    setModal(null);
    load();
  }

  async function handleDelete(id: number) {
    await fetch(`${API}/api/banners/${id}`, { method: "DELETE" });
    setDeleteId(null);
    load();
  }

  async function move(banner: Banner, dir: -1 | 1) {
    const sorted = [...banners].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((b) => b.id === banner.id);
    const target = sorted[idx + dir];
    if (!target) return;
    const ids = sorted.map((b) => b.id);
    [ids[idx], ids[idx + dir]] = [ids[idx + dir], ids[idx]];
    await fetch(`${API}/api/banners/reorder`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids }) });
    load();
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white font-black text-2xl">배너 관리</h1>
          <p className="text-white/30 text-sm mt-1">홈페이지 메인 슬라이더 배너를 관리합니다 (최대 5개 권장)</p>
        </div>
        <button
          onClick={() => setModal({})}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          <Plus size={16} /> 배너 추가
        </button>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
          <AlertTriangle size={14} /> {error}
          <button onClick={load} className="ml-auto underline text-xs">재시도</button>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass-card rounded-2xl h-32 animate-pulse" />
          ))}
        </div>
      ) : banners.length === 0 ? (
        <div className="text-center py-24 text-white/20">
          <Image size={40} className="mx-auto mb-4 opacity-30" />
          <p className="font-semibold">등록된 배너가 없습니다</p>
          <p className="text-sm mt-1">배너 추가 버튼을 눌러 시작하세요</p>
        </div>
      ) : (
        <div className="space-y-4">
          {[...banners].sort((a, b) => a.order - b.order).map((banner, idx, arr) => (
            <div key={banner.id} className="glass-card rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-colors">
              <div className="flex items-stretch">
                {/* Thumbnail */}
                <div className="relative w-48 shrink-0 aspect-video overflow-hidden bg-white/5">
                  {banner.image ? (
                    <>
                      <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20">
                      <Image size={24} />
                    </div>
                  )}
                  {/* Order badge */}
                  <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white text-xs font-black">
                    {idx + 1}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 px-5 py-4 min-w-0">
                  <p className="text-white font-bold text-sm leading-tight whitespace-pre-line line-clamp-2">{banner.title || "제목 없음"}</p>
                  <p className="text-white/40 text-xs mt-1 line-clamp-1">{banner.subtitle}</p>
                  {banner.href && (
                    <div className="flex items-center gap-1 mt-2">
                      <ExternalLink size={10} className="text-cyan-400" />
                      <span className="text-cyan-400 text-xs">{banner.href}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col items-center justify-center gap-1 px-3 border-l border-white/5">
                  <button onClick={() => move(banner, -1)} disabled={idx === 0} className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/5 disabled:opacity-20 disabled:cursor-not-allowed transition-all">
                    <ChevronUp size={16} />
                  </button>
                  <button onClick={() => move(banner, 1)} disabled={idx === arr.length - 1} className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/5 disabled:opacity-20 disabled:cursor-not-allowed transition-all">
                    <ChevronDown size={16} />
                  </button>
                </div>
                <div className="flex flex-col items-center justify-center gap-1 px-3 border-l border-white/5">
                  <button onClick={() => setModal(banner)} className="p-1.5 rounded-lg text-white/30 hover:text-cyan-400 hover:bg-cyan-400/5 transition-all">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => setDeleteId(banner.id)} className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/5 transition-all">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal !== null && <Modal banner={modal} onClose={() => setModal(null)} onSave={handleSave} />}
      {deleteId !== null && <DeleteConfirm onConfirm={() => handleDelete(deleteId)} onCancel={() => setDeleteId(null)} />}
    </div>
  );
}

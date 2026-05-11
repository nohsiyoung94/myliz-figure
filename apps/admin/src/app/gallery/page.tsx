"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Save, AlertTriangle, ChevronUp, ChevronDown, LayoutGrid } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4001";

function normalize(url: string) {
  if (!url) return "";
  return url.startsWith("/uploads/") ? `${API}${url}` : url;
}

interface GalleryItem {
  id: number;
  title: string;
  image: string;
  size: "tall" | "wide" | "square";
  order: number;
}

const empty: Omit<GalleryItem, "id" | "order"> = { title: "", image: "", size: "square" };

const SIZE_LABELS = { square: "정사각형", wide: "가로형", tall: "세로형" };
const SIZE_DESC = { square: "1×1", wide: "2×1", tall: "1×2" };

function Modal({
  item,
  onClose,
  onSave,
}: {
  item: Partial<GalleryItem> | null;
  onClose: () => void;
  onSave: (data: Omit<GalleryItem, "id" | "order">) => void;
}) {
  const [form, setForm] = useState<Omit<GalleryItem, "id" | "order">>(
    item ? { title: item.title ?? "", image: item.image ?? "", size: item.size ?? "square" } : { ...empty }
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(7,7,15,0.85)" }}>
      <div className="w-full max-w-2xl glass-card rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="text-white font-black text-base">{"id" in (item ?? {}) && (item as GalleryItem).id ? "작품 수정" : "새 작품 추가"}</h2>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors"><X size={18} /></button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-white/40 text-xs uppercase tracking-wider mb-1.5">이미지</label>
            <ImageUpload value={form.image} onChange={(url) => setForm({ ...form, image: url })} aspect="aspect-video" />
          </div>

          <div>
            <label className="block text-white/40 text-xs uppercase tracking-wider mb-1.5">작품명</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="예) 웨딩 커플 피규어"
            />
          </div>

          <div>
            <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">그리드 크기</label>
            <div className="grid grid-cols-3 gap-3">
              {(["square", "wide", "tall"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm({ ...form, size: s })}
                  className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl border text-xs font-medium transition-all ${
                    form.size === s
                      ? "border-cyan-400 bg-cyan-400/10 text-cyan-400"
                      : "border-white/10 text-white/40 hover:border-white/30 hover:text-white/70"
                  }`}
                >
                  {/* Size preview box */}
                  <div className={`bg-current rounded-sm opacity-60 ${s === "wide" ? "w-8 h-4" : s === "tall" ? "w-4 h-8" : "w-5 h-5"}`} />
                  <span>{SIZE_LABELS[s]}</span>
                  <span className="text-[10px] opacity-60">{SIZE_DESC[s]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-white/5">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all text-sm font-medium">취소</button>
          <button
            onClick={() => { if (!form.image) { alert("이미지를 등록해주세요."); return; } onSave(form); }}
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
        <h3 className="text-white font-black">작품을 삭제할까요?</h3>
        <p className="text-white/40 text-sm">삭제 후 복구할 수 없습니다.</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white transition-all text-sm">취소</button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 transition-all text-sm font-semibold">삭제</button>
        </div>
      </div>
    </div>
  );
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState<Partial<GalleryItem> | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch(`${API}/api/gallery`);
      setItems(await r.json());
      setError("");
    } catch { setError("백엔드 서버에 연결할 수 없습니다."); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function handleSave(data: Omit<GalleryItem, "id" | "order">) {
    if ("id" in (modal ?? {}) && (modal as GalleryItem).id) {
      await fetch(`${API}/api/gallery/${(modal as GalleryItem).id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
      });
    } else {
      await fetch(`${API}/api/gallery`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
      });
    }
    setModal(null);
    load();
  }

  async function handleDelete(id: number) {
    await fetch(`${API}/api/gallery/${id}`, { method: "DELETE" });
    setDeleteId(null);
    load();
  }

  async function move(item: GalleryItem, dir: -1 | 1) {
    const sorted = [...items].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((it) => it.id === item.id);
    const target = sorted[idx + dir];
    if (!target) return;
    const ids = sorted.map((it) => it.id);
    [ids[idx], ids[idx + dir]] = [ids[idx + dir], ids[idx]];
    await fetch(`${API}/api/gallery/reorder`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids }),
    });
    load();
  }

  const sorted = [...items].sort((a, b) => a.order - b.order);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white font-black text-2xl">갤러리 관리</h1>
          <p className="text-white/30 text-sm mt-1">홈페이지 완성 작품 갤러리를 관리합니다</p>
        </div>
        <button
          onClick={() => setModal({})}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          <Plus size={16} /> 작품 추가
        </button>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
          <AlertTriangle size={14} /> {error}
          <button onClick={load} className="ml-auto underline text-xs">재시도</button>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-card rounded-2xl aspect-square animate-pulse" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-24 text-white/20">
          <LayoutGrid size={40} className="mx-auto mb-4 opacity-30" />
          <p className="font-semibold">등록된 작품이 없습니다</p>
          <p className="text-sm mt-1">작품 추가 버튼을 눌러 시작하세요</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((item, idx, arr) => {
            const imgSrc = normalize(item.image);
            return (
              <div key={item.id} className="glass-card rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-stretch">
                  {/* Thumbnail */}
                  <div className="relative w-32 shrink-0 overflow-hidden bg-white/5">
                    {imgSrc ? (
                      <img src={imgSrc} alt={item.title} className="w-full h-full object-cover" style={{ aspectRatio: "1" }} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/20 aspect-square">
                        <LayoutGrid size={20} />
                      </div>
                    )}
                    {/* Order badge */}
                    <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center text-white text-[10px] font-black">
                      {idx + 1}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 px-5 py-4 min-w-0 flex flex-col justify-center">
                    <p className="text-white font-bold text-sm">{item.title || "제목 없음"}</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/40 text-[11px]">
                        {SIZE_LABELS[item.size]}
                      </span>
                      <span className="text-white/20 text-[11px]">{SIZE_DESC[item.size]}</span>
                    </div>
                  </div>

                  {/* Reorder */}
                  <div className="flex flex-col items-center justify-center gap-1 px-3 border-l border-white/5">
                    <button onClick={() => move(item, -1)} disabled={idx === 0} className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/5 disabled:opacity-20 disabled:cursor-not-allowed transition-all">
                      <ChevronUp size={16} />
                    </button>
                    <button onClick={() => move(item, 1)} disabled={idx === arr.length - 1} className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/5 disabled:opacity-20 disabled:cursor-not-allowed transition-all">
                      <ChevronDown size={16} />
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-center justify-center gap-1 px-3 border-l border-white/5">
                    <button onClick={() => setModal(item)} className="p-1.5 rounded-lg text-white/30 hover:text-cyan-400 hover:bg-cyan-400/5 transition-all">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => setDeleteId(item.id)} className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/5 transition-all">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal !== null && <Modal item={modal} onClose={() => setModal(null)} onSave={handleSave} />}
      {deleteId !== null && <DeleteConfirm onConfirm={() => handleDelete(deleteId)} onCancel={() => setDeleteId(null)} />}
    </div>
  );
}

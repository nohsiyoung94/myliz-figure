"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Save, AlertTriangle, ChevronUp, ChevronDown, Package, Star } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4001";

function normalize(url: string) {
  if (!url) return "";
  return url.startsWith("/uploads/") ? `${API}${url}` : url;
}

interface Product {
  id: number;
  name: string;
  desc: string;
  price: string;
  category: string;
  image: string;
  badge: string;
  badgeColor: string;
  rating: number;
  reviews: number;
  order: number;
}

const empty: Omit<Product, "id" | "order"> = {
  name: "", desc: "", price: "", category: "figure",
  image: "", badge: "", badgeColor: "rose", rating: 5.0, reviews: 0,
};

const CATEGORIES = [
  { key: "figure", label: "피규어" },
  { key: "wedding", label: "웨딩/커플" },
  { key: "goods", label: "굿즈" },
];

const BADGE_COLORS = [
  { key: "rose", label: "Rose", cls: "bg-rose-100 border-rose-300 text-rose-600" },
  { key: "fuchsia", label: "Fuchsia", cls: "bg-fuchsia-100 border-fuchsia-300 text-fuchsia-600" },
];

function Modal({
  product,
  onClose,
  onSave,
}: {
  product: Partial<Product> | null;
  onClose: () => void;
  onSave: (data: Omit<Product, "id" | "order">) => void;
}) {
  const [form, setForm] = useState<Omit<Product, "id" | "order">>(
    product ? {
      name: product.name ?? "",
      desc: product.desc ?? "",
      price: product.price ?? "",
      category: product.category ?? "figure",
      image: product.image ?? "",
      badge: product.badge ?? "",
      badgeColor: product.badgeColor ?? "rose",
      rating: product.rating ?? 5.0,
      reviews: product.reviews ?? 0,
    } : { ...empty }
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(7,7,15,0.85)" }}>
      <div className="w-full max-w-2xl glass-card rounded-2xl overflow-hidden max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 shrink-0">
          <h2 className="text-white font-black text-base">{"id" in (product ?? {}) && (product as Product).id ? "제품 수정" : "새 제품 추가"}</h2>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors"><X size={18} /></button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Image */}
          <div>
            <label className="block text-white/40 text-xs uppercase tracking-wider mb-1.5">제품 이미지</label>
            <ImageUpload value={form.image} onChange={(url) => setForm({ ...form, image: url })} aspect="aspect-[4/3]" />
          </div>

          {/* Name + Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-white/40 text-xs uppercase tracking-wider mb-1.5">제품명 *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="예) 커스텀 풀바디 피규어" />
            </div>
            <div>
              <label className="block text-white/40 text-xs uppercase tracking-wider mb-1.5">카테고리</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400/50"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.key} value={c.key} className="bg-[#0d0d1a]">{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Desc */}
          <div>
            <label className="block text-white/40 text-xs uppercase tracking-wider mb-1.5">설명</label>
            <input type="text" value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} placeholder="예) 1/6 스케일 전신 맞춤 제작" />
          </div>

          {/* Price */}
          <div>
            <label className="block text-white/40 text-xs uppercase tracking-wider mb-1.5">가격</label>
            <input type="text" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="예) 180,000원~" />
          </div>

          {/* Badge */}
          <div>
            <label className="block text-white/40 text-xs uppercase tracking-wider mb-1.5">뱃지 (선택)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={form.badge}
                onChange={(e) => setForm({ ...form, badge: e.target.value })}
                placeholder="예) BEST, NEW, 인기 (없으면 비워두세요)"
                className="flex-1"
              />
              {form.badge && (
                <div className="flex gap-1.5 shrink-0">
                  {BADGE_COLORS.map((bc) => (
                    <button
                      key={bc.key}
                      type="button"
                      onClick={() => setForm({ ...form, badgeColor: bc.key })}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${bc.cls} ${form.badgeColor === bc.key ? "ring-2 ring-white/30" : "opacity-50"}`}
                    >
                      {bc.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Rating + Reviews */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-white/40 text-xs uppercase tracking-wider mb-1.5">평점 (0~5)</label>
              <input
                type="number"
                min="0" max="5" step="0.1"
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label className="block text-white/40 text-xs uppercase tracking-wider mb-1.5">리뷰 수</label>
              <input
                type="number"
                min="0"
                value={form.reviews}
                onChange={(e) => setForm({ ...form, reviews: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-white/5 shrink-0">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all text-sm font-medium">취소</button>
          <button
            onClick={() => { if (!form.name.trim()) { alert("제품명을 입력해주세요."); return; } onSave(form); }}
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
        <h3 className="text-white font-black">제품을 삭제할까요?</h3>
        <p className="text-white/40 text-sm">삭제 후 복구할 수 없습니다.</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white transition-all text-sm">취소</button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 transition-all text-sm font-semibold">삭제</button>
        </div>
      </div>
    </div>
  );
}

const CATEGORY_LABEL: Record<string, string> = { figure: "피규어", wedding: "웨딩/커플", goods: "굿즈" };

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState<Partial<Product> | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch(`${API}/api/products`);
      setProducts(await r.json());
      setError("");
    } catch { setError("백엔드 서버에 연결할 수 없습니다."); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function handleSave(data: Omit<Product, "id" | "order">) {
    if ("id" in (modal ?? {}) && (modal as Product).id) {
      await fetch(`${API}/api/products/${(modal as Product).id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
      });
    } else {
      await fetch(`${API}/api/products`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
      });
    }
    setModal(null);
    load();
  }

  async function handleDelete(id: number) {
    await fetch(`${API}/api/products/${id}`, { method: "DELETE" });
    setDeleteId(null);
    load();
  }

  async function move(product: Product, dir: -1 | 1) {
    const sorted = [...products].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((p) => p.id === product.id);
    const target = sorted[idx + dir];
    if (!target) return;
    const ids = sorted.map((p) => p.id);
    [ids[idx], ids[idx + dir]] = [ids[idx + dir], ids[idx]];
    await fetch(`${API}/api/products/reorder`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids }),
    });
    load();
  }

  const sorted = [...products].sort((a, b) => a.order - b.order);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white font-black text-2xl">제품 관리</h1>
          <p className="text-white/30 text-sm mt-1">홈페이지 제품 라인업을 관리합니다</p>
        </div>
        <button
          onClick={() => setModal({})}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          <Plus size={16} /> 제품 추가
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
          {[...Array(4)].map((_, i) => <div key={i} className="glass-card rounded-2xl h-24 animate-pulse" />)}
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-24 text-white/20">
          <Package size={40} className="mx-auto mb-4 opacity-30" />
          <p className="font-semibold">등록된 제품이 없습니다</p>
          <p className="text-sm mt-1">제품 추가 버튼을 눌러 시작하세요</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((product, idx, arr) => {
            const imgSrc = normalize(product.image);
            return (
              <div key={product.id} className="glass-card rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-stretch">
                  {/* Thumbnail */}
                  <div className="relative w-32 shrink-0 overflow-hidden bg-white/5">
                    {imgSrc ? (
                      <img src={imgSrc} alt={product.name} className="w-full h-full object-cover" style={{ aspectRatio: "4/3" }} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/20" style={{ aspectRatio: "4/3" }}>
                        <Package size={20} />
                      </div>
                    )}
                    <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center text-white text-[10px] font-black">
                      {idx + 1}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 px-5 py-3.5 min-w-0 flex flex-col justify-center gap-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-white font-bold text-sm">{product.name}</p>
                      {product.badge && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          product.badgeColor === "fuchsia"
                            ? "bg-fuchsia-500/20 border-fuchsia-400/30 text-fuchsia-300"
                            : "bg-rose-500/20 border-rose-400/30 text-rose-300"
                        }`}>{product.badge}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-cyan-400 text-xs font-semibold">{product.price || "가격 미설정"}</span>
                      <span className="text-white/30 text-xs">{CATEGORY_LABEL[product.category] ?? product.category}</span>
                      {product.rating > 0 && (
                        <span className="flex items-center gap-0.5 text-amber-400 text-xs">
                          <Star size={10} fill="currentColor" /> {product.rating} ({product.reviews})
                        </span>
                      )}
                    </div>
                    {product.desc && <p className="text-white/30 text-xs truncate">{product.desc}</p>}
                  </div>

                  {/* Reorder */}
                  <div className="flex flex-col items-center justify-center gap-1 px-3 border-l border-white/5">
                    <button onClick={() => move(product, -1)} disabled={idx === 0} className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/5 disabled:opacity-20 disabled:cursor-not-allowed transition-all">
                      <ChevronUp size={16} />
                    </button>
                    <button onClick={() => move(product, 1)} disabled={idx === arr.length - 1} className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/5 disabled:opacity-20 disabled:cursor-not-allowed transition-all">
                      <ChevronDown size={16} />
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-center justify-center gap-1 px-3 border-l border-white/5">
                    <button onClick={() => setModal(product)} className="p-1.5 rounded-lg text-white/30 hover:text-cyan-400 hover:bg-cyan-400/5 transition-all">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => setDeleteId(product.id)} className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/5 transition-all">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal !== null && <Modal product={modal} onClose={() => setModal(null)} onSave={handleSave} />}
      {deleteId !== null && <DeleteConfirm onConfirm={() => handleDelete(deleteId)} onCancel={() => setDeleteId(null)} />}
    </div>
  );
}

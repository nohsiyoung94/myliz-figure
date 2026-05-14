"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Save, ChevronUp, ChevronDown, Star } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

const API = process.env.NEXT_PUBLIC_API_URL ?? "";

function normalize(url: string) {
  if (!url) return "";
  return url.startsWith("/uploads/") ? `${API}${url}` : url;
}

interface Review {
  id: number;
  name: string;
  handle: string;
  avatar: string;
  rating: number;
  text: string;
  product: string;
  order: number;
}

const empty: Omit<Review, "id" | "order"> = {
  name: "", handle: "", avatar: "", rating: 5, text: "", product: "",
};

function Modal({
  review,
  onClose,
  onSave,
}: {
  review: Partial<Review> | null;
  onClose: () => void;
  onSave: (data: Omit<Review, "id" | "order">) => void;
}) {
  const [form, setForm] = useState<Omit<Review, "id" | "order">>(
    review
      ? { name: review.name ?? "", handle: review.handle ?? "", avatar: review.avatar ?? "", rating: review.rating ?? 5, text: review.text ?? "", product: review.product ?? "" }
      : { ...empty }
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(7,7,15,0.85)" }}>
      <div className="w-full max-w-lg glass-card rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="text-white font-black text-base">{"id" in (review ?? {}) ? "리뷰 수정" : "리뷰 추가"}</h2>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors"><X size={18} /></button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-white/40 text-xs uppercase tracking-wider mb-1.5">프로필 이미지 (선택)</label>
            <ImageUpload value={form.avatar} onChange={(url) => setForm({ ...form, avatar: url })} aspect="aspect-square" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-white/40 text-xs uppercase tracking-wider mb-1.5">이름 *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="홍길동"
              />
            </div>
            <div>
              <label className="block text-white/40 text-xs uppercase tracking-wider mb-1.5">핸들 (선택)</label>
              <input
                type="text"
                value={form.handle}
                onChange={(e) => setForm({ ...form, handle: e.target.value })}
                placeholder="@username"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-white/40 text-xs uppercase tracking-wider mb-1.5">별점</label>
              <div className="flex gap-1 pt-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setForm({ ...form, rating: n })}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      size={22}
                      className={n <= form.rating ? "text-amber-400 fill-amber-400" : "text-white/20"}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-white/40 text-xs uppercase tracking-wider mb-1.5">제품명 (선택)</label>
              <input
                type="text"
                value={form.product}
                onChange={(e) => setForm({ ...form, product: e.target.value })}
                placeholder="웨딩 커플 피규어"
              />
            </div>
          </div>

          <div>
            <label className="block text-white/40 text-xs uppercase tracking-wider mb-1.5">후기 내용 *</label>
            <textarea
              rows={4}
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
              placeholder="고객 후기를 입력하세요..."
              className="resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-white/5">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all text-sm font-medium">취소</button>
          <button
            onClick={() => {
              if (!form.name || !form.text) return;
              onSave(form);
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white text-sm font-bold hover:opacity-90 transition-opacity"
          >
            <Save size={14} />
            저장
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Partial<Review> | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetch(`${API}/api/reviews`)
      .then((r) => r.json())
      .then(setReviews)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (data: Omit<Review, "id" | "order">) => {
    if ("id" in (modal ?? {}) && (modal as Review).id) {
      const res = await fetch(`${API}/api/reviews/${(modal as Review).id}`, {
        method: "PUT", headers, body: JSON.stringify(data),
      });
      const updated = await res.json();
      setReviews((prev) => prev.map((r) => r.id === updated.id ? updated : r));
    } else {
      const res = await fetch(`${API}/api/reviews`, {
        method: "POST", headers, body: JSON.stringify(data),
      });
      const created = await res.json();
      setReviews((prev) => [...prev, created]);
    }
    setModal(null);
  };

  const handleDelete = async (id: number) => {
    await fetch(`${API}/api/reviews/${id}`, { method: "DELETE", headers });
    setReviews((prev) => prev.filter((r) => r.id !== id));
    setDeleteId(null);
  };

  const move = async (index: number, dir: -1 | 1) => {
    const next = [...reviews];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setReviews(next);
    await fetch(`${API}/api/reviews/reorder`, {
      method: "PATCH", headers, body: JSON.stringify({ ids: next.map((r) => r.id) }),
    });
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white font-black text-xl">리뷰 관리</h1>
          <p className="text-white/30 text-sm mt-0.5">총 {reviews.length}개</p>
        </div>
        <button
          onClick={() => setModal({})}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white text-sm font-bold hover:opacity-90 transition-opacity"
        >
          <Plus size={16} />
          리뷰 추가
        </button>
      </div>

      {loading ? (
        <div className="text-white/30 text-center py-20">불러오는 중...</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20 text-white/20">
          <Star size={40} strokeWidth={1} className="mx-auto mb-3" />
          <p>등록된 리뷰가 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review, i) => (
            <div key={review.id} className="glass-card rounded-2xl px-5 py-4 flex items-center gap-4">
              {/* 순서 */}
              <div className="flex flex-col gap-0.5 shrink-0">
                <button onClick={() => move(i, -1)} disabled={i === 0} className="text-white/20 hover:text-white disabled:opacity-10 transition-colors">
                  <ChevronUp size={16} />
                </button>
                <button onClick={() => move(i, 1)} disabled={i === reviews.length - 1} className="text-white/20 hover:text-white disabled:opacity-10 transition-colors">
                  <ChevronDown size={16} />
                </button>
              </div>

              {/* 아바타 */}
              {review.avatar ? (
                <img src={normalize(review.avatar)} alt={review.name} className="w-10 h-10 rounded-full object-cover border border-white/10 shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/40 font-bold shrink-0">
                  {review.name[0]}
                </div>
              )}

              {/* 정보 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-white font-semibold text-sm">{review.name}</span>
                  {review.handle && <span className="text-white/30 text-xs">{review.handle}</span>}
                  <div className="flex gap-0.5 ml-1">
                    {Array.from({ length: review.rating }).map((_, j) => (
                      <Star key={j} size={11} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                </div>
                {review.product && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-cyan-400/70 mb-1 inline-block">{review.product}</span>
                )}
                <p className="text-white/40 text-xs truncate">{review.text}</p>
              </div>

              {/* 액션 */}
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => setModal(review)}
                  className="p-2 rounded-lg text-white/30 hover:text-cyan-400 hover:bg-white/5 transition-all"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => setDeleteId(review.id)}
                  className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal !== null && (
        <Modal review={modal} onClose={() => setModal(null)} onSave={handleSave} />
      )}

      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(7,7,15,0.85)" }}>
          <div className="glass-card rounded-2xl p-6 w-full max-w-sm text-center">
            <p className="text-white font-bold mb-2">리뷰를 삭제하시겠습니까?</p>
            <p className="text-white/40 text-sm mb-6">이 작업은 되돌릴 수 없습니다.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white transition-all text-sm">취소</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2.5 rounded-xl bg-red-500/80 hover:bg-red-500 text-white text-sm font-bold transition-all">삭제</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

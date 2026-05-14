"use client";

import { useEffect, useState } from "react";
import { Trash2, Mail, MailOpen, Clock, User, MessageSquare } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "";

const TYPE_LABELS: Record<string, string> = {
  fullbody: "커스텀 풀바디 피규어",
  wedding: "웨딩 / 커플 피규어",
  bust: "반신 흉상 피규어",
  topper: "케이크 토퍼",
  keyring: "미니 키링",
  acrylic: "아크릴 굿즈",
  other: "기타",
};

const SIZE_LABELS: Record<string, string> = {
  "1": "1개", "2": "2개", "3-5": "3~5개", "6+": "6개 이상",
};

interface Contact {
  id: number;
  name: string;
  email: string;
  type: string;
  size: string;
  message: string;
  read: boolean;
  created_at: string;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

export default function ContactPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Contact | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetch(`${API}/api/contact`, { headers })
      .then((r) => r.json())
      .then(setContacts)
      .finally(() => setLoading(false));
  }, []);

  const markRead = async (contact: Contact) => {
    if (contact.read) return;
    await fetch(`${API}/api/contact/${contact.id}/read`, { method: "PATCH", headers });
    setContacts((prev) => prev.map((c) => c.id === contact.id ? { ...c, read: true } : c));
    if (selected?.id === contact.id) setSelected({ ...contact, read: true });
  };

  const handleSelect = (contact: Contact) => {
    setSelected(contact);
    markRead(contact);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("삭제하시겠습니까?")) return;
    await fetch(`${API}/api/contact/${id}`, { method: "DELETE", headers });
    setContacts((prev) => prev.filter((c) => c.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const unreadCount = contacts.filter((c) => !c.read).length;

  return (
    <div className="p-8 h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white font-black text-xl">문의 관리</h1>
          <p className="text-white/30 text-sm mt-0.5">
            총 {contacts.length}건
            {unreadCount > 0 && <span className="ml-2 text-cyan-400 font-semibold">미확인 {unreadCount}건</span>}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-white/30">불러오는 중...</div>
      ) : contacts.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-white/20 gap-3">
          <MessageSquare size={40} strokeWidth={1} />
          <p>문의가 없습니다.</p>
        </div>
      ) : (
        <div className="flex-1 flex gap-5 min-h-0">
          {/* List */}
          <div className="w-80 shrink-0 flex flex-col gap-2 overflow-y-auto pr-1">
            {contacts.map((c) => (
              <button
                key={c.id}
                onClick={() => handleSelect(c)}
                className={`w-full text-left glass-card rounded-xl px-4 py-3.5 transition-all border ${
                  selected?.id === c.id
                    ? "border-cyan-500/50 bg-white/8"
                    : "border-white/5 hover:border-white/15"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {c.read
                      ? <MailOpen size={13} className="text-white/25 shrink-0" />
                      : <Mail size={13} className="text-cyan-400 shrink-0" />
                    }
                    <span className={`text-sm font-semibold truncate ${c.read ? "text-white/50" : "text-white"}`}>
                      {c.name}
                    </span>
                  </div>
                  <span className="text-white/20 text-[10px] shrink-0">{formatDate(c.created_at)}</span>
                </div>
                <p className="text-white/35 text-xs truncate pl-[18px]">{c.message}</p>
                {c.type && (
                  <span className="mt-1.5 ml-[18px] inline-block text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-cyan-400/70">
                    {TYPE_LABELS[c.type] ?? c.type}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Detail */}
          <div className="flex-1 min-w-0">
            {selected ? (
              <div className="glass-card rounded-2xl p-6 h-full flex flex-col">
                <div className="flex items-start justify-between mb-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-cyan-400" />
                      <span className="text-white font-bold">{selected.name}</span>
                      {!selected.read && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-semibold">NEW</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-white/40 text-xs">
                      <Mail size={12} />
                      <a href={`mailto:${selected.email}`} className="hover:text-cyan-400 transition-colors">
                        {selected.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-white/30 text-xs">
                      <Clock size={12} />
                      <span>{formatDate(selected.created_at)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(selected.id)}
                    className="p-2 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {selected.type && (
                    <div className="bg-white/4 rounded-xl px-4 py-3">
                      <p className="text-white/30 text-[10px] uppercase tracking-wider mb-1">주문 유형</p>
                      <p className="text-white text-sm font-medium">{TYPE_LABELS[selected.type] ?? selected.type}</p>
                    </div>
                  )}
                  {selected.size && (
                    <div className="bg-white/4 rounded-xl px-4 py-3">
                      <p className="text-white/30 text-[10px] uppercase tracking-wider mb-1">수량</p>
                      <p className="text-white text-sm font-medium">{SIZE_LABELS[selected.size] ?? selected.size}</p>
                    </div>
                  )}
                </div>

                <div className="flex-1 bg-white/4 rounded-xl p-4">
                  <p className="text-white/30 text-[10px] uppercase tracking-wider mb-3">문의 내용</p>
                  <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                </div>

                <div className="mt-4">
                  <a
                    href={`mailto:${selected.email}?subject=마이리즈 문의 답변&body=안녕하세요, ${selected.name}님.%0A%0A문의 주셔서 감사합니다.%0A`}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-all text-sm font-semibold border border-cyan-500/20"
                  >
                    <Mail size={14} />
                    이메일로 답변하기
                  </a>
                </div>
              </div>
            ) : (
              <div className="glass-card rounded-2xl h-full flex items-center justify-center text-white/20 flex-col gap-3">
                <MessageSquare size={36} strokeWidth={1} />
                <p className="text-sm">문의를 선택하세요</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

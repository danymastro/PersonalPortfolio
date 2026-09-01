import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface Message {
  id: string;
  sender: 'user' | 'bot' | 'system';
  text: string;
}

interface AIAssistantTerminalProps {
  onOpenContact: () => void;
}

const CID_KEY = 'danilo_assistant_cid';

/** Tiny offline responder — only used on localhost when the Pages Function isn't served. */
const offlineReply = (query: string, isIt: boolean): string => {
  const q = query.toLowerCase();
  if (/(brand|logo|video|shooting|grafica|pacchetto)/.test(q)) {
    return isIt
      ? '🎬 Danilo gestisce l’intero pacchetto di lancio come referente unico: foto, video, branding e sviluppo web coordinati insieme.'
      : '🎬 Danilo runs the full launch package as your single point of contact: photo, video, branding and web build coordinated together.';
  }
  if (/(mvp|settiman|veloce|lanciare|weeks?|launch)/.test(q)) {
    return isIt
      ? '⚡ Per un MVP funzionante lo standard è 7–14 giorni: architettura pulita, full-stack, deploy in produzione.'
      : '⚡ For a working MVP the standard is 7–14 days: clean architecture, full-stack, production deploy.';
  }
  if (/(prezz|preventiv|budget|costo|pricing|cost)/.test(q)) {
    return isIt
      ? '💼 Prezzo fisso con milestone chiare, niente tariffa oraria a sorpresa.'
      : '💼 Fixed price with clear milestones, no hourly surprises.';
  }
  return isIt
    ? '💡 Danilo può occuparsi del progetto end-to-end, dall’architettura al rilascio. Usa “Parliamone direttamente” per scrivergli.'
    : '💡 Danilo can handle the project end-to-end, from architecture to launch. Use “Talk directly” to reach him.';
};

export const AIAssistantTerminal: React.FC<AIAssistantTerminalProps> = ({ onOpenContact }) => {
  const { language, t } = useLanguage();
  const isIt = language === 'it';
  const a = t.assistant;

  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', sender: 'system', text: a.welcome },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ completed: number; total: number } | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const [briefOpen, setBriefOpen] = useState(false);
  const [briefName, setBriefName] = useState('');
  const [briefEmail, setBriefEmail] = useState('');
  const [briefStatus, setBriefStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const scrollRef = useRef<HTMLDivElement>(null);

  // Restore conversation id across refreshes (transcript itself lives server-side).
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(CID_KEY);
      if (saved) setConversationId(saved);
    } catch {
      /* sessionStorage unavailable — fine */
    }
  }, []);

  // Keep the welcome line in sync with language while the chat is still empty.
  useEffect(() => {
    setMessages((prev) =>
      prev.length === 1 && prev[0].id === 'welcome'
        ? [{ id: 'welcome', sender: 'system', text: a.welcome }]
        : prev
    );
  }, [a.welcome]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isProcessing, briefOpen]);

  const pushMessage = (sender: Message['sender'], text: string) =>
    setMessages((prev) => [...prev, { id: `${Date.now()}-${Math.random()}`, sender, text }]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isProcessing || isComplete) return;

    setInputValue('');
    pushMessage('user', text);
    setIsProcessing(true);

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, message: text, lang: language }),
      });

      if (!res.ok) {
        // Local Vite dev: the Pages Function isn't served — degrade gracefully.
        if (res.status === 404 && window.location.hostname === 'localhost') {
          pushMessage('system', a.offlineNote);
          pushMessage('bot', offlineReply(text, isIt));
          return;
        }
        const data = await res.json().catch(() => ({}));
        pushMessage('system', data.error || a.errorGeneric);
        return;
      }

      const data = (await res.json()) as {
        conversationId: string;
        reply: string;
        progress: { completed: number; total: number };
        isComplete: boolean;
      };

      if (data.conversationId && data.conversationId !== conversationId) {
        setConversationId(data.conversationId);
        try {
          sessionStorage.setItem(CID_KEY, data.conversationId);
        } catch {
          /* ignore */
        }
      }
      pushMessage('bot', data.reply);
      if (data.progress) setProgress(data.progress);
      if (data.isComplete) {
        setIsComplete(true);
        setBriefOpen(true);
        pushMessage('system', a.completeNote);
      }
    } catch {
      if (window.location.hostname === 'localhost') {
        pushMessage('system', a.offlineNote);
        pushMessage('bot', offlineReply(text, isIt));
      } else {
        pushMessage('system', a.errorGeneric);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendBrief = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!conversationId || briefStatus === 'sending') return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(briefEmail.trim())) return;

    setBriefStatus('sending');
    try {
      const res = await fetch('/api/brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          contactEmail: briefEmail.trim(),
          contactName: briefName.trim() || undefined,
        }),
      });
      if (!res.ok && !(res.status === 404 && window.location.hostname === 'localhost')) {
        pushMessage('system', a.briefError);
        setBriefStatus('idle');
        return;
      }
      setBriefStatus('sent');
      setBriefOpen(false);
      pushMessage('system', a.briefSent);
    } catch {
      pushMessage('system', a.briefError);
      setBriefStatus('idle');
    }
  };

  const canRequestQuote =
    !!conversationId && briefStatus !== 'sent' && messages.some((m) => m.sender === 'bot');

  return (
    <div className="w-full bg-[#0F0F0F] border-2 border-white/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col font-mono text-xs sm:text-sm neo-shadow-lg text-slate-200">
      {/* Terminal Titlebar */}
      <div className="bg-[#18181B] px-5 py-3.5 flex items-center justify-between border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#EF4444] border border-black/40 inline-block" />
            <span className="w-3 h-3 rounded-full bg-[#F59E0B] border border-black/40 inline-block" />
            <span className="w-3 h-3 rounded-full bg-[#10B981] border border-black/40 inline-block" />
          </div>
          <span className="ml-2 text-[11px] text-white/50 font-bold tracking-wider truncate">
            danilo-ai-assistant — v3.0
          </span>
        </div>

        <div className="flex items-center gap-2">
          {progress && (
            <span className="hidden sm:inline text-[10px] font-bold text-white/40 tabular-nums">
              {progress.completed}/{progress.total} {a.progressLabel}
            </span>
          )}
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>ONLINE</span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      {progress && (
        <div className="h-1 w-full bg-white/5 shrink-0">
          <div
            className="h-full bg-[#D0FF71] transition-all duration-500"
            style={{ width: `${(progress.completed / progress.total) * 100}%` }}
          />
        </div>
      )}

      {/* Terminal Messages Area */}
      <div
        ref={scrollRef}
        data-lenis-prevent
        className="p-5 sm:p-6 space-y-4 h-[300px] sm:h-[340px] overflow-y-auto overscroll-contain bg-[#09090B] font-mono text-xs sm:text-[13px] leading-relaxed"
      >
        {messages.map((m) => {
          if (m.sender === 'system') {
            return (
              <div key={m.id} className="text-emerald-400 whitespace-pre-wrap">
                {m.text}
              </div>
            );
          }
          if (m.sender === 'user') {
            return (
              <div key={m.id} className="flex items-start gap-2 text-white">
                <span className="text-[#38BDF8] shrink-0">➜</span>
                <span className="text-slate-100 font-semibold whitespace-pre-wrap">{m.text}</span>
              </div>
            );
          }
          return (
            <div
              key={m.id}
              className="text-slate-200 border-l-2 border-[#D0FF71] pl-3 py-1 bg-white/[0.03] rounded-r-lg whitespace-pre-wrap"
            >
              {m.text}
            </div>
          );
        })}

        {isProcessing && (
          <div className="flex items-center gap-2 text-white/40 italic">
            <span className="text-[#38BDF8]">➜</span>
            <span>{a.processing}</span>
          </div>
        )}

        {/* Brief mini-form */}
        {briefOpen && (
          <form
            onSubmit={handleSendBrief}
            className="border-l-2 border-[#FDE047] pl-3 py-2 bg-white/[0.03] rounded-r-lg space-y-2"
          >
            <p className="text-white/70 text-[11px] sm:text-xs">{a.briefIntro}</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={briefName}
                onChange={(e) => setBriefName(e.target.value)}
                placeholder={a.briefNamePlaceholder}
                className="flex-1 bg-[#121214] border border-white/15 rounded-lg px-2.5 py-1.5 text-white text-xs outline-none focus:border-[#D0FF71]"
                autoComplete="name"
              />
              <input
                type="email"
                required
                value={briefEmail}
                onChange={(e) => setBriefEmail(e.target.value)}
                placeholder={a.briefEmailPlaceholder}
                className="flex-1 bg-[#121214] border border-white/15 rounded-lg px-2.5 py-1.5 text-white text-xs outline-none focus:border-[#D0FF71]"
                autoComplete="email"
              />
              <button
                type="submit"
                disabled={briefStatus === 'sending'}
                className="px-3.5 py-1.5 rounded-lg bg-[#D0FF71] text-black font-bold text-xs hover:bg-[#FDE047] disabled:opacity-40 transition-colors cursor-pointer shrink-0"
              >
                {briefStatus === 'sending' ? a.briefSendingBtn : a.briefSendBtn}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Terminal Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 sm:p-4 bg-[#121214] border-t border-white/10 flex items-center gap-2 shrink-0"
      >
        <span className="text-[#D0FF71] font-bold shrink-0">➜</span>
        <span className="text-[#38BDF8] shrink-0">~</span>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isComplete}
          placeholder={a.inputPlaceholder}
          className="flex-1 bg-transparent border-none outline-none text-white text-xs sm:text-sm placeholder-white/30 focus:ring-0 disabled:opacity-40"
          autoComplete="off"
          spellCheck="false"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isProcessing || isComplete}
          aria-label={a.sendBtn}
          className="px-3.5 py-1.5 rounded-xl bg-[#D0FF71] text-black font-bold text-xs flex items-center gap-1.5 hover:bg-[#FDE047] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          <span>{a.sendBtn}</span>
          <Send className="w-3 h-3" />
        </button>
      </form>

      {/* Quick Prompts & CTA Strip */}
      <div className="p-4 bg-[#18181B] border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
        <div className="flex flex-wrap items-center gap-2">
          {!isComplete &&
            a.quickPrompts.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendMessage(p)}
                disabled={isProcessing}
                className="px-2.5 py-1 bg-white/5 hover:bg-white/15 border border-white/10 rounded-lg text-[10px] sm:text-[11px] font-mono text-white/70 hover:text-white transition-colors cursor-pointer text-left truncate max-w-[260px] sm:max-w-none disabled:opacity-40"
              >
                “{p}”
              </button>
            ))}
          {canRequestQuote && !briefOpen && (
            <button
              type="button"
              onClick={() => setBriefOpen(true)}
              className="px-2.5 py-1 bg-[#D0FF71]/15 hover:bg-[#D0FF71]/25 border border-[#D0FF71]/40 rounded-lg text-[10px] sm:text-[11px] font-mono font-bold text-[#D0FF71] transition-colors cursor-pointer"
            >
              {a.requestQuoteBtn}
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onOpenContact}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white text-black font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#D0FF71] transition-colors cursor-pointer shrink-0"
        >
          <span>{a.talkDirectly}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

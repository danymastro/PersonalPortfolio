import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Terminal, Send, ArrowRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface Message {
  id: string;
  sender: 'user' | 'bot' | 'system';
  text: string;
}

interface AIAssistantTerminalProps {
  onOpenContact: () => void;
}

export const AIAssistantTerminal: React.FC<AIAssistantTerminalProps> = ({ onOpenContact }) => {
  const { language } = useLanguage();
  const isIt = language === 'it';

  const defaultWelcome = isIt
    ? '➜  ~  Assistente Danilo AI attivo. Raccontami cosa devi realizzare o scegli un prompt rapido:'
    : '➜  ~  Danilo AI Assistant online. Tell me what you need to build or pick a quick prompt:';

  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'system', text: defaultWelcome },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const quickPrompts = isIt
    ? [
        'Devo lanciare un MVP in 2 settimane',
        'Ho un design Figma pronto da sviluppare',
        'Serve un’app iOS / Android completa',
        'Quali sono le tempistiche e i costi?',
      ]
    : [
        'I need an MVP shipped in 2 weeks',
        'I have a Figma design ready to build',
        'I need a complete iOS / Android app',
        'What are the timelines and pricing?',
      ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isProcessing]);

  const generateAnswer = (query: string): string => {
    const q = query.toLowerCase();

    if (q.includes('mvp') || q.includes('2 settimane') || q.includes('settimane') || q.includes('veloce') || q.includes('lanciare') || q.includes('2 weeks') || q.includes('launch')) {
      return isIt
        ? '⚡ Per un MVP funzionante il mio standard è 7-14 giorni: architettura pulita, sviluppo full-stack, design reattivo e deploy in produzione pronto per i primi utenti reali.'
        : '⚡ For a functioning MVP, my turnaround is 7-14 days: clean architecture, full-stack development, responsive UI, and production deploy ready for real users.';
    }

    if (q.includes('figma') || q.includes('design') || q.includes('grafica') || q.includes('ui') || q.includes('mockup')) {
      return isIt
        ? '🎨 Traduco qualsiasi file Figma in codice web e mobile pixel-perfect, con animazioni fluide, performance al millisecondo e zero distorsioni grafiche.'
        : '🎨 I convert Figma designs into pixel-perfect web and mobile apps, with fluid micro-interactions and top-tier performance.';
    }

    if (q.includes('ios') || q.includes('android') || q.includes('app') || q.includes('mobile') || q.includes('swift')) {
      return isIt
        ? '📱 Sviluppo applicazioni mobile native e cross-platform con backend real-time, notifiche push, autenticazione sicura e rilascio diretto su App Store e Google Play.'
        : '📱 I build native and cross-platform mobile apps with real-time backends, push notifications, auth, and store submission to App Store and Google Play.';
    }

    if (q.includes('cost') || q.includes('prezz') || q.includes('preventiv') || q.includes('budget') || q.includes('temp') || q.includes('pricing') || q.includes('time')) {
      return isIt
        ? '💼 Lavoro a prezzo fisso con deliverable e milestone chiare (nessuna tariffa oraria nascosta). Possiamo definire lo scope e iniziare subito.'
        : '💼 I work on fixed-price deliverables with clear milestones (no open-ended hourly surprises). We can define the scope and get started right away.';
    }

    if (q.includes('vibesout') || q.includes('prodotto') || q.includes('founder') || q.includes('esperienza') || q.includes('chi sei')) {
      return isIt
        ? '🚀 Sono Danilo Mastropaolo, Full-Stack Engineer e founder di VibesOut. Combino product strategy, vibe coding con AI avanzata e codice solido in produzione.'
        : '🚀 I’m Danilo Mastropaolo, Full-Stack Engineer and founder of VibesOut. I combine product strategy, AI-accelerated engineering, and rock-solid code in production.';
    }

    return isIt
      ? '💡 Posso occuparmi del progetto end-to-end: dall’ideazione all’architettura, frontend, backend e rilascio. Clicca su "Parliamone" per pianificare la roadmap.'
      : '💡 I can handle your project end-to-end: from UI/UX and architecture to full-stack implementation and launch. Click "Let\'s talk" to plan the roadmap.';
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue.trim();
    if (!text || isProcessing) return;

    setInputValue('');
    const userMsg: Message = { id: String(Date.now()), sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setIsProcessing(true);

    // Realistic AI processing pause
    setTimeout(() => {
      const reply = generateAnswer(text);
      const botMsg: Message = { id: String(Date.now() + 1), sender: 'bot', text: reply };
      setMessages((prev) => [...prev, botMsg]);
      setIsProcessing(false);
    }, 600);
  };

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
            danilo-ai-assistant — v2.4
          </span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>ONLINE</span>
        </div>
      </div>

      {/* Terminal Messages Area */}
      <div
        ref={scrollRef}
        data-lenis-prevent
        className="p-5 sm:p-6 space-y-4 h-[300px] sm:h-[340px] overflow-y-auto overscroll-contain bg-[#09090B] font-mono text-xs sm:text-[13px] leading-relaxed"
      >
        {messages.map((m) => {
          if (m.sender === 'system') {
            return (
              <div key={m.id} className="text-emerald-400">
                {m.text}
              </div>
            );
          }
          if (m.sender === 'user') {
            return (
              <div key={m.id} className="flex items-start gap-2 text-white">
                <span className="text-[#38BDF8] shrink-0">➜</span>
                <span className="text-slate-100 font-semibold">{m.text}</span>
              </div>
            );
          }
          return (
            <div
              key={m.id}
              className="text-slate-200 border-l-2 border-[#D0FF71] pl-3 py-1 bg-white/[0.03] rounded-r-lg"
            >
              {m.text}
            </div>
          );
        })}

        {isProcessing && (
          <div className="flex items-center gap-2 text-white/40 italic">
            <span className="text-[#38BDF8]">➜</span>
            <span>Danilo AI is formulating response...</span>
          </div>
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
          placeholder={
            isIt
              ? 'Scrivi qui il tuo problema o progetto...'
              : 'Describe your problem or project here...'
          }
          className="flex-1 bg-transparent border-none outline-none text-white text-xs sm:text-sm placeholder-white/30 focus:ring-0"
          autoComplete="off"
          spellCheck="false"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isProcessing}
          aria-label="Send"
          className="px-3.5 py-1.5 rounded-xl bg-[#D0FF71] text-black font-bold text-xs flex items-center gap-1.5 hover:bg-[#FDE047] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          <span>{isIt ? 'Invia' : 'Send'}</span>
          <Send className="w-3 h-3" />
        </button>
      </form>

      {/* Quick Prompts & CTA Strip */}
      <div className="p-4 bg-[#18181B] border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
        <div className="flex flex-wrap items-center gap-2">
          {quickPrompts.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSendMessage(p)}
              className="px-2.5 py-1 bg-white/5 hover:bg-white/15 border border-white/10 rounded-lg text-[10px] sm:text-[11px] font-mono text-white/70 hover:text-white transition-colors cursor-pointer text-left truncate max-w-[260px] sm:max-w-none"
            >
              “{p}”
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onOpenContact}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white text-black font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#D0FF71] transition-colors cursor-pointer shrink-0"
        >
          <span>{isIt ? 'Parliamone direttamente' : 'Talk directly'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

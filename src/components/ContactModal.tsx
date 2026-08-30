import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { useLanguage } from '../i18n/LanguageContext';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const { personal } = PORTFOLIO_DATA;
  const { t } = useLanguage();

  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    if (isOpen) {
      lenis?.stop();
      document.body.style.overflow = 'hidden';
      setSelectedTopics([t.contactModal.topics[0]]);
      setStatus('idle');
    } else {
      lenis?.start();
      document.body.style.overflow = '';
      setName('');
      setEmail('');
      setMessage('');
      setStatus('idle');
    }
    return () => {
      lenis?.start();
      document.body.style.overflow = '';
    };
  }, [isOpen, t]);

  if (!isOpen) return null;

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((item) => item !== topic) : [...prev, topic]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          message,
          topics: selectedTopics,
        }),
      });

      if (!response.ok) {
        // Fallback for local Vite dev testing where /api/contact function might not be proxied
        if (response.status === 404 && window.location.hostname === 'localhost') {
          console.warn('Local dev mode: /api/contact is processed by Cloudflare Pages in production.');
          setStatus('success');
          return;
        }

        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to send message');
      }

      setStatus('success');
    } catch (err: any) {
      console.error('Contact form submission error:', err);
      // In local development, allow demonstrating success if serverless function is not active locally
      if (window.location.hostname === 'localhost') {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage(err.message || t.contactModal.errorDesc);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        data-lenis-prevent
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-xl bg-[#FFFDF5] border-4 border-black rounded-3xl overflow-hidden neo-lg z-10 my-auto"
          data-lenis-prevent
        >
          {/* Header */}
          <div className="p-6 border-b-4 border-black flex items-center justify-between bg-[#FDE047]">
            <div className="space-y-0.5">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-800">
                {t.contactModal.badge}
              </span>
              <h2 className="font-syne font-extrabold text-2xl text-slate-900">
                {t.contactModal.title}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-white border-2 border-black neo-shadow-sm flex items-center justify-center hover:translate-y-0.5 hover:shadow-none transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-10 text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#4ADE80] border-2 border-black neo-shadow-sm flex items-center justify-center mx-auto text-black">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-syne font-bold text-3xl text-slate-900">
                {t.contactModal.successTitle}
              </h3>
              <p className="text-sm font-medium text-slate-600 max-w-sm mx-auto">
                {t.contactModal.successDesc}
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-3 rounded-xl bg-[#2563EB] text-white font-bold text-xs border-2 border-black neo-shadow-sm hover:translate-y-0.5 hover:shadow-none transition-all"
              >
                {t.contactModal.closeBtn}
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 text-left">
              {status === 'error' && (
                <div className="p-4 rounded-xl bg-rose-100 border-2 border-rose-500 text-rose-900 text-xs font-mono font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage || t.contactModal.errorDesc}</span>
                </div>
              )}

              {/* Topic Select */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold uppercase text-slate-700 block">
                  {t.contactModal.topicQuestion}
                </label>
                <div className="flex flex-wrap gap-2">
                  {t.contactModal.topics.map((topic) => {
                    const active = selectedTopics.includes(topic);
                    return (
                      <button
                        type="button"
                        key={topic}
                        onClick={() => toggleTopic(topic)}
                        className={`px-3 py-1.5 rounded-lg border-2 border-black text-xs font-mono font-bold transition-all ${
                          active
                            ? 'bg-[#F9A8D4] text-black neo-shadow-sm'
                            : 'bg-white text-slate-700 hover:bg-stone-100'
                        }`}
                      >
                        {topic}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-slate-600 block">
                    {t.contactModal.nameLabel}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t.contactModal.namePlaceholder}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border-2 border-black focus:bg-[#FFFDF5] text-slate-900 text-sm font-medium outline-none neo-shadow-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-slate-600 block">
                    {t.contactModal.emailLabel}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder={t.contactModal.emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border-2 border-black focus:bg-[#FFFDF5] text-slate-900 text-sm font-medium outline-none neo-shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-slate-600 block">
                  {t.contactModal.messageLabel}
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder={t.contactModal.messagePlaceholder}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white border-2 border-black focus:bg-[#FFFDF5] text-slate-900 text-sm font-medium outline-none neo-shadow-sm resize-none"
                />
              </div>

              {/* Action */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-500">
                  {t.contactModal.directEmail}:{' '}
                  <a href={`mailto:${personal.email}`} className="underline font-bold text-black">
                    {personal.email}
                  </a>
                </span>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-[#2563EB] text-white border-2 border-black font-extrabold text-sm rounded-xl neo-shadow neo-shadow-hover hover:bg-[#FDE047] hover:text-black transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{t.contactModal.sendingBtn}</span>
                    </>
                  ) : (
                    <>
                      <span>{t.contactModal.sendBtn}</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

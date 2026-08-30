import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** Tailwind max-width class for the panel */
  size?: string;
  label: string;
  children: React.ReactNode;
}

/**
 * Shared modal shell.
 * The conditional lives *inside* AnimatePresence so exit animations actually run.
 */
export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  size = 'max-w-3xl',
  label,
  children,
}) => {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto p-4 md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={label}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className={`relative z-10 my-auto w-full ${size} overflow-hidden rounded-card border border-line bg-cream shadow-[0_30px_80px_rgba(26,26,26,0.14)]`}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-cream/90 text-ink backdrop-blur transition-colors duration-300 hover:bg-cream-200"
            >
              <X className="h-4 w-4" />
            </button>

            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

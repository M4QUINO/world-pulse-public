import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BellRing, MessageSquareMore, X } from 'lucide-react';

const NotificationPopup = ({ news, onClose, onOpen }) => {
  return (
    <AnimatePresence>
      {news ? (
        <motion.div
          initial={{ opacity: 0, x: 110, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 110, scale: 0.96 }}
          transition={{ duration: 0.22 }}
          className="fixed bottom-24 right-4 z-[110] w-[min(27rem,calc(100vw-2rem))] sm:bottom-6"
        >
          <div className="overflow-hidden rounded-[1.9rem] border border-white/15 bg-white/90 shadow-[0_24px_70px_rgba(15,23,42,0.24)] backdrop-blur-xl dark:bg-slate-950/88">
            <div className="grid grid-cols-1 sm:grid-cols-[0.9fr_1.1fr]">
              <div className="relative min-h-[9rem] sm:min-h-[10rem]">
                <img
                  src={news.imageUrl}
                  alt={news.title}
                  loading="lazy"
                  decoding="async"
                  onError={(event) => {
                    if (news.fallbackImageUrl && event.currentTarget.src !== news.fallbackImageUrl) {
                      event.currentTarget.src = news.fallbackImageUrl;
                    }
                  }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                  {news.scopeLabel} / {news.categoryLabel}
                </div>
              </div>

              <div className="relative p-4">
                <button
                  onClick={onClose}
                  className="absolute right-3 top-3 rounded-full p-1.5 text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
                  aria-label="Fechar aviso"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">
                  <BellRing className="h-4 w-4" />
                  Nova rodada relevante
                </div>

                <h4 className="mb-2 pr-8 text-base font-semibold leading-tight text-slate-950 dark:text-white">
                  {news.title}
                </h4>
                <p className="mb-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{news.summary}</p>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    onClick={() => onOpen?.(news)}
                    className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 sm:flex-1 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                  >
                    Abrir agora
                  </button>
                  <div className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                    <MessageSquareMore className="h-3.5 w-3.5" />
                    {news.commentCount || 0}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default NotificationPopup;

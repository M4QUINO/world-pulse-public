import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Clock3, ExternalLink, MapPin, PlayCircle, X } from 'lucide-react';
import CommentThread from './CommentThread';

const ArticleModal = ({ article, onClose, onCommentCountChange }) => {
  return (
    <AnimatePresence>
      {article ? (
        <motion.div
          className="fixed inset-0 z-[120] overflow-y-auto bg-slate-950/70 px-4 py-6 backdrop-blur-sm md:px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="mx-auto max-w-7xl rounded-[2rem] border border-white/12 bg-white/92 p-4 shadow-[0_30px_100px_rgba(15,23,42,0.28)] backdrop-blur-xl dark:bg-slate-950/92 sm:rounded-[2.3rem] md:p-6"
            initial={{ opacity: 0, y: 26, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 26, scale: 0.98 }}
            transition={{ duration: 0.22 }}
          >
            <div className="mb-5 flex flex-col-reverse gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-blue-500/12 px-3 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300">
                    {article.scopeLabel}
                  </span>
                  <span className="rounded-full bg-slate-900/6 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-white/8 dark:text-slate-200">
                    {article.categoryLabel}
                  </span>
                  <span className="rounded-full bg-violet-500/12 px-3 py-1 text-xs font-semibold text-violet-700 dark:text-violet-300">
                    {article.commentCount || 0} comentarios
                  </span>
                </div>

                <h3 className="max-w-4xl text-2xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-4xl">
                  {article.title}
                </h3>

                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                  <span className="font-medium text-slate-700 dark:text-slate-100">{article.source}</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {article.location}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock3 className="h-4 w-4" />
                    {article.readingTime} min de leitura
                  </span>
                </div>
              </div>

              <button
                className="rounded-full border border-slate-200/80 p-2 text-slate-600 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
                onClick={onClose}
                aria-label="Fechar noticia"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
              <div className="space-y-6">
                <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
                  <div className="overflow-hidden rounded-[2rem] border border-white/12 bg-slate-950 shadow-[0_18px_55px_rgba(15,23,42,0.18)]">
                    <div className="aspect-[16/10]">
                      <img src={article.imageUrl} alt={article.imageAlt || article.title} className="h-full w-full object-cover" />
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-[2rem] border border-white/12 bg-slate-950 shadow-[0_18px_55px_rgba(15,23,42,0.18)]">
                    <div className="flex items-center gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                      <PlayCircle className="h-4 w-4" />
                      Janela em video
                    </div>
                    <div className="aspect-video">
                      <iframe
                        className="h-full w-full"
                        src={article.videoEmbedUrl}
                        title={`Video de apoio: ${article.title}`}
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-white/12 bg-white/75 p-5 dark:bg-white/5">
                  <div className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                    Resumo editorial
                  </div>
                  <p className="text-base leading-7 text-slate-700 dark:text-slate-200">{article.summary}</p>
                </div>

                <div className="rounded-[2rem] border border-white/12 bg-white/75 p-5 dark:bg-white/5">
                  <div className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                    Leitura completa
                  </div>
                  <div className="space-y-4">
                    {article.content?.map((paragraph, index) => (
                      <p key={`${article.id}-paragraph-${index}`} className="text-sm leading-7 text-slate-600 dark:text-slate-300">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="rounded-[2rem] border border-white/12 bg-slate-950 p-5 text-white shadow-[0_18px_55px_rgba(15,23,42,0.18)] dark:bg-slate-900">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-blue-300">Pergunta da rodada</div>
                  <p className="text-base leading-7 text-slate-200">{article.debatePrompt}</p>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
                  >
                    Abrir fonte original
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>

              <CommentThread article={article} onCommentCountChange={onCommentCountChange} />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default ArticleModal;

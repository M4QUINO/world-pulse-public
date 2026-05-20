import React from 'react';
import { ArrowUpRight, Clock3, ExternalLink, MapPin, MessageSquareMore, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const CATEGORY_CLASSES = {
  economia: 'bg-emerald-500/14 text-emerald-700 dark:text-emerald-300',
  entretenimento: 'bg-pink-500/14 text-pink-700 dark:text-pink-300',
  guerra: 'bg-rose-500/14 text-rose-700 dark:text-rose-300',
  esportes: 'bg-orange-500/14 text-orange-700 dark:text-orange-300',
  tecnologia: 'bg-sky-500/14 text-sky-700 dark:text-sky-300',
  ia: 'bg-indigo-500/14 text-indigo-700 dark:text-indigo-300',
  politica: 'bg-amber-500/14 text-amber-700 dark:text-amber-300',
  servis: 'bg-violet-500/14 text-violet-700 dark:text-violet-300',
};

const NewsCard = ({ item, featured = false, onOpen }) => {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={`group overflow-hidden rounded-[2rem] border border-white/15 bg-white/82 shadow-[0_20px_55px_rgba(15,23,42,0.08)] backdrop-blur-xl transition dark:bg-slate-950/55 ${featured ? 'lg:col-span-2' : ''}`}
    >
      <button type="button" onClick={() => onOpen?.(item)} className="block w-full text-left">
        <div className={`relative overflow-hidden ${featured ? 'aspect-[16/8]' : 'aspect-[16/10]'}`}>
          <img
            src={item.imageUrl}
            alt={item.imageAlt || item.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/15 to-transparent" />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <span className={`rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.14em] ${CATEGORY_CLASSES[item.category] || 'bg-slate-500/14 text-slate-700 dark:text-slate-300'}`}>
              {item.categoryLabel}
            </span>
            <span className="rounded-full bg-black/45 px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-white">
              {item.scopeLabel}
            </span>
          </div>
          <div className="absolute right-4 top-4 rounded-full bg-black/45 p-2 text-white">
            <PlayCircle className="h-4 w-4" />
          </div>
          <div className="absolute inset-x-0 bottom-0 p-4 text-white">
            <div className="mb-2 flex items-center gap-3 text-xs text-slate-200">
              <span className="font-semibold uppercase tracking-[0.18em]">{item.source}</span>
              <span className="inline-flex items-center gap-1">
                <Clock3 className="h-3.5 w-3.5" />
                {new Date(item.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <h3 className={`max-w-3xl font-semibold leading-tight tracking-tight ${featured ? 'text-2xl md:text-[1.75rem]' : 'text-xl'}`}>
              {item.title}
            </h3>
          </div>
        </div>
      </button>

      <div className="flex h-full flex-col gap-4 p-5">
        <p className={`text-slate-600 dark:text-slate-300 ${featured ? 'text-base leading-7' : 'text-sm leading-6'}`}>
          {item.summary}
        </p>

        <div className="rounded-[1.4rem] bg-slate-950/4 px-4 py-3 text-sm leading-6 text-slate-600 dark:bg-white/6 dark:text-slate-300">
          <span className="font-semibold text-slate-900 dark:text-white">Debate:</span> {item.debatePrompt}
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {item.location}
          </span>
          <span className="inline-flex items-center gap-1">
            <MessageSquareMore className="h-3.5 w-3.5" />
            {item.commentCount || 0} comentarios
          </span>
          <span>{item.readingTime} min</span>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200/70 pt-4 dark:border-white/10">
          <button
            type="button"
            onClick={() => onOpen?.(item)}
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            Ler e debater
            <ArrowUpRight className="h-4 w-4" />
          </button>

          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="inline-flex rounded-full border border-slate-200/80 p-2 text-slate-500 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10"
            aria-label={`Abrir fonte de ${item.title}`}
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </motion.article>
  );
};

export default NewsCard;

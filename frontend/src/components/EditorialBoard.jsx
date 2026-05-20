import React from 'react';
import { Clapperboard, Image as ImageIcon, MessagesSquare, Sparkles } from 'lucide-react';

const EditorialBoard = ({ editorial, onOpenArticle }) => {
  if (!editorial) {
    return (
      <section className="mb-10 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="h-[28rem] animate-pulse rounded-[2rem] bg-white/70 dark:bg-white/6" />
        <div className="h-[28rem] animate-pulse rounded-[2rem] bg-white/70 dark:bg-white/6" />
      </section>
    );
  }

  return (
    <section className="mb-12 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[2.2rem] border border-white/15 bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:bg-slate-950/55 md:p-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-700 dark:text-blue-300">
          <Sparkles className="h-4 w-4" />
          {editorial.kicker}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-4xl">
                {editorial.title}
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">{editorial.summary}</p>
            </div>

            <div className="rounded-[1.8rem] border border-white/15 bg-slate-950 p-5 text-white dark:bg-slate-900">
              <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">Voz da redacao</div>
              <p className="text-sm leading-7 text-slate-200">{editorial.manifesto}</p>
              {editorial.hero ? (
                <button
                  type="button"
                  onClick={() => onOpenArticle?.(editorial.hero)}
                  className="mt-4 inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
                >
                  Abrir manchete de abertura
                </button>
              ) : null}
            </div>
          </div>

          <div className="space-y-4">
            <div className="overflow-hidden rounded-[1.9rem] border border-white/15 bg-slate-950 shadow-[0_18px_55px_rgba(15,23,42,0.18)]">
              <div className="flex items-center justify-between px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                <span className="inline-flex items-center gap-2">
                  <Clapperboard className="h-4 w-4" />
                  Resumo em video
                </span>
                <a
                  href={editorial.videoSpotlight?.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-300 transition hover:text-blue-200"
                >
                  Fonte
                </a>
              </div>
              <div className="aspect-video">
                <iframe
                  className="h-full w-full"
                  src={editorial.videoSpotlight?.embedUrl}
                  title={editorial.videoSpotlight?.title || 'Resumo em video'}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="px-4 py-4 text-sm leading-6 text-slate-300">
                {editorial.videoSpotlight?.description}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {editorial.highlights?.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onOpenArticle?.(item)}
              className="rounded-[1.5rem] border border-white/15 bg-white/78 p-4 text-left transition hover:-translate-y-0.5 hover:shadow-lg dark:bg-white/6"
            >
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                {item.scopeLabel}
              </div>
              <div className="text-base font-semibold leading-6 text-slate-950 dark:text-white">{item.title}</div>
              <div className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{item.summary}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-[2.2rem] border border-white/15 bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:bg-slate-950/55 md:p-8">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-violet-700 dark:text-violet-300">
            <ImageIcon className="h-4 w-4" />
            Painel visual
          </div>
          <div className="inline-flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <MessagesSquare className="h-4 w-4" />
            debate alimentado pelas leituras
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {editorial.mediaGallery?.slice(0, 6).map((item, index) => (
            <button
              key={`${item.slug}-${index}`}
              type="button"
              onClick={() => onOpenArticle?.(item)}
              className={`group overflow-hidden rounded-[1.6rem] border border-white/12 bg-slate-950 text-left text-white shadow-[0_18px_50px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:shadow-xl ${index === 0 ? 'sm:col-span-2' : ''}`}
            >
              <div className={`relative ${index === 0 ? 'aspect-[16/8]' : 'aspect-[4/3]'}`}>
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  onError={(event) => {
                    if (item.fallbackImageUrl && event.currentTarget.src !== item.fallbackImageUrl) {
                      event.currentTarget.src = item.fallbackImageUrl;
                    }
                  }}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                    {item.scopeLabel} / {item.categoryLabel}
                  </div>
                  <div className="text-base font-semibold leading-6">{item.title}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EditorialBoard;

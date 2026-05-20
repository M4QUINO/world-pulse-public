import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CalendarDays, Globe2, HeartPulse, Landmark, Sparkles } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL?.trim() || '/api';

const TodayBrief = () => {
  const [brief, setBrief] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    axios
      .get(`${API_BASE}/today`)
      .then((response) => {
        if (isMounted) {
          setBrief(response.data);
          setError('');
        }
      })
      .catch(() => {
        if (isMounted) {
          setError('Nao consegui carregar as datas de hoje agora.');
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!brief && !error) {
    return (
      <section className="mb-12 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="h-80 animate-pulse rounded-[2.2rem] bg-white/70 dark:bg-white/6" />
        <div className="h-80 animate-pulse rounded-[2.2rem] bg-white/70 dark:bg-white/6" />
      </section>
    );
  }

  return (
    <section className="mb-12 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-[2.2rem] border border-white/15 bg-white/82 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:bg-slate-950/55 md:p-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-500/12 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-700 dark:text-amber-300">
          <CalendarDays className="h-4 w-4" />
          Hoje no calendario
        </div>

        <h2 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-4xl">
          Datas comemorativas, memoria e contexto do dia.
        </h2>
        <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          {brief?.dateLabel || 'Atualizando data'}
        </p>
        <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
          Um painel rapido para lembrar o que se comemora no Brasil, no mundo e quais marcos historicos ajudam a
          dar contexto ao noticiario.
        </p>

        {error ? (
          <div className="mt-5 rounded-[1.4rem] border border-amber-400/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
            {error}
          </div>
        ) : null}

        <div className="mt-6 rounded-[1.8rem] border border-white/15 bg-slate-950 p-5 text-white dark:bg-slate-900">
          <div className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-300">
            <Sparkles className="h-4 w-4" />
            Proximas datas importantes
          </div>
          <div className="grid gap-3">
            {(brief?.upcoming || []).map((item) => (
              <div key={`${item.date}-${item.title}`} className="rounded-[1.3rem] bg-white/8 px-4 py-3">
                <div className="text-xs font-black uppercase tracking-[0.18em] text-amber-200">
                  {item.date} / {item.scope}
                </div>
                <div className="mt-1 text-sm leading-6 text-slate-100">{item.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="rounded-[2rem] border border-white/15 bg-white/82 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur-xl dark:bg-slate-950/55">
          <div className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700 dark:text-emerald-300">
            <Landmark className="h-4 w-4" />
            Brasil
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {(brief?.brazil || []).map((item) => (
              <article key={item.title} className="rounded-[1.5rem] border border-white/15 bg-white/75 p-4 dark:bg-white/6">
                <div className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-300">
                  {item.date}
                </div>
                <h3 className="text-base font-semibold leading-6 text-slate-950 dark:text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.summary}</p>
                <p className="mt-3 rounded-[1.1rem] bg-slate-950/5 px-3 py-3 text-sm leading-6 text-slate-600 dark:bg-white/8 dark:text-slate-300">
                  <span className="font-semibold text-slate-950 dark:text-white">Por que existe:</span> {item.why}
                </p>
                <div className="mt-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                  {item.source}
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/15 bg-white/82 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur-xl dark:bg-slate-950/55">
          <div className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-700 dark:text-blue-300">
            <Globe2 className="h-4 w-4" />
            Mundo
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {(brief?.world || []).map((item) => (
              <article key={item.title} className="rounded-[1.5rem] border border-white/15 bg-white/75 p-4 dark:bg-white/6">
                <div className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">
                  {item.date}
                </div>
                <h3 className="text-base font-semibold leading-6 text-slate-950 dark:text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.summary}</p>
                <p className="mt-3 rounded-[1.1rem] bg-slate-950/5 px-3 py-3 text-sm leading-6 text-slate-600 dark:bg-white/8 dark:text-slate-300">
                  <span className="font-semibold text-slate-950 dark:text-white">Por que existe:</span> {item.why}
                </p>
                <div className="mt-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                  {item.source}
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/15 bg-white/82 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur-xl dark:bg-slate-950/55">
          <div className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-rose-700 dark:text-rose-300">
            <HeartPulse className="h-4 w-4" />
            Memoria do dia
          </div>
          <div className="grid gap-3">
            {(brief?.history || []).map((item) => (
              <article key={`${item.year}-${item.title}`} className="rounded-[1.5rem] border border-white/15 bg-white/75 p-4 dark:bg-white/6">
                <div className="text-xs font-black uppercase tracking-[0.18em] text-rose-500">{item.year}</div>
                <h3 className="mt-1 text-base font-semibold leading-6 text-slate-950 dark:text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.summary}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TodayBrief;

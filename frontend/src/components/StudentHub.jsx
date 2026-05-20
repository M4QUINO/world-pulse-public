import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  BookMarked,
  BookOpenText,
  BrainCircuit,
  ExternalLink,
  FileText,
  GraduationCap,
  LibraryBig,
  NotebookPen,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL?.trim() || '/api';

const TYPE_ICONS = {
  academica: FileText,
  livro: LibraryBig,
  autoral: NotebookPen,
};

const StudentHub = () => {
  const [hub, setHub] = useState(null);
  const [results, setResults] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState('');
  const [query, setQuery] = useState('');
  const [type, setType] = useState('todos');
  const [area, setArea] = useState('todas');
  const [level, setLevel] = useState('todos');
  const [loadingHub, setLoadingHub] = useState(true);
  const [loadingResults, setLoadingResults] = useState(true);
  const [error, setError] = useState('');

  const fetchHub = async () => {
    try {
      const response = await axios.get(`${API_BASE}/study/hub`);
      setHub(response.data);
      setError('');
    } catch (requestError) {
      setError('Nao consegui abrir a area do estudante agora.');
    } finally {
      setLoadingHub(false);
    }
  };

  const fetchResults = async (overrides = {}) => {
    setLoadingResults(true);

    try {
      const response = await axios.get(`${API_BASE}/study/search`, {
        params: {
          q: overrides.query ?? query,
          type: overrides.type ?? type,
          area: overrides.area ?? area,
          level: overrides.level ?? level,
          limit: 12,
        },
      });

      const incomingItems = response.data.items || [];
      setResults(incomingItems);
      setSelectedSlug((current) => {
        if (incomingItems.some((item) => item.slug === current)) {
          return current;
        }
        return incomingItems[0]?.slug || '';
      });
      setError('');
    } catch (requestError) {
      setError('A busca academica falhou por agora. Tente novamente em alguns segundos.');
    } finally {
      setLoadingResults(false);
    }
  };

  useEffect(() => {
    fetchHub();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchResults();
    }, 180);

    return () => window.clearTimeout(timer);
  }, [query, type, area, level]);

  const selectedItem = useMemo(() => {
    return results.find((item) => item.slug === selectedSlug) || results[0] || hub?.featured?.[0] || null;
  }, [hub?.featured, results, selectedSlug]);

  if (loadingHub && !hub) {
    return (
      <section className="mb-12 grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="h-[34rem] animate-pulse rounded-[2.2rem] bg-white/70 dark:bg-white/6" />
        <div className="h-[34rem] animate-pulse rounded-[2.2rem] bg-white/70 dark:bg-white/6" />
      </section>
    );
  }

  return (
    <section className="mb-12 grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
      <div className="rounded-[2.2rem] border border-white/15 bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:bg-slate-950/55 md:p-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/12 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-300">
          <GraduationCap className="h-4 w-4" />
          {hub?.title || 'Area do estudante'}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-4xl">
              Buscador de assuntos com trilha academica, livros e texto autoral.
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">
              {hub?.summary}
            </p>
          </div>

          <div className="rounded-[1.9rem] border border-white/15 bg-slate-950 p-5 text-white shadow-[0_20px_60px_rgba(15,23,42,0.18)] dark:bg-slate-900">
            <div className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-300">
              <ShieldCheck className="h-4 w-4" />
              Regra da busca
            </div>
            <p className="text-sm leading-7 text-slate-200">{hub?.guardrail}</p>
            <div className="mt-4 space-y-2">
              {(hub?.sourcePolicy || []).map((item) => (
                <div key={item} className="rounded-[1.3rem] bg-white/8 px-3 py-3 text-sm leading-6 text-slate-200">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[2rem] border border-white/15 bg-white/72 p-4 dark:bg-white/6">
          <div className="flex items-center gap-3 rounded-[1.5rem] border border-white/15 bg-white/80 px-4 py-3 dark:bg-slate-950/40">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Busque por assunto: IA, desigualdade, Machado de Assis, democracia digital..."
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-100"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {(hub?.suggestedQueries || []).map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setQuery(suggestion)}
                className="rounded-full bg-slate-950/6 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-950 hover:text-white dark:bg-white/8 dark:text-slate-300 dark:hover:bg-white dark:hover:text-slate-950"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-4">
          <div>
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Tipo de material
            </div>
            <div className="flex flex-wrap gap-2">
              {(hub?.types || []).map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setType(option.value)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    type === option.value
                      ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950'
                      : 'bg-white/78 text-slate-600 hover:bg-white dark:bg-white/6 dark:text-slate-300 dark:hover:bg-white/10'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Area
              </div>
              <div className="flex flex-wrap gap-2">
                {(hub?.areas || []).map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setArea(option.value)}
                    className={`rounded-full px-3 py-2 text-xs font-medium transition ${
                      area === option.value
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-950/6 text-slate-600 hover:bg-slate-950 hover:text-white dark:bg-white/8 dark:text-slate-300 dark:hover:bg-white dark:hover:text-slate-950'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Nivel
              </div>
              <div className="flex flex-wrap gap-2">
                {(hub?.levels || []).map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setLevel(option.value)}
                    className={`rounded-full px-3 py-2 text-xs font-medium transition ${
                      level === option.value
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-950/6 text-slate-600 hover:bg-slate-950 hover:text-white dark:bg-white/8 dark:text-slate-300 dark:hover:bg-white dark:hover:text-slate-950'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {error ? (
          <div className="mt-5 rounded-[1.4rem] border border-amber-400/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
            {error}
          </div>
        ) : null}

        <div className="mt-6 flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
            <BookOpenText className="h-4 w-4" />
            Resultados curados
          </div>
          <div className="rounded-full bg-slate-950/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:bg-white/8 dark:text-slate-300">
            {loadingResults ? 'Buscando...' : `${results.length} materiais`}
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {loadingResults
            ? Array.from({ length: 4 }).map((_, index) => (
                <div key={`study-skeleton-${index}`} className="h-56 animate-pulse rounded-[1.8rem] bg-white/70 dark:bg-white/6" />
              ))
            : results.map((item) => {
                const Icon = TYPE_ICONS[item.type] || FileText;
                const isActive = selectedItem?.slug === item.slug;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedSlug(item.slug)}
                    className={`rounded-[1.8rem] border p-5 text-left transition ${
                      isActive
                        ? 'border-emerald-500/35 bg-emerald-500/10 shadow-[0_18px_50px_rgba(16,185,129,0.12)]'
                        : 'border-white/15 bg-white/78 hover:-translate-y-0.5 hover:shadow-lg dark:bg-white/6'
                    }`}
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="inline-flex items-center gap-2 rounded-full bg-slate-950/6 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600 dark:bg-white/8 dark:text-slate-300">
                        <Icon className="h-3.5 w-3.5" />
                        {item.typeLabel}
                      </div>
                      <div className="text-xs font-medium text-slate-500 dark:text-slate-400">{item.year}</div>
                    </div>

                    <div className="text-lg font-semibold leading-7 text-slate-950 dark:text-white">{item.title}</div>
                    <div className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                      {(item.authors || []).join(', ')}
                    </div>
                    <div className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.summary}</div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-blue-500/12 px-3 py-1 text-[11px] font-semibold text-blue-700 dark:text-blue-300">
                        {item.sourceName}
                      </span>
                      <span className="rounded-full bg-violet-500/12 px-3 py-1 text-[11px] font-semibold text-violet-700 dark:text-violet-300">
                        {item.areaLabel}
                      </span>
                      <span className="rounded-full bg-amber-500/12 px-3 py-1 text-[11px] font-semibold text-amber-700 dark:text-amber-300">
                        {item.levelLabel}
                      </span>
                    </div>
                  </button>
                );
              })}
        </div>
      </div>

      <aside className="space-y-5 xl:sticky xl:top-28">
        <div className="rounded-[2.2rem] border border-white/15 bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:bg-slate-950/55 md:p-8">
          <div className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700 dark:text-emerald-300">
            <BrainCircuit className="h-4 w-4" />
            Ficha de estudo
          </div>

          {selectedItem ? (
            <div className="space-y-5">
              <div>
                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-emerald-500/12 px-3 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                    {selectedItem.typeLabel}
                  </span>
                  <span className="rounded-full bg-blue-500/12 px-3 py-1 text-[11px] font-semibold text-blue-700 dark:text-blue-300">
                    {selectedItem.sourceTrustLabel}
                  </span>
                </div>

                <h3 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
                  {selectedItem.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
                  {(selectedItem.authors || []).join(', ')} · {selectedItem.year}
                </p>
              </div>

              <div className="rounded-[1.7rem] border border-white/12 bg-slate-950 p-5 text-white dark:bg-slate-900">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
                  Por que estudar isso
                </div>
                <p className="text-sm leading-7 text-slate-200">{selectedItem.whyItMatters}</p>
              </div>

              <div className="rounded-[1.7rem] border border-white/12 bg-white/76 p-5 dark:bg-white/6">
                <div className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                  Plano de leitura
                </div>
                <div className="space-y-3">
                  {(selectedItem.readingPlan || []).map((step, index) => (
                    <div key={`${selectedItem.slug}-step-${index}`} className="flex items-start gap-3">
                      <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-semibold text-white dark:bg-white dark:text-slate-950">
                        {index + 1}
                      </div>
                      <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.7rem] border border-white/12 bg-white/76 p-5 dark:bg-white/6">
                <div className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                  Resumo guiado
                </div>
                <div className="space-y-3">
                  {(selectedItem.content || []).map((paragraph, index) => (
                    <p key={`${selectedItem.slug}-paragraph-${index}`} className="text-sm leading-7 text-slate-600 dark:text-slate-300">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.7rem] border border-white/12 bg-white/76 p-5 dark:bg-white/6">
                <div className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                  Tags
                </div>
                <div className="flex flex-wrap gap-2">
                  {(selectedItem.tags || []).map((tag) => (
                    <span
                      key={`${selectedItem.slug}-${tag}`}
                      className="rounded-full bg-slate-950/6 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-white/8 dark:text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {selectedItem.sourceUrl ? (
                  <a
                    href={selectedItem.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                  >
                    Abrir fonte
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : null}

                {selectedItem.siteUrl ? (
                  <a
                    href={selectedItem.siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-slate-950/6 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-950 hover:text-white dark:bg-white/8 dark:text-slate-200 dark:hover:bg-white dark:hover:text-slate-950"
                  >
                    Ver base
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="rounded-[1.7rem] border border-dashed border-white/15 px-4 py-5 text-sm leading-7 text-slate-500 dark:text-slate-400">
              Escolha um material para abrir a ficha de estudo ao lado.
            </div>
          )}
        </div>

        <div className="rounded-[2.2rem] border border-white/15 bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:bg-slate-950/55 md:p-8">
          <div className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-700 dark:text-violet-300">
            <BookMarked className="h-4 w-4" />
            Fontes confiaveis
          </div>

          <div className="space-y-3">
            {(hub?.sources || []).map((source) => (
              <div key={source.id} className="rounded-[1.5rem] border border-white/12 bg-white/78 px-4 py-4 dark:bg-white/6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-950 dark:text-white">{source.name}</div>
                    <div className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                      {source.trustLabel}
                    </div>
                  </div>
                  {source.siteUrl ? (
                    <a
                      href={source.siteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-slate-950/6 p-2 text-slate-600 transition hover:bg-slate-950 hover:text-white dark:bg-white/8 dark:text-slate-300 dark:hover:bg-white dark:hover:text-slate-950"
                      aria-label={`Abrir ${source.name}`}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : null}
                </div>
                <div className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{source.note}</div>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-[1.7rem] border border-dashed border-white/15 bg-slate-950/4 px-4 py-4 dark:bg-white/6">
            <div className="mb-2 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-300">
              <Sparkles className="h-4 w-4" />
              Integracao preparada
            </div>
            <div className="space-y-2">
              {(hub?.providerBlueprints || []).map((provider) => (
                <div key={provider.id} className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                  <span className="font-semibold text-slate-950 dark:text-white">{provider.label}:</span>{' '}
                  {provider.description}
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </section>
  );
};

export default StudentHub;

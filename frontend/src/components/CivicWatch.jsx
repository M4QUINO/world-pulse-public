import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  AlertTriangle,
  ArrowUpRight,
  Building2,
  ExternalLink,
  FileSearch,
  Fingerprint,
  Gauge,
  Landmark,
  Scale,
  Search,
  ShieldAlert,
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL?.trim() || '/api';

const TONE_CLASSES = {
  baixo: 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-300',
  medio: 'bg-amber-500/12 text-amber-700 dark:text-amber-300',
  alto: 'bg-orange-500/12 text-orange-700 dark:text-orange-300',
  critico: 'bg-rose-500/12 text-rose-700 dark:text-rose-300',
};

const CivicWatch = () => {
  const [hub, setHub] = useState(null);
  const [result, setResult] = useState(null);
  const [query, setQuery] = useState('');
  const [target, setTarget] = useState('todos');
  const [loadingHub, setLoadingHub] = useState(true);
  const [loadingResult, setLoadingResult] = useState(true);
  const [error, setError] = useState('');

  const fetchHub = async () => {
    try {
      const response = await axios.get(`${API_BASE}/civic/hub`);
      setHub(response.data);
      setError('');
    } catch (requestError) {
      setError('Nao consegui carregar o Observatorio Civico agora.');
    } finally {
      setLoadingHub(false);
    }
  };

  const fetchResult = async (overrides = {}) => {
    setLoadingResult(true);

    try {
      const response = await axios.get(`${API_BASE}/civic/search`, {
        params: {
          q: overrides.query ?? query,
          target: overrides.target ?? target,
        },
      });

      setResult(response.data);
      setError('');
    } catch (requestError) {
      setError('A pesquisa civica falhou por agora. Tente novamente em alguns segundos.');
    } finally {
      setLoadingResult(false);
    }
  };

  useEffect(() => {
    fetchHub();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchResult();
    }, 220);

    return () => window.clearTimeout(timer);
  }, [query, target]);

  const selectedTarget = useMemo(() => {
    return (hub?.targets || []).find((item) => item.id === target);
  }, [hub?.targets, target]);

  if (loadingHub && !hub) {
    return (
      <section className="mb-12 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="h-[36rem] animate-pulse rounded-[2.2rem] bg-white/70 dark:bg-white/6" />
        <div className="h-[36rem] animate-pulse rounded-[2.2rem] bg-white/70 dark:bg-white/6" />
      </section>
    );
  }

  return (
    <section className="mb-12 grid gap-6 xl:grid-cols-[0.96fr_1.04fr]">
      <div className="rounded-[2.2rem] border border-white/15 bg-white/82 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:bg-slate-950/55 md:p-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-cyan-500/12 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-700 dark:text-cyan-300">
          <ShieldAlert className="h-4 w-4" />
          {hub?.title || 'Observatorio Civico'}
        </div>

        <h2 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-4xl">
          Pesquisa publica para transparencia politica local.
        </h2>
        <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">{hub?.summary}</p>

        <div className="mt-6 rounded-[1.8rem] border border-cyan-500/15 bg-cyan-500/8 p-5 dark:bg-cyan-400/8">
          <div className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-700 dark:text-cyan-300">
            <Scale className="h-4 w-4" />
            Regras de seguranca juridica
          </div>
          <div className="grid gap-2">
            {(hub?.guardrails || []).map((item) => (
              <div key={item} className="rounded-[1.2rem] bg-white/70 px-3 py-3 text-sm leading-6 text-slate-700 dark:bg-white/8 dark:text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-[2rem] border border-white/15 bg-white/72 p-4 dark:bg-white/6">
          <div className="flex items-center gap-3 rounded-[1.5rem] border border-white/15 bg-white/80 px-4 py-3 dark:bg-slate-950/40">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ex: vereador contrato gabinete, fornecedor emenda, dispensa licitacao..."
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-100"
            />
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
            <select
              value={target}
              onChange={(event) => setTarget(event.target.value)}
              className="rounded-[1.2rem] border border-white/15 bg-white/80 px-4 py-3 text-sm font-semibold text-slate-700 outline-none dark:bg-slate-950/40 dark:text-white"
            >
              <option value="todos">Todos os alvos publicos</option>
              {(hub?.targets || []).map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => fetchResult({ query, target })}
              className="inline-flex items-center justify-center gap-2 rounded-[1.2rem] bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950"
            >
              Pesquisar
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {(hub?.suggestedSearches || []).map((suggestion) => (
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

        {selectedTarget ? (
          <div className="mt-5 rounded-[1.7rem] border border-white/15 bg-white/75 p-4 dark:bg-white/6">
            <div className="mb-2 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              <Building2 className="h-4 w-4" />
              Alvo selecionado
            </div>
            <h3 className="text-lg font-semibold text-slate-950 dark:text-white">{selectedTarget.name}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{selectedTarget.focus}</p>
            <a
              href={selectedTarget.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950"
            >
              Abrir fonte oficial
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        ) : null}
      </div>

      <div className="grid gap-5">
        <div className="rounded-[2.2rem] border border-white/15 bg-white/82 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:bg-slate-950/55 md:p-8">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
              <Gauge className="h-4 w-4" />
              Indice de risco de inconsistencia
            </div>
            <div className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.18em] ${TONE_CLASSES[result?.band?.tone] || TONE_CLASSES.baixo}`}>
              {loadingResult ? 'Calculando...' : result?.band?.label}
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
            <div className="rounded-[1.8rem] bg-slate-950 p-5 text-white dark:bg-slate-900">
              <div className="text-[11px] font-black uppercase tracking-[0.2em] text-cyan-300">Pontuacao</div>
              <div className="mt-3 text-6xl font-semibold">{loadingResult ? '--' : result?.score}</div>
              <p className="mt-4 text-sm leading-6 text-slate-300">
                Nao e acusacao. E um radar documental para priorizar leitura humana em fontes oficiais.
              </p>
            </div>

            <div className="grid gap-3">
              {(result?.signals || []).map((signal) => (
                <div key={signal.id} className="rounded-[1.5rem] border border-white/15 bg-white/75 p-4 dark:bg-white/6">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-slate-950 dark:text-white">{signal.label}</div>
                    <div className="rounded-full bg-slate-950/5 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-slate-500 dark:bg-white/8 dark:text-slate-300">
                      {signal.score} pts
                    </div>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{signal.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-[1.5rem] border border-amber-400/20 bg-amber-500/10 px-4 py-4 text-sm leading-6 text-amber-900 dark:text-amber-100">
            <AlertTriangle className="mr-2 inline h-4 w-4" />
            {result?.disclaimer || 'Todo resultado exige verificacao humana.'}
          </div>
        </div>

        <div className="rounded-[2.2rem] border border-white/15 bg-white/82 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:bg-slate-950/55 md:p-8">
          <div className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-700 dark:text-cyan-300">
            <FileSearch className="h-4 w-4" />
            Consultas avancadas em fontes publicas
          </div>

          <div className="grid gap-3">
            {(result?.searches || []).slice(0, 9).map((item) => (
              <article key={`${item.targetId}-${item.query}`} className="rounded-[1.5rem] border border-white/15 bg-white/75 p-4 dark:bg-white/6">
                <div className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-300">
                  {item.targetName}
                </div>
                <p className="break-words rounded-[1.1rem] bg-slate-950/5 px-3 py-3 font-mono text-xs leading-6 text-slate-700 dark:bg-white/8 dark:text-slate-200">
                  {item.query}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950"
                  >
                    Abrir busca
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/8"
                  >
                    Fonte oficial
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-[2.2rem] border border-white/15 bg-white/82 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:bg-slate-950/55 md:p-8">
          <div className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-700 dark:text-violet-300">
            <Landmark className="h-4 w-4" />
            Cruzamentos uteis
          </div>
          <div className="flex flex-wrap gap-2">
            {(hub?.crosschecks || []).map((item) => (
              <span key={item} className="rounded-full bg-slate-950/6 px-3 py-2 text-xs font-semibold text-slate-600 dark:bg-white/8 dark:text-slate-300">
                {item}
              </span>
            ))}
          </div>

          <div className="mt-5 rounded-[1.5rem] border border-rose-400/20 bg-rose-500/10 px-4 py-4 text-sm leading-6 text-rose-900 dark:text-rose-100">
            <Fingerprint className="mr-2 inline h-4 w-4" />
            {result?.privacy || 'Evite CPF e dados pessoais sensiveis. Use minimizacao e finalidade legitima.'}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CivicWatch;

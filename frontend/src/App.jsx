import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { motion } from 'framer-motion';
import {
  BriefcaseBusiness,
  Flame,
  LayoutGrid,
  LoaderCircle,
  MessageSquareMore,
  Radio,
  RefreshCw,
  Search,
  Sparkles,
} from 'lucide-react';

import Navbar from './components/Navbar';
import NewsCard from './components/NewsCard';
import AdCard from './components/AdCard';
import NotificationPopup from './components/NotificationPopup';
import RadioPlayer from './components/RadioPlayer';
import SpotifyPlayer from './components/SpotifyPlayer';
import ArticleModal from './components/ArticleModal';
import EditorialBoard from './components/EditorialBoard';
import StudentHub from './components/StudentHub';
import TodayBrief from './components/TodayBrief';
import CivicWatch from './components/CivicWatch';
import { ThemeProvider } from './context/ThemeContext';

const API_BASE = import.meta.env.VITE_API_URL?.trim() || '/api';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL?.trim() || undefined;
const DESKTOP_PAGE_SIZE = 9;
const MOBILE_PAGE_SIZE = 5;
const MOBILE_MAX_RENDERED_ITEMS = 35;
const UPDATE_CHECK_INTERVAL_MS = 60 * 1000;
const SILENT_REFRESH_INTERVAL_MS = 5 * 60 * 1000;

const CATEGORY_FILTERS = [
  { value: 'todas', label: 'Todas' },
  { value: 'economia', label: 'Economia' },
  { value: 'politica', label: 'Politica' },
  { value: 'tecnologia', label: 'Tecnologia' },
  { value: 'ia', label: 'IA' },
  { value: 'esportes', label: 'Esportes' },
  { value: 'guerra', label: 'Guerra' },
  { value: 'entretenimento', label: 'Entretenimento' },
  { value: 'servis', label: 'Servis' },
];

const LEGACY_CATEGORY_MAP = {
  economy: {
    scope: 'nacional',
    scopeLabel: 'Nacional',
    category: 'economia',
    categoryLabel: 'Economia',
    location: 'Brasil',
    debatePrompt: 'Como esse tema afeta sua rotina, trabalho ou consumo?',
    imageUrl: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80',
    videoEmbedUrl: 'https://www.youtube.com/embed/aqz-KE-bpKQ',
  },
  entertainment: {
    scope: 'global',
    scopeLabel: 'Global',
    category: 'entretenimento',
    categoryLabel: 'Entretenimento',
    location: 'Mercado internacional',
    debatePrompt: 'A atencao do publico esta mais fragmentada ou mais concentrada do que antes?',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80',
    videoEmbedUrl: 'https://www.youtube.com/embed/ScMzIvxBSi4',
  },
  war: {
    scope: 'global',
    scopeLabel: 'Global',
    category: 'guerra',
    categoryLabel: 'Guerra e Conflitos',
    location: 'Cenario internacional',
    debatePrompt: 'Esse conflito tende a influenciar mercado, energia ou diplomacia no curto prazo?',
    imageUrl: 'https://images.unsplash.com/photo-1511149755252-35875b273fd6?auto=format&fit=crop&w=1200&q=80',
    videoEmbedUrl: 'https://www.youtube.com/embed/21X5lGlDOfg',
  },
  sports: {
    scope: 'global',
    scopeLabel: 'Global',
    category: 'esportes',
    categoryLabel: 'Esportes',
    location: 'Circuito internacional',
    debatePrompt: 'A gestao moderna dos clubes e ligas esta mudando mais que os resultados em campo?',
    imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
    videoEmbedUrl: 'https://www.youtube.com/embed/jNQXAC9IVRw',
  },
  technology: {
    scope: 'global',
    scopeLabel: 'Global',
    category: 'tecnologia',
    categoryLabel: 'Tecnologia',
    location: 'Ecossistema global',
    debatePrompt: 'Essa tecnologia escala de forma sustentavel ou ainda depende de narrativa demais?',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    videoEmbedUrl: 'https://www.youtube.com/embed/aqz-KE-bpKQ',
  },
  ai: {
    scope: 'global',
    scopeLabel: 'Global',
    category: 'ia',
    categoryLabel: 'Inteligencia Artificial',
    location: 'Ecossistema global',
    debatePrompt: 'IA esta virando infraestrutura ou ainda e mais narrativa que produto?',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
    videoEmbedUrl: 'https://www.youtube.com/embed/aqz-KE-bpKQ',
  },
  politics: {
    scope: 'nacional',
    scopeLabel: 'Nacional',
    category: 'politica',
    categoryLabel: 'Politica',
    location: 'Brasilia',
    debatePrompt: 'O efeito dessa pauta vai ficar no discurso ou chegar rapido na vida real?',
    imageUrl: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1200&q=80',
    videoEmbedUrl: 'https://www.youtube.com/embed/jNQXAC9IVRw',
  },
  servis: {
    scope: 'servis',
    scopeLabel: 'Servis',
    category: 'servis',
    categoryLabel: 'Servis',
    location: 'Mercado corporativo',
    debatePrompt: 'No seu setor, o que pesa mais agora: eficiencia, expansao ou confianca operacional?',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
    videoEmbedUrl: 'https://www.youtube.com/embed/ScMzIvxBSi4',
  },
};

const normalizeNewsItem = (item) => {
  if (!item) {
    return item;
  }

  if (item.scope && item.imageUrl && item.debatePrompt) {
    return {
      commentCount: 0,
      ...item,
    };
  }

  const fallback = LEGACY_CATEGORY_MAP[item.category] || LEGACY_CATEGORY_MAP.technology;

  return {
    ...item,
    ...fallback,
    source: item.source || 'World Pulse',
    summary: item.summary || 'Leitura resumida em atualizacao.',
    content: item.content || [item.summary || 'Leitura resumida em atualizacao.'],
    readingTime: item.readingTime || 4,
    commentCount: item.commentCount || 0,
    timestamp: item.timestamp || new Date().toISOString(),
    url: item.url && !String(item.url).includes('example.com') ? item.url : 'https://g1.globo.com/',
  };
};

const AppContent = () => {
  const [isMobileViewport, setIsMobileViewport] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.matchMedia('(max-width: 768px), (pointer: coarse)').matches;
  });
  const [meta, setMeta] = useState(null);
  const [editorial, setEditorial] = useState(null);
  const [debates, setDebates] = useState([]);
  const [feedItems, setFeedItems] = useState([]);
  const [feedPage, setFeedPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingShell, setLoadingShell] = useState(true);
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('todas');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [activePopup, setActivePopup] = useState(null);

  const sentinelRef = useRef(null);
  const activeCategoryRef = useRef(activeCategory);
  const searchRef = useRef(search);
  const metaRef = useRef(null);
  const lastSilentRefreshRef = useRef(0);

  useEffect(() => {
    activeCategoryRef.current = activeCategory;
    searchRef.current = search;
  }, [activeCategory, search, isMobileViewport]);

  useEffect(() => {
    metaRef.current = meta;
  }, [meta]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const mediaQuery = window.matchMedia('(max-width: 768px), (pointer: coarse)');
    const updateViewportMode = () => setIsMobileViewport(mediaQuery.matches);

    updateViewportMode();
    mediaQuery.addEventListener?.('change', updateViewportMode);

    return () => mediaQuery.removeEventListener?.('change', updateViewportMode);
  }, []);

  const fetchShellData = async () => {
    try {
      const [metaResponse, editorialResponse, debateResponse] = await Promise.all([
        axios.get(`${API_BASE}/meta`),
        axios.get(`${API_BASE}/editorial`),
        axios.get(`${API_BASE}/debates`),
      ]);

      setMeta(metaResponse.data);
      setEditorial({
        ...editorialResponse.data,
        hero: normalizeNewsItem(editorialResponse.data.hero),
        highlights: (editorialResponse.data.highlights || []).map(normalizeNewsItem),
        mediaGallery: (editorialResponse.data.mediaGallery || []).map(normalizeNewsItem),
      });
      setDebates((debateResponse.data || []).map(normalizeNewsItem));
      setError('');
    } catch (requestError) {
      setError('Nao consegui carregar a mesa editorial agora. Tente atualizar em alguns segundos.');
    } finally {
      setLoadingShell(false);
    }
  };

  const loadFeed = async ({
    page = 1,
    reset = false,
    category = activeCategory,
    searchTerm = search,
    silent = false,
  } = {}) => {
    if (reset && !silent) {
      setLoadingFeed(true);
    } else if (!reset) {
      setLoadingMore(true);
    }

    try {
      const response = await axios.get(`${API_BASE}/feed`, {
        params: {
          page,
          limit: isMobileViewport ? MOBILE_PAGE_SIZE : DESKTOP_PAGE_SIZE,
          category: category !== 'todas' ? category : undefined,
          q: searchTerm.trim() || undefined,
        },
      });

      const normalizedItems = (response.data.items || []).map(normalizeNewsItem);

      setFeedItems((current) => {
        const nextItems = reset ? normalizedItems : [...current, ...normalizedItems];
        return isMobileViewport ? nextItems.slice(-MOBILE_MAX_RENDERED_ITEMS) : nextItems;
      });
      setFeedPage(response.data.page || page);
      setHasMore(Boolean(response.data.hasMore));
      setError('');
    } catch (requestError) {
      setError('Nao consegui carregar o feed infinito agora.');
    } finally {
      if (!silent) {
        setLoadingFeed(false);
      }
      setLoadingMore(false);
    }
  };

  const refreshVisibleContent = async ({ silent = true } = {}) => {
    await Promise.all([
      fetchShellData(),
      loadFeed({
        page: 1,
        reset: true,
        category: activeCategoryRef.current,
        searchTerm: searchRef.current,
        silent,
      }),
    ]);
  };

  useEffect(() => {
    fetchShellData();
  }, []);

  useEffect(() => {
    const syncNews = async ({ force = false } = {}) => {
      try {
        const metaResponse = await axios.get(`${API_BASE}/meta`, {
          params: {
            t: Date.now(),
          },
        });

        const incomingMeta = metaResponse.data;
        const previousMeta = metaRef.current;
        const incomingLastUpdate = incomingMeta?.lastUpdatedAt || '';
        const previousLastUpdate = previousMeta?.lastUpdatedAt || '';
        const nextUpdateAt = incomingMeta?.nextUpdateAt ? new Date(incomingMeta.nextUpdateAt).getTime() : 0;
        const now = Date.now();
        const updateWindowPassed = nextUpdateAt > 0 && now >= nextUpdateAt;
        const enoughTimeForSilentRefresh = now - lastSilentRefreshRef.current >= SILENT_REFRESH_INTERVAL_MS;
        const hasNewRound = incomingLastUpdate && incomingLastUpdate !== previousLastUpdate;

        setMeta(incomingMeta);

        if (force || hasNewRound || updateWindowPassed || enoughTimeForSilentRefresh) {
          lastSilentRefreshRef.current = now;
          await refreshVisibleContent({ silent: true });
        }
      } catch (requestError) {
        console.warn('Atualizacao continua falhou, nova tentativa em breve.', requestError);
      }
    };

    const interval = window.setInterval(() => {
      syncNews();
    }, UPDATE_CHECK_INTERVAL_MS);

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        syncNews({ force: true });
      }
    };

    window.addEventListener('focus', handleVisibilityChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener('focus', handleVisibilityChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadFeed({
        page: 1,
        reset: true,
        category: activeCategory,
        searchTerm: search,
      });
    }, 180);

    return () => clearTimeout(timer);
  }, [activeCategory, search]);

  useEffect(() => {
    if (!hasMore || loadingFeed || loadingMore || !sentinelRef.current) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadFeed({
            page: feedPage + 1,
            reset: false,
            category: activeCategory,
            searchTerm: search,
          });
        }
      },
      {
        rootMargin: isMobileViewport ? '160px 0px' : '420px 0px',
      },
    );

    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, [feedPage, hasMore, loadingFeed, loadingMore, activeCategory, search, isMobileViewport]);

  useEffect(() => {
    const socketClient = io(SOCKET_URL, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
    });

    socketClient.on('new-news', (item) => {
      const normalizedItem = normalizeNewsItem(item);
      setActivePopup(normalizedItem);
      fetchShellData();
      loadFeed({
        page: 1,
        reset: true,
        category: activeCategoryRef.current,
        searchTerm: searchRef.current,
      });
    });

    return () => {
      socketClient.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!activePopup) {
      return undefined;
    }

    const timer = setTimeout(() => setActivePopup(null), 12000);
    return () => clearTimeout(timer);
  }, [activePopup]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);

    try {
      const response = await axios.post(`${API_BASE}/news/refresh`);
      if (response.data.news?.[0]) {
        setActivePopup(normalizeNewsItem(response.data.news[0]));
      }

      await Promise.all([
        fetchShellData(),
        loadFeed({
          page: 1,
          reset: true,
          category: activeCategory,
          searchTerm: search,
        }),
      ]);
    } catch (requestError) {
      setError('Nao foi possivel atualizar a rodada agora.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCommentCountChange = (slug, count) => {
    setFeedItems((current) => current.map((item) => (item.slug === slug ? { ...item, commentCount: count } : item)));
    setSelectedArticle((current) => (current?.slug === slug ? { ...current, commentCount: count } : current));
    setEditorial((current) =>
      current
        ? {
            ...current,
            hero: current.hero?.slug === slug ? { ...current.hero, commentCount: count } : current.hero,
            highlights: current.highlights?.map((item) => (item.slug === slug ? { ...item, commentCount: count } : item)),
            mediaGallery: current.mediaGallery?.map((item) => (item.slug === slug ? { ...item, commentCount: count } : item)),
          }
        : current,
    );
    fetchShellData();
  };

  const articleIndex = useMemo(() => {
    const accumulator = new Map();

    feedItems.forEach((item) => accumulator.set(item.slug, item));
    editorial?.highlights?.forEach((item) => accumulator.set(item.slug, item));
    editorial?.mediaGallery?.forEach((item) => accumulator.set(item.slug, item));
    if (editorial?.hero) {
      accumulator.set(editorial.hero.slug, editorial.hero);
    }

    return accumulator;
  }, [editorial, feedItems]);

  const openArticle = (article) => {
    if (!article) {
      return;
    }

    setSelectedArticle(normalizeNewsItem(article));
  };

  const openArticleBySlug = (slug) => {
    const article = articleIndex.get(slug);
    if (article) {
      openArticle(article);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#eef4ff_38%,#f8fafc_100%)] text-slate-900 transition-colors duration-500 dark:bg-[linear-gradient(180deg,#020617_0%,#0f172a_46%,#111827_100%)] dark:text-white">
      <Navbar lastUpdatedAt={meta?.lastUpdatedAt} />

      <main className="mx-auto max-w-7xl px-4 pb-36 pt-26 sm:pb-28 sm:pt-28 md:px-6 md:pb-20">
        <section className="mb-10 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[2.2rem] border border-white/15 bg-white/78 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:bg-slate-950/55 sm:p-7">
            <div className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-600 dark:text-blue-300">
              <Radio className="h-4 w-4" />
              Redacao ao vivo
            </div>

            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-6xl">
              Feed infinito de noticias,
              <br />
              <span className="text-blue-500">editorial forte</span> e debate livre.
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">
              Agora o World Pulse funciona como uma redacao viva: resume a rodada, mostra imagens e video,
              carrega novas leituras com scroll infinito e abre um espaco anonimo para conversa em cada pauta.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-[1.6rem] bg-slate-950 px-5 py-5 text-white shadow-[0_18px_45px_rgba(15,23,42,0.22)] dark:bg-white dark:text-slate-950">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-300 dark:text-slate-500">Total de leituras</div>
                <div className="mt-2 text-3xl font-semibold">{meta?.total ?? feedItems.length}</div>
                <div className="mt-2 text-sm text-slate-300 dark:text-slate-600">Arquivo longo para scroll continuo.</div>
              </div>
              <div className="rounded-[1.6rem] border border-white/15 bg-white/75 px-5 py-5 dark:bg-white/6">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Proxima rodada</div>
                <div className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">
                  {meta?.nextUpdateAt
                    ? new Date(meta.nextUpdateAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                    : '--:--'}
                </div>
                <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">Atualizacao automatica a cada 3 horas.</div>
              </div>
              <div className="rounded-[1.6rem] border border-white/15 bg-white/75 px-5 py-5 dark:bg-white/6">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Debates quentes</div>
                <div className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">{debates.length}</div>
                <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Atualizacao continua ligada em segundo plano.
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2.2rem] border border-white/15 bg-white/78 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:bg-slate-950/55">
            <div className="mb-4 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-violet-600 dark:text-violet-300">
                <Flame className="h-4 w-4" />
                Agora no debate
              </div>
              <button
                type="button"
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Atualizando...' : 'Nova rodada'}
              </button>
            </div>

            <div className="space-y-4">
              {debates.slice(0, 4).map((debate) => (
                <button
                  key={debate.slug}
                  type="button"
                  onClick={() => openArticleBySlug(debate.slug)}
                  className="block w-full rounded-[1.5rem] border border-white/15 bg-white/80 px-4 py-4 text-left transition hover:-translate-y-0.5 hover:shadow-lg dark:bg-white/6"
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-300">
                      {debate.scopeLabel} / {debate.categoryLabel}
                    </div>
                    <div className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                      <MessageSquareMore className="h-3.5 w-3.5" />
                      {debate.commentCount || 0}
                    </div>
                  </div>
                  <div className="text-base font-semibold leading-6 text-slate-950 dark:text-white">{debate.title}</div>
                  <div className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {debate.debatePrompt}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-5 rounded-[1.5rem] border border-dashed border-white/15 px-4 py-4 text-sm leading-6 text-slate-500 dark:text-slate-400">
              O ambiente continua livre, mas agora com foco em argumento, contexto e leitura coletiva das pautas.
            </div>
          </div>
        </section>

        <section className="mb-8 grid gap-4">
          <div className="flex items-center gap-3 rounded-[1.6rem] border border-white/15 bg-white/78 px-4 py-3 shadow-[0_14px_40px_rgba(15,23,42,0.05)] dark:bg-white/6">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por titulo, contexto, fonte, local ou assunto"
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-100"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORY_FILTERS.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setActiveCategory(filter.value)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  activeCategory === filter.value
                    ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950'
                    : 'bg-white/78 text-slate-600 hover:bg-white dark:bg-white/6 dark:text-slate-300 dark:hover:bg-white/10'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {error ? (
            <div className="rounded-[1.4rem] border border-amber-400/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
              {error}
            </div>
          ) : null}
        </section>

        <EditorialBoard editorial={loadingShell ? null : editorial} onOpenArticle={openArticle} />
        <TodayBrief />
        <CivicWatch />
        <StudentHub />

        <section className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_21rem]">
          <div>
            <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                  <LayoutGrid className="h-4 w-4" />
                  Feed infinito
                </div>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
                  Leitura sem fim, da manchete ao debate
                </h2>
              </div>
              <div className="rounded-full bg-slate-950/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:bg-white/8 dark:text-slate-300">
                {feedItems.length} carregadas
              </div>
            </div>

            {loadingFeed ? (
              <div className="grid gap-6 md:grid-cols-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={`skeleton-${index}`} className="h-[29rem] animate-pulse rounded-[2rem] bg-white/70 dark:bg-white/6" />
                ))}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {feedItems.map((item, index) => {
                  if (item.type === 'ad') {
                    return <AdCard key={`ad-${index}`} item={item} />;
                  }
                  return (
                    <NewsCard
                      key={`${item.id}-${index}`}
                      item={item}
                      featured={index % 5 === 0}
                      onOpen={openArticle}
                    />
                  );
                })}
              </div>
            )}

            <div ref={sentinelRef} className="h-12" />

            {loadingMore ? (
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Carregando mais historias...
              </div>
            ) : null}

            {!hasMore && !loadingFeed ? (
              <div className="mt-4 rounded-[1.5rem] border border-dashed border-white/15 px-4 py-4 text-center text-sm text-slate-500 dark:text-slate-400">
                Voce chegou ao fim desta rodada filtrada. Atualize a busca ou espere a proxima coleta automatica.
              </div>
            ) : null}
          </div>

          <aside className="space-y-5 xl:sticky xl:top-28">
            <div className="rounded-[2rem] border border-white/15 bg-white/80 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:bg-slate-950/55">
              <div className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-600 dark:text-blue-300">
                <Sparkles className="h-4 w-4" />
                Pulso do editor
              </div>
              <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
                O scroll infinito traz volume, mas a mesa editorial continua filtrando contexto, imagens, video e
                ganchos de conversa para a leitura nao virar ruido.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/15 bg-white/80 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:bg-slate-950/55">
              <div className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-600 dark:text-violet-300">
                <BriefcaseBusiness className="h-4 w-4" />
                Servis no radar
              </div>
              <div className="space-y-3">
                {feedItems
                  .filter((item) => item.category === 'servis')
                  .slice(0, 3)
                  .map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => openArticle(item)}
                      className="block w-full rounded-[1.4rem] border border-white/15 bg-white/80 px-4 py-4 text-left transition hover:-translate-y-0.5 hover:shadow-lg dark:bg-white/6"
                    >
                      <div className="text-sm font-semibold text-slate-950 dark:text-white">{item.title}</div>
                      <div className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{item.summary}</div>
                    </button>
                  ))}
              </div>
            </div>
          </aside>
        </section>
      </main>

      <NotificationPopup
        news={activePopup}
        onClose={() => setActivePopup(null)}
        onOpen={(item) => {
          openArticle(item);
          setActivePopup(null);
        }}
      />

      <RadioPlayer />
      <SpotifyPlayer />

      <ArticleModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
        onCommentCountChange={handleCommentCountChange}
      />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;

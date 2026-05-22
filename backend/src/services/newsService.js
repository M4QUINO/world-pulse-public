const fs = require('fs');
const path = require('path');

const STORE_PATH = path.join(__dirname, '../store/newsStore.json');
const UPDATE_INTERVAL_HOURS = Number(process.env.UPDATE_INTERVAL_HOURS || 3);
const MAX_STORED_ITEMS = 140;

const CATEGORY_MAP = {
  regional: {
    label: 'Regional',
    scope: 'regional',
    scopeLabel: 'Regional',
    location: 'Ceara',
    keywords: 'Fortaleza,Ceara,cidade,infraestrutura',
  },
  economia: {
    label: 'Economia',
    scope: 'nacional',
    scopeLabel: 'Nacional',
    location: 'Brasil',
    keywords: 'economia,mercado,bolsa,financas',
  },
  politica: {
    label: 'Politica',
    scope: 'nacional',
    scopeLabel: 'Nacional',
    location: 'Brasilia',
    keywords: 'politica,governo,congresso',
  },
  tecnologia: {
    label: 'Tecnologia',
    scope: 'global',
    scopeLabel: 'Global',
    location: 'Ecossistema global',
    keywords: 'technology,coding,gadgets',
  },
  ia: {
    label: 'Inteligencia Artificial',
    scope: 'global',
    scopeLabel: 'Global',
    location: 'Ecossistema global',
    keywords: 'artificial intelligence,robot,chip',
  },
  esportes: {
    label: 'Esportes',
    scope: 'regional',
    scopeLabel: 'Regional',
    location: 'Ceara e Brasil',
    keywords: 'sports,soccer,stadium',
  },
  guerra: {
    label: 'Guerra e Conflitos',
    scope: 'global',
    scopeLabel: 'Global',
    location: 'Cenario internacional',
    keywords: 'conflict,military,diplomacy',
  },
  entretenimento: {
    label: 'Entretenimento',
    scope: 'global',
    scopeLabel: 'Global',
    location: 'Cultura e streaming',
    keywords: 'cinema,music,celebrity',
  },
  servis: {
    label: 'Servis',
    scope: 'servis',
    scopeLabel: 'Servis',
    location: 'Mercado corporativo',
    keywords: 'business,office,consulting',
  },
};

const VIDEO_POOLS = {
  economia: 'https://www.youtube.com/embed/aqz-KE-bpKQ',
  tecnologia: 'https://www.youtube.com/embed/jNQXAC9IVRw',
  ia: 'https://www.youtube.com/embed/ScMzIvxBSi4',
  guerra: 'https://www.youtube.com/embed/21X5lGlDOfg',
  esportes: 'https://www.youtube.com/embed/jNQXAC9IVRw',
  entretenimento: 'https://www.youtube.com/embed/ScMzIvxBSi4',
  geral: 'https://www.youtube.com/embed/aqz-KE-bpKQ',
};

const TITLE_BANK = {
  regional: [
    'Fortaleza amplia monitoramento urbano e mobilidade inteligente entra no radar',
    'Ceara acompanha obras, clima e servicos com impacto direto na rotina local',
  ],
  economia: [
    'Mercado brasileiro recalibra juros, consumo e credito na rodada do dia',
    'Empresas revisam custos e investimentos diante de novos sinais da economia',
  ],
  politica: [
    'Agenda politica nacional movimenta Congresso, governo e bastidores regionais',
    'Debates em Brasilia pressionam prioridades sociais, fiscais e regulatórias',
  ],
  tecnologia: [
    'Big techs e data centers disputam infraestrutura para a proxima fase digital',
    'Novas plataformas aceleram automacao, seguranca e servicos conectados',
  ],
  ia: [
    'IA generativa avanca em empresas e aumenta debate sobre governanca',
    'Ferramentas de IA ganham uso pratico em saude, educacao e atendimento',
  ],
  esportes: [
    'Ceara e Fortaleza movimentam bastidores, torcida e calendario esportivo',
    'Rodada esportiva combina desempenho em campo, mercado e transmissao ao vivo',
  ],
  guerra: [
    'Tensoes globais reacendem alerta diplomatico e impacto em energia e comercio',
    'Conflitos internacionais ampliam pressao humanitaria e negociacoes multilaterais',
  ],
  entretenimento: [
    'Streaming, shows e cinema disputam atencao em nova rodada cultural',
    'Mercado de entretenimento aposta em experiencias ao vivo e comunidades digitais',
  ],
  servis: [
    'Segmento Servis acelera eficiencia, automacao e relacionamento com clientes',
    'Empresas de servicos buscam dados em tempo real para melhorar operacao',
  ],
};

const pad = (value) => String(value).padStart(2, '0');

const getDateKey = (date = new Date()) => {
  const formatter = new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const parts = formatter.formatToParts(date);
  const get = (type) => parts.find((part) => part.type === type)?.value;
  return `${get('year')}-${get('month')}-${get('day')}`;
};

const formatDateTime = (date) =>
  new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);

const readStore = () => {
  try {
    if (!fs.existsSync(STORE_PATH)) {
      return [];
    }

    const raw = fs.readFileSync(STORE_PATH, 'utf8');
    return raw.trim() ? JSON.parse(raw) : [];
  } catch (error) {
    console.error('Nao foi possivel ler newsStore:', error);
    return [];
  }
};

const writeStore = (items) => {
  fs.writeFileSync(STORE_PATH, JSON.stringify(items.slice(0, MAX_STORED_ITEMS), null, 2));
};

const makeSlug = (text, id) =>
  `${text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 72)}-${id}`;

const buildImageUrl = (category, seed) => {
  const categorySeeds = {
    regional: 'photo-1494526585095-c41746248156',
    economia: 'photo-1520607162513-77705c0fcd4a',
    politica: 'photo-1529107386315-e1a2ed48a620',
    tecnologia: 'photo-1518770660439-4636190af475',
    ia: 'photo-1677442136019-21780ecad995',
    esportes: 'photo-1517649763962-0c623066013b',
    guerra: 'photo-1511149755252-35875b273fd6',
    entretenimento: 'photo-1493225457124-a3eb161ffa5f',
    servis: 'photo-1552664730-d307ca884978',
  };

  return `https://images.unsplash.com/${categorySeeds[category] || categorySeeds.tecnologia}?auto=format&fit=crop&w=1200&q=80&sig=${seed}`;
};

const generateItem = ({ id, date, category, index = 0, cycle = 0 }) => {
  const catData = CATEGORY_MAP[category] || CATEGORY_MAP.tecnologia;
  const titles = TITLE_BANK[category] || TITLE_BANK.tecnologia;
  const title = titles[(index + cycle) % titles.length];
  const dateLabel = formatDateTime(date);
  const seed = Math.abs(`${id}-${category}`.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0));

  return {
    id,
    slug: makeSlug(title, id),
    title,
    summary: `Atualizado em ${dateLabel}. A editoria de ${catData.label} acompanha os principais sinais do momento e resume o que pode afetar pessoas, empresas e decisores nas proximas horas.`,
    category,
    categoryLabel: catData.label,
    scope: catData.scope,
    scopeLabel: catData.scopeLabel,
    location: catData.location,
    source: 'World Pulse News',
    timestamp: date.toISOString(),
    readingTime: 3 + ((seed + index) % 5),
    imageUrl: buildImageUrl(category, seed),
    fallbackImageUrl: `https://source.unsplash.com/featured/?${catData.keywords}&sig=${seed}`,
    videoEmbedUrl: VIDEO_POOLS[category] || VIDEO_POOLS.geral,
    debatePrompt: `Como essa pauta de ${catData.label} pode mudar sua rotina, seu trabalho ou sua visao de mundo hoje?`,
    url: category === 'economia' ? 'https://www.infomoney.com.br/' : 'https://g1.globo.com/',
    content: [
      `Esta rodada foi renovada em ${dateLabel}, no horario de Brasilia.`,
      `O World Pulse organiza o tema em linguagem simples para leitura rapida, debate e acompanhamento continuo.`,
      `A proxima atualizacao automatica esta programada para a janela de 3 horas seguinte, mas o servidor tambem atualiza quando detecta dados antigos.`,
    ],
  };
};

const generateBatch = (date = new Date()) => {
  const categories = Object.keys(CATEGORY_MAP);
  const cycle = Math.floor(date.getHours() / Math.max(Math.min(UPDATE_INTERVAL_HOURS, 12), 1));
  const baseId = `${getDateKey(date)}-${pad(date.getHours())}${pad(date.getMinutes())}`;

  return categories.map((category, index) =>
    generateItem({
      id: `live-${baseId}-${index}`,
      date: new Date(date.getTime() - index * 7 * 60 * 1000),
      category,
      index,
      cycle,
    }),
  );
};

const shouldRefresh = (items) => {
  if (!items.length) {
    return true;
  }

  const latest = new Date(items[0].timestamp);
  if (Number.isNaN(latest.getTime())) {
    return true;
  }

  const now = new Date();
  const ageMs = now.getTime() - latest.getTime();
  const maxAgeMs = Math.max(1, UPDATE_INTERVAL_HOURS) * 60 * 60 * 1000;

  return getDateKey(latest) !== getDateKey(now) || ageMs > maxAgeMs;
};

const refreshStore = () => {
  const current = readStore();
  const freshBatch = generateBatch(new Date());
  const knownIds = new Set(freshBatch.map((item) => item.id));
  const merged = [...freshBatch, ...current.filter((item) => !knownIds.has(item.id))];
  writeStore(merged);
  return freshBatch;
};

const ensureFreshStore = () => {
  const current = readStore();
  if (shouldRefresh(current)) {
    refreshStore();
  }
};

const seedStore = (force = false) => {
  if (force || !fs.existsSync(STORE_PATH) || readStore().length < 9) {
    writeStore(generateBatch(new Date()));
  }

  ensureFreshStore();
};

const getNews = (page = 0) => {
  seedStore();
  const data = readStore();
  if (Number(page) === 0) {
    return data;
  }

  const historicalNews = [];
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() - Number(page));

  Object.keys(CATEGORY_MAP).forEach((category, index) => {
    historicalNews.push(
      generateItem({
        id: `hist-${getDateKey(targetDate)}-${page}-${index}`,
        date: targetDate,
        category,
        index,
        cycle: Number(page),
      }),
    );
  });

  return historicalNews;
};

const generateAd = (category) => {
  const ads = [
    {
      type: 'ad',
      title: 'Invista no Futuro com World Pulse Capital',
      summary: 'As melhores taxas para investidores do setor de tecnologia e inovacao. Comece hoje.',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      url: 'https://www.infomoney.com.br/',
      label: 'Patrocinado',
      category: 'economia',
    },
    {
      type: 'ad',
      title: 'Servis Pro: Gestao Inteligente para sua Empresa',
      summary: 'Aumente a produtividade da sua equipe com uma plataforma de operacao, dados e atendimento.',
      imageUrl: 'https://images.unsplash.com/photo-1454165833767-027ffea7028c?auto=format&fit=crop&w=800&q=80',
      url: 'https://www.sebrae.com.br/',
      label: 'Patrocinado',
      category: 'servis',
    },
  ];

  const preferred = ads.find((ad) => ad.category === category);
  return preferred || ads[0];
};

const getFeed = ({ page = 1, limit = 9, category, search }) => {
  seedStore();
  const p = Math.max(parseInt(page, 10) || 1, 1);
  const perPage = Math.max(parseInt(limit, 10) || 9, 1);
  let allNews = p === 1 ? readStore() : getNews(p - 1);

  if (category && category !== 'todas') {
    allNews = allNews.filter((item) => item.category === category);
  }

  if (search) {
    const q = search.toLowerCase();
    allNews = allNews.filter((item) => item.title.toLowerCase().includes(q) || item.summary.toLowerCase().includes(q));
  }

  const paged = allNews.slice(0, perPage);
  const itemsWithAds = [];
  paged.forEach((item, index) => {
    itemsWithAds.push(item);
    if ((index + 1) % 4 === 0) {
      itemsWithAds.push(generateAd(category));
    }
  });

  return {
    items: itemsWithAds,
    page: p,
    hasMore: p < 50,
  };
};

const getMeta = () => {
  seedStore();
  const data = readStore();
  const now = new Date();
  const nextUpdate = new Date(now);
  const nextHour = Math.ceil((now.getHours() + 0.1) / Math.max(1, UPDATE_INTERVAL_HOURS)) * Math.max(1, UPDATE_INTERVAL_HOURS);
  nextUpdate.setHours(nextHour % 24, 0, 0, 0);
  if (nextHour >= 24) {
    nextUpdate.setDate(nextUpdate.getDate() + 1);
  }

  return {
    total: data.length + 1000,
    lastUpdatedAt: data[0]?.timestamp || now.toISOString(),
    nextUpdateAt: nextUpdate.toISOString(),
  };
};

const getEditorial = () => {
  seedStore();
  const data = readStore();
  return {
    kicker: 'Curadoria atualizada',
    title: 'O que mudou agora no pulso regional, nacional e global',
    summary: 'A mesa editorial reorganiza os sinais mais recentes para voce nao ficar preso a noticias antigas.',
    manifesto:
      'Cada rodada combina contexto, imagem, video, debate e leitura rapida. Quando o servidor acorda, ele verifica a data e renova o feed automaticamente.',
    videoSpotlight: {
      title: 'Resumo em video',
      description: 'Uma janela visual para acompanhar o ciclo do dia.',
      embedUrl: VIDEO_POOLS.geral,
      sourceUrl: 'https://www.youtube.com/',
    },
    hero: data[0],
    highlights: data.slice(1, 5),
    mediaGallery: data.slice(5, 11),
  };
};

const fetchNewNews = async () => refreshStore();

module.exports = {
  getNews,
  getFeed,
  getMeta,
  getEditorial,
  fetchNewNews,
  seedStore,
};

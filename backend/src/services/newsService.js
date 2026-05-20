const fs = require('fs');
const path = require('path');

const STORE_PATH = path.join(__dirname, '../store/newsStore.json');

const CATEGORY_MAP = {
  economia: { label: 'Economia', keywords: 'finance,money,stock market' },
  politica: { label: 'Política', keywords: 'government,congress,voting' },
  tecnologia: { label: 'Tecnologia', keywords: 'technology,coding,gadgets' },
  ia: { label: 'Inteligência Artificial', keywords: 'artificial intelligence,robot,chip' },
  esportes: { label: 'Esportes', keywords: 'sports,soccer,stadium' },
  guerra: { label: 'Guerra e Conflitos', keywords: 'conflict,military,diplomacy' },
  entretenimento: { label: 'Entretenimento', keywords: 'cinema,music,celebrity' },
  servis: { label: 'Servis', keywords: 'business,office,consulting' },
  regional: { label: 'Regional', keywords: 'city,local infrastructure,neighborhood' }
};

const VIDEO_POOLS = {
  economia: 'https://www.youtube.com/embed/aqz-KE-bpKQ',
  tecnologia: 'https://www.youtube.com/embed/jNQXAC9IVRw',
  ia: 'https://www.youtube.com/embed/ScMzIvxBSi4',
  guerra: 'https://www.youtube.com/embed/21X5lGlDOfg',
  geral: 'https://www.youtube.com/embed/aqz-KE-bpKQ'
};

const generateItem = (id, date, category) => {
  const dayStr = date.toLocaleDateString('pt-BR');
  const catData = CATEGORY_MAP[category] || { label: 'Geral', keywords: 'news' };
  const randomSeed = Math.floor(Math.random() * 1000);
  
  return {
    id,
    slug: `noticia-${id}-${randomSeed}`,
    title: `${catData.label}: Novas tendências observadas em ${dayStr}`,
    summary: `Análise profunda sobre o impacto de ${catData.label} no cenário atual. Especialistas discutem como as mudanças de ${dayStr} afetarão o mercado nos próximos meses.`,
    category: category,
    categoryLabel: catData.label,
    scope: category === 'regional' ? 'regional' : (category === 'servis' ? 'servis' : 'global'),
    scopeLabel: category === 'regional' ? 'Regional' : (category === 'servis' ? 'Servis' : 'Global'),
    source: 'World Pulse News',
    timestamp: date.toISOString(),
    readingTime: Math.floor(Math.random() * 5) + 3,
    // Imagem única baseada na categoria e um seed aleatório para não repetir
    imageUrl: `https://images.unsplash.com/photo-${1500000000000 + randomSeed}?auto=format&fit=crop&w=800&q=60&sig=${randomSeed}`,
    // Caso a imagem acima falhe ou seja repetitiva, usamos a busca por keyword
    fallbackImageUrl: `https://source.unsplash.com/featured/?${catData.keywords}&sig=${randomSeed}`,
    videoEmbedUrl: VIDEO_POOLS[category] || VIDEO_POOLS.geral,
    debatePrompt: `Qual sua opinião sobre o futuro de ${catData.label} após os eventos de ${dayStr}?`,
    url: 'https://g1.globo.com/',
    content: [
      `Relatórios de ${dayStr} indicam uma mudança estrutural em ${catData.label}.`,
      `O mercado reagiu com cautela, mas otimismo em relação às novas tecnologias aplicadas.`,
      `Estrategistas recomendam atenção redobrada aos indicadores de desempenho desta semana.`
    ]
  };
};

// Gerador de anúncios contextuais
const generateAd = (category) => {
  const ads = [
    {
      type: 'ad',
      title: 'Invista no Futuro com World Pulse Capital',
      summary: 'As melhores taxas para investidores do setor de tecnologia e inovação. Comece hoje.',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      url: 'https://example.com/ads/finance',
      label: 'Patrocinado',
      category: 'economia'
    },
    {
      type: 'ad',
      title: 'Servis Pro: Gestão Inteligente para sua Empresa',
      summary: 'Aumente a produtividade da sua equipe com a plataforma líder do mercado Servis.',
      imageUrl: 'https://images.unsplash.com/photo-1454165833767-027ffea7028c?auto=format&fit=crop&w=800&q=80',
      url: 'https://example.com/ads/servis',
      label: 'Patrocinado',
      category: 'servis'
    }
  ];
  return ads[Math.floor(Math.random() * ads.length)];
};

const seedStore = (force = false) => {
  if (force || !fs.existsSync(STORE_PATH) || fs.readFileSync(STORE_PATH, 'utf8').length < 10) {
    const news = [];
    const categories = Object.keys(CATEGORY_MAP);
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setHours(date.getHours() - i);
      const cat = categories[i % categories.length];
      news.push(generateItem(`init-${i}`, date, cat));
    }
    fs.writeFileSync(STORE_PATH, JSON.stringify(news, null, 2));
  }
};

const getNews = (page = 0) => {
  seedStore();
  const data = JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));
  if (page === 0) return data;
  
  const historicalNews = [];
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() - page);
  const categories = Object.keys(CATEGORY_MAP);
  
  categories.forEach((cat, index) => {
    historicalNews.push(generateItem(`hist-${page}-${index}`, targetDate, cat));
  });
  return historicalNews;
};

const getFeed = ({ page = 1, limit = 9, category, search }) => {
  seedStore();
  const p = parseInt(page);
  let allNews = p === 1 ? JSON.parse(fs.readFileSync(STORE_PATH, 'utf8')) : getNews(p - 1);

  let filtered = allNews;
  if (category && category !== 'todas') {
    filtered = filtered.filter(item => item.category === category);
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(item => 
      item.title.toLowerCase().includes(q) || 
      item.summary.toLowerCase().includes(q)
    );
  }

  // Inserir anúncio a cada 4 itens
  const itemsWithAds = [];
  filtered.forEach((item, index) => {
    itemsWithAds.push(item);
    if ((index + 1) % 4 === 0) {
      itemsWithAds.push(generateAd(category));
    }
  });

  return {
    items: itemsWithAds,
    page: p,
    hasMore: p < 50
  };
};

const getMeta = () => {
  seedStore();
  const data = JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));
  const now = new Date();
  const nextUpdate = new Date(now);
  nextUpdate.setHours(Math.ceil((now.getHours() + 0.1) / 3) * 3, 0, 0, 0);

  return {
    total: data.length + 1000,
    lastUpdatedAt: data[0]?.timestamp || now.toISOString(),
    nextUpdateAt: nextUpdate.toISOString()
  };
};

const getEditorial = () => {
  seedStore();
  const data = JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));
  return {
    hero: data[0],
    highlights: data.slice(1, 4),
    mediaGallery: data.slice(4, 7)
  };
};

const fetchNewNews = async () => {
  const now = new Date();
  const newItem = generateItem(`live-${now.getTime()}`, now, 'ia');
  const data = JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));
  const updated = [newItem, ...data].slice(0, 100);
  fs.writeFileSync(STORE_PATH, JSON.stringify(updated, null, 2));
  return [newItem];
};

module.exports = {
  getNews,
  getFeed,
  getMeta,
  getEditorial,
  fetchNewNews,
  seedStore
};

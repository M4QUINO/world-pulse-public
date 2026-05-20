const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

const STORE_PATH = path.join(__dirname, '../store/commentsStore.json');

const VALID_TONES = ['analise', 'concordo', 'discordo', 'pergunta'];
const ALIAS_PREFIXES = ['Voz', 'Pulso', 'Leitor', 'Radar', 'Ponto', 'Eco'];
const ALIAS_SUFFIXES = ['Livre', 'Civico', 'Urbano', 'Global', 'Local', 'Aberto'];

const SEEDED_THREADS = {
  'corredor-verde-regional': [
    {
      author: 'Voz Urbana',
      tone: 'analise',
      body: 'Esse tipo de obra mexe mais com produtividade do que parece. Quando o deslocamento melhora, o comercio local responde bem rapido.',
      likes: 12,
    },
    {
      author: 'Pulso Local',
      tone: 'pergunta',
      body: 'Minha duvida e se a prefeitura vai conseguir manter a operacao e a manutencao depois da inauguracao.',
      likes: 5,
    },
  ],
  'marco-ia-congresso': [
    {
      author: 'Leitor Civico',
      tone: 'analise',
      body: 'A discussao ficou interessante porque agora nao e so tecnologia. Virou tema de governanca, mercado e reputacao ao mesmo tempo.',
      likes: 18,
    },
    {
      author: 'Ponto Aberto',
      tone: 'concordo',
      body: 'Se vier clareza regulatoria, muita empresa vai conseguir tirar projeto de IA do piloto e colocar em producao com menos receio.',
      likes: 9,
    },
    {
      author: 'Eco Global',
      tone: 'discordo',
      body: 'Regra demais cedo demais tambem pode travar inovacao. O equilibrio vai ser o ponto mais delicado.',
      likes: 7,
    },
  ],
  'diplomacia-oriente-medio': [
    {
      author: 'Radar Livre',
      tone: 'analise',
      body: 'Quando esse tema esquenta, energia e logistica sentem primeiro. O impacto economico quase sempre chega antes da manchete amadurecer.',
      likes: 14,
    },
    {
      author: 'Leitor Global',
      tone: 'pergunta',
      body: 'Queria ver mais contexto historico nessas negociaes, porque so a manchete nao explica por que a tensao sobe tao rapido.',
      likes: 6,
    },
  ],
  'chips-infra-ia': [
    {
      author: 'Pulso Tech',
      tone: 'concordo',
      body: 'Infra de IA virou o novo campo de batalha real. Quem controla energia, chip e inferencia controla o ritmo do mercado.',
      likes: 16,
    },
    {
      author: 'Voz de Produto',
      tone: 'analise',
      body: 'O mais importante e que agora custo de operacao entrou na conversa. Nao adianta benchmark forte sem previsibilidade de uso.',
      likes: 11,
    },
  ],
  'servis-automacao-operacional': [
    {
      author: 'Eco Operacional',
      tone: 'analise',
      body: 'No setor de servicos, produtividade sem padrao de execucao vira confusao. Gostei de ver a pauta olhando margem e SLA junto.',
      likes: 13,
    },
    {
      author: 'Ponto Livre',
      tone: 'concordo',
      body: 'Automacao ajuda, mas so funciona quando o time entende o processo. Ferramenta sem treinamento nao resolve gargalo antigo.',
      likes: 8,
    },
  ],
};

function buildSeedComment(slug, index, item) {
  return {
    id: `seed-${slug}-${index + 1}`,
    slug,
    author: item.author,
    tone: VALID_TONES.includes(item.tone) ? item.tone : 'analise',
    body: item.body,
    likes: item.likes ?? 0,
    createdAt: new Date(Date.now() - (index + 1) * 60 * 60 * 1000).toISOString(),
  };
}

function seedCommentsStore(force = false) {
  if (!force && fs.existsSync(STORE_PATH)) {
    try {
      const existing = JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));
      if (existing && typeof existing === 'object' && !Array.isArray(existing) && Object.keys(existing).length > 0) {
        return existing;
      }
    } catch (error) {
      // fall through and rewrite
    }
  }

  const seededStore = Object.entries(SEEDED_THREADS).reduce((accumulator, [slug, comments]) => {
    accumulator[slug] = comments.map((item, index) => buildSeedComment(slug, index, item));
    return accumulator;
  }, {});

  fs.writeFileSync(STORE_PATH, JSON.stringify(seededStore, null, 2));
  return seededStore;
}

function readCommentsStore() {
  try {
    return seedCommentsStore(false);
  } catch (error) {
    return seedCommentsStore(true);
  }
}

function writeCommentsStore(store) {
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
}

function buildAnonymousAlias() {
  const prefix = ALIAS_PREFIXES[Math.floor(Math.random() * ALIAS_PREFIXES.length)];
  const suffix = ALIAS_SUFFIXES[Math.floor(Math.random() * ALIAS_SUFFIXES.length)];
  const code = Math.floor(100 + Math.random() * 900);
  return `${prefix} ${suffix} ${code}`;
}

function sanitizeAuthor(author) {
  const trimmed = String(author || '').trim().slice(0, 30);
  return trimmed || buildAnonymousAlias();
}

function getCommentsBySlug(slug) {
  const store = readCommentsStore();
  const comments = store[slug] || [];
  return [...comments].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

function addComment(slug, payload = {}) {
  const body = String(payload.body || '').trim().slice(0, 700);
  const tone = VALID_TONES.includes(payload.tone) ? payload.tone : 'analise';

  if (body.length < 3) {
    throw new Error('Comentario muito curto.');
  }

  const store = readCommentsStore();
  const current = store[slug] || [];
  const comment = {
    id: randomUUID().slice(0, 12),
    slug,
    author: sanitizeAuthor(payload.author),
    tone,
    body,
    likes: 0,
    createdAt: new Date().toISOString(),
  };

  store[slug] = [comment, ...current].slice(0, 150);
  writeCommentsStore(store);

  return {
    comment,
    count: store[slug].length,
  };
}

function getCommentCountsMap() {
  const store = readCommentsStore();
  return Object.entries(store).reduce((accumulator, [slug, comments]) => {
    accumulator[slug] = comments.length;
    return accumulator;
  }, {});
}

function getTrendingDebates(articles = [], limit = 6) {
  const counts = getCommentCountsMap();
  const latestBySlug = new Map();

  articles.forEach((article) => {
    if (!latestBySlug.has(article.slug)) {
      latestBySlug.set(article.slug, article);
    }
  });

  return Array.from(latestBySlug.values())
    .map((article) => ({
      id: article.id,
      slug: article.slug,
      scope: article.scope,
      title: article.title,
      summary: article.summary,
      category: article.category,
      scopeLabel: article.scopeLabel,
      categoryLabel: article.categoryLabel,
      imageUrl: article.imageUrl,
      videoEmbedUrl: article.videoEmbedUrl,
      url: article.url,
      location: article.location,
      readingTime: article.readingTime,
      content: article.content,
      debatePrompt: article.debatePrompt,
      commentCount: counts[article.slug] || 0,
      source: article.source,
    }))
    .sort((a, b) => {
      if (b.commentCount !== a.commentCount) {
        return b.commentCount - a.commentCount;
      }

      return a.title.localeCompare(b.title);
    })
    .slice(0, limit);
}

module.exports = {
  addComment,
  getCommentCountsMap,
  getCommentsBySlug,
  getTrendingDebates,
  seedCommentsStore,
};

const SOURCE_CATALOG = {
  openalex: {
    id: 'openalex',
    name: 'OpenAlex',
    category: 'academica',
    trustLabel: 'Base academica',
    siteUrl: 'https://openalex.org/',
    note: 'Indice academico aberto para artigos, autores, instituicoes e areas.',
  },
  scielo: {
    id: 'scielo',
    name: 'SciELO',
    category: 'academica',
    trustLabel: 'Periodicos revisados',
    siteUrl: 'https://scielo.org/',
    note: 'Colecao ibero-americana com forte cobertura em portugues e espanhol.',
  },
  arxiv: {
    id: 'arxiv',
    name: 'arXiv',
    category: 'academica',
    trustLabel: 'Preprints academicos',
    siteUrl: 'https://arxiv.org/',
    note: 'Repositorio de preprints muito usado em computacao, matematica e fisica.',
  },
  crossref: {
    id: 'crossref',
    name: 'Crossref',
    category: 'academica',
    trustLabel: 'DOI e citacao',
    siteUrl: 'https://search.crossref.org/',
    note: 'Indice de metadados e DOIs para rastrear artigos, livros e citacoes.',
  },
  googlebooks: {
    id: 'googlebooks',
    name: 'Google Books',
    category: 'livro',
    trustLabel: 'Livros e previas',
    siteUrl: 'https://books.google.com/',
    note: 'Catalogo com previas, ficha editorial e autores para pesquisa rapida.',
  },
  openlibrary: {
    id: 'openlibrary',
    name: 'Open Library',
    category: 'livro',
    trustLabel: 'Catalogo aberto',
    siteUrl: 'https://openlibrary.org/',
    note: 'Catalogo aberto de livros, edicoes e referencias bibliograficas.',
  },
  gutenberg: {
    id: 'gutenberg',
    name: 'Project Gutenberg',
    category: 'livro',
    trustLabel: 'Dominio publico',
    siteUrl: 'https://www.gutenberg.org/',
    note: 'Livros em dominio publico com texto integral para leitura e citacao.',
  },
  worldpulse: {
    id: 'worldpulse',
    name: 'Cadernos World Pulse',
    category: 'autoral',
    trustLabel: 'Texto autoral',
    siteUrl: null,
    note: 'Guias autorais do portal para orientar leitura, comparacao e revisao.',
  },
};

const AREA_LABELS = {
  todas: 'Todas as areas',
  ia: 'Inteligencia Artificial',
  economia: 'Economia',
  politica: 'Politica',
  historia: 'Historia',
  sociologia: 'Sociologia',
  literatura: 'Literatura',
  tecnologia: 'Tecnologia',
  filosofia: 'Filosofia',
  educacao: 'Educacao',
};

const LEVEL_LABELS = {
  todos: 'Todos os niveis',
  medio: 'Ensino medio',
  vestibular: 'Vestibular',
  graduacao: 'Graduacao',
  pos: 'Pos-graduacao',
};

const TYPE_LABELS = {
  todos: 'Tudo',
  academica: 'Artigos academicos',
  livro: 'Livros',
  autoral: 'Textos autorais',
};

const STUDY_LIBRARY = [
  {
    id: 'study-ia-1',
    slug: 'attention-is-all-you-need',
    type: 'academica',
    area: 'ia',
    level: 'graduacao',
    title: 'Attention Is All You Need',
    authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar'],
    year: 2017,
    sourceId: 'arxiv',
    sourceUrl: 'https://arxiv.org/abs/1706.03762',
    summary:
      'Artigo base para entender transformers, atencao e a virada que redefiniu NLP e grande parte da IA generativa.',
    whyItMatters:
      'Leitura-chave para estudantes que querem sair do nivel de noticia e entender a arquitetura que sustenta chatbots e modelos multimodais.',
    readingPlan: [
      'Comece pela introducao e pelo diagrama geral do encoder-decoder.',
      'Depois compare self-attention com RNNs para entender o ganho estrutural.',
      'Feche lendo a secao de resultados e limites de custo computacional.',
    ],
    tags: ['transformers', 'llm', 'nlp', 'arquitetura'],
    access: 'aberto',
    content: [
      'O texto introduz um modelo baseado inteiramente em mecanismos de atencao, retirando recorrencia e convolucao do centro da arquitetura.',
      'Para estudo, o ponto mais importante nao e decorar a formula, mas entender por que paralelismo e dependencia de longo alcance ficaram melhores.',
      'Vale fazer uma leitura comparativa com resumos atuais de LLMs para ver o que permaneceu e o que evoluiu.',
    ],
  },
  {
    id: 'study-ia-2',
    slug: 'bert-pre-training',
    type: 'academica',
    area: 'ia',
    level: 'graduacao',
    title: 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding',
    authors: ['Jacob Devlin', 'Ming-Wei Chang', 'Kenton Lee'],
    year: 2018,
    sourceId: 'arxiv',
    sourceUrl: 'https://arxiv.org/abs/1810.04805',
    summary:
      'Explica pre-treinamento bidirecional e tarefas de mascaramento, ponto de virada no entendimento de linguagem natural.',
    whyItMatters:
      'Ajuda o estudante a separar dois mundos: modelos de linguagem voltados a compreensao e modelos atuais orientados a geracao.',
    readingPlan: [
      'Leia objetivo, tarefas de pre-treinamento e benchmark.',
      'Anote diferencas entre masked language model e next sentence prediction.',
      'Relacione o artigo com a evolucao posterior de modelos generativos.',
    ],
    tags: ['bert', 'nlp', 'pre-treinamento', 'linguagem'],
    access: 'aberto',
    content: [
      'BERT mudou a pratica de NLP ao mostrar o poder de representacoes profundas e contextuais treinadas em larga escala.',
      'A leitura serve bem para disciplinas de IA, linguistica computacional e ciencia de dados aplicada.',
      'Mesmo que o estudante nao programe, o artigo ajuda a enxergar como benchmark e desenho experimental moldam a area.',
    ],
  },
  {
    id: 'study-econ-1',
    slug: 'wealth-of-nations-google-books',
    type: 'livro',
    area: 'economia',
    level: 'vestibular',
    title: 'A Riqueza das Nacoes',
    authors: ['Adam Smith'],
    year: 1776,
    sourceId: 'googlebooks',
    sourceUrl: 'https://books.google.com/books?q=A+Riqueza+das+Nacoes+Adam+Smith',
    summary:
      'Livro classico para entender divisao do trabalho, mercado e fundamentos do pensamento economico moderno.',
    whyItMatters:
      'E uma base historica forte para vestibular, graduacao e comparacao com debates atuais sobre mercado, estado e produtividade.',
    readingPlan: [
      'Foque primeiro nos capitulos sobre divisao do trabalho.',
      'Anote conceitos que ainda aparecem em macro e microeconomia.',
      'Compare a leitura com autores criticos para fugir de visao unica.',
    ],
    tags: ['economia classica', 'mercado', 'estado', 'historia do pensamento'],
    access: 'previa e catalogo',
    content: [
      'Mesmo sendo um texto do seculo XVIII, o livro segue vivo em cursos introdutorios por organizar perguntas fundamentais sobre producao, troca e valor.',
      'Para estudantes, funciona melhor quando lido com mapa conceitual e comparacao com economia contemporanea.',
      'Nao e preciso ler tudo de uma vez: a entrada pelos conceitos centrais rende muito mais.',
    ],
  },
  {
    id: 'study-econ-2',
    slug: 'capital-21st-century',
    type: 'livro',
    area: 'economia',
    level: 'graduacao',
    title: 'O Capital no Seculo XXI',
    authors: ['Thomas Piketty'],
    year: 2013,
    sourceId: 'googlebooks',
    sourceUrl: 'https://books.google.com/books?q=O+Capital+no+Seculo+XXI+Thomas+Piketty',
    summary:
      'Livro contemporaneo sobre concentracao de renda, capital e desigualdade com forte base historica e estatistica.',
    whyItMatters:
      'Ajuda a conectar economia, politica e desigualdade, algo muito util para estudantes de humanas e relacoes internacionais.',
    readingPlan: [
      'Comece por prefacio, introducao e conclusoes para montar a tese geral.',
      'Volte aos capitulos com series historicas para entender metodo.',
      'Compare a obra com criticas para treinar leitura academica equilibrada.',
    ],
    tags: ['desigualdade', 'capital', 'politica economica', 'dados historicos'],
    access: 'previa e catalogo',
    content: [
      'A forca do livro esta em organizar series longas de patrimonio e renda para discutir concentracao economica.',
      'O estudante ganha muito quando observa nao apenas a tese, mas o metodo comparativo que sustenta a argumentacao.',
      'Vale usar a obra como ponte entre macroeconomia, historia economica e ciencia politica.',
    ],
  },
  {
    id: 'study-pol-1',
    slug: 'democracia-digital-scielo',
    type: 'academica',
    area: 'politica',
    level: 'graduacao',
    title: 'Democracia digital, plataformas e participacao politica',
    authors: ['Coletanea SciELO'],
    year: 2023,
    sourceId: 'scielo',
    sourceUrl: 'https://search.scielo.org/?q=democracia+digital+participacao+politica',
    summary:
      'Busca guiada em periodicos SciELO sobre participacao politica, plataformas digitais e reconfiguracao do debate publico.',
    whyItMatters:
      'Entrega ao estudante um corredor de leitura em portugues para discutir redes, esfera publica e mediacao algoritmica.',
    readingPlan: [
      'Abra os resultados e separe artigos teoricos de estudos empiricos.',
      'Monte tabela com objeto, metodo e conclusao de cada texto.',
      'Use a comparacao para produzir repertorio autoral em redacoes e trabalhos.',
    ],
    tags: ['democracia digital', 'plataformas', 'participacao', 'algoritmos'],
    access: 'busca academica',
    content: [
      'Em vez de um unico artigo, esta entrada funciona como trilha segura de busca dentro da SciELO.',
      'O valor pedagogico aqui esta em aprender a buscar por conceito, metodo e recorte temporal.',
      'Isso ajuda o estudante a sair do resumo pronto e desenvolver repertorio com autoria.',
    ],
  },
  {
    id: 'study-pol-2',
    slug: 'federalist-papers',
    type: 'livro',
    area: 'politica',
    level: 'graduacao',
    title: 'The Federalist Papers',
    authors: ['Alexander Hamilton', 'James Madison', 'John Jay'],
    year: 1788,
    sourceId: 'gutenberg',
    sourceUrl: 'https://www.gutenberg.org/ebooks/1404',
    summary:
      'Colecao de textos politicos fundamentais sobre representacao, freios e contrapesos e desenho institucional.',
    whyItMatters:
      'Funciona como base historica para direito constitucional, ciencia politica e debates sobre separacao de poderes.',
    readingPlan: [
      'Comece pelos ensaios sobre faccoes e desenho institucional.',
      'Leia com glossario politico para evitar perder tempo em linguagem antiga.',
      'Compare com debates constitucionais contemporaneos para atualizar conceitos.',
    ],
    tags: ['instituicoes', 'constitucionalismo', 'representacao', 'estado'],
    access: 'texto integral',
    content: [
      'A leitura mostra como principios institucionais foram justificados em um momento de fundacao politica.',
      'Para o estudante brasileiro, o ganho esta em comparar teoria institucional com realidades historicas distintas.',
      'E uma excelente base para produzir texto autoral com repertorio forte.',
    ],
  },
  {
    id: 'study-hist-1',
    slug: 'casa-grande-senzala-openlibrary',
    type: 'livro',
    area: 'historia',
    level: 'graduacao',
    title: 'Casa-Grande & Senzala',
    authors: ['Gilberto Freyre'],
    year: 1933,
    sourceId: 'openlibrary',
    sourceUrl: 'https://openlibrary.org/search?q=Casa-Grande+%26+Senzala+Gilberto+Freyre',
    summary:
      'Livro central para discutir formacao social brasileira, identidade, colonizacao e interpretacoes classicas do Brasil.',
    whyItMatters:
      'Importa tanto pela influencia quanto pelas criticas posteriores, o que o torna ideal para estudo comparado e leitura critica.',
    readingPlan: [
      'Leia apresentacao e capitulos iniciais com foco em tese central.',
      'Anote categorias do autor e onde elas foram criticadas depois.',
      'Junte a leitura com autores contemporaneos para evitar canonizacao sem critica.',
    ],
    tags: ['brasil', 'colonizacao', 'identidade', 'historia social'],
    access: 'catalogo aberto',
    content: [
      'Mais do que concordar ou discordar da obra, o estudante precisa entender por que ela se tornou influente.',
      'O uso pedagogico melhor acontece quando o livro e lido ao lado de revisoes historiograficas e sociologicas.',
      'Isso fortalece analise autoral e evita resumo mecanico.',
    ],
  },
  {
    id: 'study-soc-1',
    slug: 'vigilancia-capitalismo',
    type: 'livro',
    area: 'sociologia',
    level: 'graduacao',
    title: 'A Era do Capitalismo de Vigilancia',
    authors: ['Shoshana Zuboff'],
    year: 2019,
    sourceId: 'googlebooks',
    sourceUrl: 'https://books.google.com/books?q=A+Era+do+Capitalismo+de+Vigilancia+Shoshana+Zuboff',
    summary:
      'Discussao ampla sobre plataformas, extracao de dados, poder informacional e reorganizacao do capitalismo digital.',
    whyItMatters:
      'E um bom ponto de partida para estudantes de comunicacao, sociologia e tecnologia interessados em poder de plataforma.',
    readingPlan: [
      'Leia introducao e conclusao para visualizar a tese maior.',
      'Volte aos capitulos sobre dados comportamentais e previsao.',
      'Use exemplos atuais para testar a capacidade explicativa do conceito.',
    ],
    tags: ['plataformas', 'dados', 'capitalismo', 'vigilancia'],
    access: 'previa e catalogo',
    content: [
      'O livro organiza um vocabulario muito util para interpretar negocios digitais e assimetria informacional.',
      'Para estudo, vale destacar conceito, evidencia e alcance do argumento.',
      'Tambem e importante confrontar a obra com estudos mais empiricos para evitar leitura totalizante.',
    ],
  },
  {
    id: 'study-lit-1',
    slug: 'dom-casmurro',
    type: 'livro',
    area: 'literatura',
    level: 'medio',
    title: 'Dom Casmurro',
    authors: ['Machado de Assis'],
    year: 1899,
    sourceId: 'gutenberg',
    sourceUrl: 'https://www.gutenberg.org/ebooks/55752',
    summary:
      'Romance central para vestibular e ensino medio, com foco em narrador, ironia, memoria e ambiguidade.',
    whyItMatters:
      'E leitura recorrente em vestibulares e excelente treino para interpretacao fina e repertorio autoral.',
    readingPlan: [
      'Leia por blocos e marque mudancas de tom do narrador.',
      'Observe como a memoria constrói e distorce os fatos.',
      'Feche com uma lista de passagens para repertorio em redacao e prova.',
    ],
    tags: ['machado', 'vestibular', 'narrador', 'ambiguidade'],
    access: 'texto integral',
    content: [
      'Dom Casmurro funciona muito bem para ensinar que leitura literaria nao se resume a enredo.',
      'O estudante ganha mais quando observa narrador, estrategia de convencimento e lacunas do texto.',
      'Isso gera interpretacao mais autoral e foge da resposta decorada.',
    ],
  },
  {
    id: 'study-phil-1',
    slug: 'discurso-metodo',
    type: 'livro',
    area: 'filosofia',
    level: 'vestibular',
    title: 'Discurso do Metodo',
    authors: ['Rene Descartes'],
    year: 1637,
    sourceId: 'gutenberg',
    sourceUrl: 'https://www.gutenberg.org/ebooks/59',
    summary:
      'Texto basico para entender racionalismo, metodo e fundacao da filosofia moderna.',
    whyItMatters:
      'Ajuda estudantes a construir repertorio de epistemologia e pensamento moderno em provas e ensaios.',
    readingPlan: [
      'Leia as partes sobre duvida metodica e criterio de evidencia.',
      'Resuma a sequencia do metodo em linguagem propria.',
      'Compare com empiristas e com ciencia contemporanea.',
    ],
    tags: ['filosofia moderna', 'metodo', 'epistemologia', 'racionalismo'],
    access: 'texto integral',
    content: [
      'O texto serve como porta de entrada para uma forma de pensar problema, criterio e certeza.',
      'Para nao travar na linguagem, vale ler uma introducao breve antes do original.',
      'Depois disso, o estudante consegue extrair argumentos com mais autonomia.',
    ],
  },
  {
    id: 'study-edu-1',
    slug: 'caderno-metodo-estudo',
    type: 'autoral',
    area: 'educacao',
    level: 'todos',
    title: 'Caderno autoral: como transformar leitura em repertorio de prova e trabalho',
    authors: ['Equipe World Pulse Estudos'],
    year: 2026,
    sourceId: 'worldpulse',
    sourceUrl: null,
    summary:
      'Guia autoral com metodo de fichamento, comparacao de autores e criacao de repertorio para redacao, seminario e artigo.',
    whyItMatters:
      'Nao entrega resposta pronta. Ensina o estudante a produzir sua propria sintese com base em leitura confiavel.',
    readingPlan: [
      'Escolha uma fonte academica, um livro e um texto de apoio.',
      'Faca ficha unica com tese, evidencia e conceito central de cada um.',
      'Feche com um paragrafo autoral que conecte as tres leituras.',
    ],
    tags: ['fichamento', 'metodo de estudo', 'repertorio', 'redacao'],
    access: 'guia interno',
    content: [
      'Leitura boa nao vira repertorio sozinha. E preciso extrair tese, conceito, exemplo e pergunta.',
      'O texto orienta o estudante a sair da copia passiva e montar comparacoes entre fontes.',
      'Quando o aluno aprende a comparar, ele ganha autonomia para escrever com voz propria.',
    ],
  },
  {
    id: 'study-edu-2',
    slug: 'caderno-ler-artigo',
    type: 'autoral',
    area: 'educacao',
    level: 'graduacao',
    title: 'Caderno autoral: como ler artigo academico sem se perder no jargao',
    authors: ['Equipe World Pulse Estudos'],
    year: 2026,
    sourceId: 'worldpulse',
    sourceUrl: null,
    summary:
      'Roteiro autoral para localizar problema, metodo, resultados e limites de um paper de forma rapida e inteligente.',
    whyItMatters:
      'Ajuda principalmente quem entra na graduacao e ainda nao sabe por onde comecar a leitura academica.',
    readingPlan: [
      'Leia titulo, resumo, conclusao e apenas depois o corpo do paper.',
      'Marque pergunta central, metodo e duas limitacoes do estudo.',
      'Transforme isso em ficha de uma pagina para revisao futura.',
    ],
    tags: ['paper', 'metodo', 'graduacao', 'leitura academica'],
    access: 'guia interno',
    content: [
      'Muita gente tenta ler artigo do inicio ao fim como se fosse reportagem e se perde.',
      'O caderno ensina uma ordem de leitura mais eficiente para estudantes em fase inicial.',
      'A meta nao e impressionar; e compreender a estrutura do argumento e registrar o essencial.',
    ],
  },
  {
    id: 'study-tech-1',
    slug: 'deep-learning-book',
    type: 'livro',
    area: 'tecnologia',
    level: 'pos',
    title: 'Deep Learning',
    authors: ['Ian Goodfellow', 'Yoshua Bengio', 'Aaron Courville'],
    year: 2016,
    sourceId: 'openlibrary',
    sourceUrl: 'https://openlibrary.org/search?q=Deep+Learning+Goodfellow+Bengio+Courville',
    summary:
      'Livro tecnico de referencia para redes neurais, treinamento, regularizacao e fundamentos matematicos.',
    whyItMatters:
      'Para estudantes avancados, funciona como ponte entre intuicao conceitual e formalizacao mais dura.',
    readingPlan: [
      'Leia primeiro os capitulos introdutorios para mapear termos.',
      'Depois escolha apenas o bloco ligado ao seu tema de curso ou projeto.',
      'Monte glossario proprio para nao se afogar em notacao.',
    ],
    tags: ['deep learning', 'redes neurais', 'matematica', 'ml'],
    access: 'catalogo aberto',
    content: [
      'O livro e volumoso, entao o estudante nao deve tentar cobrir tudo logo de inicio.',
      'O ideal e usar por trilhas de assunto, sempre com objetivo claro.',
      'Assim a leitura vira ferramenta de projeto, nao peso acumulado.',
    ],
  },
  {
    id: 'study-hist-2',
    slug: 'michelet-french-revolution',
    type: 'livro',
    area: 'historia',
    level: 'vestibular',
    title: 'A Revolucao Francesa',
    authors: ['Jules Michelet'],
    year: 1847,
    sourceId: 'openlibrary',
    sourceUrl: 'https://openlibrary.org/search?q=Revolucao+Francesa+Michelet',
    summary:
      'Entrada de catalogo para uma obra historica classica que ajuda no estudo de revolucao, cidadania e modernidade politica.',
    whyItMatters:
      'Ajuda estudantes a ligar evento historico, interpretacao e memoria politica em um mesmo percurso.',
    readingPlan: [
      'Mapeie primeiro o evento em livro didatico ou linha do tempo.',
      'Depois use a obra como aprofundamento interpretativo.',
      'Compare linguagem historica classica com abordagem mais atual.',
    ],
    tags: ['revolucao francesa', 'historia moderna', 'cidadania', 'estado'],
    access: 'catalogo aberto',
    content: [
      'Nao e uma leitura para decorar fatos, mas para sentir como um grande evento e narrado e interpretado.',
      'O estudante ganha mais quando combina esta leitura com fontes didaticas contemporaneas.',
      'Isso cria repertorio historico e senso de interpretacao.',
    ],
  },
];

const PROVIDER_BLUEPRINTS = [
  {
    id: 'openalex-live',
    label: 'OpenAlex ao vivo',
    description: 'Pronto para integrar busca real de artigos e autores por assunto.',
  },
  {
    id: 'crossref-live',
    label: 'Crossref ao vivo',
    description: 'Estrutura pronta para DOI, metadados e trilhas de citacao.',
  },
  {
    id: 'google-books-live',
    label: 'Google Books ao vivo',
    description: 'Pronto para catalogo, previas e busca de livros por topico.',
  },
];

const withLabels = (item) => {
  const source = SOURCE_CATALOG[item.sourceId];
  return {
    ...item,
    typeLabel: TYPE_LABELS[item.type],
    areaLabel: AREA_LABELS[item.area],
    levelLabel: LEVEL_LABELS[item.level],
    sourceName: source.name,
    sourceCategory: source.category,
    sourceTrustLabel: source.trustLabel,
    sourceNote: source.note,
    siteUrl: source.siteUrl,
  };
};

const matchesQuery = (item, query) => {
  if (!query) {
    return true;
  }

  const haystack = [
    item.title,
    item.summary,
    item.whyItMatters,
    item.areaLabel,
    item.levelLabel,
    item.typeLabel,
    item.sourceName,
    ...(item.authors || []),
    ...(item.tags || []),
    ...(item.content || []),
  ]
    .join(' ')
    .toLowerCase();

  return haystack.includes(query.toLowerCase());
};

const searchStudyMaterials = ({ query = '', type = 'todos', area = 'todas', level = 'todos', limit = 12 }) => {
  const normalizedItems = STUDY_LIBRARY.map(withLabels);

  const filtered = normalizedItems
    .filter((item) => (type === 'todos' ? true : item.type === type))
    .filter((item) => (area === 'todas' ? true : item.area === area))
    .filter((item) => (level === 'todos' ? true : item.level === level || item.level === 'todos'))
    .filter((item) => matchesQuery(item, query))
    .sort((left, right) => right.year - left.year);

  return {
    total: filtered.length,
    query,
    filters: { type, area, level },
    items: filtered.slice(0, Number(limit) || 12),
  };
};

const getStudyHubData = () => {
  const enrichedItems = STUDY_LIBRARY.map(withLabels);
  const counters = enrichedItems.reduce(
    (accumulator, item) => {
      accumulator.total += 1;
      accumulator.byType[item.type] = (accumulator.byType[item.type] || 0) + 1;
      accumulator.byArea[item.area] = (accumulator.byArea[item.area] || 0) + 1;
      return accumulator;
    },
    {
      total: 0,
      byType: {},
      byArea: {},
    },
  );

  return {
    title: 'Area do estudante',
    summary:
      'Buscador de assuntos voltado a estudo serio, limitado a fontes academicas, livros e textos autorais com curadoria clara.',
    guardrail:
      'Aqui a busca nao mistura rumor, opiniao solta ou conteudo raso. O foco e material confiavel para leitura, ficha e repertorio.',
    suggestedQueries: ['transformers', 'desigualdade', 'democracia digital', 'machado de assis', 'metodo cientifico'],
    sources: Object.values(SOURCE_CATALOG),
    sourcePolicy: [
      'Artigos apenas em bases academicas ou repositorios reconhecidos.',
      'Livros apenas em catalogos, previas ou acervos abertos confiaveis.',
      'Textos autorais apenas na colecao interna de estudo do World Pulse.',
    ],
    featured: enrichedItems.slice(0, 4),
    providerBlueprints: PROVIDER_BLUEPRINTS,
    areas: Object.entries(AREA_LABELS).map(([value, label]) => ({ value, label })),
    levels: Object.entries(LEVEL_LABELS).map(([value, label]) => ({ value, label })),
    types: Object.entries(TYPE_LABELS).map(([value, label]) => ({ value, label })),
    counters,
  };
};

module.exports = {
  getStudyHubData,
  searchStudyMaterials,
};

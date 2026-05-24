const CIVIC_TARGETS = [
  {
    id: 'cmfor',
    name: 'Camara Municipal de Fortaleza',
    scope: 'Municipal',
    focus: 'Vereadores, contratos, licitacoes, servidores, diarias e despesas da Camara.',
    officialUrl: 'https://portaltransparencia.cmfor.ce.gov.br/',
    domains: ['portaltransparencia.cmfor.ce.gov.br', 'cmfor.ce.gov.br', 'api.cmfor.ce.gov.br'],
    queries: [
      'site:portaltransparencia.cmfor.ce.gov.br contratos vereadores',
      'site:portaltransparencia.cmfor.ce.gov.br licitacoes gabinete',
      'site:api.cmfor.ce.gov.br/transparencia/public filetype:pdf contrato gabinete',
      'site:portaltransparencia.cmfor.ce.gov.br despesas servidores',
    ],
  },
  {
    id: 'alece',
    name: 'Assembleia Legislativa do Ceara',
    scope: 'Estadual',
    focus: 'Deputados estaduais, verbas, emendas, contratos, pessoal, despesas e remuneracao.',
    officialUrl: 'https://transparencia.al.ce.gov.br/',
    domains: ['transparencia.al.ce.gov.br', 'al.ce.gov.br'],
    queries: [
      'site:transparencia.al.ce.gov.br contratos deputados',
      'site:transparencia.al.ce.gov.br licitacoes despesas',
      'site:transparencia.al.ce.gov.br remuneracao servidores',
      'site:transparencia.al.ce.gov.br emendas parlamentares',
    ],
  },
  {
    id: 'prefeitura-fortaleza',
    name: 'Prefeitura de Fortaleza',
    scope: 'Municipal',
    focus: 'Contratos, fornecedores, licitacoes, despesas, convenios, pagamentos e execucao orcamentaria.',
    officialUrl: 'https://transparencia.fortaleza.ce.gov.br/',
    domains: ['transparencia.fortaleza.ce.gov.br', 'compras.sepog.fortaleza.ce.gov.br', 'fortaleza.ce.gov.br'],
    queries: [
      'site:transparencia.fortaleza.ce.gov.br contrato fornecedor',
      'site:transparencia.fortaleza.ce.gov.br licitacoes objeto valor',
      'site:transparencia.fortaleza.ce.gov.br despesas favorecido empenho',
      'site:compras.sepog.fortaleza.ce.gov.br filetype:pdf edital contrato',
    ],
  },
  {
    id: 'governo-ceara',
    name: 'Governo do Estado do Ceara',
    scope: 'Estadual',
    focus: 'Secretarias, contratos, obras, convenios, despesas, servidores e compras estaduais.',
    officialUrl: 'https://cearatransparente.ce.gov.br/',
    domains: ['cearatransparente.ce.gov.br', 'cge.ce.gov.br', 'sefaz.ce.gov.br'],
    queries: [
      'site:cearatransparente.ce.gov.br contratos secretaria',
      'site:cearatransparente.ce.gov.br despesas fornecedor',
      'site:cearatransparente.ce.gov.br servidores remuneracao',
      'site:cge.ce.gov.br transparencia contratos convenios',
    ],
  },
  {
    id: 'tce-ce',
    name: 'TCE Ceara',
    scope: 'Controle externo',
    focus: 'Contas publicas, municipios, alertas, fiscalizacao, processos e cruzamento de dados.',
    officialUrl: 'https://www.tce.ce.gov.br/',
    domains: ['tce.ce.gov.br', 'municipios.tce.ce.gov.br'],
    queries: [
      'site:tce.ce.gov.br processo contas publicas Ceara',
      'site:tce.ce.gov.br fiscalizacao contratos municipios',
      'site:municipios.tce.ce.gov.br transparencia municipios despesas',
      'site:tce.ce.gov.br alertas licitacoes contratos',
    ],
  },
  {
    id: 'tse',
    name: 'TSE / Divulgacandcontas',
    scope: 'Eleitoral',
    focus: 'Candidaturas, prestacao de contas, doacoes eleitorais, fornecedores de campanha e processos eleitorais.',
    officialUrl: 'https://divulgacandcontas.tse.jus.br/',
    domains: ['divulgacandcontas.tse.jus.br', 'tse.jus.br'],
    queries: [
      'site:divulgacandcontas.tse.jus.br candidato Ceara prestacao de contas',
      'site:tse.jus.br contas eleitorais fornecedores campanha Ceara',
      'site:tse.jus.br processo eleitoral candidato Ceara',
      'site:divulgacandcontas.tse.jus.br doadores campanha Ceara',
    ],
  },
];

const CROSSCHECKS = [
  'Gastos de gabinete',
  'Notas fiscais e empenhos',
  'Empresas fornecedoras',
  'Socios das empresas',
  'Doacoes eleitorais',
  'Contratos publicos',
  'Licitacoes vencidas',
  'Cargos comissionados e possiveis vinculos familiares',
  'Processos no TCE',
  'Processos eleitorais no TSE',
  'Sancoes e empresas impedidas',
  'Emendas parlamentares',
];

const SCORE_BANDS = [
  { min: 0, max: 20, label: 'Sem alertas relevantes', tone: 'baixo' },
  { min: 21, max: 40, label: 'Baixa inconsistencia documental', tone: 'baixo' },
  { min: 41, max: 60, label: 'Atencao moderada', tone: 'medio' },
  { min: 61, max: 80, label: 'Alto volume de inconsistencias', tone: 'alto' },
  { min: 81, max: 100, label: 'Exige auditoria manual urgente', tone: 'critico' },
];

const FINDING_TYPES = [
  {
    id: 'contratos',
    label: 'Contratos e fornecedores',
    weight: 18,
    pattern: ['contrato', 'fornecedor', 'empenho', 'pagamento'],
  },
  {
    id: 'licitacoes',
    label: 'Licitacoes e dispensas',
    weight: 16,
    pattern: ['licitacao', 'dispensa', 'inexigibilidade', 'edital'],
  },
  {
    id: 'pessoal',
    label: 'Pessoal, cargos e remuneracao',
    weight: 14,
    pattern: ['servidor', 'cargo', 'remuneracao', 'gabinete'],
  },
  {
    id: 'controle',
    label: 'TCE, sancoes e processos',
    weight: 20,
    pattern: ['tce', 'processo', 'sancao', 'impedida'],
  },
  {
    id: 'eleitoral',
    label: 'Contas eleitorais e doacoes',
    weight: 16,
    pattern: ['tse', 'doacao', 'campanha', 'candidato'],
  },
  {
    id: 'emendas',
    label: 'Emendas e execucao orcamentaria',
    weight: 16,
    pattern: ['emenda', 'orcamento', 'despesa', 'convenio'],
  },
];

const normalize = (value = '') =>
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const buildGoogleUrl = (query) => `https://www.google.com/search?q=${encodeURIComponent(query)}`;

const getBand = (score) => SCORE_BANDS.find((band) => score >= band.min && score <= band.max) || SCORE_BANDS[0];

const calculateSignals = ({ query = '', targets = [] }) => {
  const normalizedQuery = normalize(query);
  const targetText = normalize(targets.map((target) => `${target.name} ${target.focus}`).join(' '));
  const sourceText = `${normalizedQuery} ${targetText}`;

  return FINDING_TYPES.map((type) => {
    const hits = type.pattern.filter((term) => sourceText.includes(normalize(term))).length;
    const active = hits > 0 || targets.length > 2;
    const score = active ? Math.min(type.weight, 8 + hits * 5 + targets.length * 2) : 0;

    return {
      id: type.id,
      label: type.label,
      score,
      status: active ? 'verificar' : 'sem sinal',
      note: active
        ? `Ha termos ou bases relacionadas a ${type.label}. Trate como indicio documental e valide na fonte oficial.`
        : `Nenhum sinal forte de ${type.label} nesta busca inicial.`,
    };
  });
};

const searchCivicResearch = ({ query = '', target = 'todos' } = {}) => {
  const normalizedQuery = query.trim();
  const selectedTargets =
    target && target !== 'todos'
      ? CIVIC_TARGETS.filter((item) => item.id === target)
      : CIVIC_TARGETS;
  const safeQuery = normalizedQuery || 'vereadores deputados contratos licitacoes despesas Ceara';
  const signals = calculateSignals({ query: safeQuery, targets: selectedTargets });
  const score = Math.min(
    100,
    Math.round(signals.reduce((acc, signal) => acc + signal.score, 0) + selectedTargets.length * 2),
  );
  const band = getBand(score);

  const searches = selectedTargets.flatMap((item) =>
    item.queries.slice(0, 3).map((operator) => {
      const composedQuery = normalizedQuery ? `${operator} "${normalizedQuery}"` : operator;
      return {
        targetId: item.id,
        targetName: item.name,
        query: composedQuery,
        url: buildGoogleUrl(composedQuery),
        sourceUrl: item.officialUrl,
        reason: `Consulta avancada restrita a fonte publica ligada a ${item.name}.`,
      };
    }),
  );

  return {
    query: safeQuery,
    score,
    band,
    disclaimer:
      'Resultado automatizado nao acusa irregularidade. Ele indica achados publicos que exigem verificacao humana e leitura dos documentos originais.',
    privacy:
      'Nao colete CPF, endereco, telefone, dados familiares sensiveis ou dados pessoais sem finalidade legitima, base legal e minimizacao conforme LGPD.',
    signals,
    searches,
    nextSteps: [
      'Abrir a fonte oficial e salvar o link permanente do documento.',
      'Registrar data, orgao, valor, favorecido, processo e numero do contrato ou licitacao.',
      'Cruzar fornecedor com quadro societario, sancoes, contratos repetidos e doacoes eleitorais quando houver base publica.',
      'Separar fato comprovado, duvida documental e hipotese de investigacao.',
      'Submeter alertas relevantes a revisao humana antes de publicar conclusoes.',
    ],
  };
};

const getCivicHubData = () => ({
  title: 'Observatorio Civico',
  summary:
    'Pesquisa de transparencia publica com pegada de cyber ativismo responsavel: consultas avancadas, fontes oficiais, alertas documentais e revisao humana.',
  guardrails: [
    'Nao usar CPF como criterio de exposicao publica.',
    'Nao afirmar que alguem e corrupto sem decisao ou fonte oficial conclusiva.',
    'Usar termos como indice de transparencia documental, risco de inconsistencia e nivel de alerta publico.',
    'Tratar tudo como indicio ate haver conferencia humana.',
  ],
  targets: CIVIC_TARGETS,
  crosschecks: CROSSCHECKS,
  scoreBands: SCORE_BANDS,
  suggestedSearches: [
    'vereador contrato gabinete',
    'deputado estadual emenda fornecedor',
    'dispensa licitacao secretaria',
    'empresa fornecedora sancao TCE',
    'doacao eleitoral fornecedor campanha',
    'cargo comissionado gabinete',
  ],
});

module.exports = {
  getCivicHubData,
  searchCivicResearch,
};

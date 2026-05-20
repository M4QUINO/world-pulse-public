const formatDateParts = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Fortaleza',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    weekday: 'long',
  }).formatToParts(date);

  const get = (type) => parts.find((part) => part.type === type)?.value;

  return {
    day: get('day'),
    month: get('month'),
    year: get('year'),
    weekday: get('weekday'),
    key: `${get('month')}-${get('day')}`,
  };
};

const TODAY_BY_DATE = {
  '05-20': {
    brazil: [
      {
        title: 'Dia Nacional do Técnico e Auxiliar de Enfermagem',
        summary:
          'Reconhece profissionais essenciais no cuidado direto com pacientes e no funcionamento diario do sistema de saude.',
        source: 'Cofen / conselhos regionais de enfermagem',
      },
      {
        title: 'Dia Nacional do Pedagogo',
        summary:
          'Valoriza profissionais da educacao que organizam processos de aprendizagem e fortalecem a relacao entre escola, familia e sociedade.',
        source: 'Lei nº 13.083/2015',
      },
    ],
    world: [
      {
        title: 'Dia Mundial das Abelhas',
        summary:
          'Data reconhecida pela ONU para lembrar a importancia das abelhas e outros polinizadores para alimentos, biodiversidade e equilibrio ambiental.',
        source: 'FAO / ONU',
      },
      {
        title: 'Dia Mundial da Metrologia',
        summary:
          'Celebra a ciencia das medicoes e a assinatura da Convencao do Metro, em 20 de maio de 1875.',
        source: 'BIPM / OIML',
      },
    ],
    history: [
      {
        year: '1875',
        title: 'Convencao do Metro',
        summary: 'Acordo internacional criou a base da cooperacao global em medidas e padroes cientificos.',
      },
      {
        year: '1932',
        title: 'Amelia Earhart cruza o Atlantico',
        summary: 'A aviadora iniciou o voo solo sem escalas que a tornaria a primeira mulher a realizar o feito.',
      },
    ],
  },
};

const UPCOMING_IMPORTANT_DATES = [
  {
    date: '21 de maio',
    title: 'Dia Mundial da Diversidade Cultural para o Dialogo e o Desenvolvimento',
    scope: 'Mundo',
  },
  {
    date: '25 de maio',
    title: 'Dia da Industria',
    scope: 'Brasil',
  },
  {
    date: '5 de junho',
    title: 'Dia Mundial do Meio Ambiente',
    scope: 'Mundo',
  },
  {
    date: '12 de junho',
    title: 'Dia dos Namorados',
    scope: 'Brasil',
  },
];

const DEFAULT_TODAY = {
  brazil: [
    {
      title: 'Data brasileira em verificacao',
      summary: 'O calendario local sera ampliado com novas datas nacionais, estaduais e culturais.',
      source: 'World Pulse',
    },
  ],
  world: [
    {
      title: 'Calendario mundial em verificacao',
      summary: 'O painel destaca datas globais importantes quando houver registro confiavel para o dia.',
      source: 'World Pulse',
    },
  ],
  history: [],
};

const getTodayBrief = () => {
  const dateParts = formatDateParts();
  const dayData = TODAY_BY_DATE[dateParts.key] || DEFAULT_TODAY;

  return {
    dateLabel: `${dateParts.weekday}, ${dateParts.day}/${dateParts.month}/${dateParts.year}`,
    timezone: 'America/Fortaleza',
    ...dayData,
    upcoming: UPCOMING_IMPORTANT_DATES,
    updatedAt: new Date().toISOString(),
  };
};

module.exports = {
  getTodayBrief,
};

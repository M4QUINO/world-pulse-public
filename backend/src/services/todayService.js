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
        date: '20 de maio',
        title: 'Dia Nacional do Pedagogo',
        summary:
          'Homenageia profissionais dedicados a educacao, formacao humana, orientacao pedagogica e gestao dos processos de ensino.',
        why:
          'A data foi instituida pela Lei 13.083/2015 para valorizar especialistas em educacao e lembrar a importancia da pedagogia na escola e em outros ambientes de aprendizagem.',
        source: 'Lei 13.083/2015',
      },
      {
        date: '20 de maio',
        title: 'Dia Nacional do Medicamento Generico',
        summary:
          'Conscientiza sobre a importancia dos medicamentos genericos para ampliar o acesso a tratamentos mais baratos, seguros e eficazes.',
        why:
          'A data relembra a politica brasileira de genericos, consolidada pela Lei 9.787/1999, que fortaleceu a concorrencia e ajudou a reduzir custos para a populacao.',
        source: 'Biblioteca Virtual em Saude / Ministerio da Saude',
      },
      {
        date: '20 de maio',
        title: 'Dia do Comissario de Menores',
        summary:
          'Reconhece o trabalho de profissionais que atuam na protecao, orientacao e garantia de direitos de criancas e adolescentes.',
        why:
          'A data destaca a importancia da protecao da infancia e juventude e do acompanhamento de situacoes de risco social.',
        source: 'Calendarios civicos brasileiros',
      },
      {
        date: '20 de maio',
        title: 'Dia Nacional do Tecnico e Auxiliar de Enfermagem',
        summary:
          'Valoriza profissionais essenciais no cuidado direto com pacientes e no funcionamento diario do sistema de saude.',
        why:
          'A data foi escolhida em alusao a Ana Neri e encerra a Semana da Enfermagem, reforcando reconhecimento, seguranca e valorizacao da categoria.',
        source: 'Cofen / conselhos regionais de enfermagem',
      },
    ],
    world: [
      {
        date: '20 de maio',
        title: 'Dia Mundial das Abelhas',
        summary:
          'Data reconhecida pela ONU para lembrar a importancia das abelhas e outros polinizadores para alimentos, biodiversidade e equilibrio ambiental.',
        why:
          'Foi proclamada pela ONU para chamar atencao para a queda de polinizadores e incentivar a protecao de seus habitats.',
        source: 'FAO / ONU',
      },
      {
        date: '20 de maio',
        title: 'Dia Mundial da Metrologia',
        summary:
          'Celebra a ciencia das medicoes e a assinatura da Convencao do Metro, em 20 de maio de 1875.',
        why:
          'Existe para lembrar que padroes de medida confiaveis sustentam ciencia, comercio, industria, saude e politicas publicas.',
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
      date: 'Hoje',
      title: 'Data brasileira em verificacao',
      summary: 'O calendario local sera ampliado com novas datas nacionais, estaduais e culturais.',
      why: 'Quando nao houver data confirmada, o sistema informa que a curadoria ainda esta em verificacao.',
      source: 'World Pulse',
    },
  ],
  world: [
    {
      date: 'Hoje',
      title: 'Calendario mundial em verificacao',
      summary: 'O painel destaca datas globais importantes quando houver registro confiavel para o dia.',
      why: 'Quando nao houver data confirmada, o sistema informa que a curadoria ainda esta em verificacao.',
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

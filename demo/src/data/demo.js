/**
 * DADOS DE DEMONSTRAÇÃO — Nord Liberta
 *
 * ⚠ Todos os números aqui são ILUSTRATIVOS, de uma persona fictícia (Ricardo).
 * Não constituem metodologia oficial. A fórmula de pontuação do exame, as fórmulas
 * dos cards e as premissas de projeção seguem como LACUNA da consultoria
 * (ver especificacao-v3.md, Anexo A).
 */

export const CONSULTOR = { nome: 'Nélio Costa, CFP®', primeiroNome: 'Nélio' };

/** As 6 verticais canônicas. Gestão de Ativos fica inerte até a política chegar. */
export const VERTICAIS = {
  FINANCEIRA: { id: 'financeira', nome: 'Gestão Financeira', icone: 'wallet' },
  ATIVOS: { id: 'ativos', nome: 'Gestão de Ativos', icone: 'trending-up', inerte: true },
  APOSENTADORIA: { id: 'aposentadoria', nome: 'Planejamento de Aposentadoria', icone: 'piggy-bank' },
  RISCOS: { id: 'riscos', nome: 'Gestão de Riscos', icone: 'shield' },
  TRIBUTARIO: { id: 'tributario', nome: 'Planejamento Tributário', icone: 'receipt' },
  SUCESSORIO: { id: 'sucessorio', nome: 'Planejamento Sucessório', icone: 'users' },
};

/** Retrato financeiro do Ricardo (ILUSTRATIVO) — alimenta os cards da devolutiva. */
export const RICARDO = {
  nome: 'Ricardo',
  nomeCompleto: 'Ricardo Almeida',
  idade: 54,
  profissao: 'Dono de uma rede de óticas no interior de SP',
  estadoCivil: 'Casado(a)',
  dependentes: 2,
  score: 42,
  coleta: {
    rendaLiquida:        { valor: 38000,   prov: 'declarado', rotulo: 'Renda líquida mensal' },
    custoVida:           { valor: 16000,   prov: 'declarado', rotulo: 'Custo de vida mensal' },
    poupaMes:            { valor: 6000,    prov: 'declarado', rotulo: 'Quanto poupa por mês' },
    ativosFinanceiros:   { valor: 980000,  prov: 'declarado', rotulo: 'Ativos financeiros' },
    reservaEmergencia:   { valor: 180000,  prov: 'declarado', rotulo: 'Reserva de emergência' },
    valorBens:           { valor: 1750000, prov: 'estimado',  rotulo: 'Valor dos bens' },
    saldoDevedor:        { valor: 320000,  prov: 'declarado', rotulo: 'Saldo devedor (financiamentos)' },
    valorOtica:          { valor: 2400000, prov: 'estimado',  rotulo: 'Valor estimado da rede de óticas' },
    // C8: entra no patrimônio consolidado (Cliente + CFP R4)
    coberturaVida:       { valor: 0,       prov: 'declarado', rotulo: 'Cobertura de seguro de vida' },
    horizonteFilhos:     { valor: 8,  unidade: 'anos', prov: 'declarado', rotulo: 'Anos até o filho mais novo se formar' },
    idadeAposentadoria:  { valor: 69, unidade: 'anos', prov: 'declarado', rotulo: 'Idade em que pretende parar de trabalhar' },
    // CFP R4: campos NUNCA perguntados no exame não podem ser exibidos como declaração do cliente
    testamento:          { valor: null, prov: null, naoColetado: true, rotulo: 'Testamento / holding' },
    regimeBens:          { valor: null, prov: null, naoColetado: true, rotulo: 'Regime de bens' },
    perfilSuitability:   { valor: null, prov: null, naoColetado: true, soConsultor: true, rotulo: 'Seu perfil de investidor' },
    previdenciaPrivada:  { valor: 0,       prov: 'declarado', rotulo: 'Previdência privada' },
  },
  aporteCombinado: 10000,
};

/** Rótulos humanos de proveniência (spec §11.6). */
export const PROVENIENCIA_ROTULO = {
  declarado: 'você nos contou',
  estimado: 'nossa estimativa',
  validado: 'confirmado',
};

/**
 * Módulos da devolutiva — os 7 temas escolhidos pelo Nélio.
 * Cada módulo é a mesma coisa vista de 3 ângulos: linha do inventário (Projeto),
 * capítulo da devolutiva, e origem de tarefas.
 */
export const MODULOS = [
  {
    id: 'protecao',
    vertical: VERTICAIS.RISCOS,
    titulo: 'Proteção da família',
    subtitulo: 'O que acontece com quem fica',
    icone: 'shield',
    video: 'cSD7eNNfWBA',
    conceito: 'Um seguro de vida não é sobre você — é sobre quem fica. Ele compra tempo para a sua família decidir sem pressa.',
    cards: [
      {
        titulo: 'Hoje, sem a sua renda, sua família mantém o padrão de vida por 11 meses',
        valor: '11 meses',
        comoChegamos: 'Reserva de R$ 180.000 (você nos contou) ÷ custo de vida de R$ 16.000/mês (você nos contou).',
        prov: 'estimado',
      },
      {
        titulo: 'Sua família precisa de 8 anos mantendo o padrão de vida sem a sua renda',
        valor: '8 anos',
        comoChegamos: 'Partimos dos 8 anos até o seu filho mais novo se formar (você nos contou) e tratamos esse prazo como o tempo que a sua família precisa manter o padrão de vida sem a sua renda.',
        prov: 'estimado',
      },
    ],
    decisao: 'Contratar um seguro de vida que cubra a diferença: sua família passa de 11 meses para 8 anos mantendo o padrão de vida sem a sua renda.',
    decisaoComoChegamos: '8 anos × R$ 16.000/mês = R$ 1.536.000, menos os R$ 180.000 que você já tem, dá cerca de R$ 1.356.000 de capital a segurar. ⚠ O preço mensal depende da sua idade, saúde e da seguradora — por isso a primeira tarefa é pedir 3 cotações, e não um valor que a gente chute aqui.',
    impactoHumano: 'sua família: de 11 meses para 8 anos sem apertar o padrão de vida',
    tarefas: [
      { titulo: 'Solicitar 3 cotações de seguro de vida', mes: 1, quando: 'no dia do salário' },
      { titulo: 'Escolher e contratar a apólice', mes: 2 },
    ],
  },
  {
    id: 'aposentadoria',
    vertical: VERTICAIS.APOSENTADORIA,
    titulo: 'A sua aposentadoria',
    subtitulo: 'De onde vem a renda quando a ótica não estiver mais aqui',
    icone: 'piggy-bank',
    video: 'cSD7eNNfWBA',
    conceito: 'Aposentadoria não é uma idade — é o momento em que o seu patrimônio passa a pagar as contas no lugar do seu trabalho.',
    cards: [
      {
        titulo: 'No ritmo atual, você chega em 2041, aos 69',
        valor: '2041',
        comoChegamos: 'Aporte combinado de R$ 10.000/mês sobre R$ 980.000 de ativos, com as premissas de exemplo desta demonstração.',
        prov: 'estimado',
      },
      {
        titulo: 'Você ainda não tem previdência privada',
        valor: 'R$ 0',
        comoChegamos: 'Você nos contou que não contribui com previdência privada hoje.',
        prov: 'declarado',
      },
    ],
    decisao: 'Manter o aporte combinado de R$ 10.000/mês e direcionar parte dele para previdência — a data de 2041 depende da regularidade, não do mercado.',
    impactoHumano: 'aposentadoria em 2041, aos 69',
    tarefas: [
      { titulo: 'Definir com o consultor a divisão do aporte mensal', mes: 1 },
    ],
  },
  {
    id: 'tributario',
    vertical: VERTICAIS.TRIBUTARIO,
    titulo: 'O que vaza em imposto',
    subtitulo: 'Dinheiro que sai sem precisar sair',
    icone: 'receipt',
    video: 'cSD7eNNfWBA',
    conceito: 'Boa parte do que se perde em imposto não é sonegação evitada — é dedução não usada e produto mal escolhido.',
    cards: [
      {
        titulo: 'Você pode deduzir até 12% da renda tributável com PGBL',
        valor: 'até 12%',
        comoChegamos: 'Regra geral do PGBL aplicada sobre a renda declarada. ⚠ O cálculo oficial do seu caso depende da sua declaração — o consultor valida.',
        prov: 'estimado',
      },
      {
        titulo: 'Sua carteira hoje não usa nenhum veículo com eficiência tributária',
        valor: 'R$ 0',
        comoChegamos: 'Você nos contou que não tem previdência privada. O resto do quadro tributário — regime da empresa, pró-labore x dividendos e o ganho de capital na venda da ótica — ⚠ ainda não foi levantado.',
        prov: 'estimado',
      },
    ],
    decisao: 'Abrir um PGBL e direcionar parte do aporte mensal para capturar a dedução — impacto: menos imposto pago por ano, dentro da sua faixa.',
    impactoHumano: 'imposto que deixa de vazar todo ano',
    tarefas: [
      { titulo: 'Abrir um PGBL para deduzir IR', mes: 1 },
    ],
  },
  {
    id: 'sucessorio',
    vertical: VERTICAIS.SUCESSORIO,
    titulo: 'Sucessão tranquila',
    subtitulo: 'Que a sua família não descubra tudo no pior dia',
    icone: 'users',
    video: 'cSD7eNNfWBA',
    conceito: 'Planejar a sucessão não é falar de morte — é deixar as decisões tomadas enquanto você está inteiro para tomá-las.',
    cards: [
      {
        titulo: 'Você não tem testamento nem estrutura sucessória',
        valor: '⚠ a levantar',
        comoChegamos: '⚠ Ainda não perguntamos isso. Testamento, holding e seguro sucessório não estão no exame de hoje — {consultor} levanta com você antes de fechar este capítulo.',
        prov: null,
      },
      {
        titulo: 'A rede de óticas é a maior parte do seu patrimônio',
        valor: 'R$ 2,4 mi',
        comoChegamos: 'Valor estimado do negócio, contra R$ 980 mil em ativos financeiros. Um inventário sem estrutura trava a operação.',
        prov: 'estimado',
      },
    ],
    decisao: 'Fazer um testamento e desenhar a estrutura de transmissão da ótica — impacto: a sua família decide com tempo, não sob inventário.',
    impactoHumano: 'a rede de óticas transmitida sem travar a operação',
    tarefas: [
      { titulo: 'Fazer ou atualizar o testamento', mes: 3 },
    ],
  },
  {
    id: 'financeira',
    vertical: VERTICAIS.FINANCEIRA,
    titulo: 'Orçamento e caixa',
    subtitulo: 'O chão de onde todo o resto sai',
    icone: 'wallet',
    video: 'cSD7eNNfWBA',
    conceito: 'Reserva de emergência não é investimento — é o que impede que um imprevisto desmonte o plano inteiro.',
    cards: [
      {
        titulo: 'Sua reserva cobre 11 meses de custo de vida',
        valor: '11 meses',
        comoChegamos: 'R$ 180.000 de reserva ÷ R$ 16.000/mês de custo de vida (ambos: você nos contou).',
        prov: 'estimado',
      },
      {
        titulo: 'Você guarda R$ 6.000 e sobra espaço para chegar aos R$ 10.000',
        valor: '+ R$ 4.000',
        comoChegamos: 'O combinado de R$ 10.000 menos os R$ 6.000 que você guarda hoje. Cabe no orçamento: sua renda líquida é R$ 38.000 e o custo de vida R$ 16.000 (os dois você nos contou).',
        prov: 'estimado',
      },
    ],
    decisao: 'Elevar o aporte mensal combinado para R$ 10.000 e manter a reserva no patamar de 6 meses do custo familiar.',
    impactoHumano: 'R$ 4.000/mês que passam a trabalhar pelos seus objetivos',
    tarefas: [
      { titulo: 'Estruturar a reserva de emergência no patamar combinado', mes: 4 },
    ],
  },
  {
    id: 'dividas',
    vertical: VERTICAIS.FINANCEIRA,
    titulo: 'Gestão de dívidas',
    subtitulo: 'Nem toda dívida é problema — mas nenhuma é neutra',
    icone: 'credit-card',
    video: 'cSD7eNNfWBA',
    conceito: 'A pergunta não é "tenho dívida?", é "essa dívida custa mais do que meu dinheiro rende?".',
    cards: [
      {
        titulo: 'Você tem R$ 320 mil em saldo devedor',
        valor: 'R$ 320.000',
        comoChegamos: 'Saldo devedor de financiamentos (você nos contou).',
        prov: 'declarado',
      },
      {
        titulo: 'Falta comparar o custo da dívida com o rendimento dos ativos',
        valor: '⚠ a levantar',
        comoChegamos: 'As taxas dos seus contratos ainda não foram levantadas — o consultor precisa dos contratos para comparar.',
        prov: null,
      },
    ],
    decisao: 'Levantar as taxas de cada contrato e decidir o que vale antecipar — impacto: só antecipar o que custa mais do que rende.',
    impactoHumano: 'cada real de dívida cara quitado antes de virar juro',
    tarefas: [
      { titulo: 'Reunir os contratos de financiamento e levantar as taxas', mes: 2 },
    ],
  },
  {
    id: 'educacao',
    vertical: null,
    transversal: true,
    titulo: 'Educação financeira',
    subtitulo: 'Para você decidir junto, não só assinar embaixo',
    icone: 'graduation-cap',
    video: 'cSD7eNNfWBA',
    conceito: 'Você não precisa virar especialista. Precisa entender o suficiente para saber quando perguntar.',
    cards: [
      {
        titulo: 'Você já domina 6 conceitos sem ter estudado nada aqui',
        valor: '6',
        comoChegamos: 'Conceitos que o exame já mostrou que você domina, mais os que o consultor marcou. A coleção nunca começa em zero.',
        prov: 'declarado',
      },
    ],
    decisao: 'Uma ou duas perguntas por mês, sempre ligadas à tarefa que você está fazendo — nunca uma bateria.',
    impactoHumano: 'decisões que você entende, não que você aceita',
    tarefas: [],
  },
];

/** Objetivos do Ricardo na linha do tempo (spec §10.3). */
export const OBJETIVOS = [
  {
    id: 'protecao', nome: 'Proteger a família', vertical: 'riscos',
    tipo: 'marco', prazo: 'mês 2', anoAlvo: 2026, estado: 'noRumo',
    detalhe: 'Conclui quando a apólice for contratada.',
  },
  {
    id: 'sucessao', nome: 'Tranquilidade sucessória', vertical: 'sucessorio',
    tipo: 'marco', prazo: 'mês 3', anoAlvo: 2026, estado: 'noRumo',
    detalhe: 'Conclui com o testamento feito.',
  },
  {
    id: 'reserva', nome: 'Reserva de emergência', vertical: 'financeira',
    tipo: 'marco', prazo: 'mês 8', anoAlvo: 2027, estado: 'noRumo',
    detalhe: 'Reserva estruturada no patamar combinado.',
  },
  {
    id: 'otica', nome: 'Vender a ótica com tranquilidade', vertical: 'sucessorio',
    tipo: 'evento', prazo: '2036, aos 64', anoAlvo: 2036, estado: 'noRumo',
    detalhe: 'Maior evento financeiro da sua vida. A liquidez da venda entra no plano e antecipa a data da aposentadoria.',
    liquidezEstimada: 2400000,
  },
  {
    id: 'aposentadoria', nome: 'Aposentadoria', vertical: 'aposentadoria',
    tipo: 'longo', prazo: '2041, aos 69', anoAlvo: 2041, estado: 'noRumo',
    detalhe: 'Aporte combinado de R$ 10.000/mês.',
    cenarioAperto: { anoRecuado: 2043, aporteExtra: 1400, mesesExtra: 12,
      frase: 'R$ 1.400 a mais por mês, pelos próximos 12 meses' },
  },
];

/** Plano de ação instanciado (spec §6.6). */
export const PLANO_ACAO = MODULOS
  .flatMap((m) => m.tarefas.map((t) => ({ ...t, moduloId: m.id, modulo: m.titulo, vertical: m.vertical, impactoHumano: m.impactoHumano })))
  .sort((a, b) => a.mes - b.mes);

/** Cascata de prioridade — co-decidida na devolutiva (spec §10.2). */
export const CASCATA_PADRAO = ['protecao', 'reserva', 'aposentadoria', 'sucessao', 'otica'];

/** Ciclo mensal corrente. */
export const CICLO = {
  mesRef: 'agosto',
  aporteCombinado: 10000,
  comite: {
    resumo: 'Neste mês revisamos os seus investimentos. Nada mudou na forma como eles estão organizados.',
    avaliadoPor: CONSULTOR.nome,
  },
};

/** Conceitos da coleção (vitrine dos ~100). */
export const CONCEITOS = [
  { id: 'c01', titulo: 'Reserva de emergência', vertical: 'financeira', dominado: true },
  { id: 'c02', titulo: 'Juros compostos', vertical: 'financeira', dominado: true },
  { id: 'c03', titulo: 'Custo de oportunidade', vertical: 'financeira', dominado: true },
  { id: 'c04', titulo: 'Seguro de vida: para quem serve', vertical: 'riscos', dominado: false, quiz: true },
  { id: 'c05', titulo: 'Invalidez e incapacidade', vertical: 'riscos', dominado: false },
  { id: 'c06', titulo: 'PGBL x VGBL', vertical: 'tributario', dominado: false },
  { id: 'c07', titulo: 'Come-cotas', vertical: 'tributario', dominado: false },
  { id: 'c08', titulo: 'Ganho de capital', vertical: 'tributario', dominado: true },
  { id: 'c09', titulo: 'Inventário e testamento', vertical: 'sucessorio', dominado: false },
  { id: 'c10', titulo: 'Holding familiar', vertical: 'sucessorio', dominado: false },
  { id: 'c11', titulo: 'Taxa real x nominal', vertical: 'ativos', dominado: true },
  { id: 'c12', titulo: 'Diversificação', vertical: 'ativos', dominado: true },
  { id: 'c13', titulo: 'Renda vitalícia', vertical: 'aposentadoria', dominado: false },
  { id: 'c14', titulo: 'Taxa segura de retirada', vertical: 'aposentadoria', dominado: false },
  { id: 'c15', titulo: 'Amortização: SAC x Price', vertical: 'financeira', dominado: false },
];

/** O quiz jogável (spec §12: o quiz configura o produto, não pontua o cliente). */
export const QUIZ_EXEMPLO = {
  conceitoId: 'c04',
  titulo: 'Seguro de vida: para quem serve',
  pergunta: 'Qual é a principal função de um seguro de vida no planejamento financeiro?',
  opcoes: [
    { texto: 'Ser um investimento com bom retorno no longo prazo', correta: false,
      feedback: 'Seguro de vida não é investimento — o prêmio é o custo de transferir um risco, não uma aplicação.' },
    { texto: 'Dar tempo e autonomia para quem depende da sua renda', correta: true,
      feedback: 'Exatamente. O seguro compra tempo para a família decidir sem pressa — é sobre quem fica.' },
    { texto: 'Substituir a reserva de emergência', correta: false,
      feedback: 'São coisas diferentes: a reserva cobre imprevistos do dia a dia; o seguro cobre a perda da renda.' },
    { texto: 'Reduzir o imposto de renda a pagar', correta: false,
      feedback: 'Esse é o papel de outros veículos, como o PGBL. O seguro de vida resolve proteção, não tributo.' },
  ],
};

/** Roteiros do WhatsApp (spec §9.2) — o Prompt do B=MAP. */
export const WHATSAPP = [
  { de: 'consultor', hora: '09:12',
    texto: `Oi Ricardo, quanto você guardou em agosto? Pode responder aqui mesmo — e pode ser aproximado.` },
  { de: 'cliente', hora: '09:40', texto: 'Consegui uns 6 mil esse mês, foi apertado' },
  { de: 'consultor', hora: '09:41',
    texto: `Mês apertado acontece — e você respondeu, que é o que conta.` },
  { de: 'consultor', hora: '09:42',
    texto: `Com R$ 6.000, sua aposentadoria adia uns 2 meses. Se der para guardar R$ 1.400 a mais por mês nos próximos 12, você volta para a data combinada. Sem correria — dá para recuperar ao longo do ano. Qualquer coisa, me chama.` },
];

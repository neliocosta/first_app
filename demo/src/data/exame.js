/**
 * Exame de Saúde Financeira — Nord Liberta
 * 33 perguntas reais (fonte: perguntasQuiz.txt) + 6 regras condicionais.
 *
 * NOTAS IMPORTANTES
 * 1) BUG DE PRODUÇÃO CORRIGIDO (contexto §1): a pergunta 14 ("quais destes bens estão segurados?")
 *    exibia apenas ["Veículos", "Nenhum"]. Aqui ela espelha dinamicamente os bens marcados na Q13
 *    (`opcoesDe: 'bens'`).
 * 2) O mapeamento pergunta→pilar abaixo é uma PROPOSTA (`⚠ LACUNA`: a fórmula oficial de pontuação
 *    não está disponível — ver Anexo A da especificação). Serve ao demo, não é metodologia oficial.
 */

export const PILARES = {
  PATRIMONIO: 'Patrimônio',
  POUPANCA: 'Poupança',
  PROTECAO: 'Proteção',
  CONSCIENCIA: 'Consciência',
  ATITUDE: 'Atitude',
};

/** Tipos de input suportados pela biblioteca de inputs do exame. */
export const TIPOS = {
  ESCALA: 'escala',        // 1–5, seletor visual
  MOEDA: 'moeda',          // InputMoedaChips (chips de atalho + "varia muito")
  OPCAO: 'opcao',          // escolha única
  MULTI: 'multi',          // múltipla escolha
  SIM_NAO: 'simNao',
  IDADE: 'idade',
  DATA: 'data',
  EMAIL: 'email',
};

export const PERGUNTAS = [
  {
    id: 'q01', pilar: PILARES.CONSCIENCIA, tipo: TIPOS.ESCALA,
    texto: 'Numa escala de 1 a 5, você sente que está usando seu dinheiro da melhor forma possível para construir o futuro que gostaria?',
    opcoes: ['1 - Nada confiante', '2 - Pouco confiante', '3 - Neutro', '4 - Confiante', '5 - Muito confiante'],
  },
  {
    id: 'q02', pilar: PILARES.POUPANCA, tipo: TIPOS.MOEDA,
    texto: 'E quanto, em média, você poupa por mês?',
    ajuda: 'A soma total do que você guarda ou investe, independente do objetivo.',
    permiteVaria: true,
  },
  {
    id: 'q03', pilar: PILARES.ATITUDE, tipo: TIPOS.OPCAO,
    texto: 'Quantas vezes nos últimos 12 meses você poupou o valor declarado acima?',
    opcoes: ['Nenhuma', '1-3 vezes', '4-6 vezes', '7-9 vezes', '10 ou mais'],
  },
  {
    id: 'q04', pilar: PILARES.CONSCIENCIA, tipo: TIPOS.SIM_NAO,
    texto: 'Você tem hoje, com clareza, um (ou mais) objetivo(s) financeiro(s)?',
  },
  // ── CONDICIONAL 1: q05–q08 só aparecem se q04 = SIM ───────────────────────
  {
    id: 'q05', pilar: PILARES.CONSCIENCIA, tipo: TIPOS.SIM_NAO,
    texto: 'Você já parou para avaliar quanto precisará de dinheiro para realizar esse(s) objetivo(s)?',
    permiteNaoSei: true,
    condicao: { campo: 'q04', igual: 'Sim' },
  },
  {
    id: 'q06', pilar: PILARES.ATITUDE, tipo: TIPOS.SIM_NAO,
    texto: 'Você já possui um plano concreto desenhado para conseguir o valor necessário?',
    ajuda: 'Se seu plano for apenas superficial, deixe marcado "Não".',
    condicao: { campo: 'q04', igual: 'Sim' },
  },
  {
    id: 'q07', pilar: PILARES.POUPANCA, tipo: TIPOS.MOEDA,
    texto: 'Qual valor você imagina que precisa investir por mês para realizar seu(s) objetivo(s)?',
    permiteVaria: true,
    condicao: { campo: 'q04', igual: 'Sim' },
  },
  {
    id: 'q08', pilar: PILARES.POUPANCA, tipo: TIPOS.MOEDA,
    texto: 'E quanto, de fato, do valor anterior você está investindo mensalmente para isso?',
    permiteVaria: true,
    condicao: { campo: 'q04', igual: 'Sim' },
  },
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'q09', pilar: PILARES.PATRIMONIO, tipo: TIPOS.MOEDA,
    texto: 'Quanto aproximadamente você tem de ativos financeiros?',
    ajuda: 'Considere investimentos, poupança e conta corrente. Não considere bens como imóveis e automóveis.',
    permiteVaria: true,
  },
  {
    id: 'q10', pilar: PILARES.POUPANCA, tipo: TIPOS.MOEDA,
    texto: 'Quanto desse valor pode ser considerado uma reserva de emergência?',
    permiteVaria: true,
  },
  {
    id: 'q11', pilar: PILARES.ATITUDE, tipo: TIPOS.SIM_NAO,
    texto: 'E hoje você guarda mensalmente algum valor para aumentar essa reserva?',
  },
  {
    id: 'q12', pilar: PILARES.CONSCIENCIA, tipo: TIPOS.MOEDA,
    texto: 'Quanto você imagina que, para o seu perfil, seria um valor adequado de reserva de emergência?',
    permiteVaria: true,
  },
  {
    id: 'q13', pilar: PILARES.PATRIMONIO, tipo: TIPOS.MULTI, chave: 'bens',
    texto: 'Qual(is) dos bens abaixo você possui?',
    ajuda: 'Marque mesmo se o bem estiver financiado.',
    opcoes: ['Veículos', 'Casa', 'Apartamento', 'Imóveis Comerciais', 'Empresa / participação societária', 'Outros'],
    opcaoNenhum: 'Nenhum',
  },
  // ── CONDICIONAL 2 + CORREÇÃO DO BUG DE PRODUÇÃO ───────────────────────────
  {
    id: 'q14', pilar: PILARES.PROTECAO, tipo: TIPOS.MULTI,
    texto: 'E quais desses bens estão segurados?',
    // BUG FIX: em produção esta lista era fixa em ["Veículos", "Nenhum"].
    // Agora espelha exatamente os bens marcados na q13.
    opcoesDe: 'q13',
    opcaoNenhum: 'Nenhum',
    condicao: { campo: 'q13', diferenteDe: 'Nenhum' },
  },
  // ── CONDICIONAL 3 ─────────────────────────────────────────────────────────
  {
    id: 'q15', pilar: PILARES.PATRIMONIO, tipo: TIPOS.MOEDA,
    texto: 'Quanto aproximadamente, em reais, você considera que seus bens valem?',
    ajuda: 'Se possuir bens financiados, coloque o valor total do bem, desconsiderando o saldo em aberto.',
    permiteVaria: true,
    condicao: { campo: 'q13', diferenteDe: 'Nenhum' },
  },
  {
    id: 'q16', pilar: PILARES.PROTECAO, tipo: TIPOS.MULTI,
    texto: 'E você possui algum destes produtos de proteção pessoal?',
    opcoes: ['Plano de Saúde', 'Seguro de Acidentes Pessoais', 'Seguro de Vida', 'Outros produtos de seguro'],
    opcaoNenhum: 'Não possuo produtos de seguro',
  },
  {
    id: 'q17', pilar: PILARES.PATRIMONIO, tipo: TIPOS.SIM_NAO,
    texto: 'Você possui dívidas (empréstimos) ou financiamentos?',
  },
  // ── CONDICIONAL 4 ─────────────────────────────────────────────────────────
  {
    id: 'q18', pilar: PILARES.PATRIMONIO, tipo: TIPOS.MOEDA,
    texto: 'Se fosse quitar todas as suas dívidas e financiamentos hoje, de quanto você precisaria?',
    ajuda: 'Ou seja: o saldo devedor atual dos seus empréstimos e financiamentos.',
    permiteVaria: true,
    condicao: { campo: 'q17', igual: 'Sim' },
  },
  {
    id: 'q19', pilar: PILARES.CONSCIENCIA, tipo: TIPOS.IDADE,
    texto: 'Com qual idade você começou a trabalhar?',
  },
  {
    id: 'q20', pilar: PILARES.CONSCIENCIA, tipo: TIPOS.IDADE,
    texto: 'E, de forma realista, até qual idade você imagina que precisará trabalhar?',
  },
  {
    id: 'q21', pilar: PILARES.CONSCIENCIA, tipo: TIPOS.SIM_NAO,
    texto: 'Você já pensou, de forma concreta, de onde virá sua renda para bancar seus custos a partir dessa idade?',
  },
  // ── CONDICIONAL 5 ─────────────────────────────────────────────────────────
  {
    id: 'q22', pilar: PILARES.CONSCIENCIA, tipo: TIPOS.OPCAO,
    texto: 'Qual seria esse plano?',
    opcoes: [
      'Receber uma pensão pelo sistema público',
      'Receber uma pensão por um sistema privado',
      'Fruto dos meus investimentos',
    ],
    condicao: { campo: 'q21', igual: 'Sim' },
  },
  // ── CONDICIONAL 6 ─────────────────────────────────────────────────────────
  {
    id: 'q23', pilar: PILARES.ATITUDE, tipo: TIPOS.OPCAO,
    texto: 'E você hoje já executa um plano para garantir essa renda no futuro?',
    opcoes: [
      'Contribuo com um sistema público de pensão (INSS ou outros)',
      'Contribuo com o plano de previdência privada da empresa onde trabalho',
      'Faço investimentos com este propósito ou contribuo com um plano de previdência privada',
    ],
    condicao: { campo: 'q21', igual: 'Sim' },
  },
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'q24', pilar: PILARES.PATRIMONIO, tipo: TIPOS.OPCAO,
    texto: 'Qual é a natureza da sua fonte de renda hoje?',
    ajuda: 'Caso possua mais de uma, considere a principal.',
    opcoes: ['Registrado (CLT)', 'Servidor Público', 'Aposentadoria/Pensão', 'Profissional Liberal/Autônomo', 'Empresário', 'Sem renda'],
  },
  {
    id: 'q25', pilar: PILARES.PATRIMONIO, tipo: TIPOS.MOEDA,
    texto: 'Hoje, quanto é a sua renda líquida mensal?',
    permiteVaria: true,
  },
  {
    id: 'q26', pilar: PILARES.PROTECAO, tipo: TIPOS.SIM_NAO,
    texto: 'Você possui dependentes financeiros?',
    ajuda: 'Filhos, pais ou outras pessoas que não conseguiriam se bancar caso você ficasse sem renda.',
  },
  {
    id: 'q27', pilar: PILARES.ATITUDE, tipo: TIPOS.OPCAO,
    texto: 'Você faz um acompanhamento mensal das suas despesas?',
    opcoes: ['Sim - acompanho em detalhes', 'Sim - acompanho parcialmente', 'Não acompanho, mas tenho ideia', 'Não faço ideia'],
  },
  {
    id: 'q28', pilar: PILARES.CONSCIENCIA, tipo: TIPOS.MOEDA,
    texto: 'Na média, quanto é o seu custo de vida?',
    ajuda: 'Se divide os custos mensais com outra pessoa, coloque apenas o valor que é sua responsabilidade.',
    permiteVaria: true,
  },
  {
    id: 'q29', pilar: PILARES.CONSCIENCIA, tipo: TIPOS.SIM_NAO,
    texto: 'Você já teve seus produtos financeiros e estratégias avaliados por um profissional?',
  },
  {
    id: 'q30', pilar: null, tipo: TIPOS.OPCAO, perfil: true,
    texto: 'Qual é o seu estado civil?',
    opcoes: ['Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Separado(a)', 'Viúvo(a)'],
  },
  {
    id: 'q31', pilar: null, tipo: TIPOS.OPCAO, perfil: true,
    texto: 'Qual é o seu gênero?',
    opcoes: ['Feminino', 'Masculino', 'Outro', 'Prefiro não declarar'],
  },
  {
    id: 'q32', pilar: null, tipo: TIPOS.DATA, perfil: true,
    texto: 'Selecione a sua data de nascimento',
  },
  {
    id: 'q33', pilar: null, tipo: TIPOS.EMAIL, perfil: true,
    texto: 'Deixe o seu e-mail para receber o resultado',
  },
];

/**
 * As 6 regras condicionais, declaradas em um só lugar para a barra de progresso adaptativa.
 * A barra recalcula o total de perguntas visíveis a cada resposta — e nunca retrocede
 * visualmente (goal-gradient, spec §4).
 */
export const CONDICIONAIS = [
  { id: 1, mostra: ['q05', 'q06', 'q07', 'q08'], quando: 'q04 = Sim' },
  { id: 2, mostra: ['q14'], quando: 'q13 ≠ Nenhum', nota: 'opções espelham a q13 (correção do bug de produção)' },
  { id: 3, mostra: ['q15'], quando: 'q13 ≠ Nenhum' },
  { id: 4, mostra: ['q18'], quando: 'q17 = Sim' },
  { id: 5, mostra: ['q22'], quando: 'q21 = Sim' },
  { id: 6, mostra: ['q23'], quando: 'q21 = Sim' },
];

/** Faixas de resultado — copy da spec §11.1 (descreve a situação, nunca a pessoa). */
/**
 * Escala oficial de gradação (A11, decisão do Nélio). Cinco faixas, com os
 * rótulos dele. O azul claro no meio de uma rampa vermelho→verde quebra a rampa
 * de matiz de propósito — é o padrão que a Nord já usa, e vale mais que a
 * coerência cromática.
 *
 * `rotulo` descreve a SITUAÇÃO, nunca a pessoa (inviolável do contexto §9).
 * ⚠ LACUNA: os tokens exatos de cor da Nord não foram passados; os hex abaixo
 * são a leitura mais próxima dos nomes que ele deu e precisam de confirmação.
 */
export const FAIXAS = [
  { min: 0,  max: 20,  rotulo: 'Preocupante', cor: '#D64545', texto: 'Sua saúde financeira está no começo — há bases importantes a montar.' },
  { min: 20, max: 40,  rotulo: 'Ruim',        cor: '#C2571E', texto: 'As bases já saíram do papel — ainda faltam fundamentos importantes.' },
  { min: 40, max: 60,  rotulo: 'Regular',     cor: '#5B9BD5', texto: 'Fundamentos em pé — dá para avançar com passos regulares.' },
  { min: 60, max: 80,  rotulo: 'Bom',         cor: '#4FA97B', texto: 'Boa estrutura — agora é refinar e proteger o que você construiu.' },
  { min: 80, max: 100, rotulo: 'Ótimo',       cor: '#2E9E5B', texto: 'Sua saúde financeira está sólida — foco em manter o que construiu e cuidar de quem vem depois.' },
];

export const faixaDe = (n) => FAIXAS.find((f) => n >= f.min && n < f.max) || FAIXAS[FAIXAS.length - 1];

/**
 * O que cada pilar mede — a "descrição da situação" que o A11 pede ao lado da
 * gradação. Texto do pilar, não do cliente: explica a régua, não julga quem foi
 * medido.
 */
export const DESCRICAO_PILAR = {
  [PILARES.PATRIMONIO]:  'O que você já construiu: bens, investimentos e participações.',
  [PILARES.POUPANCA]:    'Quanto do que entra você consegue guardar, e com que regularidade.',
  [PILARES.PROTECAO]:    'O que aconteceria com a sua família se a renda parasse amanhã.',
  [PILARES.CONSCIENCIA]: 'O quanto você sabe para onde o seu dinheiro está indo e por quê.',
  [PILARES.ATITUDE]:     'O que você já colocou em prática, não o que pretende fazer.',
};

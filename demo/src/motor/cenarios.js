/**
 * CENÁRIOS DA FERRAMENTA DE EVOLUÇÃO PATRIMONIAL
 *
 * Dois cenários, com propósitos diferentes:
 *
 *  1. `RICARDO` — o cliente do resto da demonstração. Os saldos iniciais são os
 *     que ele declarou no exame (980k financeiro + 1,43mi de bens líquidos +
 *     2,4mi da ótica = os R$ 4,81 milhões que a devolutiva já mostra). A
 *     REPARTIÇÃO do financeiro em caixinhas é proposta do consultor — marcada
 *     como tal, porque ele nunca declarou esse recorte.
 *     Este cenário responde a pergunta que a Minha Jornada deixa em aberto:
 *     de onde vem a renda entre 2036 e 2041.
 *
 *  2. `ESPECIFICACAO` — exatamente os números que o Nélio descreveu na
 *     especificação da ferramenta, sem uma linha inventada. Serve para conferir
 *     a matemática do motor contra um caso de teste conhecido.
 */

import { CAMADA, NATUREZA, EVENTO, pvNecessario, taxaMensal } from './projecao.js';

/**
 * O tamanho da travessia é DERIVADO da necessidade, não arbitrado.
 * R$ 16.000/mês durante os 60 meses entre a venda da ótica e a aposentadoria,
 * a 4% ao ano reais → R$ 873.159. Antes este número era R$ 880.000 cravado à
 * mão, e os R$ 125/mês de excedente evaporavam dentro da banda de tolerância:
 * R$ 7.500 sumindo numa ferramenta que promete que nenhum real some em silêncio.
 */
export const TRAVESSIA = {
  custoMensal: 16000, meses: 60, taxa: 0.04,
  get valor() { return Math.round(pvNecessario(this.custoMensal, taxaMensal(this.taxa), this.meses)); },
};

/** Paleta das caixinhas: rampa de luminosidade variada, para o gráfico continuar
 *  legível sem depender de matiz (exigência do sub-crítico Cego de Cor). */
export const COR = {
  reserva:    '#1F7A45',
  compromisso:'#4A7BA7',
  formacao:   '#4A7BA7',
  travessia:  '#B23B6F',
  objetivo:   '#7B5EA7',
  liberdade:  '#C2410C',
  bens:       '#8A94A6',
  participacoes: '#20344C',
};

// ─────────────────────────────────────────────────────────────────────────────
// 1. RICARDO ALMEIDA — 54 anos, dono de uma rede de óticas
// ─────────────────────────────────────────────────────────────────────────────

const M = (ano, mes = 1) => (ano - 2026) * 12 + mes; // atalho: mês índice a partir de jan/2026

export const RICARDO_CENARIO = {
  id: 'ricardo',
  nome: 'Ricardo Almeida',
  legenda: '54 anos · projeção até os 100',
  inicio: { ano: 2026, mes: 1 },
  idadeInicial: 54,
  horizonte: 552, // 46 anos
  nota: 'Todos os valores estão em dinheiro de hoje: R$ 10 milhões em 2049 compram o que R$ 10 milhões compram hoje, porque os rendimentos já vêm descontados da inflação. Você declarou o total do seu patrimônio; a divisão entre as caixas é uma proposta de {consultor}, ainda não fechada.',

  caixinhas: [
    { id: 'reserva',   nome: 'Reserva de emergência', curto: 'Reserva',    camada: CAMADA.FINANCEIRO, natureza: NATUREZA.RESERVA,     saldoInicial:  180000, taxaAnual: 0.040, cor: COR.reserva,   prov: 'declarado',
      nota: '11 meses do custo de vida declarado (R$ 16.000/mês). É o colchão — rende pouco de propósito, porque precisa estar líquido.' },
    { id: 'formacao',  nome: 'Formação dos filhos',   curto: 'Formação',   camada: CAMADA.FINANCEIRO, natureza: NATUREZA.COMPROMISSO, saldoInicial:  100000, taxaAnual: 0.045, cor: COR.formacao,  prov: 'estimado',
      nota: 'Compromisso com data: o filho mais novo se forma em 8 anos.' },
    { id: 'renda3641', nome: 'Renda de 2036 a 2041',  curto: 'Renda 36–41',  camada: CAMADA.FINANCEIRO, natureza: NATUREZA.COMPROMISSO, saldoInicial:       0, taxaAnual: 0.040, cor: COR.travessia, prov: 'estimado',
      nota: 'Nasce da venda da ótica e paga os cinco anos em que a renda da empresa já acabou e a aposentadoria ainda não começou.' },
    { id: 'liberdade', nome: 'Liberdade financeira',  curto: 'Liberdade',  camada: CAMADA.FINANCEIRO, natureza: NATUREZA.LIBERDADE,   saldoInicial:  700000, taxaAnual: 0.075, cor: COR.liberdade, prov: 'estimado',
      nota: 'O que sustenta a vida quando o trabalho parar de sustentar. É a maior das caixas e a de prazo mais longo — por isso é a que pode correr mais risco.' },
    { id: 'imoveis',   nome: 'Imóveis',               curto: 'Imóveis',    camada: CAMADA.BENS,       natureza: null,                 saldoInicial: 1430000, taxaAnual: 0.000, cor: COR.bens,      prov: 'estimado',
      // 0% real é o único default defensável: o mercado residencial brasileiro
      // já teve longos períodos de valorização real negativa, e projetar 46 anos
      // de alta real seria confiança silenciosa justo onde a ferramenta é
      // honestamente humilde com a ótica.
      lacuna: 'Valorização real dos imóveis: ⚠ premissa da consultoria, ainda não definida. Projetado a 0% real — o valor de hoje, mantido.',
      nota: 'R$ 1.750.000 de valor estimado menos R$ 320.000 de saldo devedor. A prestação ainda não está no fluxo de caixa e a amortização não está na projeção.' },
    { id: 'otica',     nome: 'Rede de óticas',        curto: 'Ótica',      camada: CAMADA.PARTICIPACOES, natureza: null,              saldoInicial: 2400000, taxaAnual: 0.000, cor: COR.participacoes, prov: 'estimado',
      nota: 'Valor estimado pelo próprio Ricardo, mantido constante: ninguém sabe por quanto uma ótica vende em 2036. Use o simulador para testar outros valores.' },
  ],

  /**
   * A despesa NUNCA aparece como um número só.
   *
   * O Ricardo declarou três coisas que, juntas, forçam uma quarta: renda de
   * R$ 38.000, custo de vida de R$ 16.000 e R$ 6.000 poupados por mês. Sobram
   * R$ 16.000 sem destino declarado — e ele mesmo respondeu no exame que "não
   * acompanha, mas tem ideia". Esse buraco é dado dele, não invenção nossa, e
   * por isso é mostrado com nome próprio em vez de somado num total opaco.
   * Sem essa decomposição, a tela pareceria contradizer o exame do cliente.
   */
  orcamento: [
    { de: 1, ate: 6, receita: 38000, rotulo: 'Hoje', componentes: [
      { rotulo: 'Custo de vida', valor: 16000, prov: 'declarado' },
      { rotulo: 'Sem destino declarado', valor: 16000, prov: 'derivado',
        nota: 'A conta da sua renda menos o que você declarou. Achar para onde vai é a primeira tarefa do plano.' },
    ] },
    { de: 7, ate: 59, receita: 38000, rotulo: 'Com o orçamento ajustado', componentes: [
      { rotulo: 'Custo de vida', valor: 16000, prov: 'declarado' },
      { rotulo: 'Sem destino declarado', valor: 12000, prov: 'derivado',
        nota: 'Organizar o orçamento encontrou R$ 4.000 por mês do que não tinha destino.' },
    ] },
    { de: 60, ate: 96, receita: 38000, rotulo: 'Faculdade dos filhos', componentes: [
      { rotulo: 'Custo de vida', valor: 16000, prov: 'declarado' },
      { rotulo: 'Faculdade', valor: 8000, prov: 'estimado' },
      { rotulo: 'Sem destino declarado', valor: 12000, prov: 'derivado' },
    ] },
    { de: 97, ate: 120, receita: 38000, rotulo: 'Últimos anos na ótica', componentes: [
      { rotulo: 'Custo de vida', valor: 16000, prov: 'declarado' },
      { rotulo: 'Sem destino declarado', valor: 12000, prov: 'derivado' },
    ] },
    { de: 121, ate: 180, receita: 0, rotulo: 'Depois da venda da ótica',
      premissa: 'A partir daqui o plano assume que a saída mensal cai de R$ 28.000 para R$ 16.000 — os R$ 12.000 sem destino declarado deixam de existir quando a empresa sai da vida. É uma queda de 43% e é ela que faz a travessia fechar: ao padrão de hoje a ponte duraria 33 meses, não 60.',
      componentes: [
        { rotulo: 'Custo de vida', valor: 16000, prov: 'declarado' },
      ] },
    { de: 181, ate: 360, receita: 0, rotulo: 'Aposentadoria',
      premissa: 'Custo de vida constante dos 69 aos 99. ⚠ LACUNA: a inflação específica de saúde na idade avançada ainda não está modelada — é o erro mais caro de projeção de aposentadoria.',
      componentes: [
        { rotulo: 'Custo de vida', valor: 16000, prov: 'declarado' },
      ] },
    { de: 361, ate: null, receita: 0, rotulo: 'Vive do rendimento', componentes: [
      { rotulo: 'Custo de vida', valor: 16000, prov: 'declarado' },
    ] },
  ],

  /** Buracos conhecidos, ditos na tela — não escondidos em comentário de código. */
  lacunas: [
    { rotulo: 'Prestação do financiamento',
      texto: 'Os R$ 320.000 de saldo devedor entram abatidos do valor do imóvel, mas a prestação ainda não está no fluxo de caixa e a amortização não está na projeção.',
      onde: 'sempre' },
    { rotulo: 'Imposto sobre a venda da ótica',
      texto: 'Os R$ 2.400.000 entram brutos. O imposto sobre o ganho de capital ainda não foi calculado — o valor que de fato vira patrimônio é menor.',
      onde: 121 },
  ],

  eventos: [
    // ── Fase 1: organizar o orçamento e começar a separar ──
    { id: 'ap1', tipo: EVENTO.APORTE_CONTINUO, mes: 1,  mesFim: 6,  caixinha: 'formacao',  valor: 1500, rotulo: 'Aporte para a formação' },
    { id: 'ap2', tipo: EVENTO.APORTE_CONTINUO, mes: 1,  mesFim: 6,  caixinha: 'liberdade', valor: 4500, rotulo: 'Aporte para a liberdade' },
    { id: 'ap3', tipo: EVENTO.APORTE_CONTINUO, mes: 7,  mesFim: 59, caixinha: 'formacao',  valor: 2000, rotulo: 'Aporte para a formação' },
    { id: 'ap4', tipo: EVENTO.APORTE_CONTINUO, mes: 7,  mesFim: 59, caixinha: 'liberdade', valor: 8000, rotulo: 'Aporte para a liberdade' },

    // ── Fase 2: a faculdade consome a caixinha que foi feita para isso ──
    { id: 'sq1', tipo: EVENTO.SAQUE_CONTINUO,  mes: 60, mesFim: 96, caixinha: 'formacao',  valor: 5000, rotulo: 'Mensalidade da faculdade' },
    { id: 'ap5', tipo: EVENTO.APORTE_CONTINUO, mes: 60, mesFim: 96, caixinha: 'liberdade', valor: 7000, rotulo: 'Aporte para a liberdade' },
    { id: 'tr1', tipo: EVENTO.TRANSFERENCIA,   mes: 97, de: 'formacao', para: 'liberdade', esvazia: true,
      rotulo: 'Formatura — a caixinha cumpriu o papel e o que sobrou muda de destino' },
    { id: 'ap6', tipo: EVENTO.APORTE_CONTINUO, mes: 97, mesFim: 120, caixinha: 'liberdade', valor: 10000, rotulo: 'Aporte para a liberdade' },

    // ── Fase 3: a venda da ótica e a travessia ──
    { id: 'tr2', tipo: EVENTO.TRANSFERENCIA, mes: 121, de: 'otica', para: 'renda3641', valor: TRAVESSIA.valor,
      rotulo: 'Venda da ótica — a parte que paga os cinco anos até a aposentadoria',
      porque: `Calculado pela ponta certa: é exatamente o que paga R$ ${TRAVESSIA.custoMensal.toLocaleString('pt-BR')}/mês durante os ${TRAVESSIA.meses} meses da travessia, a ${(TRAVESSIA.taxa * 100).toLocaleString('pt-BR')}% ao ano.` },
    { id: 'ir1', tipo: EVENTO.SAQUE_PONTUAL, mes: 121, caixinha: 'otica', valor: 0, lacuna: true,
      rotulo: 'Imposto sobre o ganho de capital na venda da ótica',
      porque: 'Alíquota e custo de aquisição são ⚠ LACUNA do tributarista. Enquanto não vierem, o valor que aterrissa no financeiro está superestimado.' },
    { id: 'tr3', tipo: EVENTO.TRANSFERENCIA, mes: 121, de: 'otica', para: 'liberdade', esvazia: true,
      rotulo: 'Venda da ótica — o restante vai para a liberdade' },
    { id: 'cs1', tipo: EVENTO.CONSUMO, mes: 121, mesFim: 180, caixinha: 'renda3641',
      rotulo: 'Paga o custo de vida até 2041, quando a aposentadoria começa.' },
    { id: 'rt1', tipo: EVENTO.RENTABILIDADE, mes: 122, mesFim: 180, caixinha: 'liberdade',
      rotulo: 'A liberdade financeira fica intocada nesses cinco anos' },

    // ── Fase 4: aposentadoria ──
    { id: 'mt1', tipo: EVENTO.MUDANCA_TAXA, mes: 181, caixinha: 'liberdade', taxaAnual: 0.055,
      rotulo: 'Carteira mais conservadora na aposentadoria' },
    { id: 'sq2', tipo: EVENTO.SAQUE_CONTINUO, mes: 181, mesFim: 360, caixinha: 'liberdade', valor: 16000,
      rotulo: 'Renda mensal da aposentadoria' },

    // ── Fase 5: viver só do rendimento, sem tocar no principal ──
    { id: 'pp1', tipo: EVENTO.PERPETUIDADE, mes: 361, mesFim: null, caixinha: 'liberdade',
      rotulo: 'Vive do que os investimentos rendem, sem tocar no dinheiro guardado' },
  ],

  /** Marcos que ancoram a linha do tempo — o cliente se localiza por eles, não por "mês 121". */
  marcos: [
    { mes: 1,   rotulo: 'Hoje',                    idade: 54 },
    { mes: 97,  rotulo: 'Filho mais novo formado', idade: 62 },
    { mes: 121, rotulo: 'Venda da ótica',          idade: 64, destaque: true },
    { mes: 181, rotulo: 'Aposentadoria',           idade: 69, destaque: true },
    { mes: 361, rotulo: 'Vive do rendimento',        idade: 84 },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. EXEMPLO DA ESPECIFICAÇÃO — os números exatos descritos pelo Nélio
// ─────────────────────────────────────────────────────────────────────────────

export const ESPECIFICACAO_CENARIO = {
  id: 'especificacao',
  soConsultor: true,
  nome: 'Exemplo da especificação',
  legenda: 'os números exatos da spec — para conferir a matemática',
  inicio: { ano: 2026, mes: 1 },
  idadeInicial: null,
  horizonte: 60,
  nota: 'Nada aqui foi inventado: é exatamente o cenário descrito na especificação da ferramenta. Serve para conferir, mês a mês, se o motor faz a conta certa.',

  caixinhas: [
    { id: 'reserva',   nome: 'Reserva de emergência', curto: 'Reserva',   camada: CAMADA.FINANCEIRO, natureza: NATUREZA.RESERVA,     saldoInicial: 100000, taxaAnual: 0.040, cor: COR.reserva },
    { id: 'reforma',   nome: 'Reforma da casa',       curto: 'Reforma',   camada: CAMADA.FINANCEIRO, natureza: NATUREZA.COMPROMISSO, saldoInicial:  50000, taxaAnual: 0.040, cor: COR.compromisso },
    { id: 'viagens',   nome: 'Viagens internacionais',curto: 'Viagens',   camada: CAMADA.FINANCEIRO, natureza: NATUREZA.OBJETIVO,    saldoInicial:  80000, taxaAnual: 0.040, cor: COR.objetivo },
    { id: 'casa',      nome: 'Compra da casa',        curto: 'Casa',      camada: CAMADA.FINANCEIRO, natureza: NATUREZA.OBJETIVO,    saldoInicial: 450000, taxaAnual: 0.055, cor: COR.travessia },
    { id: 'liberdade', nome: 'Liberdade financeira',  curto: 'Liberdade', camada: CAMADA.FINANCEIRO, natureza: NATUREZA.LIBERDADE,   saldoInicial: 520000, taxaAnual: 0.075, cor: COR.liberdade },
  ],

  orcamento: [
    { de: 1,  ate: 1,    receita: 20000, despesa: 19000, rotulo: 'Mês 1' },
    { de: 2,  ate: 6,    receita: 20000, despesa: 18000, rotulo: 'Meses 2 a 6' },
    { de: 7,  ate: 10,   receita: 20000, despesa: 17000, rotulo: 'Meses 7 a 10' },
    { de: 11, ate: 12,   receita: 25000, despesa: 19000, rotulo: 'Meses 11 e 12' },
    { de: 13, ate: null, receita: 20000, despesa: 20000, rotulo: 'A partir do mês 13' },
  ],

  eventos: [
    { id: 'e1', tipo: EVENTO.APORTE_CONTINUO, mes: 1,  mesFim: 1,  caixinha: 'liberdade', valor: 1000, rotulo: 'Sobra do mês 1' },
    { id: 'e2', tipo: EVENTO.APORTE_CONTINUO, mes: 2,  mesFim: 6,  caixinha: 'liberdade', valor: 1500, rotulo: 'Sobra para a liberdade' },
    { id: 'e3', tipo: EVENTO.APORTE_CONTINUO, mes: 2,  mesFim: 6,  caixinha: 'casa',      valor:  500, rotulo: 'Sobra para a casa' },
    { id: 'e4', tipo: EVENTO.APORTE_CONTINUO, mes: 7,  mesFim: 10, caixinha: 'liberdade', valor: 1500, rotulo: 'Sobra para a liberdade' },
    { id: 'e5', tipo: EVENTO.APORTE_CONTINUO, mes: 7,  mesFim: 10, caixinha: 'casa',      valor:  500, rotulo: 'Sobra para a casa' },
    { id: 'e6', tipo: EVENTO.APORTE_CONTINUO, mes: 7,  mesFim: 10, caixinha: 'viagens',   valor: 1000, rotulo: 'Sobra para as viagens' },
    { id: 'e7', tipo: EVENTO.APORTE_CONTINUO, mes: 11, mesFim: 12, caixinha: 'viagens',   valor: 6000, rotulo: 'Sobra para as viagens' },
    { id: 'e8', tipo: EVENTO.APORTE_PONTUAL,  mes: 13, caixinha: 'liberdade', valor: 100000,
      rotulo: 'Aporte pontual de R$ 100 mil', nota: 'A especificação não disse o destino — a ferramenta assume liberdade financeira e deixa editável.' },
    { id: 'e9', tipo: EVENTO.RENTABILIDADE,   mes: 14, mesFim: 24, caixinha: null, rotulo: 'Só rendendo, sem aportes' },
    { id: 'e10', tipo: EVENTO.MUDANCA_TAXA,   mes: 25, caixinha: 'casa', taxaAnual: 0.045,
      rotulo: 'A casa passa a render 4,5% ao ano' },
  ],

  marcos: [
    { mes: 13, rotulo: 'Aporte de R$ 100 mil', destaque: true },
    { mes: 25, rotulo: 'Casa passa a 4,5%',    destaque: true },
  ],
};

export const CENARIOS = [RICARDO_CENARIO, ESPECIFICACAO_CENARIO];

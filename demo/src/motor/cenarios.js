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

import { CAMADA, NATUREZA, EVENTO } from './projecao.js';

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
  nota: 'Valores em moeda de hoje e taxas reais (acima da inflação). A repartição do patrimônio financeiro em caixinhas é proposta do consultor — o Ricardo declarou o total, não o recorte.',

  caixinhas: [
    { id: 'reserva',   nome: 'Reserva financeira',    curto: 'Reserva',    camada: CAMADA.FINANCEIRO, natureza: NATUREZA.RESERVA,     saldoInicial:  180000, taxaAnual: 0.040, cor: COR.reserva,   prov: 'declarado',
      nota: '11 meses de custo de vida. É o colchão — rende pouco de propósito, porque precisa estar líquido.' },
    { id: 'formacao',  nome: 'Formação dos filhos',   curto: 'Formação',   camada: CAMADA.FINANCEIRO, natureza: NATUREZA.COMPROMISSO, saldoInicial:  100000, taxaAnual: 0.045, cor: COR.formacao,  prov: 'estimado',
      nota: 'Compromisso com data: o filho mais novo se forma em 8 anos.' },
    { id: 'travessia', nome: 'Travessia 2036–2041',   curto: 'Travessia',  camada: CAMADA.FINANCEIRO, natureza: NATUREZA.COMPROMISSO, saldoInicial:       0, taxaAnual: 0.040, cor: COR.travessia, prov: 'estimado',
      nota: 'Nasce da venda da ótica e banca os 5 anos em que a renda da empresa já acabou e a aposentadoria ainda não começou.' },
    { id: 'liberdade', nome: 'Liberdade financeira',  curto: 'Liberdade',  camada: CAMADA.FINANCEIRO, natureza: NATUREZA.LIBERDADE,   saldoInicial:  700000, taxaAnual: 0.075, cor: COR.liberdade, prov: 'estimado',
      nota: 'O que sustenta a vida quando o trabalho parar de sustentar.' },
    { id: 'imoveis',   nome: 'Imóveis',               curto: 'Imóveis',    camada: CAMADA.BENS,       natureza: null,                 saldoInicial: 1430000, taxaAnual: 0.020, cor: COR.bens,      prov: 'estimado',
      nota: 'R$ 1.750.000 de valor estimado menos R$ 320.000 de saldo devedor. ⚠ LACUNA: o cronograma de amortização entra na Montagem do Relatório.' },
    { id: 'otica',     nome: 'Rede de óticas',        curto: 'Ótica',      camada: CAMADA.PARTICIPACOES, natureza: null,              saldoInicial: 2400000, taxaAnual: 0.000, cor: COR.participacoes, prov: 'estimado',
      nota: 'Valor estimado pelo próprio Ricardo, mantido constante: ninguém sabe por quanto uma ótica vende em 2036. Use o simulador para testar outros valores.' },
  ],

  orcamento: [
    { de: 1,   ate: 6,    receita: 38000, despesa: 32000, rotulo: 'Hoje' },
    { de: 7,   ate: 59,   receita: 38000, despesa: 28000, rotulo: 'Orçamento organizado' },
    { de: 60,  ate: 96,   receita: 38000, despesa: 36000, rotulo: 'Faculdade dos filhos' },
    { de: 97,  ate: 120,  receita: 38000, despesa: 28000, rotulo: 'Últimos anos na ótica' },
    { de: 121, ate: 180,  receita: 0,     despesa: 16000, rotulo: 'A travessia — a ótica foi vendida' },
    { de: 181, ate: 360,  receita: 0,     despesa: 16000, rotulo: 'Aposentadoria' },
    { de: 361, ate: null, receita: 0,     despesa: 16000, rotulo: 'Só do rendimento' },
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
    { id: 'tr2', tipo: EVENTO.TRANSFERENCIA, mes: 121, de: 'otica', para: 'travessia', valor: 880000,
      rotulo: 'Venda da ótica — a parte que banca a travessia' },
    { id: 'tr3', tipo: EVENTO.TRANSFERENCIA, mes: 121, de: 'otica', para: 'liberdade', esvazia: true,
      rotulo: 'Venda da ótica — o restante vai para a liberdade' },
    { id: 'cs1', tipo: EVENTO.CONSUMO, mes: 121, mesFim: 180, caixinha: 'travessia',
      rotulo: 'A travessia: consumir a ponte em 5 anos' },
    { id: 'rt1', tipo: EVENTO.RENTABILIDADE, mes: 122, mesFim: 180, caixinha: 'liberdade',
      rotulo: 'A liberdade fica intocada durante a travessia' },

    // ── Fase 4: aposentadoria ──
    { id: 'mt1', tipo: EVENTO.MUDANCA_TAXA, mes: 181, caixinha: 'liberdade', taxaAnual: 0.055,
      rotulo: 'Carteira mais conservadora na aposentadoria' },
    { id: 'sq2', tipo: EVENTO.SAQUE_CONTINUO, mes: 181, mesFim: 360, caixinha: 'liberdade', valor: 16000,
      rotulo: 'Renda mensal da aposentadoria' },

    // ── Fase 5: viver só do rendimento, sem tocar no principal ──
    { id: 'pp1', tipo: EVENTO.PERPETUIDADE, mes: 361, mesFim: null, caixinha: 'liberdade',
      rotulo: 'Viver do rendimento e preservar o principal para os filhos' },
  ],

  /** Marcos que ancoram a linha do tempo — o cliente se localiza por eles, não por "mês 121". */
  marcos: [
    { mes: 1,   rotulo: 'Hoje',                    idade: 54 },
    { mes: 97,  rotulo: 'Filho mais novo formado', idade: 62 },
    { mes: 121, rotulo: 'Venda da ótica',          idade: 64, destaque: true },
    { mes: 181, rotulo: 'Aposentadoria',           idade: 69, destaque: true },
    { mes: 361, rotulo: 'Só do rendimento',        idade: 84 },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. EXEMPLO DA ESPECIFICAÇÃO — os números exatos descritos pelo Nélio
// ─────────────────────────────────────────────────────────────────────────────

export const ESPECIFICACAO_CENARIO = {
  id: 'especificacao',
  nome: 'Exemplo da especificação',
  legenda: 'os números exatos da spec — para conferir a matemática',
  inicio: { ano: 2026, mes: 1 },
  idadeInicial: null,
  horizonte: 60,
  nota: 'Nada aqui foi inventado: é exatamente o cenário descrito na especificação da ferramenta. Serve para conferir, mês a mês, se o motor faz a conta certa.',

  caixinhas: [
    { id: 'reserva',   nome: 'Reserva financeira',    curto: 'Reserva',   camada: CAMADA.FINANCEIRO, natureza: NATUREZA.RESERVA,     saldoInicial: 100000, taxaAnual: 0.040, cor: COR.reserva },
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

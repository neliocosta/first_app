/**
 * SIMULAÇÃO — o "e se" que o cliente mexe com o dedo.
 *
 * Regra de ouro: a simulação nunca altera o motor nem o cenário original. Ela
 * devolve um cenário NOVO, derivado, para que a projeção base continue
 * disponível e o gráfico possa mostrar as duas — o plano combinado em linha
 * tracejada, o simulado preenchido. Sem isso o cliente perde a referência e a
 * simulação vira um número solto.
 *
 * Duas regras que nasceram de bugs reais, ambos achados pelo painel:
 *
 *  1. SÓ EVENTOS DE JANELA SÃO DIVIDIDOS. A versão anterior partia qualquer
 *     evento no mês do corte usando `mesFim ?? Infinity`. Um aporte pontual não
 *     tem `mesFim`, então virava dois — e o motor creditava R$ 100.000 duas
 *     vezes. Mexer num slider que não mudava nada inventava R$ 119.818.
 *
 *  2. A ALAVANCA TEM ALCANCE, NÃO VALE ATÉ O FIM DA VIDA. Antes ela reescrevia
 *     toda janela futura com receita, apagando o custo da faculdade do orçamento
 *     e achatando degraus que o consultor tinha desenhado de propósito. Agora
 *     vale da âncora até o fim da janela de orçamento vigente ali, e só mexe na
 *     folga sem destino declarado — nunca no custo de vida que o cliente
 *     declarou, nunca numa despesa nomeada.
 */
import { EVENTO, EVENTO_META } from './projecao.js';

/** Só o que tem começo E fim declarados é janela; o resto é pontual. */
const ehJanela = (e) => e.mesFim !== undefined;

/** Quebra janelas de orçamento em duas quando o corte cai no meio. */
function dividirOrcamento(janelas, corte) {
  const saida = [];
  for (const j of janelas) {
    if (j.de < corte && (j.ate ?? Infinity) >= corte) {
      saida.push({ ...j, ate: corte - 1 });
      saida.push({ ...j, de: corte });
    } else saida.push(j);
  }
  return saida;
}

/** Quebra APENAS eventos de janela, preservando identidade rastreável. */
function dividirEventos(eventos, corte) {
  const saida = [];
  for (const e of eventos) {
    if (ehJanela(e) && e.mes < corte && (e.mesFim ?? Infinity) >= corte) {
      saida.push({ ...e, id: `${e.id}#antes`, mesFim: corte - 1 });
      saida.push({ ...e, id: `${e.id}#depois`, mes: corte });
    } else saida.push(e);
  }
  return saida;
}

/** Soma dos componentes de despesa que a alavanca NÃO pode tocar. */
export function despesaIrredutivel(janela) {
  if (!janela?.componentes) return 0;
  return janela.componentes.filter((c) => c.prov !== 'derivado').reduce((s, c) => s + c.valor, 0);
}

/** Teto do slider de aporte: o que sobra depois do que não dá para cortar. */
export function aporteMaximo(janela) {
  if (!janela) return 0;
  return Math.max(0, janela.receita - despesaIrredutivel(janela));
}

export function aplicarSimulacao(base, sim) {
  const mexeu = sim && (sim.aporte != null || sim.venda != null || sim.estresse > 0 || (sim.extras?.length > 0));
  if (!mexeu) return base;

  let { caixinhas, orcamento, eventos } = base;
  eventos = [...eventos];

  // ── Alavanca 0: teste de estresse — e se render MENOS ─────────────────────
  //
  // Arbitragem entre dois pareceres do painel que se contradiziam. O cliente
  // exigiu poder mexer na taxa ("não assino uma projeção de 46 anos sem 'e se
  // render menos'"). O CFP proibiu a taxa como alavanca de simulador, com uma
  // razão fiduciária boa: vira máquina de comprar rentabilidade — o cliente
  // sobe o número até o plano fechar.
  //
  // Os dois estão certos sobre coisas diferentes, e a alavanca de mão única
  // atende os dois: dá para testar a premissa para baixo, nunca para cima.
  // Prudência é simulável; otimismo não é.
  if (sim.estresse > 0) {
    const corte = Math.abs(sim.estresse);
    caixinhas = caixinhas.map((c) => ({ ...c, taxaAnual: Math.max(0, c.taxaAnual - corte), estressada: true }));
    eventos = eventos.map((e) => (e.tipo === EVENTO.MUDANCA_TAXA
      ? { ...e, taxaAnual: Math.max(0, e.taxaAnual - corte), simulado: true }
      : e));
  }

  // ── Alavanca 1: por quanto a ótica é vendida ──────────────────────────────
  // Não mexe no valor de HOJE (que é o declarado); registra uma reavaliação no
  // mês anterior à venda. A incerteza é sobre 2036, não sobre agora.
  if (sim.venda != null && sim.vendaBase != null && sim.venda !== sim.vendaBase) {
    const delta = sim.venda - sim.vendaBase;
    eventos.push({
      id: 'sim-venda',
      tipo: delta >= 0 ? EVENTO.APORTE_PONTUAL : EVENTO.SAQUE_PONTUAL,
      mes: (sim.vendaMes ?? 121) - 1,
      caixinha: sim.vendaCaixinha ?? 'otica',
      valor: Math.abs(delta),
      rotulo: 'Reavaliação da ótica (simulação)',
      simulado: true,
    });
  }

  // ── Alavanca 2: quanto se guarda por mês ──────────────────────────────────
  if (sim.aporte != null) {
    const M = sim.mes;
    const vigente = orcamento.find((j) => M >= j.de && (j.ate == null || M <= j.ate));
    const alcance = vigente?.ate ?? null; // a alavanca morre no fim da fase, não no fim da vida

    const dentroDoAlcance = (de) => de >= M && (alcance == null || de <= alcance);

    orcamento = dividirOrcamento(orcamento, M).map((j) => {
      if (!dentroDoAlcance(j.de) || j.receita <= 0) return j;
      // Só a folga sem destino declarado se move. O custo de vida que o cliente
      // declarou e as despesas nomeadas (faculdade) continuam de pé.
      const fixos = (j.componentes ?? []).filter((c) => c.prov !== 'derivado');
      const somaFixos = fixos.reduce((s, c) => s + c.valor, 0);
      const folga = Math.max(0, j.receita - sim.aporte - somaFixos);
      return {
        ...j,
        despesa: somaFixos + folga,
        componentes: [...fixos, { rotulo: 'Sem destino declarado', valor: folga, prov: 'derivado', simulado: true }],
        rotulo: `${j.rotulo} · simulado`, simulado: true,
      };
    });

    eventos = dividirEventos(eventos, M);

    // Reescala os aportes contínuos VIGENTES na âncora, preservando a proporção
    // entre caixinhas que o consultor definiu. Agrupar por vigência (e não pela
    // chave mes:mesFim) evita escalar duas janelas sobrepostas para o total
    // inteiro cada uma, o que dobraria o aporte.
    const alvos = eventos.filter((e) => e.tipo === EVENTO.APORTE_CONTINUO
      && e.mes >= M && dentroDoAlcance(e.mes));
    const total = alvos.reduce((s, e) => s + e.valor, 0);
    const k = total > 0 ? sim.aporte / total : 0;
    const ids = new Set(alvos.map((e) => e.id));
    eventos = eventos.map((e) => (ids.has(e.id)
      ? { ...e, valor: Math.round(e.valor * k), simulado: true }
      : e));
  }

  // ── Alavanca 3: aportes pontuais colocados na régua ───────────────────────
  // Um por mês: clicar duas vezes no mesmo mês substitui, não empilha. Antes o
  // id colidia e a UI prometia R$ 50.000 enquanto aportava R$ 100.000.
  const porMes = new Map();
  for (const x of sim.extras ?? []) porMes.set(x.mes, x);
  for (const x of porMes.values()) {
    eventos.push({
      id: `sim-extra-${x.mes}`, tipo: EVENTO.APORTE_PONTUAL, mes: x.mes,
      caixinha: x.caixinha, valor: x.valor,
      rotulo: 'Aporte pontual (simulação)', simulado: true,
    });
  }

  return { ...base, caixinhas, orcamento, eventos, simulado: true };
}

/** Soma dos aportes contínuos vigentes num mês — o valor de partida do slider. */
export function aporteVigente(cenario, mes) {
  return cenario.eventos
    .filter((e) => e.tipo === EVENTO.APORTE_CONTINUO && mes >= e.mes && (e.mesFim == null || mes <= e.mesFim))
    .reduce((s, e) => s + e.valor, 0);
}

/** A janela de orçamento vigente num mês — a tela precisa dela para o slider. */
export function janelaVigente(cenario, mes) {
  return cenario.orcamento.find((j) => mes >= j.de && (j.ate == null || mes <= j.ate)) ?? null;
}

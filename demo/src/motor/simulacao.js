/**
 * SIMULAÇÃO — o "e se" que o cliente mexe com o dedo.
 *
 * Regra de ouro: a simulação nunca altera o motor nem o cenário original. Ela
 * devolve um cenário NOVO, derivado, para que a projeção base continue
 * disponível e o gráfico possa mostrar as duas — o plano combinado em linha
 * tracejada, o simulado preenchido. Sem isso o cliente perde a referência e a
 * simulação vira um número solto.
 *
 * O acoplamento importante: mexer no quanto se guarda mexe na despesa do mesmo
 * mês. Guardar mais é gastar menos — a ferramenta não deixa fingir que os dois
 * são independentes.
 */
import { EVENTO } from './projecao.js';

/** Quebra janelas [de, ate] em duas quando o corte cai no meio. */
function dividirJanelas(janelas, corte, campoDe = 'de', campoAte = 'ate') {
  const saida = [];
  for (const j of janelas) {
    const ate = j[campoAte] ?? Infinity;
    if (j[campoDe] < corte && ate >= corte) {
      saida.push({ ...j, [campoAte]: corte - 1 });
      saida.push({ ...j, [campoDe]: corte });
    } else {
      saida.push(j);
    }
  }
  return saida;
}

export function aplicarSimulacao(base, sim) {
  const mexeu = sim && (sim.aporte != null || sim.venda != null || (sim.extras?.length > 0));
  if (!mexeu) return base;

  let { caixinhas, orcamento, eventos } = base;
  eventos = [...eventos];

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

  // ── Alavanca 2: quanto se guarda por mês, a partir do mês focado ──────────
  if (sim.aporte != null) {
    const M = sim.mes;

    orcamento = dividirJanelas(orcamento, M).map((j) =>
      j.de >= M && j.receita > 0
        ? { ...j, despesa: Math.max(0, j.receita - sim.aporte), rotulo: `${j.rotulo} · simulado`, simulado: true }
        : j);

    eventos = dividirJanelas(eventos, M, 'mes', 'mesFim').map((e) =>
      e.tipo === EVENTO.APORTE_CONTINUO && e.mes >= M ? { ...e, simulado: true } : e);

    // Reescala cada grupo de aportes contínuos que compartilha a mesma janela,
    // preservando a proporção entre as caixinhas que o consultor definiu.
    const grupos = new Map();
    for (const e of eventos) {
      if (e.tipo !== EVENTO.APORTE_CONTINUO || e.mes < M) continue;
      const chave = `${e.mes}:${e.mesFim}`;
      if (!grupos.has(chave)) grupos.set(chave, []);
      grupos.get(chave).push(e);
    }
    const escalas = new Map();
    for (const [chave, itens] of grupos) {
      const total = itens.reduce((s, e) => s + e.valor, 0);
      escalas.set(chave, total > 0 ? sim.aporte / total : 0);
    }
    eventos = eventos.map((e) => {
      if (e.tipo !== EVENTO.APORTE_CONTINUO || e.mes < M) return e;
      const k = escalas.get(`${e.mes}:${e.mesFim}`) ?? 1;
      return { ...e, valor: Math.round(e.valor * k) };
    });
  }

  // ── Alavanca 3: aportes pontuais colocados na régua ───────────────────────
  for (const x of sim.extras ?? []) {
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

/**
 * MOTOR DE PROJEÇÃO PATRIMONIAL — fonte única de verdade da evolução mês a mês.
 *
 * Convenções declaradas (a tela mostra todas; nenhuma fica implícita):
 *
 *  1. VALORES REAIS. Tudo em moeda de hoje e taxas reais (acima da inflação).
 *     Ninguém precisa mentalmente deflacionar "R$ 40 milhões em 2070".
 *  2. ORDEM DENTRO DO MÊS. O rendimento incide sobre o SALDO DE ABERTURA;
 *     aportes e saques ocorrem no FIM do mês. A série é uma anuidade
 *     postecipada — a mesma convenção da fórmula de PMT do evento de consumo,
 *     para que as duas nunca briguem.
 *  3. PRIORIDADE DOS EVENTOS. Dentro do mês os eventos são aplicados em ordem
 *     fixa (ver PRIORIDADE), não na ordem em que foram cadastrados. Assim
 *     "vendo a empresa e começo a consumir no mesmo mês" funciona: o dinheiro
 *     já entrou quando o PMT é calculado.
 *  4. CONCILIAÇÃO. sobra de caixa = aportes − saques, contando só os movimentos
 *     CONTÍNUOS. Pontuais (venda de um bem, realização de um objetivo) são
 *     dinheiro de fora do orçamento do mês.
 *
 * Nada aqui sabe desenhar. A tela consome `projetar()` e não recalcula nada.
 */

export const CAMADA = {
  FINANCEIRO: 'financeiro',
  BENS: 'bens',
  PARTICIPACOES: 'participacoes',
};

export const CAMADA_ROTULO = {
  financeiro: 'Patrimônio financeiro',
  bens: 'Bens',
  participacoes: 'Participações',
};

export const CAMADA_COR = {
  financeiro: '#C2410C',
  bens: '#8A94A6',
  participacoes: '#20344C',
};

/** Natureza da caixinha — define ordem de empilhamento (base sólida embaixo). */
export const NATUREZA = {
  RESERVA: 'reserva',
  COMPROMISSO: 'compromisso',
  OBJETIVO: 'objetivo',
  LIBERDADE: 'liberdade',
};

export const ORDEM_NATUREZA = { reserva: 0, compromisso: 1, objetivo: 2, liberdade: 3 };

export const EVENTO = {
  APORTE_PONTUAL: 'aportePontual',
  APORTE_CONTINUO: 'aporteContinuo',
  RENTABILIDADE: 'rentabilidade',
  SAQUE_PONTUAL: 'saquePontual',
  SAQUE_CONTINUO: 'saqueContinuo',
  PERPETUIDADE: 'perpetuidade',
  CONSUMO: 'consumo',
  MUDANCA_TAXA: 'mudancaTaxa',
  TRANSFERENCIA: 'transferencia',
};

/**
 * Iconografia por tipo de evento. Faz parte do contrato de UX: o evento tem de
 * ser reconhecido na régua ANTES de ser lido.
 */
export const EVENTO_META = {
  aportePontual:  { rotulo: 'Aporte extra',     icone: 'circle-plus',        sinal: +1, cor: '#1F7A45', forma: 'pontual' },
  aporteContinuo: { rotulo: 'Aporte mensal',    icone: 'repeat',             sinal: +1, cor: '#2E9E5B', forma: 'janela' },
  rentabilidade:  { rotulo: 'Sem mexer',        icone: 'trending-up',        sinal: 0,  cor: '#8A94A6', forma: 'janela' },
  saquePontual:   { rotulo: 'Resgate único',    icone: 'circle-minus',       sinal: -1, cor: '#C2410C', forma: 'pontual' },
  saqueContinuo:  { rotulo: 'Resgate mensal',   icone: 'arrow-up-from-line', sinal: -1, cor: '#C2410C', forma: 'janela' },
  perpetuidade:   { rotulo: 'Vive do rendimento', icone: 'infinity',         sinal: -1, cor: '#7B5EA7', forma: 'janela' },
  consumo:        { rotulo: 'Renda por prazo',  icone: 'calendar-days',      sinal: -1, cor: '#B23B6F', forma: 'janela' },
  mudancaTaxa:    { rotulo: 'Mudança de taxa',  icone: 'percent',            sinal: 0,  cor: '#20344C', forma: 'pontual' },
  transferencia:  { rotulo: 'Muda de destino',  icone: 'arrow-left-right',   sinal: 0,  cor: '#20344C', forma: 'pontual' },
};

/** Ordem de aplicação dentro do mês. Dinheiro entra antes de ser gasto. */
const PRIORIDADE = {
  transferencia: 0,
  aportePontual: 1,
  aporteContinuo: 2,
  saquePontual: 3,
  saqueContinuo: 4,
  consumo: 5,
  perpetuidade: 6,
  rentabilidade: 7,
  mudancaTaxa: 8,
};

/** Taxa anual efetiva → taxa mensal equivalente (juros compostos). */
export const taxaMensal = (anual) => Math.pow(1 + anual, 1 / 12) - 1;

/**
 * Banda de tolerância da conciliação — mesmo princípio já firmado em
 * `calculo.js`: um desvio de centavos não pode disparar a mesma gramática de
 * alerta de um mês que não fecha. Falso positivo destrói a credibilidade do sinal.
 */
export const TOLERANCIA_FLUXO = { fracao: 0.02, pisoAbsoluto: 100 };

/**
 * PMT de uma anuidade POSTECIPADA: quanto dá para sacar por mês, durante `n`
 * meses, para consumir exatamente `pv` a uma taxa mensal `i`, quando o primeiro
 * saque acontece DEPOIS de um período de rendimento.
 */
export function pmtConsumo(pv, i, n) {
  if (n <= 0) return 0;
  if (Math.abs(i) < 1e-12) return pv / n;
  return (pv * i) / (1 - Math.pow(1 + i, -n));
}

/**
 * PMT de uma anuidade ANTECIPADA — a que o motor usa ao ABRIR um consumo.
 *
 * Sutileza que custa caro se ignorada: o saldo é lido depois do rendimento do
 * mês, e o primeiro saque sai naquele mesmo mês. Ou seja, o primeiro saque não
 * é precedido por um período de juros. Usar a fórmula postecipada aqui faz a
 * caixinha acabar cedo — no cenário do Ricardo, faltavam R$ 3.315 no último mês
 * da travessia.
 */
export function pmtConsumoImediato(pv, i, n) {
  if (n <= 0) return 0;
  if (Math.abs(i) < 1e-12) return pv / n;
  return pmtConsumo(pv, i, n) / (1 + i);
}

/**
 * A pergunta inversa — a que o planejador faz todo dia: "preciso de R$ X por mês
 * durante N meses; quanto preciso ter?". Sem ela, o consultor chuta o tamanho da
 * caixinha e o excedente vaza silenciosamente pela banda de tolerância.
 * Espelha `pmtConsumoImediato`: o primeiro saque sai no mesmo mês em que o
 * dinheiro chega, então é anuidade antecipada.
 */
export function pvNecessario(pmt, i, n) {
  if (n <= 0) return 0;
  if (Math.abs(i) < 1e-12) return pmt * n;
  return pmt * ((1 - Math.pow(1 + i, -n)) / i) * (1 + i);
}

const ativo = (ev, m) => m >= ev.mes && (ev.mesFim == null || m <= ev.mesFim);

/** Receita/despesa vigentes no mês `m`, a partir das janelas de orçamento. */
function fluxoDoMes(janelas, m) {
  for (const j of janelas) {
    if (m >= j.de && (j.ate == null || m <= j.ate)) return { ...j, achou: true };
  }
  return { receita: 0, despesa: 0, achou: false };
}

/**
 * Projeta o cenário mês a mês.
 *
 * @param {object} cenario
 * @param {Array}  cenario.caixinhas  [{ id, nome, camada, natureza, saldoInicial, taxaAnual, cor }]
 * @param {Array}  cenario.eventos    ver EVENTO
 * @param {Array}  cenario.orcamento  [{ de, ate|null, receita, despesa, rotulo }]
 * @param {number} cenario.horizonte  número de meses projetados
 * @param {object} cenario.inicio     { ano, mes } do mês 1
 */
const alertasDeCarga = [];

/** Estados impossíveis morrem na carga, não silenciosamente no meio da série. */
function validar(cenario, saida) {
  saida.length = 0;
  const ids = new Set(cenario.caixinhas.map((c) => c.id));
  for (const e of cenario.eventos ?? []) {
    for (const campo of ['caixinha', 'de', 'para']) {
      if (e[campo] != null && !ids.has(e[campo])) {
        saida.push({ nivel: 'erro', texto: `O evento "${e.rotulo}" aponta para a caixinha "${e[campo]}", que não existe.` });
      }
    }
    if (e.mesFim != null && e.mesFim < e.mes) {
      saida.push({ nivel: 'erro', texto: `O evento "${e.rotulo}" termina (mês ${e.mesFim}) antes de começar (mês ${e.mes}).` });
    }
  }
  const js = [...(cenario.orcamento ?? [])].sort((a, b) => a.de - b.de);
  for (let k = 1; k < js.length; k++) {
    const anterior = js[k - 1];
    if ((anterior.ate ?? Infinity) >= js[k].de) {
      saida.push({ nivel: 'atencao', texto: `As janelas de orçamento "${anterior.rotulo}" e "${js[k].rotulo}" se sobrepõem. Vale a primeira.` });
    }
  }
}

export function projetar(cenario) {
  const { caixinhas, eventos = [], orcamento = [], horizonte, inicio } = cenario;
  validar(cenario, alertasDeCarga);

  const saldo = {};
  const taxa = {};
  caixinhas.forEach((c) => { saldo[c.id] = c.saldoInicial; taxa[c.id] = c.taxaAnual; });

  // Consumos em curso: guardam o PMT vigente para poder refazê-lo se a taxa da
  // caixinha mudar no meio da janela (senão o saldo não zera no fim).
  const consumos = {};
  const alertas = [...alertasDeCarga];
  const meses = [];
  let maximo = 0;

  const ordenados = [...eventos].sort((a, b) => PRIORIDADE[a.tipo] - PRIORIDADE[b.tipo]);

  for (let m = 1; m <= horizonte; m++) {
    const linha = {
      m,
      data: dataDoMes(inicio, m),
      caixinhas: {},
      camadas: { financeiro: 0, bens: 0, participacoes: 0 },
      total: 0,
      eventos: [],
      alertas: [],
    };

    // ── 1. Mudanças de taxa entram ANTES do rendimento do mês ──
    for (const e of eventos) {
      if (e.tipo !== EVENTO.MUDANCA_TAXA || e.mes !== m) continue;
      const de = taxa[e.caixinha];
      taxa[e.caixinha] = e.taxaAnual;
      linha.eventos.push({ ...e, meta: EVENTO_META[e.tipo], taxaAnterior: de });
      // O PMT de um consumo em curso precisa ser refeito com a taxa nova.
      for (const k of Object.values(consumos)) {
        if (k.caixinha === e.caixinha && m > k.mes && m <= k.mesFim) {
          k.pmt = pmtConsumo(saldo[e.caixinha], taxaMensal(e.taxaAnual), k.mesFim - m + 1);
          k.recalculadoEm = m;
          linha.alertas.push({
            nivel: 'info',
            texto: `A parcela do consumo "${k.rotulo}" foi refeita com a taxa nova: passou a ${brl(k.pmt)}/mês.`,
          });
        }
      }
    }

    // ── 2. Rendimento sobre o saldo de abertura ──
    const abertura = {};
    const rendimento = {};
    for (const c of caixinhas) {
      abertura[c.id] = saldo[c.id];
      rendimento[c.id] = saldo[c.id] * taxaMensal(taxa[c.id]);
      saldo[c.id] += rendimento[c.id];
    }

    // ── 3. Orçamento do mês ──
    const f = fluxoDoMes(orcamento, m);
    const despesa = f.componentes ? f.componentes.reduce((s2, c) => s2 + c.valor, 0) : f.despesa;
    const sobra = f.receita - despesa;

    // ── 4. Movimentos, em ordem de prioridade e aplicados no saldo na hora ──
    const aportes = {};
    const saques = {};
    let entraDoFluxo = 0;
    let saiDoFluxo = 0;

    const creditar = (id, v) => { aportes[id] = (aportes[id] || 0) + v; saldo[id] += v; };
    const debitar = (id, v) => { saques[id] = (saques[id] || 0) + v; saldo[id] -= v; };
    const disponivel = (id) => Math.max(0, saldo[id]);

    for (const e of ordenados) {
      if (e.tipo === EVENTO.MUDANCA_TAXA) continue; // já tratado
      if (!ativo(e, m)) continue;
      const meta = EVENTO_META[e.tipo];

      switch (e.tipo) {
        case EVENTO.TRANSFERENCIA: {
          if (e.mes !== m) break;
          const v = Math.min(e.esvazia ? disponivel(e.de) : e.valor, disponivel(e.de));
          debitar(e.de, v);
          creditar(e.para, v);
          linha.eventos.push({ ...e, meta, valorNoMes: v });
          break;
        }

        case EVENTO.APORTE_PONTUAL: {
          if (e.mes !== m) break;
          creditar(e.caixinha, e.valor);
          linha.eventos.push({ ...e, meta, valorNoMes: e.valor, foraDoFluxo: true });
          break;
        }

        case EVENTO.APORTE_CONTINUO: {
          creditar(e.caixinha, e.valor);
          entraDoFluxo += e.valor;
          linha.eventos.push({ ...e, meta, valorNoMes: e.valor });
          break;
        }

        case EVENTO.SAQUE_PONTUAL: {
          if (e.mes !== m) break;
          if (e.lacuna) {
            // O evento existe e é visível, mas o valor ainda não foi apurado.
            // Movimenta zero e diz por quê — não some da linha do tempo.
            linha.eventos.push({ ...e, meta, valorNoMes: null, lacuna: true });
            linha.alertas.push({ nivel: 'atencao', texto: `${e.rotulo}: valor ainda não calculado. O número desta projeção está otimista pelo tamanho desse imposto.` });
            break;
          }
          const pedido = e.esvazia ? disponivel(e.caixinha) : e.valor;
          const v = Math.min(pedido, disponivel(e.caixinha));
          if (v < pedido - 0.01) {
            linha.alertas.push({
              nivel: 'erro',
              texto: `"${e.rotulo}" pede ${brl(pedido)} e a caixinha tem ${brl(disponivel(e.caixinha))}. Faltam ${brl(pedido - v)}.`,
            });
          }
          debitar(e.caixinha, v);
          linha.eventos.push({ ...e, meta, valorNoMes: v, pedido });
          break;
        }

        case EVENTO.SAQUE_CONTINUO: {
          const v = Math.min(e.valor, disponivel(e.caixinha));
          if (v < e.valor - 0.01) {
            linha.alertas.push({
              nivel: 'erro',
              texto: `"${e.rotulo}" pede ${brl(e.valor)}/mês e a caixinha acabou. Este mês saiu ${brl(v)}.`,
            });
          }
          debitar(e.caixinha, v);
          saiDoFluxo += v;
          linha.eventos.push({ ...e, meta, valorNoMes: v, pedido: e.valor });
          break;
        }

        case EVENTO.CONSUMO: {
          let k = consumos[e.id];
          if (!k) {
            k = consumos[e.id] = {
              caixinha: e.caixinha, mes: e.mes, mesFim: e.mesFim, rotulo: e.rotulo,
              pv: disponivel(e.caixinha),
              pmt: pmtConsumoImediato(disponivel(e.caixinha), taxaMensal(taxa[e.caixinha]), e.mesFim - e.mes + 1),
            };
          }
          const v = Math.min(k.pmt, disponivel(e.caixinha));
          debitar(e.caixinha, v);
          saiDoFluxo += v;
          linha.eventos.push({ ...e, meta, valorNoMes: v, pmt: k.pmt, pv: k.pv, recalculadoEm: k.recalculadoEm });
          break;
        }

        case EVENTO.PERPETUIDADE: {
          // "Sacar só a rentabilidade, sem mexer no principal" tem um teto E um
          // piso. O teto é o rendimento do mês. O piso é o que o orçamento pede:
          // sacar o rendimento inteiro quando se gasta menos que isso faria
          // dinheiro sair da carteira para lugar nenhum. Então saca-se o que a
          // vida custa, limitado ao que a carteira rendeu.
          const rende = Math.max(0, rendimento[e.caixinha]);
          const precisa = e.valor != null ? e.valor : Math.max(0, -sobra - saiDoFluxo);
          const v = Math.min(rende, precisa, disponivel(e.caixinha));
          if (precisa > rende + 0.01) {
            linha.alertas.push({
              nivel: 'erro',
              texto: `O padrão de vida pede ${brl(precisa)} e a carteira rendeu ${brl(rende)}. Manter isso significa consumir o principal.`,
            });
          }
          debitar(e.caixinha, v);
          saiDoFluxo += v;
          linha.eventos.push({ ...e, meta, valorNoMes: v, rendeu: rende, precisa });
          break;
        }

        case EVENTO.RENTABILIDADE:
          linha.eventos.push({ ...e, meta, valorNoMes: 0 });
          break;

        default:
          break;
      }
    }

    // ── 5. Conciliação: nenhum real evapora em silêncio ──
    //
    // E, tão importante quanto: um mês em que a vida é sustentada pelo
    // patrimônio — como planejado, depois que o trabalho para — NÃO é um mês no
    // vermelho. Antes o motor tratava os dois casos com a mesma gramática, e a
    // tela pintava 35 anos de aposentadoria como déficit. O plano funcionando
    // exatamente como foi desenhado aparecia como três décadas de fracasso.
    const descasamento = sobra - (entraDoFluxo - saiDoFluxo);
    const folga = Math.max(TOLERANCIA_FLUXO.pisoAbsoluto, Math.abs(sobra) * TOLERANCIA_FLUXO.fracao);
    const precisaDoPatrimonio = Math.max(0, -sobra);

    let natureza;
    if (!f.achou) natureza = 'semOrcamento';
    else if (precisaDoPatrimonio > 0) {
      natureza = saiDoFluxo >= precisaDoPatrimonio - folga ? 'sustentadoPeloPatrimonio' : 'descoberto';
    } else if (sobra > 0) {
      natureza = descasamento > folga ? 'sobrouSemDestino' : 'poupando';
    } else natureza = 'parado';

    if (natureza === 'semOrcamento') {
      linha.alertas.push({ nivel: 'atencao', texto: 'Ainda não sabemos quanto entra e quanto sai neste mês.' });
    } else if (natureza === 'descoberto') {
      // O caso que o alerta antigo descrevia ao contrário: aqui o plano traz
      // MENOS do que a vida custa, não mais.
      linha.alertas.push({ nivel: 'erro',
        texto: `A vida custa ${brl(despesa)} e o plano traz ${brl(saiDoFluxo)} do patrimônio. Faltam ${brl(precisaDoPatrimonio - saiDoFluxo)} neste mês.` });
    } else if (natureza === 'sobrouSemDestino') {
      linha.alertas.push({ nivel: 'atencao', texto: `${brl(descasamento)} sobraram neste mês sem destino definido.` });
    } else if (descasamento < -folga) {
      linha.alertas.push({ nivel: 'erro',
        texto: `O plano manda guardar ${brl(entraDoFluxo)}, mas sobram ${brl(sobra)} no mês. Faltam ${brl(-descasamento)}.` });
    }

    // ── 6. Fecha o mês ──
    for (const c of caixinhas) {
      if (saldo[c.id] < -0.01) {
        linha.alertas.push({ nivel: 'erro', texto: `A caixinha "${c.nome}" ficou negativa em ${brl(-saldo[c.id])} e foi zerada. Isso é um furo do plano, não um arredondamento.` });
      }
      if (saldo[c.id] < 0) saldo[c.id] = 0;
      linha.caixinhas[c.id] = {
        abertura: abertura[c.id],
        rendimento: rendimento[c.id],
        aportes: aportes[c.id] || 0,
        saques: saques[c.id] || 0,
        fechamento: saldo[c.id],
        taxaAnual: taxa[c.id],
      };
      linha.camadas[c.camada] += saldo[c.id];
    }

    linha.quebrou = linha.alertas.some((a) => a.nivel === 'erro');
    linha.total = linha.camadas.financeiro + linha.camadas.bens + linha.camadas.participacoes;
    linha.fluxo = {
      receita: f.receita, despesa, sobra, componentes: f.componentes, natureza,
      entra: entraDoFluxo, sai: saiDoFluxo, descasamento,
      // Quanto do mês veio do patrimônio POR PLANO — a barra desenha isto em
      // cor neutra; laranja fica reservado ao que de fato está descoberto.
      doPatrimonio: natureza === 'sustentadoPeloPatrimonio' ? saiDoFluxo : 0,
      descoberto: natureza === 'descoberto' ? precisaDoPatrimonio - saiDoFluxo : 0,
      rotulo: f.rotulo, premissa: f.premissa, semOrcamento: !f.achou,
    };
    if (linha.total > maximo) maximo = linha.total;
    meses.push(linha);
  }

  // ── Coerência declarada: janela "só rendendo" que na verdade tem movimento ──
  for (const janela of eventos.filter((e) => e.tipo === EVENTO.RENTABILIDADE)) {
    const conflito = eventos.find((e) =>
      [EVENTO.APORTE_CONTINUO, EVENTO.APORTE_PONTUAL, EVENTO.SAQUE_CONTINUO, EVENTO.SAQUE_PONTUAL,
       EVENTO.CONSUMO, EVENTO.PERPETUIDADE].includes(e.tipo) &&
      (janela.caixinha == null || e.caixinha === janela.caixinha) && // janela sem caixinha = carteira toda
      e.mes <= (janela.mesFim ?? Infinity) && (e.mesFim ?? e.mes) >= janela.mes);
    if (conflito) {
      alertas.push({
        nivel: 'atencao',
        texto: `A janela "${janela.rotulo}" foi declarada como só rendimento, mas "${conflito.rotulo}" movimenta a mesma caixinha dentro dela.`,
      });
    }
  }

  return { meses, alertas, caixinhas, maximo, horizonte, inicio };
}

/** Mês 1 = `inicio`. */
export function dataDoMes(inicio, m) {
  const total = (inicio.mes - 1) + (m - 1);
  const ano = inicio.ano + Math.floor(total / 12);
  const mes = (total % 12) + 1;
  return { ano, mes, rotulo: `${MES_CURTO[mes - 1]}/${ano}`, rotuloCurto: MES_CURTO[mes - 1] };
}

export const MES_CURTO = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

export const brl = (n) =>
  (Number.isFinite(Number(n))
    ? Number(n).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
    : '—'); // nunca "R$ 0" para um número que não existe

/** Abreviação para eixos: "1,2 mi", "340 mil". Não cabe "R$ 1.234.567" num tick. */
export function brlCurto(n) {
  if (!Number.isFinite(Number(n))) return '—';
  const v = Math.abs(n);
  if (v >= 1e6) return `${(n / 1e6).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} mi`;
  if (v >= 1e3) return `${Math.round(n / 1e3)} mil`;
  return Math.round(n).toString();
}

/** Projeção não merece precisão ao real. Exato só onde o dado é verificável. */
export function brlProjetado(n) {
  if (!Number.isFinite(Number(n))) return '—';
  const v = Math.abs(n);
  if (v >= 1e6) return `R$ ${(n / 1e6).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} milhões`;
  if (v >= 1e5) return `R$ ${Math.round(n / 1e3)} mil`;
  return brl(n);
}

export const pct = (t) => `${(t * 100).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}% a.a.`;

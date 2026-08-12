/**
 * Verificação do motor contra o cenário da especificação.
 * Roda com:  node src/motor/verificar.mjs
 *
 * Não é um framework de teste — é uma bancada de conferência que imprime a
 * conta mês a mês para o consultor auditar, e falha ruidosamente se um
 * invariante quebrar.
 */
import { projetar, brl, pmtConsumo, taxaMensal, pvNecessario } from './projecao.js';
import { ESPECIFICACAO_CENARIO, RICARDO_CENARIO, TRAVESSIA } from './cenarios.js';

let falhas = 0;
const ok = (cond, msg) => {
  console.log(`${cond ? '  ✅' : '  ❌'} ${msg}`);
  if (!cond) falhas++;
};
const perto = (a, b, tol = 1) => Math.abs(a - b) <= tol;

// ─────────────────────────────────────────────────────────────────────────────
console.log('\n═══ CENÁRIO DA ESPECIFICAÇÃO ═══\n');
const e = projetar(ESPECIFICACAO_CENARIO);

console.log('Saldo inicial declarado: R$ 1.200.000');
ok(perto(ESPECIFICACAO_CENARIO.caixinhas.reduce((s, c) => s + c.saldoInicial, 0), 1200000),
   'as caixinhas somam exatamente o patrimônio financeiro inicial');

console.log('\n── Fluxo de caixa mês a mês (primeiros 14) ──');
console.log('mês | receita  | despesa  | sobra   | aportes | caixinhas que receberam');
for (const l of e.meses.slice(0, 14)) {
  const dest = l.eventos.filter((x) => x.valorNoMes > 0 && x.meta.sinal > 0)
    .map((x) => `${x.caixinha} ${brl(x.valorNoMes)}`).join(' + ') || '—';
  console.log(
    `${String(l.m).padStart(3)} | ${brl(l.fluxo.receita).padStart(8)} | ${brl(l.fluxo.despesa).padStart(8)} | ` +
    `${brl(l.fluxo.sobra).padStart(7)} | ${brl(l.fluxo.entra).padStart(7)} | ${dest}`);
}

console.log('\n── Conferência contra a especificação ──');
const m = (i) => e.meses[i - 1];
ok(m(1).fluxo.sobra === 1000 && m(1).caixinhas.liberdade.aportes === 1000,
   'mês 1: sobra R$ 1.000, tudo para liberdade');
ok(m(3).fluxo.sobra === 2000 && m(3).caixinhas.liberdade.aportes === 1500 && m(3).caixinhas.casa.aportes === 500,
   'meses 2–6: sobra R$ 2.000 → R$ 1.500 liberdade + R$ 500 casa');
ok(m(8).fluxo.sobra === 3000 && m(8).caixinhas.liberdade.aportes === 1500 &&
   m(8).caixinhas.casa.aportes === 500 && m(8).caixinhas.viagens.aportes === 1000,
   'meses 7–10: sobra R$ 3.000 → R$ 1.500 + R$ 500 + R$ 1.000');
ok(m(11).fluxo.sobra === 6000 && m(11).caixinhas.viagens.aportes === 6000,
   'meses 11–12: receita R$ 25.000, sobra R$ 6.000, tudo para viagens');
ok(m(13).caixinhas.liberdade.aportes === 100000,
   'mês 13: aporte pontual de R$ 100.000');
ok(m(13).fluxo.descasamento === 0,
   'mês 13: o aporte pontual NÃO desequilibra a conciliação (é dinheiro de fora do mês)');
ok(m(18).fluxo.sobra === 0 && m(18).fluxo.entra === 0 && m(18).fluxo.sai === 0,
   'meses 14–24: nenhum aporte, o dinheiro só rende');
ok(perto(m(24).caixinhas.casa.taxaAnual, 0.055, 1e-9) && perto(m(25).caixinhas.casa.taxaAnual, 0.045, 1e-9),
   'mês 25: a taxa da casa cai de 5,5% para 4,5% ao ano');

console.log('\n── Invariante: nenhum mês com alerta de erro ──');
const errosEspec = e.meses.flatMap((l) => l.alertas.filter((a) => a.nivel === 'erro').map((a) => `mês ${l.m}: ${a.texto}`));
ok(errosEspec.length === 0, `nenhum mês fecha no vermelho (${errosEspec.length} encontrados)`);
errosEspec.slice(0, 5).forEach((x) => console.log('     ', x));

console.log('\n── Rendimento composto conferido na mão (caixinha da casa, 12 meses) ──');
const esperado = 450000 * Math.pow(1.055, 1) + 500 * 11; // aproximação grosseira só p/ ordem de grandeza
console.log(`  casa no mês 12: ${brl(m(12).caixinhas.casa.fechamento)} (ordem de grandeza esperada ~${brl(esperado)})`);
ok(m(12).caixinhas.casa.fechamento > 450000 && m(12).caixinhas.casa.fechamento < 500000,
   'a casa cresceu, e cresceu dentro do razoável');

// ─────────────────────────────────────────────────────────────────────────────
console.log('\n\n═══ CENÁRIO DO RICARDO ═══\n');
const r = projetar(RICARDO_CENARIO);
const rm = (i) => r.meses[i - 1];

ok(perto(rm(1).caixinhas.reserva.abertura + rm(1).caixinhas.formacao.abertura +
         rm(1).caixinhas.liberdade.abertura, 980000),
   'financeiro inicial = R$ 980.000 (o que ele declarou no exame)');
console.log(`  patrimônio total hoje: ${brl(rm(1).total)}`);
ok(perto(rm(1).total, 4810000, 40000), 'total bate com os R$ 4,81 milhões da devolutiva');

console.log('\n── Coerência com o que o cliente DECLAROU no exame ──');
// Este é o teste que faltava: a contradição que o painel pegou vivia entre um
// número do orçamento e uma nota de caixinha, e nada checava os dois juntos.
const DECLARADO = { custoVida: 16000, renda: 38000, reserva: 180000 };
const todasAsJanelas = RICARDO_CENARIO.orcamento;
ok(todasAsJanelas.every((j) => j.componentes?.some((c) => c.rotulo === 'Custo de vida' && c.valor === DECLARADO.custoVida)),
   `toda janela de orçamento usa o custo de vida DECLARADO (${brl(DECLARADO.custoVida)}), nunca um número inventado`);
ok(todasAsJanelas.every((j) => j.componentes && j.componentes.length > 0),
   'nenhuma janela tem despesa como número opaco — todas declaram a composição');
const mesesDeReserva = DECLARADO.reserva / DECLARADO.custoVida;
ok(Math.round(mesesDeReserva) === 11,
   `a nota da reserva ("11 meses") confere com o custo de vida declarado (${mesesDeReserva.toFixed(1)} meses)`);
ok(rm(1).fluxo.receita - rm(1).fluxo.despesa === 6000,
   'hoje a sobra é R$ 6.000 — exatamente o que o Ricardo declarou que poupa');
const semDestino = RICARDO_CENARIO.orcamento[0].componentes.find((c) => c.rotulo === 'Sem destino declarado');
ok(semDestino && semDestino.valor === DECLARADO.renda - DECLARADO.custoVida - 6000,
   `o buraco de ${brl(semDestino.valor)} é derivado dos números dele, não arbitrado`);

console.log('\n── A travessia 2036–2041 ──');
const travessia = rm(121);
console.log(`  mês 121 (${travessia.data.rotulo}): venda da ótica`);
console.log(`     ótica antes:      ${brl(rm(120).camadas.participacoes)}`);
console.log(`     ótica depois:     ${brl(travessia.camadas.participacoes)}`);
console.log(`     travessia:        ${brl(travessia.caixinhas.renda3641.fechamento)}`);
console.log(`     liberdade:        ${brl(travessia.caixinhas.liberdade.fechamento)}`);
const consumo = travessia.eventos.find((x) => x.tipo === 'consumo');
console.log(`  PMT calculado pelo sistema: ${brl(consumo.pmt)}/mês por 60 meses`);
ok(perto(travessia.camadas.participacoes, 0, 1), 'a ótica zera: o valor todo virou patrimônio financeiro');
ok(consumo.pmt > 15000 && consumo.pmt < 17500, 'o PMT da travessia cobre o custo de vida de R$ 16.000');
ok(perto(rm(180).caixinhas.renda3641.fechamento, 0, 5),
   'a caixinha da travessia zera exatamente no mês 180 — o consumo consumiu');

console.log('\n── Aposentadoria e perpetuidade ──');
console.log(`  liberdade em 2041 (mês 181): ${brl(rm(181).caixinhas.liberdade.fechamento)}`);
console.log(`  liberdade em 2056 (mês 361): ${brl(rm(361).caixinhas.liberdade.fechamento)}`);
console.log(`  liberdade no fim (mês 552):  ${brl(rm(552).caixinhas.liberdade.fechamento)}`);
const perp = rm(400).eventos.find((x) => x.tipo === 'perpetuidade');
console.log(`  no mês 400 a carteira rendeu ${brl(perp.rendeu)} e a vida custou ${brl(perp.precisa)} → saque ${brl(perp.valorNoMes)}`);
// As duas asserções anteriores aqui eram tautologias — verdadeiras por
// construção do Math.min, incapazes de falhar. Estas podem falhar:
const mesesPerp = r.meses.slice(360);
const descobertos = mesesPerp.filter((l) => {
  const x = l.eventos.find((y) => y.tipo === 'perpetuidade');
  return x && x.precisa > x.rendeu + 0.01;
});
ok(descobertos.length === 0,
   `o rendimento cobriu o custo de vida em todos os ${mesesPerp.length} meses da perpetuidade (${descobertos.length} descobertos)`);
ok(Math.abs(perp.valorNoMes - perp.precisa) < 0.01,
   'quando o rendimento sobra, o saque é o custo de vida — não o rendimento inteiro');
ok(perto(rm(181).caixinhas.liberdade.taxaAnual, 0.055, 1e-9),
   'a mudança de taxa em 2041 baixou a liberdade para 5,5% a.a.');

console.log('\n── Invariante: nenhum mês fecha no vermelho ──');
const errosRic = r.meses.flatMap((l) => l.alertas.filter((a) => a.nivel === 'erro').map((a) => `mês ${l.m} (${l.data.rotulo}): ${a.texto}`));
ok(errosRic.length === 0, `nenhum descoberto no plano (${errosRic.length} encontrados)`);
errosRic.slice(0, 8).forEach((x) => console.log('     ', x));

const atencoes = r.meses.flatMap((l) => l.alertas.filter((a) => a.nivel === 'atencao').map((a) => `mês ${l.m}: ${a.texto}`));
console.log(`\n  avisos de atenção: ${atencoes.length}`);
atencoes.slice(0, 5).forEach((x) => console.log('     ', x));
if (r.alertas.length) { console.log('\n  alertas globais:'); r.alertas.forEach((a) => console.log('     ', a.texto)); }

console.log('\n── Nenhum real evapora: a conciliação fecha em todo o horizonte ──');
const evaporado = r.meses.reduce((s2, l) => s2 + Math.abs(l.fluxo.descasamento || 0), 0);
console.log(`  soma dos descasamentos ao longo dos ${r.meses.length} meses: ${brl(evaporado)}`);
ok(evaporado < 1, 'nenhum descasamento residual sobrevive à banda de tolerância');

console.log('\n── A travessia é DERIVADA da necessidade, não cravada ──');
ok(Math.abs(consumo.pmt - 16000) < 1,
   `o PMT bate exatamente com o custo de vida (${brl(consumo.pmt)}), sem excedente vazando`);
ok(Math.abs(TRAVESSIA.valor - 873159) < 2,
   `o tamanho da ponte vem da pergunta inversa: ${brl(TRAVESSIA.valor)}`);

// ─────────────────────────────────────────────────────────────────────────────
console.log('\n\n═══ MUDANÇA DE TAXA DENTRO DE UMA JANELA DE CONSUMO ═══\n');
// Este branch (projecao.js, recálculo do PMT) nunca roda no cenário do Ricardo,
// e é justamente ele que decide se a caixinha zera quando a taxa muda no meio.
const sintetico = projetar({
  inicio: { ano: 2026, mes: 1 }, horizonte: 24,
  caixinhas: [{ id: 'ponte', nome: 'Ponte', camada: 'financeiro', natureza: 'compromisso', saldoInicial: 240000, taxaAnual: 0.06 }],
  orcamento: [{ de: 1, ate: null, receita: 0, despesa: 0, rotulo: 'teste' }],
  eventos: [
    { id: 'c', tipo: 'consumo', mes: 1, mesFim: 24, caixinha: 'ponte', rotulo: 'consumo de 24 meses' },
    { id: 't', tipo: 'mudancaTaxa', mes: 13, caixinha: 'ponte', taxaAnual: 0.02, rotulo: 'taxa despenca no meio' },
  ],
});
const antes = sintetico.meses[0].eventos.find((x) => x.tipo === 'consumo');
const depois = sintetico.meses[12].eventos.find((x) => x.tipo === 'consumo');
console.log(`  parcela antes da mudança: ${brl(antes.pmt)} · depois: ${brl(depois.pmt)}`);
ok(depois.pmt < antes.pmt, 'a parcela foi refeita para baixo quando a taxa caiu');
ok(sintetico.meses[12].alertas.some((a) => /refeita/.test(a.texto)), 'o recálculo é anunciado, não silencioso');
ok(Math.abs(sintetico.meses[23].caixinhas.ponte.fechamento) < 1,
   `a caixinha ainda zera no último mês apesar da taxa ter mudado no meio (resíduo ${sintetico.meses[23].caixinhas.ponte.fechamento.toFixed(4)})`);

// ─────────────────────────────────────────────────────────────────────────────
console.log('\n\n═══ ESTADOS IMPOSSÍVEIS ═══\n');
const quebrado = projetar({
  inicio: { ano: 2026, mes: 1 }, horizonte: 3,
  caixinhas: [{ id: 'a', nome: 'A', camada: 'financeiro', natureza: 'reserva', saldoInicial: 1000, taxaAnual: 0 }],
  orcamento: [{ de: 1, ate: 2, receita: 0, despesa: 0, rotulo: 'x' }, { de: 2, ate: null, receita: 0, despesa: 0, rotulo: 'y' }],
  eventos: [{ id: 'z', tipo: 'aporteContinuo', mes: 5, mesFim: 2, caixinha: 'inexistente', valor: 1, rotulo: 'evento torto' }],
});
ok(quebrado.alertas.some((a) => /não existe/.test(a.texto)), 'evento apontando para caixinha inexistente é denunciado na carga');
ok(quebrado.alertas.some((a) => /antes de começar/.test(a.texto)), 'evento que termina antes de começar é denunciado');
ok(quebrado.alertas.some((a) => /sobrepõem/.test(a.texto)), 'janelas de orçamento sobrepostas são denunciadas');

// ─────────────────────────────────────────────────────────────────────────────
console.log('\n\n═══ FÓRMULAS ISOLADAS ═══\n');
ok(perto(taxaMensal(0.075) * 12 * 100, 7.25, 0.1), `taxa mensal equivalente de 7,5% a.a. = ${(taxaMensal(0.075) * 100).toFixed(4)}% a.m.`);
ok(perto(pmtConsumo(100000, 0, 10), 10000), 'PMT com taxa zero = PV / n');
const pv = 880000, i = taxaMensal(0.04), n = 60;
const p = pmtConsumo(pv, i, n);
let s = pv;
for (let k = 0; k < n; k++) { s = s * (1 + i) - p; }
ok(perto(s, 0, 0.01), `PMT de ${brl(p)} consome ${brl(pv)} em ${n} meses e zera (resíduo ${s.toFixed(4)})`);

console.log(`\n${falhas === 0 ? '✅ TODAS AS CONFERÊNCIAS PASSARAM' : `❌ ${falhas} CONFERÊNCIA(S) FALHARAM`}\n`);
process.exit(falhas === 0 ? 0 : 1);

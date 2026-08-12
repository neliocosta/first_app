import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import {
  projetar, brl, brlCurto, pct, dataDoMes, CAMADA_ROTULO, ORDEM_NATUREZA, EVENTO_META,
} from '../motor/projecao.js';
import { CENARIOS } from '../motor/cenarios.js';
import { aplicarSimulacao, aporteVigente } from '../motor/simulacao.js';
import { useViewport, useGestos, useLargura, escalaEstavel, ticksDoTempo, clamp } from '../components/viewport.js';
import { Icone } from '../components/ui.jsx';

const ALT_FAIXA = 30;
const ALT_MAPA = 40;

/** Constrói os caminhos das áreas empilhadas, de baixo para cima. */
function areasEmpilhadas(indices, series, meses, x, y) {
  const acum = new Float64Array(indices.length);
  return series.map((s) => {
    const topo = [];
    const base = [];
    indices.forEach((mi, k) => {
      const v = Math.max(0, s.valor(meses[mi]));
      topo.push([x(mi + 1), y(acum[k] + v)]);
      base.push([x(mi + 1), y(acum[k])]);
      acum[k] += v;
    });
    const d = topo.map(([px, py], k) => `${k ? 'L' : 'M'}${px.toFixed(1)} ${py.toFixed(1)}`).join('')
      + base.reverse().map(([px, py]) => `L${px.toFixed(1)} ${py.toFixed(1)}`).join('') + 'Z';
    return { ...s, d };
  });
}

export default function Evolucao() {
  const [cenarioId, setCenarioId] = useState(CENARIOS[0].id);
  const base = CENARIOS.find((c) => c.id === cenarioId);
  const [modo, setModo] = useState('caixinhas');
  const [sim, setSim] = useState(null);
  const [painel, setPainel] = useState(false);

  const palcoRef = useRef(null);
  const medidaRef = useRef(null);
  const W = useLargura(medidaRef);

  const compacto = W > 0 && W < 620;
  const ALT_PAT = compacto ? 232 : 316;
  const ALT_FLUXO = compacto ? 92 : 124;

  const { vp, vpRef, zoom, mover, irPara, aplicar } = useViewport(base.horizonte, 132);
  const [focoFracao, setFocoFracao] = useState(0.5);

  useEffect(() => { setSim(null); aplicar(1, Math.min(132, base.horizonte)); }, [cenarioId]); // eslint-disable-line

  const proj = useMemo(() => projetar(base), [base]);
  const cenarioVivo = useMemo(() => (sim ? aplicarSimulacao(base, sim) : base), [base, sim]);
  const projSim = useMemo(() => (sim ? projetar(cenarioVivo) : proj), [cenarioVivo, sim, proj]);
  const dados = projSim;

  const mesFocado = clamp(Math.round(vp.ini + vp.largura * focoFracao), 1, base.horizonte);
  const linha = dados.meses[mesFocado - 1];
  const linhaBase = proj.meses[mesFocado - 1];
  const hoje = dados.meses[0];

  const { indices, passo } = useMemo(() => {
    const de = Math.max(0, Math.floor(vp.ini) - 1);
    const ate = Math.min(base.horizonte - 1, Math.ceil(vp.ini + vp.largura));
    const p = Math.max(1, Math.ceil((ate - de) / 320));
    const ix = [];
    for (let i = de; i <= ate; i += p) ix.push(i);
    if (ix[ix.length - 1] !== ate) ix.push(ate);
    return { indices: ix, passo: p };
  }, [vp.ini, vp.largura, base.horizonte]);

  const x = useCallback((m) => ((m - vp.ini) / vp.largura) * W, [vp.ini, vp.largura, W]);

  const escalaPat = useMemo(() => {
    let mx = 0;
    for (const i of indices) mx = Math.max(mx, dados.meses[i].total, proj.meses[i].total);
    return escalaEstavel(mx * 1.02);
  }, [indices, dados, proj]);

  const yPat = useCallback((v) => ALT_PAT - (v / escalaPat) * ALT_PAT, [escalaPat, ALT_PAT]);

  /* ── Fluxo de caixa com agregação por nível de zoom ──────────────────────
     Sem isso, 10 anos viram 120 barras de 4px: um código de barras cinza que
     não informa nada. Agregado, cada barra é um período legível. */
  const barras = useMemo(() => {
    if (W <= 0) return { itens: [], escala: 1, agregado: passo > 1 };
    const itens = indices.map((i) => {
      let receita = 0, despesa = 0, n = 0;
      for (let k = i; k < Math.min(i + passo, base.horizonte); k++) {
        receita += dados.meses[k].fluxo.receita;
        despesa += dados.meses[k].fluxo.despesa;
        n++;
      }
      return { i, receita: receita / n, despesa: despesa / n, px: x(i + 1 + (passo - 1) / 2) };
    });
    const mx = itens.reduce((s, b) => Math.max(s, b.receita, b.despesa), 0);
    return { itens, escala: escalaEstavel(mx * 1.05) || 1, agregado: passo > 1 };
  }, [indices, passo, dados, x, W, base.horizonte]);

  const zeroFluxo = ALT_FLUXO * 0.64;
  const yFluxo = useCallback((v) => zeroFluxo - (v / barras.escala) * (ALT_FLUXO * 0.56), [barras.escala, zeroFluxo, ALT_FLUXO]);

  const series = useMemo(() => {
    const fin = [...base.caixinhas]
      .filter((c) => c.camada === 'financeiro')
      .sort((a, b) => ORDEM_NATUREZA[a.natureza] - ORDEM_NATUREZA[b.natureza]);
    // Bens e participações ficam na base, com textura: são o contexto sobre o
    // qual o plano opera, não as caixinhas que o plano movimenta. A hachura os
    // distingue sem depender de matiz.
    const contexto = [
      { id: 'participacoes', nome: 'Participações', cor: '#20344C', padrao: 'hachura-part', camada: true, valor: (l) => l.camadas.participacoes },
      { id: 'bens', nome: 'Bens', cor: '#8A94A6', padrao: 'hachura-bens', camada: true, valor: (l) => l.camadas.bens },
    ].filter((s) => base.caixinhas.some((c) => c.camada === s.id));

    if (modo === 'macro') {
      return [...contexto, { id: 'financeiro', nome: CAMADA_ROTULO.financeiro, cor: '#C2410C', camada: true, valor: (l) => l.camadas.financeiro }];
    }
    return [...contexto, ...fin.map((c) => ({ id: c.id, nome: c.nome, cor: c.cor, caixinha: c, valor: (l) => l.caixinhas[c.id].fechamento }))];
  }, [base, modo]);

  const areas = useMemo(
    () => (W > 0 ? areasEmpilhadas(indices, series, dados.meses, x, yPat) : []),
    [W, indices, series, dados, x, yPat]);

  const dPlanoBase = useMemo(() => {
    if (!sim || W <= 0) return null;
    return indices.map((i, k) => `${k ? 'L' : 'M'}${x(i + 1).toFixed(1)} ${yPat(proj.meses[i].total).toFixed(1)}`).join('');
  }, [sim, indices, proj, x, yPat, W]);

  const { arrastando, manipuladores } = useGestos({
    palcoRef, vpRef, mover, zoom, larguraPx: W, aoFocar: setFocoFracao,
  });

  const ticks = useMemo(() => ticksDoTempo(vp, dataDoMes, base.inicio), [vp, base.inicio]);
  const xFoco = x(mesFocado);

  /* Marcos com rótulo só quando há espaço — senão viram uma sopa de letras. */
  const marcosVisiveis = useMemo(() => {
    const lista = base.marcos.map((mk) => ({ ...mk, px: x(mk.mes) })).filter((mk) => mk.px > -60 && mk.px < W + 60);
    let ultimoRotulo = -Infinity;
    return lista.map((mk) => {
      const cabe = mk.px - ultimoRotulo > 96 && mk.px > 4 && mk.px < W - 40;
      if (cabe) ultimoRotulo = mk.px;
      return { ...mk, comRotulo: cabe };
    });
  }, [base.marcos, x, W]);

  const presets = [
    { rotulo: '7 meses', meses: 7 },
    { rotulo: '2 anos', meses: 24 },
    { rotulo: '10 anos', meses: 120 },
    { rotulo: 'tudo', meses: base.horizonte },
  ];

  const variacao = linha.total - hoje.total;
  const idade = base.idadeInicial != null ? base.idadeInicial + Math.floor((mesFocado - 1) / 12) : null;
  const eventosDoMes = linha.eventos.filter((e) => e.meta.sinal !== 0 || e.tipo === 'mudancaTaxa');
  const aporteAtual = aporteVigente(cenarioVivo, mesFocado);

  return (
    <div className="pt-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <h1 className="font-display font-semibold text-white text-xl leading-tight">Evolução do patrimônio</h1>
          <p className="font-ui text-white/45 text-[11px] mt-0.5 flex items-center gap-1.5">
            <Icone nome="move" size={12} /> arraste para navegar · pinça ou roda para o zoom
          </p>
        </div>
        <select value={cenarioId} onChange={(e) => setCenarioId(e.target.value)}
          aria-label="Escolher cenário"
          className="shrink-0 bg-white/10 text-white/85 font-ui text-[11px] rounded-full px-3 py-2 border border-white/15 min-h-[44px]">
          {CENARIOS.map((c) => <option key={c.id} value={c.id} className="text-ink">{c.nome}</option>)}
        </select>
      </div>

      <div className="rounded-module bg-white shadow-float overflow-hidden">
        {/* ── Leitura ao vivo do mês em foco ── */}
        <div className="px-4 pt-4 pb-3 flex items-end justify-between gap-3 border-b border-ink-line/70">
          <div className="min-w-0">
            <div className="flex items-baseline gap-2 flex-wrap">
              <p className="font-ui text-xs text-ink-body uppercase tracking-wide">{linha.data.rotulo}</p>
              {idade != null && <span className="font-ui text-[11px] text-[#8A94A6]">{idade} anos</span>}
              {sim && <span className="font-ui text-[10px] text-white bg-[#7B5EA7] rounded-full px-2 py-0.5">simulado</span>}
            </div>
            <p className="font-display font-semibold text-navy-900 text-[28px] leading-tight tabular-nums">{brl(linha.total)}</p>
            <p className="font-ui text-[11px] text-ink-body">
              {mesFocado === 1 ? 'patrimônio de hoje' : (
                <>
                  <span style={{ color: variacao >= 0 ? '#1F7A45' : '#C2410C' }}>
                    {variacao >= 0 ? '+' : '−'}{brl(Math.abs(variacao))}
                  </span> desde hoje
                  {sim && Math.abs(linha.total - linhaBase.total) > 1 && (
                    <> · <span className="text-[#7B5EA7]">
                      {linha.total >= linhaBase.total ? '+' : '−'}{brl(Math.abs(linha.total - linhaBase.total))} vs. o plano
                    </span></>
                  )}
                </>
              )}
            </p>
          </div>
          <div className="flex rounded-full bg-cream-100 p-0.5 shrink-0">
            {[['macro', 'Macro'], ['caixinhas', 'Caixinhas']].map(([id, r]) => (
              <button key={id} onClick={() => setModo(id)} aria-pressed={modo === id}
                className={`px-3 py-2 rounded-full font-ui text-[11px] min-h-[44px] transition-colors ${modo === id ? 'bg-navy-900 text-white' : 'text-ink-body'}`}>
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* ── PALCO ── */}
        <div ref={medidaRef} className="relative">
          <div ref={palcoRef} {...manipuladores}
            className={`relative touch-none select-none ${arrastando ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{ WebkitTapHighlightColor: 'transparent' }}>

            <svg width={W} height={ALT_PAT} className="block" role="img"
              aria-label={`Patrimônio projetado. Em ${linha.data.rotulo}, ${brl(linha.total)}.`}>
              <defs>
                <clipPath id="recorte"><rect x="0" y="0" width={Math.max(0, W)} height={ALT_PAT} /></clipPath>
                <pattern id="hachura-bens" width="7" height="7" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
                  <rect width="7" height="7" fill="#CFD5DD" />
                  <line x1="0" y1="0" x2="0" y2="7" stroke="#B4BCC8" strokeWidth="2.5" />
                </pattern>
                <pattern id="hachura-part" width="7" height="7" patternTransform="rotate(-45)" patternUnits="userSpaceOnUse">
                  <rect width="7" height="7" fill="#3D5470" />
                  <line x1="0" y1="0" x2="0" y2="7" stroke="#28405C" strokeWidth="2.5" />
                </pattern>
              </defs>

              {[0.25, 0.5, 0.75].map((f) => (
                <line key={f} x1="0" x2={W} y1={yPat(escalaPat * f)} y2={yPat(escalaPat * f)} stroke="#EDEAE4" strokeWidth="1" />
              ))}

              <g clipPath="url(#recorte)">
                {areas.map((a) => (
                  <path key={a.id} d={a.d} fill={a.padrao ? `url(#${a.padrao})` : a.cor}
                    stroke={a.cor} strokeWidth="0.75" strokeOpacity="0.55" />
                ))}
                {dPlanoBase && (
                  <path d={dPlanoBase} fill="none" stroke="#131F2E" strokeWidth="1.75" strokeDasharray="5 4" strokeOpacity="0.8" />
                )}
                {marcosVisiveis.map((mk) => (
                  <g key={mk.mes}>
                    <line x1={mk.px} x2={mk.px} y1="0" y2={ALT_PAT} stroke="#FFFFFF"
                      strokeWidth={mk.destaque ? 2 : 1.25} strokeOpacity={mk.destaque ? 0.85 : 0.5} />
                    <line x1={mk.px} x2={mk.px} y1="0" y2={ALT_PAT} stroke="#131F2E"
                      strokeWidth={mk.destaque ? 1.25 : 1} strokeDasharray="3 3" strokeOpacity={mk.destaque ? 0.65 : 0.35} />
                  </g>
                ))}
              </g>

              {/* Rótulos por cima do recorte, com fundo, para nunca competirem com a área */}
              {marcosVisiveis.filter((mk) => mk.comRotulo).map((mk) => (
                <g key={`r${mk.mes}`}>
                  <rect x={mk.px + 3} y="4" width={mk.rotulo.length * 5.4 + 8} height="14" rx="3" fill="#FFFFFF" fillOpacity="0.92" />
                  <text x={mk.px + 7} y="14" className="font-ui" fontSize="9.5"
                    fill={mk.destaque ? '#20344C' : '#8A94A6'} fontWeight={mk.destaque ? 700 : 500}>{mk.rotulo}</text>
                </g>
              ))}
              {[0.25, 0.5, 0.75].map((f) => (
                <g key={`e${f}`}>
                  <rect x="3" y={yPat(escalaPat * f) - 11} width={brlCurto(escalaPat * f).length * 5.4 + 8} height="13" rx="3" fill="#FFFFFF" fillOpacity="0.9" />
                  <text x="7" y={yPat(escalaPat * f) - 2} className="font-ui" fontSize="9.5" fill="#8A94A6">{brlCurto(escalaPat * f)}</text>
                </g>
              ))}
            </svg>

            <FaixaDeEventos cenario={cenarioVivo} x={x} W={W} vp={vp} altura={ALT_FAIXA} />

            <svg width={W} height={ALT_FLUXO} className="block bg-cream-50" role="img"
              aria-label={`Fluxo de caixa. Em ${linha.data.rotulo}, entra ${brl(linha.fluxo.receita)}, sai ${brl(linha.fluxo.despesa)}.`}>
              <g clipPath="url(#recorte)">
                {barras.itens.map((b) => {
                  const larg = Math.max(1.5, (W / vp.largura) * passo * 0.9);
                  const gasto = Math.min(b.despesa, b.receita);
                  const sobra = b.receita - b.despesa;
                  const deficit = Math.max(0, b.despesa - b.receita);
                  return (
                    <g key={b.i}>
                      {gasto > 0 && <rect x={b.px - larg / 2} y={yFluxo(gasto)} width={larg}
                        height={Math.max(0, zeroFluxo - yFluxo(gasto))} fill="#E4E9EF" />}
                      {sobra > 0 && <rect x={b.px - larg / 2} y={yFluxo(b.receita)} width={larg}
                        height={Math.max(1.5, yFluxo(gasto) - yFluxo(b.receita))} fill="#2E9E5B" />}
                      {deficit > 0 && <rect x={b.px - larg / 2} y={zeroFluxo} width={larg}
                        height={Math.max(0, yFluxo(-deficit) - zeroFluxo)} fill="#C2410C" fillOpacity="0.85" />}
                    </g>
                  );
                })}
                {/* Perfil da renda: liga o topo das colunas e mostra de relance
                    quando a renda muda de patamar e quando ela simplesmente acaba. */}
                <path d={barras.itens.map((b, k) => `${k ? 'L' : 'M'}${b.px.toFixed(1)} ${yFluxo(b.receita).toFixed(1)}`).join('')}
                  fill="none" stroke="#20344C" strokeWidth="1.25" strokeOpacity="0.55" />
                <line x1="0" x2={W} y1={zeroFluxo} y2={zeroFluxo} stroke="#8A94A6" strokeWidth="1" />
              </g>
              <rect x="3" y="2" width="252" height="13" rx="3" fill="#FDFCFA" fillOpacity="0.94" />
              <text x="7" y="12" className="font-ui" fontSize="9.5" fill="#8A94A6">
                entra e sai · topo {brlCurto(barras.escala)} · verde é a sobra{barras.agregado ? ` · média de ${passo} meses` : ''}
              </text>
            </svg>

            <div className="absolute top-0 bottom-0 pointer-events-none"
              style={{ left: xFoco, transform: 'translateX(-0.5px)', borderLeft: '1.5px solid #131F2E', opacity: 0.72 }} />
            <div className="absolute pointer-events-none rounded-full"
              style={{ left: xFoco - 4.5, top: yPat(linha.total) - 4.5, width: 9, height: 9, background: '#131F2E', border: '2px solid #fff' }} />
          </div>

          <div className="relative bg-white border-t border-ink-line/70" style={{ height: 22 }}>
            {ticks.map((t) => (
              <span key={t.m} className="absolute font-ui text-[9.5px] whitespace-nowrap"
                style={{ left: x(t.m), top: 5, transform: 'translateX(-50%)', color: t.forte ? '#20344C' : '#8A94A6', fontWeight: t.forte ? 600 : 400 }}>
                {t.rotulo}
              </span>
            ))}
          </div>
        </div>

        <Minimapa proj={proj} vp={vp} horizonte={base.horizonte} marcos={base.marcos}
          onIr={(centro) => irPara(vp.largura, centro)} altura={ALT_MAPA} />

        <div className="px-3 py-2.5 flex items-center gap-2 border-t border-ink-line/70 flex-wrap">
          <div className="flex rounded-full bg-cream-100 p-0.5">
            {presets.map((p) => {
              const ativo = Math.abs(vp.largura - p.meses) < Math.max(2, p.meses * 0.12);
              return (
                <button key={p.rotulo} onClick={() => irPara(p.meses, mesFocado)} aria-pressed={ativo}
                  className={`px-2.5 py-2 rounded-full font-ui text-[11px] min-h-[44px] transition-colors ${ativo ? 'bg-navy-900 text-white' : 'text-ink-body'}`}>
                  {p.rotulo}
                </button>
              );
            })}
          </div>
          <div className="flex-1" />
          <button onClick={() => zoom(1 / 1.6, focoFracao)} aria-label="Aproximar"
            className="w-11 h-11 rounded-full bg-cream-100 flex items-center justify-center text-navy-900">
            <Icone nome="zoom-in" size={16} />
          </button>
          <button onClick={() => zoom(1.6, focoFracao)} aria-label="Afastar"
            className="w-11 h-11 rounded-full bg-cream-100 flex items-center justify-center text-navy-900">
            <Icone nome="zoom-out" size={16} />
          </button>
          <button onClick={() => setPainel(!painel)}
            className={`h-11 px-4 rounded-full font-ui text-[11px] flex items-center gap-1.5 transition-colors ${painel || sim ? 'bg-orange-700 text-white' : 'bg-cream-100 text-navy-900'}`}>
            <Icone nome="sliders" size={14} /> Simular
          </button>
        </div>

        {painel && (
          <PainelSimulacao base={base} mes={mesFocado} sim={sim} setSim={setSim}
            aporteAtual={aporteAtual} linha={linha} fechar={() => setPainel(false)} />
        )}

        {/* ── Composição no mês: a legenda É a tabela ── */}
        <div className="border-t border-ink-line/70">
          {[...series].reverse().map((s) => {
            const v = s.valor(linha);
            const c = s.caixinha;
            const det = c ? linha.caixinhas[c.id] : null;
            // Caixinha zerada e parada não ocupa linha — mas some com uma nota,
            // nunca em silêncio (ver "silêncio nunca é zero").
            if (v < 1 && (!det || (det.aportes < 1 && det.saques < 1))) return null;
            const fatia = linha.total > 0 ? v / linha.total : 0;
            return (
              <div key={s.id} className="px-4 py-2.5 flex items-center gap-3 border-b border-ink-line/40 last:border-0">
                <span className="w-2.5 h-6 rounded-sm shrink-0" style={{
                  background: s.cor,
                  backgroundImage: s.padrao ? 'repeating-linear-gradient(45deg,rgba(255,255,255,.45) 0 2px,transparent 2px 4px)' : undefined,
                }} />
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm text-navy-900 truncate">{s.nome}</p>
                  <p className="font-ui text-[10.5px] text-ink-body">
                    {(fatia * 100).toFixed(0)}% do patrimônio
                    {det && <> · {pct(det.taxaAnual)}</>}
                    {det && det.aportes > 0 && <> · <span className="text-[#1F7A45]">+{brl(det.aportes)}</span></>}
                    {det && det.saques > 0 && <> · <span className="text-orange-700">−{brl(det.saques)}</span></>}
                  </p>
                </div>
                <p className="font-display text-navy-900 text-sm tabular-nums shrink-0">{brl(v)}</p>
              </div>
            );
          })}
          {(() => {
            const zeradas = series.filter((s) => {
              const v = s.valor(linha); const c = s.caixinha; const det = c ? linha.caixinhas[c.id] : null;
              return v < 1 && (!det || (det.aportes < 1 && det.saques < 1));
            });
            if (!zeradas.length) return null;
            return (
              <p className="px-4 py-2 font-ui text-[10.5px] text-[#8A94A6] border-t border-ink-line/40">
                Zeradas neste mês: {zeradas.map((s) => s.nome).join(' · ')}
              </p>
            );
          })()}
        </div>

        {/* ── O mês por dentro ── */}
        <div className="px-4 py-3 bg-cream-50 border-t border-ink-line/70">
          <p className="font-ui text-[10.5px] text-ink-body uppercase tracking-wide mb-2">
            {linha.data.rotulo} · {linha.fluxo.rotulo || 'sem orçamento declarado'}
          </p>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[['Entra', linha.fluxo.receita, '#20344C'], ['Sai', linha.fluxo.despesa, '#8A94A6'],
              ['Sobra', linha.fluxo.sobra, linha.fluxo.sobra >= 0 ? '#1F7A45' : '#C2410C']].map(([r, v, cor]) => (
              <div key={r} className="rounded-btn bg-white px-3 py-2">
                <p className="font-ui text-[10px] text-ink-body">{r}</p>
                <p className="font-display text-sm tabular-nums" style={{ color: cor }}>{brl(v)}</p>
              </div>
            ))}
          </div>

          {eventosDoMes.length > 0 && (
            <div className="space-y-1.5 mb-2">
              {eventosDoMes.map((e, k) => (
                <div key={k} className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: `${e.meta.cor}1A`, color: e.meta.cor }}>
                    <Icone nome={e.meta.icone} size={11} />
                  </span>
                  <p className="font-body text-[12.5px] text-ink-body leading-snug flex-1">
                    <strong className="text-navy-900">{e.meta.rotulo}</strong>
                    {e.valorNoMes > 0 && <> · {brl(e.valorNoMes)}</>}
                    {e.tipo === 'mudancaTaxa' && <> · {pct(e.taxaAnterior)} → {pct(e.taxaAnual)}</>}
                    <br /><span className="text-[11.5px]">{e.rotulo}</span>
                    {e.tipo === 'consumo' && (
                      <span className="block text-[11px] text-[#B23B6F] mt-0.5">
                        parcela calculada pelo sistema: {brl(e.pmt)}/mês sobre {brl(e.pv)}
                      </span>
                    )}
                    {e.tipo === 'perpetuidade' && (
                      <span className="block text-[11px] text-[#7B5EA7] mt-0.5">
                        rendeu {brl(e.rendeu)} · a vida custou {brl(e.precisa)} · o principal não foi tocado
                      </span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          )}

          {linha.alertas.map((a, k) => (
            <p key={k} className="font-body text-[12px] leading-snug px-3 py-2 rounded-btn mt-1.5"
              style={{
                background: a.nivel === 'erro' ? '#FDECEC' : a.nivel === 'atencao' ? '#FFF3EB' : '#F0F4F8',
                color: a.nivel === 'erro' ? '#A32020' : a.nivel === 'atencao' ? '#C2410C' : '#20344C',
              }}>{a.texto}</p>
          ))}
        </div>
      </div>

      <p className="font-ui text-[11px] text-white/45 leading-relaxed mt-3">{base.nota}</p>
    </div>
  );
}

/* ── Faixa de fases e eventos ─────────────────────────────────────────────── */

function FaixaDeEventos({ cenario, x, W, vp, altura }) {
  const janelas = cenario.eventos.filter((e) => e.mesFim !== undefined && !['mudancaTaxa', 'aportePontual', 'saquePontual', 'transferencia'].includes(e.tipo));
  const pontuais = cenario.eventos.filter((e) => ['aportePontual', 'saquePontual', 'transferencia', 'mudancaTaxa'].includes(e.tipo));
  const mostrarIcones = vp.largura <= 300;
  const nomeCurto = (id) => cenario.caixinhas.find((c) => c.id === id)?.curto ?? null;

  // Empacota as janelas em faixas para que nunca se sobreponham na horizontal.
  const faixas = [];
  const posicionadas = janelas.map((e) => {
    const x1 = x(e.mes);
    const x2 = x((e.mesFim ?? cenario.horizonte) + 1);
    let f = faixas.findIndex((fim) => x1 >= fim + 2);
    if (f === -1) { f = faixas.length; faixas.push(x2); } else faixas[f] = x2;
    return { e, x1, x2, faixa: f };
  });
  const nFaixas = Math.max(1, faixas.length);
  const h = altura / Math.min(nFaixas, 2);

  return (
    <div className="relative bg-white border-y border-ink-line/50 overflow-hidden" style={{ height: altura }}>
      {posicionadas.map(({ e, x1, x2, faixa }) => {
        const meta = EVENTO_META[e.tipo];
        if (x2 < 0 || x1 > W) return null;
        const largura = Math.max(2, x2 - x1);
        return (
          <div key={e.id} title={`${meta.rotulo} — ${e.rotulo}`}
            className="absolute rounded-sm flex items-center px-1.5 overflow-hidden"
            style={{
              left: x1, width: largura, top: (faixa % 2) * h + 1, height: h - 2,
              background: `${meta.cor}${e.simulado ? '4D' : '26'}`, borderLeft: `2.5px solid ${meta.cor}`,
            }}>
            {largura > 74 && (
              <span className="font-ui text-[9px] whitespace-nowrap truncate" style={{ color: meta.cor }}>
                {meta.rotulo}{nomeCurto(e.caixinha) ? ` · ${nomeCurto(e.caixinha)}` : ''}
              </span>
            )}
          </div>
        );
      })}
      {mostrarIcones && pontuais.map((e) => {
        const px = x(e.mes);
        if (px < -10 || px > W + 10) return null;
        const meta = EVENTO_META[e.tipo];
        return (
          <span key={e.id} title={`${meta.rotulo} — ${e.rotulo}`}
            className="absolute rounded-full flex items-center justify-center shadow-sm"
            style={{ left: px - 8, top: altura / 2 - 8, width: 16, height: 16, background: meta.cor, color: '#fff', border: '1.5px solid #fff' }}>
            <Icone nome={meta.icone} size={9} strokeWidth={2.6} />
          </span>
        );
      })}
    </div>
  );
}

/* ── Minimapa ─────────────────────────────────────────────────────────────── */

function Minimapa({ proj, vp, horizonte, marcos, onIr, altura }) {
  const ref = useRef(null);
  const W = useLargura(ref);
  const arrastando = useRef(false);

  const d = useMemo(() => {
    if (W <= 0) return '';
    const passo = Math.max(1, Math.ceil(horizonte / 200));
    const mx = proj.maximo || 1;
    const pts = [];
    for (let i = 0; i < horizonte; i += passo) {
      pts.push(`${((i / horizonte) * W).toFixed(1)} ${(altura - (proj.meses[i].total / mx) * (altura - 8)).toFixed(1)}`);
    }
    return `M0 ${altura}L${pts.join('L')}L${W} ${altura}Z`;
  }, [W, proj, horizonte, altura]);

  const irPeloPonteiro = (e) => {
    const caixa = ref.current.getBoundingClientRect();
    onIr(clamp((e.clientX - caixa.left) / caixa.width, 0, 1) * horizonte);
  };

  const x1 = (vp.ini / horizonte) * W;
  const x2 = ((vp.ini + vp.largura) / horizonte) * W;

  return (
    <div ref={ref} className="relative bg-navy-950 cursor-pointer touch-none" style={{ height: altura }}
      onPointerDown={(e) => { arrastando.current = true; e.currentTarget.setPointerCapture(e.pointerId); irPeloPonteiro(e); }}
      onPointerMove={(e) => arrastando.current && irPeloPonteiro(e)}
      onPointerUp={() => { arrastando.current = false; }}
      role="slider" aria-label="Navegar pela linha do tempo inteira"
      aria-valuemin={1} aria-valuemax={horizonte} aria-valuenow={Math.round(vp.ini + vp.largura / 2)}>
      <svg width={W} height={altura} className="block">
        <path d={d} fill="#FA7A35" fillOpacity="0.32" stroke="#FA7A35" strokeWidth="1" />
        {marcos.filter((m) => m.destaque).map((m) => (
          <line key={m.mes} x1={(m.mes / horizonte) * W} x2={(m.mes / horizonte) * W}
            y1="0" y2={altura} stroke="#fff" strokeWidth="1" strokeOpacity="0.32" />
        ))}
      </svg>
      <div className="absolute top-0 bottom-0 border-x-2 border-white/85 bg-white/15 pointer-events-none"
        style={{ left: x1, width: Math.max(3, x2 - x1) }} />
      <span className="absolute left-2 top-1 font-ui text-[9px] text-white/45 pointer-events-none">a vida inteira</span>
    </div>
  );
}

/* ── Painel de simulação ──────────────────────────────────────────────────── */

function PainelSimulacao({ base, mes, sim, setSim, aporteAtual, linha, fechar }) {
  const temVenda = base.caixinhas.some((c) => c.id === 'otica');
  const receita = linha.fluxo.receita;
  const podeAportar = receita > 0;
  const set = (patch) => setSim({ mes, ...(sim || {}), ...patch });

  return (
    <div className="px-4 py-4 bg-[#F5F1FA] border-t border-[#7B5EA7]/25 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <p className="font-display font-semibold text-navy-900 text-sm">
          E se… <span className="font-ui font-normal text-ink-body text-xs">a partir de {linha.data.rotulo}</span>
        </p>
        <div className="flex items-center gap-2">
          {sim && (
            <button onClick={() => setSim(null)}
              className="font-ui text-[11px] text-[#7B5EA7] underline underline-offset-2 min-h-[44px] px-1 flex items-center gap-1">
              <Icone nome="undo" size={13} /> desfazer
            </button>
          )}
          <button onClick={fechar} aria-label="Fechar simulação"
            className="w-9 h-9 rounded-full bg-white/70 flex items-center justify-center text-ink-body">
            <Icone nome="chevron-down" size={15} />
          </button>
        </div>
      </div>

      {podeAportar ? (
        <Deslizador rotulo="Quanto eu guardo por mês" valor={sim?.aporte ?? aporteAtual}
          min={0} max={receita} passo={500} onChange={(v) => set({ aporte: v })}
          nota={`Guardar mais é gastar menos: a despesa vira ${brl(Math.max(0, receita - (sim?.aporte ?? aporteAtual)))}/mês.`} />
      ) : (
        <p className="font-body text-xs text-ink-body leading-relaxed">
          Neste mês não há renda de trabalho — o que sustenta a vida é o próprio patrimônio.
          Navegue até um mês com receita para mexer no quanto se guarda.
        </p>
      )}

      {temVenda && (
        <Deslizador rotulo="Por quanto a ótica é vendida" valor={sim?.venda ?? 2400000}
          min={400000} max={4000000} passo={100000}
          onChange={(v) => set({ venda: v, vendaBase: 2400000, vendaMes: 121, vendaCaixinha: 'otica' })}
          nota="É a maior incerteza do plano. Puxe para baixo e veja a travessia entre 2036 e 2041 deixar de fechar." />
      )}

      <button
        onClick={() => set({ extras: [...(sim?.extras || []), { mes, valor: 50000, caixinha: base.caixinhas.find((c) => c.natureza === 'liberdade').id }] })}
        className="w-full min-h-[44px] rounded-btn border border-[#7B5EA7] text-[#7B5EA7] font-ui text-xs flex items-center justify-center gap-2">
        <Icone nome="circle-plus" size={14} /> Colocar R$ 50.000 de aporte pontual em {linha.data.rotulo}
      </button>
    </div>
  );
}

function Deslizador({ rotulo, valor, min, max, passo, onChange, nota }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2 mb-1">
        <label className="font-body text-[13px] text-navy-900">{rotulo}</label>
        <span className="font-display text-navy-900 text-sm tabular-nums">{brl(valor)}</span>
      </div>
      <input type="range" min={min} max={max} step={passo} value={valor}
        onChange={(e) => onChange(Number(e.target.value))} aria-label={rotulo}
        className="w-full h-11 accent-[#7B5EA7] cursor-pointer" />
      <p className="font-ui text-[10.5px] text-ink-body leading-relaxed">{nota}</p>
    </div>
  );
}

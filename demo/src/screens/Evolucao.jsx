import React, { useState, useRef, useMemo, useCallback, useEffect, useId } from 'react';
import {
  projetar, brl, brlCurto, brlProjetado, pct, dataDoMes, taxaMensal,
  CAMADA_ROTULO, ORDEM_NATUREZA, EVENTO_META,
} from '../motor/projecao.js';
import { CENARIOS } from '../motor/cenarios.js';
import { aplicarSimulacao, aporteVigente, janelaVigente, aporteMaximo, despesaIrredutivel } from '../motor/simulacao.js';
import {
  useViewport, useGestos, useLargura, escalaDaJanela, ticksDeValor, ticksDoTempo,
  clamp, ZOOM_DE_PERTO,
} from '../components/viewport.js';
import { Icone } from '../components/ui.jsx';

const ALT_MAPA = 40;
const CINZA = '#667284'; // AA sobre branco (4,6:1). O #8A94A6 anterior dava 3,0:1.

function areasEmpilhadas(indices, series, meses, x, y) {
  const acum = new Float64Array(indices.length);
  return series.map((s) => {
    const topo = []; const base = [];
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
  const uid = useId().replace(/:/g, '');
  const visiveis = CENARIOS.filter((c) => !c.soConsultor);
  const [cenarioId, setCenarioId] = useState(visiveis[0].id);
  const base = CENARIOS.find((c) => c.id === cenarioId) ?? visiveis[0];
  const [modo, setModo] = useState('destino');
  const [sim, setSim] = useState(null);
  const [painel, setPainel] = useState(false);
  const [selecionada, setSelecionada] = useState(null);

  const palcoRef = useRef(null);
  const medidaRef = useRef(null);
  const W = useLargura(medidaRef);
  const compacto = W > 0 && W < 620;

  const { vp, vpRef, zoom, mover, irPara, animarPara, pararAnimacao } = useViewport(base.horizonte, 132);
  // Abre em HOJE. Antes o primeiro número da tela era um mês a 5 anos de
  // distância, escolhido por acidente de viewport — ancorar o cliente num
  // número projetado grande é a abertura que ele veio aqui para não ver.
  const [focoFracao, setFocoFracao] = useState(0.04);

  const ALT_PAT = compacto ? (painel ? 150 : 236) : 460;
  const ALT_FAIXA = compacto ? 40 : 44;
  const ALT_FLUXO = compacto ? (painel ? 74 : 100) : 132;

  useEffect(() => { setSim(null); setSelecionada(null); animarPara(1, Math.min(132, base.horizonte)); }, [cenarioId]); // eslint-disable-line

  const proj = useMemo(() => projetar(base), [base]);
  const cenarioVivo = useMemo(() => (sim ? aplicarSimulacao(base, sim) : base), [base, sim]);
  const dados = useMemo(() => (sim ? projetar(cenarioVivo) : proj), [cenarioVivo, sim, proj]);

  const mesFocado = clamp(Math.round(vp.ini + vp.largura * focoFracao), 1, base.horizonte);
  const linha = dados.meses[mesFocado - 1];
  const linhaBase = proj.meses[mesFocado - 1];
  const hoje = proj.meses[0]; // "desde hoje" mede contra o plano, não contra um hoje simulado

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

  /* ── A escala que faz o zoom curto valer o gesto ── */
  const dePerto = vp.largura <= ZOOM_DE_PERTO;
  const escala = useMemo(() => {
    let mn = Infinity; let mx = 0;
    for (const i of indices) {
      const t = Math.max(dados.meses[i].total, proj.meses[i].total);
      const t2 = Math.min(dados.meses[i].total, proj.meses[i].total);
      if (t > mx) mx = t;
      if (t2 < mn) mn = t2;
    }
    return escalaDaJanela(mn, mx, dePerto);
  }, [indices, dados, proj, dePerto]);

  const yPat = useCallback((v) => {
    const faixa = escala.topo - escala.base || 1;
    return ALT_PAT - ((v - escala.base) / faixa) * ALT_PAT;
  }, [escala, ALT_PAT]);

  const gradeValor = useMemo(() => ticksDeValor(escala.base, escala.topo, compacto ? 3 : 5), [escala, compacto]);
  // Com o eixo cortado o passo pode ser de dezenas de milhares: "5,2 mi" repetido
  // três vezes não é grade, é ruído. As casas decimais vêm do passo.
  const rotuloEixo = useCallback((v) => {
    const p = gradeValor.length > 1 ? gradeValor[1] - gradeValor[0] : v;
    if (v >= 1e6) {
      const casas = p >= 1e6 ? 1 : p >= 1e5 ? 1 : 2;
      return `${(v / 1e6).toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas })} mi`;
    }
    return brlCurto(v);
  }, [gradeValor]);

  /* ── Fluxo de caixa: barras dimensionadas pela largura real da tela ── */
  const barras = useMemo(() => {
    if (W <= 0) return { itens: [], escala: 1, escalaSobra: 1, agregado: false, porBarra: 1 };
    const porBarra = Math.max(1, Math.ceil((vp.largura * 6) / W));
    const de = Math.max(0, Math.floor(vp.ini) - 1);
    const ate = Math.min(base.horizonte - 1, Math.ceil(vp.ini + vp.largura));
    const itens = [];
    for (let i = de; i <= ate; i += porBarra) {
      let receita = 0; let despesa = 0; let doPatrimonio = 0; let descoberto = 0; let n = 0;
      for (let k = i; k < Math.min(i + porBarra, base.horizonte); k++) {
        const f = dados.meses[k].fluxo;
        receita += f.receita; despesa += f.despesa;
        doPatrimonio += f.doPatrimonio; descoberto += f.descoberto; n++;
      }
      itens.push({
        i, n, receita: receita / n, despesa: despesa / n,
        doPatrimonio: doPatrimonio / n, descoberto: descoberto / n,
        px: x(i + 1 + (porBarra - 1) / 2),
      });
    }
    const mx = itens.reduce((s, b) => Math.max(s, b.receita, b.despesa), 0) || 1;
    const mxSobra = itens.reduce((s, b) => Math.max(s, Math.abs(b.receita - b.despesa)), 0) || 1;
    return { itens, escala: mx * 1.05, escalaSobra: mxSobra * 1.15, agregado: porBarra > 1, porBarra };
  }, [vp.ini, vp.largura, dados, x, W, base.horizonte]);

  const ALT_COL = ALT_FLUXO * 0.62;
  const ALT_SOBRA = ALT_FLUXO - ALT_COL;
  const yCol = useCallback((v) => ALT_COL - (v / barras.escala) * (ALT_COL - 16), [barras.escala, ALT_COL]);
  const zeroSobra = ALT_COL + ALT_SOBRA / 2;
  const ySobra = useCallback((v) => zeroSobra - (v / barras.escalaSobra) * (ALT_SOBRA / 2 - 3), [barras.escalaSobra, zeroSobra, ALT_SOBRA]);

  const series = useMemo(() => {
    const fin = [...base.caixinhas].filter((c) => c.camada === 'financeiro')
      .sort((a, b) => ORDEM_NATUREZA[a.natureza] - ORDEM_NATUREZA[b.natureza]);
    const nomeDe = (id) => base.caixinhas.find((c) => c.camada === id)?.nome ?? CAMADA_ROTULO[id];
    const contexto = [
      { id: 'participacoes', nome: nomeDe('participacoes'), cor: '#20344C', padrao: `hp${uid}`, camada: true, valor: (l) => l.camadas.participacoes },
      { id: 'bens', nome: nomeDe('bens'), cor: '#8A94A6', padrao: `hb${uid}`, camada: true, valor: (l) => l.camadas.bens },
    ].filter((s) => base.caixinhas.some((c) => c.camada === s.id));
    if (modo === 'geral') {
      return [...contexto, { id: 'financeiro', nome: CAMADA_ROTULO.financeiro, cor: '#C2410C', camada: true, valor: (l) => l.camadas.financeiro }];
    }
    return [...contexto, ...fin.map((c) => ({ id: c.id, nome: c.nome, cor: c.cor, caixinha: c, valor: (l) => l.caixinhas[c.id].fechamento }))];
  }, [base, modo, uid]);

  const areas = useMemo(() => (W > 0 ? areasEmpilhadas(indices, series, dados.meses, x, yPat) : []),
    [W, indices, series, dados, x, yPat]);

  const dPlanoBase = useMemo(() => (!sim || W <= 0 ? null
    : indices.map((i, k) => `${k ? 'L' : 'M'}${x(i + 1).toFixed(1)} ${yPat(proj.meses[i].total).toFixed(1)}`).join('')),
    [sim, indices, proj, x, yPat, W]);

  const { arrastando, manipuladores } = useGestos({
    palcoRef, vpRef, mover, zoom, larguraPx: W, aoFocar: setFocoFracao, pararAnimacao,
  });

  const ticks = useMemo(() => ticksDoTempo(vp, dataDoMes, base.inicio), [vp, base.inicio]);
  const xFoco = x(mesFocado);

  const marcosVisiveis = useMemo(() => {
    const lista = base.marcos.map((mk) => ({ ...mk, px: x(mk.mes) })).filter((mk) => mk.px > -60 && mk.px < W + 60);
    let ultimo = -Infinity;
    return lista.map((mk) => {
      const larguraTexto = mk.rotulo.length * 5.4 + 12;
      const cabe = mk.px - ultimo > 100 && mk.px > 4 && mk.px + larguraTexto < W - 4;
      if (cabe) ultimo = mk.px;
      return { ...mk, comRotulo: cabe, larguraTexto };
    });
  }, [base.marcos, x, W]);

  /* ── A leitura da janela: é ela que responde "o que acontece nos 7 meses" ── */
  const janela = useMemo(() => {
    const a = dados.meses[clamp(Math.round(vp.ini) - 1, 0, base.horizonte - 1)];
    const b = dados.meses[clamp(Math.round(vp.ini + vp.largura) - 2, 0, base.horizonte - 1)];
    return { de: a, ate: b, delta: b.total - a.total, pct: a.total > 0 ? (b.total - a.total) / a.total : 0 };
  }, [dados, vp.ini, vp.largura, base.horizonte]);

  const variacao = linha.total - hoje.total;
  const idade = base.idadeInicial != null ? base.idadeInicial + Math.floor((mesFocado - 1) / 12) : null;
  const eventosDoMes = linha.eventos.filter((e) => e.meta.forma === 'pontual' || e.meta.sinal !== 0);
  const jv = janelaVigente(cenarioVivo, mesFocado);

  /* ── Estoque vira fluxo: R$ 18 milhões não é uma experiência; R$ X/mês é ── */
  const sustentavel = useMemo(() => {
    const livres = base.caixinhas.filter((c) => c.natureza === 'liberdade');
    const soma = livres.reduce((s, c) => s + linha.caixinhas[c.id].fechamento, 0);
    const taxa = livres[0] ? linha.caixinhas[livres[0].id].taxaAnual : 0;
    return { valor: soma * taxaMensal(taxa), soma, taxa, meta: linha.fluxo.despesa };
  }, [base.caixinhas, linha]);

  const presets = [
    { rotulo: '7 meses', meses: 7 }, { rotulo: '2 anos', meses: 24 },
    { rotulo: '10 anos', meses: 120 }, { rotulo: 'tudo', meses: base.horizonte },
  ];

  const alertas = linha.alertas.map((a) => (sim && a.nivel === 'erro'
    // Achado de simulação não é falha: é a resposta à pergunta que o cliente
    // fez. Punir com estado de erro a exploração que a tela pediu é o desenho
    // mais autodestrutivo possível.
    ? { ...a, nivel: 'achado' } : a));

  return (
    <div className="pt-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <h1 className="font-display font-semibold text-white text-xl leading-tight">Evolução do patrimônio</h1>
          <p className="font-ui text-white/70 text-[11px] mt-0.5">
            O que acontece com o seu patrimônio, mês a mês{base.idadeInicial ? `, até os ${base.idadeInicial + Math.floor(base.horizonte / 12)} anos` : ''}.
          </p>
        </div>
        {visiveis.length > 1 && (
          <select value={cenarioId} onChange={(e) => setCenarioId(e.target.value)} aria-label="Escolher cliente"
            className="shrink-0 bg-white/10 text-white/85 font-ui text-[11px] rounded-full px-3 py-2 border border-white/15 min-h-[44px]">
            {visiveis.map((c) => <option key={c.id} value={c.id} className="text-ink">{c.nome}</option>)}
          </select>
        )}
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_360px] gap-4 items-start">
        {/* ══ COLUNA ESQUERDA: o palco ══ */}
        <div className="rounded-module bg-white shadow-float overflow-hidden">
          {/* Leitura ao vivo */}
          <div className={`px-4 pt-4 pb-3 border-b border-ink-line/70 ${compacto && painel ? 'sticky top-11 z-20 bg-white' : ''}`}>
            <div className="flex items-baseline gap-2 flex-wrap mb-0.5">
              <p className="font-ui text-xs uppercase tracking-wide" style={{ color: CINZA }}>{linha.data.rotulo}</p>
              {idade != null && <span className="font-ui text-[11px]" style={{ color: CINZA }}>{idade} anos</span>}
              {sim && <span className="font-ui text-[10px] text-white bg-[#7B5EA7] rounded-full px-2 py-0.5">simulado</span>}
            </div>
            <p className={`font-display font-semibold text-navy-900 leading-tight tabular-nums truncate ${compacto && painel ? 'text-[20px]' : 'text-[28px]'}`}>
              {mesFocado === 1 ? brl(linha.total) : brlProjetado(linha.total)}
            </p>
            <p className="font-ui text-[11px]" style={{ color: CINZA }}>
              {mesFocado === 1 ? 'patrimônio de hoje · inclui bens e a empresa' : (
                <>
                  <span style={{ color: variacao >= 0 ? '#1F7A45' : '#C2410C' }}>
                    {variacao >= 0 ? '+' : '−'}{brlProjetado(Math.abs(variacao))}
                  </span> desde hoje
                  {sim && Math.abs(linha.total - linhaBase.total) > 1 && (
                    <> · <span className="text-[#7B5EA7]">
                      {linha.total >= linhaBase.total ? '+' : '−'}{brlProjetado(Math.abs(linha.total - linhaBase.total))} vs. o plano
                    </span></>
                  )}
                </>
              )}
            </p>
            {/* É este número — não o total — que responde "o que acontece nos próximos 7 meses" */}
            <p className="font-ui text-[11px] mt-1" style={{ color: CINZA }}>
              nesta janela ({janela.de.data.rotulo}–{janela.ate.data.rotulo}):{' '}
              <strong style={{ color: janela.delta >= 0 ? '#1F7A45' : '#C2410C' }}>
                {janela.delta >= 0 ? '+' : '−'}{brl(Math.abs(janela.delta))}
              </strong>{' '}
              · {janela.delta >= 0 ? '+' : '−'}{(Math.abs(janela.pct) * 100).toFixed(1)}%
            </p>
          </div>

          {/* PALCO */}
          <div ref={medidaRef} className={`relative ${compacto && painel ? 'sticky top-11 z-20 bg-white shadow-[0_6px_16px_rgba(0,0,0,.08)]' : ''}`}>
            <div ref={palcoRef} {...manipuladores}
              className={`relative select-none ${arrastando ? 'cursor-grabbing' : 'cursor-grab'}`}
              style={{ touchAction: 'pan-y', WebkitTapHighlightColor: 'transparent' }}>

              <svg width={W} height={ALT_PAT} className="block" role="img"
                aria-label={`Patrimônio projetado. Em ${linha.data.rotulo}, ${brl(linha.total)}.`}>
                <defs>
                  <clipPath id={`rec${uid}`}><rect x="0" y="0" width={Math.max(0, W)} height={ALT_PAT} /></clipPath>
                  <pattern id={`hb${uid}`} width="7" height="7" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
                    <rect width="7" height="7" fill="#CFD5DD" /><line x1="0" y1="0" x2="0" y2="7" stroke="#B4BCC8" strokeWidth="2.5" />
                  </pattern>
                  <pattern id={`hp${uid}`} width="7" height="7" patternTransform="rotate(-45)" patternUnits="userSpaceOnUse">
                    <rect width="7" height="7" fill="#3D5470" /><line x1="0" y1="0" x2="0" y2="7" stroke="#28405C" strokeWidth="2.5" />
                  </pattern>
                </defs>

                {gradeValor.map((v) => (
                  <line key={v} x1="0" x2={W} y1={yPat(v)} y2={yPat(v)} stroke="#EDEAE4" strokeWidth="1" />
                ))}

                <g clipPath={`url(#rec${uid})`}>
                  {areas.map((a) => (
                    <path key={a.id} d={a.d} fill={a.padrao ? `url(#${a.padrao})` : a.cor}
                      fillOpacity={selecionada && selecionada !== a.id ? 0.22 : 1}
                      stroke={a.cor} strokeWidth="0.75" strokeOpacity="0.55" />
                  ))}
                  {dPlanoBase && <path d={dPlanoBase} fill="none" stroke="#131F2E" strokeWidth="1.75" strokeDasharray="5 4" strokeOpacity="0.8" />}
                  {marcosVisiveis.map((mk) => (
                    <g key={mk.mes}>
                      <line x1={mk.px} x2={mk.px} y1="0" y2={ALT_PAT} stroke="#FFF" strokeWidth={mk.destaque ? 2 : 1.25} strokeOpacity={mk.destaque ? 0.85 : 0.5} />
                      <line x1={mk.px} x2={mk.px} y1="0" y2={ALT_PAT} stroke="#131F2E" strokeWidth={mk.destaque ? 1.25 : 1} strokeDasharray="3 3" strokeOpacity={mk.destaque ? 0.65 : 0.35} />
                    </g>
                  ))}
                </g>

                {marcosVisiveis.filter((mk) => mk.comRotulo).map((mk) => (
                  <g key={`r${mk.mes}`}>
                    <rect x={mk.px + 3} y="4" width={mk.larguraTexto} height="15" rx="3" fill="#FFF" fillOpacity="0.93" />
                    <text x={mk.px + 8} y="15" className="font-ui" fontSize="10.5" fill={mk.destaque ? '#20344C' : CINZA} fontWeight={mk.destaque ? 700 : 500}>{mk.rotulo}</text>
                  </g>
                ))}
                {gradeValor.map((v) => (
                  <g key={`e${v}`}>
                    <rect x="3" y={yPat(v) - 12} width={rotuloEixo(v).length * 6 + 10} height="14" rx="3" fill="#FFF" fillOpacity="0.92" />
                    <text x="8" y={yPat(v) - 2} className="font-ui" fontSize="10.5" fill={CINZA}>{rotuloEixo(v)}</text>
                  </g>
                ))}
                {/* Eixo cortado: declarado, nunca silencioso */}
                {escala.cortada && (
                  <g>
                    <path d={`M${W - 116} ${ALT_PAT - 5}l6 -4l6 8l6 -8l6 8l6 -8l6 4`} fill="none" stroke="#C2410C" strokeWidth="1.5" />
                    <rect x={W - 74} y={ALT_PAT - 16} width="70" height="14" rx="3" fill="#FFF" fillOpacity="0.94" />
                    <text x={W - 70} y={ALT_PAT - 5} className="font-ui" fontSize="10" fill="#C2410C">eixo cortado</text>
                  </g>
                )}
              </svg>

              <FaixaDeEventos cenario={cenarioVivo} x={x} W={W} altura={ALT_FAIXA} modo={modo} />

              <svg width={W} height={ALT_FLUXO} className="block bg-cream-50" role="img"
                aria-label={`Fluxo de caixa em ${linha.data.rotulo}: entra ${brl(linha.fluxo.receita)}, sai ${brl(linha.fluxo.despesa)}.`}>
                <g clipPath={`url(#rec${uid})`}>
                  {barras.itens.map((b) => {
                    const larg = Math.max(2, (W / vp.largura) * barras.porBarra * 0.86);
                    const gasto = Math.min(b.despesa, b.receita);
                    const sobra = b.receita - b.despesa;
                    return (
                      <g key={b.i}>
                        {gasto > 0 && <rect x={b.px - larg / 2} y={yCol(gasto)} width={larg} height={Math.max(0, ALT_COL - yCol(gasto))} fill="#E4E9EF" />}
                        {sobra > 0 && <rect x={b.px - larg / 2} y={yCol(b.receita)} width={larg} height={Math.max(1.5, yCol(gasto) - yCol(b.receita))} fill="#2E9E5B" />}
                        {/* Retirada PLANEJADA é neutra. Laranja só para o que está descoberto. */}
                        {b.doPatrimonio > 0 && <rect x={b.px - larg / 2} y={yCol(b.doPatrimonio)} width={larg} height={Math.max(0, ALT_COL - yCol(b.doPatrimonio))} fill="#B9C5D4" />}
                        {b.descoberto > 0 && <rect x={b.px - larg / 2} y={yCol(b.descoberto)} width={larg} height={Math.max(0, ALT_COL - yCol(b.descoberto))} fill="#C2410C" />}
                      </g>
                    );
                  })}
                  <line x1="0" x2={W} y1={ALT_COL} y2={ALT_COL} stroke="#8A94A6" strokeWidth="1" />
                  {/* Faixa própria para a sobra: é ela que faz o patrimônio crescer,
                      e antes era o menor elemento do painel chamado fluxo de caixa. */}
                  {barras.itens.map((b) => {
                    const larg = Math.max(2, (W / vp.largura) * barras.porBarra * 0.86);
                    const s = b.receita - b.despesa;
                    if (Math.abs(s) < 1) return null;
                    return <rect key={`s${b.i}`} x={b.px - larg / 2} y={Math.min(zeroSobra, ySobra(s))}
                      width={larg} height={Math.max(1.5, Math.abs(ySobra(s) - zeroSobra))}
                      fill={s > 0 ? '#2E9E5B' : b.descoberto > 0 ? '#C2410C' : '#8FA0B4'} />;
                  })}
                  <line x1="0" x2={W} y1={zeroSobra} y2={zeroSobra} stroke="#131F2E" strokeOpacity="0.35" strokeWidth="1" />
                </g>
                <text x="6" y={ALT_COL - 4} className="font-ui" fontSize="10.5" fill={CINZA}>
                  {linha.fluxo.natureza === 'sustentadoPeloPatrimonio'
                    ? 'sem renda de trabalho — a vida é paga pela carteira'
                    : linha.fluxo.natureza === 'descoberto' ? 'laranja: o mês não fecha'
                    : 'verde: a sobra que vira patrimônio'}
                </text>
                <text x="6" y={zeroSobra + ALT_SOBRA / 2 - 3} className="font-ui" fontSize="10" fill={CINZA}>
                  sobra do mês{barras.agregado ? ` · média de ${barras.porBarra}` : ''}
                </text>
              </svg>

              <div className="absolute top-0 bottom-0 pointer-events-none" style={{ left: xFoco, transform: 'translateX(-0.5px)', borderLeft: '1.5px solid #131F2E', opacity: 0.72 }} />
              <div className="absolute pointer-events-none rounded-full" style={{ left: xFoco - 4.5, top: yPat(linha.total) - 4.5, width: 9, height: 9, background: '#131F2E', border: '2px solid #fff' }} />
            </div>

            <div className="relative bg-white border-t border-ink-line/70" style={{ height: 24 }}>
              {ticks.map((t, k) => {
                const px = x(t.m);
                const naBorda = px < 26 ? 'esq' : px > W - 26 ? 'dir' : null;
                return (
                  <button key={t.m} onClick={() => animarPara(t.m - vp.largura / 2, vp.largura)}
                    className="absolute font-ui text-[10px] whitespace-nowrap px-1 py-1"
                    style={{
                      left: naBorda === 'esq' ? 0 : naBorda === 'dir' ? undefined : px,
                      right: naBorda === 'dir' ? 0 : undefined,
                      top: 3, transform: naBorda ? 'none' : 'translateX(-50%)',
                      color: t.forte ? '#20344C' : CINZA, fontWeight: t.forte ? 600 : 400,
                    }}>
                    {t.rotulo}
                  </button>
                );
              })}
            </div>
          </div>

          <Minimapa dados={dados} vp={vp} horizonte={base.horizonte} marcos={base.marcos}
            onIr={(centro) => animarPara(centro - vp.largura / 2, vp.largura, 160)} altura={ALT_MAPA} />

          <div className="px-3 py-2.5 flex items-center gap-2 border-t border-ink-line/70 flex-wrap">
            <button onClick={() => setPainel(!painel)}
              className="h-11 px-4 rounded-full font-ui text-[11px] flex items-center gap-1.5 bg-orange-700 text-white">
              <Icone nome="sliders" size={14} /> Simular
            </button>
            <div className="flex rounded-full bg-cream-100 p-0.5">
              {presets.map((p) => {
                const ativo = Math.abs(vp.largura - p.meses) < Math.max(2, p.meses * 0.12);
                return (
                  <button key={p.rotulo} onClick={() => irPara(p.meses, mesFocado)} aria-pressed={ativo}
                    className={`px-2.5 py-2 rounded-full font-ui text-[11px] min-h-[44px] ${ativo ? 'bg-navy-900 text-white' : 'text-ink-body'}`}>
                    {p.rotulo}
                  </button>
                );
              })}
            </div>
            <button onClick={() => { setFocoFracao(0.04); animarPara(1, 132); }} aria-label="Voltar para hoje"
              className="h-11 px-3 rounded-full font-ui text-[11px] bg-cream-100 text-navy-900 flex items-center gap-1">
              <Icone nome="undo" size={13} /> hoje
            </button>
            <div className="flex-1" />
            <div className="flex rounded-full bg-cream-100 p-0.5">
              {[['geral', 'Geral'], ['destino', 'Por destino']].map(([id, r]) => (
                <button key={id} onClick={() => { setModo(id); setSelecionada(null); }} aria-pressed={modo === id}
                  className={`px-3 py-2 rounded-full font-ui text-[11px] min-h-[44px] ${modo === id ? 'bg-navy-900 text-white' : 'text-ink-body'}`}>{r}</button>
              ))}
            </div>
            {!compacto && <>
              <button onClick={() => zoom(1 / 1.6, focoFracao, true)} aria-label="Aproximar" className="w-11 h-11 rounded-full bg-cream-100 flex items-center justify-center text-navy-900"><Icone nome="zoom-in" size={16} /></button>
              <button onClick={() => zoom(1.6, focoFracao, true)} aria-label="Afastar" className="w-11 h-11 rounded-full bg-cream-100 flex items-center justify-center text-navy-900"><Icone nome="zoom-out" size={16} /></button>
            </>}
          </div>

          {painel && (
            <div>
              <PainelSimulacao base={base} cenarioVivo={cenarioVivo} mes={mesFocado} sim={sim} setSim={setSim}
                linha={linha} alertas={alertas} fechar={() => setPainel(false)} compacto={compacto} />
            </div>
          )}
        </div>

        {/* ══ COLUNA DIREITA: composição, mês, alertas ══ */}
        <div className="rounded-module bg-white shadow-float overflow-hidden">
          <Composicao series={series} linha={linha} dados={dados} base={base} modo={modo}
            selecionada={selecionada} onSelecionar={(id) => {
              if (selecionada === id) { setSelecionada(null); return; }
              setSelecionada(id);
              const ev = cenarioVivo.eventos.filter((e) => e.caixinha === id || e.para === id || e.de === id);
              if (ev.length) {
                const de = Math.min(...ev.map((e) => e.mes));
                const ate = Math.max(...ev.map((e) => e.mesFim ?? e.mes));
                animarPara(de - 6, Math.max(12, ate - de + 14));
              }
            }} />

          <div className="px-4 py-3 bg-cream-50 border-t border-ink-line/70">
            <p className="font-ui text-[10.5px] uppercase tracking-wide mb-2" style={{ color: CINZA }}>
              {linha.data.rotulo} · <span className="normal-case">{linha.fluxo.rotulo || 'ainda não informado'}</span>
            </p>

            <CartaoDoMes linha={linha} />

            {linha.fluxo.componentes && (
              <div className="mt-2 space-y-1">
                {linha.fluxo.componentes.map((c) => (
                  <div key={c.rotulo} className="flex items-baseline justify-between gap-2">
                    <p className="font-ui text-[11px]" style={{ color: CINZA }}>
                      {c.rotulo}
                      {c.prov === 'declarado' && <span className="ml-1 text-[9.5px] text-[#1F7A45]">você declarou</span>}
                      {c.prov === 'derivado' && <span className="ml-1 text-[9.5px] text-orange-700">conta nossa</span>}
                    </p>
                    <p className="font-ui text-[11px] tabular-nums text-navy-900">{brl(c.valor)}</p>
                  </div>
                ))}
              </div>
            )}

            {jv?.premissa && (
              <p className="mt-2 px-3 py-2 rounded-btn bg-white border border-ink-line font-body text-[11.5px] text-ink-body leading-snug">
                <strong className="text-navy-900">Premissa deste trecho:</strong> {jv.premissa}
              </p>
            )}

            {sustentavel.valor > 0 && (
              <div className="mt-2 px-3 py-2.5 rounded-btn bg-white border border-[#1F7A45]/25">
                <p className="font-body text-[12px] text-navy-900 leading-snug">
                  A liberdade financeira sustenta <strong>{brl(sustentavel.valor)}/mês</strong> sem tocar no dinheiro guardado.
                </p>
                <p className="font-ui text-[10.5px] mt-0.5" style={{ color: CINZA }}>
                  {sustentavel.valor >= sustentavel.meta
                    ? `A vida custa ${brl(sustentavel.meta)}. Já dá, com folga de ${brl(sustentavel.valor - sustentavel.meta)}.`
                    : `A vida custa ${brl(sustentavel.meta)}. Faltam ${brl(sustentavel.meta - sustentavel.valor)}/mês.`}
                </p>
              </div>
            )}

            {eventosDoMes.length > 0 && (
              <div className="space-y-1.5 mt-3">
                {eventosDoMes.map((e, k) => <EventoDoMes key={e.id ?? k} e={e} base={base} />)}
              </div>
            )}

            {alertas.map((a, k) => <Alerta key={k} a={a} />)}
          </div>

          <p className="px-4 py-3 font-ui text-[11px] text-ink-body leading-relaxed border-t border-ink-line/70">
            {base.nota?.replace('{consultor}', 'Nélio')}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Cartão do mês ─────────────────────────────────────────────────────────── */

function CartaoDoMes({ linha }) {
  const f = linha.fluxo;
  const planejado = f.natureza === 'sustentadoPeloPatrimonio';
  // "Sobra −R$ 16.000" é contradição: sobra não é negativa. E quando a vida é
  // paga pelo patrimônio conforme o plano, isso não é falta — é o plano.
  const terceiro = planejado
    ? { r: 'Do patrimônio', v: f.doPatrimonio, cor: '#20344C', nota: 'era o plano' }
    : f.sobra >= 0
      ? { r: 'Sobra', v: f.sobra, cor: '#1F7A45' }
      : { r: 'Falta', v: -f.sobra, cor: '#C2410C' };
  return (
    <div className="grid grid-cols-3 gap-2">
      {[{ r: 'Entra', v: f.receita, cor: '#20344C' }, { r: 'Sai', v: f.despesa, cor: CINZA }, terceiro].map((c) => (
        <div key={c.r} className="rounded-btn bg-white px-3 py-2">
          <p className="font-ui text-[10px]" style={{ color: CINZA }}>{c.r}</p>
          <p className="font-display text-[15px] tabular-nums" style={{ color: c.cor }}>{brl(c.v)}</p>
          {c.nota && <p className="font-ui text-[9.5px] text-[#1F7A45]">{c.nota}</p>}
        </div>
      ))}
    </div>
  );
}

function EventoDoMes({ e, base }) {
  const nome = (id) => base.caixinhas.find((c) => c.id === id)?.nome ?? id;
  return (
    <div className="flex items-start gap-2">
      <span className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: `${e.meta.cor}1A`, color: e.meta.cor }}>
        <Icone nome={e.meta.icone} size={13} />
      </span>
      <p className="font-body text-[12.5px] text-ink-body leading-snug flex-1">
        <strong className="text-navy-900">{e.meta.rotulo}</strong>
        {e.valorNoMes > 0 && <> · {brl(e.valorNoMes)}</>}
        {e.lacuna && <> · <span className="text-orange-700">valor ainda não calculado</span></>}
        {e.tipo === 'mudancaTaxa' && <> · {pct(e.taxaAnterior)} → {pct(e.taxaAnual)}</>}
        {e.tipo === 'transferencia' && <> · de {nome(e.de)} para {nome(e.para)}</>}
        <br /><span className="text-[11.5px]">{e.rotulo}</span>
        {e.porque && <span className="block text-[11px] mt-0.5" style={{ color: CINZA }}>{e.porque}</span>}
        {e.tipo === 'consumo' && (
          <span className="block text-[11px] text-[#B23B6F] mt-0.5">
            {brl(e.pv)} divididos em {Math.round((e.mesFim - e.mes + 1) / 12)} anos, já contando o rendimento. No fim esta caixa termina em zero, como planejado.
          </span>
        )}
        {e.tipo === 'perpetuidade' && (
          <span className="block text-[11px] text-[#7B5EA7] mt-0.5">
            Os investimentos renderam {brl(e.rendeu)} e a vida custou {brl(e.precisa)}. O dinheiro guardado não foi tocado.
          </span>
        )}
      </p>
    </div>
  );
}

function Alerta({ a }) {
  const estilo = {
    erro: { background: '#FDECEC', color: '#A32020' },
    achado: { background: '#F1EBFA', color: '#5B3F86' },
    atencao: { background: '#FFF3EB', color: '#C2410C' },
    info: { background: '#F0F4F8', color: '#20344C' },
  }[a.nivel] ?? { background: '#F0F4F8', color: '#20344C' };
  return (
    <p className="font-body text-[12px] leading-snug px-3 py-2 rounded-btn mt-1.5" style={estilo}>
      {a.nivel === 'achado' && <strong>Nesta simulação: </strong>}{a.texto}
    </p>
  );
}

/* ── Composição ───────────────────────────────────────────────────────────── */

function Composicao({ series, linha, dados, base, modo, selecionada, onSelecionar }) {
  const ativas = []; const cumpriram = []; const naoComecaram = [];
  for (const s of series) {
    const v = s.valor(linha);
    const det = s.caixinha ? linha.caixinhas[s.caixinha.id] : null;
    if (v >= 1 || (det && (det.aportes >= 1 || det.saques >= 1))) { ativas.push(s); continue; }
    // "Zeradas" cobria dois estados opostos: o que ainda não nasceu e o que
    // cumpriu o papel. Chamar de zerada uma caixa que deu certo é desanimador.
    const jaTeve = dados.meses.slice(0, linha.m).some((l) => s.valor(l) >= 1);
    (jaTeve ? cumpriram : naoComecaram).push(s);
  }

  const realizacao = (s) => {
    if (!s.caixinha) return null;
    const idx = dados.meses.findIndex((l, k) => k > 0 && s.valor(l) < 1 && s.valor(dados.meses[k - 1]) >= 1);
    return idx > 0 ? dados.meses[idx].data.rotulo : null;
  };

  return (
    <div>
      {[...ativas].reverse().map((s) => {
        const v = s.valor(linha);
        const det = s.caixinha ? linha.caixinhas[s.caixinha.id] : null;
        const fatia = linha.total > 0 ? v / linha.total : 0;
        const sel = selecionada === s.id;
        const quando = sel ? realizacao(s) : null;
        return (
          <button key={s.id} onClick={() => onSelecionar(s.id)}
            aria-pressed={sel}
            className={`w-full text-left px-4 py-3 min-h-[56px] flex items-center gap-3 border-b border-ink-line/40 transition-colors ${sel ? 'bg-cream-100' : 'hover:bg-cream-50'}`}>
            <span className="w-2.5 h-7 rounded-sm shrink-0" style={{
              background: s.cor,
              backgroundImage: s.padrao ? 'repeating-linear-gradient(45deg,rgba(255,255,255,.45) 0 2px,transparent 2px 4px)' : undefined,
            }} />
            <div className="flex-1 min-w-0">
              <p className="font-body text-sm text-navy-900 truncate">{s.nome}</p>
              <p className="font-ui text-[10.5px]" style={{ color: CINZA }}>
                {(fatia * 100).toFixed(0)}% do patrimônio
                {det && <> · rende {(det.taxaAnual * 100).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}% ao ano</>}
                {s.caixinha?.prov && <> · {s.caixinha.prov}</>}
              </p>
              {det && (det.aportes > 0 || det.saques > 0) && (
                <p className="font-ui text-[10.5px]">
                  {det.aportes > 0 && <span className="text-[#1F7A45]">entram {brl(det.aportes)}</span>}
                  {det.aportes > 0 && det.saques > 0 && ' · '}
                  {det.saques > 0 && <span className="text-orange-700">saem {brl(det.saques)}</span>}
                </p>
              )}
              {sel && (
                <p className="font-ui text-[10.5px] text-navy-900 mt-1">
                  {quando ? `termina em ${quando}` : 'sem data de término'}
                  {s.caixinha?.nota && <span className="block font-body text-[11px] mt-1 text-ink-body leading-snug">{s.caixinha.nota}</span>}
                  {s.caixinha?.lacuna && <span className="block font-body text-[11px] mt-1 text-orange-700 leading-snug">{s.caixinha.lacuna}</span>}
                </p>
              )}
            </div>
            <p className="font-display text-navy-900 text-base font-semibold tabular-nums shrink-0">{brl(v)}</p>
          </button>
        );
      })}
      {cumpriram.length > 0 && (
        <p className="px-4 py-2 font-ui text-[10.5px] border-b border-ink-line/40" style={{ color: CINZA }}>
          <span className="text-[#1F7A45]">Já cumpriram o papel:</span> {cumpriram.map((s) => s.nome).join(' · ')}
        </p>
      )}
      {naoComecaram.length > 0 && (
        <p className="px-4 py-2 font-ui text-[10.5px] border-b border-ink-line/40" style={{ color: CINZA }}>
          Ainda não começou: {naoComecaram.map((s) => s.nome).join(' · ')}
        </p>
      )}
    </div>
  );
}

/* ── Faixa de fases e eventos ─────────────────────────────────────────────── */

function FaixaDeEventos({ cenario, x, W, altura, modo }) {
  const nomeCurto = (id) => cenario.caixinhas.find((c) => c.id === id)?.curto ?? null;
  const janelas = cenario.eventos.filter((e) => EVENTO_META[e.tipo]?.forma === 'janela');
  const pontuais = cenario.eventos.filter((e) => EVENTO_META[e.tipo]?.forma === 'pontual');

  const fins = [];
  const postas = janelas
    .map((e) => ({ e, x1: x(e.mes), x2: x((e.mesFim ?? cenario.horizonte) + 1) }))
    // Empacotar só o que está na tela: uma janela que terminou em 2027 não pode
    // consumir uma pista quando estamos olhando 2031.
    .filter(({ x1, x2 }) => x2 > -4 && x1 < W + 4)
    .sort((a, b) => a.x1 - b.x1)
    .map(({ e, x1, x2 }) => {
      let f = fins.findIndex((fim) => x1 >= fim + 2);
      if (f === -1) { f = fins.length; fins.push(x2); } else fins[f] = x2;
      return { e, x1, x2, faixa: f };
    });
  const pistas = Math.max(2, Math.min(3, fins.length));
  const h = altura / pistas;

  // Agrupa pontuais próximos: 3 ícones sobrepostos não informam nada.
  const grupos = [];
  for (const e of pontuais.sort((a, b) => a.mes - b.mes)) {
    const px = x(e.mes);
    const ultimo = grupos[grupos.length - 1];
    if (ultimo && px - ultimo.px < 15) ultimo.itens.push(e);
    else grupos.push({ px, itens: [e] });
  }

  return (
    <div className="relative bg-white border-y border-ink-line/50 overflow-hidden" style={{ height: altura }}>
      {postas.map(({ e, x1, x2, faixa }) => {
        const meta = EVENTO_META[e.tipo];
        if (faixa >= pistas) return null; // excedente vira o marcador agrupado
        const largura = Math.max(3, x2 - x1);
        const visivelDe = Math.max(x1, 0);
        const visivelAte = Math.min(x2, W);
        const rotulo = modo === 'geral' ? meta.rotulo : `${meta.rotulo}${nomeCurto(e.caixinha) ? ` · ${nomeCurto(e.caixinha)}` : ''}`;
        return (
          <div key={e.id} title={`${meta.rotulo} — ${e.rotulo}`} className="absolute rounded-sm overflow-hidden"
            style={{ left: x1, width: largura, top: faixa * h + 1, height: h - 2, background: `${meta.cor}${e.simulado ? '4D' : '26'}`, borderLeft: `2.5px solid ${meta.cor}` }}>
            {/* O rótulo gruda na borda VISÍVEL: uma janela que começa fora da
                tela precisa continuar dizendo o nome dela. */}
            <div className="absolute flex items-center gap-1 whitespace-nowrap"
              style={{ left: Math.max(0, -x1) + 4, top: 1, maxWidth: Math.max(12, visivelAte - visivelDe - 8), overflow: 'hidden' }}>
              <Icone nome={meta.icone} size={11} className="shrink-0" strokeWidth={2.2} />
              {visivelAte - visivelDe > 78 && h > 15 && <span className="font-ui text-[10px] truncate" style={{ color: meta.cor }}>{rotulo}</span>}
            </div>
          </div>
        );
      })}
      {grupos.map((g) => {
        if (g.px < -12 || g.px > W + 12) return null;
        const meta = EVENTO_META[g.itens[0].tipo];
        return (
          <span key={g.px} title={g.itens.map((e) => e.rotulo).join(' · ')}
            className="absolute rounded-full flex items-center justify-center shadow-sm"
            style={{ left: g.px - 9, top: altura / 2 - 9, width: 18, height: 18, background: meta.cor, color: '#fff', border: '1.5px solid #fff' }}>
            {g.itens.length > 1
              ? <span className="font-ui text-[9px] font-bold">{g.itens.length}</span>
              : <Icone nome={meta.icone} size={10} strokeWidth={2.6} />}
          </span>
        );
      })}
    </div>
  );
}

/* ── Minimapa ─────────────────────────────────────────────────────────────── */

function Minimapa({ dados, vp, horizonte, marcos, onIr, altura }) {
  const ref = useRef(null);
  const W = useLargura(ref);
  const arrastando = useRef(false);

  const { d, quebras } = useMemo(() => {
    if (W <= 0) return { d: '', quebras: [] };
    const p = Math.max(1, Math.ceil(horizonte / 200));
    const mx = dados.maximo || 1;
    const pts = [];
    for (let i = 0; i < horizonte; i += p) pts.push(`${((i / horizonte) * W).toFixed(1)} ${(altura - (dados.meses[i].total / mx) * (altura - 8)).toFixed(1)}`);
    // Meses com problema marcados: sem isso, um furo no plano só é achado por
    // sorte de arraste em 552 meses.
    const q = dados.meses.filter((l) => l.quebrou).map((l) => (l.m / horizonte) * W);
    return { d: `M0 ${altura}L${pts.join('L')}L${W} ${altura}Z`, quebras: q };
  }, [W, dados, horizonte, altura]);

  const irPeloPonteiro = (e) => {
    const caixa = ref.current.getBoundingClientRect();
    onIr(clamp((e.clientX - caixa.left) / caixa.width, 0, 1) * horizonte);
  };

  const x1 = (vp.ini / horizonte) * W;
  const x2 = ((vp.ini + vp.largura) / horizonte) * W;

  return (
    <div ref={ref} className="relative bg-navy-950 cursor-pointer touch-none" style={{ height: altura }}
      tabIndex={0}
      onKeyDown={(e) => {
        const passo = e.shiftKey ? vp.largura : vp.largura / 4;
        if (e.key === 'ArrowLeft') { e.preventDefault(); onIr(vp.ini + vp.largura / 2 - passo); }
        if (e.key === 'ArrowRight') { e.preventDefault(); onIr(vp.ini + vp.largura / 2 + passo); }
        if (e.key === 'Home') { e.preventDefault(); onIr(vp.largura / 2); }
        if (e.key === 'End') { e.preventDefault(); onIr(horizonte - vp.largura / 2); }
      }}
      onPointerDown={(e) => { arrastando.current = true; e.currentTarget.setPointerCapture(e.pointerId); irPeloPonteiro(e); }}
      onPointerMove={(e) => arrastando.current && irPeloPonteiro(e)}
      onPointerUp={() => { arrastando.current = false; }}
      onPointerCancel={() => { arrastando.current = false; }}
      role="slider" aria-label="Navegar pela linha do tempo inteira"
      aria-valuemin={1} aria-valuemax={horizonte} aria-valuenow={Math.round(vp.ini + vp.largura / 2)}>
      <svg width={W} height={altura} className="block">
        <path d={d} fill="#FA7A35" fillOpacity="0.32" stroke="#FA7A35" strokeWidth="1" />
        {marcos.filter((m) => m.destaque).map((m) => (
          <line key={m.mes} x1={(m.mes / horizonte) * W} x2={(m.mes / horizonte) * W} y1="0" y2={altura} stroke="#fff" strokeWidth="1" strokeOpacity="0.32" />
        ))}
        {quebras.map((px, k) => <line key={k} x1={px} x2={px} y1="0" y2={altura} stroke="#C2410C" strokeWidth="1.5" />)}
      </svg>
      <div className="absolute top-0 bottom-0 border-x-2 border-white/85 bg-white/15 pointer-events-none" style={{ left: x1, width: Math.max(3, x2 - x1) }} />
      <span className="absolute left-2 top-1 font-ui text-[9px] text-white/60 pointer-events-none">a vida inteira</span>
    </div>
  );
}

/* ── Painel de simulação ──────────────────────────────────────────────────── */

function PainelSimulacao({ base, cenarioVivo, mes, sim, setSim, linha, alertas, fechar, compacto }) {
  const temVenda = base.caixinhas.some((c) => c.id === 'otica');
  const jv = janelaVigente(base, mes);
  const teto = aporteMaximo(jv);
  const irredutivel = despesaIrredutivel(jv);
  const aporteAtual = aporteVigente(cenarioVivo, mes);
  const podeAportar = teto > 0;
  const liberdade = base.caixinhas.find((c) => c.natureza === 'liberdade');

  // O `mes` da simulação precisa ser o mês corrente, não o congelado na primeira
  // interação — antes o cabeçalho dizia "a partir de abr/2036" enquanto o motor
  // aplicava a partir de jul/2031.
  const set = (patch) => setSim({ ...(sim || {}), mes, ...patch });
  const achados = alertas.filter((a) => a.nivel === 'achado' || a.nivel === 'erro');

  return (
    <div className="px-4 py-4 bg-[#F5F1FA] border-t border-[#7B5EA7]/25 space-y-3 max-h-[46vh] overflow-y-auto">
      <div className="flex items-center justify-between gap-2">
        <p className="font-display font-semibold text-navy-900 text-sm">
          E se… <span className="font-ui font-normal text-ink-body text-xs">a partir de {linha.data.rotulo}</span>
        </p>
        <div className="flex items-center gap-1">
          {sim && (
            <button onClick={() => setSim(null)} className="font-ui text-[11px] text-[#7B5EA7] underline underline-offset-2 min-h-[44px] px-2 flex items-center gap-1">
              <Icone nome="undo" size={13} /> desfazer
            </button>
          )}
          <button onClick={fechar} aria-label="Fechar simulação" className="w-11 h-11 rounded-full bg-white/70 flex items-center justify-center text-ink-body">
            <Icone nome="chevron-down" size={16} />
          </button>
        </div>
      </div>

      <p className="font-body text-[11.5px] text-ink-body leading-snug">
        Nada aqui muda o seu plano. Isto é rascunho — o plano só muda com o Nélio.
      </p>

      {podeAportar ? (
        <Deslizador rotulo="Quanto você guarda por mês" valor={sim?.aporte ?? aporteAtual}
          min={0} max={teto} passo={500} marca={aporteAtual} onChange={(v) => set({ aporte: v })}
          chips={[
            { r: 'guardados', v: sim?.aporte ?? aporteAtual, cor: '#1F7A45' },
            { r: 'para viver', v: linha.fluxo.receita - (sim?.aporte ?? aporteAtual), cor: '#20344C' },
          ]}
          nota={`O custo de vida que você declarou (${brl(irredutivel)}) é o piso — a alavanca só mexe no que ainda não tem destino.`} />
      ) : (
        <p className="font-body text-xs text-ink-body leading-relaxed">
          Neste trecho não entra renda de trabalho: a vida é paga pelo próprio patrimônio.
          Navegue até um mês em que ainda entra renda para mexer no quanto você guarda.
        </p>
      )}

      <Deslizador rotulo="Teste de estresse: e se render menos" valor={(sim?.estresse ?? 0) * 100}
        min={0} max={4} passo={0.5} sufixo=" p.p. a menos" onChange={(v) => set({ estresse: v / 100 })}
        nota="A rentabilidade só desce nesta alavanca. Dá para testar se o plano aguenta render menos — nunca para fazê-lo fechar rendendo mais." />

      {temVenda && (
        <Deslizador rotulo="Por quanto a ótica é vendida" valor={sim?.venda ?? 2400000}
          min={400000} max={4000000} passo={100000} marca={2400000}
          onChange={(v) => set({ venda: v, vendaBase: 2400000, vendaMes: 121, vendaCaixinha: 'otica' })}
          nota="Este é o preço de venda, antes do imposto sobre o ganho. Quanto sobra depende do custo de aquisição e do formato da venda — o Nélio fecha isso na montagem do plano." />
      )}

      {liberdade && (
        <button onClick={() => set({ extras: [{ mes, valor: 50000, caixinha: liberdade.id }] })}
          className="w-full min-h-[44px] rounded-btn border border-[#7B5EA7] text-[#7B5EA7] font-ui text-xs flex items-center justify-center gap-2">
          <Icone nome="circle-plus" size={14} /> Simular R$ 50.000 a mais em {linha.data.rotulo}
        </button>
      )}

      {sim?.extras?.length > 0 && (
        <div className="space-y-1">
          {sim.extras.map((x) => (
            <div key={x.mes} className="flex items-center justify-between gap-2 px-3 py-2 rounded-btn bg-white">
              <span className="font-ui text-[11px] text-navy-900">aporte de {brl(x.valor)} em {dataDoMes(base.inicio, x.mes).rotulo}</span>
              <button onClick={() => set({ extras: sim.extras.filter((y) => y.mes !== x.mes) })}
                aria-label="Remover este aporte" className="w-8 h-8 flex items-center justify-center text-ink-body">✕</button>
            </div>
          ))}
        </div>
      )}

      {/* A consequência mora ao lado do dedo que a provocou */}
      {achados.length > 0 && achados.map((a, k) => <Alerta key={k} a={a} />)}
    </div>
  );
}

function Deslizador({ rotulo, valor, min, max, passo, onChange, nota, chips, marca, sufixo }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2 mb-1">
        <label className="font-body text-[13px] text-navy-900">{rotulo}</label>
        <span className="font-display text-navy-900 text-sm tabular-nums">
          {sufixo ? `${valor.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}${sufixo}` : brl(valor)}
        </span>
      </div>
      <input type="range" min={min} max={max} step={passo} value={valor}
        onChange={(e) => onChange(Number(e.target.value))} aria-label={rotulo}
        className="w-full h-11 accent-[#7B5EA7] cursor-pointer" />
      <div className="flex items-center justify-between font-ui text-[9.5px]" style={{ color: CINZA }}>
        <span>{sufixo ? min : brlCurto(min)}</span>
        {marca != null && <span>plano: {brlCurto(marca)}</span>}
        <span>{sufixo ? `${max}${sufixo}` : brlCurto(max)}</span>
      </div>
      {chips && (
        <div className="flex gap-2 mt-1.5">
          {chips.map((c) => (
            <div key={c.r} className="flex-1 rounded-btn bg-white px-3 py-1.5">
              <p className="font-display text-[13px] tabular-nums" style={{ color: c.cor }}>{brl(c.v)}</p>
              <p className="font-ui text-[10px]" style={{ color: CINZA }}>{c.r}</p>
            </div>
          ))}
        </div>
      )}
      <p className="font-ui text-[10.5px] leading-relaxed mt-1" style={{ color: CINZA }}>{nota}</p>
    </div>
  );
}

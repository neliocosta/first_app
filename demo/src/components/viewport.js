/**
 * VIEWPORT TEMPORAL — a peça que faz a diferença desta ferramenta.
 *
 * O problema que quase toda ferramenta de evolução patrimonial tem: uma escala
 * única. Os 46 anos cabem na tela, e aí a compra do carro daqui a 7 meses vira
 * três pixels no canto esquerdo. Aqui o gráfico é uma janela sobre uma régua
 * muito mais longa: dá para abrir a vida inteira e dá para chegar em 6 meses,
 * no mesmo objeto, arrastando.
 *
 * Estado do viewport: `ini` (primeiro mês visível, fracionário) e `largura`
 * (quantos meses cabem). Zoom = mudar `largura` em torno de uma âncora que fica
 * parada — é isso que faz o zoom "não escorregar" debaixo do dedo.
 */
import { useState, useRef, useCallback, useEffect } from 'react';

export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

export const MIN_MESES = 6;

/** Abaixo disto o eixo de valor corta a base — senão o zoom curto vira uma laje. */
export const ZOOM_DE_PERTO = 36;

const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function useViewport(horizonte, larguraInicial = 132) {
  const [vp, setVp] = useState(() => ({ ini: 1, largura: Math.min(larguraInicial, horizonte) }));
  const vpRef = useRef(vp);
  vpRef.current = vp;
  const anim = useRef(0);

  const pararAnimacao = useCallback(() => cancelAnimationFrame(anim.current), []);

  const aplicar = useCallback((ini, largura) => {
    const l = clamp(largura, MIN_MESES, horizonte);
    setVp({ ini: clamp(ini, 1, Math.max(1, horizonte - l + 1)), largura: l });
  }, [horizonte]);

  /**
   * Transição animada — não é enfeite. Numa ferramenta cujo diferencial é
   * navegação, teleportar de 46 anos para 7 meses quebra a prova de que é o
   * mesmo objeto. O olho precisa acompanhar o caminho.
   */
  const animarPara = useCallback((iniAlvo, larguraAlvo, ms = 280) => {
    pararAnimacao();
    const de = { ...vpRef.current };
    const l = clamp(larguraAlvo, MIN_MESES, horizonte);
    const para = { ini: clamp(iniAlvo, 1, Math.max(1, horizonte - l + 1)), largura: l };
    const t0 = performance.now();
    const passo = (agora) => {
      const t = clamp((agora - t0) / ms, 0, 1);
      const k = easeInOutCubic(t);
      // Interpolar a largura em escala logarítmica mantém a sensação de zoom
      // constante — linear faz o começo voar e o fim arrastar.
      const largura = de.largura * Math.pow(para.largura / de.largura, k);
      setVp({ ini: de.ini + (para.ini - de.ini) * k, largura });
      if (t < 1) anim.current = requestAnimationFrame(passo);
    };
    anim.current = requestAnimationFrame(passo);
  }, [horizonte, pararAnimacao]);

  /** Zoom mantendo parada a posição `ancora` (0 = borda esquerda, 1 = direita). */
  const zoom = useCallback((fator, ancora = 0.5, animado = false) => {
    const v = vpRef.current;
    const mesAncora = v.ini + v.largura * ancora;
    const l = clamp(v.largura * fator, MIN_MESES, horizonte);
    if (animado) animarPara(mesAncora - l * ancora, l, 200);
    else { pararAnimacao(); aplicar(mesAncora - l * ancora, l); }
  }, [aplicar, animarPara, horizonte, pararAnimacao]);

  const irPara = useCallback((largura, centro) => {
    const v = vpRef.current;
    const c = centro ?? v.ini + v.largura / 2;
    animarPara(c - largura / 2, largura);
  }, [animarPara]);

  const mover = useCallback((deltaMeses) => {
    const v = vpRef.current;
    aplicar(v.ini + deltaMeses, v.largura);
  }, [aplicar]);

  useEffect(() => () => cancelAnimationFrame(anim.current), []);

  return { vp, vpRef, zoom, mover, irPara, aplicar, animarPara, pararAnimacao };
}

/**
 * Gestos sobre o palco: arrastar para navegar, roda/pinça para dar zoom,
 * inércia ao soltar, e toque para inspecionar.
 */
export function useGestos({ palcoRef, vpRef, mover, zoom, larguraPx, aoFocar, pararAnimacao }) {
  const ponteiros = useRef(new Map());
  const arraste = useRef(null);
  const pinca = useRef(null);
  const velocidade = useRef(0);
  const raf = useRef(0);
  const [arrastando, setArrastando] = useState(false);

  const mesesPorPx = useCallback(() => (larguraPx > 0 ? vpRef.current.largura / larguraPx : 0), [larguraPx, vpRef]);

  const pararInercia = useCallback(() => { cancelAnimationFrame(raf.current); velocidade.current = 0; }, []);

  const soltarComInercia = useCallback(() => {
    let ultimo = performance.now();
    const passo = (agora) => {
      const dt = Math.min(48, agora - ultimo);
      ultimo = agora;
      if (Math.abs(velocidade.current) < 0.0004) return;
      mover(velocidade.current * dt);
      velocidade.current *= Math.pow(0.9955, dt);
      raf.current = requestAnimationFrame(passo);
    };
    raf.current = requestAnimationFrame(passo);
  }, [mover]);

  const fracaoDe = useCallback((clientX) => {
    const caixa = palcoRef.current?.getBoundingClientRect();
    if (!caixa) return 0.5;
    return clamp((clientX - caixa.left) / caixa.width, 0, 1);
  }, [palcoRef]);

  const onPointerDown = useCallback((e) => {
    pararInercia();
    pararAnimacao?.();
    palcoRef.current?.setPointerCapture?.(e.pointerId);
    ponteiros.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (ponteiros.current.size === 1) {
      arraste.current = { x0: e.clientX, y0: e.clientY, ultimoX: e.clientX, t: performance.now(), passouDoLimiar: false };
      // Tocar em qualquer ponto responde "quanto eu tenho aqui" — um gesto.
      // Antes o foco no toque era travado no centro e um toque não fazia nada.
      if (e.pointerType !== 'mouse') aoFocar?.(fracaoDe(e.clientX));
      setArrastando(true);
    } else if (ponteiros.current.size >= 2) {
      const [a, b] = [...ponteiros.current.values()];
      pinca.current = { dist: Math.hypot(a.x - b.x, a.y - b.y) || 1, largura: vpRef.current.largura };
      arraste.current = null;
    }
  }, [palcoRef, vpRef, aoFocar, fracaoDe, pararInercia, pararAnimacao]);

  const onPointerMove = useCallback((e) => {
    const caixa = palcoRef.current?.getBoundingClientRect();
    if (!caixa) return;
    if (ponteiros.current.has(e.pointerId)) ponteiros.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (ponteiros.current.size >= 2 && pinca.current) {
      const [a, b] = [...ponteiros.current.values()];
      // Hipotenusa, não só o eixo x: dois dedos na vertical davam distância ~0
      // e o zoom saltava para o máximo instantaneamente.
      const dist = Math.max(24, Math.hypot(a.x - b.x, a.y - b.y));
      const ancora = clamp(((a.x + b.x) / 2 - caixa.left) / caixa.width, 0, 1);
      const alvo = pinca.current.largura * (pinca.current.dist / dist);
      zoom(alvo / vpRef.current.largura, ancora);
      return;
    }

    if (arraste.current) {
      const dx = e.clientX - arraste.current.ultimoX;
      const totalX = Math.abs(e.clientX - arraste.current.x0);
      const totalY = Math.abs(e.clientY - arraste.current.y0);
      // Só sequestra o gesto quando ele é claramente horizontal — senão a
      // pessoa que quer rolar a página fica presa no gráfico.
      if (!arraste.current.passouDoLimiar) {
        if (totalX < 8 && totalY < 8) return;
        if (totalY > totalX) { arraste.current = null; setArrastando(false); return; }
        arraste.current.passouDoLimiar = true;
      }
      const agora = performance.now();
      const dt = Math.max(1, agora - arraste.current.t);
      const dMeses = -dx * mesesPorPx();
      mover(dMeses);
      // Média móvel: um arraste que termina devagar não deve arremessar, e um
      // trêmulo final não deve disparar.
      velocidade.current = velocidade.current * 0.6 + (dMeses / dt) * 0.4;
      arraste.current.ultimoX = e.clientX;
      arraste.current.t = agora;
    }

    if (aoFocar && e.pointerType === 'mouse') aoFocar(fracaoDe(e.clientX));
  }, [palcoRef, vpRef, mover, zoom, mesesPorPx, aoFocar, fracaoDe]);

  const onPointerUp = useCallback((e) => {
    ponteiros.current.delete(e.pointerId);
    if (ponteiros.current.size === 0) {
      if (arraste.current?.passouDoLimiar) soltarComInercia();
      arraste.current = null; pinca.current = null; setArrastando(false);
    } else if (ponteiros.current.size === 1) {
      pinca.current = null;
      const [p] = [...ponteiros.current.values()];
      arraste.current = { x0: p.x, y0: p.y, ultimoX: p.x, t: performance.now(), passouDoLimiar: true };
    } else {
      // Terceiro dedo saiu: reancora a pinça, senão o próximo movimento salta.
      const [a, b] = [...ponteiros.current.values()];
      pinca.current = { dist: Math.hypot(a.x - b.x, a.y - b.y) || 1, largura: vpRef.current.largura };
    }
  }, [soltarComInercia, vpRef]);

  // A roda só toma a página quando o gesto é de zoom ou horizontal. Rolagem
  // vertical continua rolando — metade da tela do celular era zona morta.
  useEffect(() => {
    const el = palcoRef.current;
    if (!el) return;
    const onWheel = (e) => {
      const horizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      const querZoom = e.ctrlKey || e.metaKey;
      if (!horizontal && !querZoom) return; // deixa a página rolar
      e.preventDefault();
      pararInercia();
      const caixa = el.getBoundingClientRect();
      const ancora = clamp((e.clientX - caixa.left) / caixa.width, 0, 1);
      if (horizontal) mover(e.deltaX * mesesPorPx());
      else zoom(Math.exp(e.deltaY * 0.0016), ancora);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [palcoRef, zoom, mover, mesesPorPx, pararInercia]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  return { arrastando, manipuladores: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp } };
}

/** Largura real do elemento em px — o SVG desenha em pixels, texto sai nítido. */
export function useLargura(ref) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entrada]) => setW(entrada.contentRect.width));
    ro.observe(el);
    setW(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, [ref]);
  return w;
}

const PASSOS = [1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 8];
export function escalaEstavel(maximo) {
  if (!Number.isFinite(maximo) || maximo <= 0) return 1;
  const expo = Math.floor(Math.log10(maximo));
  const base = Math.pow(10, expo);
  const passo = PASSOS.find((p) => maximo / base <= p * 1.001) ?? 10;
  return passo * base;
}

/**
 * Escala vertical da janela.
 *
 * Longe, a base é zero — é a leitura honesta do patrimônio.
 * Perto, a base CORTA. Sem isso, dar zoom em 7 meses mostra um retângulo liso:
 * a variação do período é 0,2% da escala, menos de um pixel. O corte é o que
 * transforma o zoom em informação — e por isso ele é sempre declarado na tela.
 */
export function escalaDaJanela(min, max, dePerto) {
  if (!Number.isFinite(min) || !Number.isFinite(max)) return { base: 0, topo: 1, cortada: false };
  if (!dePerto) return { base: 0, topo: escalaEstavel(max * 1.02), cortada: false };
  const amplitude = Math.max(max - min, Math.abs(max) * 0.004, 1);
  const folga = amplitude * 0.18;
  return { base: Math.max(0, min - folga), topo: max + folga, cortada: min - folga > 0 };
}

/** Linhas de grade em números redondos. "18,8 mi" não é rótulo de eixo. */
export function ticksDeValor(base, topo, alvo = 4) {
  const bruto = (topo - base) / alvo;
  if (!Number.isFinite(bruto) || bruto <= 0) return [];
  const expo = Math.floor(Math.log10(bruto));
  const b = Math.pow(10, expo);
  const passo = ([1, 2, 2.5, 5, 10].find((p) => bruto <= p * b) ?? 10) * b;
  const marcas = [];
  for (let v = Math.ceil(base / passo) * passo; v <= topo + 1e-6; v += passo) marcas.push(v);
  return marcas;
}

/** Marcas do eixo do tempo, densidade conforme o zoom. */
export function ticksDoTempo(vp, dataDoMes, inicio) {
  const fim = vp.ini + vp.largura;
  const marcas = [];
  const passoMeses = vp.largura <= 18 ? 1
    : vp.largura <= 40 ? 3
    : vp.largura <= 90 ? 6
    : vp.largura <= 300 ? 12
    : vp.largura <= 700 ? 60
    : 120;
  const primeiro = Math.ceil((vp.ini - 1) / passoMeses) * passoMeses + 1;
  for (let m = primeiro; m < fim; m += passoMeses) {
    const d = dataDoMes(inicio, m);
    marcas.push({
      m,
      rotulo: passoMeses < 12 ? `${d.rotuloCurto}/${String(d.ano).slice(2)}` : String(d.ano),
      forte: passoMeses < 12 ? d.mes === 1 : d.ano % (passoMeses >= 120 ? 20 : 10) === 0,
    });
  }
  return marcas;
}

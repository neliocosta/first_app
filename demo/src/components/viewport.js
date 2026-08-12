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

export function useViewport(horizonte, larguraInicial = 120) {
  const [vp, setVp] = useState(() => ({ ini: 1, largura: Math.min(larguraInicial, horizonte) }));
  const vpRef = useRef(vp);
  vpRef.current = vp;

  const aplicar = useCallback((ini, largura) => {
    const l = clamp(largura, MIN_MESES, horizonte);
    setVp({ ini: clamp(ini, 1, horizonte - l + 1), largura: l });
  }, [horizonte]);

  /** Zoom mantendo parada a posição `ancora` (0 = borda esquerda, 1 = direita). */
  const zoom = useCallback((fator, ancora = 0.5) => {
    const v = vpRef.current;
    const mesAncora = v.ini + v.largura * ancora;
    const l = clamp(v.largura * fator, MIN_MESES, horizonte);
    aplicar(mesAncora - l * ancora, l);
  }, [aplicar, horizonte]);

  const irPara = useCallback((largura, centro) => {
    const v = vpRef.current;
    const c = centro ?? v.ini + v.largura / 2;
    aplicar(c - largura / 2, largura);
  }, [aplicar]);

  const mover = useCallback((deltaMeses) => {
    const v = vpRef.current;
    aplicar(v.ini + deltaMeses, v.largura);
  }, [aplicar]);

  return { vp, vpRef, zoom, mover, irPara, aplicar };
}

/**
 * Gestos sobre o palco: arrastar para navegar, roda/pinça para dar zoom,
 * e inércia ao soltar. Devolve também o mês sob o cursor (mouse) ou sob a
 * linha central (toque) — a leitura é sempre ao vivo, sem precisar clicar.
 */
export function useGestos({ palcoRef, vpRef, mover, zoom, larguraPx, aoFocar }) {
  const ponteiros = useRef(new Map());
  const arraste = useRef(null);
  const pinca = useRef(null);
  const inercia = useRef(0);
  const raf = useRef(0);
  const [arrastando, setArrastando] = useState(false);

  const mesesPorPx = useCallback(() => (larguraPx > 0 ? vpRef.current.largura / larguraPx : 0), [larguraPx, vpRef]);

  const pararInercia = () => { cancelAnimationFrame(raf.current); inercia.current = 0; };

  const soltarComInercia = useCallback(() => {
    const passo = () => {
      if (Math.abs(inercia.current) < 0.02) return;
      mover(inercia.current);
      inercia.current *= 0.92;
      raf.current = requestAnimationFrame(passo);
    };
    raf.current = requestAnimationFrame(passo);
  }, [mover]);

  const onPointerDown = useCallback((e) => {
    pararInercia();
    palcoRef.current?.setPointerCapture?.(e.pointerId);
    ponteiros.current.set(e.pointerId, { x: e.clientX, t: performance.now() });
    if (ponteiros.current.size === 1) {
      arraste.current = { x: e.clientX, ultimoX: e.clientX, t: performance.now() };
      setArrastando(true);
    } else if (ponteiros.current.size === 2) {
      const [a, b] = [...ponteiros.current.values()];
      pinca.current = { dist: Math.abs(a.x - b.x) || 1, largura: vpRef.current.largura };
      arraste.current = null;
    }
  }, [palcoRef, vpRef]);

  const onPointerMove = useCallback((e) => {
    const caixa = palcoRef.current?.getBoundingClientRect();
    if (!caixa) return;

    if (ponteiros.current.has(e.pointerId)) ponteiros.current.set(e.pointerId, { x: e.clientX, t: performance.now() });

    // Duas pontas na tela: pinça.
    if (ponteiros.current.size === 2 && pinca.current) {
      const [a, b] = [...ponteiros.current.values()];
      const dist = Math.abs(a.x - b.x) || 1;
      const centroPx = (a.x + b.x) / 2 - caixa.left;
      const ancora = clamp(centroPx / caixa.width, 0, 1);
      const alvo = pinca.current.largura * (pinca.current.dist / dist);
      zoom(alvo / vpRef.current.largura, ancora);
      return;
    }

    // Uma ponta: arrastar a régua.
    if (arraste.current) {
      const dx = e.clientX - arraste.current.ultimoX;
      const dMeses = -dx * mesesPorPx();
      mover(dMeses);
      inercia.current = dMeses;
      arraste.current.ultimoX = e.clientX;
    }

    // O foco acompanha o cursor no mouse; no toque fica no centro (o dedo tapa).
    if (aoFocar) {
      const fracao = e.pointerType === 'mouse'
        ? clamp((e.clientX - caixa.left) / caixa.width, 0, 1)
        : 0.5;
      aoFocar(fracao);
    }
  }, [palcoRef, vpRef, mover, zoom, mesesPorPx, aoFocar]);

  const onPointerUp = useCallback((e) => {
    ponteiros.current.delete(e.pointerId);
    if (ponteiros.current.size === 0) {
      if (arraste.current) soltarComInercia();
      arraste.current = null;
      pinca.current = null;
      setArrastando(false);
    } else if (ponteiros.current.size === 1) {
      pinca.current = null;
      const [p] = [...ponteiros.current.values()];
      arraste.current = { x: p.x, ultimoX: p.x, t: performance.now() };
    }
  }, [soltarComInercia]);

  // A roda precisa de listener não-passivo para poder impedir o scroll da página.
  useEffect(() => {
    const el = palcoRef.current;
    if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      pararInercia();
      const caixa = el.getBoundingClientRect();
      const ancora = clamp((e.clientX - caixa.left) / caixa.width, 0, 1);
      if (e.shiftKey) mover(e.deltaY * mesesPorPx());
      else zoom(Math.exp(e.deltaY * 0.0016), ancora);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [palcoRef, zoom, mover, mesesPorPx]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  return { arrastando, manipuladores: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp } };
}

/** Largura real do elemento em px — o SVG desenha em pixels, para o texto sair nítido. */
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

/**
 * Escala vertical adaptativa e ESTÁVEL.
 *
 * Adaptativa porque é o que resolve a queixa central: com escala fixa, dar zoom
 * nos próximos 7 meses mostra uma linha reta colada no chão. Estável porque uma
 * escala que recalcula a cada pixel de arraste faz o gráfico "respirar" e
 * embrulha o estômago — então o valor é arredondado para um degrau bonito e só
 * muda quando muda de degrau.
 */
const PASSOS = [1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 8];
export function escalaEstavel(maximo) {
  if (maximo <= 0) return 1;
  const expo = Math.floor(Math.log10(maximo));
  const base = Math.pow(10, expo);
  const norm = maximo / base;
  const passo = PASSOS.find((p) => norm <= p * 1.001) ?? 10;
  return passo * base;
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

import React, { useMemo, useState, useRef, useEffect } from 'react';
import { PERGUNTAS, TIPOS } from '../data/exame.js';
import { RICARDO } from '../data/demo.js';
import { Marca, Button, Icone, InputMoedaChips, InputIdade, BarraProgresso } from '../components/ui.jsx';

/** Avalia se uma pergunta é visível dadas as respostas (as 6 condicionais). */
function visivel(p, resp) {
  if (!p.condicao) return true;
  const v = resp[p.condicao.campo];
  if (p.condicao.igual !== undefined) return v === p.condicao.igual;
  if (p.condicao.diferenteDe !== undefined) {
    if (v === undefined) return false;
    const arr = Array.isArray(v) ? v : [v];
    return arr.length > 0 && !(arr.length === 1 && arr[0] === p.condicao.diferenteDe);
  }
  return true;
}

/**
 * Poda de respostas órfãs (engenheiro R4): ao mudar uma resposta que fecha uma condicional,
 * as respostas das perguntas que sumiram são removidas — e a q14 é intersectada com a q13.
 */
function podar(respostas) {
  const limpo = { ...respostas };
  PERGUNTAS.forEach((p) => {
    if (!visivel(p, limpo)) delete limpo[p.id];
    if (p.opcoesDe && Array.isArray(limpo[p.id])) {
      const permitidas = Array.isArray(limpo[p.opcoesDe]) ? limpo[p.opcoesDe] : [];
      limpo[p.id] = limpo[p.id].filter((o) => permitidas.includes(o) || o === p.opcaoNenhum);
    }
  });
  return limpo;
}

export default function Exame({ estado, acoes }) {
  const { respostas, indiceExame } = estado;
  const [rascunho, setRascunho] = useState(null);
  const tituloRef = useRef(null);

  const lista = useMemo(() => PERGUNTAS.filter((p) => visivel(p, respostas)), [respostas]);
  const idx = Math.min(indiceExame, lista.length - 1);
  const p = lista[idx];

  // C1 — denominador monotônico: a linha de chegada nunca recua ao revelar mais
  const total = Math.max(lista.length, estado.totalExameVisto || 0);
  useEffect(() => {
    if (lista.length > (estado.totalExameVisto || 0)) acoes.responderExame({ totalExameVisto: lista.length });
  }, [lista.length]);

  // Acessibilidade: leva o foco ao enunciado a cada avanço (jornada de 33 telas)
  useEffect(() => { tituloRef.current?.focus(); }, [p?.id]);

  const valorAtual = rascunho !== null ? rascunho : respostas[p?.id];
  if (!p) return null;

  // BUG FIX: opções da q14 espelham os bens marcados na q13
  const opcoes = p.opcoesDe
    ? (Array.isArray(respostas[p.opcoesDe]) ? respostas[p.opcoesDe] : []).filter((o) => o !== 'Nenhum')
    : p.opcoes;

  const responder = (v) => {
    const novas = podar({ ...respostas, [p.id]: v });
    setRascunho(null);
    const proximas = PERGUNTAS.filter((q) => visivel(q, novas));
    const posicao = proximas.findIndex((q) => q.id === p.id);
    if (posicao + 1 >= proximas.length) {
      acoes.responderExame({ respostas: novas, fase: 'exameConcluido', score: RICARDO.score });
    } else {
      acoes.responderExame({ respostas: novas, indiceExame: posicao + 1 });
    }
  };

  // A1: na primeira pergunta, voltar devolve à trilha. Sem isto o exame continua
  // sendo uma sala sem porta — que foi a queixa original.
  const voltar = () => {
    setRascunho(null);
    if (idx > 0) acoes.responderExame({ indiceExame: idx - 1 });
    else acoes.voltarAtrilha();
  };

  // A4: a faixa só está respondida quando as duas pontas existem e fazem sentido.
  const faixa = valorAtual !== null && typeof valorAtual === 'object' && !Array.isArray(valorAtual);
  const podeAvancar = valorAtual !== undefined && valorAtual !== null && valorAtual !== '' &&
    !(Array.isArray(valorAtual) && valorAtual.length === 0) &&
    !(faixa && !(valorAtual.min > 0 && valorAtual.max >= valorAtual.min));

  const toggleMulti = (o) => {
    const atual = Array.isArray(valorAtual) ? valorAtual : [];
    const nenhum = p.opcaoNenhum;
    if (o === nenhum) return setRascunho([nenhum]);
    const semNenhum = atual.filter((x) => x !== nenhum);
    setRascunho(semNenhum.includes(o) ? semNenhum.filter((x) => x !== o) : [...semNenhum, o]);
  };

  const btnOpcao = (ativo) =>
    `w-full text-left px-5 py-4 rounded-btn border font-ui transition-colors min-h-[56px]
     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${
      ativo ? 'bg-orange-700 border-orange-700 text-white' : 'bg-white border-ink-line text-navy-900 hover:border-orange-500'
    }`;

  const precisaBotao = [TIPOS.MOEDA, TIPOS.MULTI, TIPOS.IDADE, TIPOS.DATA, TIPOS.EMAIL].includes(p.tipo);

  return (
    <div className="min-h-screen bg-cream-50 pt-11 flex flex-col">
      <header className="px-5 pt-6 pb-4 max-w-xl w-full mx-auto">
        <div className="flex items-center justify-between mb-5">
          <Marca size={24} />
          <span className="font-ui text-xs text-ink-body">Pergunta {idx + 1} de cerca de {total}</span>
        </div>
        <BarraProgresso atual={idx} total={Math.max(total - 1, 1)} reset={estado.fase} />
      </header>

      <main className="flex-1 px-5 max-w-xl w-full mx-auto pb-8">
        <div className="rounded-module h-32 flex items-center justify-center mb-6 relative overflow-hidden"
             style={{ background: 'linear-gradient(135deg, #20344C 60%, #FA7A35 165%)' }}>
          <Icone nome="play" size={30} className="text-white/85" />
          <span className="absolute bottom-2.5 right-3 font-ui text-[10px] text-white/70">vídeo do conceito · sem áudio</span>
        </div>

        <h1 ref={tituloRef} tabIndex={-1} aria-live="polite"
            className="font-display font-semibold text-navy-900 text-xl leading-snug mb-2 outline-none">
          {p.texto}
        </h1>
        {p.ajuda ? <p className="font-body text-sm text-ink-body mb-6">{p.ajuda}</p> : <div className="mb-6" />}

        {p.id === 'q14' && (
          <p className="mb-4 px-4 py-3 rounded-btn bg-peach-100 text-orange-700 font-ui text-xs leading-relaxed">
            Só aparecem aqui os bens que você marcou na pergunta anterior.
          </p>
        )}

        <div className="space-y-3">
          {(p.tipo === TIPOS.OPCAO || p.tipo === TIPOS.ESCALA) &&
            opcoes.map((o) => (
              <button key={o} onClick={() => responder(o)} className={btnOpcao(valorAtual === o)}>{o}</button>
            ))}

          {p.tipo === TIPOS.SIM_NAO && (
            <>
              {['Sim', 'Não'].map((o) => (
                <button key={o} onClick={() => responder(o)} className={btnOpcao(valorAtual === o)}>{o}</button>
              ))}
              {/* CFP R4: desconhecimento não pode virar negativa declarada */}
              {p.permiteNaoSei && (
                <button onClick={() => responder('Não sei')} className={btnOpcao(valorAtual === 'Não sei')}>
                  Não sei dizer
                </button>
              )}
            </>
          )}

          {p.tipo === TIPOS.MULTI && (
            <>
              {(opcoes || []).map((o) => {
                const marcado = Array.isArray(valorAtual) && valorAtual.includes(o);
                return (
                  <button key={o} onClick={() => toggleMulti(o)} className={btnOpcao(marcado)}>
                    <span className="flex items-center gap-3">
                      <span className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${marcado ? 'bg-white border-white' : 'border-ink-line'}`}>
                        {marcado && <Icone nome="check" size={13} className="text-orange-700" />}
                      </span>
                      {o}
                    </span>
                  </button>
                );
              })}
              {p.opcaoNenhum && (() => {
                const marcado = Array.isArray(valorAtual) && valorAtual.includes(p.opcaoNenhum);
                return (
                  <button onClick={() => toggleMulti(p.opcaoNenhum)} className={btnOpcao(marcado)}>
                    <span className="flex items-center gap-3">
                      <span className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${marcado ? 'bg-white border-white' : 'border-ink-line'}`}>
                        {marcado && <Icone nome="check" size={13} className="text-orange-700" />}
                      </span>
                      {p.opcaoNenhum}
                    </span>
                  </button>
                );
              })()}
            </>
          )}

          {p.tipo === TIPOS.MOEDA && (
            <InputMoedaChips key={p.id} valor={valorAtual} permiteVaria={p.permiteVaria}
              onChange={(v) => setRascunho(v)} />
          )}

          {/* A9: idade tem os seus próprios controles — a roda do mouse não a altera. */}
          {p.tipo === TIPOS.IDADE && (
            <InputIdade key={p.id} valor={valorAtual} onChange={(v) => setRascunho(v)} />
          )}

          {(p.tipo === TIPOS.DATA || p.tipo === TIPOS.EMAIL) && (
            <input key={p.id}
              type={p.tipo === TIPOS.DATA ? 'date' : 'email'}
              value={valorAtual || ''} onChange={(e) => setRascunho(e.target.value)}
              placeholder={p.tipo === TIPOS.EMAIL ? 'voce@exemplo.com' : ''}
              className="w-full px-4 py-3.5 rounded-input border border-ink-line bg-white font-ui text-lg text-navy-900 outline-none focus:border-orange-500 focus-visible:ring-2 focus-visible:ring-orange-500"
            />
          )}
        </div>
      </main>

      <footer className="sticky bottom-0 bg-cream-50/95 backdrop-blur border-t border-ink-line px-5 py-4">
        <div className="max-w-xl mx-auto flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={voltar}
            icon={<Icone nome="chevron-left" size={16} />}>Voltar</Button>
          <div className="flex-1" />
          {precisaBotao && <Button onClick={() => responder(valorAtual)} disabled={!podeAvancar}>Continuar</Button>}
        </div>
      </footer>
    </div>
  );
}

import React, { useMemo, useState } from 'react';
import { PERGUNTAS, TIPOS } from '../data/exame.js';
import { RICARDO } from '../data/demo.js';
import { Marca, Button, Icone, InputMoedaChips, BarraProgresso, SeloDemo } from '../components/ui.jsx';

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

export default function Exame({ estado, set }) {
  const { respostas, indiceExame } = estado;
  const [rascunho, setRascunho] = useState(null);

  // Barra adaptativa: o total recalcula a cada resposta (spec §4)
  const lista = useMemo(() => PERGUNTAS.filter((p) => visivel(p, respostas)), [respostas]);
  const idx = Math.min(indiceExame, lista.length - 1);
  const p = lista[idx];
  const valorAtual = rascunho !== null ? rascunho : respostas[p?.id];

  if (!p) return null;

  // BUG FIX: opções da q14 espelham os bens marcados na q13
  const opcoes = p.opcoesDe
    ? (Array.isArray(respostas[p.opcoesDe]) ? respostas[p.opcoesDe] : []).filter((o) => o !== 'Nenhum')
    : p.opcoes;

  const responder = (v) => {
    const novas = { ...respostas, [p.id]: v };
    setRascunho(null);
    const proximas = PERGUNTAS.filter((q) => visivel(q, novas));
    const posicao = proximas.findIndex((q) => q.id === p.id);
    if (posicao + 1 >= proximas.length) {
      set({ respostas: novas, fase: 'exameConcluido', score: RICARDO.score });
    } else {
      set({ respostas: novas, indiceExame: posicao + 1 });
    }
  };

  const voltar = () => {
    setRascunho(null);
    if (idx > 0) set({ indiceExame: idx - 1 });
  };

  const podeAvancar = valorAtual !== undefined && valorAtual !== null && valorAtual !== '' &&
    !(Array.isArray(valorAtual) && valorAtual.length === 0);

  const toggleMulti = (o) => {
    const atual = Array.isArray(valorAtual) ? valorAtual : [];
    const nenhum = p.opcaoNenhum;
    if (o === nenhum) return setRascunho([nenhum]);
    const semNenhum = atual.filter((x) => x !== nenhum);
    setRascunho(semNenhum.includes(o) ? semNenhum.filter((x) => x !== o) : [...semNenhum, o]);
  };

  const btnOpcao = (ativo) =>
    `w-full text-left px-5 py-4 rounded-btn border font-ui transition-colors min-h-[56px] ${
      ativo ? 'bg-orange-500 border-orange-500 text-white' : 'bg-white border-ink-line text-navy-900 hover:border-orange-500'
    }`;

  return (
    <div className="min-h-screen bg-cream-50 pt-11 flex flex-col">
      <header className="px-5 pt-6 pb-4 max-w-xl w-full mx-auto">
        <div className="flex items-center justify-between mb-5">
          <Marca size={24} />
          <span className="font-ui text-xs text-ink-body">{idx + 1} de {lista.length}</span>
        </div>
        <BarraProgresso atual={idx} total={lista.length - 1} />
      </header>

      <main className="flex-1 px-5 max-w-xl w-full mx-auto pb-8">
        {/* Vídeo mudo + texto destilado (spec §4) */}
        <div className="rounded-module bg-navy-900 h-32 flex items-center justify-center mb-6 relative overflow-hidden"
             style={{ background: 'linear-gradient(135deg, #20344C 60%, #FA7A35 165%)' }}>
          <Icone nome="play" size={30} className="text-white/85" />
          <span className="absolute bottom-2.5 right-3 font-ui text-[10px] text-white/55">vídeo do conceito · sem áudio</span>
        </div>

        <h1 className="font-display font-semibold text-navy-900 text-xl leading-snug mb-2">{p.texto}</h1>
        {p.ajuda && <p className="font-body text-sm text-ink-body mb-6">{p.ajuda}</p>}
        {!p.ajuda && <div className="mb-6" />}

        {p.id === 'q14' && (
          <p className="mb-4 px-4 py-3 rounded-btn bg-peach-100 text-orange-600 font-ui text-xs leading-relaxed">
            Estas opções espelham exatamente os bens que você marcou na pergunta anterior.
          </p>
        )}

        <div className="space-y-3">
          {(p.tipo === TIPOS.OPCAO || p.tipo === TIPOS.ESCALA) &&
            opcoes.map((o) => (
              <button key={o} onClick={() => responder(o)} className={btnOpcao(valorAtual === o)}>{o}</button>
            ))}

          {p.tipo === TIPOS.SIM_NAO && ['Sim', 'Não'].map((o) => (
            <button key={o} onClick={() => responder(o === 'Sim' ? (p.id === 'q04' || p.id === 'q05' || p.id === 'q06' || p.id === 'q29' ? 'SIM' : 'Sim') : (p.id === 'q04' || p.id === 'q05' || p.id === 'q06' || p.id === 'q29' ? 'NÃO' : 'Não'))}
              className={btnOpcao(String(valorAtual).toLowerCase() === o.toLowerCase())}>{o}</button>
          ))}

          {p.tipo === TIPOS.MULTI && (
            <>
              {(opcoes || []).map((o) => (
                <button key={o} onClick={() => toggleMulti(o)}
                  className={btnOpcao(Array.isArray(valorAtual) && valorAtual.includes(o))}>
                  <span className="flex items-center gap-3">
                    <span className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${
                      Array.isArray(valorAtual) && valorAtual.includes(o) ? 'bg-white border-white' : 'border-ink-line'}`}>
                      {Array.isArray(valorAtual) && valorAtual.includes(o) && <Icone nome="check" size={13} className="text-orange-500" />}
                    </span>
                    {o}
                  </span>
                </button>
              ))}
              {p.opcaoNenhum && (
                <button onClick={() => toggleMulti(p.opcaoNenhum)}
                  className={btnOpcao(Array.isArray(valorAtual) && valorAtual.includes(p.opcaoNenhum))}>
                  {p.opcaoNenhum}
                </button>
              )}
            </>
          )}

          {p.tipo === TIPOS.MOEDA && (
            <InputMoedaChips valor={valorAtual} chips={p.chips} permiteVaria={p.permiteVaria}
              onChange={(v) => setRascunho(v)} />
          )}

          {(p.tipo === TIPOS.IDADE || p.tipo === TIPOS.DATA || p.tipo === TIPOS.EMAIL) && (
            <input
              type={p.tipo === TIPOS.DATA ? 'date' : p.tipo === TIPOS.EMAIL ? 'email' : 'number'}
              value={valorAtual || ''} onChange={(e) => setRascunho(e.target.value)}
              placeholder={p.tipo === TIPOS.EMAIL ? 'voce@exemplo.com' : ''}
              className="w-full px-4 py-3.5 rounded-input border border-ink-line bg-white font-ui text-lg text-navy-900 outline-none focus:border-orange-500"
            />
          )}
        </div>
      </main>

      <footer className="sticky bottom-0 bg-cream-50/95 backdrop-blur border-t border-ink-line px-5 py-4">
        <div className="max-w-xl mx-auto flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={voltar} disabled={idx === 0}
            icon={<Icone nome="chevron-left" size={16} />}>Voltar</Button>
          <div className="flex-1" />
          {(p.tipo === TIPOS.MOEDA || p.tipo === TIPOS.MULTI || p.tipo === TIPOS.IDADE ||
            p.tipo === TIPOS.DATA || p.tipo === TIPOS.EMAIL) && (
            <Button onClick={() => responder(valorAtual)} disabled={!podeAvancar}>Continuar</Button>
          )}
        </div>
      </footer>
    </div>
  );
}

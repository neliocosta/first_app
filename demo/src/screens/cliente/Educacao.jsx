import React, { useState } from 'react';
import { CONCEITOS, QUIZ_EXEMPLO } from '../../data/demo.js';
import { Icone, Badge, Card, Button } from '../../components/ui.jsx';

export default function Educacao({ estado, set }) {
  const [busca, setBusca] = useState('');
  const [quiz, setQuiz] = useState(false);
  const [resp, setResp] = useState(null);

  const dominados = Object.values(estado.conceitos).filter(Boolean).length;
  const lista = CONCEITOS.filter((c) => c.titulo.toLowerCase().includes(busca.toLowerCase()));

  if (quiz) {
    return (
      <div className="pt-4">
        <button onClick={() => { setQuiz(false); setResp(null); }}
          className="font-ui text-xs text-white/50 inline-flex items-center gap-1 mb-5 min-h-[44px]">
          <Icone nome="arrow-left" size={14} /> voltar à coleção
        </button>
        <Card>
          <p className="font-ui text-xs text-ink-body uppercase tracking-wide mb-2">{QUIZ_EXEMPLO.titulo}</p>
          <p className="font-display text-navy-900 text-lg leading-snug mb-6">{QUIZ_EXEMPLO.pergunta}</p>
          <div className="space-y-2.5">
            {QUIZ_EXEMPLO.opcoes.map((o, i) => (
              <button key={i} onClick={() => { setResp(i); if (o.correta) set({ conceitos: { ...estado.conceitos, [QUIZ_EXEMPLO.conceitoId]: true } }); }}
                disabled={resp !== null}
                className={`w-full text-left px-4 py-3.5 rounded-btn border font-body text-sm min-h-[44px] transition-colors
                  ${resp === null ? 'border-ink-line hover:border-orange-500 text-navy-900'
                    : o.correta ? 'border-score-good bg-score-good/10 text-navy-900'
                    : resp === i ? 'border-score-low bg-score-low/10 text-navy-900' : 'border-ink-line text-ink-body opacity-60'}`}>
                {o.texto}
              </button>
            ))}
          </div>
          {resp !== null && (
            <>
              <p className="mt-5 px-4 py-3 rounded-btn bg-cream-100 font-body text-sm text-ink-body leading-relaxed">
                {QUIZ_EXEMPLO.opcoes[resp].feedback}
              </p>
              <p className="mt-3 font-ui text-[11px] text-ink-body">
                Este quiz não te pontua — ele diz ao seu consultor quais temas aprofundar.
              </p>
            </>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="pt-4 space-y-5">
      <div>
        <h1 className="font-display font-semibold text-white text-2xl mb-1">Educação</h1>
        <p className="font-body text-white/55">Você não precisa virar especialista. Só entender o suficiente para saber quando perguntar.</p>
      </div>

      <div className="rounded-module bg-white shadow-float p-6">
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="font-display font-bold text-navy-900 text-3xl">{dominados}<span className="text-ink-body text-xl">/100</span></p>
            <p className="font-ui text-xs text-ink-body mt-1">conceitos dominados</p>
          </div>
          <Badge status="good">nunca começa em zero</Badge>
        </div>
        <div className="h-2 rounded-full bg-cream-100 overflow-hidden">
          <div className="h-full bg-orange-500 rounded-full" style={{ width: `${dominados}%` }} />
        </div>
      </div>

      <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar um conceito"
        className="w-full px-4 py-3 rounded-input border border-white/15 bg-white/[0.06] font-ui text-sm text-white placeholder:text-white/35 outline-none focus:border-orange-500" />

      <div className="space-y-2.5">
        {lista.map((c) => {
          const dominado = estado.conceitos[c.id];
          const jogavel = c.quiz;
          return (
            <div key={c.id}
              className={`rounded-card bg-white p-4 flex items-center gap-3 ${jogavel ? 'cursor-pointer hover:brightness-95' : ''}`}
              onClick={jogavel ? () => setQuiz(true) : undefined}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0
                ${dominado ? 'bg-score-good' : 'bg-cream-100 border border-ink-line'}`}>
                {dominado && <Icone nome="check" size={13} className="text-white" />}
              </span>
              <span className="font-body text-sm text-navy-900 flex-1">{c.titulo}</span>
              {jogavel && !dominado && <Badge status="medium">jogar</Badge>}
            </div>
          );
        })}
        <p className="font-ui text-xs text-white/30 text-center pt-3">
          amostra de 15 dos ~100 conceitos da coleção
        </p>
      </div>
    </div>
  );
}

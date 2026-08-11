import React, { useState } from 'react';
import { RICARDO, OBJETIVOS, CICLO, CONSULTOR, WHATSAPP, MODULOS, QUIZ_EXEMPLO } from '../../data/demo.js';
import { Button, Icone, Badge, Card, InputMoedaChips } from '../../components/ui.jsx';

const brl = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

/* ── Mock da tela do WhatsApp (spec §9.2 — o Prompt do B=MAP) ─────────────── */
function WhatsAppMock({ onFechar }) {
  return (
    <div className="fixed inset-0 z-[60] bg-black/70 flex items-end sm:items-center justify-center p-0 sm:p-6"
         onClick={onFechar}>
      <div className="w-full sm:max-w-sm bg-[#ECE5DD] rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-float"
           onClick={(e) => e.stopPropagation()}>
        <div className="bg-[#075E54] px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center font-display font-bold text-white text-sm">N</div>
          <div className="flex-1">
            <p className="font-ui text-white text-sm font-semibold">{CONSULTOR.nome}</p>
            <p className="font-ui text-white/60 text-[11px]">seu consultor</p>
          </div>
          <button onClick={onFechar} className="text-white/70 font-ui text-xs px-2 min-h-[44px]">fechar</button>
        </div>
        <div className="p-4 space-y-2.5 max-h-[60vh] overflow-y-auto">
          {WHATSAPP.map((msg, i) => (
            <div key={i} className={`flex ${msg.de === 'cliente' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[82%] px-3.5 py-2.5 rounded-xl font-body text-[13px] leading-relaxed shadow-sm
                ${msg.de === 'cliente' ? 'bg-[#DCF8C6] text-navy-950' : 'bg-white text-navy-950'}`}>
                {msg.texto}
                <span className="block text-right text-[10px] text-black/35 mt-1">{msg.hora}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="px-4 py-3 bg-[#F0F0F0] border-t border-black/5">
          <p className="font-ui text-[10px] text-black/40 text-center">
            simulação · o disparo é agendado pelo "quando" que você escolheu
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Inicio({ estado, set }) {
  const [zap, setZap] = useState(false);
  const [aporte, setAporte] = useState(estado.aporteInformado);
  const [quizAberto, setQuizAberto] = useState(false);
  const [quizResp, setQuizResp] = useState(null);

  const proximo = OBJETIVOS.find((o) => o.id === 'protecao');
  const aposentadoria = OBJETIVOS.find((o) => o.id === 'aposentadoria');
  const tarefasAbertas = estado.tarefas.filter((t) => !t.feita);
  const feitas = estado.tarefas.filter((t) => t.feita).length;

  const concluir = (id) =>
    set({ tarefas: estado.tarefas.map((t) => (t.id === id ? { ...t, feita: !t.feita } : t)) });

  const cicloCompleto = estado.aporteInformado !== null && estado.comiteVisto;

  return (
    <div className="pt-4 space-y-5">
      <div>
        <p className="font-ui text-white/50 text-sm">Olá,</p>
        <h1 className="font-display font-semibold text-white text-2xl">{RICARDO.nome}</h1>
      </div>

      {/* HERÓI: próximo objetivo (goal-gradient — spec §10.4) */}
      <div className="rounded-module bg-white shadow-float overflow-hidden">
        <div className="px-6 pt-6 pb-5">
          <p className="font-ui text-ink-body text-xs uppercase tracking-wide mb-2">Seu próximo objetivo</p>
          <h2 className="font-display font-semibold text-navy-900 text-xl mb-1">{proximo.nome}</h2>
          <p className="font-body text-sm text-ink-body mb-4">{proximo.detalhe}</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 rounded-full bg-cream-100 overflow-hidden">
              <div className="h-full bg-score-good rounded-full" style={{ width: '50%' }} />
            </div>
            <Badge status="good">no rumo</Badge>
          </div>
        </div>
        <div className="px-6 py-3 bg-cream-100 flex items-center gap-2">
          <Icone nome="calendar" size={14} className="text-ink-body" />
          <span className="font-ui text-xs text-ink-body">previsto para o {proximo.prazo}</span>
        </div>
      </div>

      {/* Liberdade financeira embaixo, sem competir (spec §10.4) */}
      <button onClick={() => set({ telaCliente: 'jornada' })}
        className="w-full text-left rounded-card bg-white/[0.06] border border-white/10 p-5 hover:bg-white/[0.09] transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-ui text-white/45 text-xs mb-1">Sua liberdade financeira</p>
            <p className="font-display text-white text-lg">{aposentadoria.prazo}</p>
          </div>
          <Icone nome="chevron-right" size={18} className="text-white/35" />
        </div>
      </button>

      {/* ── CICLO MENSAL ───────────────────────────────────────────────────── */}
      <div className="pt-3">
        <h2 className="font-display font-semibold text-white text-lg mb-1">Seu mês de {CICLO.mesRef}</h2>
        <p className="font-body text-white/50 text-sm mb-4">Leva uns 5 minutos.</p>
      </div>

      {/* 1 · Tarefas que vencem */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-navy-900">Tarefas deste mês</h3>
          <Badge status={feitas === estado.tarefas.length ? 'good' : 'neutro'}>
            {feitas}/{estado.tarefas.length}
          </Badge>
        </div>
        <div className="space-y-2.5">
          {estado.tarefas.slice(0, 4).map((t) => (
            <div key={t.id} className="flex items-start gap-3 py-1">
              <button onClick={() => concluir(t.id)}
                className={`w-6 h-6 rounded-full border-2 shrink-0 flex items-center justify-center mt-0.5 transition-colors
                  ${t.feita ? 'bg-score-good border-score-good' : 'border-ink-line hover:border-orange-500'}`}
                aria-label={t.feita ? 'desmarcar' : 'concluir'}>
                {t.feita && <Icone nome="check" size={13} className="text-white" />}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`font-body text-sm ${t.feita ? 'text-ink-body line-through' : 'text-navy-900'}`}>{t.titulo}</p>
                <p className="font-ui text-[11px] text-ink-body mt-0.5">{t.impactoHumano}</p>
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => setZap(true)}
          className="mt-4 font-ui text-xs text-orange-600 inline-flex items-center gap-1.5 min-h-[44px]">
          <Icone nome="message-circle" size={14} /> ver como isso chega no WhatsApp
        </button>
      </Card>

      {/* 2 · Comitê — reenquadrado: o cliente dá ciência, não decide suitability */}
      <Card>
        <h3 className="font-display font-semibold text-navy-900 mb-2">Comitê de investimentos</h3>
        <p className="font-body text-sm text-ink-body leading-relaxed mb-2">{CICLO.comite.resumo}</p>
        <p className="font-ui text-[11px] text-ink-body mb-5">avaliação de {CICLO.comite.avaliadoPor}</p>
        {estado.comiteVisto ? (
          <div className="flex items-center gap-2 text-score-good font-ui text-sm">
            <Icone nome="check" size={16} /> você deu ciência
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-2.5">
            <Button size="sm" className="flex-1" onClick={() => set({ comiteVisto: true })}>Ok, entendi</Button>
            <Button size="sm" variant="secondary" className="flex-1" onClick={() => set({ comiteVisto: true })}>
              Quero falar com {CONSULTOR.primeiroNome}
            </Button>
          </div>
        )}
      </Card>

      {/* 3 · Aporte do mês — única pergunta de dado */}
      <Card>
        <h3 className="font-display font-semibold text-navy-900 mb-1">Quanto você guardou em {CICLO.mesRef}?</h3>
        <p className="font-body text-sm text-ink-body mb-5">
          Pode ser aproximado. Combinado: {brl(CICLO.aporteCombinado)}.
        </p>
        {estado.aporteInformado !== null ? (
          <div className="rounded-btn bg-cream-100 p-4">
            <p className="font-display text-navy-900 text-lg mb-2">
              {estado.aporteInformado === 0 ? 'Você não guardou este mês' : brl(estado.aporteInformado)}
            </p>
            {/* Consequência sem moralizar: fato + física + caminho de volta (spec §11.2) */}
            {estado.aporteInformado < CICLO.aporteCombinado && (
              <p className="font-body text-sm text-ink-body leading-relaxed">
                Com {brl(estado.aporteInformado)} neste mês, a data de "Aposentadoria" recua 2 meses.
                <strong className="text-navy-900"> Um aporte de {brl(1400)} a mais recoloca você na data combinada.</strong>
              </p>
            )}
            {estado.aporteInformado >= CICLO.aporteCombinado && (
              <p className="font-body text-sm text-score-good">Você está no rumo do seu plano.</p>
            )}
          </div>
        ) : (
          <>
            <InputMoedaChips valor={aporte} chips={[6000, 8000, 10000, 12000]} permiteVaria={false}
              onChange={setAporte} />
            <div className="flex gap-2.5 mt-4">
              <Button size="sm" className="flex-1" disabled={aporte === null || aporte === undefined}
                onClick={() => set({ aporteInformado: Number(aporte) || 0 })}>Confirmar</Button>
              <Button size="sm" variant="secondary" onClick={() => set({ aporteInformado: 0 })}>Não guardei</Button>
            </div>
          </>
        )}
      </Card>

      {/* 4 · Reciclagem — no MEIO do ciclo, 1 pergunta, ligada à tarefa ativa */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <Icone nome="graduation-cap" size={16} className="text-orange-600" />
          <h3 className="font-display font-semibold text-navy-900">Uma pergunta rápida</h3>
        </div>
        <p className="font-ui text-[11px] text-ink-body mb-4">ligada à tarefa que você está fazendo</p>
        {!quizAberto ? (
          <Button size="sm" variant="tertiary" onClick={() => setQuizAberto(true)}>{QUIZ_EXEMPLO.titulo}</Button>
        ) : (
          <>
            <p className="font-body text-navy-900 mb-4">{QUIZ_EXEMPLO.pergunta}</p>
            <div className="space-y-2">
              {QUIZ_EXEMPLO.opcoes.map((o, i) => {
                const escolhido = quizResp === i;
                return (
                  <button key={i} onClick={() => setQuizResp(i)} disabled={quizResp !== null}
                    className={`w-full text-left px-4 py-3 rounded-btn border font-body text-sm min-h-[44px] transition-colors
                      ${quizResp === null ? 'border-ink-line hover:border-orange-500 text-navy-900'
                        : o.correta ? 'border-score-good bg-score-good/10 text-navy-900'
                        : escolhido ? 'border-score-low bg-score-low/10 text-navy-900' : 'border-ink-line text-ink-body opacity-60'}`}>
                    {o.texto}
                  </button>
                );
              })}
            </div>
            {quizResp !== null && (
              <p className="mt-4 px-4 py-3 rounded-btn bg-cream-100 font-body text-sm text-ink-body leading-relaxed">
                {QUIZ_EXEMPLO.opcoes[quizResp].feedback}
              </p>
            )}
          </>
        )}
      </Card>

      {/* 5 · Fecho do ciclo (end da peak-end) — progresso, nunca avaliação */}
      {cicloCompleto && (
        <div className="rounded-module p-6 text-center"
          style={{ background: 'linear-gradient(135deg, #20344C 40%, #FA7A35 190%)' }}>
          <Icone nome="sparkles" size={22} className="text-white mx-auto mb-3" />
          <p className="font-display font-semibold text-white text-lg leading-snug mb-2">
            Este mês você adicionou 4 meses de autonomia à sua família.
          </p>
          <p className="font-body text-white/65 text-sm">Mês fechado. A gente se fala em setembro.</p>
        </div>
      )}

      {zap && <WhatsAppMock onFechar={() => setZap(false)} />}
    </div>
  );
}

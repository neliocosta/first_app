import React, { useState } from 'react';
import { RICARDO, OBJETIVOS, CICLO, CONSULTOR, WHATSAPP, QUIZ_EXEMPLO } from '../../data/demo.js';
import { consequenciaDoAporte, fraseDoCaminhoDeVolta, brl } from '../../calculo.js';
import { Button, Icone, Badge, Card, InputMoedaChips } from '../../components/ui.jsx';

const MES_ATUAL = 1;

function WhatsAppMock({ onFechar, consequencia }) {
  const volta = fraseDoCaminhoDeVolta(consequencia);
  return (
    <div className="fixed inset-0 z-[60] bg-black/70 flex items-end sm:items-center justify-center p-0 sm:p-6" onClick={onFechar}>
      <div className="w-full sm:max-w-sm bg-[#ECE5DD] rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-float" onClick={(e) => e.stopPropagation()}>
        <div className="bg-[#075E54] px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-orange-700 flex items-center justify-center font-display font-bold text-white text-sm">N</div>
          <div className="flex-1">
            <p className="font-ui text-white text-sm font-semibold">{CONSULTOR.nome}</p>
            <p className="font-ui text-white/70 text-[11px]">seu consultor</p>
          </div>
          <button onClick={onFechar} className="text-white/80 font-ui text-xs px-2 min-h-[44px]">fechar</button>
        </div>
        <div className="p-4 space-y-2.5 max-h-[60vh] overflow-y-auto">
          {WHATSAPP.map((msg, i) => (
            <div key={i} className={`flex ${msg.de === 'cliente' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[82%] px-3.5 py-2.5 rounded-xl font-body text-[13px] leading-relaxed shadow-sm
                ${msg.de === 'cliente' ? 'bg-[#DCF8C6] text-navy-950' : 'bg-white text-navy-950'}`}>
                {/* O remédio no WhatsApp é montado com a MESMA função da tela.
                    Só a mensagem marcada `remedio` é reescrita — a de reconhecimento
                    ("Mês apertado acontece — e você respondeu") fica intacta. */}
                {msg.remedio && volta
                  ? `Com ${brl(consequencia.aporteInformado)}, sua aposentadoria adia ${consequencia.mesesAtraso} ${consequencia.mesesAtraso === 1 ? 'mês' : 'meses'}. ${volta} Sem correria — dá para recuperar ao longo do ano. Qualquer coisa, me chama.`
                  : msg.texto}
                <span className="block text-right text-[10px] text-black/40 mt-1">{msg.hora}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="px-4 py-3 bg-[#F0F0F0] border-t border-black/5">
          <p className="font-ui text-[10px] text-black/50 text-center">
            simulação · o lembrete cai no "quando" que você escolheu em cada tarefa
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Inicio({ estado, acoes }) {
  const [zap, setZap] = useState(false);
  const [aporte, setAporte] = useState(null);
  const [editandoAporte, setEditandoAporte] = useState(false);
  const [quizAberto, setQuizAberto] = useState(false);
  const [quizResp, setQuizResp] = useState(null);

  const proximo = OBJETIVOS.find((o) => o.id === 'protecao') || OBJETIVOS[0];
  const aposentadoria = OBJETIVOS.find((o) => o.id === 'aposentadoria') || OBJETIVOS[OBJETIVOS.length - 1];

  // C2 — o ciclo é do MÊS e precisa poder fechar
  const tarefasDoMes = estado.tarefas.filter((t) => t.mes === MES_ATUAL);
  const feitasDoMes = tarefasDoMes.filter((t) => t.feita).length;
  const feitasTotal = estado.tarefas.filter((t) => t.feita).length;

  // Barra do herói derivada do progresso real (antes: width:'50%' fixo)
  const tarefasDoObjetivo = estado.tarefas.filter((t) => t.moduloId === 'protecao');
  const pctHeroi = tarefasDoObjetivo.length
    ? Math.round((tarefasDoObjetivo.filter((t) => t.feita).length / tarefasDoObjetivo.length) * 100) : 0;

  const cons = consequenciaDoAporte(estado.aporteInformado, CICLO.aporteCombinado);
  if (cons) cons.aporteInformado = estado.aporteInformado;
  const volta = fraseDoCaminhoDeVolta(cons);

  // C5 — celebração contingente: só com comportamento, e o texto vem do que ocorreu
  const cicloRespondido = estado.aporteInformado !== null && estado.comiteVisto;
  const houveComportamento = feitasDoMes > 0 || (cons && cons.emDia);
  const tarefaFechada = tarefasDoMes.find((t) => t.feita);
  const primeiraCascata = OBJETIVOS.find((o) => o.id === estado.cascata?.[0]);

  return (
    <div className="pt-4 space-y-5">
      <div>
        <p className="font-ui text-white/65 text-sm">Olá,</p>
        <h1 className="font-display font-semibold text-white text-2xl">{RICARDO.nome}</h1>
      </div>

      <div className="rounded-module bg-white shadow-float overflow-hidden">
        <div className="px-6 pt-6 pb-5">
          <p className="font-ui text-ink-body text-xs uppercase tracking-wide mb-2">Seu próximo objetivo</p>
          <h2 className="font-display font-semibold text-navy-900 text-xl mb-1">{proximo.nome}</h2>
          <p className="font-body text-sm text-ink-body mb-4">{proximo.detalhe}</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 rounded-full bg-cream-100 overflow-hidden">
              <div className="h-full bg-[#1F7A45] rounded-full transition-[width] duration-500" style={{ width: `${pctHeroi}%` }} />
            </div>
            <Badge status={pctHeroi === 100 ? 'good' : 'neutro'}>
              {tarefasDoObjetivo.filter((t) => t.feita).length}/{tarefasDoObjetivo.length} feitas
            </Badge>
          </div>
        </div>
        <div className="px-6 py-3 bg-cream-100 flex items-center gap-2">
          <Icone nome="calendar" size={14} className="text-ink-body" />
          <span className="font-ui text-xs text-ink-body">previsto para o {proximo.prazo}</span>
        </div>
      </div>

      <button onClick={() => acoes.navegar('jornada')}
        className="w-full text-left rounded-card bg-white/[0.06] border border-white/10 p-5 hover:bg-white/[0.09] transition-colors">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-ui text-white/60 text-xs mb-1">Sua liberdade financeira</p>
            <p className="font-display text-white text-lg">{aposentadoria.prazo}</p>
            <p className="font-body text-white/60 text-xs mt-1 leading-relaxed">
              a partir daí, seus investimentos pagam suas contas no lugar do trabalho
            </p>
          </div>
          <Icone nome="chevron-right" size={18} className="text-white/45 shrink-0" />
        </div>
      </button>

      <div className="pt-3">
        <h2 className="font-display font-semibold text-white text-lg mb-1">Seu mês de {CICLO.mesRef}</h2>
        <p className="font-body text-white/65 text-sm mb-4">Leva uns 5 minutos.</p>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-navy-900">Tarefas deste mês</h3>
          <Badge status={feitasDoMes === tarefasDoMes.length ? 'good' : 'neutro'}>
            {feitasDoMes}/{tarefasDoMes.length}
          </Badge>
        </div>
        <div className="space-y-2.5">
          {tarefasDoMes.map((t) => (
            <div key={t.id} className="flex items-start gap-3 py-1">
              <button onClick={() => acoes.concluirTarefa(t.id)}
                className={`w-11 h-11 -ml-2 rounded-full shrink-0 flex items-center justify-center transition-colors
                  ${t.feita ? 'text-white' : 'text-transparent'}`}
                aria-label={t.feita ? `Desmarcar ${t.titulo}` : `Concluir ${t.titulo}`}>
                <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                  ${t.feita ? 'bg-[#1F7A45] border-[#1F7A45]' : 'border-ink-line'}`}>
                  {t.feita && <Icone nome="check" size={13} className="text-white" />}
                </span>
              </button>
              <div className="flex-1 min-w-0">
                <p className={`font-body text-sm ${t.feita ? 'text-ink-body line-through' : 'text-navy-900'}`}>{t.titulo}</p>
                <p className="font-ui text-[11px] text-ink-body mt-0.5">{t.impactoHumano}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 font-ui text-[11px] text-ink-body">
          {feitasTotal} de {estado.tarefas.length} tarefas do plano inteiro já concluídas.
        </p>
        <button onClick={() => setZap(true)}
          className="mt-2 font-ui text-xs text-orange-700 inline-flex items-center gap-1.5 min-h-[44px] underline underline-offset-2">
          <Icone nome="message-circle" size={14} /> ver como isso chega no WhatsApp
        </button>
      </Card>

      <Card>
        <h3 className="font-display font-semibold text-navy-900 mb-2">Seus investimentos este mês</h3>
        <p className="font-body text-sm text-ink-body leading-relaxed mb-2">{CICLO.comite.resumo}</p>
        <p className="font-ui text-[11px] text-ink-body mb-5">quem revisou: {CICLO.comite.avaliadoPor}</p>
        {estado.comiteVisto ? (
          <div className="flex items-center gap-2 text-[#1F7A45] font-ui text-sm">
            <Icone nome="check" size={16} />
            {estado.querFalarComite ? `${CONSULTOR.primeiroNome} vai te procurar` : 'você leu'}
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-2.5">
            <Button size="sm" className="flex-1" onClick={() => acoes.darCienciaComite(false)}>Ok, entendi</Button>
            <Button size="sm" variant="secondary" className="flex-1" onClick={() => acoes.darCienciaComite(true)}>
              Quero falar com {CONSULTOR.primeiroNome}
            </Button>
          </div>
        )}
      </Card>

      <Card>
        <h3 className="font-display font-semibold text-navy-900 mb-1">Quanto você guardou em {CICLO.mesRef}?</h3>
        <p className="font-body text-sm text-ink-body mb-5">
          Pode ser aproximado. Você combinou guardar {brl(CICLO.aporteCombinado)}.
        </p>
        {estado.aporteInformado !== null && !editandoAporte ? (
          <div className="rounded-btn bg-cream-100 p-4">
            <p className="font-display text-navy-900 text-lg mb-2">
              {estado.aporteInformado === 0 ? 'Este mês não deu' : brl(estado.aporteInformado)}
            </p>
            {cons && !cons.emDia && (
              <>
                <p className="font-body text-sm text-ink-body leading-relaxed">
                  Sua aposentadoria adia {cons.mesesAtraso} {cons.mesesAtraso === 1 ? 'mês' : 'meses'}.
                  {' '}<strong className="text-navy-900">{volta}</strong>
                </p>
                {primeiraCascata && (
                  <p className="font-body text-sm text-ink-body leading-relaxed mt-2">
                    Seguimos a sua ordem: <strong className="text-navy-900">{primeiraCascata.nome}</strong> vem primeiro, como você definiu.
                  </p>
                )}
                <details className="mt-3">
                  <summary className="font-ui text-xs text-orange-700 cursor-pointer min-h-[44px] flex items-center underline underline-offset-2">
                    Como chegamos nesse número
                  </summary>
                  <p className="mt-2 font-body text-xs text-ink-body leading-relaxed">{cons.comoChegamos}</p>
                </details>
              </>
            )}
            {cons && cons.emDia && (
              <p className="font-body text-sm text-[#1F7A45]">
                {cons.quaseEmDia ? 'Praticamente o combinado — segue no rumo.' : 'Você está no rumo do seu plano.'}
              </p>
            )}
            <button onClick={() => { setEditandoAporte(true); setAporte(estado.aporteInformado); }}
              className="mt-3 font-ui text-xs text-orange-700 min-h-[44px] underline underline-offset-2">corrigir o valor</button>
          </div>
        ) : (
          <>
            <InputMoedaChips valor={aporte} chips={[2000, 6000, 10000, 12000]} permiteVaria={false} onChange={setAporte} />
            <div className="flex gap-2.5 mt-4">
              <Button size="sm" className="flex-1" disabled={aporte === null || aporte === undefined}
                onClick={() => { acoes.informarAporte(Number(aporte) || 0); setEditandoAporte(false); }}>Confirmar</Button>
              <Button size="sm" variant="secondary"
                onClick={() => { acoes.informarAporte(0); setEditandoAporte(false); }}>Este mês não deu</Button>
            </div>
          </>
        )}
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-3">
          <Icone nome="graduation-cap" size={16} className="text-orange-700" />
          <h3 className="font-display font-semibold text-navy-900">Uma pergunta rápida</h3>
        </div>
        <p className="font-ui text-[11px] text-ink-body mb-4">ligada à tarefa que você está fazendo</p>
        {!quizAberto ? (
          <Button size="sm" variant="tertiary" onClick={() => setQuizAberto(true)}>{QUIZ_EXEMPLO.titulo}</Button>
        ) : (
          <>
            <p className="font-body text-navy-900 mb-4">{QUIZ_EXEMPLO.pergunta}</p>
            <div className="space-y-2">
              {QUIZ_EXEMPLO.opcoes.map((o, i) => (
                <button key={i} onClick={() => { setQuizResp(i); if (o.correta) acoes.dominarConceito(QUIZ_EXEMPLO.conceitoId); }}
                  disabled={quizResp !== null}
                  className={`w-full text-left px-4 py-3 rounded-btn border font-body text-sm min-h-[44px] transition-colors
                    ${quizResp === null ? 'border-ink-line hover:border-orange-500 text-navy-900'
                      : o.correta ? 'border-[#1F7A45] bg-[#1F7A45]/10 text-navy-900'
                      : quizResp === i ? 'border-ink-line bg-cream-100 text-navy-900' : 'border-ink-line text-ink-body opacity-60'}`}>
                  {o.texto}
                </button>
              ))}
            </div>
            {quizResp !== null && (
              <p className="mt-4 px-4 py-3 rounded-btn bg-cream-100 font-body text-sm text-ink-body leading-relaxed">
                {QUIZ_EXEMPLO.opcoes[quizResp].feedback}
              </p>
            )}
          </>
        )}
      </Card>

      {/* Fecho contingente: o texto vem do que de fato aconteceu */}
      {cicloRespondido && (
        houveComportamento ? (
          <div className="rounded-module p-6 text-center" style={{ background: 'linear-gradient(135deg, #20344C 40%, #FA7A35 190%)' }}>
            <Icone nome="sparkles" size={22} className="text-white mx-auto mb-3" />
            <p className="font-display font-semibold text-white text-lg leading-snug mb-2">
              {tarefaFechada ? tarefaFechada.impactoHumano : 'Você guardou o combinado deste mês.'}
            </p>
            <p className="font-body text-white/75 text-sm">Mês fechado. A gente se fala em setembro.</p>
          </div>
        ) : (
          <div className="rounded-module p-6 bg-white/[0.06] border border-white/10">
            <p className="font-display text-white text-lg leading-snug mb-2">Mês registrado.</p>
            <p className="font-body text-white/70 text-sm leading-relaxed">
              Nenhuma tarefa fechou desta vez — e tudo bem. No dia 5 de setembro, quando entrar o
              próximo pró-labore, {CONSULTOR.primeiroNome} te chama por aqui.
            </p>
          </div>
        )
      )}

      {zap && <WhatsAppMock onFechar={() => setZap(false)} consequencia={cons} />}
    </div>
  );
}

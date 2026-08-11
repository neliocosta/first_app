import React, { useState } from 'react';
import { OBJETIVOS, CICLO, VAO_DE_RENDA, CONSULTOR } from '../../data/demo.js';
import { consequenciaDoAporte, fraseDoCaminhoDeVolta } from '../../calculo.js';
import { Icone, Badge, Card, Button } from '../../components/ui.jsx';

const brl = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

export default function MinhaJornada({ estado }) {
  const [aperto, setAperto] = useState(false);
  const [agendado, setAgendado] = useState(false);
  const apos = OBJETIVOS.find((o) => o.id === 'aposentadoria') || OBJETIVOS[OBJETIVOS.length - 1];
  // Mesma função do Início — o remédio não pode ter dois valores (C3)
  // Lê o aporte REAL informado no ciclo; o botão abaixo só simula quando não há dado.
  const aporteBase = estado?.aporteInformado ?? 6000;
  const cons = consequenciaDoAporte(aporteBase, CICLO.aporteCombinado);
  const volta = fraseDoCaminhoDeVolta(cons);

  const noRumo = OBJETIVOS.filter((o) => o.estado === 'noRumo').length;
  const total = OBJETIVOS.length;

  return (
    <div className="pt-4 space-y-5">
      <div>
        <h1 className="font-display font-semibold text-white text-2xl mb-1">Minha jornada</h1>
        <p className="font-body text-white/55">Como o seu plano se desenrola ao longo dos anos.</p>
      </div>

      {/* Consolidado: "estou no rumo no todo?" — soma explicada, não número opaco */}
      <div className="rounded-module bg-white shadow-float p-6">
        <p className="font-ui text-ink-body text-xs uppercase tracking-wide mb-3">No geral</p>
        <p className="font-display text-navy-900 text-xl leading-snug mb-4">
          {aperto ? `${noRumo - 1} de ${total} objetivos no rumo. 1 pede atenção.` : `${noRumo} de ${total} objetivos no rumo.`}
        </p>
        <div className="flex gap-1.5 mb-4">
          {OBJETIVOS.map((o) => (
            <div key={o.id} className="flex-1 h-2 rounded-full"
              style={{ background: aperto && o.id === 'aposentadoria' ? '#FA7A35' : '#2E9E5B' }} />
          ))}
        </div>
        <p className="font-body text-sm text-ink-body leading-relaxed mb-3">
          {aperto
            ? 'A proteção da família ficou pronta antes do prazo. A aposentadoria recuou porque você guardou menos em alguns meses. Um compensa parte do outro — e há caminho de volta.'
            : 'Seus aportes estão em dia e as tarefas dentro do prazo.'}
        </p>
        <p className="font-body text-sm text-ink-body leading-relaxed px-4 py-3 rounded-btn bg-cream-100">
          <strong className="text-navy-900">Uma peça ainda falta:</strong> entre {VAO_DE_RENDA.de} e {VAO_DE_RENDA.ate},
          de onde vem a sua renda. {CONSULTOR.primeiroNome} fecha isso na montagem do plano.
        </p>
      </div>

      {/* Linha do tempo: TODOS os objetivos na régua */}
      <div className="relative pl-7">
        <div className="absolute left-[9px] top-2 bottom-2 w-px bg-white/15" />
        <div className="space-y-4">
          {OBJETIVOS.map((o) => {
            const recuado = aperto && o.id === 'aposentadoria';
            return (
              <React.Fragment key={o.id}>
              {/* O vão de renda: o plano pede aporte depois que a fonte do aporte acaba */}
              {o.id === 'aposentadoria' && (
                <div className="relative">
                  <div className="absolute -left-7 top-5 w-[18px] h-[18px] rounded-full border-4 border-navy-950 bg-[#8A94A6]" />
                  <div className="rounded-card bg-white/[0.07] border border-dashed border-white/25 p-5">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-display font-semibold text-white">
                        De {VAO_DE_RENDA.de} a {VAO_DE_RENDA.ate}
                      </h3>
                      <Badge status="lacuna">a definir</Badge>
                    </div>
                    <p className="font-display text-white text-lg mb-3">{VAO_DE_RENDA.pergunta}</p>
                    <p className="font-body text-sm text-white/70 leading-relaxed mb-3">
                      Você vende a ótica em {VAO_DE_RENDA.de} e pretende parar em {VAO_DE_RENDA.ate}.
                      Nesses {VAO_DE_RENDA.anos} anos, os {brl(VAO_DE_RENDA.rendaQueAcaba)}/mês que hoje vêm
                      da empresa não vêm mais — e o plano continua contando com {brl(VAO_DE_RENDA.aporteQueContinua)}/mês
                      de aporte, além do seu custo de vida de {brl(VAO_DE_RENDA.custoDeVida)}/mês.
                    </p>
                    <p className="font-ui text-xs text-white/55 leading-relaxed">
                      {CONSULTOR.primeiroNome} responde isso ao montar o seu plano — depende de como a venda for feita.
                      Enquanto estiver em aberto, a data de {VAO_DE_RENDA.ate} está apoiada numa renda que já terminou.
                    </p>
                  </div>
                </div>
              )}
              <div className="relative">
                <div className="absolute -left-7 top-5 w-[18px] h-[18px] rounded-full border-4 border-navy-950"
                  style={{ background: recuado ? '#FA7A35' : o.tipo === 'evento' ? '#20344C' : '#2E9E5B' }} />
                <Card className="!p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-display font-semibold text-navy-900">{o.nome}</h3>
                    <Badge status={recuado ? 'medium' : 'good'}>{recuado ? `recuou ${cons.mesesAtraso} ${cons.mesesAtraso === 1 ? 'mês' : 'meses'}` : 'no rumo'}</Badge>
                  </div>
                  <p className="font-display text-orange-700 text-lg mb-2">
                    {recuado ? `${o.prazo} + ${cons.mesesAtraso} ${cons.mesesAtraso === 1 ? 'mês' : 'meses'}` : o.prazo}
                  </p>
                  <p className="font-body text-sm text-ink-body leading-relaxed">{o.detalhe.replace('{consultor}', CONSULTOR.primeiroNome)}</p>

                  {o.tipo === 'evento' && (
                    <div className="mt-3 px-4 py-3 rounded-btn bg-peach-100">
                      <p className="font-ui text-xs text-orange-700 leading-relaxed">
                        Liquidez estimada de {brl(o.liquidezEstimada)} entra no plano.
                      </p>
                    </div>
                  )}

                  {/* Caminho de volta: mesma tela, MESMO peso visual (gain-frame) */}
                  {recuado && (
                    <div className="mt-3 px-4 py-3 rounded-btn bg-[#1F7A45]/10 border border-[#1F7A45]/25">
                      <p className="font-body text-sm text-navy-900 leading-relaxed mb-3"><strong>{volta}</strong></p>
                      <Button size="sm" onClick={() => setAgendado(true)}>
                        {agendado ? 'Combinado — avisamos o consultor' : 'Quero recolocar a data'}
                      </Button>
                    </div>
                  )}
                </Card>
              </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Demonstra o fio aporte → data (física, não culpa) */}
      <div className="rounded-card bg-white/[0.06] border border-white/10 p-5">
        <p className="font-ui text-white/60 text-xs mb-3">simulação da demonstração</p>
        <p className="font-body text-white/70 text-sm leading-relaxed mb-4">
          Veja o que acontece com a linha do tempo quando o mês aperta — e como se volta.
        </p>
        <Button variant="ghost" size="sm" onClick={() => setAperto(!aperto)}>
          {aperto ? `Voltar ao ritmo de ${brl(CICLO.aporteCombinado)}/mês` : `Simular um mês a ${brl(aporteBase)}`}
        </Button>
      </div>

      <div className="rounded-card bg-white/[0.04] border border-white/10 p-5 flex items-center gap-3">
        <Icone nome="map" size={18} className="text-white/50" />
        <p className="font-ui text-white/60 text-xs leading-relaxed">
          Você pode desligar a visão de escalada. O plano não muda.
        </p>
      </div>
    </div>
  );
}

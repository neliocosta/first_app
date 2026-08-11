import React, { useState } from 'react';
import { OBJETIVOS, CICLO } from '../../data/demo.js';
import { Icone, Badge, Card, Button } from '../../components/ui.jsx';

const brl = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

export default function MinhaJornada() {
  const [aperto, setAperto] = useState(false);
  const apos = OBJETIVOS.find((o) => o.id === 'aposentadoria');
  const cen = apos.cenarioAperto;

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
        <p className="font-ui text-ink-body text-xs uppercase tracking-wide mb-3">No todo</p>
        <p className="font-display text-navy-900 text-xl leading-snug mb-4">
          {aperto ? `${noRumo - 1} de ${total} objetivos no rumo. 1 pede atenção.` : `${noRumo} de ${total} objetivos no rumo.`}
        </p>
        <div className="flex gap-1.5 mb-4">
          {OBJETIVOS.map((o) => (
            <div key={o.id} className="flex-1 h-2 rounded-full"
              style={{ background: aperto && o.id === 'aposentadoria' ? '#FA7A35' : '#2E9E5B' }} />
          ))}
        </div>
        <p className="font-body text-sm text-ink-body leading-relaxed">
          {aperto
            ? 'A proteção da família concluiu adiantada; a aposentadoria recuou com os meses mais curtos. Um compensa parte do outro — e há caminho de volta.'
            : 'Seus aportes estão em dia e as tarefas dentro do prazo. O plano inteiro está de pé.'}
        </p>
      </div>

      {/* Linha do tempo: TODOS os objetivos na régua */}
      <div className="relative pl-7">
        <div className="absolute left-[9px] top-2 bottom-2 w-px bg-white/15" />
        <div className="space-y-4">
          {OBJETIVOS.map((o) => {
            const recuado = aperto && o.id === 'aposentadoria';
            return (
              <div key={o.id} className="relative">
                <div className="absolute -left-7 top-5 w-[18px] h-[18px] rounded-full border-4 border-navy-950"
                  style={{ background: recuado ? '#FA7A35' : o.tipo === 'evento' ? '#20344C' : '#2E9E5B' }} />
                <Card className="!p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-display font-semibold text-navy-900">{o.nome}</h3>
                    <Badge status={recuado ? 'medium' : 'good'}>{recuado ? 'atrasou' : 'no rumo'}</Badge>
                  </div>
                  <p className="font-display text-orange-600 text-lg mb-2">
                    {recuado ? `${cen.anoRecuado}, aos 71` : o.prazo}
                  </p>
                  <p className="font-body text-sm text-ink-body leading-relaxed">{o.detalhe}</p>

                  {o.tipo === 'evento' && (
                    <div className="mt-3 px-4 py-3 rounded-btn bg-peach-100">
                      <p className="font-ui text-xs text-orange-600 leading-relaxed">
                        Liquidez estimada de {brl(o.liquidezEstimada)} entra no plano e antecipa a data da aposentadoria.
                      </p>
                    </div>
                  )}

                  {/* Caminho de volta: mesma tela, MESMO peso visual (gain-frame) */}
                  {recuado && (
                    <div className="mt-3 px-4 py-3 rounded-btn bg-score-good/10 border border-score-good/25">
                      <p className="font-body text-sm text-navy-900 leading-relaxed">
                        <strong>Um aporte extra de {brl(cen.aporteExtra)}/mês pelos próximos {cen.mesesExtra} meses
                        recoloca {apos.anoAlvo}.</strong>
                      </p>
                    </div>
                  )}
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* Demonstra o fio aporte → data (física, não culpa) */}
      <div className="rounded-card bg-white/[0.06] border border-white/10 p-5">
        <p className="font-ui text-white/45 text-xs mb-3">simulação da demonstração</p>
        <p className="font-body text-white/70 text-sm leading-relaxed mb-4">
          Veja o que acontece com a linha do tempo quando o mês aperta — e como se volta.
        </p>
        <Button variant="ghost" size="sm" onClick={() => setAperto(!aperto)}>
          {aperto ? `Voltar ao ritmo de ${brl(CICLO.aporteCombinado)}/mês` : 'Simular dois meses a R$ 6.000'}
        </Button>
      </div>

      {/* A metáfora da escalada vive AQUI e só aqui — skin separável */}
      <div className="rounded-card bg-white/[0.04] border border-white/10 p-5 flex items-center gap-3">
        <Icone nome="map" size={18} className="text-white/35" />
        <p className="font-ui text-white/40 text-xs leading-relaxed">
          A visão de escalada da jornada vive nesta tela — e pode ser desligada sem afetar o plano.
        </p>
      </div>
    </div>
  );
}

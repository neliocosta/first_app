import React from 'react';
import { MODULOS, VERTICAIS, CICLO } from '../../data/demo.js';
import { tarefasPublicaveis } from '../../store.js';
import { Icone, Badge, Card } from '../../components/ui.jsx';

export default function Plano({ estado, acoes }) {
  const visiveis = tarefasPublicaveis(estado);
  const feitas = visiveis.filter((t) => t.feita).length;
  const aderencia = estado.aporteInformado === null ? null
    : Math.min(100, Math.round((estado.aporteInformado / CICLO.aporteCombinado) * 100));

  // Inventário por vertical — nunca começa em zero (endowed progress)
  const porVertical = Object.values(VERTICAIS).map((v) => ({
    ...v,
    projetos: MODULOS.filter((m) => m.vertical?.id === v.id),
  }));
  const transversais = MODULOS.filter((m) => m.transversal);

  return (
    <div className="pt-4 space-y-5">
      <div>
        <h1 className="font-display font-semibold text-white text-2xl mb-1">Seu plano</h1>
        <p className="font-body text-white/55">O que já foi resolvido e o que segue aberto.</p>
      </div>

      {/* "No rumo do seu plano" — nunca a palavra "aderência" na tela do cliente */}
      <div className="rounded-module bg-white shadow-float p-6">
        <p className="font-ui text-ink-body text-xs uppercase tracking-wide mb-3">No rumo do seu plano</p>
        <div className="flex items-end gap-6">
          <div>
            <p className="font-display font-bold text-navy-900 text-3xl">{feitas}<span className="text-ink-body text-xl">/{visiveis.length}</span></p>
            <p className="font-ui text-xs text-ink-body mt-1">tarefas concluídas</p>
          </div>
          <div>
            <p className="font-display font-bold text-navy-900 text-3xl">
              {aderencia === null ? <span className="text-[#8A94A6] text-xl italic">a informar</span> : `${aderencia}%`}
            </p>
            <p className="font-ui text-xs text-ink-body mt-1">do aporte combinado</p>
          </div>
        </div>
        <p className="font-body text-xs text-ink-body mt-4 leading-relaxed">
          Isto mede o seu comportamento — o que você faz. O mercado não entra nesta conta.
        </p>
      </div>

      {porVertical.map((v) => (
        <Card key={v.id} className="!p-5">
          <div className="flex items-center gap-3 mb-3">
            <Icone nome={v.icone} size={18} className="text-navy-900" />
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-semibold text-navy-900">{v.rotuloHumano || v.nome}</h3>
              {v.rotuloHumano && <p className="font-ui text-[11px] text-ink-body">{v.nome}</p>}
            </div>
            {v.inerte
              ? <Badge status="lacuna">aguardando metodologia</Badge>
              : <Badge status="neutro">{v.projetos.length}</Badge>}
          </div>
          {v.inerte ? (
            <p className="font-body text-sm text-[#8A94A6] italic leading-relaxed">
              A política de investimento ainda está sendo definida pela consultoria. Esta área não gera
              tarefas até lá — e você fica sabendo, em vez de ela simplesmente não aparecer.
            </p>
          ) : (
            <div className="space-y-2.5">
              {v.projetos.map((p) => {
                const tarefas = visiveis.filter((t) => t.moduloId === p.id);
                const resolvido = tarefas.length > 0 && tarefas.every((t) => t.feita);
                return (
                  <div key={p.id} className="flex items-start gap-3">
                    <span className={`w-2 h-2 rounded-full mt-2 shrink-0 ${resolvido ? 'bg-[#1F7A45]' : 'bg-ink-line'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm text-navy-900">{p.titulo}</p>
                      <p className="font-ui text-[11px] text-ink-body mt-0.5">{p.impactoHumano}</p>
                    </div>
                    <span className="font-ui text-[11px] text-ink-body shrink-0">{resolvido ? 'resolvido' : 'aberto'}</span>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      ))}

      {transversais.map((t) => (
        <Card key={t.id} className="!p-5">
          <div className="flex items-center gap-3 mb-2">
            <Icone nome={t.icone} size={18} className="text-navy-900" />
            <h3 className="font-display font-semibold text-navy-900 flex-1">{t.titulo}</h3>
            <Badge status="neutro">transversal</Badge>
          </div>
          <p className="font-body text-sm text-ink-body">{t.subtitulo}</p>
        </Card>
      ))}

      {/* Semestral em versão vitrine */}
      <div className="rounded-card bg-white/[0.06] border border-white/10 p-5">
        <div className="flex items-center gap-2 mb-2">
          <Icone nome="calendar" size={16} className="text-white/45" />
          <p className="font-display text-white">Sua próxima reunião semestral</p>
        </div>
        <p className="font-body text-white/55 text-sm leading-relaxed">
          Em fevereiro. A pauta se monta sozinha com o que mudou no semestre — e o inventário acima
          é o protagonista da conversa.
        </p>
      </div>
    </div>
  );
}

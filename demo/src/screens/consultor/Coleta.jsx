import React, { useState } from 'react';
import { SECOES, ESTATISTICAS, camposSuitability, valorDoExame, TIPO } from '../../data/coleta.js';
import { RICARDO, CONSULTOR } from '../../data/demo.js';
import { Icone, Badge, Button } from '../../components/ui.jsx';

/** Respostas do exame do Ricardo, para demonstrar o pré-preenchimento (ILUSTRATIVO). */
const DO_EXAME = {
  q01: '3 - Neutro', q02: 6000, q03: '4-6 vezes', q04: 'Sim', q05: 'Sim', q06: 'Não',
  q07: 10000, q08: 6000, q09: 980000, q10: 180000, q11: 'Sim', q12: 100000,
  q13: ['Veículos', 'Casa', 'Imóveis Comerciais', 'Empresa / participação societária'],
  q14: ['Veículos'], q15: 1750000, q16: ['Plano de Saúde'], q17: 'Sim', q18: 320000,
  q19: 18, q20: 69, q21: 'Não', q24: 'Empresário', q25: 38000, q26: 'Sim',
  q27: 'Não acompanho, mas tenho ideia', q28: 16000, q29: 'Não',
  q30: 'Casado(a)', q31: 'Masculino', q32: '1972-03-14', q33: 'ricardo@exemplo.com',
};

/** Formata pelo TIPO do campo — nunca por heurística de tamanho (C9 da R4). */
const fmt = (v, campo) => {
  if (v === undefined || v === null) return null;
  if (Array.isArray(v)) return v.join(', ');
  if (campo?.tipo === TIPO.MOEDA) return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  return String(v);
};

export default function Coleta({ estado, acoes }) {
  const [aberta, setAberta] = useState('s01');

  const suit = camposSuitability();
  // Derivado do estado, nunca hardcoded (CFP + engenheiro R5: banner que afirma
  // um controle que nao opera e pior que a omissao).
  const suitPreenchido = !!estado?.perfilSuitability;

  return (
    <>
      <h1 className="font-display font-semibold text-navy-900 text-3xl mb-2">Coleta</h1>
      <p className="font-body text-ink-body mb-2">
        Cliente: <strong className="text-navy-900">{RICARDO.nomeCompleto}</strong> ·
        {' '}{ESTATISTICAS.secoes} seções · {ESTATISTICAS.camposFixos} campos fixos +
        {' '}{ESTATISTICAS.gruposRepetiveis} listas repetíveis
      </p>
      <p className="font-body text-ink-body mb-8">
        <strong className="text-navy-900">{ESTATISTICAS.vindosDoExame} campos já vêm respondidos do exame.</strong>
        {' '}Você não repergunta — você expande.
      </p>

      {/* Trava fiduciária — agora opera: modulosPublicaveis() filtra de fato */}
      {!suitPreenchido ? (
        <div className="rounded-card bg-peach-100 border border-orange-700/25 p-5 mb-6">
          <div className="flex gap-3 mb-4">
            <Icone nome="lock" size={18} className="text-orange-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-display font-semibold text-navy-900 mb-1">Perfil de risco ainda não preenchido</p>
              <p className="font-body text-sm text-ink-body leading-relaxed">
                Os {suit.length} campos de perfil (seção 09) estão vazios. Enquanto isso,
                <strong className="text-navy-900"> o capítulo "O que vaza em imposto" não é publicado</strong> —
                ele prescreve um PGBL, que é produto de investimento. O cliente não vê a tarefa.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 pl-8">
            <span className="font-ui text-xs text-ink-body">Definir perfil:</span>
            {['Conservador', 'Moderado', 'Arrojado'].map((perfil) => (
              <button key={perfil} onClick={() => acoes.definirPerfilSuitability(perfil)}
                className="px-4 py-2 min-h-[44px] rounded-full border border-orange-700 text-orange-700 font-ui text-sm hover:bg-orange-700 hover:text-white transition-colors">
                {perfil}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-card bg-white shadow-card p-5 mb-6 flex items-center gap-3">
          <Icone nome="check" size={18} className="text-[#1F7A45] shrink-0" />
          <p className="font-body text-sm text-ink-body flex-1">
            Perfil <strong className="text-navy-900">{estado.perfilSuitability}</strong> registrado.
            Os capítulos que dependem dele já podem ser publicados.
          </p>
          <button onClick={() => acoes.definirPerfilSuitability(null)}
            className="font-ui text-xs text-orange-700 min-h-[44px] underline underline-offset-2">limpar</button>
        </div>
      )}

      <div className="space-y-3">
        {SECOES.map((s) => {
          const campos = s.grupos.flatMap((g) => (g.repetivel ? [] : g.campos));
          const doExame = campos.filter((c) => valorDoExame(c, DO_EXAME) !== undefined);
          const obrig = campos.filter((c) => c.obrigatorio);
          const obrigOk = obrig.filter((c) => valorDoExame(c, DO_EXAME) !== undefined);
          const repetiveis = s.grupos.filter((g) => g.repetivel);
          const expandida = aberta === s.id;

          return (
            <div key={s.id} className="bg-white rounded-card shadow-card overflow-hidden">
              <button onClick={() => setAberta(expandida ? null : s.id)}
                className="w-full flex items-center gap-4 p-5 text-left hover:bg-cream-50 transition-colors min-h-[44px]">
                <span className="font-display font-bold text-ink-line text-lg w-7 shrink-0">{s.numero}</span>
                <Icone nome={s.icone} size={18} className="text-navy-900 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-display font-semibold text-navy-900">{s.titulo}</p>
                  <p className="font-ui text-xs text-ink-body mt-0.5">
                    {campos.length} campos
                    {repetiveis.length > 0 && ` · ${repetiveis.length} ${repetiveis.length === 1 ? 'lista' : 'listas'}`}
                    {obrig.length > 0 && ` · ${obrigOk.length}/${obrig.length} obrigatórios`}
                  </p>
                </div>
                {doExame.length > 0 && <Badge status="neutro">{doExame.length} do exame</Badge>}
                <Icone nome={expandida ? 'chevron-left' : 'chevron-right'} size={16} className="text-ink-body shrink-0" />
              </button>

              {expandida && (
                <div className="border-t border-ink-line px-5 py-4 space-y-5">
                  {s.grupos.map((g) => (
                    <div key={g.titulo}>
                      <div className="flex items-center gap-2 mb-3">
                        <h3 className="font-display font-semibold text-navy-900 text-sm">{g.titulo}</h3>
                        {g.repetivel && <Badge status="lacuna">lista repetível</Badge>}
                        {g.soConsultor && <Badge status="medium">só consultor</Badge>}
                      </div>
                      {g.nota && <p className="font-body text-xs text-ink-body mb-3 leading-relaxed">{g.nota}</p>}

                      {g.repetivel ? (
                        <div className="rounded-btn border border-dashed border-ink-line p-4">
                          <p className="font-ui text-xs text-ink-body mb-2">
                            {g.semItens ? `${g.semItens} · ou ` : ''}
                            adicione quantos "{g.rotuloItem}" forem necessários
                          </p>
                          <p className="font-ui text-[11px] text-ink-body opacity-70">
                            {g.campos.length} campos por item: {g.campos.slice(0, 4).map((c) => c.rotulo).join(' · ')}
                            {g.campos.length > 4 && ` · +${g.campos.length - 4}`}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {g.campos.map((c) => {
                            const valor = valorDoExame(c, DO_EXAME);
                            const temValor = valor !== undefined;
                            return (
                              <div key={c.chave}
                                className={`rounded-btn px-4 py-3 ${temValor ? 'bg-cream-100' : 'bg-white border border-ink-line'}`}>
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1 min-w-0">
                                    <p className="font-body text-sm text-navy-900">
                                      {c.rotulo}
                                      {c.obrigatorio && <span className="text-orange-700 ml-1">*</span>}
                                    </p>
                                    {temValor ? (
                                      <p className="font-display text-navy-900 text-sm mt-1">
                                        {fmt(valor, c)}{c.unidade ? ` ${c.unidade}` : ''}
                                      </p>
                                    ) : (
                                      <p className="font-ui text-xs text-[#8A94A6] italic mt-1">a preencher na reunião</p>
                                    )}
                                    {c.ajuda && <p className="font-ui text-[11px] text-ink-body mt-1">{c.ajuda}</p>}
                                  </div>
                                  {temValor && <Badge status="neutro">do exame</Badge>}
                                  {c.suitability && <Badge status="medium">suitability</Badge>}
                                  {c.sensivel && <Badge status="lacuna">sensível</Badge>}
                                </div>

                                {/* O padrão "expande, não repete" — a fala do consultor */}
                                {c.expande && !c.nota && (
                                  <p className="mt-3 px-3 py-2 rounded-btn bg-peach-100 font-body text-xs text-orange-700 leading-relaxed">
                                    <strong>{CONSULTOR.primeiroNome} diz:</strong> “{c.expande}”
                                  </p>
                                )}
                                {c.revelaSe && (
                                  <p className="mt-2 font-ui text-[11px] text-ink-body">
                                    aparece só se “{c.revelaSe.campo.split('.').pop()}” = {c.revelaSe.igual}
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Button>Finalizar coleta</Button>
        <Button variant="secondary">Salvar como nova coleta</Button>
        <span className="font-ui text-xs text-ink-body">rascunho salvo automaticamente</span>
      </div>
    </>
  );
}

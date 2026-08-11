import React, { useState } from 'react';
import { RICARDO, MODULOS, CONSULTOR, VERTICAIS } from '../../data/demo.js';
import { Marca, Icone, Badge, Button } from '../../components/ui.jsx';
import Coleta from './Coleta.jsx';

const RADAR = [
  { cliente: 'Ricardo Almeida', motivo: 'Sugestão de correção pendente', idade: '2 dias', sev: 'medium', sla: '3 dias' },
  { cliente: 'Ana Souza', motivo: 'Aporte não informado no ciclo', idade: '6 dias', sev: 'low', sla: 'vencido' },
  { cliente: 'Marcos Lima', motivo: '"Quero falar" no comitê', idade: '4 h', sev: 'low', sla: '1 dia' },
  { cliente: 'Júlia Prado', motivo: 'Tarefa vencida há 2 ciclos', idade: '38 dias', sev: 'low', sla: 'vencido' },
  { cliente: 'Carlos Nunes', motivo: '3º ciclo em silêncio — handoff', idade: '92 dias', sev: 'low', sla: 'hoje' },
  { cliente: 'Beatriz Alves', motivo: 'Divergência no reexame (campos-âncora)', idade: '1 dia', sev: 'medium', sla: '5 dias' },
];

export default function Consultor({ estado, acoes }) {
  const [aba, setAba] = useState('radar');
  const ligados = estado.modulosLigados;   // engenheiro R4: agora chega ao cliente de verdade
  const toggle = (id) => acoes.alternarModulo(id);

  return (
    <div className="min-h-screen bg-cream-50 pt-11 flex">
      {/* Sidebar navy fixa (Design System §6) */}
      <aside className="w-[240px] shrink-0 bg-navy-900 min-h-screen fixed top-11 bottom-0 left-0 py-6 px-4 hidden md:block">
        <div className="px-2 mb-8"><Marca size={22} invertido /></div>
        <nav className="space-y-1">
          {[{ id: 'radar', label: 'Radar', icone: 'bell' }, { id: 'coleta', label: 'Coleta', icone: 'file-text' },
            { id: 'devolutiva', label: 'Montar devolutiva', icone: 'folder' },
            { id: 'clientes', label: 'Clientes', icone: 'users' }].map((i) => (
            <button key={i.id} onClick={() => setAba(i.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-btn font-ui text-sm transition-colors
                ${aba === i.id ? 'bg-orange-700 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
              <Icone nome={i.icone} size={17} /> {i.label}
            </button>
          ))}
        </nav>
        <p className="absolute bottom-6 left-4 right-4 font-ui text-[11px] text-white/30">{CONSULTOR.nome}</p>
      </aside>

      <main className="flex-1 md:ml-[240px] p-6 md:p-10 max-w-5xl">
        <div className="flex gap-2 md:hidden mb-6">
          {['radar', 'coleta', 'devolutiva', 'clientes'].map((a) => (
            <button key={a} onClick={() => setAba(a)}
              className={`px-4 py-2 rounded-full font-ui text-xs capitalize min-h-[44px] ${aba === a ? 'bg-orange-700 text-white' : 'bg-white border border-ink-line text-navy-900'}`}>{a}</button>
          ))}
        </div>

        {aba === 'radar' && (
          <>
            <h1 className="font-display font-semibold text-navy-900 text-3xl mb-2">Radar</h1>
            <p className="font-body text-ink-body mb-8">
              Fila de triagem ordenada por severidade × tempo. Capacidade: 150 clientes ·
              teto diário de 12 itens. <span className="text-[#8A94A6] italic">valores de exemplo</span>
            </p>
            <div className="bg-white rounded-card shadow-card overflow-hidden overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-navy-900 text-white font-display text-xs">
                    <th className="px-5 py-3 font-semibold">Cliente</th>
                    <th className="px-5 py-3 font-semibold">Motivo</th>
                    <th className="px-5 py-3 font-semibold hidden sm:table-cell">Há</th>
                    <th className="px-5 py-3 font-semibold">SLA</th>
                  </tr>
                </thead>
                <tbody>
                  {RADAR.map((r, i) => (
                    <tr key={i} className={i % 2 ? 'bg-cream-50' : 'bg-white'}>
                      <td className="px-5 py-4 font-body text-sm text-navy-900">{r.cliente}</td>
                      <td className="px-5 py-4 font-body text-sm text-ink-body">{r.motivo}</td>
                      <td className="px-5 py-4 font-ui text-xs text-ink-body hidden sm:table-cell">{r.idade}</td>
                      <td className="px-5 py-4">
                        <Badge status={r.sla === 'vencido' ? 'low' : r.sla === 'hoje' ? 'medium' : 'good'}>{r.sla}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="font-ui text-xs text-ink-body mt-4">
              Itens que estouram o teto de espera sobem de prioridade e escalam ao admin — baixa severidade
              acumulada não vira cliente abandonado.
            </p>
          </>
        )}

        {aba === 'coleta' && <Coleta />}

        {aba === 'devolutiva' && (
          <>
            <h1 className="font-display font-semibold text-navy-900 text-3xl mb-2">Montar devolutiva</h1>
            <p className="font-body text-ink-body mb-8">
              Cliente: <strong className="text-navy-900">{RICARDO.nomeCompleto}</strong> · o motor pré-selecionou
              a proposta a partir da coleta e do desempenho no quiz. Você revisa e ajusta.
            </p>
            <div className="space-y-3">
              {MODULOS.map((m) => (
                <div key={m.id} className="bg-white rounded-card shadow-card p-5 flex items-center gap-4">
                  <Icone nome={m.icone} size={20} className="text-navy-900 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-semibold text-navy-900">{m.titulo}</p>
                    <p className="font-body text-xs text-ink-body mt-0.5">
                      {m.vertical?.nome || 'Transversal'} · {m.tarefas.length} {m.tarefas.length === 1 ? 'tarefa' : 'tarefas'}
                    </p>
                    {m.decisaoComoChegamos && (
                      <p className="font-ui text-[11px] text-orange-700 mt-1">números e decisão editáveis antes de publicar</p>
                    )}
                  </div>
                  <Badge status="good">elegível</Badge>
                  <button onClick={() => toggle(m.id)}
                    className="w-11 h-11 shrink-0 flex items-center justify-center rounded-full hover:bg-cream-100"
                    aria-label={`${ligados.includes(m.id) ? 'Desligar' : 'Ligar'} o capítulo ${m.titulo}`}>
                    <span className={`w-12 h-7 rounded-full transition-colors relative block ${ligados.includes(m.id) ? 'bg-orange-700' : 'bg-ink-line'}`}>
                      <span className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-[left] ${ligados.includes(m.id) ? 'left-6' : 'left-1'}`} />
                    </span>
                  </button>
                </div>
              ))}
              <div className="bg-white rounded-card shadow-card p-5 flex items-center gap-4 opacity-60">
                <Icone nome="trending-up" size={20} className="text-navy-900 shrink-0" />
                <div className="flex-1">
                  <p className="font-display font-semibold text-navy-900">{VERTICAIS.ATIVOS.nome}</p>
                  <p className="font-body text-xs text-ink-body mt-0.5">nenhum módulo elegível</p>
                </div>
                <Badge status="lacuna">aguardando metodologia</Badge>
              </div>
            </div>
            <div className="mt-8 flex items-center gap-3">
              <Button onClick={acoes.publicarDevolutiva}>Publicar devolutiva</Button>
              <span className="font-ui text-xs text-ink-body">{ligados.length} capítulos ligados</span>
            </div>
          </>
        )}

        {aba === 'clientes' && (
          <>
            <h1 className="font-display font-semibold text-navy-900 text-3xl mb-8">Clientes</h1>
            <div className="bg-white rounded-card shadow-card p-6">
              <p className="font-body text-ink-body">
                Visão de carteira — fora do escopo desta demonstração.
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

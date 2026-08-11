import React, { useState } from 'react';
import { RICARDO, PROVENIENCIA_ROTULO, CONSULTOR } from '../../data/demo.js';
import { Icone, Badge, Card, Button, Lacuna } from '../../components/ui.jsx';

const brl = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

export default function MinhasInformacoes({ estado, set }) {
  const [editando, setEditando] = useState(null);
  const [valor, setValor] = useState('');

  const campos = Object.entries(RICARDO.coleta);
  const patrimonio = RICARDO.coleta.ativosFinanceiros.valor + RICARDO.coleta.valorBens.valor - RICARDO.coleta.saldoDevedor.valor;

  const sugerir = (chave) => {
    set({ sugestoes: [...estado.sugestoes, { chave, valorSugerido: valor, status: 'pendente', em: new Date().toISOString() }] });
    setEditando(null); setValor('');
  };

  return (
    <div className="pt-4 space-y-5">
      <div>
        <h1 className="font-display font-semibold text-white text-2xl mb-1">Minhas informações</h1>
        <p className="font-body text-white/55">Tudo o que o seu plano usa para fazer as contas.</p>
      </div>

      <div className="rounded-module bg-white shadow-float p-6">
        <p className="font-ui text-ink-body text-xs uppercase tracking-wide mb-2">Patrimônio consolidado</p>
        <p className="font-display font-bold text-navy-900 text-3xl mb-1">{brl(patrimonio)}</p>
        <p className="font-ui text-xs text-ink-body">ativos financeiros + bens − saldo devedor</p>
      </div>

      {/* Cliente SUGERE, nunca sobrescreve (spec §7) */}
      <div className="rounded-card bg-white/[0.06] border border-white/10 p-4 flex gap-3">
        <Icone nome="lock" size={16} className="text-white/40 shrink-0 mt-0.5" />
        <p className="font-body text-white/60 text-xs leading-relaxed">
          {CONSULTOR.nome} mantém estes dados. Se algo estiver diferente, você sugere a correção
          e ele confirma — assim o seu plano não muda sozinho.
        </p>
      </div>

      <div className="space-y-2.5">
        {campos.map(([chave, c]) => {
          const sugestao = estado.sugestoes.find((s) => s.chave === chave);
          return (
            <Card key={chave} className="!p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <p className="font-body text-sm text-ink-body flex-1">{c.rotulo}</p>
                {c.prov
                  ? <Badge status={c.prov === 'declarado' ? 'neutro' : 'lacuna'}>{PROVENIENCIA_ROTULO[c.prov]}</Badge>
                  : <Badge status="lacuna">falta</Badge>}
              </div>
              <p className="font-display text-navy-900 text-lg mb-3">
                {c.valor === null ? <Lacuna /> : typeof c.valor === 'number' ? (c.valor === 0 ? brl(0) : brl(c.valor)) : c.valor}
              </p>

              {sugestao ? (
                <div className="px-4 py-2.5 rounded-btn bg-peach-100">
                  <p className="font-ui text-xs text-orange-600">
                    Sugestão enviada — {CONSULTOR.primeiroNome} vai confirmar. Entra na pauta da próxima reunião.
                  </p>
                </div>
              ) : editando === chave ? (
                <div className="flex gap-2">
                  <input value={valor} onChange={(e) => setValor(e.target.value)} autoFocus
                    placeholder="valor correto"
                    className="flex-1 px-3 py-2.5 rounded-input border border-ink-line font-ui text-sm text-navy-900 outline-none focus:border-orange-500" />
                  <Button size="sm" onClick={() => sugerir(chave)} disabled={!valor}>Enviar</Button>
                  <Button size="sm" variant="secondary" onClick={() => setEditando(null)}>×</Button>
                </div>
              ) : (
                <button onClick={() => { setEditando(chave); setValor(''); }}
                  className="font-ui text-xs text-orange-600 min-h-[44px]">Sugerir correção</button>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

import { useState, useEffect, useCallback } from 'react';
import { RICARDO, PLANO_ACAO, CASCATA_PADRAO, CONCEITOS } from './data/demo.js';

/**
 * Persistência do protótipo (spec §3.5): namespace POR CLIENTE.
 * Invariante: leitura nunca cruza o clienteAtivoId. "Reiniciar demo" limpa o namespace
 * e recarrega o seed; o switch cliente/consultor troca o perfil ativo sem apagar dados.
 */
const NS = 'nl:v1:cliente:ricardo';
const KEY = `${NS}:estado`;

const seed = () => ({
  // SessaoDemo
  atorAtivo: 'cliente',           // 'cliente' | 'consultor'
  clienteAtivoId: 'ricardo',

  // faseCliente (spec §2.2)
  fase: 'exame',                  // exame | exameConcluido | devolutiva | cicloMensal
  telaCliente: 'inicio',          // aba ativa da bottom nav

  // Exame
  respostas: {},
  indiceExame: 0,
  score: null,

  // Devolutiva
  capituloAtual: 0,
  passoCapitulo: 0,
  capitulosVistos: [],
  cascata: CASCATA_PADRAO,
  quandoPorTarefa: {},

  // Ciclo mensal
  tarefas: PLANO_ACAO.map((t, i) => ({ ...t, id: `t${i}`, feita: false })),
  aporteInformado: null,
  comiteVisto: false,
  conceitos: CONCEITOS.reduce((acc, c) => ({ ...acc, [c.id]: c.dominado }), {}),

  // Sugestões de correção (cliente sugere, nunca sobrescreve — spec §7)
  sugestoes: [],
});

function carregar() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seed();
    return { ...seed(), ...JSON.parse(raw) };
  } catch {
    return seed();
  }
}

export function useEstado() {
  const [estado, setEstado] = useState(carregar);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(estado)); } catch { /* demo: ignora quota */ }
  }, [estado]);

  const set = useCallback((patch) => {
    setEstado((e) => ({ ...e, ...(typeof patch === 'function' ? patch(e) : patch) }));
  }, []);

  /** Reiniciar demo: limpa o namespace e recarrega o seed (spec §13). */
  const reiniciar = useCallback(() => {
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith(NS))
        .forEach((k) => localStorage.removeItem(k));
    } catch { /* noop */ }
    setEstado(seed());
  }, []);

  /** Pular o exame e cair direto na devolutiva — atalho de demonstração. */
  const pularParaDevolutiva = useCallback(() => {
    set({ fase: 'devolutiva', score: RICARDO.score, capituloAtual: 0, passoCapitulo: 0 });
  }, [set]);

  return { estado, set, reiniciar, pularParaDevolutiva };
}

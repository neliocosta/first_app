import { useState, useEffect, useCallback, useMemo } from 'react';
import { RICARDO, PLANO_ACAO, CASCATA_PADRAO, CONCEITOS, MODULOS, CICLO } from './data/demo.js';

/**
 * Persistência do protótipo (spec §3.5): namespace DERIVADO do cliente ativo.
 * Rodada 4 (engenheiro): a chave agora vem de `clienteAtivoId` — o invariante de isolamento
 * passa a ser testável, em vez de afirmado em comentário.
 */
const SCHEMA_VERSAO = 2;
const nsDe = (clienteId) => `nl:v1:cliente:${clienteId}`;
const chaveDe = (clienteId) => `${nsDe(clienteId)}:estado`;

const seed = (clienteAtivoId = 'ricardo') => ({
  schemaVersao: SCHEMA_VERSAO,
  atorAtivo: 'cliente',
  clienteAtivoId,

  fase: 'exame',
  telaCliente: 'inicio',

  respostas: {},
  indiceExame: 0,
  totalExameVisto: 0,          // denominador monotônico (C1: nunca encolhe)
  score: null,

  // Devolutiva — identidade por ID, nunca por índice posicional (engenheiro R4)
  modulosLigados: MODULOS.map((m) => m.id),
  capituloAtualId: MODULOS[0].id,
  passoCapitulo: 0,
  noPlano: false,
  cascata: CASCATA_PADRAO,
  decisoes: {},                // moduloId -> 'combinado' | 'conversar'

  tarefas: PLANO_ACAO.map((t, i) => ({
    ...t, id: `${t.moduloId}:${i}`, feita: false,
    quando: t.quando || null,   // implementation intention, editável pelo cliente
  })),
  aporteInformado: null,
  comiteVisto: false,
  querFalarComite: false,
  conceitos: CONCEITOS.reduce((acc, c) => ({ ...acc, [c.id]: c.dominado }), {}),
  sugestoes: [],
  auditLog: [],
});

/** Reconcilia estado persistido com o seed novo, por ID (nunca merge cego de array). */
function migrar(salvo, base) {
  if (!salvo || salvo.schemaVersao !== SCHEMA_VERSAO) return base;
  const tarefas = base.tarefas.map((nova) => {
    const antiga = (salvo.tarefas || []).find((t) => t.id === nova.id);
    return antiga ? { ...nova, feita: antiga.feita, quando: antiga.quando ?? nova.quando } : nova;
  });
  return { ...base, ...salvo, tarefas, schemaVersao: SCHEMA_VERSAO };
}

function carregar(clienteId = 'ricardo') {
  const base = seed(clienteId);
  try {
    const raw = localStorage.getItem(chaveDe(clienteId));
    return raw ? migrar(JSON.parse(raw), base) : base;
  } catch { return base; }
}

export function useEstado() {
  const [estado, setEstado] = useState(() => carregar());
  const [erroPersistencia, setErroPersistencia] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(chaveDe(estado.clienteAtivoId), JSON.stringify(estado));
      setErroPersistencia(false);
    } catch { setErroPersistencia(true); }   // engenheiro R4: falha não é mais silenciosa
  }, [estado]);

  const aplicar = useCallback((patch, auditoria) => {
    setEstado((e) => {
      const delta = typeof patch === 'function' ? patch(e) : patch;
      const log = auditoria
        ? [...e.auditLog, { ...auditoria, ator: e.atorAtivo, em: new Date().toISOString() }]
        : e.auditLog;
      return { ...e, ...delta, auditLog: log };
    });
  }, []);

  /**
   * Ações nomeadas com escopo de ator (engenheiro R4, bloqueante).
   * A fronteira de permissão deixa de ser comentário e passa a ser estrutura:
   * cada tela recebe apenas o conjunto do ator ativo.
   */
  const acoesCliente = useMemo(() => ({
    navegar: (telaCliente) => aplicar({ telaCliente }),
    responderExame: (patch) => aplicar(patch),
    avancarDevolutiva: (patch) => aplicar(patch),
    registrarDecisao: (moduloId, decisao) =>
      aplicar((e) => ({ decisoes: { ...e.decisoes, [moduloId]: decisao } }),
        { entidade: 'decisao', entidadeId: moduloId, depois: decisao, acao: 'registrar' }),
    definirCascata: (cascata) => aplicar({ cascata }, { entidade: 'cascata', acao: 'ordenar' }),
    definirQuando: (tarefaId, quando) =>
      aplicar((e) => ({ tarefas: e.tarefas.map((t) => (t.id === tarefaId ? { ...t, quando } : t)) }),
        { entidade: 'tarefa', entidadeId: tarefaId, campo: 'quando', depois: quando, acao: 'editar' }),
    concluirTarefa: (tarefaId) =>
      aplicar((e) => ({ tarefas: e.tarefas.map((t) => (t.id === tarefaId ? { ...t, feita: !t.feita } : t)) }),
        { entidade: 'tarefa', entidadeId: tarefaId, campo: 'feita', acao: 'alternar' }),
    informarAporte: (valor) =>
      aplicar({ aporteInformado: valor }, { entidade: 'aporte', campo: CICLO.mesRef, depois: valor, acao: 'informar' }),
    darCienciaComite: (querFalar = false) =>
      aplicar({ comiteVisto: true, querFalarComite: querFalar },
        { entidade: 'comite', depois: querFalar ? 'quer falar' : 'ciência', acao: 'registrar' }),
    // Cliente SUGERE, nunca sobrescreve (spec §7)
    sugerirCorrecao: (chave, valorSugerido, valorAtual) =>
      aplicar((e) => ({
        sugestoes: [...e.sugestoes, {
          chave, valorSugerido, valorAtualNoMomento: valorAtual,
          status: 'pendente', em: new Date().toISOString(),
        }],
      }), { entidade: 'sugestao', entidadeId: chave, depois: valorSugerido, acao: 'criar' }),
    dominarConceito: (conceitoId) =>
      aplicar((e) => ({ conceitos: { ...e.conceitos, [conceitoId]: true } })),
  }), [aplicar]);

  const acoesConsultor = useMemo(() => ({
    alternarModulo: (moduloId) =>
      aplicar((e) => ({
        modulosLigados: e.modulosLigados.includes(moduloId)
          ? e.modulosLigados.filter((x) => x !== moduloId)
          : [...e.modulosLigados, moduloId],
      }), { entidade: 'modulo', entidadeId: moduloId, acao: 'alternar' }),
    publicarDevolutiva: () =>
      aplicar({ atorAtivo: 'cliente' }, { entidade: 'devolutiva', acao: 'publicar' }),
    resolverSugestao: (chave, status) =>
      aplicar((e) => ({ sugestoes: e.sugestoes.map((s) => (s.chave === chave ? { ...s, status } : s)) }),
        { entidade: 'sugestao', entidadeId: chave, depois: status, acao: 'resolver' }),
  }), [aplicar]);

  /** Controles do protótipo (fora do escopo dos dois atores). */
  const trocarAtor = useCallback((atorAtivo) => aplicar({ atorAtivo }), [aplicar]);

  const reiniciar = useCallback(() => {
    try {
      Object.keys(localStorage).filter((k) => k.startsWith('nl:')).forEach((k) => localStorage.removeItem(k));
    } catch { /* noop */ }
    setEstado(seed());
  }, []);

  const pularParaDevolutiva = useCallback(() => {
    aplicar({ fase: 'devolutiva', score: RICARDO.score, capituloAtualId: MODULOS[0].id, passoCapitulo: 0, noPlano: false });
  }, [aplicar]);

  return { estado, acoesCliente, acoesConsultor, trocarAtor, reiniciar, pularParaDevolutiva, erroPersistencia };
}

/** Limpeza de emergência usada pelo ErrorBoundary (fora da árvore React). */
export function limparTudo() {
  try {
    Object.keys(localStorage).filter((k) => k.startsWith('nl:')).forEach((k) => localStorage.removeItem(k));
  } catch { /* noop */ }
}

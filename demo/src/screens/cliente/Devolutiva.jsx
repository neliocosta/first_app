import React, { useState } from 'react';
import { MODULOS, CONSULTOR, PLANO_ACAO, OBJETIVOS, CASCATA_PADRAO } from '../../data/demo.js';
import { Button, Icone, Badge, Lacuna, BarraProgresso } from '../../components/ui.jsx';

const PROV_ROTULO = { declarado: 'você nos contou', estimado: 'nossa estimativa', validado: 'confirmado' };

/* ── Passo 1 · O conceito ─────────────────────────────────────────────────── */
function PassoConceito({ m, avancar }) {
  return (
    <>
      <div className="rounded-module overflow-hidden shadow-float mb-6 bg-black aspect-video">
        <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${m.video}`}
          title={m.titulo} allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture"
          allowFullScreen />
      </div>
      <p className="font-ui text-white/45 text-xs mb-2">{CONSULTOR.nome} explica</p>
      <h1 className="font-display font-semibold text-white text-2xl leading-snug mb-4">{m.titulo}</h1>
      <p className="font-body text-white/75 text-lg leading-relaxed mb-8">{m.conceito}</p>
      <Button className="w-full" onClick={avancar}>Ver os meus números</Button>
    </>
  );
}

/* ── Passo 2 · Os seus números ────────────────────────────────────────────── */
function PassoNumeros({ m, avancar }) {
  const [aberto, setAberto] = useState(null);
  return (
    <>
      <h1 className="font-display font-semibold text-white text-2xl mb-1">Os seus números</h1>
      <p className="font-body text-white/55 mb-7">{m.titulo}</p>

      <div className="space-y-4 mb-8">
        {m.cards.map((c, i) => (
          <div key={i} className="rounded-module bg-white shadow-float p-6">
            <div className="flex items-start justify-between gap-3 mb-3">
              <span className="font-display font-bold text-navy-900 text-3xl">{c.valor}</span>
              {c.prov
                ? <Badge status={c.prov === 'declarado' ? 'neutro' : 'lacuna'}>{PROV_ROTULO[c.prov]}</Badge>
                : <Badge status="lacuna">a levantar</Badge>}
            </div>
            <p className="font-body text-ink-body leading-relaxed mb-4">{c.titulo}</p>
            <button onClick={() => setAberto(aberto === i ? null : i)}
              className="font-ui text-sm text-orange-600 inline-flex items-center gap-1.5 min-h-[44px]">
              <Icone nome={aberto === i ? 'chevron-left' : 'chevron-right'} size={14} />
              Como chegamos nesse número
            </button>
            {aberto === i && (
              <p className="mt-2 px-4 py-3 rounded-btn bg-cream-100 font-body text-sm text-ink-body leading-relaxed">
                {c.comoChegamos}
              </p>
            )}
          </div>
        ))}
      </div>
      <Button className="w-full" onClick={avancar}>Continuar</Button>
    </>
  );
}

/* ── Passo 3 · A decisão ──────────────────────────────────────────────────── */
function PassoDecisao({ m, avancar }) {
  return (
    <>
      <p className="font-ui text-white/45 text-xs mb-3">A decisão</p>
      <div className="rounded-module bg-white shadow-float p-7 mb-8">
        <p className="font-display text-navy-900 text-xl leading-snug mb-6">{m.decisao}</p>
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-btn bg-peach-100">
          <Icone nome="target" size={17} className="text-orange-600 shrink-0" />
          <span className="font-ui text-sm text-orange-600">{m.impactoHumano}</span>
        </div>
      </div>
      <Button className="w-full" onClick={avancar}>
        {m.tarefas.length > 0 ? 'Combinado' : 'Continuar'}
      </Button>
    </>
  );
}

/* ── Passo 4 · As tarefas nascem ──────────────────────────────────────────── */
function PassoTarefas({ m, avancar, ultimo }) {
  if (m.tarefas.length === 0) {
    return (
      <>
        <h1 className="font-display font-semibold text-white text-2xl mb-4">Nada entra no seu plano por aqui</h1>
        <p className="font-body text-white/70 leading-relaxed mb-8">
          Este tema acompanha você ao longo dos meses, sempre colado à tarefa que estiver fazendo — sem virar lição de casa.
        </p>
        <Button className="w-full" onClick={avancar}>{ultimo ? 'Ver meu plano de ação' : 'Próximo capítulo'}</Button>
      </>
    );
  }
  return (
    <>
      <div className="flex items-center gap-2 mb-5">
        <Icone nome="sparkles" size={18} className="text-orange-500" />
        <span className="font-display font-semibold text-white text-lg">
          {m.tarefas.length} {m.tarefas.length === 1 ? 'tarefa entrou' : 'tarefas entraram'} no seu plano de ação
        </span>
      </div>

      <div className="space-y-3 mb-6">
        {m.tarefas.map((t, i) => (
          <div key={i} className="rounded-card bg-white shadow-float p-5">
            <p className="font-body text-navy-900 mb-2">{t.titulo}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge status="neutro">mês {t.mes}</Badge>
              {t.quando && <span className="font-ui text-xs text-ink-body">quando: {t.quando}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Frame de agência, não infantilização (spec §6.2.4) */}
      <p className="font-body text-white/55 text-sm mb-8">Já organizamos isso para você.</p>
      <Button className="w-full" onClick={avancar}>{ultimo ? 'Ver meu plano de ação' : 'Próximo capítulo'}</Button>
    </>
  );
}

/* ── Capítulo final · Seu plano de ação (spec §6.6) ───────────────────────── */
function PlanoDeAcao({ estado, set }) {
  const [cascata, setCascata] = useState(estado.cascata || CASCATA_PADRAO);
  const meses = [...new Set(PLANO_ACAO.map((t) => t.mes))].sort((a, b) => a - b);
  const nomeObj = (id) => OBJETIVOS.find((o) => o.id === id)?.nome || id;

  const mover = (i, dir) => {
    const n = [...cascata];
    const j = i + dir;
    if (j < 0 || j >= n.length) return;
    [n[i], n[j]] = [n[j], n[i]];
    setCascata(n);
  };

  return (
    <>
      <h1 className="font-display font-semibold text-white text-2xl mb-2">Seu plano de ação</h1>
      <p className="font-body text-white/60 mb-8">
        {PLANO_ACAO.length} tarefas, {new Set(PLANO_ACAO.map((t) => t.vertical?.id)).size} áreas da sua vida financeira,
        organizadas pelos próximos {meses[meses.length - 1]} meses.
      </p>

      <div className="space-y-6 mb-10">
        {meses.map((mes) => (
          <div key={mes}>
            <p className="font-ui text-white/40 text-xs uppercase tracking-wide mb-3">Mês {mes}</p>
            <div className="space-y-3">
              {PLANO_ACAO.filter((t) => t.mes === mes).map((t, i) => (
                <div key={i} className="rounded-card bg-white shadow-float p-5">
                  <p className="font-body text-navy-900 mb-3">{t.titulo}</p>
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    <Badge status="neutro">{t.vertical?.nome || 'Educação'}</Badge>
                    {t.quando && <span className="font-ui text-xs text-ink-body">quando: {t.quando}</span>}
                  </div>
                  {/* ↩ link de volta ao capítulo de origem — o porquê nunca se perde */}
                  <button onClick={() => set({ capituloAtual: MODULOS.findIndex((m) => m.id === t.moduloId), passoCapitulo: 0 })}
                    className="font-ui text-xs text-orange-600 flex items-start text-left gap-1.5 min-h-[44px]">
                    <Icone nome="corner-down-left" size={13} className="shrink-0 mt-0.5" /> por que estou fazendo isto — {t.modulo}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Cascata co-decidida — voice (spec §10.2) */}
      <div className="rounded-module bg-white shadow-float p-6 mb-8">
        <h2 className="font-display font-semibold text-navy-900 text-lg mb-2">Se o mês apertar, o que vem primeiro?</h2>
        <p className="font-body text-sm text-ink-body mb-5">
          Você decide a ordem. Quando o mês render menos do que o combinado, seguimos essa sequência — sem cobrança.
        </p>
        <div className="space-y-2">
          {cascata.map((id, i) => (
            <div key={id} className="flex items-center gap-3 px-4 py-3 rounded-btn bg-cream-100">
              <span className="font-display font-semibold text-orange-600 w-5">{i + 1}</span>
              <span className="font-body text-sm text-navy-900 flex-1">{nomeObj(id)}</span>
              <button onClick={() => mover(i, -1)} disabled={i === 0}
                className="w-9 h-9 rounded-full hover:bg-white disabled:opacity-25 flex items-center justify-center">↑</button>
              <button onClick={() => mover(i, 1)} disabled={i === cascata.length - 1}
                className="w-9 h-9 rounded-full hover:bg-white disabled:opacity-25 flex items-center justify-center">↓</button>
            </div>
          ))}
        </div>
      </div>

      <Button className="w-full" size="lg"
        onClick={() => set({ cascata, fase: 'cicloMensal', telaCliente: 'inicio' })}>
        Começar minha primeira tarefa
      </Button>
    </>
  );
}

/* ── Orquestrador ─────────────────────────────────────────────────────────── */
export default function Devolutiva({ estado, set }) {
  const { capituloAtual, passoCapitulo } = estado;
  const noPlano = capituloAtual >= MODULOS.length;
  const m = MODULOS[capituloAtual];
  const passos = [PassoConceito, PassoNumeros, PassoDecisao, PassoTarefas];
  const Passo = passos[passoCapitulo] || PassoConceito;
  const ultimo = capituloAtual === MODULOS.length - 1;

  const avancar = () => {
    if (passoCapitulo < 3) return set({ passoCapitulo: passoCapitulo + 1 });
    set({ capituloAtual: capituloAtual + 1, passoCapitulo: 0, capitulosVistos: [...estado.capitulosVistos, m.id] });
  };
  const voltar = () => {
    if (passoCapitulo > 0) return set({ passoCapitulo: passoCapitulo - 1 });
    if (capituloAtual > 0) return set({ capituloAtual: capituloAtual - 1, passoCapitulo: 3 });
  };

  const totalPassos = MODULOS.length * 4;
  const passoGlobal = noPlano ? totalPassos : capituloAtual * 4 + passoCapitulo;

  return (
    <div className="pt-4">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <button onClick={voltar} disabled={noPlano || (capituloAtual === 0 && passoCapitulo === 0)}
            className="font-ui text-xs text-white/50 inline-flex items-center gap-1 disabled:opacity-25 min-h-[44px]">
            <Icone nome="arrow-left" size={14} /> voltar
          </button>
          <span className="font-ui text-xs text-white/40">
            {noPlano ? 'capítulo final' : `capítulo ${capituloAtual + 1} de ${MODULOS.length}`}
          </span>
        </div>
        <BarraProgresso atual={passoGlobal} total={totalPassos} escura />
      </div>

      {noPlano
        ? <PlanoDeAcao estado={estado} set={set} />
        : <Passo m={m} avancar={avancar} ultimo={ultimo} />}
    </div>
  );
}

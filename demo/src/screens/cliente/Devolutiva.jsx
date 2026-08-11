import React, { useState } from 'react';
import { MODULOS, CONSULTOR, OBJETIVOS, CASCATA_PADRAO } from '../../data/demo.js';
import { Button, Icone, Badge, BarraProgresso } from '../../components/ui.jsx';

const PROV_ROTULO = { declarado: 'você nos contou', estimado: 'nossa estimativa', validado: 'confirmado' };

/* ── Passo 1 · O conceito ─────────────────────────────────────────────────── */
function PassoConceito({ m, avancar }) {
  return (
    <>
      <div className="rounded-module overflow-hidden shadow-float mb-6 bg-black aspect-video">
        <iframe className="w-full h-full" loading="lazy"
          src={`https://www.youtube-nocookie.com/embed/${m.video}`}
          referrerPolicy="strict-origin-when-cross-origin"
          title={m.titulo} allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture"
          allowFullScreen />
      </div>
      <p className="font-ui text-white/60 text-xs mb-2">{CONSULTOR.nome} explica</p>
      <h1 className="font-display font-semibold text-white text-2xl leading-snug mb-4">{m.titulo}</h1>
      <p className="font-body text-white/80 text-lg leading-relaxed mb-8">{m.conceito}</p>
      <Button className="w-full" onClick={avancar}>Ver meus números</Button>
    </>
  );
}

/* ── Passo 2 · Seus números ───────────────────────────────────────────────── */
function PassoNumeros({ m, avancar }) {
  const [aberto, setAberto] = useState(null);
  return (
    <>
      <h1 className="font-display font-semibold text-white text-2xl mb-1">Seus números</h1>
      <p className="font-body text-white/65 mb-7">{m.titulo}</p>

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
              className="font-ui text-sm text-orange-700 inline-flex items-center gap-1.5 min-h-[44px] underline underline-offset-2">
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

/* ── Passo 3 · A decisão — agora com "como chegamos" e uma segunda porta ──── */
function PassoDecisao({ m, avancar, decisao, registrar }) {
  const [aberto, setAberto] = useState(false);
  return (
    <>
      <p className="font-ui text-white/60 text-xs mb-3">A decisão</p>
      <div className="rounded-module bg-white shadow-float p-7 mb-6">
        <p className="font-display text-navy-900 text-xl leading-snug mb-5">{m.decisao}</p>

        {/* C6 — o número que custa dinheiro é auditável como qualquer outro */}
        {m.decisaoComoChegamos && (
          <>
            <button onClick={() => setAberto(!aberto)}
              className="font-ui text-sm text-orange-700 inline-flex items-center gap-1.5 min-h-[44px] underline underline-offset-2 mb-2">
              <Icone nome={aberto ? 'chevron-left' : 'chevron-right'} size={14} />
              Como chegamos nesse número
            </button>
            {aberto && (
              <p className="mb-4 px-4 py-3 rounded-btn bg-cream-100 font-body text-sm text-ink-body leading-relaxed">
                {m.decisaoComoChegamos}
              </p>
            )}
          </>
        )}

        <div className="flex items-center gap-2.5 px-4 py-3 rounded-btn bg-peach-100">
          <Icone nome="target" size={17} className="text-orange-700 shrink-0" />
          <span className="font-ui text-sm text-orange-700">{m.impactoHumano}</span>
        </div>
      </div>

      {/* C7 — decisão com uma saída só é formulário de venda, não co-decisão */}
      <div className="space-y-2.5">
        <Button className="w-full" onClick={() => { registrar('combinado'); avancar(); }}>
          {m.tarefas.length > 0 ? 'Combinado' : 'Entendi'}
        </Button>
        <Button variant="ghost" className="w-full" onClick={() => { registrar('conversar'); avancar(); }}>
          Quero conversar sobre isto antes
        </Button>
      </div>
      {decisao === 'conversar' && (
        <p className="mt-4 font-body text-sm text-white/65 leading-relaxed">
          Anotado — isto entra na pauta de {CONSULTOR.primeiroNome} como assunto a conversar, não como pendência sua.
        </p>
      )}
    </>
  );
}

/* ── Passo 4 · O impacto é o pico; as tarefas são o fecho ─────────────────── */
function PassoTarefas({ m, avancar, ultimo, decisao, tarefas, definirQuando }) {
  const [editando, setEditando] = useState(null);
  const [texto, setTexto] = useState('');

  if (m.tarefas.length === 0 || decisao === 'conversar') {
    return (
      <>
        <div className="rounded-module p-7 mb-6 text-center"
             style={{ background: 'linear-gradient(135deg, #20344C 40%, #FA7A35 190%)' }}>
          <p className="font-display font-semibold text-white text-2xl leading-snug">{m.impactoHumano}</p>
        </div>
        <p className="font-body text-white/75 leading-relaxed mb-8">
          {decisao === 'conversar'
            ? `Nada entra no seu plano por enquanto — ${CONSULTOR.primeiroNome} conversa este tema com você antes.`
            : 'Este tema acompanha você ao longo dos meses, colado à tarefa que estiver fazendo.'}
        </p>
        <Button className="w-full" onClick={avancar}>{ultimo ? 'Ver meu plano de ação' : 'Próximo capítulo'}</Button>
      </>
    );
  }

  return (
    <>
      {/* Peak: o impacto humano em destaque (psicólogo R4 — o pico não é a lista de tarefas) */}
      <div className="rounded-module p-7 mb-6 text-center"
           style={{ background: 'linear-gradient(135deg, #20344C 40%, #FA7A35 190%)' }}>
        <p className="font-display font-semibold text-white text-2xl leading-snug">{m.impactoHumano}</p>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className="font-display font-semibold text-white text-lg">
          {m.tarefas.length === 1 ? 'Uma tarefa leva você até lá' : `${m.tarefas.length} tarefas levam você até lá`}
        </span>
      </div>

      <div className="space-y-3 mb-6">
        {tarefas.map((t) => (
          <div key={t.id} className="rounded-card bg-white shadow-float p-5">
            <p className="font-body text-navy-900 mb-3">{t.titulo}</p>
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <Badge status="neutro">mês {t.mes}</Badge>
            </div>
            {/* B=MAP: o cue é autoescrito, não atribuído (psicólogo R4) */}
            {editando === t.id ? (
              <div className="flex gap-2">
                <input value={texto} onChange={(e) => setTexto(e.target.value)} autoFocus
                  placeholder="ex.: quando eu fechar o caixa do mês"
                  className="flex-1 px-3 py-2.5 rounded-input border border-ink-line font-ui text-sm text-navy-900 outline-none focus:border-orange-500" />
                <Button size="sm" onClick={() => { definirQuando(t.id, texto); setEditando(null); }} disabled={!texto}>Salvar</Button>
              </div>
            ) : (
              <button onClick={() => { setEditando(t.id); setTexto(t.quando || ''); }}
                className="font-ui text-xs text-orange-700 min-h-[44px] underline underline-offset-2">
                {t.quando ? `Quando: ${t.quando} — mudar` : 'Quando você vai fazer isto?'}
              </button>
            )}
          </div>
        ))}
      </div>

      <p className="font-body text-white/65 text-sm mb-8">
        Combinamos isto juntos. Já está no seu plano — o quando é você que escolhe.
      </p>
      <Button className="w-full" onClick={avancar}>{ultimo ? 'Ver meu plano de ação' : 'Próximo capítulo'}</Button>
    </>
  );
}

/* ── Capítulo final · Seu plano de ação ───────────────────────────────────── */
function PlanoDeAcao({ estado, acoes, modulos }) {
  const [cascata, setCascata] = useState(estado.cascata || CASCATA_PADRAO);
  const tarefas = estado.tarefas.filter((t) => modulos.some((m) => m.id === t.moduloId));
  const meses = [...new Set(tarefas.map((t) => t.mes))].sort((a, b) => a - b);
  const nomeObj = (id) => OBJETIVOS.find((o) => o.id === id)?.nome || id;

  const mover = (i, dir) => {
    const n = [...cascata]; const j = i + dir;
    if (j < 0 || j >= n.length) return;
    [n[i], n[j]] = [n[j], n[i]]; setCascata(n); acoes.definirCascata(n);
  };

  return (
    <>
      <h1 className="font-display font-semibold text-white text-2xl mb-2">Seu plano de ação</h1>
      <p className="font-body text-white/70 mb-8">
        {tarefas.length} tarefas ao longo dos próximos {meses[meses.length - 1] || 1} meses.
      </p>

      <div className="space-y-6 mb-10">
        {meses.map((mes) => (
          <div key={mes}>
            <p className="font-ui text-white/60 text-xs uppercase tracking-wide mb-3">Mês {mes}</p>
            <div className="space-y-3">
              {tarefas.filter((t) => t.mes === mes).map((t) => (
                <div key={t.id} className="rounded-card bg-white shadow-float p-5">
                  {/* Redator R4: nome humano em destaque, vertical como legenda */}
                  <p className="font-body text-navy-900 mb-1">{t.titulo}</p>
                  <p className="font-ui text-[11px] text-ink-body mb-3">{t.modulo}</p>
                  {t.quando && <p className="font-ui text-xs text-ink-body mb-3">Quando: {t.quando}</p>}
                  <button onClick={() => acoes.avancarDevolutiva({ capituloAtualId: t.moduloId, passoCapitulo: 0, noPlano: false, voltarAoPlano: true })}
                    className="font-ui text-xs text-orange-700 flex items-start text-left gap-1.5 min-h-[44px] underline underline-offset-2">
                    <Icone nome="corner-down-left" size={13} className="shrink-0 mt-0.5" /> por que estou fazendo isso
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-module bg-white shadow-float p-6 mb-8">
        <h2 className="font-display font-semibold text-navy-900 text-lg mb-2">Se o mês apertar, o que vem primeiro?</h2>
        <p className="font-body text-sm text-ink-body mb-5">
          Você decide a ordem. Quando o mês render menos do que o combinado, seguimos essa sequência — sem cobrança.
        </p>
        <div className="space-y-2">
          {cascata.map((id, i) => (
            <div key={id} className="flex items-center gap-3 px-4 py-3 rounded-btn bg-cream-100">
              <span className="font-display font-semibold text-orange-700 w-5">{i + 1}</span>
              <span className="font-body text-sm text-navy-900 flex-1">{nomeObj(id)}</span>
              <button onClick={() => mover(i, -1)} disabled={i === 0} aria-label={`Subir ${nomeObj(id)}`}
                className="w-11 h-11 rounded-full hover:bg-white disabled:opacity-25 flex items-center justify-center">↑</button>
              <button onClick={() => mover(i, 1)} disabled={i === cascata.length - 1} aria-label={`Descer ${nomeObj(id)}`}
                className="w-11 h-11 rounded-full hover:bg-white disabled:opacity-25 flex items-center justify-center">↓</button>
            </div>
          ))}
        </div>
      </div>

      <Button className="w-full" size="lg"
        onClick={() => acoes.avancarDevolutiva({ fase: 'cicloMensal', telaCliente: 'inicio' })}>
        Começar minha primeira tarefa
      </Button>
    </>
  );
}

/* ── Orquestrador — identidade por ID, respeitando os módulos ligados ─────── */
export default function Devolutiva({ estado, acoes }) {
  const modulos = MODULOS.filter((m) => estado.modulosLigados.includes(m.id));
  const idx = Math.max(0, modulos.findIndex((m) => m.id === estado.capituloAtualId));
  const m = modulos[idx];
  const { passoCapitulo, noPlano } = estado;

  if (!m && !noPlano) return null;

  const passos = [PassoConceito, PassoNumeros, PassoDecisao, PassoTarefas];
  const Passo = passos[passoCapitulo] || PassoConceito;
  const ultimo = idx === modulos.length - 1;

  const avancar = () => {
    if (passoCapitulo < 3) return acoes.avancarDevolutiva({ passoCapitulo: passoCapitulo + 1 });
    if (estado.voltarAoPlano) return acoes.avancarDevolutiva({ noPlano: true, voltarAoPlano: false });
    if (ultimo) return acoes.avancarDevolutiva({ noPlano: true });
    acoes.avancarDevolutiva({ capituloAtualId: modulos[idx + 1].id, passoCapitulo: 0 });
  };
  const voltar = () => {
    // Engenheiro R4: o link do plano não é mais um beco sem saída
    if (noPlano) return acoes.avancarDevolutiva({ noPlano: false, capituloAtualId: modulos[modulos.length - 1].id, passoCapitulo: 3 });
    if (passoCapitulo > 0) return acoes.avancarDevolutiva({ passoCapitulo: passoCapitulo - 1 });
    if (idx > 0) return acoes.avancarDevolutiva({ capituloAtualId: modulos[idx - 1].id, passoCapitulo: 3 });
  };

  const totalPassos = modulos.length * 4;
  const passoGlobal = noPlano ? totalPassos : idx * 4 + passoCapitulo;

  return (
    <div className="pt-4">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <button onClick={voltar} disabled={!noPlano && idx === 0 && passoCapitulo === 0}
            className="font-ui text-xs text-white/70 inline-flex items-center gap-1 disabled:opacity-25 min-h-[44px]">
            <Icone nome="arrow-left" size={14} /> voltar
          </button>
          <span className="font-ui text-xs text-white/60">
            {noPlano ? 'capítulo final' : `capítulo ${idx + 1} de ${modulos.length}`}
          </span>
        </div>
        <BarraProgresso atual={passoGlobal} total={totalPassos} escura reset={estado.fase} />
      </div>

      {estado.voltarAoPlano && !noPlano && (
        <button onClick={() => acoes.avancarDevolutiva({ noPlano: true, voltarAoPlano: false })}
          className="mb-5 font-ui text-xs text-orange-500 inline-flex items-center gap-1.5 min-h-[44px] underline underline-offset-2">
          <Icone nome="arrow-left" size={13} /> voltar ao meu plano de ação
        </button>
      )}

      {noPlano
        ? <PlanoDeAcao estado={estado} acoes={acoes} modulos={modulos} />
        : <Passo
            m={m} avancar={avancar} ultimo={ultimo}
            decisao={estado.decisoes[m.id]}
            registrar={(d) => acoes.registrarDecisao(m.id, d)}
            tarefas={estado.tarefas.filter((t) => t.moduloId === m.id)}
            definirQuando={acoes.definirQuando}
          />}
    </div>
  );
}

import React from 'react';
import { FAIXAS, faixaDe, DESCRICAO_PILAR } from '../data/exame.js';
import { CONSULTOR, RICARDO } from '../data/demo.js';
import { Marca, Button, Icone, ScoreAnimado, SeloDemo } from '../components/ui.jsx';

export default function Resultado({ estado, acoes }) {
  const [revelado, setRevelado] = React.useState(false);
  React.useEffect(() => {
    const reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t = setTimeout(() => setRevelado(true), reduz ? 0 : 1500);
    return () => clearTimeout(t);
  }, []);
  const score = estado.score ?? 0;
  const faixa = faixaDe(score);
  const pilares = RICARDO.pilares ?? [];

  return (
    <div className="min-h-screen bg-navy-950 pt-11">
      <header className="px-5 pt-6 flex items-center justify-between max-w-2xl mx-auto">
        <Marca size={26} invertido /><SeloDemo />
      </header>

      <main className="max-w-2xl mx-auto px-5 pt-10 pb-16">
        <div className="text-center mb-10">
          <p className="font-ui text-white/55 text-sm mb-3">Sua saúde financeira hoje</p>
          <div className="inline-flex items-baseline gap-1">
            <ScoreAnimado valor={score} size={110} />
            <span className="font-display text-white/40 text-3xl">/100</span>
          </div>
          {/* A faixa descreve a SITUAÇÃO, nunca a pessoa (princípio §9.9) */}
          <div className="mt-5 mx-auto max-w-md">
            <div className="h-2 rounded-full bg-white/10 overflow-hidden mb-4">
              <div className="h-full rounded-full transition-[width] duration-1000"
                style={{ width: `${score}%`, background: faixa.cor }} />
            </div>
            <p className="font-display font-semibold text-xl mb-2" style={{ color: faixa.cor }}>{faixa.rotulo}</p>
            <p className={`font-display text-white text-lg leading-snug transition-opacity duration-500 ${revelado ? 'opacity-100' : 'opacity-0'}`}>{faixa.texto}</p>
          </div>
        </div>

        {/* A11: cada pilar com a sua gradação e a descrição do que ele mede. */}
        <section className="mb-8">
          <h2 className="font-display font-semibold text-white text-lg mb-1">Onde você está em cada frente</h2>
          <p className="font-ui text-sm text-white/50 mb-5">
            Cinco frentes compõem o resultado. Elas descrevem a situação, não você.
          </p>

          <ul className="space-y-3">
            {pilares.map((p, i) => {
              const f = faixaDe(p.valor);
              return (
                <li key={p.nome}
                  className="rounded-card bg-white/[0.06] border border-white/10 p-4 transition-opacity duration-500"
                  style={{ opacity: revelado ? 1 : 0, transitionDelay: `${i * 90}ms` }}>
                  <div className="flex items-baseline justify-between gap-3 mb-2">
                    <span className="font-display font-semibold text-white">{p.nome}</span>
                    <span className="font-ui text-sm shrink-0" style={{ color: f.cor }}>
                      <strong className="font-semibold tabular-nums">{p.valor}</strong>
                      <span className="text-white/40"> / 100 · </span>{f.rotulo}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden mb-2.5">
                    <div className="h-full rounded-full transition-[width] duration-700 ease-out"
                      style={{ width: revelado ? `${p.valor}%` : '0%', background: f.cor }} />
                  </div>
                  <p className="font-body text-sm text-white/60 leading-relaxed">{DESCRICAO_PILAR[p.nome]}</p>
                </li>
              );
            })}
          </ul>

          {/* A escala inteira à vista: sem ela, um número solto não se interpreta. */}
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
            {FAIXAS.map((f) => (
              <span key={f.rotulo} className="inline-flex items-center gap-1.5 font-ui text-xs text-white/50">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: f.cor }} />
                {f.rotulo}
              </span>
            ))}
          </div>
        </section>

        {/* Honestidade sobre a LACUNA da fórmula (spec §4.1) */}
        <div className="rounded-card bg-white/[0.06] border border-white/10 p-5 mb-6">
          <div className="flex gap-3">
            <Icone nome="info" size={18} className="text-white/45 shrink-0 mt-0.5" />
            <p className="font-body text-sm text-white/65 leading-relaxed">
              Esta é uma <strong className="text-white/85 font-semibold">leitura inicial</strong> da sua
              saúde financeira — não um diagnóstico fechado. Ela aponta onde olhar; o aprofundamento é
              feito com o seu consultor.
            </p>
          </div>
        </div>

        {/* Diagnostica, nunca prescreve (princípio §9.1) */}
        <div className="rounded-module bg-white p-6 shadow-float mb-8">
          <h2 className="font-display font-semibold text-navy-900 text-lg mb-3">O que acontece agora</h2>
          <p className="font-body text-ink-body leading-relaxed mb-5">
            Proteção da família e sucessão são dois dos temas que <strong className="text-navy-900">{CONSULTOR.nome}</strong> vai
            aprofundar com você na conversa de resultado. Você não precisa decidir nada agora.
          </p>
          <Button className="w-full" onClick={() => acoes.avancarDevolutiva({ fase: 'devolutiva', passoCapitulo: 0, noPlano: false })}>
            Ver o que {CONSULTOR.primeiroNome} preparou para você
          </Button>
        </div>

        <p className="text-center font-ui text-xs text-white/55 leading-relaxed">
          O que entrou nesta conta: o que você tem · o que você guarda ·
          o que está protegido · o que você já sabe · o que você já fez
        </p>
      </main>
    </div>
  );
}

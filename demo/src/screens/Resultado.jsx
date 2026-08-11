import React from 'react';
import { FAIXAS } from '../data/exame.js';
import { CONSULTOR } from '../data/demo.js';
import { Marca, Button, Icone, ScoreAnimado, SeloDemo } from '../components/ui.jsx';

export default function Resultado({ estado, acoes }) {
  const [revelado, setRevelado] = React.useState(false);
  React.useEffect(() => {
    const reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t = setTimeout(() => setRevelado(true), reduz ? 0 : 1500);
    return () => clearTimeout(t);
  }, []);
  const score = estado.score ?? 0;
  const faixa = FAIXAS.find((f) => score >= f.min && score < f.max) || FAIXAS[FAIXAS.length - 1];

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
            <p className={`font-display text-white text-lg leading-snug transition-opacity duration-500 ${revelado ? 'opacity-100' : 'opacity-0'}`}>{faixa.texto}</p>
          </div>
        </div>

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

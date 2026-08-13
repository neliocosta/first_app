import React from 'react';
import { Marca, Button, Icone, SeloDemo } from '../components/ui.jsx';
import { CONSULTOR } from '../data/demo.js';

/**
 * A1 (Nélio): a aplicação abria direto no exame e o cliente ficava preso nele.
 * Esta é a porta — a trilha que diz onde ele está, qual é a próxima etapa e
 * qual é a próxima ação. Do Duolingo vem a CLAREZA do próximo passo, não a
 * linguagem visual: o contexto §9 proíbe infantilizar a tarefa adulta, e o
 * desempate estético é sóbrio sobre lúdico. Por isso nada de mascote, streak,
 * confete ou cadeado desenhado — a etapa futura é apenas quieta.
 */

const ETAPAS = [
  {
    id: 'exame',
    titulo: 'Exame de saúde financeira',
    resumo: 'Cerca de 24 perguntas sobre o que você tem, o que guarda e o que já está protegido. Leva uns 10 minutos.',
    acao: 'Começar o exame',
  },
  {
    id: 'resultado',
    titulo: 'O seu resultado',
    resumo: 'Uma leitura da sua situação em cinco frentes — onde você está firme e onde vale olhar primeiro.',
  },
  {
    id: 'devolutiva',
    titulo: `A conversa com ${CONSULTOR.primeiroNome}`,
    resumo: 'O que o exame mostrou, explicado por quem vai te acompanhar. É aqui que nascem as suas primeiras tarefas.',
  },
  {
    id: 'plano',
    titulo: 'O seu plano em movimento',
    resumo: 'Objetivos com data, o mês a mês e a projeção dos próximos anos do seu patrimônio.',
  },
];

export default function Trilha({ estado, acoes }) {
  // A trilha é a fonte da verdade sobre "onde eu estou": a etapa corrente é a
  // primeira não concluída, e só ela tem ação.
  const concluidas = estado.respostas && Object.keys(estado.respostas).length > 0 ? 1 : 0;
  const atual = Math.min(concluidas, ETAPAS.length - 1);

  return (
    <div className="min-h-screen bg-cream-50 pt-11">
      <header className="px-5 pt-6 pb-2 max-w-xl w-full mx-auto flex items-center justify-between">
        <Marca size={26} />
        <SeloDemo claro />
      </header>

      <main className="max-w-xl w-full mx-auto px-5 pt-6 pb-16">
        <h1 className="font-display font-semibold text-navy-900 text-[26px] leading-tight mb-2 text-balance">
          O seu planejamento, do começo ao fim
        </h1>
        <p className="font-body text-ink-body leading-relaxed mb-9">
          São quatro etapas. Você não precisa fazer tudo hoje — cada uma abre quando a anterior termina.
        </p>

        <ol className="relative">
          {/* A espinha da trilha: um fio contínuo atrás dos marcadores. */}
          <span aria-hidden className="absolute left-[15px] top-3 bottom-3 w-px bg-ink-line" />

          {ETAPAS.map((etapa, i) => {
            const feita = i < atual;
            const agora = i === atual;
            const futura = i > atual;

            return (
              <li key={etapa.id} className="relative pl-11 pb-7 last:pb-0">
                <span
                  aria-hidden
                  className={`absolute left-0 top-0.5 w-8 h-8 rounded-full grid place-items-center font-ui text-sm border-2 transition-colors
                    ${feita ? 'bg-score-good border-score-good text-white' : ''}
                    ${agora ? 'bg-orange-700 border-orange-700 text-white' : ''}
                    ${futura ? 'bg-cream-50 border-ink-line text-ink-body' : ''}`}
                >
                  {feita ? <Icone nome="check" size={16} /> : i + 1}
                </span>

                <h2 className={`font-display font-semibold text-lg leading-snug ${futura ? 'text-ink-body' : 'text-navy-900'}`}>
                  {etapa.titulo}
                </h2>

                {agora && (
                  <p className="font-ui text-xs uppercase tracking-wide text-orange-700 mt-1">
                    Você está aqui
                  </p>
                )}

                <p className={`font-body text-sm leading-relaxed mt-2 ${futura ? 'text-ink-body/70' : 'text-ink-body'}`}>
                  {etapa.resumo}
                </p>

                {agora && etapa.acao && (
                  <Button className="mt-4" onClick={acoes.comecarExame}>{etapa.acao}</Button>
                )}
              </li>
            );
          })}
        </ol>
      </main>
    </div>
  );
}

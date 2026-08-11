import React from 'react';
import { useEstado } from './store.js';
import { Marca, Icone, SeloDemo } from './components/ui.jsx';
import Exame from './screens/Exame.jsx';
import Resultado from './screens/Resultado.jsx';
import Devolutiva from './screens/cliente/Devolutiva.jsx';
import Inicio from './screens/cliente/Inicio.jsx';
import Plano from './screens/cliente/Plano.jsx';
import Educacao from './screens/cliente/Educacao.jsx';
import MinhasInformacoes from './screens/cliente/MinhasInformacoes.jsx';
import MinhaJornada from './screens/cliente/MinhaJornada.jsx';
import Consultor from './screens/consultor/Consultor.jsx';

const ABAS = [
  { id: 'inicio', label: 'Início', icone: 'home' },
  { id: 'plano', label: 'Plano', icone: 'folder' },
  { id: 'educacao', label: 'Educação', icone: 'graduation-cap' },
  { id: 'informacoes', label: 'Minhas informações', icone: 'file-text' },
  { id: 'jornada', label: 'Minha jornada', icone: 'map' },
];

/** Barra de controle do protótipo (spec §11: switch + reiniciar demo). */
function BarraDemo({ estado, set, reiniciar, pularParaDevolutiva }) {
  return (
    <div className="fixed top-0 inset-x-0 z-50 bg-[#0B131D] text-white/80 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 h-11 flex items-center gap-3 text-[12px] font-ui">
        <span className="hidden sm:inline text-white/45">demonstração</span>
        <div className="flex rounded-full bg-white/10 p-0.5">
          {['cliente', 'consultor'].map((a) => (
            <button key={a} onClick={() => set({ atorAtivo: a })}
              className={`px-3 py-1 rounded-full capitalize transition-colors ${estado.atorAtivo === a ? 'bg-orange-500 text-white' : 'text-white/60 hover:text-white'}`}>
              {a}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        {estado.atorAtivo === 'cliente' && estado.fase === 'exame' && (
          <button onClick={pularParaDevolutiva} className="hover:text-white transition-colors underline underline-offset-2">
            pular o exame
          </button>
        )}
        <button onClick={reiniciar} className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
          <Icone nome="rotate-ccw" size={13} /> reiniciar
        </button>
      </div>
    </div>
  );
}

/** Shell da área do cliente: navy full-bleed + bottom nav discreta (decisão do Nélio). */
function ShellCliente({ estado, set, children, semNav = false }) {
  return (
    <div className="min-h-screen bg-navy-950 pt-11">
      <header className="px-5 pt-6 pb-2 flex items-center justify-between max-w-2xl mx-auto">
        <Marca size={26} invertido />
        <SeloDemo />
      </header>
      <main className={`max-w-2xl mx-auto px-5 ${semNav ? 'pb-12' : 'pb-28'}`}>{children}</main>

      {!semNav && (
        <nav className="fixed bottom-0 inset-x-0 bg-[#0F1926]/95 backdrop-blur border-t border-white/10 z-40">
          <div className="max-w-2xl mx-auto flex">
            {ABAS.map((a) => {
              const ativo = estado.telaCliente === a.id;
              return (
                <button key={a.id} onClick={() => set({ telaCliente: a.id })}
                  className="flex-1 flex flex-col items-center gap-1 py-2.5 min-h-[56px] transition-colors"
                  aria-current={ativo ? 'page' : undefined}>
                  <Icone nome={a.icone} size={20} className={ativo ? 'text-orange-500' : 'text-white/45'} />
                  <span className={`text-[10px] font-ui leading-tight text-center px-0.5 ${ativo ? 'text-orange-500' : 'text-white/45'}`}>
                    {a.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}

export default function App() {
  const { estado, set, reiniciar, pularParaDevolutiva } = useEstado();

  const barra = <BarraDemo estado={estado} set={set} reiniciar={reiniciar} pularParaDevolutiva={pularParaDevolutiva} />;

  if (estado.atorAtivo === 'consultor') {
    return <>{barra}<Consultor estado={estado} set={set} /></>;
  }

  // Exame: tela cheia, sem bottom nav (foco de tarefa única — spec §2.1)
  if (estado.fase === 'exame') {
    return <>{barra}<Exame estado={estado} set={set} /></>;
  }
  if (estado.fase === 'exameConcluido') {
    return <>{barra}<Resultado estado={estado} set={set} /></>;
  }
  if (estado.fase === 'devolutiva') {
    return <>{barra}<ShellCliente estado={estado} set={set} semNav><Devolutiva estado={estado} set={set} /></ShellCliente></>;
  }

  const telas = {
    inicio: Inicio, plano: Plano, educacao: Educacao,
    informacoes: MinhasInformacoes, jornada: MinhaJornada,
  };
  const Tela = telas[estado.telaCliente] || Inicio;

  return (
    <>
      {barra}
      <ShellCliente estado={estado} set={set}><Tela estado={estado} set={set} /></ShellCliente>
    </>
  );
}

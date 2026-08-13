import React from 'react';
import { useEstado } from './store.js';
import { Marca, Icone, SeloDemo } from './components/ui.jsx';
import Trilha from './screens/Trilha.jsx';
import Exame from './screens/Exame.jsx';
import Resultado from './screens/Resultado.jsx';
import Devolutiva from './screens/cliente/Devolutiva.jsx';
import Inicio from './screens/cliente/Inicio.jsx';
import Plano from './screens/cliente/Plano.jsx';
import Educacao from './screens/cliente/Educacao.jsx';
import MinhasInformacoes from './screens/cliente/MinhasInformacoes.jsx';
import MinhaJornada from './screens/cliente/MinhaJornada.jsx';
import Evolucao from './screens/Evolucao.jsx';
import Consultor from './screens/consultor/Consultor.jsx';

const ABAS = [
  { id: 'inicio', label: 'Início', icone: 'home' },
  { id: 'plano', label: 'Plano', icone: 'folder' },
  { id: 'educacao', label: 'Educação', icone: 'graduation-cap' },
  { id: 'informacoes', label: 'Minhas informações', icone: 'file-text' },
  { id: 'evolucao', label: 'Patrimônio', icone: 'trending-up' },
  { id: 'jornada', label: 'Minha jornada', icone: 'map' },
];

/** Barra de controle do protótipo (spec §11: switch + reiniciar demo). */
function BarraDemo({ estado, trocarAtor, reiniciar, pularParaDevolutiva }) {
  return (
    <div className="fixed top-0 inset-x-0 z-50 bg-[#0B131D] text-white/80 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 h-11 flex items-center gap-3 text-[12px] font-ui">
        <span className="hidden sm:inline text-white/45">demonstração</span>
        <div className="flex rounded-full bg-white/10 p-0.5">
          {['cliente', 'consultor'].map((a) => (
            <button key={a} onClick={() => trocarAtor(a)}
              className={`px-3 py-1 rounded-full capitalize transition-colors min-h-[44px] ${estado.atorAtivo === a ? 'bg-orange-700 text-white' : 'text-white/70 hover:text-white'}`}>
              {a}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        {estado.atorAtivo === 'cliente' && ['trilha', 'exame'].includes(estado.fase) && (
          <button onClick={pularParaDevolutiva} className="hover:text-white transition-colors underline underline-offset-2 min-h-[44px] px-1">
            pular o exame
          </button>
        )}
        <button onClick={reiniciar} className="inline-flex items-center gap-1.5 hover:text-white transition-colors min-h-[44px] px-1">
          <Icone nome="rotate-ccw" size={13} /> reiniciar
        </button>
      </div>
    </div>
  );
}

/** Shell da área do cliente: navy full-bleed + bottom nav discreta (decisão do Nélio). */
function ShellCliente({ estado, navegar, children, semNav = false, largo = false }) {
  const faixa = largo ? 'max-w-6xl' : 'max-w-2xl';
  return (
    <div className="min-h-screen bg-navy-950 pt-11">
      <header className={`px-5 pt-6 pb-2 flex items-center justify-between ${faixa} mx-auto`}>
        <Marca size={26} invertido />
        <SeloDemo />
      </header>
      <main className={`${faixa} mx-auto px-5 ${semNav ? 'pb-12' : 'pb-28'}`}>{children}</main>

      {!semNav && (
        <nav className="fixed bottom-0 inset-x-0 bg-[#0F1926]/95 backdrop-blur border-t border-white/10 z-40">
          <div className="max-w-2xl mx-auto flex">
            {ABAS.map((a) => {
              const ativo = estado.telaCliente === a.id;
              return (
                <button key={a.id} onClick={() => navegar(a.id)}
                  className="flex-1 flex flex-col items-center gap-1 py-2.5 min-h-[56px] transition-colors"
                  aria-current={ativo ? 'page' : undefined}>
                  <Icone nome={a.icone} size={20} className={ativo ? 'text-orange-500' : 'text-white/70'} />
                  <span className={`text-[11px] font-ui leading-tight text-center px-0.5 ${ativo ? 'text-orange-500' : 'text-white/70'}`}>
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
  const { estado, acoesCliente, acoesConsultor, trocarAtor, reiniciar, pularParaDevolutiva, erroPersistencia } = useEstado();

  const barra = <BarraDemo estado={estado} trocarAtor={trocarAtor} reiniciar={reiniciar} pularParaDevolutiva={pularParaDevolutiva} />;
  const aviso = erroPersistencia ? (
    <div className="fixed bottom-20 inset-x-4 z-50 rounded-btn bg-[#B03636] text-white px-4 py-3 font-ui text-xs">
      Não foi possível salvar no navegador — o progresso desta sessão pode se perder.
    </div>
  ) : null;

  // Cada ator recebe APENAS o seu conjunto de ações (fronteira em código, não em comentário)
  if (estado.atorAtivo === 'consultor') {
    return <>{barra}<Consultor estado={estado} acoes={acoesConsultor} />{aviso}</>;
  }

  if (estado.fase === 'trilha') {
    return <>{barra}<Trilha estado={estado} acoes={acoesCliente} />{aviso}</>;
  }
  if (estado.fase === 'exame') {
    return <>{barra}<Exame estado={estado} acoes={acoesCliente} />{aviso}</>;
  }
  if (estado.fase === 'exameConcluido') {
    return <>{barra}<Resultado estado={estado} acoes={acoesCliente} />{aviso}</>;
  }
  if (estado.fase === 'devolutiva') {
    return <>{barra}
      <ShellCliente estado={estado} navegar={acoesCliente.navegar} semNav>
        <Devolutiva estado={estado} acoes={acoesCliente} />
      </ShellCliente>{aviso}</>;
  }

  const telas = {
    inicio: Inicio, plano: Plano, educacao: Educacao,
    informacoes: MinhasInformacoes, jornada: MinhaJornada, evolucao: Evolucao,
  };
  const Tela = telas[estado.telaCliente] || Inicio;

  return (
    <>
      {barra}
      <ShellCliente estado={estado} navegar={acoesCliente.navegar} largo={estado.telaCliente === 'evolucao'}>
        <Tela estado={estado} acoes={acoesCliente} />
      </ShellCliente>
      {aviso}
    </>
  );
}

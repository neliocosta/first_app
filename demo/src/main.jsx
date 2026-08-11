import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { limparTudo } from './store.js';
import './index.css';

/** Engenheiro R4: sem isto, uma exceção com estado persistido = tela branca irrecuperável,
 *  porque o botão "reiniciar" mora dentro da árvore que quebrou. */
class ErrorBoundary extends React.Component {
  constructor(p) { super(p); this.state = { erro: null }; }
  static getDerivedStateFromError(erro) { return { erro }; }
  render() {
    if (!this.state.erro) return this.props.children;
    return (
      <div style={{ minHeight: '100vh', background: '#131F2E', color: '#fff', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: 'Montserrat, sans-serif' }}>
        <div style={{ maxWidth: 420 }}>
          <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 22, marginBottom: 12 }}>Algo saiu do lugar</h1>
          <p style={{ color: 'rgba(255,255,255,.65)', lineHeight: 1.6, marginBottom: 24 }}>
            A demonstração encontrou um estado inesperado. Reiniciar limpa os dados salvos no
            navegador e recomeça do zero.
          </p>
          <button onClick={() => { limparTudo(); location.reload(); }}
            style={{ background: '#C2410C', color: '#fff', border: 0, borderRadius: 999,
                     padding: '14px 28px', fontSize: 16, fontWeight: 600, cursor: 'pointer', minHeight: 44 }}>
            Reiniciar demonstração
          </button>
        </div>
      </div>
    );
  }
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode><ErrorBoundary><App /></ErrorBoundary></React.StrictMode>
);

import React, { useEffect, useRef, useState } from 'react';

/* ── Marca ───────────────────────────────────────────────────────────────── */
/** Símbolo Nord recriado em SVG (anel com gradiente laranja + rosa dos ventos).
 *  Substituir por public/assets/logo/*.png quando os arquivos oficiais entrarem. */
export function Marca({ size = 32, invertido = false }) {
  const id = React.useId();
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden>
        <defs>
          <linearGradient id={id} x1="20%" y1="100%" x2="80%" y2="0%">
            <stop offset="0%" stopColor="#B54A0C" /><stop offset="55%" stopColor="#E06600" /><stop offset="100%" stopColor="#F5A93C" />
          </linearGradient>
        </defs>
        <path d="M50 4a46 46 0 1 1 0 92 46 46 0 0 1 0-92Zm0 22a24 24 0 1 0 0 48 24 24 0 0 0 0-48Z" fill={`url(#${id})`} />
        <rect x="46" y="2" width="8" height="26" fill={invertido ? '#131F2E' : '#FFF'} />
        {!invertido && <path d="M50 22 55 45 78 50 55 55 50 78 45 55 22 50 45 45Z" fill="#131F2E" />}
      </svg>
      <span className={`font-display font-bold tracking-tight ${invertido ? 'text-white' : 'text-navy-900'}`}
            style={{ fontSize: size * 0.5 }}>
        NORD <span className="font-normal opacity-80">Liberta</span>
      </span>
    </span>
  );
}

/* ── Button ──────────────────────────────────────────────────────────────── */
export function Button({ variant = 'primary', size = 'md', icon, children, className = '', ...rest }) {
  const sizes = { sm: 'px-4 py-2 text-sm', md: 'px-6 py-3 text-base', lg: 'px-7 py-[15px] text-lg' };
  const variants = {
    primary: 'bg-orange-700 text-white rounded-full hover:brightness-110',
    secondary: 'bg-white text-navy-900 border border-ink-line rounded-btn hover:brightness-95',
    tertiary: 'bg-peach-100 text-orange-700 rounded-btn font-display hover:brightness-95',
    ghost: 'bg-white/10 text-white rounded-btn hover:bg-white/[0.16] border border-white/15',
  };
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-ui font-semibold transition-[background-color,opacity,transform] duration-150 active:scale-[.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] ${sizes[size]} ${variants[variant]} ${className}`}
      {...rest}
    >
      {icon}{children}
    </button>
  );
}

/* ── Badge ───────────────────────────────────────────────────────────────── */
export function Badge({ status = 'good', children, className = '' }) {
  const cores = {
    good: 'bg-[#1F7A45]', medium: 'bg-orange-700', low: 'bg-[#B03636]',
    neutro: 'bg-navy-900', lacuna: 'bg-[#8A94A6]',
  };
  return (
    <span className={`inline-flex items-center shrink-0 whitespace-nowrap px-3.5 py-1 rounded-full font-display font-semibold text-xs text-white tracking-[.02em] ${cores[status]} ${className}`}>
      {children}
    </span>
  );
}

/* ── Card ────────────────────────────────────────────────────────────────── */
export function Card({ children, flutuante = false, className = '', ...rest }) {
  return (
    <div className={`bg-white rounded-card p-6 ${flutuante ? 'shadow-float' : 'shadow-card'} ${className}`} {...rest}>
      {children}
    </div>
  );
}

/** Card de módulo: header navy com gradiente laranja sangrando + ícone branco. */
export function CardModulo({ icone, titulo, children, onClick, className = '' }) {
  return (
    <div onClick={onClick}
      className={`bg-white rounded-module shadow-module overflow-hidden ${onClick ? 'cursor-pointer active:scale-[.99] transition-transform' : ''} ${className}`}>
      <div className="h-[110px] flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #20344C 60%, #FA7A35 145%)' }}>
        <Icone nome={icone} size={40} className="text-white" strokeWidth={1.5} />
      </div>
      <div className="p-6">
        {titulo && <h3 className="font-display font-semibold text-navy-900 text-lg mb-2">{titulo}</h3>}
        {children}
      </div>
    </div>
  );
}

/* ── Ícones (Lucide, conforme Design System §4) ──────────────────────────── */
import {
  Wallet, Shield, Home, PiggyBank, TrendingUp, Folder, BarChart2, User, Users, Settings,
  LogOut, Bell, Receipt, CreditCard, GraduationCap, Map, FileText, Check, ChevronRight,
  ChevronLeft, Play, MessageCircle, AlertCircle, Sparkles, CalendarDays, ArrowLeft, RotateCcw,
  CornerDownLeft, Info, Lock, Target,
  CirclePlus, CircleMinus, Repeat, ArrowUpFromLine, Infinity as InfinityIcon, BatteryLow,
  Percent, ArrowLeftRight, ZoomIn, ZoomOut, Move, Layers, Landmark, Building2, Coins,
  Undo2, SlidersHorizontal, ChevronDown, Pointer, Maximize2,
} from 'lucide-react';

const ICONES = {
  'calendar-days': CalendarDays,
  'circle-plus': CirclePlus, 'circle-minus': CircleMinus, repeat: Repeat,
  'arrow-up-from-line': ArrowUpFromLine, infinity: InfinityIcon, 'battery-low': BatteryLow,
  percent: Percent, 'arrow-left-right': ArrowLeftRight, 'zoom-in': ZoomIn, 'zoom-out': ZoomOut,
  move: Move, layers: Layers, landmark: Landmark, building: Building2, coins: Coins,
  undo: Undo2, sliders: SlidersHorizontal, 'chevron-down': ChevronDown, pointer: Pointer,
  maximize: Maximize2,
  wallet: Wallet, shield: Shield, home: Home, 'piggy-bank': PiggyBank, 'trending-up': TrendingUp,
  folder: Folder, 'bar-chart-2': BarChart2, user: User, users: Users, settings: Settings,
  'log-out': LogOut, bell: Bell, receipt: Receipt, 'credit-card': CreditCard,
  'graduation-cap': GraduationCap, map: Map, 'file-text': FileText, check: Check,
  'chevron-right': ChevronRight, 'chevron-left': ChevronLeft, play: Play,
  'message-circle': MessageCircle, 'alert-circle': AlertCircle, sparkles: Sparkles,
  calendar: CalendarDays, 'arrow-left': ArrowLeft, 'rotate-ccw': RotateCcw,
  'corner-down-left': CornerDownLeft, info: Info, lock: Lock, target: Target,
};

export function Icone({ nome, size = 24, className = '', strokeWidth = 1.75 }) {
  const C = ICONES[nome] || Info;
  return <C size={size} className={className} strokeWidth={strokeWidth} aria-hidden />;
}

/* ── Input de moeda ────────────────────────────────────────────────────────
 * A5 (Nélio): nenhuma pergunta usa valor pré-determinado. Os chips de atalho
 * induziam resposta preguiçosa e não realista — foram removidos daqui e do
 * dado, sem exceção.
 * A4 (Nélio): quem responde "varia muito" precisa dizer DE QUANTO ATÉ QUANTO.
 * O valor vira { min, max } em vez da string 'varia', que não informava nada. */
export function InputMoedaChips({ valor, onChange, permiteVaria = true }) {
  // Rodada 4 (engenheiro): estado derivado do valor — antes um useState interno vazava
  // entre perguntas e renderizava NaN ao voltar.
  const varia = valor !== null && typeof valor === 'object';
  const numerico = typeof valor === 'number' ? valor : null;
  const soDigitos = (t) => Number(String(t).replace(/\D/g, '')) || 0;
  const ptBR = (n) => (n ? n.toLocaleString('pt-BR') : '');

  const campo =
    'w-full pl-12 pr-4 py-3.5 rounded-input border border-ink-line bg-white font-ui text-lg ' +
    'text-navy-900 outline-none focus:border-orange-500 focus-visible:ring-2 focus-visible:ring-orange-500';

  return (
    <div className="space-y-4">
      {varia ? (
        <div className="space-y-3">
          {[
            ['min', 'De, nos meses mais baixos'],
            ['max', 'Até, nos meses mais altos'],
          ].map(([campoNome, rotulo]) => (
            <label key={campoNome} className="block">
              <span className="font-ui text-sm text-ink-body mb-1.5 block">{rotulo}</span>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-ui text-ink-body">R$</span>
                <input
                  inputMode="numeric" value={ptBR(valor[campoNome])}
                  onChange={(e) => onChange({ ...valor, [campoNome]: soDigitos(e.target.value) })}
                  placeholder="0" className={campo}
                />
              </div>
            </label>
          ))}
        </div>
      ) : (
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-ui text-ink-body">R$</span>
          <input
            inputMode="numeric"
            value={numerico === null ? '' : numerico.toLocaleString('pt-BR')}
            onChange={(e) => onChange(soDigitos(e.target.value))}
            placeholder="0" className={campo}
          />
        </div>
      )}

      {permiteVaria && (
        <button type="button" onClick={() => onChange(varia ? null : { min: 0, max: 0 })}
          className={`px-4 py-2.5 rounded-full font-ui text-sm border transition-colors min-h-[44px]
            ${varia ? 'bg-navy-900 text-white border-navy-900' : 'bg-white text-ink-body border-ink-line hover:border-navy-900'}`}>
          {varia ? 'Informar um valor único' : 'Varia muito'}
        </button>
      )}
    </div>
  );
}

/* ── Idade ────────────────────────────────────────────────────────────────
 * A9 (Nélio): era <input type="number"> e a roda do mouse alterava o valor
 * imputado sem o cliente perceber. Agora o número não é editável pela roda —
 * os botões − e + são o único caminho, mais digitação direta. */
export function InputIdade({ valor, onChange, min = 0, max = 120 }) {
  const n = Number(valor) || 0;
  const passo = (d) => onChange(String(Math.min(max, Math.max(min, n + d))));
  const botao =
    'w-12 h-12 shrink-0 rounded-input border border-ink-line bg-white text-navy-900 ' +
    'font-ui text-xl leading-none outline-none hover:border-orange-500 ' +
    'focus-visible:ring-2 focus-visible:ring-orange-500 disabled:opacity-40';

  return (
    <div className="flex items-center gap-3">
      <input
        inputMode="numeric" value={valor || ''}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 3))}
        onWheel={(e) => e.currentTarget.blur()}
        placeholder="0"
        className="flex-1 min-w-0 px-4 py-3.5 rounded-input border border-ink-line bg-white font-ui text-lg text-navy-900 outline-none focus:border-orange-500 focus-visible:ring-2 focus-visible:ring-orange-500"
      />
      <span className="font-ui text-sm text-ink-body shrink-0">anos</span>
      <button type="button" onClick={() => passo(-1)} disabled={n <= min} className={botao} aria-label="Diminuir um ano">−</button>
      <button type="button" onClick={() => passo(1)} disabled={n >= max} className={botao} aria-label="Aumentar um ano">+</button>
    </div>
  );
}

/* ── Barra de progresso adaptativa (nunca retrocede — goal-gradient) ─────── */
export function BarraProgresso({ atual, total, escura = false, reset }) {
  const pico = useRef(0);
  const ancora = useRef(reset);
  if (ancora.current !== reset) { ancora.current = reset; pico.current = 0; }
  const pct = total > 0 ? Math.round((atual / total) * 100) : 0;
  pico.current = Math.max(pico.current, pct);
  return (
    <div className={`h-1.5 w-full rounded-full overflow-hidden ${escura ? 'bg-white/15' : 'bg-ink-line'}`}>
      <div className="h-full bg-orange-500 rounded-full transition-[width] duration-500 ease-out"
        style={{ width: `${pico.current}%` }} />
    </div>
  );
}

/* ── Score com smart animate (respeita prefers-reduced-motion) ───────────── */
export function ScoreAnimado({ valor, size = 120 }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduz) { setN(valor); return; }
    let raf, t0;
    const dur = 1400;
    const passo = (t) => {
      if (!t0) t0 = t;
      const p = Math.min((t - t0) / dur, 1);
      setN(Math.round(valor * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(passo);
    };
    raf = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(raf);
  }, [valor]);
  return <span className="font-display font-bold text-white tabular-nums" style={{ fontSize: size }}>{n}</span>;
}

/* ── Selo "dados de demonstração" ────────────────────────────────────────── */
/** `claro` = sobre fundo claro. Sem ele o selo era branco sobre creme, e sumia. */
export function SeloDemo({ className = '', claro = false }) {
  const tema = claro
    ? 'bg-cream-100 border-ink-line text-ink-body'
    : 'bg-white/10 border-white/15 text-white/70';
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-ui text-[11px] ${tema} ${className}`}>
      <Icone nome="info" size={12} /> dados de demonstração
    </span>
  );
}

/** Marcação de lacuna: nunca zero, sempre cinza declarado (spec §9 princípio 4). */
export function Lacuna({ children = 'ainda não informado' }) {
  return <span className="text-[#8A94A6] font-ui italic">{children}</span>;
}

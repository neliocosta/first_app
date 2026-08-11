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
} from 'lucide-react';

const ICONES = {
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

/* ── Input de moeda com chips (componente prioritário — spec §14) ────────── */
export function InputMoedaChips({ valor, onChange, chips = [], permiteVaria = true }) {
  // Rodada 4 (engenheiro): estado derivado do valor — antes um useState interno vazava
  // entre perguntas e renderizava NaN ao voltar.
  const varia = valor === 'varia';
  const numerico = typeof valor === 'number' ? valor : null;
  const fmt = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

  return (
    <div className="space-y-4">
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-ui text-ink-body">R$</span>
        <input
          inputMode="numeric" disabled={varia}
          value={numerico === null ? '' : numerico.toLocaleString('pt-BR')}
          onChange={(e) => onChange(Number(e.target.value.replace(/\D/g, '')) || 0)}
          placeholder="0"
          className="w-full pl-12 pr-4 py-3.5 rounded-input border border-ink-line bg-white font-ui text-lg text-navy-900 outline-none focus:border-orange-500 disabled:opacity-50"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {chips.map((c) => (
          <button key={c} type="button" onClick={() => onChange(c)}
            className={`px-4 py-2.5 rounded-full font-ui text-sm border transition-colors min-h-[44px]
              ${numerico === c ? 'bg-orange-700 text-white border-orange-700' : 'bg-white text-navy-900 border-ink-line hover:border-orange-500'}`}>
            {fmt(c)}
          </button>
        ))}
        {permiteVaria && (
          <button type="button" onClick={() => onChange(varia ? null : 'varia')}
            className={`px-4 py-2.5 rounded-full font-ui text-sm border transition-colors min-h-[44px]
              ${varia ? 'bg-navy-900 text-white border-navy-900' : 'bg-white text-ink-body border-ink-line hover:border-navy-900'}`}>
            Varia muito
          </button>
        )}
      </div>
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
export function SeloDemo({ className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-white/70 font-ui text-[11px] ${className}`}>
      <Icone nome="info" size={12} /> dados de demonstração
    </span>
  );
}

/** Marcação de lacuna: nunca zero, sempre cinza declarado (spec §9 princípio 4). */
export function Lacuna({ children = 'ainda não informado' }) {
  return <span className="text-[#8A94A6] font-ui italic">{children}</span>;
}

// ==============================================================================
// 🌊 MARES PATTERN & DESIGN SYSTEM — A CIDADE DAS MARÉS
// Salvador: Padrão de Ondas Abstratas, Ladrilhos Hidráulicos, Silhueta e Gotas de Dendê
// ==============================================================================

import React from 'react';

interface WavesPatternProps {
  className?: string;
  intensity?: 'soft' | 'medium' | 'deep';
}

export const WavesPattern: React.FC<WavesPatternProps> = ({
  className = '',
  intensity = 'medium',
}) => {
  const opacity = intensity === 'soft' ? '0.08' : intensity === 'deep' ? '0.22' : '0.14';

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ opacity }}
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#0F4C81"
          d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,218.7C672,203,768,149,864,138.7C960,128,1056,160,1152,176C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
        <path
          fill="#2A9D8F"
          d="M0,192L48,197.3C96,203,192,213,288,197.3C384,181,480,139,576,138.7C672,139,768,181,864,197.3C960,213,1056,203,1152,181.3C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
      </svg>
    </div>
  );
};

export const SalvadorContornoSilhouette: React.FC<{ className?: string; color?: string }> = ({
  className = '',
  color = '#0F4C81',
}) => {
  return (
    <div className={`pointer-events-none select-none ${className}`}>
      <svg
        viewBox="0 0 800 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        {/* Farol da Barra */}
        <path
          d="M40 100 L40 60 L50 40 L60 40 L70 60 L70 100 Z"
          fill={color}
          fillOpacity="0.4"
        />
        {/* Cúpula do Farol */}
        <circle cx="55" cy="35" r="8" fill="#E89F3C" fillOpacity="0.9" />

        {/* Linha da Orla e Marés */}
        <path
          d="M0 100 Q150 85, 300 98 T600 95 T800 100 L800 120 L0 120 Z"
          fill={color}
          fillOpacity="0.25"
        />

        {/* Elevador Lacerda */}
        <path
          d="M420 100 L420 30 L435 30 L435 50 L460 50 L460 65 L435 65 L435 100 Z"
          fill={color}
          fillOpacity="0.5"
        />

        {/* Forte São Marcelo (Círculo na Baía) */}
        <ellipse cx="640" cy="92" rx="35" ry="12" fill={color} fillOpacity="0.35" />
      </svg>
    </div>
  );
};

export const SalvadorSkylineSilhouette = SalvadorContornoSilhouette;
export const SalvadorSkyline = SalvadorContornoSilhouette;

// Selo Gota de Dendê (Destaque & Verificação Autêntica de Salvador)
export const GotaDeDendeBadge: React.FC<{ label?: string; className?: string }> = ({
  label = 'Verificado',
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-[#E89F3C] to-[#E76F51] text-white shadow-xs ${className}`}
    >
      <span className="w-2 h-2 rounded-full bg-amber-200 animate-ping shrink-0" />
      <span>{label}</span>
    </span>
  );
};

// Faixa Superior das Marés
export const MaresRibbon: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`h-1.5 w-full bg-gradient-to-r from-[#0F4C81] via-[#2A9D8F] via-[#E89F3C] to-[#E76F51] ${className}`} />
  );
};

// Padrão de Ladrilhos Hidráulicos dos Casarões Históricos
export const LadrilhoPatternFrame: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={`relative rounded-3xl p-0.5 bg-gradient-to-br from-[#0F4C81] via-[#2A9D8F] to-[#E89F3C] shadow-lg ${className}`}
    >
      <div className="bg-white dark:bg-slate-900 rounded-[22px] p-4 h-full w-full">
        {children}
      </div>
    </div>
  );
};

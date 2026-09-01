// ==============================================================================
// 🌊 FAIXA DAS MARÉS DE SALVADOR — DESIGN SYSTEM "A CIDADE DAS MARÉS"
// Padrão de ondas suaves e paleta oceânica de Salvador
// ==============================================================================

import React from 'react';

interface MaresRibbonProps {
  className?: string;
  height?: string;
  showText?: boolean;
}

export const MaresRibbon: React.FC<MaresRibbonProps> = ({
  className = '',
  height = 'h-2',
  showText = false,
}) => {
  return (
    <div className={`w-full shrink-0 flex flex-col ${className}`}>
      <div className={`flex w-full ${height} overflow-hidden shadow-xs`}>
        {/* Azul Mar Profundo */}
        <div className="flex-1 bg-[#0F4C81]" title="Mar Profundo de Salvador" />
        {/* Verde Mar / Águas Calmas */}
        <div className="flex-1 bg-[#2A9D8F]" title="Águas Calmas da Baía de Todos os Santos" />
        {/* Areia Dourada */}
        <div className="flex-1 bg-[#E89F3C]" title="Areia Dourada do Farol da Barra" />
        {/* Terracota / Pôr do Sol */}
        <div className="flex-1 bg-[#E76F51]" title="Pôr do Sol no Porto da Barra" />
        {/* Espuma do Mar */}
        <div className="flex-1 bg-cyan-100" title="Espuma das Ondas" />
      </div>
      {showText && (
        <div className="bg-[#1A1A2E] text-cyan-200 text-[10px] py-1 text-center font-black tracking-widest uppercase shadow-inner">
          SALVÓ • A CIDADE DAS MARÉS • O GUIA OFICIAL DE SALVADOR
        </div>
      )}
    </div>
  );
};

// Aliases para compatibilidade
export const BonfimRibbon = MaresRibbon;

export const MaresBadge: React.FC<{ text: string; color?: 'blue' | 'yellow' | 'coral' | 'green' }> = ({
  text,
  color = 'blue',
}) => {
  const colorMap = {
    blue: 'bg-[#0F4C81]/10 text-[#0F4C81] border-[#0F4C81]/20',
    yellow: 'bg-[#E89F3C]/10 text-[#E89F3C] border-[#E89F3C]/20',
    coral: 'bg-[#E76F51]/10 text-[#E76F51] border-[#E76F51]/20',
    green: 'bg-[#2A9D8F]/10 text-[#2A9D8F] border-[#2A9D8F]/20',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${colorMap[color]}`}
    >
      <span>🌊</span>
      <span>{text}</span>
    </span>
  );
};

export const BonfimBadge = MaresBadge;

import React from 'react';

interface BonfimRibbonProps {
  className?: string;
  height?: string;
  showText?: boolean;
}

export const BonfimRibbon: React.FC<BonfimRibbonProps> = ({
  className = '',
  height = 'h-2',
  showText = false,
}) => {
  return (
    <div className={`w-full shrink-0 flex flex-col ${className}`}>
      <div className={`flex w-full ${height} overflow-hidden shadow-sm`}>
        {/* Fitinha Azul Salvador */}
        <div className="flex-1 bg-[#0B4F8A] relative group" title="Lembrança do Senhor do Bonfim - Azul">
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        {/* Fitinha Branca Paz */}
        <div className="flex-1 bg-white border-y border-slate-200" title="Lembrança do Senhor do Bonfim - Branco" />
        {/* Fitinha Amarela Prosperidade */}
        <div className="flex-1 bg-[#FFC72C]" title="Lembrança do Senhor do Bonfim - Amarelo" />
        {/* Fitinha Verde Esperança */}
        <div className="flex-1 bg-[#2E9E5B]" title="Lembrança do Senhor do Bonfim - Verde" />
        {/* Fitinha Coral Axé */}
        <div className="flex-1 bg-[#E8552B]" title="Lembrança do Senhor do Bonfim - Coral" />
      </div>
      {showText && (
        <div className="bg-slate-900 text-white/90 text-[10px] py-1 text-center font-black tracking-widest uppercase shadow-inner">
          OS MELHORES COMERCIOS NA PALMA DA SUA MÃO.
        </div>
      )}
    </div>
  );
};

export const BonfimBadge: React.FC<{ text: string; color?: 'blue' | 'yellow' | 'coral' | 'green' }> = ({
  text,
  color = 'blue',
}) => {
  const colorMap = {
    blue: 'bg-[#0B4F8A] text-white',
    yellow: 'bg-[#FFC72C] text-[#0B4F8A]',
    coral: 'bg-[#E8552B] text-white',
    green: 'bg-[#2E9E5B] text-white',
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm ${colorMap[color]}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80 animate-pulse"></span>
      {text}
    </span>
  );
};

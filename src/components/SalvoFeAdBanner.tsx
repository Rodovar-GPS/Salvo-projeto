import React, { useState, useEffect } from 'react';
import { FeAdCreative } from '../types';
import { runFeEngineAuction, recordFeAdClick } from '../data/salvoFeDatabase';
import { ExternalLink, Sparkles, MessageCircle, ShieldCheck } from 'lucide-react';

interface SalvoFeAdBannerProps {
  currentNeighborhood?: string;
  categoryInterest?: string;
  onOpenPlans?: () => void;
  className?: string;
}

export const SalvoFeAdBanner: React.FC<SalvoFeAdBannerProps> = ({
  currentNeighborhood = 'Barra',
  categoryInterest = 'Geral',
  onOpenPlans,
  className = '',
}) => {
  const [activeAd, setActiveAd] = useState<FeAdCreative | null>(null);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    // Executa o leilão Fé Engine para o local atual
    const result = runFeEngineAuction({
      userNeighborhood: currentNeighborhood,
      userCategoryInterest: categoryInterest,
    });

    if (result.winner) {
      setActiveAd(result.winner);
    }
  }, [currentNeighborhood, categoryInterest]);

  if (!activeAd) return null;

  const handleClick = (e: React.MouseEvent) => {
    if (!clicked) {
      setClicked(true);
      recordFeAdClick(activeAd.id);
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0B3D91] via-[#0E4DA4] to-[#1E3A8A] text-white p-5 sm:p-6 shadow-xl border border-blue-400/20 ${className}`}
    >
      {/* Decorative Glow */}
      <div className="absolute -right-12 -top-12 w-48 h-48 bg-[#FFC72C]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        {/* Left Ad Info */}
        <div className="flex items-start sm:items-center gap-4 min-w-0">
          <img
            src={activeAd.imageUrl}
            alt={activeAd.title}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white/20 shadow-md shrink-0"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="bg-[#FFC72C] text-[#0B3D91] text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-2xs">
                Patrocinado SALVÔ ADS
              </span>
              <span className="text-xs font-semibold text-blue-200">
                {activeAd.storeName}
              </span>
            </div>
            <h4 className="text-base sm:text-lg font-heading font-black text-white leading-snug">
              {activeAd.title}
            </h4>
            <p className="text-xs sm:text-sm text-blue-100 line-clamp-2 mt-0.5">
              {activeAd.description}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3 w-full md:w-auto shrink-0 pt-2 md:pt-0">
          <a
            href={activeAd.destinationUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#FFC72C] hover:bg-[#ffcf4d] text-[#0B3D91] font-heading font-black text-xs sm:text-sm shadow-lg active:scale-95 transition-all"
          >
            <MessageCircle className="w-4 h-4 text-[#0B3D91]" />
            <span>{activeAd.ctaText || 'Ver no WhatsApp'}</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>

          {onOpenPlans && (
            <button
              onClick={onOpenPlans}
              className="text-[11px] text-blue-200 hover:text-white underline underline-offset-2 hidden sm:block whitespace-nowrap cursor-pointer"
            >
              Anuncie aqui
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

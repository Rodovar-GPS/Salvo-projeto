// ==============================================================================
// 📹 VIDEO SHOWCASE — VITRINE EM VÍDEO DO COMERCIANTE (CATÁLOGO EM VÍDEO)
// Demonstração real de produtos, pratos e ambiente do comércio local de Salvador
// ==============================================================================

import React, { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Sparkles, Tag } from 'lucide-react';
import { GotaDeDendeBadge } from './MaresPattern';

export interface ShowcaseVideo {
  id: string;
  title: string;
  videoUrl?: string;
  thumbnailUrl: string;
  productName?: string;
  price?: number;
  durationSec?: number;
}

interface VideoShowcaseProps {
  videos?: ShowcaseVideo[];
  storeName: string;
}

export const VideoShowcase: React.FC<VideoShowcaseProps> = ({ videos, storeName }) => {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(true);

  const defaultVideos: ShowcaseVideo[] = videos && videos.length > 0 ? videos : [
    {
      id: 'v1',
      title: 'Apresentação do Cardápio & Pratos Frescos',
      thumbnailUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
      productName: 'Especialidade da Casa',
      price: 48.0,
      durationSec: 15,
    },
    {
      id: 'v2',
      title: 'Ambiente Aconchegante na Orla',
      thumbnailUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80',
      productName: 'Vista & Experiência',
      durationSec: 20,
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
            <span className="text-base">📹</span>
            <span>Vitrine em Vídeo</span>
          </h3>
          <GotaDeDendeBadge label="Vídeo Real" />
        </div>
        <span className="text-[11px] text-slate-500 font-medium">
          Demonstração do Comerciante
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {defaultVideos.map((video) => {
          const isPlaying = activeVideoId === video.id;

          return (
            <div
              key={video.id}
              onClick={() => setActiveVideoId(isPlaying ? null : video.id)}
              className="group relative aspect-[9/16] rounded-3xl overflow-hidden bg-slate-900 cursor-pointer shadow-md border border-slate-200 dark:border-slate-800"
            >
              {/* Imagem de Capa */}
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

              {/* Botão Play Central */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-11 h-11 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
                </div>
              </div>

              {/* Informações do Produto / Vídeo no Rodapé */}
              <div className="absolute bottom-3 left-3 right-3 text-white">
                {video.productName && (
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#E89F3C] text-slate-950 text-[10px] font-black uppercase tracking-wider mb-1">
                    <Tag className="w-3 h-3" />
                    <span>{video.productName}</span>
                  </div>
                )}

                <h4 className="text-xs font-black text-white leading-tight line-clamp-2">
                  {video.title}
                </h4>

                {video.price && (
                  <div className="text-xs font-black text-amber-300 mt-1">
                    R$ {video.price.toFixed(2).replace('.', ',')}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

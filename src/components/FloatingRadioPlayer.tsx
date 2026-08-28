import React, { useState, useEffect, useRef } from 'react';
import {
  Radio,
  Play,
  Pause,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  Music,
  Disc,
  Headphones,
  Signal,
  SkipForward,
  Shuffle,
  ShieldCheck,
  CheckCircle2,
  Tv,
} from 'lucide-react';

export interface SalvoTrack {
  id: string;
  title: string;
  artist: string;
  category: 'Axé Retrô' | 'Samba-Reggae' | 'Pagodão Baiano' | 'Carnaval de Salvador' | 'MPB Baiana';
  youtubeId: string;
  duration?: string;
  coverImage?: string;
}

// Curadoria especial de faixas e sets de Salvador/Bahia no YouTube
export const SALVO_DAILY_PLAYLIST: SalvoTrack[] = [
  {
    id: 'track-1',
    title: 'Faraó / Requebra / Protesto do Olodum (Ao Vivo Pelourinho)',
    artist: 'Olodum & Timbalada',
    category: 'Samba-Reggae',
    youtubeId: 'F13V7s8_b2I',
    duration: '04:12',
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'track-2',
    title: 'Playsom / Lucro / Sulamericano (Ao Vivo Salvador)',
    artist: 'BaianaSystem',
    category: 'Axé Retrô',
    youtubeId: 'W1YmB9o_qB8',
    duration: '05:30',
    coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'track-3',
    title: 'Tempo de Alegria / Eva / Festa no Circuito Barra-Ondina',
    artist: 'Ivete Sangalo & Banda Eva',
    category: 'Carnaval de Salvador',
    youtubeId: 'kJQP7kiw5Fk',
    duration: '04:45',
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'track-4',
    title: 'Água Mineral / Vem Neném / Desafio',
    artist: 'Harmonia do Samba & Xanddy',
    category: 'Pagodão Baiano',
    youtubeId: '0zM3nApSvMg',
    duration: '03:55',
    coverImage: 'https://images.unsplash.com/photo-1485579149621-3123dd979885?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'track-5',
    title: 'Beija-Flor / Mimar Você / Canto da Cidade',
    artist: 'Timbalada & Daniela Mercury',
    category: 'Axé Retrô',
    youtubeId: 'e-ORhEE9VVg',
    duration: '04:20',
    coverImage: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'track-6',
    title: 'Toda Menina Baiana / Você Não Entende Nada / Reconvexo',
    artist: 'Gilberto Gil & Caetano Veloso',
    category: 'MPB Baiana',
    youtubeId: '9bZkp7q19f0',
    duration: '05:10',
    coverImage: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'track-7',
    title: 'Posturado e Calmo / Zona de Perigo / Santinha',
    artist: 'Léo Santana',
    category: 'Pagodão Baiano',
    youtubeId: 'hTWKbfoikeg',
    duration: '03:40',
    coverImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'track-8',
    title: 'Mila / Pra Abalar / Pequena Eva',
    artist: 'Netinho & Asa de Águia',
    category: 'Carnaval de Salvador',
    youtubeId: 'kXYiU_JCYtU',
    duration: '04:50',
    coverImage: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=400&q=80',
  },
];

interface FloatingRadioPlayerProps {
  initialOpen?: boolean;
}

export const FloatingRadioPlayer: React.FC<FloatingRadioPlayerProps> = ({
  initialOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  
  // Escolha diária baseada no dia do mês ou aleatória
  const getTodayTrackIndex = () => {
    const day = new Date().getDate();
    return day % SALVO_DAILY_PLAYLIST.length;
  };

  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(getTodayTrackIndex());
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.9);
  const [showVideoPreview, setShowVideoPreview] = useState(false);

  const currentTrack = SALVO_DAILY_PLAYLIST[currentTrackIndex] || SALVO_DAILY_PLAYLIST[0];

  // Alterna para próxima música aleatória ou seguinte
  const handleNextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % SALVO_DAILY_PLAYLIST.length);
    setIsPlaying(true);
  };

  const handleRandomTrack = () => {
    const nextRandom = Math.floor(Math.random() * SALVO_DAILY_PLAYLIST.length);
    setCurrentTrackIndex(nextRandom);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <>
      {/* =========================================================
          1. FLOATING PILL BUTTON (Canto inferior direito)
      ========================================================= */}
      <div className="fixed bottom-20 md:bottom-6 right-3 sm:right-6 z-40 select-none animate-fadeIn">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-full shadow-2xl backdrop-blur-xl border transition-all duration-200 cursor-pointer active:scale-95 group ${
              isPlaying
                ? 'bg-gradient-to-r from-[#0B3D91] via-[#0E4A9E] to-[#C1502E] text-white border-amber-300/40 shadow-blue-900/40'
                : 'bg-slate-900/95 hover:bg-slate-900 text-white border-white/20 hover:border-amber-400/50'
            }`}
            title="Ouvir a Rádio Salvô Ao Vivo (Axé & Salvador)"
          >
            {/* Logo Salvô com Equalizador */}
            <div className="relative w-8 h-8 rounded-full bg-white/15 flex items-center justify-center shrink-0 border border-white/20 overflow-hidden">
              {isPlaying ? (
                <div className="flex items-end gap-0.5 h-3.5">
                  <span className="w-1 bg-[#FFC72C] rounded-full animate-bounce h-3"></span>
                  <span className="w-1 bg-white rounded-full animate-bounce h-4" style={{ animationDelay: '0.15s' }}></span>
                  <span className="w-1 bg-[#FFC72C] rounded-full animate-bounce h-2" style={{ animationDelay: '0.3s' }}></span>
                  <span className="w-1 bg-white rounded-full animate-bounce h-3.5" style={{ animationDelay: '0.45s' }}></span>
                </div>
              ) : (
                <img
                  src="/salvo-logo.png"
                  alt="Salvô"
                  className="w-full h-full object-cover p-0.5"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://iili.io/CDs6WS1.jpg';
                  }}
                />
              )}
            </div>

            {/* Nome da Rádio & Status */}
            <div className="text-left pr-1 hidden xs:block sm:block">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-xs font-heading font-black tracking-tight text-white">
                  Rádio Salvô
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-[#FFC72C] text-[#0B3D91] font-black uppercase shadow-xs">
                  OFICIAL
                </span>
                {isPlaying && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                )}
              </div>
              <span className="text-[10px] text-sky-200 font-medium block truncate max-w-[140px] sm:max-w-[170px] mt-0.5">
                {isPlaying ? currentTrack.title : 'O som oficial de Salvador'}
              </span>
            </div>

            {/* Botão Play / Pause Rápido */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="w-7 h-7 rounded-full bg-white text-[#0B3D91] hover:bg-[#FFC72C] flex items-center justify-center shrink-0 transition-colors shadow-sm ml-1 cursor-pointer"
              title={isPlaying ? 'Pausar' : 'Tocar agora'}
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5 fill-current" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              )}
            </button>
          </button>
        )}
      </div>

      {/* =========================================================
          2. POPUP MODAL DA RÁDIO SALVÔ OFICIAL
      ========================================================= */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div
            className="w-full sm:max-w-md bg-slate-900 text-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-700/80 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[85vh] animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar com Identidade Oficial Salvô */}
            <div className="bg-gradient-to-r from-[#0B3D91] via-[#0E4A9E] to-[#C1502E] p-4 sm:p-5 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md p-1 border border-white/20 shadow-md flex items-center justify-center shrink-0">
                  <img
                    src="/salvo-logo.png"
                    alt="SALVÔ"
                    className="w-full h-full object-cover rounded-xl"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://iili.io/CDs6WS1.jpg';
                    }}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-heading font-black text-white tracking-tight">
                      Rádio Salvô
                    </h3>
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-[#FFC72C] text-[#0B3D91] rounded-md shadow-xs flex items-center gap-0.5">
                      <ShieldCheck className="w-2.5 h-2.5" />
                      Oficial SSA
                    </span>
                  </div>
                  <p className="text-xs text-sky-200 font-medium">
                    A rádio exclusiva do comércio & cultura de Salvador
                  </p>
                </div>
              </div>

              {/* Fechar */}
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Minimizar Player"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* CONTEÚDO PRINCIPAL DO PLAYER */}
            <div className="p-4 sm:p-6 bg-gradient-to-b from-slate-900 via-slate-850 to-slate-900 border-b border-slate-800 space-y-4">
              {/* Capa e Visualizador */}
              <div className="flex flex-col items-center text-center">
                <div className="relative group">
                  <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden border-2 border-amber-400/80 shadow-2xl shadow-amber-500/20 flex items-center justify-center bg-slate-800 relative">
                    <img
                      src={currentTrack.coverImage || '/salvo-logo.png'}
                      alt={currentTrack.title}
                      className={`w-full h-full object-cover transition-transform duration-700 ${
                        isPlaying ? 'scale-105' : 'scale-100'
                      }`}
                    />
                    
                    {/* Overlay com Selo Salvô */}
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#0B3D91]/90 backdrop-blur-md text-[#FFC72C] text-[9px] font-black uppercase rounded-lg border border-amber-400/40 flex items-center gap-1 shadow-md">
                      <Disc className={`w-3 h-3 ${isPlaying ? 'animate-spin' : ''}`} />
                      <span>{currentTrack.category}</span>
                    </div>

                    {isPlaying && (
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-black uppercase flex items-center gap-1 shadow-md">
                        <Signal className="w-3 h-3" />
                        Ao Vivo
                      </span>
                    )}
                  </div>
                </div>

                {/* Título da Música e Artista */}
                <div className="mt-4 w-full">
                  <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block mb-1">
                    Tocando na Rádio Salvô
                  </span>
                  <h4 className="text-lg sm:text-xl font-heading font-black text-white line-clamp-2">
                    {currentTrack.title}
                  </h4>
                  <p className="text-sm text-sky-200 font-bold mt-1 flex items-center justify-center gap-1">
                    <Music className="w-3.5 h-3.5 text-amber-400" />
                    <span>{currentTrack.artist}</span>
                  </p>
                </div>

                {/* Equalizador Animado */}
                <div className="flex items-center justify-center gap-1 mt-3 h-4">
                  {isPlaying ? (
                    <>
                      <span className="w-1 bg-amber-400 rounded-full h-3 animate-pulse"></span>
                      <span className="w-1 bg-sky-400 rounded-full h-4 animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                      <span className="w-1 bg-emerald-400 rounded-full h-2 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                      <span className="w-1 bg-amber-400 rounded-full h-4 animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                      <span className="w-1 bg-rose-400 rounded-full h-3 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                      <span className="w-1 bg-sky-400 rounded-full h-2 animate-bounce" style={{ animationDelay: '0.5s' }}></span>
                      <span className="text-[10px] text-emerald-400 font-black ml-2 uppercase tracking-wider">
                        Transmissão sem comerciais
                      </span>
                    </>
                  ) : (
                    <span className="text-[11px] text-slate-400 font-medium">
                      Toque no play para iniciar o som de Salvador
                    </span>
                  )}
                </div>
              </div>

              {/* CONTROLES DE ÁUDIO & BOTÕES DE FAIXA */}
              <div className="space-y-3 pt-2">
                {/* Botões de Ação Principal */}
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={handleRandomTrack}
                    className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white transition-all cursor-pointer"
                    title="Música Aleatória do Dia"
                  >
                    <Shuffle className="w-5 h-5 text-amber-300" />
                  </button>

                  <button
                    onClick={togglePlay}
                    className="py-3.5 px-8 bg-gradient-to-r from-[#FFC72C] to-[#FFAA00] hover:from-[#FFAA00] hover:to-[#FF8800] text-[#0B3D91] font-heading font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer min-w-[180px]"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-5 h-5 fill-current" />
                        <span>Pausar Rádio</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                        <span>Ouvir Salvô</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleNextTrack}
                    className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white transition-all cursor-pointer"
                    title="Próxima Música de Salvador"
                  >
                    <SkipForward className="w-5 h-5 text-amber-300" />
                  </button>
                </div>

                {/* Opção para Alternar Modo Vídeo / Áudio Puro */}
                <div className="flex items-center justify-between text-xs px-2 text-slate-400">
                  <button
                    onClick={() => setShowVideoPreview(!showVideoPreview)}
                    className="flex items-center gap-1 hover:text-amber-300 transition-colors cursor-pointer"
                  >
                    <Tv className="w-3.5 h-3.5" />
                    <span>{showVideoPreview ? 'Ocultar Vídeo' : 'Ver Clipe Oficial'}</span>
                  </button>

                  <span className="text-[11px] text-sky-300 font-semibold">
                    100% Axé, Samba-Reggae e Pagodão
                  </span>
                </div>
              </div>

              {/* YouTube Player Incorporado (Audio/Video contínuo e sem propagandas) */}
              <div className={`overflow-hidden rounded-2xl transition-all duration-300 ${
                showVideoPreview ? 'h-48 mt-3 border border-slate-700' : 'h-0 opacity-0 pointer-events-none'
              }`}>
                {isPlaying && (
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube-nocookie.com/embed/${currentTrack.youtubeId}?autoplay=1&enablejsapi=1&controls=1&modestbranding=1&rel=0&iv_load_policy=3&loop=1`}
                    title={currentTrack.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                )}
              </div>

              {/* YouTube Background Audio Element quando o vídeo está minimizado */}
              {!showVideoPreview && isPlaying && (
                <div className="hidden">
                  <iframe
                    width="200"
                    height="200"
                    src={`https://www.youtube-nocookie.com/embed/${currentTrack.youtubeId}?autoplay=1&enablejsapi=1&controls=0&modestbranding=1&rel=0&loop=1`}
                    title="Background Audio Stream"
                    allow="autoplay"
                  ></iframe>
                </div>
              )}
            </div>

            {/* SELEÇÃO DE PROGRAMAÇÃO DA RÁDIO SALVÔ */}
            <div className="p-3.5 bg-slate-850 flex-1 overflow-y-auto max-h-48 scrollbar-thin space-y-1.5">
              <div className="flex items-center justify-between px-1 mb-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                  Programação de Salvador ({SALVO_DAILY_PLAYLIST.length} Sucessos)
                </span>
                <span className="text-[10px] text-amber-300 font-bold">
                  Toque para mudar
                </span>
              </div>

              {SALVO_DAILY_PLAYLIST.map((track, idx) => {
                const isSelected = idx === currentTrackIndex;
                return (
                  <div
                    key={track.id}
                    onClick={() => {
                      setCurrentTrackIndex(idx);
                      setIsPlaying(true);
                    }}
                    className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-blue-950 border-amber-400/50 shadow-xs ring-1 ring-amber-400/30'
                        : 'bg-slate-900/60 hover:bg-slate-800 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700 text-amber-300 font-black text-xs">
                        {isSelected && isPlaying ? (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                        ) : (
                          idx + 1
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-white truncate">
                          {track.title}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
                          {track.artist} • {track.category}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentTrackIndex(idx);
                        setIsPlaying(true);
                      }}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected && isPlaying
                          ? 'bg-[#FFC72C] text-[#0B3D91]'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {isSelected && isPlaying ? (
                        <Pause className="w-3.5 h-3.5 fill-current" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Rodapé Informativo */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 text-center text-[10px] text-slate-400 flex items-center justify-between px-4">
              <span>Rádio Salvô SSA • O som de Salvador</span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-amber-300 hover:underline font-bold"
              >
                Minimizar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

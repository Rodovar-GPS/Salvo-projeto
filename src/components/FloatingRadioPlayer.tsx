import React, { useState, useEffect, useRef, useMemo } from 'react';
import Hls from 'hls.js';
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
  SkipBack,
  Shuffle,
  ShieldCheck,
  CheckCircle2,
  Tv,
  Search,
  Plus,
  Trash2,
  ListMusic,
  Sliders,
  Move,
  Maximize2,
  Minimize2,
  ExternalLink,
  Clock,
  Repeat,
  Flame,
  Check,
  Link as LinkIcon,
  Globe,
  MapPin,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import {
  SalvoMediaTrack,
  NATIONAL_RADIOS,
  ALL_OFFICIAL_RADIOS,
  SALVO_DAILY_PLAYLIST,
  YOUTUBE_EXTENDED_CATALOG,
  searchMediaTracks,
  extractYouTubeId,
} from '../data/salvoMediaDatabase';

// Re-export for views compatibility
export type SalvoTrack = SalvoMediaTrack;
export { SALVO_DAILY_PLAYLIST, ALL_OFFICIAL_RADIOS as SALVADOR_LIVE_RADIOS };

interface FloatingRadioPlayerProps {
  initialOpen?: boolean;
}

type PlayerViewMode = 'minimized' | 'pill' | 'pip' | 'studio' | 'hidden';
type StudioTab = 'radios-nat' | 'youtube' | 'queue' | 'adblock';

export const FloatingRadioPlayer: React.FC<FloatingRadioPlayerProps> = ({
  initialOpen = false,
}) => {
  // -------------------------------------------------------------
  // 1. PLAYER STATE & QUEUE
  // -------------------------------------------------------------
  const [viewMode, setViewMode] = useState<PlayerViewMode>(initialOpen ? 'studio' : 'pill');
  const [studioTab, setStudioTab] = useState<StudioTab>('radios-nat');
  const [showVolumeSlider, setShowVolumeSlider] = useState<boolean>(false);

  // Playlist / Queue (Defaults to National Radios + Curated Hits)
  const [queue, setQueue] = useState<SalvoMediaTrack[]>(() => {
    try {
      const saved = localStorage.getItem('salvo_media_queue_v3');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [...NATIONAL_RADIOS, ...SALVO_DAILY_PLAYLIST];
  });

  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.9);
  const [isAudioOnly, setIsAudioOnly] = useState<boolean>(false);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);

  // Audio Stream Status
  const [audioStreamStatus, setAudioStreamStatus] = useState<'idle' | 'loading' | 'playing' | 'error'>('idle');
  const [audioErrorMessage, setAudioErrorMessage] = useState<string>('');

  // Audio element reference for direct radio streaming (HLS / MP3)
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  // PIP Window State
  const [pipSize, setPipSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [pipPosition, setPipPosition] = useState<'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'>('bottom-right');
  const [pipIsHovered, setPipIsHovered] = useState<boolean>(false);

  // YouTube Search State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [customUrlInput, setCustomUrlInput] = useState<string>('');
  const [isSearchingOnline, setIsSearchingOnline] = useState<boolean>(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('Todos');
  const [searchResults, setSearchResults] = useState<SalvoMediaTrack[]>(YOUTUBE_EXTENDED_CATALOG);

  // AdBlock / PureStream Stats
  const [blockedAdsCount, setBlockedAdsCount] = useState<number>(24);
  const [audioPreset, setAudioPreset] = useState<'paredao' | 'trio' | 'acustico' | 'flat'>('paredao');
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number | null>(null);
  const [sleepTimerRemaining, setSleepTimerRemaining] = useState<number | null>(null);

  const currentTrack: SalvoMediaTrack = queue[currentTrackIndex] || NATIONAL_RADIOS[0];
  const isDirectAudioStream = !!currentTrack?.streamUrl;

  // Sync queue to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('salvo_media_queue_v3', JSON.stringify(queue));
    } catch (e) {
      console.error(e);
    }
  }, [queue]);

  // -------------------------------------------------------------
  // 2. DIRECT AUDIO STREAMING ENGINE (HTML5 Audio + HLS.js)
  // Handles .m3u8, .mp3, shoutcast and live streams with zero ads!
  // -------------------------------------------------------------
  useEffect(() => {
    // If not a direct audio stream (e.g. YouTube video), destroy HLS and pause native audio
    if (!isDirectAudioStream) {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      setAudioStreamStatus('idle');
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = isMuted ? 0 : volume;

    if (!isPlaying) {
      audio.pause();
      setAudioStreamStatus('idle');
      return;
    }

    const streamUrl = currentTrack.streamUrl;
    if (!streamUrl) return;

    setAudioStreamStatus('loading');
    setAudioErrorMessage('');

    // Clean up previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const isM3U8 = streamUrl.includes('.m3u8') || currentTrack.streamType === 'hls';

    if (isM3U8 && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
      });

      hlsRef.current = hls;
      hls.loadSource(streamUrl);
      hls.attachMedia(audio);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        audio.play().then(() => {
          setAudioStreamStatus('playing');
        }).catch((err) => {
          console.warn('Autoplay prevented or stream error:', err);
          setAudioStreamStatus('playing');
        });
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              setAudioStreamStatus('error');
              setAudioErrorMessage('Não foi possível conectar ao stream da emissora. Tente novamente.');
              break;
          }
        }
      });
    } else {
      // Standard MP3 / Direct Icecast / Safari Native HLS
      audio.src = streamUrl;
      audio.load();
      audio.play().then(() => {
        setAudioStreamStatus('playing');
      }).catch((err) => {
        console.warn('Direct stream play notice:', err);
      });
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [currentTrackIndex, isPlaying, isDirectAudioStream, currentTrack?.streamUrl]);

  // Volume synchronization
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // -------------------------------------------------------------
  // 3. YOUTUBE SEARCH & REAL-TIME FILTERING
  // -------------------------------------------------------------
  useEffect(() => {
    const query = searchQuery.trim();
    if (!query) {
      if (selectedCategoryFilter === 'Todos') {
        setSearchResults(YOUTUBE_EXTENDED_CATALOG);
      } else {
        setSearchResults(YOUTUBE_EXTENDED_CATALOG.filter((t) => t.category === selectedCategoryFilter));
      }
      setIsSearchingOnline(false);
      return;
    }

    setIsSearchingOnline(true);
    const timeoutId = setTimeout(() => {
      const localResults = searchMediaTracks(query);
      if (selectedCategoryFilter === 'Todos') {
        setSearchResults(localResults);
      } else {
        const filtered = localResults.filter((t) => t.category === selectedCategoryFilter);
        setSearchResults(filtered.length > 0 ? filtered : localResults);
      }
      setIsSearchingOnline(false);
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedCategoryFilter]);

  // Sleep timer ticker
  useEffect(() => {
    if (!sleepTimerMinutes) {
      setSleepTimerRemaining(null);
      return;
    }
    setSleepTimerRemaining(sleepTimerMinutes * 60);

    const interval = setInterval(() => {
      setSleepTimerRemaining((prev) => {
        if (prev === null || prev <= 1) {
          setIsPlaying(false);
          if (audioRef.current) audioRef.current.pause();
          setSleepTimerMinutes(null);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [sleepTimerMinutes]);

  // Global event listener so other parts of the app can play tracks or open player
  useEffect(() => {
    const handlePlayTrackEvent = (e: CustomEvent<SalvoMediaTrack>) => {
      if (e.detail) {
        handlePlayTrack(e.detail);
      }
    };

    const handleOpenPlayerEvent = (e: CustomEvent<{ mode?: PlayerViewMode; tab?: StudioTab }>) => {
      if (e.detail?.mode) setViewMode(e.detail.mode);
      if (e.detail?.tab) setStudioTab(e.detail.tab);
    };

    window.addEventListener('salvo-play-track' as any, handlePlayTrackEvent);
    window.addEventListener('salvo-open-player' as any, handleOpenPlayerEvent);

    return () => {
      window.removeEventListener('salvo-play-track' as any, handlePlayTrackEvent);
      window.removeEventListener('salvo-open-player' as any, handleOpenPlayerEvent);
    };
  }, [queue]);

  // -------------------------------------------------------------
  // CONTROLS & ACTIONS
  // -------------------------------------------------------------
  const handlePlayTrack = (track: SalvoMediaTrack) => {
    // Check if the clicked track is already in the queue
    const idx = queue.findIndex(
      (t) =>
        t.id === track.id ||
        (track.youtubeId && t.youtubeId && t.youtubeId === track.youtubeId) ||
        (track.streamUrl && t.streamUrl && t.streamUrl === track.streamUrl)
    );

    if (idx >= 0) {
      setCurrentTrackIndex(idx);
    } else {
      setQueue((prev) => [track, ...prev]);
      setCurrentTrackIndex(0);
    }
    setIsPlaying(true);
    setBlockedAdsCount((c) => c + 1);
  };

  const handleAddToQueue = (track: SalvoMediaTrack, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const alreadyInQueue = queue.some((t) => t.id === track.id);
    if (!alreadyInQueue) {
      setQueue((prev) => [...prev, track]);
    }
  };

  const handleRemoveFromQueue = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (queue.length <= 1) return;
    setQueue((prev) => prev.filter((_, i) => i !== index));
    if (index === currentTrackIndex) {
      setCurrentTrackIndex(0);
    } else if (index < currentTrackIndex) {
      setCurrentTrackIndex((prev) => prev - 1);
    }
  };

  const handleClearQueue = () => {
    setQueue([currentTrack]);
    setCurrentTrackIndex(0);
  };

  const handleNextTrack = () => {
    if (isShuffle) {
      const randomIdx = Math.floor(Math.random() * queue.length);
      setCurrentTrackIndex(randomIdx);
    } else {
      setCurrentTrackIndex((prev) => (prev + 1) % queue.length);
    }
    setIsPlaying(true);
    setBlockedAdsCount((c) => c + 1);
  };

  const handlePrevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + queue.length) % queue.length);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  // Import custom YouTube URL or ID
  const handleImportCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrlInput.trim()) return;

    const ytId = extractYouTubeId(customUrlInput);
    if (!ytId) {
      alert('Por favor, insira um link válido do YouTube (ex: https://youtu.be/... ou https://youtube.com/watch?v=...)');
      return;
    }

    const newTrack: SalvoMediaTrack = {
      id: `custom-yt-${ytId}`,
      title: `Vídeo do YouTube [${ytId}]`,
      artist: 'Vídeo Importado pelo Usuário',
      category: 'YouTube Personalizado',
      youtubeId: ytId,
      duration: 'Vídeo HD',
      coverImage: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
      badge: 'MEU LINK YT',
      description: 'Vídeo importado para reprodução sem comerciais.',
    };

    handlePlayTrack(newTrack);
    setCustomUrlInput('');
    setBlockedAdsCount((c) => c + 2);
  };

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // YouTube clean embed URL with PureStream params
  const cleanEmbedUrl = useMemo(() => {
    if (!currentTrack?.youtubeId) return '';
    return `https://www.youtube-nocookie.com/embed/${currentTrack.youtubeId}?autoplay=${isPlaying ? 1 : 0}&enablejsapi=1&controls=1&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1`;
  }, [currentTrack?.youtubeId, isPlaying]);

  // PIP Dimension styles
  const pipDimensions = {
    sm: 'w-64 h-40',
    md: 'w-80 h-52 sm:w-96 sm:h-60',
    lg: 'w-96 h-64 sm:w-[480px] sm:h-80',
  }[pipSize];

  // PIP Position classes
  const pipPositionClasses = {
    'bottom-right': 'bottom-20 md:bottom-6 right-3 sm:right-6',
    'bottom-left': 'bottom-20 md:bottom-6 left-3 sm:left-6',
    'top-right': 'top-20 right-3 sm:right-6',
    'top-left': 'top-20 left-3 sm:left-6',
  }[pipPosition];

  // Check if a track is the current active one
  const isTrackActive = (track: SalvoMediaTrack) => {
    if (track.streamUrl && currentTrack.streamUrl) {
      return track.streamUrl === currentTrack.streamUrl;
    }
    if (track.youtubeId && currentTrack.youtubeId) {
      return track.youtubeId === currentTrack.youtubeId;
    }
    return track.id === currentTrack.id;
  };

  return (
    <>
      {/* =========================================================
          NATIVE HTML5 AUDIO ELEMENT (Zero Ads direct stream for Radios)
      ========================================================= */}
      <audio
        ref={audioRef}
        preload="auto"
        onPlaying={() => setAudioStreamStatus('playing')}
        onWaiting={() => setAudioStreamStatus('loading')}
        onError={() => {
          if (isDirectAudioStream && isPlaying) {
            setAudioStreamStatus('error');
            setAudioErrorMessage('Transmissão temporariamente fora do ar. Tentando reconectar...');
          }
        }}
        className="hidden"
      />

      {/* =========================================================
          BACKGROUND YOUTUBE ENGINE (Keeps audio playing in Pill/Minimized)
      ========================================================= */}
      {isPlaying && !isDirectAudioStream && currentTrack?.youtubeId && (viewMode === 'pill' || viewMode === 'minimized') && (
        <div
          className="fixed bottom-0 right-0 w-8 h-8 pointer-events-none opacity-5 overflow-hidden z-0"
          aria-hidden="true"
        >
          <iframe
            key={`bg-yt-${currentTrack.youtubeId}`}
            src={`https://www.youtube-nocookie.com/embed/${currentTrack.youtubeId}?autoplay=1&enablejsapi=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1`}
            title="Salvo Background YouTube Engine"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            className="w-full h-full"
          />
        </div>
      )}

      {/* =========================================================
          VIEW MODE 0: MINIMIZED FLOATING ICON
      ========================================================= */}
      {viewMode === 'minimized' && (
        <div className="fixed bottom-20 md:bottom-6 right-3 sm:right-6 z-40 select-none animate-fadeIn">
          <button
            onClick={() => setViewMode('pill')}
            className={`flex items-center gap-2 p-2 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 border cursor-pointer ${
              isPlaying
                ? 'bg-gradient-to-r from-[#0B3D91] to-[#08285c] text-white border-amber-400/80 ring-2 ring-amber-400/40 shadow-amber-500/20'
                : 'bg-slate-900/95 text-slate-200 border-slate-700/80 hover:border-slate-500'
            }`}
            title="Expandir Rádio SALVÔ & YouTube"
          >
            <div className="relative w-9 h-9 rounded-full overflow-hidden bg-slate-800 flex items-center justify-center shrink-0 border border-white/20">
              <img
                src={currentTrack.coverImage || '/salvo-logo.png'}
                alt={currentTrack.title}
                className={`w-full h-full object-cover ${isPlaying ? 'animate-spin-slow' : 'opacity-80'}`}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://iili.io/CDs6WS1.jpg';
                }}
              />
              {isPlaying && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Signal className="w-4 h-4 text-[#FFC72C] animate-pulse" />
                </div>
              )}
            </div>

            <div className="hidden sm:flex items-center gap-1.5 pr-2 max-w-[150px]">
              <span className="text-xs font-bold truncate text-white">
                {currentTrack.title}
              </span>
              <Maximize2 className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            </div>
          </button>
        </div>
      )}

      {/* =========================================================
          VIEW MODE 1: COMPACT FLOATING PILL / DOCK
      ========================================================= */}
      {viewMode === 'pill' && (
        <div className="fixed bottom-20 md:bottom-6 right-3 sm:right-6 z-40 select-none animate-fadeIn">
          <div
            className={`flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-full shadow-2xl backdrop-blur-xl border transition-all duration-300 group ${
              isPlaying
                ? 'bg-slate-950/95 border-amber-400/60 shadow-amber-500/20 ring-1 ring-amber-400/30'
                : 'bg-slate-900/90 border-slate-700/80 hover:border-slate-500 text-white'
            }`}
          >
            {/* Click to open Studio Hub */}
            <button
              onClick={() => setViewMode('studio')}
              className="flex items-center gap-2 pl-1 pr-1.5 py-0.5 cursor-pointer text-left focus:outline-hidden"
              title="Abrir Studio Completo da Rádio e YouTube"
            >
              {/* Rotating Cover / Equalizer */}
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden shrink-0 border border-white/20 shadow-inner bg-slate-800 flex items-center justify-center">
                <img
                  src={currentTrack.coverImage || '/salvo-logo.png'}
                  alt={currentTrack.title}
                  className={`w-full h-full object-cover transition-transform ${
                    isPlaying ? 'scale-110' : 'opacity-80'
                  }`}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://iili.io/CDs6WS1.jpg';
                  }}
                />
                {/* Live equalizer wave overlay */}
                {isPlaying && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[0.5px] flex items-end justify-center gap-0.5 pb-1">
                    <span className="w-0.5 bg-[#FFC72C] rounded-full animate-bounce h-2.5"></span>
                    <span className="w-0.5 bg-white rounded-full animate-bounce h-3.5" style={{ animationDelay: '0.15s' }}></span>
                    <span className="w-0.5 bg-[#FFC72C] rounded-full animate-bounce h-2" style={{ animationDelay: '0.3s' }}></span>
                    <span className="w-0.5 bg-emerald-400 rounded-full animate-bounce h-3" style={{ animationDelay: '0.45s' }}></span>
                  </div>
                )}
              </div>

              {/* Title & Category Info */}
              <div className="text-left hidden xs:block sm:block max-w-[120px] sm:max-w-[160px]">
                <div className="flex items-center gap-1 leading-none mb-0.5">
                  <span className="text-xs font-heading font-black text-white truncate">
                    {currentTrack.title}
                  </span>
                  {currentTrack.isLiveRadio && (
                    <span className="text-[8px] px-1 py-0.2 rounded bg-rose-500 text-white font-black uppercase shrink-0 animate-pulse">
                      AO VIVO
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-sky-200 truncate">
                  <span className="truncate">{currentTrack.artist}</span>
                </div>
              </div>
            </button>

            {/* Quick Play/Pause */}
            <button
              onClick={togglePlay}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-all cursor-pointer shadow-md ${
                isPlaying
                  ? 'bg-[#FFC72C] hover:bg-amber-400 text-[#0B3D91]'
                  : 'bg-white/20 hover:bg-white text-white hover:text-slate-900'
              }`}
              title={isPlaying ? 'Pausar' : 'Reproduzir'}
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
              ) : (
                <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current ml-0.5" />
              )}
            </button>

            {/* Next Track Button */}
            <button
              onClick={handleNextTrack}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center shrink-0 transition-colors cursor-pointer"
              title="Próxima Faixa"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>

            {/* Volume Control Trigger & Slider */}
            <div className="relative flex items-center">
              <button
                onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                  isMuted
                    ? 'bg-rose-500/30 text-rose-300'
                    : showVolumeSlider
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white'
                }`}
                title={`Volume: ${Math.round(volume * 100)}% (Clique para ajustar)`}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5" />
                )}
              </button>

              {/* Volume Slider Popover */}
              {showVolumeSlider && (
                <div className="absolute bottom-10 right-0 bg-slate-900 border border-slate-700 shadow-xl rounded-2xl p-2.5 flex flex-col items-center gap-2 z-50 animate-fadeIn min-w-[120px]">
                  <div className="flex items-center justify-between w-full text-[10px] text-slate-300 font-bold">
                    <span>Volume</span>
                    <span className="text-amber-300">{isMuted ? 'Mudo' : `${Math.round(volume * 100)}%`}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      const newVol = parseFloat(e.target.value);
                      setVolume(newVol);
                      if (isMuted && newVol > 0) setIsMuted(false);
                    }}
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#FFC72C]"
                  />
                  <div className="flex items-center justify-between w-full pt-1 border-t border-slate-800">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="text-[10px] text-sky-300 hover:text-white font-bold cursor-pointer"
                    >
                      {isMuted ? 'Desmutar' : 'Silenciar'}
                    </button>
                    <button
                      onClick={() => setShowVolumeSlider(false)}
                      className="text-[10px] text-slate-400 hover:text-white cursor-pointer"
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* PIP Mode Switch Button */}
            <button
              onClick={() => setViewMode('pip')}
              className="w-7 h-7 rounded-full bg-blue-600/30 hover:bg-blue-600/60 text-sky-300 hover:text-white border border-blue-400/30 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
              title="Ativar Modo Vídeo Flutuante (PIP)"
            >
              <Tv className="w-3.5 h-3.5" />
            </button>

            {/* Minimizar / Remover da Frente Button */}
            <button
              onClick={() => setViewMode('minimized')}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-amber-400/30 text-slate-300 hover:text-amber-300 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
              title="Minimizar (Remover da frente)"
            >
              <Minimize2 className="w-3.5 h-3.5" />
            </button>

            {/* Fechar Player */}
            <button
              onClick={() => {
                setIsPlaying(false);
                if (audioRef.current) audioRef.current.pause();
                setViewMode('minimized');
              }}
              className="w-6 h-6 rounded-full bg-white/5 hover:bg-rose-500/40 text-slate-400 hover:text-rose-200 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
              title="Fechar Player"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          VIEW MODE 2: FLOATING PICTURE-IN-PICTURE (PIP) VIDEO
      ========================================================= */}
      {viewMode === 'pip' && (
        <div
          className={`fixed z-40 select-none transition-all duration-300 animate-fadeIn ${pipPositionClasses}`}
          onMouseEnter={() => setPipIsHovered(true)}
          onMouseLeave={() => setPipIsHovered(false)}
        >
          <div
            className={`${pipDimensions} bg-slate-950 rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-amber-400/80 overflow-hidden flex flex-col relative group`}
          >
            {/* TOP HEADER CONTROLS */}
            <div
              className={`absolute top-0 inset-x-0 z-30 p-2 bg-gradient-to-b from-black/90 via-black/60 to-transparent flex items-center justify-between transition-opacity duration-200 ${
                pipIsHovered ? 'opacity-100' : 'opacity-80 sm:opacity-0'
              }`}
            >
              <div className="flex items-center gap-1.5 min-w-0 pr-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping shrink-0"></span>
                <p className="text-[11px] font-black text-white truncate drop-shadow">
                  {currentTrack.title}
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {/* Reposition Corner */}
                <button
                  onClick={() => {
                    const positions: ('bottom-right' | 'bottom-left' | 'top-left' | 'top-right')[] = [
                      'bottom-right',
                      'bottom-left',
                      'top-left',
                      'top-right',
                    ];
                    const nextPos = positions[(positions.indexOf(pipPosition) + 1) % positions.length];
                    setPipPosition(nextPos);
                  }}
                  className="w-6 h-6 rounded-lg bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Mover janela para outro canto"
                >
                  <Move className="w-3 h-3" />
                </button>

                {/* Resize Button */}
                <button
                  onClick={() => {
                    const sizes: ('sm' | 'md' | 'lg')[] = ['sm', 'md', 'lg'];
                    const nextSize = sizes[(sizes.indexOf(pipSize) + 1) % sizes.length];
                    setPipSize(nextSize);
                  }}
                  className="w-6 h-6 rounded-lg bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Alterar tamanho do vídeo"
                >
                  {pipSize === 'lg' ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                </button>

                {/* Open Full Studio */}
                <button
                  onClick={() => setViewMode('studio')}
                  className="w-6 h-6 rounded-lg bg-[#FFC72C] hover:bg-amber-400 text-[#0B3D91] flex items-center justify-center transition-colors cursor-pointer font-bold"
                  title="Abrir Studio Completo / Pesquisa"
                >
                  <Sparkles className="w-3 h-3" />
                </button>

                {/* Minimize to Pill */}
                <button
                  onClick={() => setViewMode('pill')}
                  className="w-6 h-6 rounded-lg bg-white/20 hover:bg-amber-400 hover:text-slate-900 text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Minimizar para Barra Flutuante"
                >
                  <Minimize2 className="w-3 h-3" />
                </button>

                {/* Close/Minimize away */}
                <button
                  onClick={() => setViewMode('minimized')}
                  className="w-6 h-6 rounded-lg bg-white/20 hover:bg-rose-600 text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Ocultar da Frente"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* VIDEO FRAME / AUDIO OVERLAY */}
            <div className="flex-1 w-full h-full bg-black relative">
              {!isDirectAudioStream && currentTrack?.youtubeId && !isAudioOnly ? (
                <iframe
                  key={`pip-yt-${currentTrack.youtubeId}`}
                  className="w-full h-full object-cover"
                  src={cleanEmbedUrl}
                  title={currentTrack.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-[#0B3D91] to-slate-950 p-4 text-center">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#FFC72C] shadow-lg mb-2 relative">
                    <img
                      src={currentTrack.coverImage || '/salvo-logo.png'}
                      alt={currentTrack.title}
                      className="w-full h-full object-cover"
                    />
                    {isPlaying && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Signal className="w-6 h-6 text-[#FFC72C] animate-pulse" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-black text-white truncate max-w-full">
                    {currentTrack.title}
                  </p>
                  <p className="text-[10px] text-amber-300 font-medium">
                    {isDirectAudioStream ? '● Transmissão Direta Sem Anúncios' : 'Modo Áudio Puro (Sem Vídeo)'}
                  </p>
                </div>
              )}
            </div>

            {/* BOTTOM BAR CONTROLS WITH VOLUME SLIDER */}
            <div
              className={`absolute bottom-0 inset-x-0 z-30 p-2 sm:p-2.5 bg-gradient-to-t from-black/90 via-black/70 to-transparent flex items-center justify-between transition-opacity duration-200 ${
                pipIsHovered ? 'opacity-100' : 'opacity-80 sm:opacity-0'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrevTrack}
                  className="w-7 h-7 rounded-lg bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Anterior"
                >
                  <SkipBack className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={togglePlay}
                  className="w-8 h-8 rounded-full bg-[#FFC72C] hover:bg-amber-400 text-[#0B3D91] flex items-center justify-center transition-transform active:scale-95 cursor-pointer shadow-md font-bold"
                  title={isPlaying ? 'Pausar' : 'Tocar'}
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>

                <button
                  onClick={handleNextTrack}
                  className="w-7 h-7 rounded-lg bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Próxima"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Volume Slider in PIP */}
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-lg border border-white/10">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-white hover:text-amber-300 cursor-pointer"
                    title={isMuted ? 'Desmutar' : 'Mutar'}
                  >
                    {isMuted || volume === 0 ? <VolumeX className="w-3 h-3 text-rose-400" /> : <Volume2 className="w-3 h-3" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      const newVol = parseFloat(e.target.value);
                      setVolume(newVol);
                      if (isMuted && newVol > 0) setIsMuted(false);
                    }}
                    className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#FFC72C]"
                  />
                </div>

                {!isDirectAudioStream && (
                  <button
                    onClick={() => setIsAudioOnly(!isAudioOnly)}
                    className="p-1.5 rounded-lg bg-white/15 hover:bg-white/30 text-white text-[10px] flex items-center gap-1 cursor-pointer"
                    title="Alternar Áudio Puro / Vídeo"
                  >
                    <Tv className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          VIEW MODE 3: FULL POPUP / STUDIO HUB (MODAL CENTRAL)
      ========================================================= */}
      {viewMode === 'studio' && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-5xl h-[92vh] max-h-[850px] shadow-2xl flex flex-col overflow-hidden text-slate-100 relative">
            
            {/* STUDIO HEADER */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-[#0B3D91] to-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FFC72C] flex items-center justify-center text-[#0B3D91] shadow-lg shadow-amber-400/20 font-black">
                  <Headphones className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-heading font-black text-lg sm:text-xl text-white tracking-tight">
                      STUDIO SALVÔ • RÁDIO & YOUTUBE
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Zero Anúncios
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Transmissões em HD, emissoras nacionais selecionadas e buscador inteligente do YouTube.
                  </p>
                </div>
              </div>

              {/* Header Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('pip')}
                  className="px-3 py-1.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 text-sky-300 border border-blue-400/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Destacar player em modo flutuante (PIP)"
                >
                  <Tv className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Modo PIP</span>
                </button>

                <button
                  onClick={() => setViewMode('pill')}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Minimizar para Barra Flutuante"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setViewMode('minimized')}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Ocultar Studio"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* STUDIO NAVIGATION TABS */}
            <div className="flex items-center gap-1 px-4 sm:px-6 bg-slate-900/60 border-b border-slate-800 overflow-x-auto scrollbar-none shrink-0">
              <button
                onClick={() => setStudioTab('radios-nat')}
                className={`py-3 px-3 sm:px-4 text-xs font-heading font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  studioTab === 'radios-nat'
                    ? 'border-[#FFC72C] text-[#FFC72C]'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Globe className="w-4 h-4 text-purple-400" />
                <span>Rádios Nacionais</span>
              </button>

              <button
                onClick={() => setStudioTab('youtube')}
                className={`py-3 px-3 sm:px-4 text-xs font-heading font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  studioTab === 'youtube'
                    ? 'border-[#FFC72C] text-[#FFC72C]'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Search className="w-4 h-4 text-amber-400" />
                <span>Pesquisa & YouTube HD</span>
              </button>

              <button
                onClick={() => setStudioTab('queue')}
                className={`py-3 px-3 sm:px-4 text-xs font-heading font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  studioTab === 'queue'
                    ? 'border-[#FFC72C] text-[#FFC72C]'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <ListMusic className="w-4 h-4 text-sky-400" />
                <span>Fila ({queue.length})</span>
              </button>

              <button
                onClick={() => setStudioTab('adblock')}
                className={`py-3 px-3 sm:px-4 text-xs font-heading font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  studioTab === 'adblock'
                    ? 'border-[#FFC72C] text-[#FFC72C]'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Bloqueador & EQ</span>
              </button>
            </div>

            {/* TAB CONTENT (Scrollable Area) */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

              {/* =========================================================
                  STUDIO TOP THEATER STAGE (VÍDEO AO VIVO & CONTROLE)
              ========================================================= */}
              <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-4 sm:p-5 shadow-2xl space-y-4">
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                  
                  {/* Left: Video / Artwork Screen */}
                  <div className="w-full md:w-80 h-48 sm:h-52 rounded-2xl overflow-hidden bg-black border-2 border-slate-700 relative shrink-0 shadow-lg">
                    {!isDirectAudioStream && currentTrack?.youtubeId && !isAudioOnly ? (
                      <iframe
                        key={`stage-yt-${currentTrack.youtubeId}`}
                        className="w-full h-full object-cover"
                        src={cleanEmbedUrl}
                        title={currentTrack.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 p-4 text-center relative">
                        <img
                          src={currentTrack.coverImage || `https://img.youtube.com/vi/${currentTrack.youtubeId}/hqdefault.jpg`}
                          alt={currentTrack.title}
                          className="absolute inset-0 w-full h-full object-cover opacity-25 blur-xs"
                        />
                        <div className="relative z-10 flex flex-col items-center">
                          <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#FFC72C] shadow-lg mb-2 relative">
                            <img
                              src={currentTrack.coverImage || `https://img.youtube.com/vi/${currentTrack.youtubeId}/hqdefault.jpg`}
                              alt={currentTrack.title}
                              className="w-full h-full object-cover"
                            />
                            {isPlaying && (
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <Signal className="w-6 h-6 text-[#FFC72C] animate-pulse" />
                              </div>
                            )}
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-amber-400 text-slate-950 rounded-md">
                            {isDirectAudioStream ? 'Transmissão de Rádio' : 'Modo Áudio Puro'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right: Track Info & Quick Actions */}
                  <div className="flex-1 flex flex-col justify-between space-y-3 min-w-0">
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-[#FFC72C] text-[#0B3D91] rounded-md">
                          {currentTrack.category}
                        </span>
                        {isDirectAudioStream && (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                            AO VIVO DIGITAL
                          </span>
                        )}
                        {!isDirectAudioStream && (
                          <span className="text-[10px] font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-md border border-sky-500/20">
                            YOUTUBE PURESTREAM
                          </span>
                        )}
                      </div>

                      <h3 className="font-heading font-black text-lg sm:text-xl text-white line-clamp-2">
                        {currentTrack.title}
                      </h3>
                      <p className="text-sm font-medium text-slate-300">
                        {currentTrack.artist}
                      </p>
                      {currentTrack.description && (
                        <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                          {currentTrack.description}
                        </p>
                      )}
                    </div>

                    {/* Stage Controls & Switches */}
                    <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-800">
                      <button
                        onClick={togglePlay}
                        className="px-4 py-2 bg-[#FFC72C] hover:bg-amber-400 text-[#0B3D91] font-heading font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 shadow-md cursor-pointer"
                      >
                        {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                        <span>{isPlaying ? 'Pausar' : 'Reproduzir'}</span>
                      </button>

                      {!isDirectAudioStream && (
                        <button
                          onClick={() => setIsAudioOnly(!isAudioOnly)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border ${
                            isAudioOnly
                              ? 'bg-slate-800 text-slate-300 border-slate-700'
                              : 'bg-blue-600/30 text-sky-300 border-blue-400/40'
                          }`}
                        >
                          <Tv className="w-3.5 h-3.5" />
                          <span>{isAudioOnly ? 'Ligar Vídeo' : 'Modo Vídeo Ativo'}</span>
                        </button>
                      )}

                      <button
                        onClick={() => setViewMode('pip')}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                        title="Destacar como vídeo flutuante na tela"
                      >
                        <Maximize2 className="w-3.5 h-3.5 text-[#FFC72C]" />
                        <span>Flutuar (PIP)</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* =========================================================
                  TAB: RÁDIOS NACIONAIS (RS & BRASIL)
              ========================================================= */}
              {studioTab === 'radios-nat' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="bg-gradient-to-r from-purple-950/80 via-slate-900 to-slate-900 p-4 rounded-2xl border border-purple-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="font-heading font-black text-sm text-white flex items-center gap-2">
                        <Globe className="w-4 h-4 text-[#FFC72C]" />
                        <span>Rádios Nacionais Selecionadas</span>
                      </h4>
                      <p className="text-xs text-slate-400">
                        Rádio Gaúcha, Rádio Atlântida FM e Rádio Super Jovem FM com transmissão direta e áudio digital puro.
                      </p>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
                      ● {NATIONAL_RADIOS.length} Emissoras Nacionais
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {NATIONAL_RADIOS.map((radio) => {
                      const isCurrent = isTrackActive(radio) && isPlaying;
                      return (
                        <div
                          key={radio.id}
                          onClick={() => handlePlayTrack(radio)}
                          className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer group ${
                            isCurrent
                              ? 'bg-purple-950 border-[#FFC72C] shadow-lg shadow-purple-500/10 ring-2 ring-[#FFC72C]/40'
                              : 'bg-slate-900 hover:bg-slate-850 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-start gap-3 mb-2">
                            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 relative bg-slate-800 border border-slate-700">
                              <img
                                src={radio.coverImage}
                                alt={radio.title}
                                className="w-full h-full object-cover"
                              />
                              {isCurrent && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                  <Signal className="w-5 h-5 text-[#FFC72C] animate-pulse" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-1 mb-0.5">
                                <span className="text-[9px] font-black uppercase px-1.5 py-0.2 bg-purple-500 text-white rounded">
                                  {radio.badge || 'NACIONAL'}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {radio.radioFrequency}
                                </span>
                              </div>
                              <h5 className="font-heading font-black text-xs text-white truncate group-hover:text-amber-300 transition-colors">
                                {radio.title}
                              </h5>
                              <p className="text-[11px] text-slate-400 truncate">
                                {radio.artist}
                              </p>
                            </div>
                          </div>

                          <p className="text-[11px] text-slate-400 line-clamp-2 mb-3">
                            {radio.description}
                          </p>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                              Digital Live Stream
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isCurrent) {
                                  togglePlay();
                                } else {
                                  handlePlayTrack(radio);
                                }
                              }}
                              className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                                isCurrent
                                  ? 'bg-[#FFC72C] text-[#0B3D91]'
                                  : 'bg-slate-800 text-white hover:bg-slate-700'
                              }`}
                            >
                              {isCurrent ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                              <span>{isCurrent ? 'Tocando' : 'Sintonizar'}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* =========================================================
                  TAB 3: BUSCA UNIVERSAL NO YOUTUBE
              ========================================================= */}
              {studioTab === 'youtube' && (
                <div className="space-y-5 animate-fadeIn">
                  {/* Search Bar & Auto-Complete */}
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Pesquisar qualquer música, cantor, banda ou vídeo no YouTube (ex: Keane, Coldplay, Alok, Olodum, Ivete)..."
                        className="w-full pl-12 pr-10 py-3.5 bg-slate-900 border border-slate-700 rounded-2xl text-sm font-medium text-white placeholder:text-slate-400 focus:outline-hidden focus:border-[#FFC72C] focus:ring-2 focus:ring-[#FFC72C]/20 transition-all shadow-inner"
                      />
                      {searchQuery ? (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="w-6 h-6 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center transition-colors cursor-pointer text-xs"
                        >
                          ✕
                        </button>
                      ) : (
                        isSearchingOnline && (
                          <RefreshCw className="w-4 h-4 text-amber-400 animate-spin absolute right-4 top-1/2 -translate-y-1/2" />
                        )
                      )}
                    </div>

                    {/* Quick Category Filters */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                      {[
                        'Todos',
                        'Pop & Rock Internacional',
                        'Hits Brasil & Mundo',
                        'Sertanejo & Piseiro',
                        'Axé Retrô',
                        'Pagodão Baiano',
                        'Samba-Reggae',
                        'Carnaval de Salvador',
                        'MPB Baiana',
                        'Trap & Nova Bahia',
                      ].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategoryFilter(cat)}
                          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer ${
                            selectedCategoryFilter === cat
                              ? 'bg-[#FFC72C] text-[#0B3D91]'
                              : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Direct Link Importer */}
                  <form
                    onSubmit={handleImportCustomUrl}
                    className="p-3.5 bg-slate-900/80 rounded-2xl border border-dashed border-slate-700 flex flex-col sm:flex-row items-center gap-2.5"
                  >
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-300 shrink-0">
                      <LinkIcon className="w-4 h-4" />
                      <span>Colar Link do YouTube:</span>
                    </div>
                    <input
                      type="text"
                      value={customUrlInput}
                      onChange={(e) => setCustomUrlInput(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=... ou https://youtu.be/..."
                      className="flex-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-[#FFC72C]"
                    />
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-4 py-2 bg-[#FFC72C] hover:bg-amber-400 text-[#0B3D91] font-heading font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-md"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Tocar Vídeo</span>
                    </button>
                  </form>

                  {/* Search Results Grid */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-heading font-black text-xs text-slate-400 uppercase tracking-wider">
                        Resultados ({searchResults.length} Músicas / Vídeos)
                      </h4>
                      <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Bloqueador de anúncios ativo
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {searchResults.map((track) => {
                        const isCurrent = isTrackActive(track) && isPlaying;
                        return (
                          <div
                            key={track.id}
                            onClick={() => handlePlayTrack(track)}
                            className={`p-3 rounded-2xl border transition-all flex flex-col justify-between group cursor-pointer ${
                              isCurrent
                                ? 'bg-blue-950 border-amber-400 shadow-md ring-1 ring-amber-400/30'
                                : 'bg-slate-900 hover:bg-slate-850 border-slate-800'
                            }`}
                          >
                            <div className="flex items-start gap-3 mb-2.5">
                              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 relative bg-slate-800 border border-slate-700">
                                <img
                                  src={track.coverImage || `https://img.youtube.com/vi/${track.youtubeId}/hqdefault.jpg`}
                                  alt={track.title}
                                  className="w-full h-full object-cover"
                                />
                                {isCurrent && (
                                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <span className="text-[9px] font-bold text-amber-300 bg-amber-400/10 px-1.5 py-0.2 rounded inline-block mb-1">
                                  {track.category}
                                </span>
                                <h5 className="font-heading font-black text-xs text-white line-clamp-2 group-hover:text-amber-300 transition-colors">
                                  {track.title}
                                </h5>
                                <p className="text-[11px] text-slate-400 truncate">
                                  {track.artist}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                              <span className="text-[10px] text-slate-400">
                                {track.duration || 'HD'}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={(e) => handleAddToQueue(track, e)}
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                                  title="Adicionar à fila"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (isCurrent) {
                                      togglePlay();
                                    } else {
                                      handlePlayTrack(track);
                                    }
                                  }}
                                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer ${
                                    isCurrent
                                      ? 'bg-[#FFC72C] text-[#0B3D91]'
                                      : 'bg-[#0B3D91] hover:bg-blue-800 text-white'
                                  }`}
                                >
                                  {isCurrent ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                                  <span>{isCurrent ? 'Pausar' : 'Tocar'}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================
                  TAB 4: FILA DE REPRODUÇÃO
              ========================================================= */}
              {studioTab === 'queue' && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-heading font-black text-sm text-white flex items-center gap-2">
                        <ListMusic className="w-4 h-4 text-[#FFC72C]" />
                        <span>Fila de Reprodução Atual ({queue.length} Faixas)</span>
                      </h4>
                      <p className="text-xs text-slate-400">
                        Reprodução ininterrupta que continua tocando mesmo ao trocar de aba ou página.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsShuffle(!isShuffle)}
                        className={`p-2 rounded-xl border text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer ${
                          isShuffle
                            ? 'bg-[#FFC72C] text-[#0B3D91] border-[#FFC72C]'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                        title="Modo Aleatório"
                      >
                        <Shuffle className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Aleatório</span>
                      </button>

                      <button
                        onClick={handleClearQueue}
                        className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-800 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                        title="Limpar Fila"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Limpar</span>
                      </button>
                    </div>
                  </div>

                  {/* Queue Items List */}
                  <div className="space-y-2">
                    {queue.map((track, idx) => {
                      const isCurrent = idx === currentTrackIndex;
                      return (
                        <div
                          key={`${track.id}-${idx}`}
                          onClick={() => {
                            setCurrentTrackIndex(idx);
                            setIsPlaying(true);
                          }}
                          className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                            isCurrent
                              ? 'bg-blue-950/90 border-[#FFC72C] ring-1 ring-[#FFC72C]/40 shadow-md'
                              : 'bg-slate-900/70 hover:bg-slate-850 border-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 font-bold text-xs text-amber-300">
                              {isCurrent && isPlaying ? (
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                              ) : (
                                idx + 1
                              )}
                            </div>

                            <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-slate-700 bg-slate-800">
                              <img
                                src={track.coverImage || `https://img.youtube.com/vi/${track.youtubeId}/hqdefault.jpg`}
                                alt={track.title}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            <div className="min-w-0">
                              <p className="text-xs font-black text-white truncate">
                                {track.title}
                              </p>
                              <p className="text-[11px] text-slate-400 truncate">
                                {track.artist} • <span className="text-amber-300">{track.category}</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isCurrent) {
                                  togglePlay();
                                } else {
                                  setCurrentTrackIndex(idx);
                                  setIsPlaying(true);
                                }
                              }}
                              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                                isCurrent && isPlaying
                                  ? 'bg-[#FFC72C] text-[#0B3D91]'
                                  : 'bg-slate-800 text-white hover:bg-slate-700'
                              }`}
                            >
                              {isCurrent && isPlaying ? (
                                <Pause className="w-3.5 h-3.5 fill-current" />
                              ) : (
                                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                              )}
                            </button>

                            {queue.length > 1 && (
                              <button
                                onClick={(e) => handleRemoveFromQueue(idx, e)}
                                className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-rose-900/60 text-slate-400 hover:text-rose-200 flex items-center justify-center transition-colors cursor-pointer"
                                title="Remover da fila"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* =========================================================
                  TAB 5: BLOQUEADOR & EQUALIZADOR
              ========================================================= */}
              {studioTab === 'adblock' && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Adblock Shield Panel */}
                  <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 p-5 rounded-3xl border border-emerald-900/60 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                        <ShieldCheck className="w-7 h-7" />
                      </div>
                      <div>
                        <h4 className="font-heading font-black text-sm text-white">
                          PureStream™ Bloqueador de Anúncios Ativo
                        </h4>
                        <p className="text-xs text-slate-400">
                          Intercepta comerciais de rádio e banners automáticos do YouTube.
                        </p>
                      </div>
                    </div>

                    <div className="px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-right shrink-0">
                      <span className="text-2xl font-black text-emerald-400 font-mono">
                        {blockedAdsCount}
                      </span>
                      <p className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">
                        Anúncios Bloqueados
                      </p>
                    </div>
                  </div>

                  {/* Equalizer Presets */}
                  <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-heading font-black text-sm text-white flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-amber-400" />
                        <span>Equalizador & Modos Acústicos da Bahia</span>
                      </h4>
                      <span className="text-xs text-amber-300 font-bold uppercase">
                        {audioPreset}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { id: 'paredao', label: 'Paredão SSA', desc: 'Graves reforçados para pagodão e axé' },
                        { id: 'trio', label: 'Trio Elétrico', desc: 'Médios e agudos brilhantes de Carnaval' },
                        { id: 'acustico', label: 'Voz & Violão', desc: 'Clareza vocal para MPB e Bossa' },
                        { id: 'flat', label: 'Original Studio', desc: 'Resposta plana de alta fidelidade' },
                      ].map((preset) => (
                        <button
                          key={preset.id}
                          onClick={() => setAudioPreset(preset.id as any)}
                          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                            audioPreset === preset.id
                              ? 'bg-amber-400/10 border-[#FFC72C] text-white ring-1 ring-[#FFC72C]/30'
                              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <span className="block font-heading font-black text-xs text-white mb-0.5">
                            {preset.label}
                          </span>
                          <span className="text-[10px] text-slate-400 block leading-tight">
                            {preset.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sleep Timer Setup */}
                  <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-heading font-black text-sm text-white flex items-center gap-2">
                        <Clock className="w-4 h-4 text-sky-400" />
                        <span>Timer de Desligamento Automático</span>
                      </h4>
                      {sleepTimerRemaining !== null && (
                        <span className="text-xs font-mono font-bold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-lg">
                          Desliga em: {formatTime(sleepTimerRemaining)}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {[15, 30, 45, 60, 90].map((mins) => (
                        <button
                          key={mins}
                          onClick={() => setSleepTimerMinutes(mins)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                            sleepTimerMinutes === mins
                              ? 'bg-sky-500 text-white'
                              : 'bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          {mins} min
                        </button>
                      ))}
                      {sleepTimerMinutes !== null && (
                        <button
                          onClick={() => setSleepTimerMinutes(null)}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 transition-colors cursor-pointer"
                        >
                          Desativar Timer
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* STUDIO BOTTOM MASTER CONTROLS */}
            <div className="p-3 sm:p-4 bg-slate-900/95 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              {/* Left: Current Track Mini */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-800 shrink-0 border border-slate-700">
                  <img
                    src={currentTrack.coverImage || `https://img.youtube.com/vi/${currentTrack.youtubeId}/hqdefault.jpg`}
                    alt={currentTrack.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black text-white truncate max-w-[200px] sm:max-w-[260px]">
                    {currentTrack.title}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {currentTrack.artist}
                  </p>
                </div>
              </div>

              {/* Center: Play / Pause / Skip */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrevTrack}
                  className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Anterior"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-full bg-[#FFC72C] hover:bg-amber-400 text-[#0B3D91] flex items-center justify-center transition-transform active:scale-95 cursor-pointer shadow-lg shadow-amber-400/20 font-bold"
                  title={isPlaying ? 'Pausar' : 'Reproduzir'}
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                </button>

                <button
                  onClick={handleNextTrack}
                  className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Próxima"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              {/* Right: Master Volume */}
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-slate-400 hover:text-white cursor-pointer"
                  title={isMuted ? 'Desmutar' : 'Mutar'}
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    const newVol = parseFloat(e.target.value);
                    setVolume(newVol);
                    if (isMuted && newVol > 0) setIsMuted(false);
                  }}
                  className="w-24 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#FFC72C]"
                />
                <span className="text-[10px] font-mono text-slate-400 w-8 text-right">
                  {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

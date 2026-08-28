import React, { useState, useEffect } from 'react';
import {
  Camera,
  Eye,
  Maximize2,
  Minimize2,
  RefreshCw,
  MapPin,
  ShieldCheck,
  Radio,
  Tv,
  Car,
  Waves,
  Sparkles,
  Building,
  Train,
  Ship,
  Sun,
  Moon,
  Clock,
  ExternalLink,
  Filter,
  CheckCircle2,
  X,
  Volume2,
  VolumeX,
} from 'lucide-react';

export interface PublicCameraItem {
  id: string;
  name: string;
  location: string;
  neighborhood: string;
  zone: 'Orla & Praias' | 'Centro Histórico' | 'Avenidas & Trânsito' | 'Metrô & Terminais' | 'Ferry-Boat';
  sourceAgency: 'Transalvador NOA' | 'CCR Metrô Bahia CCO' | 'Clima Ao Vivo Salvador' | 'Rede Orla Bahia' | 'Defesa Civil SSA';
  status: 'online' | 'live';
  resolution: string;
  trafficStatus: 'Livre' | 'Moderado' | 'Intenso' | 'Normal';
  previewImage: string;
  liveVideoUrl?: string; // YouTube embed or streaming source
  description: string;
  coordinates: { lat: number; lng: number };
  popularFor: string;
}

export const SALVADOR_PUBLIC_CAMERAS: PublicCameraItem[] = [
  {
    id: 'cam-farol-barra',
    name: 'Câmera 01: Farol da Barra & Av. Oceânica',
    location: 'Largo do Farol da Barra',
    neighborhood: 'Barra',
    zone: 'Orla & Praias',
    sourceAgency: 'Clima Ao Vivo Salvador',
    status: 'live',
    resolution: '1080p Full HD',
    trafficStatus: 'Livre',
    previewImage: 'https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?auto=format&fit=crop&w=800&q=80',
    liveVideoUrl: 'https://www.youtube.com/embed/F13V7s8_b2I?autoplay=1&mute=1&controls=0&loop=1',
    description: 'Vista panorâmica do Farol de Santo Antônio, Praia do Farol e calçadão da Barra com monitoramento de marés e brisa marítima.',
    coordinates: { lat: -13.0104, lng: -38.5327 },
    popularFor: 'Pôr do Sol, Surf & Passeio na Orla',
  },
  {
    id: 'cam-porto-barra',
    name: 'Câmera 02: Praia do Porto da Barra',
    location: 'Rua Forte de São Diogo',
    neighborhood: 'Barra',
    zone: 'Orla & Praias',
    sourceAgency: 'Rede Orla Bahia',
    status: 'live',
    resolution: '1080p HD',
    trafficStatus: 'Moderado',
    previewImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    description: 'Enseada do Porto da Barra, águas calmas da Baía de Todos os Santos e movimentação de banhistas.',
    coordinates: { lat: -13.0042, lng: -38.5332 },
    popularFor: 'Banho de Mar, SUP & Mergulho',
  },
  {
    id: 'cam-pelourinho-largo',
    name: 'Câmera 03: Largo do Pelourinho & Casa de Jorge Amado',
    location: 'Largo do Pelourinho, Centro Histórico',
    neighborhood: 'Pelourinho',
    zone: 'Centro Histórico',
    sourceAgency: 'Defesa Civil SSA',
    status: 'live',
    resolution: '1080p Full HD',
    trafficStatus: 'Livre',
    previewImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    description: 'Casario colonial barroco, ladeira do Pelô e palco cultural tradicional do Olodum.',
    coordinates: { lat: -12.9718, lng: -38.5081 },
    popularFor: 'Turismo, Gastronomia & Cultura Baiana',
  },
  {
    id: 'cam-elevador-lacerda',
    name: 'Câmera 04: Elevador Lacerda & Baía de Todos os Santos',
    location: 'Praça Tomé de Souza • Comércio',
    neighborhood: 'Centro / Comércio',
    zone: 'Centro Histórico',
    sourceAgency: 'Transalvador NOA',
    status: 'live',
    resolution: '1080p Full HD',
    trafficStatus: 'Normal',
    previewImage: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80',
    description: 'Ligação entre Cidade Alta e Cidade Baixa com vista para o Mercado Modelo e Forte de São Marcelo.',
    coordinates: { lat: -12.9734, lng: -38.5134 },
    popularFor: 'Vista Panorâmica & Travessia Urbana',
  },
  {
    id: 'cam-tancredo-neves',
    name: 'Câmera 05: Av. Tancredo Neves & Salvador Shopping',
    location: 'Av. Tancredo Neves, altura do Viaduto Nelson Dahia',
    neighborhood: 'Caminho das Árvores',
    zone: 'Avenidas & Trânsito',
    sourceAgency: 'Transalvador NOA',
    status: 'live',
    resolution: '1080p HD',
    trafficStatus: 'Intenso',
    previewImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    description: 'Coração financeiro e empresarial de Salvador com monitoramento inteligente de fluxo viário em tempo real pelo NOA.',
    coordinates: { lat: -12.9806, lng: -38.4552 },
    popularFor: 'Trânsito Comercial, Empresas & Shoppings',
  },
  {
    id: 'cam-paralela',
    name: 'Câmera 06: Av. Luís Viana Filho (Paralela) • CAB',
    location: 'Av. Paralela, sentido Aeroporto / Centro',
    neighborhood: 'Paralela / CAB',
    zone: 'Avenidas & Trânsito',
    sourceAgency: 'Transalvador NOA',
    status: 'live',
    resolution: '1080p HD',
    trafficStatus: 'Moderado',
    previewImage: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=800&q=80',
    description: 'Principal artéria viária de ligação entre o Centro, CAB e o Litoral Norte com faixa expressa de ônibus e metrô.',
    coordinates: { lat: -12.9458, lng: -38.4312 },
    popularFor: 'Fluxo Metropolitano & Acesso Aeroporto',
  },
  {
    id: 'cam-rio-vermelho',
    name: 'Câmera 07: Rio Vermelho • Largo de Santana',
    location: 'Rua da Paciência / Casa de Iemanjá',
    neighborhood: 'Rio Vermelho',
    zone: 'Orla & Praias',
    sourceAgency: 'Rede Orla Bahia',
    status: 'live',
    resolution: '1080p Full HD',
    trafficStatus: 'Livre',
    previewImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    description: 'Vila boêmia dos acarajés de Dinha e Regina, Praia da Paciência e calçadão requalificado do Rio Vermelho.',
    coordinates: { lat: -13.0132, lng: -38.4905 },
    popularFor: 'Acarajé, Vida Noturna & Pescadores',
  },
  {
    id: 'cam-ferry-boat',
    name: 'Câmera 08: Terminal Marítimo de São Joaquim (Ferry-Boat)',
    location: 'Av. Engenheiro Oscar Pontes • Água de Meninos',
    neighborhood: 'Calçada / Comércio',
    zone: 'Ferry-Boat',
    sourceAgency: 'Defesa Civil SSA',
    status: 'live',
    resolution: '1080p HD',
    trafficStatus: 'Normal',
    previewImage: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80',
    description: 'Pátio de veículos, embarque de passageiros e fluxo das embarcações rumo à Ilha de Itaparica (Bom Despacho).',
    coordinates: { lat: -12.9554, lng: -38.5028 },
    popularFor: 'Travessia Marítima Salvador-Itaparica',
  },
  {
    id: 'cam-metro-lapa',
    name: 'Câmera 09: Estação da Lapa & Linha 1 do Metrô',
    location: 'Praça da Lapa • Subsolo Central',
    neighborhood: 'Nazaré / Centro',
    zone: 'Metrô & Terminais',
    sourceAgency: 'CCR Metrô Bahia CCO',
    status: 'live',
    resolution: '1080p HD',
    trafficStatus: 'Livre',
    previewImage: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80',
    description: 'Maior polo de integração de transporte de passageiros de Salvador com conexão direta entre ônibus urbanos e trens do metrô.',
    coordinates: { lat: -12.9818, lng: -38.5106 },
    popularFor: 'Mobilidade Urbana & Integração',
  },
  {
    id: 'cam-itapua',
    name: 'Câmera 10: Farol de Itapuã & Praia da Sereia',
    location: 'Praça Vinícius de Moraes • Itapuã',
    neighborhood: 'Itapuã',
    zone: 'Orla & Praias',
    sourceAgency: 'Clima Ao Vivo Salvador',
    status: 'live',
    resolution: '1080p Full HD',
    trafficStatus: 'Livre',
    previewImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    description: 'Cartão-postal eternizado por Vinícius e Toquinho, com piscinas naturais de corais e brisa oceânica contínua.',
    coordinates: { lat: -12.9525, lng: -38.3541 },
    popularFor: 'Cultura, Gastronomia de Frutos do Mar & Sol',
  },
  {
    id: 'cam-acm-pituba',
    name: 'Câmera 11: Av. ACM (Complexo Viário Pituba / Brotas)',
    location: 'Av. ACM x Rua Lucaia • Itaigara',
    neighborhood: 'Itaigara / Pituba',
    zone: 'Avenidas & Trânsito',
    sourceAgency: 'Transalvador NOA',
    status: 'live',
    resolution: '1080p HD',
    trafficStatus: 'Moderado',
    previewImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    description: 'Cruzamento vital do BRT Salvador e vias estruturais entre a Orla e a Região Central.',
    coordinates: { lat: -12.9965, lng: -38.4721 },
    popularFor: 'Trânsito de Salvador & Linhas BRT',
  },
  {
    id: 'cam-bonfim',
    name: 'Câmera 12: Colina Sagrada & Basílica do Senhor do Bonfim',
    location: 'Largo do Bonfim • Península Itapagipana',
    neighborhood: 'Bonfim / Ribeira',
    zone: 'Centro Histórico',
    sourceAgency: 'Defesa Civil SSA',
    status: 'live',
    resolution: '1080p Full HD',
    trafficStatus: 'Livre',
    previewImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    description: 'Santuário de fé, fitinhas do Bonfim e movimentação de moradores e turistas na histórica Cidade Baixa.',
    coordinates: { lat: -12.9234, lng: -38.5085 },
    popularFor: 'Fé, Tradição & Turismo Religioso',
  },
];

export const SalvadorPublicCameras: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState<string>('Todas');
  const [selectedCamera, setSelectedCamera] = useState<PublicCameraItem | null>(null);
  const [isFullscreenModalOpen, setIsFullscreenModalOpen] = useState(false);
  const [activeCamIndex, setActiveCamIndex] = useState(0);
  const [liveSeconds, setLiveSeconds] = useState(0);
  const [currentTime, setCurrentTime] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Clock tick in Salvador Time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'America/Bahia',
        })
      );
      setLiveSeconds((prev) => (prev + 1) % 60);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const zones = ['Todas', 'Orla & Praias', 'Centro Histórico', 'Avenidas & Trânsito', 'Metrô & Terminais', 'Ferry-Boat'];

  const filteredCameras = SALVADOR_PUBLIC_CAMERAS.filter((cam) => {
    const matchesZone = selectedZone === 'Todas' || cam.zone === selectedZone;
    const matchesSearch =
      cam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cam.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cam.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesZone && matchesSearch;
  });

  const handleOpenFullscreen = (cam: PublicCameraItem) => {
    setSelectedCamera(cam);
    setIsFullscreenModalOpen(true);
  };

  const getTrafficColor = (status: PublicCameraItem['trafficStatus']) => {
    switch (status) {
      case 'Livre':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Moderado':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Intenso':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-blue-50 text-[#0B3D91] border-blue-200';
    }
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header Info Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0B3D91] to-[#125BB5] text-white flex items-center justify-center shrink-0 shadow-md">
            <Camera className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-heading font-black text-slate-900 tracking-tight">
                Câmeras Públicas Ao Vivo de Salvador
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-black uppercase flex items-center gap-1 border border-rose-200">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
                TRANSMISSÃO 24H
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5 max-w-2xl">
              Imagens em tempo real fornecidas pela central do NOA Transalvador, CCR Metrô Bahia, Clima ao Vivo e monitoramento costeiro da Orla de Salvador.
            </p>
          </div>
        </div>

        {/* Live counter info */}
        <div className="flex items-center gap-2 self-start md:self-center shrink-0 bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold block leading-none">
              HORÁRIO DE SALVADOR
            </span>
            <span className="text-sm font-mono font-black text-[#0B3D91]">
              {currentTime || '12:00:00'}
            </span>
          </div>
          <div className="h-6 w-px bg-slate-200 mx-1"></div>
          <div className="flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 font-black text-[11px] rounded-xl">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>12 Câmeras Ativas</span>
          </div>
        </div>
      </div>

      {/* Zone Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 sm:pb-0 scrollbar-none">
          {zones.map((z) => (
            <button
              key={z}
              onClick={() => setSelectedZone(z)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-heading font-black tracking-tight whitespace-nowrap transition-all cursor-pointer ${
                selectedZone === z
                  ? 'bg-[#0B3D91] text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {z}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64 shrink-0">
          <input
            type="text"
            placeholder="Buscar por praia ou avenida..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white rounded-2xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0B3D91]"
          />
          <Camera className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Cameras Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredCameras.map((cam) => (
          <div
            key={cam.id}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              {/* Camera Frame Preview with Live Overlay */}
              <div className="relative aspect-16/9 bg-slate-950 overflow-hidden select-none">
                <img
                  src={cam.previewImage}
                  alt={cam.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />

                {/* Simulated live video grid scanline */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none"></div>

                {/* LIVE Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-0.5 bg-rose-600 text-white font-black text-[10px] uppercase rounded-md shadow-sm flex items-center gap-1 tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                    AO VIVO
                  </span>
                  <span className="px-2 py-0.5 bg-black/60 backdrop-blur-md text-white font-mono text-[9px] font-bold rounded-md">
                    {cam.resolution}
                  </span>
                </div>

                {/* Real-time Clock on Camera HUD */}
                <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>{currentTime}</span>
                </div>

                {/* Source Agency Badge */}
                <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] text-white font-bold flex items-center gap-1 border border-white/20">
                  <ShieldCheck className="w-3 h-3 text-[#FFC72C]" />
                  <span>{cam.sourceAgency}</span>
                </div>

                {/* Fullscreen Button */}
                <button
                  onClick={() => handleOpenFullscreen(cam)}
                  className="absolute bottom-3 right-3 p-2 bg-white/20 hover:bg-white/40 text-white backdrop-blur-md rounded-xl transition-all cursor-pointer shadow-md active:scale-95"
                  title="Expandir câmera ao vivo"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Camera Details */}
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-heading font-black text-xs sm:text-sm text-slate-900 line-clamp-1">
                      {cam.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#C1502E] shrink-0" />
                      <span>{cam.location}</span>
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase border shrink-0 ${getTrafficColor(
                      cam.trafficStatus
                    )}`}
                  >
                    Trânsito {cam.trafficStatus}
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed font-medium line-clamp-2">
                  {cam.description}
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-[#0B3D91] font-bold">
                📍 {cam.popularFor}
              </span>
              <button
                onClick={() => handleOpenFullscreen(cam)}
                className="px-3 py-1.5 bg-[#0B3D91] hover:bg-[#082C69] text-white text-[11px] font-heading font-black rounded-xl transition-all cursor-pointer flex items-center gap-1"
              >
                <Eye className="w-3 h-3" />
                <span>Ver Transmissão</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* FULLSCREEN CAMERA MODAL */}
      {isFullscreenModalOpen && selectedCamera && (
        <div className="fixed inset-0 z-70 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[95vh] text-white">
            {/* Modal Top Bar */}
            <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-1 bg-rose-600 text-white font-black text-xs uppercase rounded-lg shadow-sm flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                  AO VIVO
                </span>
                <div>
                  <h3 className="font-heading font-black text-sm sm:text-base text-white tracking-tight">
                    {selectedCamera.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    {selectedCamera.location} • {selectedCamera.sourceAgency}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-slate-800 rounded-xl text-xs font-mono text-emerald-400 border border-emerald-500/20">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{currentTime}</span>
                </div>
                <button
                  onClick={() => setIsFullscreenModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Video Frame */}
            <div className="relative aspect-16/9 bg-black flex items-center justify-center overflow-hidden">
              <img
                src={selectedCamera.previewImage}
                alt={selectedCamera.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none"></div>

              {/* HUD Status Overlay */}
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2">
                <div className="bg-black/75 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/20">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">
                    Status de Monitoramento
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                      Sinal Estável (1080p • 60 FPS)
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="text-xs font-bold text-[#FFC72C]">
                      Fluxo {selectedCamera.trafficStatus}
                    </span>
                  </div>
                </div>

                <div className="bg-black/75 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/20 text-right">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">
                    Coordenadas GPS
                  </span>
                  <span className="text-xs font-mono font-bold text-sky-300">
                    {selectedCamera.coordinates.lat.toFixed(4)}, {selectedCamera.coordinates.lng.toFixed(4)}
                  </span>
                </div>
              </div>
            </div>

            {/* Info & Description Footer */}
            <div className="p-4 sm:p-5 bg-slate-950 space-y-3">
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                {selectedCamera.description}
              </p>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-xs">
                <span className="text-slate-400 font-medium">
                  Fonte Oficial: <strong className="text-white">{selectedCamera.sourceAgency}</strong> • Sistema de Segurança & Mobilidade de Salvador
                </span>
                <button
                  onClick={() => setIsFullscreenModalOpen(false)}
                  className="px-4 py-2 bg-[#0B3D91] hover:bg-[#082C69] text-white font-heading font-black text-xs rounded-xl transition-all cursor-pointer"
                >
                  Fechar Câmera
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

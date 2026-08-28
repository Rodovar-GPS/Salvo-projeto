import React, { useState, useEffect } from 'react';
import {
  Sun,
  CloudSun,
  CloudRain,
  Droplets,
  Wind,
  Compass,
  Waves,
  Thermometer,
  Car,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Radio,
  Newspaper,
  ArrowRight,
  Share2,
  RefreshCw,
  Navigation,
  MapPin,
  Sparkles,
  ShieldAlert,
  Ship,
  Train,
  Check,
  Search,
  Filter,
  ExternalLink,
  Flame,
} from 'lucide-react';
import { Store } from '../types';
import { SalvadorSkyWeatherHero } from '../components/SalvadorSkyWeatherHero';
import { SALVO_DAILY_PLAYLIST, SalvoTrack } from '../components/FloatingRadioPlayer';

interface SalvadorLiveViewProps {
  onNavigateToTab: (tab: any) => void;
  onSelectStore?: (store: Store) => void;
  allStores?: Store[];
}

interface TrafficAvenue {
  id: string;
  name: string;
  region: string;
  status: 'free' | 'moderate' | 'slow' | 'heavy';
  statusText: string;
  avgSpeed: number;
  highlightText: string;
  updatedAt: string;
  iconType: 'avenue' | 'ferry' | 'metro';
}

interface WeatherDay {
  day: string;
  date: string;
  tempMax: number;
  tempMin: number;
  condition: string;
  icon: 'sun' | 'cloud-sun' | 'rain';
  rainProb: number;
}

interface SalvadorNewsItem {
  id: string;
  title: string;
  summary: string;
  category: 'Trânsito' | 'Clima & Defesa Civil' | 'Cultura & Cidade' | 'Economia & Bairros' | 'Utilidade Pública';
  time: string;
  imageUrl: string;
  source: string;
  readTime: string;
  isImportant?: boolean;
}

export const SalvadorLiveView: React.FC<SalvadorLiveViewProps> = ({
  onNavigateToTab,
  allStores = [],
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'weather' | 'traffic' | 'news' | 'radios'>('all');
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [newsSearch, setNewsSearch] = useState('');
  const [newsCategoryFilter, setNewsCategoryFilter] = useState<string>('Todas');

  // Live time in Salvador (UTC-3)
  const [currentTime, setCurrentTime] = useState<string>('');

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
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastRefreshed(new Date());
      setIsRefreshing(false);
    }, 600);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'SALVÔ - Clima, Trânsito & Notícias de Salvador',
        text: 'Confira as condições em tempo real de Salvador: clima, tábua de marés, trânsito nas principais avenidas e radar de notícias!',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Weather data
  const currentWeather = {
    temp: 29,
    feelsLike: 32,
    condition: 'Ensolarado com Brisa Tropical',
    humidity: 74,
    uvIndex: 9,
    uvStatus: 'Muito Alto (Use filtro solar)',
    windSpeed: 18,
    windDirection: 'Leste-Sudeste (Brisa do Atlântico)',
    rainProb: 10,
    airQuality: 'Boa (24 AQI)',
    sunrise: '05:46',
    sunset: '17:38',
  };

  // Tide schedule
  const tides = [
    { type: 'Baixa-mar (Maré Baixa)', time: '09:54', height: '0.4m', highlight: 'Piscinas naturais ideais em Stella Maris, Buracão e banho no Porto' },
    { type: 'Preamar (Maré Alta)', time: '16:18', height: '2.1m', highlight: 'Águas subindo na Orla de Amaralina, Ondina e Rio Vermelho' },
    { type: 'Baixa-mar (Maré Baixa)', time: '22:30', height: '0.5m', highlight: 'Maré baixa noturna' },
  ];

  // 5-day Forecast
  const forecast: WeatherDay[] = [
    { day: 'Hoje', date: '28 Ago', tempMax: 30, tempMin: 23, condition: 'Sol com poucas nuvens', icon: 'sun', rainProb: 10 },
    { day: 'Sexta', date: '29 Ago', tempMax: 29, tempMin: 24, condition: 'Parcialmente nublado', icon: 'cloud-sun', rainProb: 20 },
    { day: 'Sábado', date: '30 Ago', tempMax: 31, tempMin: 24, condition: 'Sol forte na orla', icon: 'sun', rainProb: 10 },
    { day: 'Domingo', date: '31 Ago', tempMax: 30, tempMin: 23, condition: 'Sol e mar calmo', icon: 'sun', rainProb: 15 },
    { day: 'Segunda', date: '01 Set', tempMax: 28, tempMin: 22, condition: 'Pancadas rápidas matinais', icon: 'rain', rainProb: 40 },
  ];

  // Salvador Avenues & Transit
  const trafficAvenues: TrafficAvenue[] = [
    {
      id: 'paralela',
      name: 'Av. Luís Viana Filho (Paralela)',
      region: 'Centro ⇄ Aeroporto / Lauro de Freitas',
      status: 'moderate',
      statusText: 'Fluxo Moderado',
      avgSpeed: 52,
      highlightText: 'Sentido Aeroporto fluindo livre. Sentido Centro lento próximo ao Shopping Paralela.',
      updatedAt: 'Agora há pouco',
      iconType: 'avenue',
    },
    {
      id: 'acm',
      name: 'Av. Antônio Carlos Magalhães (ACM)',
      region: 'Iguatemi • Itaigara • Pituba',
      status: 'slow',
      statusText: 'Trânsito Intenso',
      avgSpeed: 28,
      highlightText: 'Retenção na chegada ao Shopping da Bahia e ligação com Av. Juracy Magalhães.',
      updatedAt: 'Tempo real',
      iconType: 'avenue',
    },
    {
      id: 'orla',
      name: 'Av. Octávio Mangabeira (Orla Atlântica)',
      region: 'Barra ⇄ Rio Vermelho ⇄ Pituba ⇄ Itapuã',
      status: 'free',
      statusText: 'Fluxo Livre & Tranquilo',
      avgSpeed: 58,
      highlightText: 'Excelente fluidez em toda a extensão marítima com brisa litorânea.',
      updatedAt: 'Tempo real',
      iconType: 'avenue',
    },
    {
      id: 'tancredo_neves',
      name: 'Av. Tancredo Neves',
      region: 'Centro Empresarial & Financeiro',
      status: 'slow',
      statusText: 'Trânsito Lento',
      avgSpeed: 22,
      highlightText: 'Fluxo concentrado nas saídas do Salvador Shopping e cruzamentos comerciais.',
      updatedAt: 'Tempo real',
      iconType: 'avenue',
    },
    {
      id: 'bonoco',
      name: 'Av. Mário Leal Ferreira (Bonocô)',
      region: 'Dique do Tororó ⇄ Rótula do Abacaxi',
      status: 'free',
      statusText: 'Fluxo Livre',
      avgSpeed: 60,
      highlightText: 'Tráfego rápido nos dois sentidos, sem retenções nas alças de acesso.',
      updatedAt: 'Tempo real',
      iconType: 'avenue',
    },
    {
      id: 'garibaldi',
      name: 'Av. Anita Garibaldi / Reitor Miguel Calmon',
      region: 'Canela • Federação • Ondina',
      status: 'free',
      statusText: 'Fluxo Normal',
      avgSpeed: 50,
      highlightText: 'Acesso suave para a orla de Ondina e campus da UFBA.',
      updatedAt: 'Tempo real',
      iconType: 'avenue',
    },
    {
      id: 'suburbana',
      name: 'Av. Afrânio Peixoto (Suburbana)',
      region: 'Calçada ⇄ Lobato ⇄ Periperi ⇄ Paripe',
      status: 'moderate',
      statusText: 'Moderado com Semáforos',
      avgSpeed: 40,
      highlightText: 'Pequena lentidão na altura de Periperi; demais trechos fluindo normalmente.',
      updatedAt: 'Tempo real',
      iconType: 'avenue',
    },
    {
      id: 'ferry_boat',
      name: 'Ferry-Boat (Terminal São Joaquim ⇄ Bom Despacho)',
      region: 'Travessia Salvador ⇄ Ilha de Itaparica',
      status: 'moderate',
      statusText: 'Operação Regular (4 Ferries)',
      avgSpeed: 0,
      highlightText: 'Espera estimada: 35 a 50 min para veículos. Embarque de pedestres imediato. Navios: Ivete Sangalo, Zumbi dos Palmares, Maria Bethânia.',
      updatedAt: 'Atualizado pela ITS',
      iconType: 'ferry',
    },
    {
      id: 'metro_ssa',
      name: 'Sistema Metroviário (CCR Metrô Bahia)',
      region: 'Linha 1 (Lapa ⇄ Águas Claras) & Linha 2 (Acesso Norte ⇄ Aeroporto)',
      status: 'free',
      statusText: '100% Operacional',
      avgSpeed: 0,
      highlightText: 'Intervalo médio de 3 a 5 minutos entre trens. Todas as 20 estações com circulação plena e ar-condicionado.',
      updatedAt: 'Tempo real',
      iconType: 'metro',
    },
  ];

  // News radar
  const newsList: SalvadorNewsItem[] = [
    {
      id: 'news-1',
      title: 'Transalvador inicia operação de fluidez e monitoramento especial na Orla e Centro Histórico',
      summary: 'Equipes móveis com viaturas e videomonitoramento reforçam a orientação de condutores e pedestres nas principais vias turísticas de Salvador.',
      category: 'Trânsito',
      time: 'Há 18 minutos',
      imageUrl: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&w=800&q=80',
      source: 'Transalvador Notícias',
      readTime: '2 min de leitura',
      isImportant: true,
    },
    {
      id: 'news-2',
      title: 'Defesa Civil de Salvador (CODESAL) emite boletim meteorológico com tempo firme no litoral',
      summary: 'Predomínio de sol com ventos amenos na Baía de Todos os Santos. Nenhuma ocorrência de risco registrada em encostas nas últimas 24 horas.',
      category: 'Clima & Defesa Civil',
      time: 'Há 45 minutos',
      imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
      source: 'CODESAL Bahia',
      readTime: '3 min de leitura',
    },
    {
      id: 'news-3',
      title: 'Pelourinho e Rio Vermelho preparam programação cultural com ensaios e feiras gastronômicas',
      summary: 'Casarões históricos e praças boêmias recebem apresentações de samba de roda, percussão afro e festival de acarajé nos próximos dias.',
      category: 'Cultura & Cidade',
      time: 'Há 1 hora',
      imageUrl: 'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=800&q=80',
      source: 'Salvador Criativa',
      readTime: '4 min de leitura',
      isImportant: true,
    },
    {
      id: 'news-4',
      title: 'Comércio dos bairros de Salvador registra alta em ofertas e compras diretas sem taxa no SALVÔ',
      summary: 'Lojistas de Cajazeiras, Barra, Pituba e Liberdade divulgam promoções diárias com entrega rápida e pagamento via Pix aos soteropolitanos.',
      category: 'Economia & Bairros',
      time: 'Há 2 horas',
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      source: 'Economia Salvador',
      readTime: '3 min de leitura',
    },
    {
      id: 'news-5',
      title: 'Internacional Travessias opera com 4 embarcações no Ferry-Boat e saídas pontuais a cada hora',
      summary: 'Fluxo tranquilo no Terminal de São Joaquim rumo a Bom Despacho. Sistema de agendamento de vagas pela internet segue disponível.',
      category: 'Utilidade Pública',
      time: 'Há 3 horas',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      source: 'A Tarde Notícias',
      readTime: '2 min de leitura',
    },
  ];

  const filteredNews = newsList.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(newsSearch.toLowerCase()) ||
      item.summary.toLowerCase().includes(newsSearch.toLowerCase()) ||
      item.category.toLowerCase().includes(newsSearch.toLowerCase());
    const matchesCategory = newsCategoryFilter === 'Todas' || item.category === newsCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (status: TrafficAvenue['status']) => {
    switch (status) {
      case 'free':
        return (
          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Livre
          </span>
        );
      case 'moderate':
        return (
          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 font-bold text-xs rounded-full flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Moderado
          </span>
        );
      case 'slow':
      case 'heavy':
        return (
          <span className="px-2.5 py-1 bg-rose-100 text-rose-800 font-bold text-xs rounded-full flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            Intenso / Lento
          </span>
        );
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-6 animate-fadeIn overflow-x-hidden">
      {/* Top Breadcrumb & Live Header */}
      <div className="bg-gradient-to-br from-[#0B3D91] via-[#0E4A9E] to-[#125BB5] rounded-3xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden">
        {/* Background Subtle Bahia Elements */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute top-0 right-0 p-4 opacity-10 font-heading font-black text-7xl select-none">
          SSA
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-[#FFC72C] text-[#0B3D91] font-heading font-black text-xs uppercase tracking-wider rounded-full flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#0B3D91] animate-ping"></span>
                SALVADOR AO VIVO
              </span>
              <span className="px-3 py-1 bg-white/15 backdrop-blur-sm text-white text-xs font-bold rounded-full flex items-center gap-1.5 border border-white/20">
                <Clock className="w-3.5 h-3.5 text-[#FFC72C]" />
                <span>Horário Local: {currentTime || '12:00:00'}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-black tracking-tight text-white drop-shadow-sm">
              Clima, Trânsito & Notícias da Cidade
            </h1>
            <p className="text-sm sm:text-base text-blue-100 mt-1 max-w-2xl font-medium">
              Acompanhe a temperatura, tábua de marés das praias, engarrafamentos nas principais avenidas e as notícias mais importantes de Salvador em tempo real.
            </p>
          </div>

          {/* Refresh & Share Actions */}
          <div className="flex items-center gap-2 self-start md:self-center shrink-0">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-3.5 py-2.5 bg-white/15 hover:bg-white/25 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-2xl backdrop-blur-md border border-white/20 flex items-center gap-2 transition-all cursor-pointer shadow-sm"
              title="Atualizar dados em tempo real"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#FFC72C]' : ''}`} />
              <span>{isRefreshing ? 'Atualizando...' : 'Atualizar Agora'}</span>
            </button>

            <button
              onClick={handleShare}
              className="px-3.5 py-2.5 bg-[#FFC72C] hover:bg-[#F0B719] text-[#0B3D91] active:scale-95 font-heading font-black text-xs sm:text-sm rounded-2xl flex items-center gap-2 transition-all cursor-pointer shadow-md"
              title="Compartilhar informações de Salvador"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-700" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedLink ? 'Link Copiado!' : 'Compartilhar'}</span>
            </button>
          </div>
        </div>

        {/* Live Filter Tabs */}
        <div className="mt-6 pt-4 border-t border-white/15 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveSubTab('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-heading font-bold transition-all cursor-pointer ${
              activeSubTab === 'all'
                ? 'bg-white text-[#0B3D91] shadow-md scale-102'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Visão Geral Completa
          </button>
          <button
            onClick={() => setActiveSubTab('weather')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-heading font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeSubTab === 'weather'
                ? 'bg-white text-[#0B3D91] shadow-md scale-102'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Sun className="w-4 h-4 text-[#FFC72C]" />
            <span>Clima & Marés</span>
          </button>
          <button
            onClick={() => setActiveSubTab('traffic')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-heading font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeSubTab === 'traffic'
                ? 'bg-white text-[#0B3D91] shadow-md scale-102'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Car className="w-4 h-4 text-[#FFC72C]" />
            <span>Trânsito & Engarrafamentos</span>
          </button>
          <button
            onClick={() => setActiveSubTab('radios')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-heading font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeSubTab === 'radios'
                ? 'bg-white text-[#0B3D91] shadow-md scale-102'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Radio className="w-4 h-4 text-rose-400 animate-pulse" />
            <span>Rádio Salvô</span>
          </button>
          <button
            onClick={() => setActiveSubTab('news')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-heading font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeSubTab === 'news'
                ? 'bg-white text-[#0B3D91] shadow-md scale-102'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Newspaper className="w-4 h-4 text-[#FFC72C]" />
            <span>Radar de Notícias</span>
          </button>
        </div>
      </div>

      {/* =========================================================
          SECTION 1: CLIMA & PRAIAS DE SALVADOR (TEMPO REAL)
      ========================================================= */}
      {(activeSubTab === 'all' || activeSubTab === 'weather') && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Sun className="w-5 h-5 text-amber-600 animate-spin-slow" />
              </div>
              <div>
                <h2 className="text-xl font-heading font-black text-slate-900 flex items-center gap-2">
                  <span>Clima do Tempo em Salvador</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 animate-pulse">
                    Ao Vivo
                  </span>
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Céu em tempo real, nuvens em movimento, tábua de marés e previsão para o litoral baiano
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-block text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-xl">
              Estações: Barra • Rio Vermelho • Itapuã • Pelô
            </span>
          </div>

          {/* Dynamic Sky & Moving Clouds Weather Hero */}
          <SalvadorSkyWeatherHero onRefresh={handleRefresh} isRefreshing={isRefreshing} />

          {/* Weather Metrics & Tide Schedule */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Tábua de Marés (Salvador Beach Essential) */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Waves className="w-5 h-5 text-sky-600 animate-breeze" />
                  <h3 className="text-sm font-heading font-black text-slate-900">
                    Tábua de Marés de Salvador (Hoje)
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100">
                  Porto da Barra & Orla Atlântica
                </span>
              </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {tides.map((tide, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-2xl bg-sky-50/60 border border-sky-100 hover:bg-sky-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black text-sky-900">{tide.type}</span>
                        <span className="text-xs font-black text-sky-700 bg-white px-2 py-0.5 rounded-lg border border-sky-200 shadow-2xs">
                          {tide.height}
                        </span>
                      </div>
                      <div className="text-lg font-heading font-black text-[#0B3D91] mt-1">
                        {tide.time}
                      </div>
                      <p className="text-[10px] text-slate-600 mt-1 leading-tight font-medium">
                        {tide.highlight}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5-Day Forecast Grid */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
                <h3 className="text-sm font-heading font-black text-slate-900 mb-3 flex items-center gap-2">
                  <CloudSun className="w-4 h-4 text-amber-500" />
                  <span>Previsão para os Próximos 5 Dias em Salvador</span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {forecast.map((day, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-2xl text-center border transition-all ${
                        i === 0
                          ? 'bg-amber-50/80 border-amber-200 ring-1 ring-amber-300'
                          : 'bg-slate-50 border-slate-100 hover:bg-slate-100/80'
                      }`}
                    >
                      <span className="text-xs font-heading font-black text-slate-800 block">
                        {day.day}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold block">
                        {day.date}
                      </span>

                      <div className="my-2 flex justify-center">
                        {day.icon === 'sun' ? (
                          <Sun className="w-6 h-6 text-amber-500" />
                        ) : day.icon === 'cloud-sun' ? (
                          <CloudSun className="w-6 h-6 text-amber-600" />
                        ) : (
                          <CloudRain className="w-6 h-6 text-sky-500" />
                        )}
                      </div>

                      <div className="text-xs font-black text-slate-900">
                        {day.tempMax}° <span className="text-slate-400 font-normal">/ {day.tempMin}°</span>
                      </div>
                      <span className="text-[9px] text-slate-500 block truncate mt-0.5">
                        {day.condition}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

      {/* =========================================================
          SECTION 2: TRÂNSITO & ENGARRAFAMENTOS EM TEMPO REAL
      ========================================================= */}
      {(activeSubTab === 'all' || activeSubTab === 'traffic') && (
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#0B3D91] flex items-center justify-center font-bold">
                <Car className="w-5 h-5 text-[#0B3D91]" />
              </div>
              <div>
                <h2 className="text-xl font-heading font-black text-slate-900">
                  Trânsito & Engarrafamentos em Salvador
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Radar ao vivo das principais vias, avenidas arteriais, Ferry-Boat e Metrô da capital baiana
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>72% das Vias Fluindo Bem</span>
              </span>
            </div>
          </div>

          {/* Traffic Avenues Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {trafficAvenues.map((ave) => (
              <div
                key={ave.id}
                className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                        {ave.iconType === 'ferry' ? (
                          <Ship className="w-4 h-4 text-blue-600" />
                        ) : ave.iconType === 'metro' ? (
                          <Train className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Car className="w-4 h-4 text-slate-700" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-sm font-heading font-black text-slate-900 leading-tight">
                          {ave.name}
                        </h3>
                        <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
                          {ave.region}
                        </span>
                      </div>
                    </div>

                    {getStatusBadge(ave.status)}
                  </div>

                  <p className="text-xs text-slate-600 mt-3 font-medium leading-relaxed bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                    {ave.highlightText}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                  <div className="flex items-center gap-1 text-slate-500">
                    <Clock className="w-3 h-3" />
                    <span>{ave.updatedAt}</span>
                  </div>
                  {ave.avgSpeed > 0 && (
                    <span className="font-bold text-slate-700">
                      Vel. Média: <strong className="text-[#0B3D91]">{ave.avgSpeed} km/h</strong>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Ferry-Boat & Metrô Highlight Banner */}
          <div className="bg-gradient-to-r from-blue-900 via-[#0B3D91] to-slate-900 rounded-3xl p-5 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                <Ship className="w-6 h-6 text-[#FFC72C]" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-heading font-black text-white">
                  Vai pegar o Ferry-Boat ou Metrô em Salvador?
                </h4>
                <p className="text-xs text-blue-100 font-medium mt-0.5">
                  Consulte os comércios e lanchonetes abertos próximos aos terminais de São Joaquim, Lapa, Pirajá e Aeroporto.
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigateToTab('explore')}
              className="px-4 py-2.5 bg-[#FFC72C] hover:bg-[#F0B719] active:scale-95 text-[#0B3D91] font-heading font-black text-xs rounded-2xl shadow-sm whitespace-nowrap transition-all cursor-pointer shrink-0 flex items-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Ver Lojas Próximas no Mapa</span>
            </button>
          </div>
        </section>
      )}

      {/* =========================================================
          SECTION 3: RÁDIO SALVÔ OFICIAL AO VIVO (YOUTUBE SEM PROPAGANDAS)
      ========================================================= */}
      {(activeSubTab === 'all' || activeSubTab === 'radios') && (
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-[#0B3D91] to-[#C1502E] text-white flex items-center justify-center font-bold shadow-sm">
                <Radio className="w-5 h-5 text-[#FFC72C] animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl font-heading font-black text-slate-900 flex items-center gap-2">
                  <span>Rádio Salvô Oficial</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FFC72C] text-[#0B3D91] font-black uppercase shadow-xs">
                    Transmissão 24h Oficial
                  </span>
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  O som autêntico de Salvador • Axé Music, Samba-Reggae, Pagodão Baiano e Carnaval sem propagandas
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              <span className="text-xs text-slate-500 font-medium bg-slate-100 px-3 py-1 rounded-xl">
                Player inteligente no canto da tela
              </span>
            </div>
          </div>

          {/* Radio Salvo Hero Studio Card */}
          <div className="bg-gradient-to-r from-[#0B3D91] via-[#0E4A9E] to-[#12335E] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white/15 backdrop-blur-md p-1.5 border-2 border-[#FFC72C] shadow-2xl flex items-center justify-center shrink-0">
                  <img
                    src="/salvo-logo.png"
                    alt="Rádio Salvô"
                    className="w-full h-full object-cover rounded-2xl"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://iili.io/CDs6WS1.jpg';
                    }}
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-0.5 rounded-md bg-[#FFC72C] text-[#0B3D91] font-black uppercase">
                      Estúdio Oficial
                    </span>
                    <span className="text-xs text-emerald-300 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                      Ao Vivo em Salvador
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-white">
                    Rádio Salvô SSA
                  </h3>
                  <p className="text-xs sm:text-sm text-sky-100 max-w-xl font-medium">
                    Grandes clássicos de Olodum, Timbalada, Ivete Sangalo, BaianaSystem, Harmonia do Samba, Léo Santana e Caetano Veloso selecionados diariamente.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <div className="text-center sm:text-right hidden sm:block">
                  <span className="text-[11px] text-amber-300 uppercase font-bold block">
                    Curadoria Diária
                  </span>
                  <span className="text-xs text-white/90 font-semibold">
                    Sem propagandas
                  </span>
                </div>
              </div>
            </div>

            {/* Faixas da Playlist de Salvador */}
            <div className="mt-6 pt-6 border-t border-white/15 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {SALVO_DAILY_PLAYLIST.slice(0, 4).map((track, i) => (
                <div
                  key={track.id}
                  className="bg-black/30 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 flex items-center gap-3 group hover:border-amber-300/60 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/10 overflow-hidden shrink-0 relative">
                    <img
                      src={track.coverImage}
                      alt={track.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-black text-white truncate">{track.title}</p>
                    <p className="text-[10px] text-sky-200 truncate">{track.artist}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================
          SECTION 4: RADAR DE NOTÍCIAS DE SALVADOR
      ========================================================= */}
      {(activeSubTab === 'all' || activeSubTab === 'news') && (
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                <Newspaper className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h2 className="text-xl font-heading font-black text-slate-900">
                  Radar de Notícias de Salvador
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Fatos marcantes, avisos da prefeitura, cultura, trânsito e novidades dos bairros soteropolitanos
                </p>
              </div>
            </div>

            {/* News Filter & Search */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar notícia..."
                  value={newsSearch}
                  onChange={(e) => setNewsSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/20 w-44"
                />
              </div>

              <select
                value={newsCategoryFilter}
                onChange={(e) => setNewsCategoryFilter(e.target.value)}
                className="py-1.5 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/20 cursor-pointer"
              >
                <option value="Todas">Todas Categorias</option>
                <option value="Trânsito">Trânsito</option>
                <option value="Clima & Defesa Civil">Clima & Defesa Civil</option>
                <option value="Cultura & Cidade">Cultura & Cidade</option>
                <option value="Economia & Bairros">Economia & Bairros</option>
                <option value="Utilidade Pública">Utilidade Pública</option>
              </select>
            </div>
          </div>

          {/* News Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNews.map((news) => (
              <article
                key={news.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                    <img
                      src={news.imageUrl}
                      alt={news.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 bg-[#0B3D91] text-white text-[10px] font-black uppercase tracking-wider rounded-lg shadow-sm">
                        {news.category}
                      </span>
                      {news.isImportant && (
                        <span className="px-2 py-1 bg-[#E8552B] text-white text-[10px] font-black uppercase tracking-wider rounded-lg shadow-sm">
                          Destaque
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 sm:p-5">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold mb-2">
                      <span>{news.source}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {news.time}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-heading font-black text-slate-900 leading-snug group-hover:text-[#0B3D91] transition-colors">
                      {news.title}
                    </h3>

                    <p className="text-xs text-slate-600 mt-2 font-medium leading-relaxed line-clamp-3">
                      {news.summary}
                    </p>
                  </div>
                </div>

                <div className="px-4 sm:px-5 pb-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium text-[11px]">
                    {news.readTime}
                  </span>

                  <button
                    onClick={() => {
                      // Friendly alert with full story modal or toast
                      alert(`📰 ${news.title}\n\n${news.summary}\n\nFonte: ${news.source} (${news.time})`);
                    }}
                    className="text-[#0B3D91] font-heading font-black hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Ler Completa</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Footer Salvador Local Note */}
      <div className="bg-slate-100 rounded-2xl p-4 text-center text-xs text-slate-500 font-medium border border-slate-200">
        SALVÔ SSA • Atualizações em tempo real integradas aos boletins oficiais de Salvador, Transalvador e Defesa Civil da Bahia.
      </div>
    </div>
  );
};

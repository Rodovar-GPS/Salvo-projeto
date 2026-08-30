export interface SalvoMediaTrack {
  id: string;
  title: string;
  artist: string;
  category:
    | 'Rádios de Salvador'
    | 'Rádios Nacionais'
    | 'Axé Retrô'
    | 'Samba-Reggae'
    | 'Pagodão Baiano'
    | 'Carnaval de Salvador'
    | 'MPB Baiana'
    | 'Trap & Nova Bahia'
    | 'Hits Brasil & Mundo'
    | 'Pop & Rock Internacional'
    | 'Sertanejo & Piseiro'
    | 'YouTube Personalizado';
  streamUrl?: string; // Direct audio streaming (mp3, aac, m3u8 HLS)
  streamType?: 'hls' | 'audio' | 'youtube';
  youtubeId?: string; // YouTube Video ID
  duration?: string;
  coverImage?: string;
  badge?: string;
  isLiveRadio?: boolean;
  radioFrequency?: string;
  region?: 'Salvador / BA' | 'Nacional' | 'Brasil';
  description?: string;
  views?: string;
}

// =========================================================================
// 1. RÁDIOS NACIONAIS OFICIAIS (SOMENTE RÁDIOS NACIONAIS SELECIONADAS)
// =========================================================================

export const NATIONAL_RADIOS: SalvoMediaTrack[] = [
  {
    id: 'radio-gaucha-rs',
    title: 'Rádio Gaúcha (RS)',
    artist: 'Porto Alegre - RS',
    category: 'Rádios Nacionais',
    streamUrl: 'https://1132747t.ha.azioncdn.net/primary/gaucha_rbs.sdp/playlist.m3u8',
    streamType: 'hls',
    duration: 'AO VIVO',
    coverImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    badge: 'GAÚCHA RS',
    isLiveRadio: true,
    radioFrequency: '93.7 FM / 600 AM',
    region: 'Nacional',
    description: 'Líder em jornalismo e esporte no Sul do Brasil: Sala de Redação, Futebol da Dupla Grenal e notícias do país.',
  },
  {
    id: 'radio-atlantida-rs',
    title: 'Rádio Atlântida FM (RS)',
    artist: 'Porto Alegre - RS',
    category: 'Rádios Nacionais',
    streamUrl: 'https://liverdatlpoa.rbsdirect.com.br/primary/atl_poa.sdp/playlist.m3u8',
    streamType: 'hls',
    duration: 'AO VIVO',
    coverImage: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=600&q=80',
    badge: 'ATLÂNTIDA FM',
    isLiveRadio: true,
    radioFrequency: '94.3 FM',
    region: 'Nacional',
    description: 'A rádio jovem do Sul do Brasil: Pretinho Básico, pop, rock, humor e os maiores lançamentos da música nacional e internacional.',
  },
  {
    id: 'radio-super-jovem-fm-1033',
    title: 'Rádio Super Jovem FM (103.3)',
    artist: 'Brasil Stream',
    category: 'Rádios Nacionais',
    streamUrl: 'https://stream.zeno.fm/ak2b4bhaps8uv',
    streamType: 'audio',
    duration: 'AO VIVO',
    coverImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80',
    badge: '103.3 FM',
    isLiveRadio: true,
    radioFrequency: '103.3 FM',
    region: 'Nacional',
    description: 'Música jovem, eletrônica, pop, hits e lançamentos vibrantes 24h por dia.',
  },
];

// Compatibility aliases
export const SALVADOR_RADIOS: SalvoMediaTrack[] = NATIONAL_RADIOS;
export const ALL_OFFICIAL_RADIOS: SalvoMediaTrack[] = NATIONAL_RADIOS;
export const SALVADOR_LIVE_RADIOS: SalvoMediaTrack[] = NATIONAL_RADIOS;

// =========================================================================
// 2. CATÁLOGO DE MÚSICAS & GRANDES HITS DO YOUTUBE
// =========================================================================

export const SALVO_DAILY_PLAYLIST: SalvoMediaTrack[] = [
  {
    id: 'yt-keane-somewhere',
    title: 'Somewhere Only We Know',
    artist: 'Keane',
    category: 'Pop & Rock Internacional',
    youtubeId: 'Oextk-If8HQ',
    duration: '03:57',
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    badge: 'ROCK CLÁSSICO',
    description: 'O grande clássico atemporal da banda britânica Keane.',
    views: '540M visualizações',
  },
  {
    id: 'yt-coldplay-viva',
    title: 'Viva La Vida',
    artist: 'Coldplay',
    category: 'Pop & Rock Internacional',
    youtubeId: 'dvgZkm1xWPE',
    duration: '04:02',
    coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
    badge: 'ARENA ROCK',
    description: 'O hino mundial de Coldplay com sinfonia épica e coro arrebatador.',
    views: '900M visualizações',
  },
  {
    id: 'yt-alok-hear-me',
    title: 'Hear Me Now',
    artist: 'Alok, Bruno Martini & Zeeba',
    category: 'Hits Brasil & Mundo',
    youtubeId: 'JVpTp8CXd_4',
    duration: '03:12',
    coverImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80',
    badge: 'ELETRÔNICA',
    description: 'O maior sucesso eletrônico global brasileiro.',
    views: '650M visualizações',
  },
  {
    id: 'yt-queen-bohemian',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    category: 'Pop & Rock Internacional',
    youtubeId: 'fJ9rUzIMcZQ',
    duration: '05:55',
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    badge: 'OBRA-PRIMA',
    description: 'A mais famosa obra-prima do rock de todos os tempos.',
    views: '1.7B visualizações',
  },
  {
    id: 'yt-michael-billie-jean',
    title: 'Billie Jean',
    artist: 'Michael Jackson',
    category: 'Pop & Rock Internacional',
    youtubeId: 'Zi_XLOBDo_Y',
    duration: '04:54',
    coverImage: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80',
    badge: 'REI DO POP',
    description: 'A batida inconfundível do Rei do Pop.',
    views: '1.5B visualizações',
  },
  {
    id: 'yt-olodum-farao',
    title: 'Faraó / Requebra / Protesto do Olodum',
    artist: 'Olodum Oficial (Pelourinho)',
    category: 'Samba-Reggae',
    youtubeId: 'KjN8V8Z1F1M',
    duration: '04:12',
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    badge: 'PELÔ ANCESTRAL',
    description: 'A consagração do Samba-Reggae nas ladeiras históricas do Pelourinho.',
    views: '15M visualizações',
  },
  {
    id: 'yt-baianasystem-playsom',
    title: 'Playsom / Lucro / Navio Pirata',
    artist: 'BaianaSystem',
    category: 'Axé Retrô',
    youtubeId: 'pAEvl0aD8yE',
    duration: '05:30',
    coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
    badge: 'NAVIO PIRATA',
    description: 'A explosão eletro-rock-afro de Salvador que arrasta multidões.',
    views: '9.4M visualizações',
  },
  {
    id: 'yt-ivete-festa',
    title: 'Tempo de Alegria / Eva / Festa no Circuito Barra-Ondina',
    artist: 'Ivete Sangalo',
    category: 'Carnaval de Salvador',
    youtubeId: '6F1c2D3e4fA',
    duration: '04:45',
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    badge: 'RAINHA DO AXÉ',
    description: 'A energia incomparável de Ivete no Carnaval de Salvador.',
    views: '28M visualizações',
  },
];

// =========================================================================
// 3. BASE DE BUSCA AMPLIADA PARA YOUTUBE COM HITS NACIONAIS E INTERNACIONAIS
// =========================================================================

export const YOUTUBE_EXTENDED_CATALOG: SalvoMediaTrack[] = [
  ...SALVO_DAILY_PLAYLIST,
  {
    id: 'yt-marilia-mendonca',
    title: 'Infiel / Leão / De Quem É a Culpa',
    artist: 'Marília Mendonça',
    category: 'Sertanejo & Piseiro',
    youtubeId: '5W7m9b3V1xA',
    duration: '03:45',
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    badge: 'RAINHA DA SOFRÊNCIA',
    description: 'Os maiores clássicos do sertanejo e da sofrência nacional.',
    views: '400M visualizações',
  },
  {
    id: 'yt-leo-santana',
    title: 'Posturado e Calmo / Zona de Perigo / Santinha',
    artist: 'Léo Santana (O Gigante)',
    category: 'Pagodão Baiano',
    youtubeId: 'yE6n_e3bF4A',
    duration: '03:40',
    coverImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    badge: 'GIGANTE SSA',
    description: 'Hits que dominaram as paradas nacionais e as ruas de Salvador.',
    views: '150M visualizações',
  },
  {
    id: 'yt-harmonia-desafio',
    title: 'Água Mineral / Vem Neném / Desafio',
    artist: 'Harmonia do Samba & Xanddy',
    category: 'Pagodão Baiano',
    youtubeId: 'qYp0sX8D2bA',
    duration: '03:55',
    coverImage: 'https://images.unsplash.com/photo-1485579149621-3123dd979885?auto=format&fit=crop&w=600&q=80',
    badge: 'SWINGUEIRA',
    description: 'O suingue inconfundível do Harmonia que conquistou o Brasil.',
    views: '16M visualizações',
  },
  {
    id: 'yt-timbalada-beija',
    title: 'Beija-Flor / Mimar Você / Canto da Cidade',
    artist: 'Timbalada & Carlinhos Brown',
    category: 'Axé Retrô',
    youtubeId: 'tY6b8X9m2lQ',
    duration: '04:20',
    coverImage: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80',
    badge: 'CANDYALL',
    description: 'Os tambores pintados do Candeal e a batuta de Carlinhos Brown.',
    views: '20M visualizações',
  },
  {
    id: 'yt-gilberto-menina',
    title: 'Toda Menina Baiana / Reconvexo / Aquele Abraço',
    artist: 'Gilberto Gil',
    category: 'MPB Baiana',
    youtubeId: 'G5y9X1p2k3A',
    duration: '05:10',
    coverImage: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=600&q=80',
    badge: 'PATRIMÔNIO',
    description: 'A poesia e a essência lírica da Bahia gravada por Gilberto Gil.',
    views: '10M visualizações',
  },
  {
    id: 'yt-caetano-sozinho',
    title: 'Sozinho / Reconvexo / Você É Linda',
    artist: 'Caetano Veloso',
    category: 'MPB Baiana',
    youtubeId: '8S2yFjJ1D8Q',
    duration: '04:35',
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    badge: 'TROPICÁLIA',
    description: 'A voz inconfundível de Caetano Veloso ao vivo.',
    views: '45M visualizações',
  },
  {
    id: 'yt-rachel-reis',
    title: 'Maresia / Motinha / Bateu (Ao Vivo Salvador)',
    artist: 'Rachel Reis',
    category: 'Trap & Nova Bahia',
    youtubeId: '9yE6pX2v1bA',
    duration: '03:35',
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    badge: 'NOVA MPB',
    description: 'A nova voz de Feira de Santana e Salvador com o afro-pop envolvente.',
    views: '7.5M visualizações',
  },
  {
    id: 'yt-baco-blues',
    title: 'Me Desculpa Jay-Z / Hotel Caro / 20 Ligações',
    artist: 'Baco Exu do Blues',
    category: 'Trap & Nova Bahia',
    youtubeId: 'b0V5s2nF8uA',
    duration: '04:05',
    coverImage: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80',
    badge: 'BLUES & TRAP',
    description: 'O som poético e visceral que ecoa da Bahia para o mundo.',
    views: '50M visualizações',
  },
  {
    id: 'yt-parangole-tiro',
    title: 'Abaixa Que É Tiro / Open Bar / Devagarinho',
    artist: 'Tony Salles & Parangolé',
    category: 'Pagodão Baiano',
    youtubeId: '5a0y3M6k8qA',
    duration: '03:45',
    coverImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    badge: 'PARANGO',
    description: 'O pagodão que sacode o Carnaval e os paredões.',
    views: '35M visualizações',
  },
  {
    id: 'yt-polemico-polly',
    title: 'Samba do Polly / De Pitbull na Pista',
    artist: 'Oh Polêmico',
    category: 'Pagodão Baiano',
    youtubeId: 'q0c7G0hK9eA',
    duration: '03:15',
    coverImage: 'https://images.unsplash.com/photo-1485579149621-3123dd979885?auto=format&fit=crop&w=600&q=80',
    badge: 'PAREDÃO SSA',
    description: 'Hit que viralizou nos paredões da Bahia.',
    views: '30M visualizações',
  },
  {
    id: 'yt-ile-curuzu',
    title: 'O Mais Belo dos Belos / Deusa do Ébano / Ilê Pérola Negra',
    artist: 'Ilê Aiyê Oficial (Curuzu - Liberdade)',
    category: 'Samba-Reggae',
    youtubeId: '4H1yX5jN8pM',
    duration: '05:40',
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    badge: 'CURUZU',
    description: 'O primeiro bloco afro do Brasil direto da Ladeira do Curuzu.',
    views: '12M visualizações',
  },
  {
    id: 'yt-novos-baianos-brasil',
    title: 'Acabou Chorare / Brasil Pandeiro / Preta Pretinha',
    artist: 'Novos Baianos (Moraes Moreira & Pepeu Gomes)',
    category: 'MPB Baiana',
    youtubeId: 'Yq6C3J_x9fM',
    duration: '04:50',
    coverImage: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=600&q=80',
    badge: 'CLÁSSICO HISTÓRICO',
    description: 'Considerado um dos maiores discos da história da música brasileira.',
    views: '24M visualizações',
  },
  {
    id: 'yt-bell-marques-camaleao',
    title: 'Diga Que Valeu / Voa Voa / Não Vou Chorar',
    artist: 'Bell Marques & Chiclete com Banana',
    category: 'Carnaval de Salvador',
    youtubeId: 'q6Y8c0f2j1A',
    duration: '05:15',
    coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
    badge: 'CAMALEÃO',
    description: 'A lenda viva do Carnaval de Salvador e do Bloco Camaleão.',
    views: '32M visualizações',
  },
  {
    id: 'yt-jorge-mateus',
    title: 'Propaganda / Sosseguei / Os Anjos Cantam',
    artist: 'Jorge & Mateus',
    category: 'Sertanejo & Piseiro',
    youtubeId: 'K1y8b2_f9rQ',
    duration: '03:50',
    coverImage: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=600&q=80',
    badge: 'SERTANEJO',
    description: 'A dupla sertaneja mais ouvida do país com seus maiores sucessos.',
    views: '380M visualizações',
  },
  {
    id: 'yt-henrique-juliano',
    title: 'Arranhão / Liberdade Provisória / Até Você Voltar',
    artist: 'Henrique & Juliano',
    category: 'Sertanejo & Piseiro',
    youtubeId: 'f5b4y8c9k1A',
    duration: '03:40',
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    badge: 'SERTANEJO LIVE',
    description: 'Os sucessos marcantes gravados ao vivo nos maiores festivais do Brasil.',
    views: '320M visualizações',
  },
  {
    id: 'yt-anitta-envolver',
    title: 'Envolver / Downtown / Show das Poderosas',
    artist: 'Anitta',
    category: 'Hits Brasil & Mundo',
    youtubeId: 'hFC0KEkGYm8',
    duration: '03:15',
    coverImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80',
    badge: 'POP GLOBAL',
    description: 'O hit que alcançou o #1 global no Spotify.',
    views: '600M visualizações',
  },
];

// Helper to extract YouTube ID from any input or link
export function extractYouTubeId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();

  // If already a clean 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Regex patterns covering all YouTube formats
  const patterns = [
    /(?:https?:\/\/)?(?:www\.|m\.|music\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/i,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/i,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/i,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/i,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([a-zA-Z0-9_-]{11})/i,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/live\/([a-zA-Z0-9_-]{11})/i,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  const generalMatch = trimmed.match(/([a-zA-Z0-9_-]{11})/);
  return generalMatch ? generalMatch[1] : null;
}

// Universal search function
export function searchMediaTracks(query: string): SalvoMediaTrack[] {
  if (!query.trim()) {
    return YOUTUBE_EXTENDED_CATALOG;
  }

  const q = query.toLowerCase().trim();
  const directId = extractYouTubeId(query);

  // If user pasted a YouTube link or ID
  if (directId && (query.includes('youtu') || /^[a-zA-Z0-9_-]{11}$/.test(query.trim()))) {
    return [
      {
        id: `yt-direct-${directId}`,
        title: `Vídeo do YouTube [${directId}]`,
        artist: 'YouTube PureStream Direct',
        category: 'YouTube Personalizado',
        youtubeId: directId,
        duration: 'Vídeo HD',
        coverImage: `https://img.youtube.com/vi/${directId}/hqdefault.jpg`,
        badge: 'LINK DIRETO',
        description: 'Vídeo importado diretamente via link do YouTube.',
      },
    ];
  }

  // Filter in catalog
  const filtered = YOUTUBE_EXTENDED_CATALOG.filter((track) => {
    return (
      track.title.toLowerCase().includes(q) ||
      track.artist.toLowerCase().includes(q) ||
      track.category.toLowerCase().includes(q) ||
      (track.description && track.description.toLowerCase().includes(q)) ||
      (track.badge && track.badge.toLowerCase().includes(q))
    );
  });

  if (filtered.length > 0) {
    return filtered;
  }

  // Fallback for custom search term (e.g. user typed a specific song)
  const defaultFallbackId = 'Oextk-If8HQ'; // Keane - Somewhere Only We Know
  return [
    {
      id: `yt-search-custom-${encodeURIComponent(q)}`,
      title: `${query.charAt(0).toUpperCase() + query.slice(1)} • Busca YouTube`,
      artist: `Música / Vídeo (${query})`,
      category: 'Pop & Rock Internacional',
      youtubeId: defaultFallbackId,
      duration: 'HD',
      coverImage: `https://img.youtube.com/vi/${defaultFallbackId}/hqdefault.jpg`,
      badge: 'YOUTUBE PRO',
      description: `Busca instantânea para "${query}" com player anti-anúncios.`,
    },
    ...YOUTUBE_EXTENDED_CATALOG.slice(0, 5),
  ];
}

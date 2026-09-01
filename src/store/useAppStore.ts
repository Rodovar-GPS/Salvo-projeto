// ==============================================================================
// 🌊 SALVÔ STORE — GERENCIAMENTO DE ESTADO GLOBAL VIA ZUSTAND
// "A Cidade das Marés": Gamificação (Marés & Conchas), Modo Persona e Retenção
// ==============================================================================

import { create } from 'zustand';
import {
  User,
  ActiveTab,
  UserMaresGamification,
  ConchaItem,
  AcarajeRouletteResult,
  OndaDoDendeItem,
  HerancaDigitalRecado,
  PrevisaoMareData,
} from '../types';
import confetti from 'canvas-confetti';

export type UserPersonaMode = 'soteropolitano' | 'turista';

interface AppStoreState {
  // Usuário & Autenticação
  currentUser: User | null;
  userPersonaMode: UserPersonaMode;
  setUserPersonaMode: (mode: UserPersonaMode) => void;
  setCurrentUser: (user: User | null) => void;

  // Navegação Global
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;

  // Gamificação "Marés & Conchas"
  gamification: UserMaresGamification;
  addMares: (amount: number, reason?: string) => void;
  collectConcha: (neighborhood: string) => void;
  checkInBairro: (neighborhood: string) => void;
  claimReward: (rewardId: string) => void;

  // Mecânicas de Retenção & Vício
  isAcarajeRouletteOpen: boolean;
  setIsAcarajeRouletteOpen: (open: boolean) => void;
  activeRouletteResult: AcarajeRouletteResult | null;
  spinAcarajeRoulette: () => AcarajeRouletteResult;

  isOndaDoDendeOpen: boolean;
  setIsOndaDoDendeOpen: (open: boolean) => void;
  ondasDoDende: OndaDoDendeItem[];
  confirmPresenceOnda: (ondaId: string) => void;

  isHerancaDigitalOpen: boolean;
  setIsHerancaDigitalOpen: (open: boolean) => void;
  recadosDigitais: HerancaDigitalRecado[];
  postRecadoDigital: (recado: Omit<HerancaDigitalRecado, 'id' | 'createdAt' | 'likesCount'>) => void;
  likeRecadoDigital: (recadoId: string) => void;

  isPrevisaoMareOpen: boolean;
  setIsPrevisaoMareOpen: (open: boolean) => void;
  previsaoMare: PrevisaoMareData;

  // Toast / Notificação
  activeToast: { message: string; type: 'mare' | 'concha' | 'info' | 'alert' } | null;
  showToast: (message: string, type?: 'mare' | 'concha' | 'info' | 'alert') => void;
  hideToast: () => void;
}

// Initial Gamification State
const initialGamification: UserMaresGamification = {
  maresScore: 140,
  streakDays: 4,
  streakStatus: 'mare_cheia',
  depthLevel: 4,
  depthTitle: 'Orla',
  conchasCount: 5,
  conchasCollection: [
    {
      id: 'concha-1',
      type: 'areia',
      name: 'Concha de Areia de Stella Maris',
      rarity: 'Comum',
      collectedAt: '2026-08-28',
      neighborhood: 'Stella Maris',
      iconName: 'Shell',
    },
    {
      id: 'concha-2',
      type: 'mar',
      name: 'Concha do Mar da Barra',
      rarity: 'Rara',
      collectedAt: '2026-08-29',
      neighborhood: 'Barra',
      iconName: 'Waves',
    },
    {
      id: 'concha-3',
      type: 'areia',
      name: 'Concha de Areia do Rio Vermelho',
      rarity: 'Comum',
      collectedAt: '2026-08-30',
      neighborhood: 'Rio Vermelho',
      iconName: 'Shell',
    },
    {
      id: 'concha-4',
      type: 'vidro',
      name: 'Concha de Vidro do Porto da Barra',
      rarity: 'Lendária',
      collectedAt: '2026-08-31',
      neighborhood: 'Barra',
      iconName: 'Sparkles',
    },
    {
      id: 'concha-5',
      type: 'mar',
      name: 'Concha das Águas de Itapuã',
      rarity: 'Rara',
      collectedAt: '2026-08-31',
      neighborhood: 'Itapuã',
      iconName: 'Waves',
    },
  ],
  availableRewards: [
    {
      id: 'rew-1',
      title: '20% OFF no Acarajé da Cira',
      partnerName: 'Acarajé da Cira (Rio Vermelho)',
      partnerLogo: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=150&q=80',
      discountPercent: 20,
      code: 'MARES-CIRA20',
      expiresAt: '2026-09-15',
      isUsed: false,
    },
  ],
  neighborhoodRanks: [
    { neighborhood: 'Rio Vermelho', rank: 3, title: 'Barão da Maré do RV', totalResidents: 1420 },
    { neighborhood: 'Barra', rank: 8, title: 'Navegador da Barra', totalResidents: 2190 },
    { neighborhood: 'Itapuã', rank: 14, title: 'Explorador da Lagoa', totalResidents: 980 },
  ],
};

// Initial Previsão de Maré
const initialPrevisaoMare: PrevisaoMareData = {
  currentTideMeters: 2.1,
  tideState: 'Maré Alta (Preamar)',
  nextHighTide: '14:28 (2.4m)',
  nextLowTide: '20:45 (0.3m)',
  marinhaAdvisory: 'Capitania dos Portos: Maré em coeficiente elevado (88). Alerta para ressacas brandas na orla sul.',
  riskFloodZones: [
    {
      zoneName: 'Avenida Lafayete Coutinho (Contorno)',
      riskLevel: 'Alto (Alerta Contorno / Calçada)',
      alternativeRoute: 'Utilizar Túnel Américo Simas ou Av. Vale do Canela.',
    },
    {
      zoneName: 'Largo da Calçada / Baixa dos Sapateiros',
      riskLevel: 'Médio',
      alternativeRoute: 'Tráfego fluindo melhor pela Via Expressa Baía de Todos os Santos.',
    },
  ],
};

// Initial Ondas do Dendê
const initialOndas: OndaDoDendeItem[] = [
  {
    id: 'onda-1',
    title: 'Ensaio Aberto na Praça do Rio Vermelho',
    venue: 'Largo de Santana (Dinha)',
    neighborhood: 'Rio Vermelho',
    participantsCount: 384,
    waveHeatIndex: 'Tsunami do Dendê',
    heatPercentage: 94,
    bannerImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80',
    liveNow: true,
    timeText: 'Acontecendo Agora • 19:30',
  },
  {
    id: 'onda-2',
    title: 'Pôr do Sol Musical no Farol da Barra',
    venue: 'Gramado do Farol',
    neighborhood: 'Barra',
    participantsCount: 246,
    waveHeatIndex: 'Onda Média',
    heatPercentage: 78,
    bannerImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    liveNow: false,
    timeText: 'Hoje às 17:00',
  },
  {
    id: 'onda-3',
    title: 'Roda de Samba e Choro no Santo Antônio Além do Carmo',
    venue: 'Coreto do Carmo',
    neighborhood: 'Santo Antônio Além do Carmo',
    participantsCount: 160,
    waveHeatIndex: 'Onda Média',
    heatPercentage: 65,
    bannerImage: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=600&q=80',
    liveNow: false,
    timeText: 'Sábado às 18:00',
  },
];

// Initial Herança Digital Recados
const initialRecados: HerancaDigitalRecado[] = [
  {
    id: 'recado-1',
    authorName: 'Malu Pires',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    neighborhood: 'Barra',
    locationName: 'Perto da estátua do Farol da Barra',
    coordinates: { lat: -13.0039, lng: -38.5326 },
    message: 'Quem sentar no banco de madeira virado pro mar às 17h30 ganha o melhor pôr do sol do planeta Terra. Dica de soteropolitana nata! 🌊✨',
    createdAt: '2026-08-30T16:20:00Z',
    likesCount: 52,
    tag: 'Dica Secreta',
  },
  {
    id: 'recado-2',
    authorName: 'Beto Andrade',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    neighborhood: 'Rio Vermelho',
    locationName: 'Largo da Mariquita',
    coordinates: { lat: -13.0142, lng: -38.4912 },
    message: 'A passarinha frita com farofa desse quiosque 4 é a mais crocante da orla. Pode pedir sem medo!',
    createdAt: '2026-08-31T11:10:00Z',
    likesCount: 38,
    tag: 'Gastronomia Raiz',
  },
];

export const useAppStore = create<AppStoreState>((set, get) => ({
  currentUser: {
    id: 'user-default-1',
    name: 'Mateus Oliveira',
    username: 'mateus.ssa',
    email: 'mateus@salvo.ba',
    phone: '(71) 98765-4321',
    role: 'client',
    neighborhood: 'Rio Vermelho',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    favoriteStoreIds: ['store-1', 'store-3', 'store-5'],
    savedOfferIds: ['off-1', 'off-4'],
    createdAt: '2026-01-15',
  },
  userPersonaMode: (localStorage.getItem('salvo_persona_mode') as UserPersonaMode) || 'soteropolitano',
  setUserPersonaMode: (mode) => {
    localStorage.setItem('salvo_persona_mode', mode);
    set({ userPersonaMode: mode });
  },
  setCurrentUser: (user) => set({ currentUser: user }),

  activeTab: 'explore',
  setActiveTab: (tab) => set({ activeTab: tab }),

  darkMode: localStorage.getItem('salvo_dark_mode') === 'true',
  toggleDarkMode: () => {
    const next = !get().darkMode;
    localStorage.setItem('salvo_dark_mode', String(next));
    if (next) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ darkMode: next });
  },

  // Gamificação
  gamification: initialGamification,
  addMares: (amount, reason) => {
    const current = get().gamification;
    const newScore = current.maresScore + amount;
    const newDepthLevel = Math.min(10, Math.floor(newScore / 50) + 1);
    const newDepthTitle =
      newDepthLevel >= 10
        ? 'Fossa das Marianas Soteropolitana'
        : newDepthLevel >= 5
        ? 'Abismo do Carmo'
        : 'Orla';

    set({
      gamification: {
        ...current,
        maresScore: newScore,
        depthLevel: newDepthLevel,
        depthTitle: newDepthTitle,
      },
    });

    get().showToast(
      `+${amount} Marés 🌊 ${reason ? `• ${reason}` : ''}`,
      'mare'
    );

    // Disparar confete se subiu de nível
    if (newDepthLevel > current.depthLevel) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#0F4C81', '#E89F3C', '#2A9D8F'],
      });
      get().showToast(
        `Subiu de Profundidade! Agora você é Nível ${newDepthLevel}: ${newDepthTitle} 🌊✨`,
        'mare'
      );
    }
  },

  collectConcha: (neighborhood) => {
    const current = get().gamification;
    const types: ('areia' | 'mar' | 'vidro')[] = ['areia', 'mar', 'vidro'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    const names = {
      areia: `Concha de Areia de ${neighborhood}`,
      mar: `Concha do Mar de ${neighborhood}`,
      vidro: `Concha de Vidro Mística de ${neighborhood}`,
    };
    const rarities: ('Comum' | 'Rara' | 'Lendária')[] =
      randomType === 'vidro' ? ['Lendária'] : randomType === 'mar' ? ['Rara'] : ['Comum'];

    const newConcha: ConchaItem = {
      id: `concha-${Date.now()}`,
      type: randomType,
      name: names[randomType],
      rarity: rarities[0],
      collectedAt: new Date().toISOString().split('T')[0],
      neighborhood,
      iconName: randomType === 'vidro' ? 'Sparkles' : randomType === 'mar' ? 'Waves' : 'Shell',
    };

    const newCollection = [...current.conchasCollection, newConcha];
    const newCount = (current.conchasCount + 1) % 7;

    // Se completou 7 conchas, gera recompensa surpresa
    let rewards = [...current.availableRewards];
    if (newCount === 0) {
      confetti({ particleCount: 120, spread: 80, colors: ['#E89F3C', '#E76F51', '#2A9D8F'] });
      rewards.push({
        id: `reward-${Date.now()}`,
        title: 'Recompensa 7 Conchas: 25% OFF no Coco Bambu Salvador',
        partnerName: 'Coco Bambu Bahia',
        discountPercent: 25,
        code: `CONCHAS-7-${Math.floor(1000 + Math.random() * 9000)}`,
        expiresAt: '2026-09-30',
        isUsed: false,
      });
      get().showToast(
        '🐚 7 Conchas Coletadas! Você desbloqueou um Cupom Surpresa de 25% OFF!',
        'concha'
      );
    } else {
      get().showToast(
        `🐚 Concha Coletada (${newCount}/7)! ${newConcha.name}`,
        'concha'
      );
    }

    set({
      gamification: {
        ...current,
        conchasCount: newCount,
        conchasCollection: newCollection,
        availableRewards: rewards,
      },
    });

    get().addMares(20, `Concha em ${neighborhood}`);
  },

  checkInBairro: (neighborhood) => {
    get().addMares(10, `Check-in na maré de ${neighborhood}`);
    get().collectConcha(neighborhood);
  },

  claimReward: (rewardId) => {
    const current = get().gamification;
    set({
      gamification: {
        ...current,
        availableRewards: current.availableRewards.map((r) =>
          r.id === rewardId ? { ...r, isUsed: true } : r
        ),
      },
    });
    get().showToast('Cupom ativado com sucesso! Apresente o código na loja.', 'info');
  },

  // Acarajé Roulette
  isAcarajeRouletteOpen: false,
  setIsAcarajeRouletteOpen: (open) => set({ isAcarajeRouletteOpen: open }),
  activeRouletteResult: null,
  spinAcarajeRoulette: () => {
    const dishes = [
      {
        storeId: 'store-1',
        storeName: 'Acarajé & Abará da Cira',
        storeNeighborhood: 'Rio Vermelho',
        dishCategory: 'Acarajé Completo com Camarão Seco',
        hintText: 'O ponto mais tradicional da Mariquita com vatapá dourado.',
        distanceKm: 0.8,
      },
      {
        storeId: 'store-3',
        storeName: 'Boteco do França',
        storeNeighborhood: 'Rio Vermelho',
        dishCategory: 'Moqueca de Camarão com Pirão',
        hintText: 'Mesas sob a amendoeira num beco aconchegante.',
        distanceKm: 1.2,
      },
      {
        storeId: 'store-6',
        storeName: 'Sorveteria da Barra',
        storeNeighborhood: 'Barra',
        dishCategory: 'Sorvete Artesanal de Frutas Tropicais (Mangaba/Tapioca)',
        hintText: 'Vista frontal para o mar do Farol e brisa constante.',
        distanceKm: 2.1,
      },
      {
        storeId: 'store-8',
        storeName: 'Pastelaria e Caldo de Cana de Itapuã',
        storeNeighborhood: 'Itapuã',
        dishCategory: 'Pastel Gigante de Siri Catado',
        hintText: 'Massa crocante frita na hora ao lado da estátua de Caymmi.',
        distanceKm: 4.5,
      },
    ];

    const chosen = dishes[Math.floor(Math.random() * dishes.length)];
    const result: AcarajeRouletteResult = {
      id: `roulette-${Date.now()}`,
      storeId: chosen.storeId,
      storeName: chosen.storeName,
      storeNeighborhood: chosen.storeNeighborhood,
      secretDiscountPercent: 20,
      dishCategory: chosen.dishCategory,
      hintText: chosen.hintText,
      distanceKm: chosen.distanceKm,
      unlockedAtArrival: false,
      code: `ROULETTE-${Math.floor(1000 + Math.random() * 9000)}`,
      expiresInMinutes: 60,
    };

    set({ activeRouletteResult: result });
    get().addMares(15, 'Roleta do Acarajé rodada!');
    return result;
  },

  // Onda do Dendê
  isOndaDoDendeOpen: false,
  setIsOndaDoDendeOpen: (open) => set({ isOndaDoDendeOpen: open }),
  ondasDoDende: initialOndas,
  confirmPresenceOnda: (ondaId) => {
    set((state) => ({
      ondasDoDende: state.ondasDoDende.map((o) =>
        o.id === ondaId
          ? {
              ...o,
              participantsCount: o.participantsCount + 1,
              heatPercentage: Math.min(100, o.heatPercentage + 2),
            }
          : o
      ),
    }));
    get().addMares(25, 'Presença confirmada na Onda do Dendê!');
    confetti({ particleCount: 50, spread: 60 });
  },

  // Herança Digital
  isHerancaDigitalOpen: false,
  setIsHerancaDigitalOpen: (open) => set({ isHerancaDigitalOpen: open }),
  recadosDigitais: initialRecados,
  postRecadoDigital: (data) => {
    const newRecado: HerancaDigitalRecado = {
      id: `recado-${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
      likesCount: 1,
    };
    set((state) => ({ recadosDigitais: [newRecado, ...state.recadosDigitais] }));
    get().addMares(30, 'Recado deixado na Herança Digital do bairro!');
    get().showToast('Recado cravado na maré do bairro! 🌊', 'mare');
  },
  likeRecadoDigital: (recadoId) => {
    set((state) => ({
      recadosDigitais: state.recadosDigitais.map((r) =>
        r.id === recadoId ? { ...r, likesCount: r.likesCount + 1 } : r
      ),
    }));
    get().addMares(5, 'Apoiou uma memória de Salvador');
  },

  // Previsão de Maré
  isPrevisaoMareOpen: false,
  setIsPrevisaoMareOpen: (open) => set({ isPrevisaoMareOpen: open }),
  previsaoMare: initialPrevisaoMare,

  // Toast
  activeToast: null,
  showToast: (message, type = 'info') => {
    set({ activeToast: { message, type } });
    setTimeout(() => {
      if (get().activeToast?.message === message) {
        set({ activeToast: null });
      }
    }, 4000);
  },
  hideToast: () => set({ activeToast: null }),
}));

import {
  FePlanDefinition,
  FePlanTier,
  FeCampaign,
  FeAdCreative,
  FePaymentRecord,
  FeMonthlyRevenueMetric,
  FeEngineAuctionScore,
} from '../types';

// =========================================================================
// 🌊 PLANOS OFICIAIS SALVÓ ADS — A CIDADE DAS MARÉS
// "Não deixe seu negócio na maré baixa. Suba com a gente."
// =========================================================================
export const FE_MANAGEMENT_FEE_MONTHLY = 150.0;

export const FE_PLANS: Record<FePlanTier, FePlanDefinition> = {
  orla: {
    id: 'orla',
    name: 'Orla (Básico)',
    tagline: 'Visibilidade na beira — quem passa por perto da sua loja te vê primeiro.',
    price: 197.0,
    managementFee: FE_MANAGEMENT_FEE_MONTHLY,
    netMediaBudget: 47.0, // R$ 197 - R$ 150
    cpc: 0.50, // Custo por Clique R$ 0,50
    cpm: 10.00, // Custo por Mil Impressões R$ 10,00
    estimatedClicks: 94, // 47 / 0.50
    estimatedImpressions: 4700, // (47 / 10) * 1000
    targetScope: 'Visibilidade na Beira (1 a 3 Bairros)',
    badge: 'ORLA ESSENCIAL',
    color: '#0F4C81',
    benefits: [
      'Visibilidade na beira — quem passa por perto te vê',
      'Segmentação hiperlocal em até 3 bairros de Salvador',
      'Custo por Clique (CPC) fixado em R$ 0,50',
      'Custo por Mil Impressões (CPM) em R$ 10,00',
      'Taxa de Gestão Inclusa (R$ 150/mês)',
      'Banner Patrocinado no feed principal e busca local',
      'Direcionamento direto para o WhatsApp ou Loja',
    ],
  },
  mare_alta: {
    id: 'mare_alta',
    name: 'Maré Alta (Intermediário)',
    tagline: 'Destaque no mapa e feed para liderar o fluxo de clientes na região.',
    price: 347.0,
    managementFee: FE_MANAGEMENT_FEE_MONTHLY,
    netMediaBudget: 197.0, // R$ 347 - R$ 150
    cpc: 0.45, // Custo por Clique com desconto R$ 0,45
    cpm: 9.00, // Custo por Mil Impressões R$ 9,00
    estimatedClicks: 438, // 197 / 0.45
    estimatedImpressions: 21888, // (197 / 9) * 1000
    targetScope: 'Destaque no Mapa & Feed (Polos Comerciais)',
    badge: 'MARÉ MAIS CONTRATADA',
    isPopular: true,
    color: '#E89F3C',
    benefits: [
      'Destaque no mapa e feed interativo de Salvador',
      'Segmentação avançada em até 8 bairros e polos comerciais',
      'Custo por Clique (CPC) reduzido para R$ 0,45',
      'Custo por Mil Impressões (CPM) reduzido para R$ 9,00',
      'Taxa de Gestão Inclusa (R$ 150/mês)',
      'Pixel de conversão e link com rastreamento UTM',
      'Relatório semanal de desempenho e audiência das marés',
    ],
  },
  fundo_do_mar: {
    id: 'fundo_do_mar',
    name: 'Fundo do Mar (Premium)',
    tagline: 'Domínio total — anúncios em todos os módulos, integração com câmeras e rádio ao vivo.',
    price: 597.0,
    managementFee: FE_MANAGEMENT_FEE_MONTHLY,
    netMediaBudget: 447.0, // R$ 597 - R$ 150
    cpc: 0.40, // Custo por Clique VIP R$ 0,40
    cpm: 8.00, // Custo por Mil Impressões VIP R$ 8,00
    estimatedClicks: 1118, // 447 / 0.40
    estimatedImpressions: 55875, // (447 / 8) * 1000
    targetScope: 'Domínio Total (Módulos, Câmeras & Rádio)',
    badge: 'DOMÍNIO TOTAL',
    color: '#2A9D8F',
    benefits: [
      'Domínio total — anúncios em todos os 19 módulos do SuperApp',
      'Integração exclusiva com player de rádios e câmeras públicas ao vivo',
      'Alcance em todos os bairros e zonas turísticas de Salvador',
      'Custo por Clique (CPC) VIP de apenas R$ 0,40',
      'Custo por Mil Impressões (CPM) de apenas R$ 8,00',
      'Prioridade Máxima no Algoritmo de Leilão Salvô Engine',
      'Selo Gota de Dendê de Anunciante Verificado',
      'Consultoria estratégica mensal de tráfego com especialista',
    ],
  },
  // Aliases para retrocompatibilidade
  local: {
    id: 'local',
    name: 'Orla (Básico)',
    tagline: 'Visibilidade na beira — quem passa por perto te vê.',
    price: 197.0,
    managementFee: FE_MANAGEMENT_FEE_MONTHLY,
    netMediaBudget: 47.0,
    cpc: 0.50,
    cpm: 10.00,
    estimatedClicks: 94,
    estimatedImpressions: 4700,
    targetScope: 'Visibilidade na Beira (1 a 3 Bairros)',
    badge: 'ORLA ESSENCIAL',
    color: '#0F4C81',
    benefits: ['Visibilidade na beira — quem passa por perto te vê'],
  },
  plus: {
    id: 'plus',
    name: 'Maré Alta (Intermediário)',
    tagline: 'Destaque no mapa e feed.',
    price: 347.0,
    managementFee: FE_MANAGEMENT_FEE_MONTHLY,
    netMediaBudget: 197.0,
    cpc: 0.45,
    cpm: 9.00,
    estimatedClicks: 438,
    estimatedImpressions: 21888,
    targetScope: 'Destaque no Mapa & Feed',
    badge: 'MARÉ MAIS CONTRATADA',
    color: '#E89F3C',
    benefits: ['Destaque no mapa e feed interativo'],
  },
  premium: {
    id: 'premium',
    name: 'Fundo do Mar (Premium)',
    tagline: 'Domínio total — anúncios em todos os módulos.',
    price: 597.0,
    managementFee: FE_MANAGEMENT_FEE_MONTHLY,
    netMediaBudget: 447.0,
    cpc: 0.40,
    cpm: 8.00,
    estimatedClicks: 1118,
    estimatedImpressions: 55875,
    targetScope: 'Domínio Total',
    badge: 'DOMÍNIO TOTAL',
    color: '#2A9D8F',
    benefits: ['Domínio total em todos os módulos'],
  },
};

// =========================================================================
// MOCK DATA INICIAL: CAMPANHAS E ANÚNCIOS ATIVOS SALVÓ FÉ
// =========================================================================
export const INITIAL_FE_CAMPAIGNS: FeCampaign[] = [
  {
    id: 'camp-fe-001',
    merchantId: 'merch-01',
    merchantName: 'Dr. Roberto Meireles',
    merchantEmail: 'contato@sorrisoefe.com.br',
    merchantPhone: '(71) 98844-1234',
    storeName: 'Clínica Odontológica Sorriso & Fé',
    planId: 'plus',
    planName: 'Fé Plus',
    monthlyPrice: 347.0,
    managementFee: 150.0,
    totalBudget: 197.0,
    remainingBudget: 142.50,
    status: 'active',
    paymentStatus: 'paid',
    startDate: '2026-08-01',
    endDate: '2026-08-31',
    createdAt: '2026-08-01T10:00:00Z',
    ads: [
      {
        id: 'ad-fe-101',
        campaignId: 'camp-fe-001',
        merchantId: 'merch-01',
        storeName: 'Clínica Odontológica Sorriso & Fé',
        title: 'Check-up Odontológico com Avaliação Digital',
        description: 'Tratamentos modernos, clareamento a laser e ortodontia humanizada na Barra e Graça.',
        imageUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=700&auto=format&fit=crop&q=80',
        ctaText: 'Agendar Consulta no WhatsApp',
        destinationUrl: 'https://wa.me/5571988441234?text=Ola,%20vi%20o%20anuncio%20no%20SALVO%20Fe!',
        targetNeighborhoods: ['Barra', 'Graça', 'Vitória', 'Ondina', 'Canela'],
        targetCategories: ['Saúde, Farmácias & Bem-Estar', 'Beleza, Barbearias & Estética'],
        bidCpc: 0.55,
        status: 'approved',
        moderationNotes: 'Anúncio aprovado e em conformidade com as diretrizes de saúde.',
        reviewedBy: 'Admin SALVÓ Fé',
        reviewedAt: '2026-08-01T11:30:00Z',
        createdAt: '2026-08-01T10:15:00Z',
        updatedAt: '2026-08-01T11:30:00Z',
        impressions: 4890,
        clicks: 121,
        spentAmount: 54.50,
        ctr: 2.47,
      },
    ],
  },
  {
    id: 'camp-fe-002',
    merchantId: 'merch-02',
    merchantName: 'Carla Silveira',
    merchantEmail: 'carla@cantinhodocafessa.com.br',
    merchantPhone: '(71) 99123-8899',
    storeName: 'Cantinho do Café Gourmet Pituba',
    planId: 'local',
    planName: 'Fé Local',
    monthlyPrice: 197.0,
    managementFee: 150.0,
    totalBudget: 47.0,
    remainingBudget: 28.00,
    status: 'active',
    paymentStatus: 'paid',
    startDate: '2026-08-10',
    endDate: '2026-09-10',
    createdAt: '2026-08-10T14:20:00Z',
    ads: [
      {
        id: 'ad-fe-102',
        campaignId: 'camp-fe-002',
        merchantId: 'merch-02',
        storeName: 'Cantinho do Café Gourmet Pituba',
        title: 'Cafés Especiais & Pães de Queijo Artesanais',
        description: 'Ambiente aconchegante para reuniões e pausas restauradoras na Pituba e Itaigara.',
        imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=700&auto=format&fit=crop&q=80',
        ctaText: 'Ver Cardápio & Localização',
        destinationUrl: 'https://wa.me/5571991238899',
        targetNeighborhoods: ['Pituba', 'Itaigara', 'Costa Azul'],
        targetCategories: ['Restaurantes & Gastronomia', 'Mercados, Padarias & Empórios'],
        bidCpc: 0.50,
        status: 'approved',
        moderationNotes: 'Aprovado.',
        reviewedBy: 'Admin SALVÓ Fé',
        reviewedAt: '2026-08-10T15:00:00Z',
        createdAt: '2026-08-10T14:30:00Z',
        updatedAt: '2026-08-10T15:00:00Z',
        impressions: 1950,
        clicks: 38,
        spentAmount: 19.00,
        ctr: 1.95,
      },
    ],
  },
  {
    id: 'camp-fe-003',
    merchantId: 'merch-03',
    merchantName: 'Marcos Vinícius Santos',
    merchantEmail: 'marcos@oticasdagraca.com.br',
    merchantPhone: '(71) 98777-6655',
    storeName: 'Óticas Visão & Fé',
    planId: 'premium',
    planName: 'Fé Premium',
    monthlyPrice: 597.0,
    managementFee: 150.0,
    totalBudget: 447.0,
    remainingBudget: 380.00,
    status: 'active',
    paymentStatus: 'paid',
    startDate: '2026-08-05',
    endDate: '2026-09-05',
    createdAt: '2026-08-05T09:00:00Z',
    ads: [
      {
        id: 'ad-fe-103',
        campaignId: 'camp-fe-003',
        merchantId: 'merch-03',
        storeName: 'Óticas Visão & Fé',
        title: 'Lentes com Filtro Azul e Armações Nacionais',
        description: 'Exame de vista gratuito na compra dos óculos completos. Atendemos toda Salvador com entrega expressa.',
        imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=700&auto=format&fit=crop&q=80',
        ctaText: 'Falar com Consultor Óptico',
        destinationUrl: 'https://wa.me/5571987776655',
        targetNeighborhoods: ['Todos os Bairros', 'Graça', 'Barra', 'Pituba', 'Brotas', 'Imbuí'],
        targetCategories: ['Saúde, Farmácias & Bem-Estar', 'Moda, Roupas & Acessórios'],
        bidCpc: 0.65,
        status: 'approved',
        moderationNotes: 'Campanha Premium aprovada com máxima prioridade.',
        reviewedBy: 'Admin SALVÓ Fé',
        reviewedAt: '2026-08-05T09:40:00Z',
        createdAt: '2026-08-05T09:10:00Z',
        updatedAt: '2026-08-05T09:40:00Z',
        impressions: 12400,
        clicks: 167,
        spentAmount: 67.00,
        ctr: 1.35,
      },
    ],
  },
  {
    id: 'camp-fe-004',
    merchantId: 'merch-04',
    merchantName: 'Fernanda Dantas',
    merchantEmail: 'fernanda@vidafitssa.com.br',
    merchantPhone: '(71) 98111-2233',
    storeName: 'Academia Corpo & Vida Saudável',
    planId: 'plus',
    planName: 'Fé Plus',
    monthlyPrice: 347.0,
    managementFee: 150.0,
    totalBudget: 197.0,
    remainingBudget: 197.00,
    status: 'pending_payment',
    paymentStatus: 'pending',
    startDate: '2026-08-28',
    endDate: '2026-09-28',
    createdAt: '2026-08-28T16:00:00Z',
    ads: [
      {
        id: 'ad-fe-104',
        campaignId: 'camp-fe-004',
        merchantId: 'merch-04',
        storeName: 'Academia Corpo & Vida Saudável',
        title: 'Matrícula Grátis + Avaliação Física Completa',
        description: 'Musculação, pilates, natação e dança em um espaço acolhedor e climatizado no Rio Vermelho e Ondina.',
        imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=700&auto=format&fit=crop&q=80',
        ctaText: 'Garantir Matrícula Promocional',
        destinationUrl: 'https://wa.me/5571981112233',
        targetNeighborhoods: ['Rio Vermelho', 'Ondina', 'Barra', 'Federação'],
        targetCategories: ['Esportes, Academias & Aventura', 'Saúde, Farmácias & Bem-Estar'],
        bidCpc: 0.45,
        status: 'pending',
        moderationNotes: 'Aguardando confirmação do pagamento do plano.',
        createdAt: '2026-08-28T16:15:00Z',
        updatedAt: '2026-08-28T16:15:00Z',
        impressions: 0,
        clicks: 0,
        spentAmount: 0.0,
        ctr: 0.0,
      },
    ],
  },
];

export const INITIAL_FE_PAYMENTS: FePaymentRecord[] = [
  {
    id: 'pay-fe-801',
    merchantId: 'merch-01',
    merchantName: 'Dr. Roberto Meireles',
    storeName: 'Clínica Odontológica Sorriso & Fé',
    planId: 'plus',
    planName: 'Fé Plus',
    amount: 347.0,
    managementFee: 150.0,
    mediaAmount: 197.0,
    paymentMethod: 'pix',
    status: 'paid',
    gatewayTransactionId: 'PIX_E2E_89234812398412',
    paidAt: '2026-08-01T10:05:00Z',
    createdAt: '2026-08-01T10:00:00Z',
    expiresAt: '2026-09-01T10:00:00Z',
  },
  {
    id: 'pay-fe-802',
    merchantId: 'merch-02',
    merchantName: 'Carla Silveira',
    storeName: 'Cantinho do Café Gourmet Pituba',
    planId: 'local',
    planName: 'Fé Local',
    amount: 197.0,
    managementFee: 150.0,
    mediaAmount: 47.0,
    paymentMethod: 'credit_card',
    status: 'paid',
    gatewayTransactionId: 'STRIPE_CH_91238918239',
    paidAt: '2026-08-10T14:22:00Z',
    createdAt: '2026-08-10T14:20:00Z',
    expiresAt: '2026-09-10T14:20:00Z',
  },
  {
    id: 'pay-fe-803',
    merchantId: 'merch-03',
    merchantName: 'Marcos Vinícius Santos',
    storeName: 'Óticas Visão & Fé',
    planId: 'premium',
    planName: 'Fé Premium',
    amount: 597.0,
    managementFee: 150.0,
    mediaAmount: 447.0,
    paymentMethod: 'pix',
    status: 'paid',
    gatewayTransactionId: 'PIX_E2E_112093849182',
    paidAt: '2026-08-05T09:02:00Z',
    createdAt: '2026-08-05T09:00:00Z',
    expiresAt: '2026-09-05T09:00:00Z',
  },
  {
    id: 'pay-fe-804',
    merchantId: 'merch-04',
    merchantName: 'Fernanda Dantas',
    storeName: 'Academia Corpo & Vida Saudável',
    planId: 'plus',
    planName: 'Fé Plus',
    amount: 347.0,
    managementFee: 150.0,
    mediaAmount: 197.0,
    paymentMethod: 'pix',
    status: 'pending',
    createdAt: '2026-08-28T16:00:00Z',
    expiresAt: '2026-08-30T16:00:00Z',
    pixQrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020126580014br.gov.bcb.pix0136salvo.fe.pagamentos@salvo.ba5204000053039865405347.005802BR5916SALVO%20FE%20MIDIA6008SALVADOR62070503***6304ABCD',
    pixCopiaECola: '00020126580014br.gov.bcb.pix0136salvo.fe.pagamentos@salvo.ba5204000053039865405347.005802BR5916SALVO%20FE%20MIDIA6008SALVADOR62070503***6304ABCD',
  },
];

export const MONTHLY_REVENUE_HISTORY: FeMonthlyRevenueMetric[] = [
  {
    month: 'Mar/26',
    totalRevenue: 2890.0,
    managementFees: 1650.0,
    mediaBudgets: 1240.0,
    activeMerchants: 11,
    impressionsDelivered: 145000,
    clicksDelivered: 2950,
  },
  {
    month: 'Abr/26',
    totalRevenue: 4180.0,
    managementFees: 2400.0,
    mediaBudgets: 1780.0,
    activeMerchants: 16,
    impressionsDelivered: 220000,
    clicksDelivered: 4310,
  },
  {
    month: 'Mai/26',
    totalRevenue: 6240.0,
    managementFees: 3600.0,
    mediaBudgets: 2640.0,
    activeMerchants: 24,
    impressionsDelivered: 315000,
    clicksDelivered: 6890,
  },
  {
    month: 'Jun/26',
    totalRevenue: 8910.0,
    managementFees: 5100.0,
    mediaBudgets: 3810.0,
    activeMerchants: 34,
    impressionsDelivered: 450000,
    clicksDelivered: 9780,
  },
  {
    month: 'Jul/26',
    totalRevenue: 11490.0,
    managementFees: 6600.0,
    mediaBudgets: 4890.0,
    activeMerchants: 44,
    impressionsDelivered: 590000,
    clicksDelivered: 12900,
  },
  {
    month: 'Ago/26',
    totalRevenue: 14850.0,
    managementFees: 8550.0,
    mediaBudgets: 6300.0,
    activeMerchants: 57,
    impressionsDelivered: 780000,
    clicksDelivered: 16400,
  },
];

// =========================================================================
// STORAGE HELPER FUNCTIONS (Persistência Local com Sincronização)
// =========================================================================
const STORAGE_KEY_CAMPAIGNS = 'salvo_fe_campaigns_v1';
const STORAGE_KEY_PAYMENTS = 'salvo_fe_payments_v1';

export function getStoredFeCampaigns(): FeCampaign[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_CAMPAIGNS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Erro ao carregar campanhas SALVÓ Fé:', e);
  }
  return INITIAL_FE_CAMPAIGNS;
}

export function saveStoredFeCampaigns(campaigns: FeCampaign[]) {
  try {
    localStorage.setItem(STORAGE_KEY_CAMPAIGNS, JSON.stringify(campaigns));
  } catch (e) {
    console.error('Erro ao salvar campanhas SALVÓ Fé:', e);
  }
}

export function getStoredFePayments(): FePaymentRecord[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_PAYMENTS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Erro ao carregar pagamentos SALVÓ Fé:', e);
  }
  return INITIAL_FE_PAYMENTS;
}

export function saveStoredFePayments(payments: FePaymentRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEY_PAYMENTS, JSON.stringify(payments));
  } catch (e) {
    console.error('Erro ao salvar pagamentos SALVÓ Fé:', e);
  }
}

// =========================================================================
// ⚡ ALGORITMO "FÉ ENGINE": MOTOR DE LEILÃO EM TEMPO REAL
//
// Lógica exigida:
// 1. Filtrar anúncios ativos com orçamento disponível (saldo > lance).
// 2. Filtrar por localização (bairro do usuário ou cidade inteira).
// 3. Calcular pontuação: (Lance do Anunciante * 0.6) + (Relevância para o Usuário * 0.4).
// 4. Retornar o anúncio com maior pontuação.
// =========================================================================
export interface FeEngineRequestParams {
  userId?: string;
  userNeighborhood?: string;
  userCategoryInterest?: string;
  deviceType?: 'mobile' | 'desktop';
}

export function runFeEngineAuction(
  params: FeEngineRequestParams,
  campaignsList: FeCampaign[] = getStoredFeCampaigns()
): {
  winner: FeAdCreative | null;
  winnerCampaign: FeCampaign | null;
  allRankedScores: FeEngineAuctionScore[];
  totalEligible: number;
} {
  const { userNeighborhood = 'Barra', userCategoryInterest = 'Geral' } = params;

  // 1. Coleta todos os anúncios aprovados de campanhas ativas com saldo
  const candidates: { ad: FeAdCreative; campaign: FeCampaign }[] = [];

  campaignsList.forEach((camp) => {
    if (camp.status === 'active' && camp.paymentStatus === 'paid' && camp.remainingBudget > 0.40) {
      camp.ads.forEach((ad) => {
        if (ad.status === 'approved' && camp.remainingBudget >= ad.bidCpc) {
          candidates.push({ ad, campaign: camp });
        }
      });
    }
  });

  if (candidates.length === 0) {
    return { winner: null, winnerCampaign: null, allRankedScores: [], totalEligible: 0 };
  }

  // 2 & 3. Processa cada candidato e calcula os pesos
  const evaluatedScores: FeEngineAuctionScore[] = candidates.map(({ ad, campaign }) => {
    // Fator Geográfico (0 a 1.0)
    let geoScore = 0.3; // Base de alcance geral
    const targetsAll = ad.targetNeighborhoods.some(
      (n) => n.toLowerCase().includes('todos') || n.toLowerCase().includes('salvador')
    );
    const targetDirect = ad.targetNeighborhoods.some(
      (n) => n.toLowerCase() === userNeighborhood.toLowerCase()
    );

    if (targetDirect) {
      geoScore = 1.0; // Correspondência exata do bairro do usuário
    } else if (targetsAll) {
      geoScore = campaign.planId === 'premium' ? 0.9 : 0.7; // Cobertura municipal
    } else {
      geoScore = 0.2; // Bairro distante ou secundário
    }

    // Fator Categoria / Interesses (0 a 1.0)
    let categoryScore = 0.5; // Neutro padrão
    if (
      userCategoryInterest !== 'Geral' &&
      ad.targetCategories.some((cat) => cat.toLowerCase().includes(userCategoryInterest.toLowerCase()))
    ) {
      categoryScore = 1.0;
    }

    // Fator Qualidade / CTR Histórico (0 a 1.0)
    const baseCtr = ad.ctr || 1.5;
    const qualityScore = Math.min(1.0, baseCtr / 3.0); // CTR de 3% atinge nota máxima 1.0

    // Bônus multiplicador por Plano Fé
    const planMultiplier = campaign.planId === 'premium' ? 1.15 : campaign.planId === 'plus' ? 1.05 : 1.0;

    // Cálculo da Relevância para o Usuário (normalizada de 0.0 a 1.0)
    const userRelevance =
      ((geoScore * 0.5 + categoryScore * 0.3 + qualityScore * 0.2) * planMultiplier);

    const boundedRelevance = Math.min(1.0, Math.max(0.05, userRelevance));

    // Lance do anunciante (normalizado, ex: R$ 0.40 a R$ 1.50)
    const advertiserBid = ad.bidCpc;

    // FÓRMULA OFICIAL FÉ ENGINE: (Lance * 0.6) + (Relevância * 0.4)
    // Para harmonizar as grandezas monetárias e probabilísticas:
    // Multiplicamos o lance por 100 para balanceamento ou aplicamos pesos proporcionais:
    const normalizedBidScore = (advertiserBid / 1.0); // Lance relativo a R$ 1,00
    const finalScore = Number(((normalizedBidScore * 0.6) + (boundedRelevance * 0.4)).toFixed(4));

    const explanation = `Lance R$ ${advertiserBid.toFixed(2)} (peso 60%) + Relevância Geo/Interesse ${Math.round(
      boundedRelevance * 100
    )}% (peso 40%) em ${userNeighborhood}`;

    return {
      ad,
      campaign,
      advertiserBid,
      userRelevance: boundedRelevance,
      geoScore,
      categoryScore,
      qualityScore,
      finalScore,
      explanation,
    };
  });

  // 4. Ordena pelo maior Final Score (Vencedor do Leilão)
  evaluatedScores.sort((a, b) => b.finalScore - a.finalScore);

  const winnerCandidate = evaluatedScores[0] || null;

  return {
    winner: winnerCandidate ? winnerCandidate.ad : null,
    winnerCampaign: winnerCandidate ? winnerCandidate.campaign : null,
    allRankedScores: evaluatedScores,
    totalEligible: evaluatedScores.length,
  };
}

// =========================================================================
// REGISTRO DE EVENTOS DE TELEMETRIA (Impressões e Cliques)
// =========================================================================
export function recordFeAdImpression(adId: string) {
  const campaigns = getStoredFeCampaigns();
  let updated = false;

  const newCampaigns = campaigns.map((camp) => {
    const adIdx = camp.ads.findIndex((a) => a.id === adId);
    if (adIdx >= 0) {
      const ad = camp.ads[adIdx];
      const newImpressions = ad.impressions + 1;
      const newCtr = newImpressions > 0 ? Number(((ad.clicks / newImpressions) * 100).toFixed(2)) : 0;
      
      const newAds = [...camp.ads];
      newAds[adIdx] = {
        ...ad,
        impressions: newImpressions,
        ctr: newCtr,
      };

      updated = true;
      return { ...camp, ads: newAds };
    }
    return camp;
  });

  if (updated) {
    saveStoredFeCampaigns(newCampaigns);
  }
}

export function recordFeAdClick(adId: string): { success: boolean; newRemainingBudget: number } {
  const campaigns = getStoredFeCampaigns();
  let success = false;
  let remaining = 0;

  const newCampaigns = campaigns.map((camp) => {
    const adIdx = camp.ads.findIndex((a) => a.id === adId);
    if (adIdx >= 0) {
      const ad = camp.ads[adIdx];
      const cost = Math.min(ad.bidCpc, camp.remainingBudget);

      if (cost > 0) {
        const newRemaining = Math.max(0, Number((camp.remainingBudget - cost).toFixed(2)));
        const newSpent = Number((ad.spentAmount + cost).toFixed(2));
        const newClicks = ad.clicks + 1;
        const newCtr = ad.impressions > 0 ? Number(((newClicks / ad.impressions) * 100).toFixed(2)) : 100;

        const newAds = [...camp.ads];
        newAds[adIdx] = {
          ...ad,
          clicks: newClicks,
          spentAmount: newSpent,
          ctr: newCtr,
        };

        success = true;
        remaining = newRemaining;

        return {
          ...camp,
          remainingBudget: newRemaining,
          status: newRemaining <= 0 ? ('completed' as const) : camp.status,
          ads: newAds,
        };
      }
    }
    return camp;
  });

  if (success) {
    saveStoredFeCampaigns(newCampaigns);
  }

  return { success, newRemainingBudget: remaining };
}

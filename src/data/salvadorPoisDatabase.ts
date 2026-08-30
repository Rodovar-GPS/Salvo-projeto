// ==============================================================================
// 🗺️ BASE DE DADOS COMPLETA DE PONTOS DE INTERESSE (POIs) DE SALVADOR - BAHIA
// Mapeamento geoespacial com coordenadas reais, bairros, status e categorias
// ==============================================================================

export type SalvadorPoiCategory =
  | 'posto_combustivel'
  | 'farmacia'
  | 'padaria'
  | 'supermercado'
  | 'shopping'
  | 'restaurante'
  | 'bar_boteco'
  | 'hospital_upa'
  | 'banco_caixa24h'
  | 'ponto_turistico'
  | 'oficina_mecanica'
  | 'academia'
  | 'hotel_pousada'
  | 'estacao_transporte';

export interface SalvadorPoi {
  id: string;
  osmId?: number;
  name: string;
  category: SalvadorPoiCategory;
  subCategory?: string;
  neighborhood: string;
  address: string;
  cep?: string;
  lat: number;
  lng: number;
  phone?: string;
  whatsapp?: string;
  rating: number;
  reviewCount: number;
  isOpenNow: boolean;
  is24h?: boolean;
  openingHoursText: string;
  icon: string;
  fuelPrices?: {
    gasolinaComum: number;
    gasolinaAditivada: number;
    etanol: number;
    gnv?: number;
    dieselS10: number;
  };
  features?: string[];
}

export const SALVADOR_POIS_DATA: SalvadorPoi[] = [
  // ==========================================
  // ⛽ POSTOS DE COMBUSTÍVEL
  // ==========================================
  {
    id: 'poi-posto-barra-shell',
    name: 'Posto Shell Select - Farol da Barra',
    category: 'posto_combustivel',
    subCategory: 'Posto de Combustíveis & Conveniência 24h',
    neighborhood: 'Barra',
    address: 'Av. Oceânica, 450 - Barra',
    lat: -13.0068,
    lng: -38.5305,
    phone: '(71) 3264-1020',
    rating: 4.7,
    reviewCount: 382,
    isOpenNow: true,
    is24h: true,
    openingHoursText: 'Aberto 24 horas',
    icon: 'Fuel',
    fuelPrices: {
      gasolinaComum: 5.99,
      gasolinaAditivada: 6.19,
      etanol: 4.29,
      dieselS10: 5.89,
    },
    features: ['Conveniência Select', 'Calibrador Digital', 'Troca de Óleo', 'Caixa 24h'],
  },
  {
    id: 'poi-posto-centenario-br',
    name: 'Posto Petrobras BR Mania - Centenário',
    category: 'posto_combustivel',
    subCategory: 'Posto com GNV & Loja BR Mania',
    neighborhood: 'Chame-Chame / Barra',
    address: 'Av. Centenário, 1200 - Chame-Chame',
    lat: -12.9985,
    lng: -38.5205,
    phone: '(71) 3237-4400',
    rating: 4.6,
    reviewCount: 290,
    isOpenNow: true,
    is24h: true,
    openingHoursText: 'Aberto 24 horas',
    icon: 'Fuel',
    fuelPrices: {
      gasolinaComum: 5.95,
      gasolinaAditivada: 6.15,
      etanol: 4.19,
      gnv: 4.69,
      dieselS10: 5.85,
    },
    features: ['GNV Rápido', 'BR Mania', 'Lava-Jato a Vapor', 'Farmácia Integrada'],
  },
  {
    id: 'poi-posto-paralela-ipiranga',
    name: 'Posto Ipiranga AmPm - Paralela Alphaville',
    category: 'posto_combustivel',
    subCategory: 'Posto de Combustíveis e Padaria AmPm',
    neighborhood: 'Paralela',
    address: 'Av. Luís Viana Filho, 5500 - Paralela',
    lat: -12.9430,
    lng: -38.4050,
    phone: '(71) 3367-9911',
    rating: 4.8,
    reviewCount: 610,
    isOpenNow: true,
    is24h: true,
    openingHoursText: 'Aberto 24 horas',
    icon: 'Fuel',
    fuelPrices: {
      gasolinaComum: 5.89,
      gasolinaAditivada: 6.09,
      etanol: 4.09,
      gnv: 4.59,
      dieselS10: 5.79,
    },
    features: ['AmPm Bakery', 'Recarga Elétrica Rápida (EV)', 'Jet Oil Especializado'],
  },
  {
    id: 'poi-posto-garibaldi-shell',
    name: 'Posto Shell Garibaldi - Rio Vermelho',
    category: 'posto_combustivel',
    subCategory: 'Posto Urbano',
    neighborhood: 'Garibaldi / Rio Vermelho',
    address: 'Av. Anita Garibaldi, 1988 - Garibaldi',
    lat: -12.9920,
    lng: -38.4980,
    phone: '(71) 3245-8700',
    rating: 4.5,
    reviewCount: 215,
    isOpenNow: true,
    is24h: false,
    openingHoursText: '05:30 às 23:00',
    icon: 'Fuel',
    fuelPrices: {
      gasolinaComum: 5.92,
      gasolinaAditivada: 6.12,
      etanol: 4.22,
      dieselS10: 5.84,
    },
    features: ['Conveniência', 'Troca de Óleo Helix'],
  },
  {
    id: 'poi-posto-bonoco-br',
    name: 'Posto BR Bonocô - Rótula do Abacaxi',
    category: 'posto_combustivel',
    subCategory: 'Posto com GNV & Borracharia',
    neighborhood: 'Bonocô / Brotas',
    address: 'Av. Mário Leal Ferreira (Bonocô), 3100',
    lat: -12.9780,
    lng: -38.4830,
    phone: '(71) 3381-1250',
    rating: 4.4,
    reviewCount: 430,
    isOpenNow: true,
    is24h: true,
    openingHoursText: 'Aberto 24 horas',
    icon: 'Fuel',
    fuelPrices: {
      gasolinaComum: 5.85,
      gasolinaAditivada: 6.05,
      etanol: 4.05,
      gnv: 4.49,
      dieselS10: 5.75,
    },
    features: ['GNV 6 Bicos', 'Borracharia 24h', 'Lava Rápido'],
  },
  {
    id: 'poi-posto-itapua-aleluia',
    name: 'Posto Ipiranga Farol de Itapuã',
    category: 'posto_combustivel',
    subCategory: 'Posto & Conveniência de Praia',
    neighborhood: 'Itapuã',
    address: 'Av. Octávio Mangabeira, 13200 - Itapuã',
    lat: -12.9520,
    lng: -38.3580,
    phone: '(71) 3249-0022',
    rating: 4.6,
    reviewCount: 340,
    isOpenNow: true,
    is24h: true,
    openingHoursText: 'Aberto 24 horas',
    icon: 'Fuel',
    fuelPrices: {
      gasolinaComum: 5.94,
      gasolinaAditivada: 6.14,
      etanol: 4.18,
      dieselS10: 5.88,
    },
    features: ['AmPm', 'Gelo e Bebidas', 'Estacionamento de Apoio'],
  },

  // ==========================================
  // 🛍️ SHOPPINGS CENTERS
  // ==========================================
  {
    id: 'poi-shopping-salvador',
    name: 'Salvador Shopping',
    category: 'shopping',
    subCategory: 'Grande Centro de Compras & Lazer',
    neighborhood: 'Pituba / Caminho das Árvores',
    address: 'Av. Tancredo Neves, 2915 - Caminho das Árvores',
    lat: -12.9785,
    lng: -38.4530,
    phone: '(71) 3878-1800',
    rating: 4.9,
    reviewCount: 4890,
    isOpenNow: true,
    is24h: false,
    openingHoursText: '09:00 às 22:00 (Domingo 12:00 às 21:00)',
    icon: 'ShoppingBag',
    features: ['Mais de 460 lojas', 'Cinemark IMAX', 'Praça Gourmet', 'Estacionamento Coberto 6.000 vagas'],
  },
  {
    id: 'poi-shopping-bahia',
    name: 'Shopping da Bahia (Antigo Iguatemi)',
    category: 'shopping',
    subCategory: 'Shopping Center & Conexão Metrô',
    neighborhood: 'Iguatemi / Brotas',
    address: 'Av. ACM, 8275 - Pituba / Iguatemi',
    lat: -12.9810,
    lng: -38.4590,
    phone: '(71) 3450-1000',
    rating: 4.8,
    reviewCount: 5210,
    isOpenNow: true,
    is24h: false,
    openingHoursText: '09:00 às 22:00',
    icon: 'ShoppingBag',
    features: ['Passarela direta do Metrô', 'UCI Orient Cinemas', 'Alameda de Serviços SAC'],
  },
  {
    id: 'poi-shopping-barra',
    name: 'Shopping Barra',
    category: 'shopping',
    subCategory: 'Shopping Center & Cinema VIP',
    neighborhood: 'Barra',
    address: 'Av. Centenário, 2992 - Chame-Chame / Barra',
    lat: -13.0035,
    lng: -38.5220,
    phone: '(71) 2108-6888',
    rating: 4.8,
    reviewCount: 3890,
    isOpenNow: true,
    is24h: false,
    openingHoursText: '09:00 às 22:00',
    icon: 'ShoppingBag',
    features: ['Barra Gourmet', 'Cinemark De Lux', 'Marcas Internacionais'],
  },
  {
    id: 'poi-shopping-paralela',
    name: 'Shopping Paralela',
    category: 'shopping',
    subCategory: 'Shopping Center Familiar',
    neighborhood: 'Paralela',
    address: 'Av. Luís Viana Filho, 8544 - Paralela',
    lat: -12.9360,
    lng: -38.3885,
    phone: '(71) 3617-0900',
    rating: 4.7,
    reviewCount: 2940,
    isOpenNow: true,
    is24h: false,
    openingHoursText: '09:00 às 22:00',
    icon: 'ShoppingBag',
    features: ['Conexão Estação Metrô Tamburugy', 'Arena Games', 'Pet Friendly'],
  },
  {
    id: 'poi-shopping-bela-vista',
    name: 'Shopping Bela Vista',
    category: 'shopping',
    subCategory: 'Shopping Center',
    neighborhood: 'Horto Bela Vista',
    address: 'Al. Euvaldo Luz, 92 - Horto Bela Vista',
    lat: -12.9705,
    lng: -38.4720,
    phone: '(71) 3444-4400',
    rating: 4.7,
    reviewCount: 3100,
    isOpenNow: true,
    is24h: false,
    openingHoursText: '09:00 às 22:00',
    icon: 'ShoppingBag',
    features: ['Passarela Estação Acesso Norte Metrô', 'Pista de Kart', 'Cinépolis'],
  },

  // ==========================================
  // 🥖 PADARIAS & DELICATESSENS
  // ==========================================
  {
    id: 'poi-padaria-delicatessen-barra',
    name: 'Padaria & Delicatessen Paris - Barra',
    category: 'padaria',
    subCategory: 'Padaria Artesanal & Café da Manhã',
    neighborhood: 'Barra',
    address: 'Rua Miguel Burnier, 214 - Barra',
    lat: -13.0070,
    lng: -38.5280,
    phone: '(71) 3264-5500',
    rating: 4.8,
    reviewCount: 420,
    isOpenNow: true,
    is24h: false,
    openingHoursText: '06:00 às 21:00 (Aberto agora)',
    icon: 'Croissant',
    features: ['Pães de Fermentação Natural', 'Buffet de Café Nordestino', 'Confeitaria Fina'],
  },
  {
    id: 'poi-padaria-brotas-paodourado',
    name: 'Delicatessen Pão Dourado - Brotas',
    category: 'padaria',
    subCategory: 'Padaria Tradicional e Lanches',
    neighborhood: 'Brotas',
    address: 'Av. Dom João VI, 450 - Brotas',
    lat: -12.9860,
    lng: -38.4940,
    phone: '(71) 3358-1122',
    rating: 4.6,
    reviewCount: 310,
    isOpenNow: true,
    is24h: false,
    openingHoursText: '06:00 às 21:30',
    icon: 'Croissant',
    features: ['Pãozinho Francês Quente a cada 20min', 'Salgados Baianos', 'Sopas & Caldos Noturnos'],
  },
  {
    id: 'poi-padaria-pituba-pao-mais',
    name: 'Padaria Pão & Mais - Pituba',
    category: 'padaria',
    subCategory: 'Delicatessen & Empório',
    neighborhood: 'Pituba',
    address: 'Av. Paulo VI, 1120 - Pituba',
    lat: -12.9890,
    lng: -38.4610,
    phone: '(71) 3351-7788',
    rating: 4.9,
    reviewCount: 560,
    isOpenNow: true,
    is24h: false,
    openingHoursText: '06:00 às 22:00',
    icon: 'Croissant',
    features: ['Tapiocas feitas na hora', 'Cuscuz Baiano', 'Queijos Artesanais da Chapada'],
  },
  {
    id: 'poi-padaria-rio-vermelho-deli',
    name: 'Delicatessen Rio Vermelho',
    category: 'padaria',
    subCategory: 'Padaria e Cafeteria Gourmet',
    neighborhood: 'Rio Vermelho',
    address: 'Rua Fonte do Boi, 178 - Rio Vermelho',
    lat: -13.0120,
    lng: -38.4890,
    phone: '(71) 3334-9009',
    rating: 4.7,
    reviewCount: 280,
    isOpenNow: true,
    is24h: false,
    openingHoursText: '06:30 às 21:00',
    icon: 'Croissant',
    features: ['Croissants Franceses', 'Café Especial do Sul da Bahia', 'Tortas de Frutas'],
  },
  {
    id: 'poi-padaria-itapua-sol',
    name: 'Panificadora Sol de Itapuã',
    category: 'padaria',
    subCategory: 'Padaria de Bairro',
    neighborhood: 'Itapuã',
    address: 'Rua Dorival Caymmi, 320 - Itapuã',
    lat: -12.9390,
    lng: -38.3620,
    phone: '(71) 3285-1100',
    rating: 4.5,
    reviewCount: 190,
    isOpenNow: true,
    is24h: false,
    openingHoursText: '05:30 às 20:30',
    icon: 'Croissant',
    features: ['Pão Doce Tradicional', 'Bolo de Aipim', 'Suco de Mangaba'],
  },

  // ==========================================
  // 💊 FARMÁCIAS & DROGARIAS 24H
  // ==========================================
  {
    id: 'poi-drogaria-sao-paulo-barra-24h',
    name: 'Drogaria São Paulo 24h - Barra',
    category: 'farmacia',
    subCategory: 'Farmácia 24 Horas com Delivery',
    neighborhood: 'Barra',
    address: 'Av. Almirante Marques de Leão, 420 - Barra',
    lat: -13.0082,
    lng: -38.5292,
    phone: '(71) 3003-7272',
    whatsapp: '(71) 9988-2424',
    rating: 4.8,
    reviewCount: 512,
    isOpenNow: true,
    is24h: true,
    openingHoursText: 'Aberto 24 horas todos os dias',
    icon: 'Pill',
    features: ['Atendimento 24h', 'Farmacêutico Presente', 'Aplicação de Injetáveis', 'Estacionamento'],
  },
  {
    id: 'poi-pague-menos-pituba-24h',
    name: 'Farmácia Pague Menos 24h - Pituba',
    category: 'farmacia',
    subCategory: 'Farmácia com Clinic Farma',
    neighborhood: 'Pituba',
    address: 'Av. Manoel Dias da Silva, 1450 - Pituba',
    lat: -13.0030,
    lng: -38.4680,
    phone: '(71) 3248-1155',
    rating: 4.7,
    reviewCount: 430,
    isOpenNow: true,
    is24h: true,
    openingHoursText: 'Aberto 24 horas',
    icon: 'Pill',
    features: ['Clinic Farma', 'Medição de Pressão', 'Testes Rápidos', 'Drive-Thru'],
  },
  {
    id: 'poi-droga-silva-rio-vermelho',
    name: 'Droga Raia - Largo de Santana (Rio Vermelho)',
    category: 'farmacia',
    subCategory: 'Farmácia e Cosméticos',
    neighborhood: 'Rio Vermelho',
    address: 'Rua João Gomes, 88 - Rio Vermelho',
    lat: -13.0135,
    lng: -38.4920,
    phone: '(71) 3334-2200',
    rating: 4.6,
    reviewCount: 290,
    isOpenNow: true,
    is24h: false,
    openingHoursText: '07:00 às 23:00',
    icon: 'Pill',
    features: ['Dermocosméticos', 'Medicamentos Especiais', 'Retirada em 1h'],
  },
  {
    id: 'poi-extrafarma-liberdade',
    name: 'Extrafarma - Liberdade',
    category: 'farmacia',
    subCategory: 'Farmácia de Grande Rede',
    neighborhood: 'Liberdade',
    address: 'Estrada da Liberdade, 380 - Liberdade',
    lat: -12.9510,
    lng: -38.4950,
    phone: '(71) 3386-4400',
    rating: 4.5,
    reviewCount: 210,
    isOpenNow: true,
    is24h: false,
    openingHoursText: '07:00 às 22:00',
    icon: 'Pill',
    features: ['Programa de Descontos', 'Medicamentos Genéricos Populares'],
  },

  // ==========================================
  // 🏥 HOSPITAIS & UPAS
  // ==========================================
  {
    id: 'poi-hospital-portugues',
    name: 'Hospital Português da Bahia',
    category: 'hospital_upa',
    subCategory: 'Hospital Geral & Emergência 24h',
    neighborhood: 'Barra / Graça',
    address: 'Av. Princesa Isabel, 914 - Barra / Graça',
    lat: -13.0010,
    lng: -38.5265,
    phone: '(71) 3203-5555',
    rating: 4.8,
    reviewCount: 1420,
    isOpenNow: true,
    is24h: true,
    openingHoursText: 'Emergência 24 Horas',
    icon: 'Hospital',
    features: ['Emergência Adulto e Pediátrica', 'UTI Coronariana', 'Heliponto', 'Centro Diagnóstico'],
  },
  {
    id: 'poi-hospital-da-bahia',
    name: 'Hospital da Bahia',
    category: 'hospital_upa',
    subCategory: 'Hospital de Alta Complexidade',
    neighborhood: 'Pituba',
    address: 'Av. Prof. Magalhães Neto, 1541 - Pituba',
    lat: -12.9865,
    lng: -38.4510,
    phone: '(71) 2109-1000',
    rating: 4.7,
    reviewCount: 980,
    isOpenNow: true,
    is24h: true,
    openingHoursText: 'Emergência 24 Horas',
    icon: 'Hospital',
    features: ['Pronto-Socorro Ortopédico', 'Cardiologia de Ponta', 'Maternidade'],
  },
  {
    id: 'poi-upa-brotas-24h',
    name: 'UPA 24h Brotas (Prefeitura de Salvador)',
    category: 'hospital_upa',
    subCategory: 'Unidade de Pronto Atendimento Público',
    neighborhood: 'Brotas',
    address: 'Av. Dom João VI, s/n - Brotas',
    lat: -12.9795,
    lng: -38.4910,
    phone: '192 / (71) 3611-7300',
    rating: 4.4,
    reviewCount: 650,
    isOpenNow: true,
    is24h: true,
    openingHoursText: 'Atendimento SUS 24 Horas',
    icon: 'Hospital',
    features: ['Atendimento Clínico Rápido', 'Pediatria SUS', 'Sala de Trauma'],
  },

  // ==========================================
  // 🏖️ PONTOS TURÍSTICOS & CULTURAIS
  // ==========================================
  {
    id: 'poi-farol-da-barra',
    name: 'Farol da Barra & Forte de Santo Antônio',
    category: 'ponto_turistico',
    subCategory: 'Monumento Histórico e Museu Náutico',
    neighborhood: 'Barra',
    address: 'Largo do Farol da Barra, s/n - Barra',
    lat: -13.0102,
    lng: -38.5326,
    phone: '(71) 3264-3296',
    rating: 5.0,
    reviewCount: 9450,
    isOpenNow: true,
    is24h: false,
    openingHoursText: 'Museu: 09:00 às 18:00 (Pátio externo livre)',
    icon: 'Landmark',
    features: ['Pôr do Sol Lendário', 'Museu Náutico da Bahia', 'Café do Farol', 'Gramado de Convivência'],
  },
  {
    id: 'poi-elevador-lacerda',
    name: 'Elevador Lacerda',
    category: 'ponto_turistico',
    subCategory: 'Monumento & Transporte Urbano',
    neighborhood: 'Centro Histórico / Comércio',
    address: 'Praça Thomé de Souza - Centro / Comércio',
    lat: -12.9733,
    lng: -38.5126,
    phone: '(71) 3202-7600',
    rating: 4.9,
    reviewCount: 8200,
    isOpenNow: true,
    is24h: false,
    openingHoursText: '06:00 às 23:00 (Tarifa R$ 0,15)',
    icon: 'Landmark',
    features: ['Vista Panorâmica da Baía de Todos os Santos', 'Ligação Cidade Alta e Baixa', 'Sorveteria A Cubana'],
  },
  {
    id: 'poi-pelourinho-largo-jesus',
    name: 'Pelourinho & Terreiro de Jesus',
    category: 'ponto_turistico',
    subCategory: 'Patrimônio Mundial da Humanidade UNESCO',
    neighborhood: 'Pelourinho / Centro Histórico',
    address: 'Largo do Pelourinho - Pelourinho',
    lat: -12.9715,
    lng: -38.5080,
    rating: 4.9,
    reviewCount: 11200,
    isOpenNow: true,
    is24h: true,
    openingHoursText: 'Acesso livre 24 horas',
    icon: 'Landmark',
    features: ['Igreja de São Francisco (Ouro)', 'Casarões Coloniais', 'Bloco Olodum', 'Artesanato Baiano'],
  },
  {
    id: 'poi-igreja-do-bonfim',
    name: 'Basílica Santuário do Senhor do Bonfim',
    category: 'ponto_turistico',
    subCategory: 'Templo Católico & Tradição Baiana',
    neighborhood: 'Bonfim / Cidade Baixa',
    address: 'Praça Senhor do Bonfim, s/n - Bonfim',
    lat: -12.9238,
    lng: -38.5082,
    phone: '(71) 3316-2196',
    rating: 5.0,
    reviewCount: 7800,
    isOpenNow: true,
    is24h: false,
    openingHoursText: '06:30 às 18:30 (Missa diária)',
    icon: 'Landmark',
    features: ['Fitinhas do Bonfim no Gradil', 'Água Benta', 'Sala dos Milagres', 'Feijoada na Colina'],
  },
  {
    id: 'poi-mercado-modelo',
    name: 'Mercado Modelo',
    category: 'ponto_turistico',
    subCategory: 'Centro de Artesanato & Gastronomia',
    neighborhood: 'Comércio',
    address: 'Praça Visconde de Cayru, s/n - Comércio',
    lat: -12.9718,
    lng: -38.5140,
    phone: '(71) 3241-2868',
    rating: 4.8,
    reviewCount: 6900,
    isOpenNow: true,
    is24h: false,
    openingHoursText: '09:00 às 18:00 (Domingo até 14:00)',
    icon: 'Landmark',
    features: ['Mais de 250 boxes de arte', 'Restaurantes Camafeu e Maria de São Pedro', 'Subsolo Histórico'],
  },
  {
    id: 'poi-ponta-de-humaita',
    name: 'Ponta do Humaitá & Forte de Mont Serrat',
    category: 'ponto_turistico',
    subCategory: 'Ponto Panorâmico & Pôr do Sol',
    neighborhood: 'Monte Serrat / Boa Viagem',
    address: 'Rua da Boa Viagem, s/n - Monte Serrat',
    lat: -12.9295,
    lng: -38.5185,
    rating: 5.0,
    reviewCount: 4500,
    isOpenNow: true,
    is24h: true,
    openingHoursText: 'Acesso livre 24 horas',
    icon: 'Landmark',
    features: ['Farolzinho Histórico', 'Igreja de Nossa Senhora de Monte Serrat', 'Visual da Baía'],
  },

  // ==========================================
  // 🍤 RESTAURANTES & BOTECOS BAIANOS
  // ==========================================
  {
    id: 'poi-acaraje-dinha',
    name: 'Acarajé da Dinha - Largo de Santana',
    category: 'restaurante',
    subCategory: 'Acarajé Tradicional & Comida de Tabuleiro',
    neighborhood: 'Rio Vermelho',
    address: 'Largo de Santana, s/n - Rio Vermelho',
    lat: -13.0132,
    lng: -38.4925,
    phone: '(71) 3334-1704',
    rating: 4.9,
    reviewCount: 4100,
    isOpenNow: true,
    is24h: false,
    openingHoursText: '17:00 às 02:00 da madrugada',
    icon: 'Utensils',
    features: ['Acarajé no Azeite de Dendê Puro', 'Abará Especial com Camarão Seco', 'Cerveja Gelada'],
  },
  {
    id: 'poi-restaurante-senac-pelourinho',
    name: 'Restaurante Escola Senac Pelourinho',
    category: 'restaurante',
    subCategory: 'Buffet Típico Baiano & Doces Tradicionais',
    neighborhood: 'Pelourinho',
    address: 'Praça José de Alencar, 13/19 - Pelourinho',
    lat: -12.9712,
    lng: -38.5085,
    phone: '(71) 3324-4555',
    rating: 4.9,
    reviewCount: 2800,
    isOpenNow: true,
    is24h: false,
    openingHoursText: '11:30 às 15:30 (Almoço)',
    icon: 'Utensils',
    features: ['Mais de 40 pratos baianos', 'Museu da Gastronomia Baiana', 'Doces de Coco e Banana'],
  },
  {
    id: 'poi-sorveteria-da-ribeira',
    name: 'Sorveteria da Ribeira',
    category: 'restaurante',
    subCategory: 'Sorvetes Artesanais de Frutas Tropicais',
    neighborhood: 'Ribeira',
    address: 'Praça General Osório, 87 - Ribeira',
    lat: -12.9180,
    lng: -38.4975,
    phone: '(71) 3316-5488',
    rating: 5.0,
    reviewCount: 6200,
    isOpenNow: true,
    is24h: false,
    openingHoursText: '09:00 às 22:00',
    icon: 'Utensils',
    features: ['Fundada em 1931', 'Sorvetes de Tapioca, Mangaba, Pitanga e Biriba', 'Deck à Beira-Mar'],
  },

  // ==========================================
  // 🛒 SUPERMERCADOS
  // ==========================================
  {
    id: 'poi-atacadao-bonoco',
    name: 'Atacadão Salvador - Bonocô',
    category: 'supermercado',
    subCategory: 'Hipermercado Atacado e Varejo',
    neighborhood: 'Bonocô / Brotas',
    address: 'Av. Mário Leal Ferreira, 2800 - Bonocô',
    lat: -12.9790,
    lng: -38.4860,
    phone: '(71) 3380-4000',
    rating: 4.6,
    reviewCount: 1890,
    isOpenNow: true,
    is24h: false,
    openingHoursText: '07:00 às 22:00 (Domingo até 18:00)',
    icon: 'Store',
    features: ['Preço de Atacado', 'Padaria Própria', 'Açougue Completo', 'Estacionamento Coberto Gratuito'],
  },
  {
    id: 'poi-hiper-ideal-barra',
    name: 'Hiperideal Gourmet - Barra Chame-Chame',
    category: 'supermercado',
    subCategory: 'Supermercado Premium & Adega',
    neighborhood: 'Barra / Chame-Chame',
    address: 'Rua Miguel Burnier, 400 - Barra',
    lat: -13.0040,
    lng: -38.5250,
    phone: '(71) 3267-9000',
    rating: 4.8,
    reviewCount: 1100,
    isOpenNow: true,
    is24h: false,
    openingHoursText: '06:30 às 22:00',
    icon: 'Store',
    features: ['Adega Climatizada com Sommelier', 'Hortifruti Orgânico', 'Sushi Bar', 'Estacionamento'],
  },

  // ==========================================
  // 🔧 OFICINAS MECÂNICAS & AUTO CENTER
  // ==========================================
  {
    id: 'poi-auto-center-bonoco',
    name: 'Salvador Auto Center & Pneus - Bonocô',
    category: 'oficina_mecanica',
    subCategory: 'Mecânica Geral, Pneus & Alinhamento 3D',
    neighborhood: 'Bonocô',
    address: 'Av. Mário Leal Ferreira, 1500 - Bonocô',
    lat: -12.9830,
    lng: -38.4900,
    phone: '(71) 3381-8899',
    whatsapp: '(71) 98765-4321',
    rating: 4.7,
    reviewCount: 210,
    isOpenNow: true,
    is24h: false,
    openingHoursText: '07:30 às 18:00 (Sábado até 13:00)',
    icon: 'Wrench',
    features: ['Socorro Mecânico Guincho', 'Troca de Pastilhas e Suspensão', 'Recarga de Ar Condicionado'],
  },
  {
    id: 'poi-oficina-paralela-bosch',
    name: 'Bosch Car Service - Paralela',
    category: 'oficina_mecanica',
    subCategory: 'Injeção Eletrônica e Diagnóstico Computadorizado',
    neighborhood: 'Paralela / Imbuí',
    address: 'Av. Luís Viana Filho, 3200 - Imbuí',
    lat: -12.9650,
    lng: -38.4280,
    phone: '(71) 3362-7700',
    rating: 4.8,
    reviewCount: 190,
    isOpenNow: true,
    is24h: false,
    openingHoursText: '08:00 às 18:00',
    icon: 'Wrench',
    features: ['Garantia Nacional Bosch', 'Revisão Preventiva', 'Eletricista Automotivo'],
  },
];

// Helper to query POIs by category and distance
export function searchPoisByRadius(
  userLat: number,
  userLng: number,
  radiusKm = 10,
  category?: SalvadorPoiCategory,
  onlyOpen = false
): (SalvadorPoi & { distanceKm: number })[] {
  return SALVADOR_POIS_DATA.filter((poi) => {
    if (category && poi.category !== category) return false;
    if (onlyOpen && !poi.isOpenNow) return false;
    return true;
  })
    .map((poi) => {
      const distanceKm = calculateHaversineKm(userLat, userLng, poi.lat, poi.lng);
      return { ...poi, distanceKm };
    })
    .filter((poi) => poi.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

// Helper: Haversine distance in KM
export function calculateHaversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

// Categories metadata dictionary
export const POI_CATEGORIES_METADATA: Record<
  SalvadorPoiCategory,
  { label: string; icon: string; color: string; keywords: string[] }
> = {
  posto_combustivel: {
    label: 'Postos de Gasolina & GNV',
    icon: 'Fuel',
    color: '#D97706',
    keywords: ['posto', 'gasolina', 'combustivel', 'abastecer', 'etanol', 'gnv', 'diesel', 'shell', 'ipiranga', 'petrobras', 'br'],
  },
  shopping: {
    label: 'Shoppings Centers',
    icon: 'ShoppingBag',
    color: '#2563EB',
    keywords: ['shopping', 'lojas', 'compras', 'cinema', 'salvador shopping', 'shopping da bahia', 'shopping barra', 'shopping paralela'],
  },
  padaria: {
    label: 'Padarias & Delicatessens',
    icon: 'Croissant',
    color: '#D97706',
    keywords: ['padaria', 'pao', 'delicatessen', 'cafe', 'lanche', 'tapioca', 'cuscuz', 'confeitaria', 'salgado'],
  },
  farmacia: {
    label: 'Farmácias & Drogarias 24h',
    icon: 'Pill',
    color: '#DC2626',
    keywords: ['farmacia', 'drogaria', 'remedio', 'medicamento', '24h', 'pague menos', 'drogasil', 'drogaria sao paulo'],
  },
  hospital_upa: {
    label: 'Hospitais & UPAs 24h',
    icon: 'Hospital',
    color: '#E11D48',
    keywords: ['hospital', 'upa', 'pronto socorro', 'emergencia', 'medico', 'clinica', 'sus', 'hospital portugues', 'hospital da bahia'],
  },
  ponto_turistico: {
    label: 'Pontos Turísticos & Cultura',
    icon: 'Landmark',
    color: '#059669',
    keywords: ['turismo', 'farol da barra', 'pelourinho', 'elevador lacerda', 'bonfim', 'mercado modelo', 'humaita', 'praia', 'monumento'],
  },
  restaurante: {
    label: 'Restaurantes & Acarajé',
    icon: 'Utensils',
    color: '#EA580C',
    keywords: ['restaurante', 'acaraje', 'comida', 'almoco', 'jantar', 'moqueca', 'abara', 'sorvete', 'ribeira', 'dinha'],
  },
  supermercado: {
    label: 'Supermercados & Atacados',
    icon: 'Store',
    color: '#16A34A',
    keywords: ['supermercado', 'mercado', 'atacado', 'hiperideal', 'atacadão', 'compras do mes'],
  },
  oficina_mecanica: {
    label: 'Oficinas Mecânicas & Pneus',
    icon: 'Wrench',
    color: '#4B5563',
    keywords: ['oficina', 'mecanica', 'pneu', 'borracheiro', 'guincho', 'alinhamento', 'carro quebrou', 'auto center'],
  },
  bar_boteco: {
    label: 'Bares & Botecos',
    icon: 'Wine',
    color: '#7C3AED',
    keywords: ['bar', 'boteco', 'cerveja', 'happy hour', 'rio vermelho', 'chopp'],
  },
  banco_caixa24h: {
    label: 'Bancos & Caixas 24h',
    icon: 'CreditCard',
    color: '#0891B2',
    keywords: ['banco', 'caixa 24h', 'sacar dinheiro', 'bradesco', 'itau', 'banco do brasil', 'caixa economica'],
  },
  academia: {
    label: 'Academias & Fitness',
    icon: 'Dumbbell',
    color: '#0284C7',
    keywords: ['academia', 'treino', 'musculacao', 'smart fit', 'crossfit'],
  },
  hotel_pousada: {
    label: 'Hotéis & Pousadas',
    icon: 'Bed',
    color: '#6366F1',
    keywords: ['hotel', 'pousada', 'hospedagem', 'resort', 'dormir'],
  },
  estacao_transporte: {
    label: 'Estações de Metrô & Terminais',
    icon: 'Train',
    color: '#0B3D91',
    keywords: ['metro', 'estacao', 'onibus', 'terminal', 'rodoviaria', 'aeroporto', 'lapa', 'piraja', 'mussurunga'],
  },
};

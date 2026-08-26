/**
 * Base de Dados Geográfica Oficial de Salvador - Bahia (Google Earth / GPS)
 * Contém as coordenadas geográficas exatas (Latitude e Longitude)
 * de todos os bairros oficiais e pontos de referência de Salvador.
 */

export interface NeighborhoodGeoData {
  name: string;
  lat: number;
  lng: number;
  zoom: number;
  region: 'Orla Atlântica' | 'Centro / Pelourinho' | 'Cidade Baixa / Península' | 'Subúrbio Ferroviário' | 'Miolo / Cabula' | 'Cajazeiras' | 'Pau da Lima' | 'Itapuã / Ipitanga' | 'Ilhas';
  icon: string;
  keyStreets?: string[];
}

export const SALVADOR_NEIGHBORHOOD_GEO_MAP: Record<string, NeighborhoodGeoData> = {
  // --- Orla Atlântica & Sul Nobre ---
  'Barra': {
    name: 'Barra',
    lat: -13.0039,
    lng: -38.5326,
    zoom: 15,
    region: 'Orla Atlântica',
    icon: '⛵',
    keyStreets: ['Av. Oceânica', 'Av. Sete de Setembro', 'Rua Afonso Celso', 'Porto da Barra', 'Farol da Barra'],
  },
  'Graça': {
    name: 'Graça',
    lat: -12.9982,
    lng: -38.5228,
    zoom: 15,
    region: 'Orla Atlântica',
    icon: '🌳',
    keyStreets: ['Av. Princesa Leopoldina', 'Av. Euclydes da Cunha', 'Rua da Graça'],
  },
  'Vitória': {
    name: 'Vitória',
    lat: -12.9961,
    lng: -38.5262,
    zoom: 16,
    region: 'Orla Atlântica',
    icon: '🏛️',
    keyStreets: ['Corredor da Vitória', 'Largo da Vitória'],
  },
  'Corredor da Vitória': {
    name: 'Corredor da Vitória',
    lat: -12.9961,
    lng: -38.5262,
    zoom: 16,
    region: 'Orla Atlântica',
    icon: '🏛️',
    keyStreets: ['Av. Sete de Setembro - Corredor da Vitória'],
  },
  'Ondina': {
    name: 'Ondina',
    lat: -13.0072,
    lng: -38.5148,
    zoom: 15,
    region: 'Orla Atlântica',
    icon: '🌊',
    keyStreets: ['Av. Oceânica', 'Rua Doutor Oswaldo Ribeiro', 'Av. Adhemar de Barros'],
  },
  'Rio Vermelho': {
    name: 'Rio Vermelho',
    lat: -13.0145,
    lng: -38.4890,
    zoom: 15,
    region: 'Orla Atlântica',
    icon: '🐟',
    keyStreets: ['Rua da Paciência', 'Largo de Santana (Dinha)', 'Largo da Mariquita', 'Rua Odilon Santos'],
  },
  'Amaralina': {
    name: 'Amaralina',
    lat: -13.0112,
    lng: -38.4741,
    zoom: 15,
    region: 'Orla Atlântica',
    icon: '🏖️',
    keyStreets: ['Av. Amaralina', 'Rua Visconde de Itaborahy', 'Largo das Baianas de Amaralina'],
  },
  'Nordeste de Amaralina': {
    name: 'Nordeste de Amaralina',
    lat: -13.0062,
    lng: -38.4735,
    zoom: 15,
    region: 'Orla Atlântica',
    icon: '🥁',
    keyStreets: ['Rua Visconde de Mauá', 'Rua do Eco', 'Rua Cristóvão Ferreira'],
  },
  'Pituba': {
    name: 'Pituba',
    lat: -13.0010,
    lng: -38.4610,
    zoom: 15,
    region: 'Orla Atlântica',
    icon: '🏙️',
    keyStreets: ['Av. Manoel Dias da Silva', 'Av. Paulo VI', 'Av. Otávio Mangabeira', 'Rua das Hortênsias'],
  },
  'Itaigara': {
    name: 'Itaigara',
    lat: -12.9922,
    lng: -38.4715,
    zoom: 15,
    region: 'Orla Atlântica',
    icon: '🏢',
    keyStreets: ['Av. Antônio Carlos Magalhães', 'Rua Rubem Berta', 'Parque da Cidade'],
  },
  'Caminho das Árvores': {
    name: 'Caminho das Árvores',
    lat: -12.9815,
    lng: -38.4550,
    zoom: 15,
    region: 'Orla Atlântica',
    icon: '💼',
    keyStreets: ['Av. Tancredo Neves', 'Alameda das Espatódeas', 'Alameda dos Ipês', 'Shopping da Bahia'],
  },
  'Costa Azul': {
    name: 'Costa Azul',
    lat: -12.9960,
    lng: -38.4480,
    zoom: 15,
    region: 'Orla Atlântica',
    icon: '🌊',
    keyStreets: ['Rua Arthur de Azevêdo Machado', 'Av. Octávio Mangabeira', 'Parque Costa Azul'],
  },
  'Jardim Armação': {
    name: 'Jardim Armação',
    lat: -12.9790,
    lng: -38.4410,
    zoom: 15,
    region: 'Orla Atlântica',
    icon: '🪁',
    keyStreets: ['Av. Otávio Mangabeira', 'Rua Simon Bolívar', 'Centro de Convenções'],
  },
  'Armação': {
    name: 'Armação',
    lat: -12.9790,
    lng: -38.4410,
    zoom: 15,
    region: 'Orla Atlântica',
    icon: '🪁',
    keyStreets: ['Av. Otávio Mangabeira', 'Praia de Armação'],
  },
  'Boca do Rio': {
    name: 'Boca do Rio',
    lat: -12.9890,
    lng: -38.4320,
    zoom: 15,
    region: 'Orla Atlântica',
    icon: '🥥',
    keyStreets: ['Av. Otávio Mangabeira', 'Rua Desembargador Lineu Lapa Barreto', 'Parque dos Ventos'],
  },
  'Stiep': {
    name: 'Stiep',
    lat: -12.9850,
    lng: -38.4420,
    zoom: 15,
    region: 'Orla Atlântica',
    icon: '🎓',
    keyStreets: ['Av. Prof. Manoel Ribeiro', 'Rua Dr. José Peroba', 'UNIFACS'],
  },
  'Imbuí': {
    name: 'Imbuí',
    lat: -12.9730,
    lng: -38.4320,
    zoom: 15,
    region: 'Orla Atlântica',
    icon: '🍻',
    keyStreets: ['Av. Jorge Amado', 'Rua Jayme Sapolnik', 'Praça do Imbuí'],
  },
  'Pituaçu': {
    name: 'Pituaçu',
    lat: -12.9680,
    lng: -38.4120,
    zoom: 15,
    region: 'Orla Atlântica',
    icon: '🌿',
    keyStreets: ['Av. Otávio Mangabeira', 'Parque Metropolitano de Pituaçu', 'Av. Pinto de Aguiar'],
  },
  'Patamares': {
    name: 'Patamares',
    lat: -12.9620,
    lng: -38.4050,
    zoom: 15,
    region: 'Orla Atlântica',
    icon: '🌴',
    keyStreets: ['Av. Otávio Mangabeira', 'Rua Bicuíba', 'Av. Ibirapitanga'],
  },
  'Jaguaribe': {
    name: 'Jaguaribe',
    lat: -12.9530,
    lng: -38.3900,
    zoom: 15,
    region: 'Orla Atlântica',
    icon: '🏄',
    keyStreets: ['Av. Otávio Mangabeira', 'Praia de Jaguaribe', 'Av. Orlando Gomes'],
  },
  'Piatã': {
    name: 'Piatã',
    lat: -12.9490,
    lng: -38.3750,
    zoom: 15,
    region: 'Orla Atlântica',
    icon: '🥥',
    keyStreets: ['Av. Otávio Mangabeira', 'Rua Dias Gomes', 'Praia de Piatã'],
  },
  'Placaford': {
    name: 'Placaford',
    lat: -12.9500,
    lng: -38.3680,
    zoom: 15,
    region: 'Orla Atlântica',
    icon: '⛱️',
    keyStreets: ['Av. Otávio Mangabeira', 'Praia de Placaford'],
  },
  'Itapuã': {
    name: 'Itapuã',
    lat: -12.9525,
    lng: -38.3533,
    zoom: 15,
    region: 'Itapuã / Ipitanga',
    icon: '🥥',
    keyStreets: ['Praça Vinicius de Moraes', 'Farol de Itapuã', 'Rua Aristides Milton', 'Lagoa do Abaeté'],
  },
  'Stella Maris': {
    name: 'Stella Maris',
    lat: -12.9410,
    lng: -38.3320,
    zoom: 15,
    region: 'Itapuã / Ipitanga',
    icon: '🏄‍♂️',
    keyStreets: ['Alameda Praia de Guarajuba', 'Av. General Severino Filho', 'Praia de Stella Maris'],
  },
  'Praia do Flamengo': {
    name: 'Praia do Flamengo',
    lat: -12.9320,
    lng: -38.3240,
    zoom: 15,
    region: 'Itapuã / Ipitanga',
    icon: '☀️',
    keyStreets: ['Rua Desembargador Manoel de Andrade Teixeira', 'Praia do Flamengo'],
  },

  // --- Centro Histórico, Pelourinho e Vizinhança Central ---
  'Pelourinho': {
    name: 'Pelourinho',
    lat: -12.9718,
    lng: -38.5080,
    zoom: 16,
    region: 'Centro / Pelourinho',
    icon: '🏛️',
    keyStreets: ['Largo do Pelourinho', 'Terreiro de Jesus', 'Rua das Portas do Carmo', 'Rua Alfredo de Brito'],
  },
  'Pelourinho / Centro Histórico': {
    name: 'Pelourinho / Centro Histórico',
    lat: -12.9718,
    lng: -38.5080,
    zoom: 16,
    region: 'Centro / Pelourinho',
    icon: '🏛️',
    keyStreets: ['Largo do Pelourinho', 'Praça da Sé', 'Elevador Lacerda'],
  },
  'Centro Histórico': {
    name: 'Centro Histórico',
    lat: -12.9720,
    lng: -38.5085,
    zoom: 16,
    region: 'Centro / Pelourinho',
    icon: '⛪',
    keyStreets: ['Praça Municipal', 'Rua Chile', 'Praça Castro Alves'],
  },
  'Santo Antônio Além do Carmo': {
    name: 'Santo Antônio Além do Carmo',
    lat: -12.9650,
    lng: -38.5050,
    zoom: 16,
    region: 'Centro / Pelourinho',
    icon: '🌇',
    keyStreets: ['Largo do Carmo', 'Rua Direita de Santo Antônio', 'Cruz do Pascoal', 'Forte de Santo Antônio além do Carmo'],
  },
  'Carmo': {
    name: 'Carmo',
    lat: -12.9670,
    lng: -38.5060,
    zoom: 16,
    region: 'Centro / Pelourinho',
    icon: '⛪',
    keyStreets: ['Largo do Carmo', 'Ladeira do Carmo'],
  },
  'Barbalho': {
    name: 'Barbalho',
    lat: -12.9660,
    lng: -38.5020,
    zoom: 15,
    region: 'Centro / Pelourinho',
    icon: '🏰',
    keyStreets: ['Rua Emídio dos Santos', 'Forte do Barbalho', 'IFBA'],
  },
  'Saúde': {
    name: 'Saúde',
    lat: -12.9710,
    lng: -38.5040,
    zoom: 16,
    region: 'Centro / Pelourinho',
    icon: '🥘',
    keyStreets: ['Largo da Saúde', 'Rua da Glória'],
  },
  'Nazaré': {
    name: 'Nazaré',
    lat: -12.9760,
    lng: -38.5060,
    zoom: 15,
    region: 'Centro / Pelourinho',
    icon: '🏥',
    keyStreets: ['Av. Joana Angélica', 'Praça da Piedade', 'Hospital Santa Izabel', 'Colégio Central'],
  },
  'Barris': {
    name: 'Barris',
    lat: -12.9820,
    lng: -38.5150,
    zoom: 16,
    region: 'Centro / Pelourinho',
    icon: '📚',
    keyStreets: ['Rua General Labatut', 'Biblioteca Pública da Bahia', 'Av. Vale dos Barris'],
  },
  'Tororó': {
    name: 'Tororó',
    lat: -12.9839,
    lng: -38.5074,
    zoom: 16,
    region: 'Centro / Pelourinho',
    icon: '🗿',
    keyStreets: ['Dique do Tororó', 'Arena Fonte Nova', 'Rua do Amparo'],
  },
  'Garcia': {
    name: 'Garcia',
    lat: -12.9880,
    lng: -38.5130,
    zoom: 15,
    region: 'Centro / Pelourinho',
    icon: '🎭',
    keyStreets: ['Rua Leovigildo Filgueiras', 'Teatro Castro Alves', 'Rua Garcia D\'Ávila'],
  },
  'Canela': {
    name: 'Canela',
    lat: -12.9920,
    lng: -38.5180,
    zoom: 15,
    region: 'Centro / Pelourinho',
    icon: '🎓',
    keyStreets: ['Av. Reitor Miguel Calmon', 'Vale do Canela', 'Reitoria da UFBA'],
  },
  'Campo Grande': {
    name: 'Campo Grande',
    lat: -12.9895,
    lng: -38.5205,
    zoom: 16,
    region: 'Centro / Pelourinho',
    icon: '🌳',
    keyStreets: ['Praça Dois de Julho (Campo Grande)', 'Teatro Castro Alves', 'Av. Sete de Setembro'],
  },
  'Dois de Julho': {
    name: 'Dois de Julho',
    lat: -12.9810,
    lng: -38.5160,
    zoom: 16,
    region: 'Centro / Pelourinho',
    icon: '🛒',
    keyStreets: ['Rua Cabeça', 'Largo 2 de Julho', 'Av. Sete de Setembro'],
  },
  'Comércio': {
    name: 'Comércio',
    lat: -12.9734,
    lng: -38.5133,
    zoom: 15,
    region: 'Centro / Pelourinho',
    icon: '⛴️',
    keyStreets: ['Av. da França', 'Mercado Modelo', 'Av. Estados Unidos', 'Terminal Turístico Náutico'],
  },

  // --- Brotas & Região Central ---
  'Brotas': {
    name: 'Brotas',
    lat: -12.9840,
    lng: -38.4890,
    zoom: 15,
    region: 'Miolo / Cabula',
    icon: '🌿',
    keyStreets: ['Av. Dom João VI', 'Av. Laurindo Régis', 'Parque Solar Boa Vista'],
  },
  'Boa Vista de Brotas': {
    name: 'Boa Vista de Brotas',
    lat: -12.9810,
    lng: -38.4820,
    zoom: 15,
    region: 'Miolo / Cabula',
    icon: '🏘️',
    keyStreets: ['Rua Engenheiro Pires Rebelo', 'Av. Dom João VI'],
  },
  'Engenho Velho de Brotas': {
    name: 'Engenho Velho de Brotas',
    lat: -12.9870,
    lng: -38.4980,
    zoom: 15,
    region: 'Miolo / Cabula',
    icon: '🏘️',
    keyStreets: ['Rua Almirante Alves Câmara', 'Vila América'],
  },
  'Acupe': {
    name: 'Acupe',
    lat: -12.9900,
    lng: -38.4960,
    zoom: 15,
    region: 'Miolo / Cabula',
    icon: '🏘️',
    keyStreets: ['Acupe de Brotas', 'Av. Dom João VI'],
  },
  'Acupe de Brotas': {
    name: 'Acupe de Brotas',
    lat: -12.9900,
    lng: -38.4960,
    zoom: 15,
    region: 'Miolo / Cabula',
    icon: '🏘️',
    keyStreets: ['Rua do Acupe', 'Rua Jardim Castro Alves'],
  },
  'Horto Florestal': {
    name: 'Horto Florestal',
    lat: -12.9970,
    lng: -38.4850,
    zoom: 15,
    region: 'Orla Atlântica',
    icon: '🌳',
    keyStreets: ['Av. Santa Luzia', 'Rua Waldemar Falcão'],
  },
  'Candeal': {
    name: 'Candeal',
    lat: -12.9910,
    lng: -38.4770,
    zoom: 15,
    region: 'Orla Atlântica',
    icon: '🎶',
    keyStreets: ['Rua Paulo VI', 'Guetho Square', 'Candyall'],
  },
  'Federação': {
    name: 'Federação',
    lat: -13.0010,
    lng: -38.5080,
    zoom: 15,
    region: 'Centro / Pelourinho',
    icon: '🎓',
    keyStreets: ['Av. Cardeal da Silva', 'Rua Caetano Moura', 'Campus UFBA Federação'],
  },
  'Engenho Velho da Federação': {
    name: 'Engenho Velho da Federação',
    lat: -12.9960,
    lng: -38.5020,
    zoom: 15,
    region: 'Centro / Pelourinho',
    icon: '🏘️',
    keyStreets: ['Rua Apolinário Santana'],
  },
  'Alto das Pombas': {
    name: 'Alto das Pombas',
    lat: -12.9980,
    lng: -38.5120,
    zoom: 16,
    region: 'Centro / Pelourinho',
    icon: '🕊️',
    keyStreets: ['Rua Teixeira Mendes'],
  },
  'Calabar': {
    name: 'Calabar',
    lat: -13.0030,
    lng: -38.5180,
    zoom: 16,
    region: 'Orla Atlântica',
    icon: '🏘️',
    keyStreets: ['Rua Calabar', 'Av. Centenário'],
  },
  'Chame-Chame': {
    name: 'Chame-Chame',
    lat: -13.0060,
    lng: -38.5240,
    zoom: 16,
    region: 'Orla Atlântica',
    icon: '🛍️',
    keyStreets: ['Shopping Barra', 'Av. Centenário', 'Rua Comendador Bernardo Martins Catharino'],
  },
  'Matatu': {
    name: 'Matatu',
    lat: -12.9760,
    lng: -38.4910,
    zoom: 15,
    region: 'Miolo / Cabula',
    icon: '🏘️',
    keyStreets: ['Rua Barros Falcão', 'Rua dos Bandeirantes'],
  },
  'Vila Laura': {
    name: 'Vila Laura',
    lat: -12.9730,
    lng: -38.4880,
    zoom: 15,
    region: 'Miolo / Cabula',
    icon: '🏘️',
    keyStreets: ['Rua Prof. Aristides Fraga Lima', 'Rua Laura Costa'],
  },
  'Cosme de Farias': {
    name: 'Cosme de Farias',
    lat: -12.9750,
    lng: -38.4790,
    zoom: 15,
    region: 'Miolo / Cabula',
    icon: '🏘️',
    keyStreets: ['Rua Direta de Cosme de Farias', 'Av. Bonocô'],
  },
  'Luís Anselmo': {
    name: 'Luís Anselmo',
    lat: -12.9690,
    lng: -38.4840,
    zoom: 15,
    region: 'Miolo / Cabula',
    icon: '🏘️',
    keyStreets: ['Rua Luís Anselmo', 'Rua Baixa de Santo Antônio'],
  },

  // --- Cidade Baixa & Península Itapagipana ---
  'Bonfim': {
    name: 'Bonfim',
    lat: -12.9238,
    lng: -38.5086,
    zoom: 16,
    region: 'Cidade Baixa / Península',
    icon: '⛪',
    keyStreets: ['Colina Sagrada', 'Largo do Bonfim', 'Basílica do Senhor do Bonfim', 'Praça Edivaldo Boaventura'],
  },
  'Ribeira': {
    name: 'Ribeira',
    lat: -12.9090,
    lng: -38.4980,
    zoom: 15,
    region: 'Cidade Baixa / Península',
    icon: '🍨',
    keyStreets: ['Praça General Osório', 'Av. Beira Mar', 'Sorveteria da Ribeira', 'Enseada dos Tainheiros'],
  },
  'Monte Serrat': {
    name: 'Monte Serrat',
    lat: -12.9300,
    lng: -38.5200,
    zoom: 16,
    region: 'Cidade Baixa / Península',
    icon: '🏰',
    keyStreets: ['Forte de Nossa Senhora de Monte Serrat', 'Ponta de Humaitá', 'Rua da Boa Viagem'],
  },
  'Boa Viagem': {
    name: 'Boa Viagem',
    lat: -12.9300,
    lng: -38.5190,
    zoom: 16,
    region: 'Cidade Baixa / Península',
    icon: '⛵',
    keyStreets: ['Praia de Boa Viagem', 'Igreja de Nossa Senhora da Boa Viagem'],
  },
  'Calçada': {
    name: 'Calçada',
    lat: -12.9440,
    lng: -38.5020,
    zoom: 15,
    region: 'Cidade Baixa / Península',
    icon: '🚂',
    keyStreets: ['Rua Padre Antônio de Sá', 'Estação Ferroviária da Calçada', 'Rua Barão de Cotegipe'],
  },
  'Mares': {
    name: 'Mares',
    lat: -12.9360,
    lng: -38.5040,
    zoom: 15,
    region: 'Cidade Baixa / Península',
    icon: '🛍️',
    keyStreets: ['Largo dos Mares', 'Av. Fernandes da Cunha', 'Rua do Imperador'],
  },
  'Roma': {
    name: 'Roma',
    lat: -12.9320,
    lng: -38.5060,
    zoom: 15,
    region: 'Cidade Baixa / Península',
    icon: '🏥',
    keyStreets: ['Largo de Roma', 'Hospital Santo Antônio (Irmã Dulce)', 'Av. Dendezeiros'],
  },
  'Caminho de Areia': {
    name: 'Caminho de Areia',
    lat: -12.9260,
    lng: -38.5040,
    zoom: 15,
    region: 'Cidade Baixa / Península',
    icon: '🛣️',
    keyStreets: ['Av. Caminho de Areia', 'Rua Visconde de Caravelas'],
  },
  'Uruguai': {
    name: 'Uruguai',
    lat: -12.9280,
    lng: -38.4980,
    zoom: 15,
    region: 'Cidade Baixa / Península',
    icon: '🏘️',
    keyStreets: ['Rua Direta do Uruguai', 'Rua Régis Pacheco'],
  },
  'Massaranduba': {
    name: 'Massaranduba',
    lat: -12.9190,
    lng: -38.5020,
    zoom: 15,
    region: 'Cidade Baixa / Península',
    icon: '🏘️',
    keyStreets: ['Rua Lopes Trovão', 'Rua Leblon'],
  },
  'Vila Ruy Barbosa / Jardim Cruzeiro': {
    name: 'Vila Ruy Barbosa / Jardim Cruzeiro',
    lat: -12.9240,
    lng: -38.5000,
    zoom: 15,
    region: 'Cidade Baixa / Península',
    icon: '🏘️',
    keyStreets: ['Rua Resende Costa', 'Rua Visconde de Mauá'],
  },
  'Jardim Cruzeiro': {
    name: 'Jardim Cruzeiro',
    lat: -12.9240,
    lng: -38.5000,
    zoom: 15,
    region: 'Cidade Baixa / Península',
    icon: '🏘️',
    keyStreets: ['Rua Resende Costa', 'Largo do Cruzeiro'],
  },
  'Mangueira': {
    name: 'Mangueira',
    lat: -12.9150,
    lng: -38.5000,
    zoom: 15,
    region: 'Cidade Baixa / Península',
    icon: '🥭',
    keyStreets: ['Rua da Mangueira'],
  },

  // --- Liberdade & Região Histórica Popular ---
  'Liberdade': {
    name: 'Liberdade',
    lat: -12.9550,
    lng: -38.4980,
    zoom: 15,
    region: 'Centro / Pelourinho',
    icon: '👑',
    keyStreets: ['Estrada da Liberdade', 'Largo do Tanque', 'Rua Lima e Silva', 'Plano Inclinado Liberdade'],
  },
  'Curuzu': {
    name: 'Curuzu',
    lat: -12.9510,
    lng: -38.4950,
    zoom: 16,
    region: 'Centro / Pelourinho',
    icon: '🖤',
    keyStreets: ['Ladeira do Curuzu', 'Senzala do Barro Preto (Ilê Aiyê)'],
  },
  'Lapinha': {
    name: 'Lapinha',
    lat: -12.9590,
    lng: -38.5010,
    zoom: 16,
    region: 'Centro / Pelourinho',
    icon: '⛪',
    keyStreets: ['Largo da Lapinha', 'Igreja da Lapinha', 'Estrada da Rainha'],
  },
  'Pero Vaz': {
    name: 'Pero Vaz',
    lat: -12.9560,
    lng: -38.4910,
    zoom: 15,
    region: 'Centro / Pelourinho',
    icon: '🏘️',
    keyStreets: ['Rua Pero Vaz', 'Rua Meireles'],
  },
  'IAPI': {
    name: 'IAPI',
    lat: -12.9540,
    lng: -38.4880,
    zoom: 15,
    region: 'Centro / Pelourinho',
    icon: '🏘️',
    keyStreets: ['Rua Conde de Porto Alegre', 'Rua Jair Santos'],
  },
  'Santa Mônica': {
    name: 'Santa Mônica',
    lat: -12.9590,
    lng: -38.4840,
    zoom: 15,
    region: 'Centro / Pelourinho',
    icon: '🏘️',
    keyStreets: ['Rua Aristides de Oliveira', 'Rua Dr. Alberto de Oliveira'],
  },
  'Caixa D\'Água': {
    name: 'Caixa D\'Água',
    lat: -12.9620,
    lng: -38.4920,
    zoom: 15,
    region: 'Centro / Pelourinho',
    icon: '💧',
    keyStreets: ['Rua Saldanha Marinho', 'Hospital Ernesto Simões'],
  },
  'Cidade Nova': {
    name: 'Cidade Nova',
    lat: -12.9580,
    lng: -38.4960,
    zoom: 15,
    region: 'Centro / Pelourinho',
    icon: '🏘️',
    keyStreets: ['Rua 25 de Dezembro', 'Av. General San Martin'],
  },
  'Baixa de Quintas': {
    name: 'Baixa de Quintas',
    lat: -12.9630,
    lng: -38.4990,
    zoom: 15,
    region: 'Centro / Pelourinho',
    icon: '🏘️',
    keyStreets: ['Estrada da Rainha', 'Cemitério Quinta dos Lázaros'],
  },

  // --- Cabula, Retiro & Miolo ---
  'Cabula': {
    name: 'Cabula',
    lat: -12.9530,
    lng: -38.4620,
    zoom: 15,
    region: 'Miolo / Cabula',
    icon: '🎓',
    keyStreets: ['Rua Silveira Martins', 'UNEB (Universidade do Estado da Bahia)', 'Plaza Shopping Cabula'],
  },
  'Cabula VI': {
    name: 'Cabula VI',
    lat: -12.9480,
    lng: -38.4550,
    zoom: 15,
    region: 'Miolo / Cabula',
    icon: '🏘️',
    keyStreets: ['Rua Teódulo de Albuquerque', 'Conjunto Cabula VI'],
  },
  'Resgate': {
    name: 'Resgate',
    lat: -12.9560,
    lng: -38.4600,
    zoom: 15,
    region: 'Miolo / Cabula',
    icon: '🌳',
    keyStreets: ['Rua Nossa Senhora do Resgate', 'Rua Silveira Martins'],
  },
  'Barreiras': {
    name: 'Barreiras',
    lat: -12.9500,
    lng: -38.4550,
    zoom: 15,
    region: 'Miolo / Cabula',
    icon: '🏘️',
    keyStreets: ['Rua Fernando Pedreira', 'Estrada de Barreiras'],
  },
  'Engomadeira': {
    name: 'Engomadeira',
    lat: -12.9450,
    lng: -38.4580,
    zoom: 15,
    region: 'Miolo / Cabula',
    icon: '🏘️',
    keyStreets: ['Rua Direta da Engomadeira'],
  },
  'Mata Escura': {
    name: 'Mata Escura',
    lat: -12.9440,
    lng: -38.4480,
    zoom: 15,
    region: 'Miolo / Cabula',
    icon: '🏘️',
    keyStreets: ['Rua Direta da Mata Escura', 'Av. Cardeal Brandão Vilela'],
  },
  'Calabetão': {
    name: 'Calabetão',
    lat: -12.9370,
    lng: -38.4560,
    zoom: 15,
    region: 'Miolo / Cabula',
    icon: '🏘️',
    keyStreets: ['BR-324', 'Rua Rodolfo Tourinho'],
  },
  'Sussuarana': {
    name: 'Sussuarana',
    lat: -12.9380,
    lng: -38.4350,
    zoom: 15,
    region: 'Miolo / Cabula',
    icon: '🏢',
    keyStreets: ['Av. Ulysses Guimarães', 'Tribunal de Justiça CAB'],
  },
  'Nova Sussuarana': {
    name: 'Nova Sussuarana',
    lat: -12.9420,
    lng: -38.4280,
    zoom: 15,
    region: 'Miolo / Cabula',
    icon: '🏘️',
    keyStreets: ['Av. Ulysses Guimarães', 'Rua Santíssima Trindade'],
  },
  'Arenoso': {
    name: 'Arenoso',
    lat: -12.9460,
    lng: -38.4410,
    zoom: 15,
    region: 'Miolo / Cabula',
    icon: '🏘️',
    keyStreets: ['Rua Direta do Arenoso', 'Rua Barão de Mauá'],
  },
  'Tancredo Neves': {
    name: 'Tancredo Neves',
    lat: -12.9510,
    lng: -38.4380,
    zoom: 15,
    region: 'Miolo / Cabula',
    icon: '🏘️',
    keyStreets: ['Rua Direta de Tancredo Neves', 'Beiru'],
  },
  'Beiru / Tancredo Neves': {
    name: 'Beiru / Tancredo Neves',
    lat: -12.9510,
    lng: -38.4380,
    zoom: 15,
    region: 'Miolo / Cabula',
    icon: '🏘️',
    keyStreets: ['Rua Direta de Tancredo Neves', 'Largo do Arancuan'],
  },
  'Narandiba': {
    name: 'Narandiba',
    lat: -12.9580,
    lng: -38.4450,
    zoom: 15,
    region: 'Miolo / Cabula',
    icon: '🏥',
    keyStreets: ['Av. Edgard Santos', 'Hospital Geral Roberto Santos'],
  },
  'Saboeiro': {
    name: 'Saboeiro',
    lat: -12.9610,
    lng: -38.4520,
    zoom: 15,
    region: 'Miolo / Cabula',
    icon: '🏘️',
    keyStreets: ['Rua Silveira Martins', 'Rua do Saboeiro'],
  },
  'Doron': {
    name: 'Doron',
    lat: -12.9640,
    lng: -38.4390,
    zoom: 15,
    region: 'Miolo / Cabula',
    icon: '🏘️',
    keyStreets: ['Rua Cidália Menezes', 'Av. Paralela'],
  },
  'Retiro': {
    name: 'Retiro',
    lat: -12.9580,
    lng: -38.4730,
    zoom: 15,
    region: 'Miolo / Cabula',
    icon: '🚇',
    keyStreets: ['Av. Luís Eduardo Magalhães', 'Estação Retiro do Metrô', 'Av. San Martin'],
  },
  'Arraial do Retiro': {
    name: 'Arraial do Retiro',
    lat: -12.9520,
    lng: -38.4630,
    zoom: 15,
    region: 'Miolo / Cabula',
    icon: '🏘️',
    keyStreets: ['Rua Direta do Arraial', 'Estrada das Barreiras'],
  },
  'San Martin': {
    name: 'San Martin',
    lat: -12.9460,
    lng: -38.4860,
    zoom: 15,
    region: 'Miolo / Cabula',
    icon: '🚗',
    keyStreets: ['Av. General San Martin', 'Rua do Forno'],
  },
  'Fazenda Grande do Retiro': {
    name: 'Fazenda Grande do Retiro',
    lat: -12.9470,
    lng: -38.4710,
    zoom: 15,
    region: 'Miolo / Cabula',
    icon: '🛍️',
    keyStreets: ['Rua Mello Moraes Filho', 'Rua Pedro Melo'],
  },
  'São Caetano': {
    name: 'São Caetano',
    lat: -12.9380,
    lng: -38.4780,
    zoom: 15,
    region: 'Miolo / Cabula',
    icon: '🛍️',
    keyStreets: ['Rua Direta de São Caetano', 'Largo da Geralda', 'Rua Rodovia A'],
  },
  'Capelinha': {
    name: 'Capelinha',
    lat: -12.9310,
    lng: -38.4740,
    zoom: 15,
    region: 'Miolo / Cabula',
    icon: '⛪',
    keyStreets: ['Rua Capelinha de São Caetano'],
  },
  'Boa Vista de São Caetano': {
    name: 'Boa Vista de São Caetano',
    lat: -12.9260,
    lng: -38.4680,
    zoom: 15,
    region: 'Miolo / Cabula',
    icon: '🏘️',
    keyStreets: ['Rua Boa Vista', 'Rua da Bate Folha'],
  },
  'Alto do Peru': {
    name: 'Alto do Peru',
    lat: -12.9320,
    lng: -38.4820,
    zoom: 15,
    region: 'Miolo / Cabula',
    icon: '🏘️',
    keyStreets: ['Rua Alto do Peru', 'Rua Nilo Peçanha'],
  },
  'Marechal Rondon': {
    name: 'Marechal Rondon',
    lat: -12.9240,
    lng: -38.4620,
    zoom: 15,
    region: 'Miolo / Cabula',
    icon: '🏘️',
    keyStreets: ['Rua Vicente Celestino', 'Av. Afrânio Peixoto'],
  },
  'Pirajá': {
    name: 'Pirajá',
    lat: -12.9080,
    lng: -38.4680,
    zoom: 15,
    region: 'Miolo / Cabula',
    icon: '⚔️',
    keyStreets: ['Panteão de Pirajá', 'Estrada de Campinas', 'Estação Pirajá de Metrô e Ônibus'],
  },
  'Campinas de Pirajá': {
    name: 'Campinas de Pirajá',
    lat: -12.9140,
    lng: -38.4620,
    zoom: 15,
    region: 'Miolo / Cabula',
    icon: '🏭',
    keyStreets: ['Estrada de Campinas', 'Rua da Matriz'],
  },
  'Granjas Rurais Presidente Vargas': {
    name: 'Granjas Rurais Presidente Vargas',
    lat: -12.9310,
    lng: -38.4450,
    zoom: 15,
    region: 'Miolo / Cabula',
    icon: '🏢',
    keyStreets: ['BR-324', 'Rua da Indústria'],
  },
  'Centro Administrativo da Bahia (CAB)': {
    name: 'Centro Administrativo da Bahia (CAB)',
    lat: -12.9460,
    lng: -38.4310,
    zoom: 15,
    region: 'Miolo / Cabula',
    icon: '🏛️',
    keyStreets: ['Av. Luís Viana Filho (Paralela)', 'Secretarias de Estado', 'Assembleia Legislativa ALBA'],
  },
  'CAB': {
    name: 'CAB',
    lat: -12.9460,
    lng: -38.4310,
    zoom: 15,
    region: 'Miolo / Cabula',
    icon: '🏛️',
    keyStreets: ['Av. Luís Viana Filho (Paralela)', 'Tribunais e Secretarias'],
  },

  // --- Subúrbio Ferroviário ---
  'Lobato': {
    name: 'Lobato',
    lat: -12.9150,
    lng: -38.4870,
    zoom: 15,
    region: 'Subúrbio Ferroviário',
    icon: '⛽',
    keyStreets: ['Av. Afrânio Peixoto (Suburbana)', 'Largo do Luso', 'Primeiro Poço de Petróleo'],
  },
  'Alto do Cabrito': {
    name: 'Alto do Cabrito',
    lat: -12.9020,
    lng: -38.4790,
    zoom: 15,
    region: 'Subúrbio Ferroviário',
    icon: '🏘️',
    keyStreets: ['Rua Alto do Cabrito', 'Parque São Bartolomeu'],
  },
  'Plataforma': {
    name: 'Plataforma',
    lat: -12.8940,
    lng: -38.4930,
    zoom: 15,
    region: 'Subúrbio Ferroviário',
    icon: '⛴️',
    keyStreets: ['Travessia Marítima Plataforma-Ribeira', 'Av. Afrânio Peixoto', 'Rua São Geraldo'],
  },
  'Itacaranha': {
    name: 'Itacaranha',
    lat: -12.8820,
    lng: -38.4860,
    zoom: 15,
    region: 'Subúrbio Ferroviário',
    icon: '🚂',
    keyStreets: ['Av. Afrânio Peixoto', 'Praça de Itacaranha', 'Estação Ferroviária'],
  },
  'Escada': {
    name: 'Escada',
    lat: -12.8720,
    lng: -38.4830,
    zoom: 15,
    region: 'Subúrbio Ferroviário',
    icon: '🌊',
    keyStreets: ['Av. Afrânio Peixoto', 'Igreja de Nossa Senhora da Escada'],
  },
  'Praia Grande': {
    name: 'Praia Grande',
    lat: -12.8680,
    lng: -38.4810,
    zoom: 15,
    region: 'Subúrbio Ferroviário',
    icon: '🏖️',
    keyStreets: ['Av. Afrânio Peixoto', 'Praia Grande Subúrbio'],
  },
  'Periperi': {
    name: 'Periperi',
    lat: -12.8620,
    lng: -38.4810,
    zoom: 15,
    region: 'Subúrbio Ferroviário',
    icon: '🛍️',
    keyStreets: ['Praça do Sol (Periperi)', 'Av. Afrânio Peixoto', 'Rua Frederico Costa', 'Mercado de Periperi'],
  },
  'Coutos': {
    name: 'Coutos',
    lat: -12.8520,
    lng: -38.4790,
    zoom: 15,
    region: 'Subúrbio Ferroviário',
    icon: '🏘️',
    keyStreets: ['Av. Afrânio Peixoto', 'Rua Santo Antônio de Coutos'],
  },
  'Fazenda Coutos': {
    name: 'Fazenda Coutos',
    lat: -12.8480,
    lng: -38.4750,
    zoom: 15,
    region: 'Subúrbio Ferroviário',
    icon: '🏘️',
    keyStreets: ['Rua Theotônio Vilela', 'Estrada da Base Naval'],
  },
  'Alto da Terezinha': {
    name: 'Alto da Terezinha',
    lat: -12.8790,
    lng: -38.4760,
    zoom: 15,
    region: 'Subúrbio Ferroviário',
    icon: '🏘️',
    keyStreets: ['Rua Direta do Alto da Terezinha'],
  },
  'Rio Sena': {
    name: 'Rio Sena',
    lat: -12.8850,
    lng: -38.4720,
    zoom: 15,
    region: 'Subúrbio Ferroviário',
    icon: '🏘️',
    keyStreets: ['Rua Rio Sena', 'Rua Terezinha'],
  },
  'Ilha Amarela': {
    name: 'Ilha Amarela',
    lat: -12.8910,
    lng: -38.4730,
    zoom: 15,
    region: 'Subúrbio Ferroviário',
    icon: '🏘️',
    keyStreets: ['Rua Nova Esperança', 'Parque São Bartolomeu'],
  },
  'Paripe': {
    name: 'Paripe',
    lat: -12.8220,
    lng: -38.4780,
    zoom: 15,
    region: 'Subúrbio Ferroviário',
    icon: '🌴',
    keyStreets: ['Rua Almirante Tamandaré', 'Av. Afrânio Peixoto', 'Estação Paripe', 'Praça de Paripe'],
  },
  'São Tomé de Paripe': {
    name: 'São Tomé de Paripe',
    lat: -12.8120,
    lng: -38.4850,
    zoom: 15,
    region: 'Subúrbio Ferroviário',
    icon: '⛵',
    keyStreets: ['Praia de São Tomé de Paripe', 'Terminal Marítimo para Ilha de Maré'],
  },
  'Tubarão': {
    name: 'Tubarão',
    lat: -12.8190,
    lng: -38.4810,
    zoom: 15,
    region: 'Subúrbio Ferroviário',
    icon: '🌊',
    keyStreets: ['Praia do Tubarão', 'Av. São Tomé'],
  },

  // --- Pau da Lima & Paralela ---
  'Pau da Lima': {
    name: 'Pau da Lima',
    lat: -12.9290,
    lng: -38.4280,
    zoom: 15,
    region: 'Pau da Lima',
    icon: '🛍️',
    keyStreets: ['Av. São Rafael', 'Rua Jayme Vieira Lima', 'Largo de Pau da Lima'],
  },
  'São Rafael': {
    name: 'São Rafael',
    lat: -12.9390,
    lng: -38.4210,
    zoom: 15,
    region: 'Pau da Lima',
    icon: '🏥',
    keyStreets: ['Av. São Rafael', 'Hospital São Rafael'],
  },
  'São Marcos': {
    name: 'São Marcos',
    lat: -12.9340,
    lng: -38.4120,
    zoom: 15,
    region: 'Pau da Lima',
    icon: '🏘️',
    keyStreets: ['Av. São Marcos', 'Hospital Universitário'],
  },
  'Castelo Branco': {
    name: 'Castelo Branco',
    lat: -12.9120,
    lng: -38.4210,
    zoom: 15,
    region: 'Pau da Lima',
    icon: '🏰',
    keyStreets: ['Via Castelo Branco', 'Rua Genaro de Carvalho'],
  },
  'Sete de Abril': {
    name: 'Sete de Abril',
    lat: -12.9180,
    lng: -38.4120,
    zoom: 15,
    region: 'Pau da Lima',
    icon: '🏘️',
    keyStreets: ['Rua Nossa Senhora do Carmo', 'Rua Sete de Abril'],
  },
  'Vila Canária': {
    name: 'Vila Canária',
    lat: -12.9240,
    lng: -38.4240,
    zoom: 15,
    region: 'Pau da Lima',
    icon: '⚽',
    keyStreets: ['Rua Ypiranga', 'Estádio do Ypiranga'],
  },
  'Dom Avelar': {
    name: 'Dom Avelar',
    lat: -12.9160,
    lng: -38.4390,
    zoom: 15,
    region: 'Pau da Lima',
    icon: '🏘️',
    keyStreets: ['Rua dos Franciscanos', 'Rua das Carmelitas'],
  },
  'Canabrava': {
    name: 'Canabrava',
    lat: -12.9330,
    lng: -38.4190,
    zoom: 15,
    region: 'Pau da Lima',
    icon: '🦁',
    keyStreets: ['Av. Artêmio Castro Valente', 'Estádio Barradão (EC Vitória)'],
  },
  'Nova Brasília': {
    name: 'Nova Brasília',
    lat: -12.9260,
    lng: -38.4020,
    zoom: 15,
    region: 'Pau da Lima',
    icon: '🏘️',
    keyStreets: ['Estrada da Nova Brasília', 'Praça de Nova Brasília'],
  },
  'Trobogy': {
    name: 'Trobogy',
    lat: -12.9380,
    lng: -38.3990,
    zoom: 15,
    region: 'Pau da Lima',
    icon: '🎓',
    keyStreets: ['Av. Aliomar Baleeiro (Estrada Velha)', 'UniFTC Paralela'],
  },

  // --- Cajazeiras & Águas Claras ---
  'Águas Claras': {
    name: 'Águas Claras',
    lat: -12.8950,
    lng: -38.4310,
    zoom: 15,
    region: 'Cajazeiras',
    icon: '🚇',
    keyStreets: ['Estação Águas Claras de Metrô e BRT', 'Estrada do Matadouro', 'Av. 29 de Março'],
  },
  'Cajazeiras': {
    name: 'Cajazeiras',
    lat: -12.8980,
    lng: -38.4050,
    zoom: 14,
    region: 'Cajazeiras',
    icon: '🏙️',
    keyStreets: ['Estrada da Paciência', 'Rua Direta de Cajazeiras', 'Rotatória da Rótula da Feirinha'],
  },
  'Cajazeiras II': {
    name: 'Cajazeiras II',
    lat: -12.9020,
    lng: -38.4080,
    zoom: 15,
    region: 'Cajazeiras',
    icon: '🏘️',
    keyStreets: ['Estrada da Paciência - Setor II'],
  },
  'Cajazeiras IV': {
    name: 'Cajazeiras IV',
    lat: -12.8990,
    lng: -38.4040,
    zoom: 15,
    region: 'Cajazeiras',
    icon: '🏘️',
    keyStreets: ['Rua Juscelino Kubitschek'],
  },
  'Cajazeiras V': {
    name: 'Cajazeiras V',
    lat: -12.8940,
    lng: -38.4020,
    zoom: 15,
    region: 'Cajazeiras',
    icon: '🏘️',
    keyStreets: ['Estrada do Coqueiro Grande'],
  },
  'Cajazeiras VI': {
    name: 'Cajazeiras VI',
    lat: -12.8910,
    lng: -38.4000,
    zoom: 15,
    region: 'Cajazeiras',
    icon: '🏘️',
    keyStreets: ['Rua Deputado Herculano Menezes'],
  },
  'Cajazeiras VII': {
    name: 'Cajazeiras VII',
    lat: -12.8880,
    lng: -38.3970,
    zoom: 15,
    region: 'Cajazeiras',
    icon: '🏘️',
    keyStreets: ['Rua Engenheiro Raymundo Mascarenhas'],
  },
  'Cajazeiras VIII': {
    name: 'Cajazeiras VIII',
    lat: -12.8850,
    lng: -38.3950,
    zoom: 15,
    region: 'Cajazeiras',
    icon: '🏥',
    keyStreets: ['Hospital Municipal de Salvador (HMS)', 'Rua Deputado Paulo Jackson'],
  },
  'Cajazeiras X': {
    name: 'Cajazeiras X',
    lat: -12.8820,
    lng: -38.3930,
    zoom: 15,
    region: 'Cajazeiras',
    icon: '🛍️',
    keyStreets: ['Rua Direta de Cajazeiras X', 'Feirinha de Cajazeiras 10'],
  },
  'Cajazeiras XI': {
    name: 'Cajazeiras XI',
    lat: -12.8790,
    lng: -38.3910,
    zoom: 15,
    region: 'Cajazeiras',
    icon: '🏘️',
    keyStreets: ['Rua Juscelino Kubitschek - Setor XI'],
  },
  'Fazenda Grande I': {
    name: 'Fazenda Grande I',
    lat: -12.8910,
    lng: -38.4090,
    zoom: 15,
    region: 'Cajazeiras',
    icon: '🏘️',
    keyStreets: ['Estrada do Coqueiro Grande'],
  },
  'Fazenda Grande II': {
    name: 'Fazenda Grande II',
    lat: -12.8880,
    lng: -38.4070,
    zoom: 15,
    region: 'Cajazeiras',
    icon: '🏘️',
    keyStreets: ['Rua Antônio Carlos Magalhães - FG'],
  },
  'Fazenda Grande III': {
    name: 'Fazenda Grande III',
    lat: -12.8850,
    lng: -38.4050,
    zoom: 15,
    region: 'Cajazeiras',
    icon: '🏘️',
    keyStreets: ['Quadra D - Fazenda Grande III'],
  },
  'Fazenda Grande IV': {
    name: 'Fazenda Grande IV',
    lat: -12.8820,
    lng: -38.4030,
    zoom: 15,
    region: 'Cajazeiras',
    icon: '🏘️',
    keyStreets: ['Rua Gabriel Soares'],
  },
  'Jaguaripe I': {
    name: 'Jaguaripe I',
    lat: -12.8820,
    lng: -38.3920,
    zoom: 15,
    region: 'Cajazeiras',
    icon: '🏘️',
    keyStreets: ['Estrada de Jaguaripe'],
  },
  'Boca da Mata': {
    name: 'Boca da Mata',
    lat: -12.8790,
    lng: -38.4150,
    zoom: 15,
    region: 'Cajazeiras',
    icon: '🏘️',
    keyStreets: ['Setor 5 - Boca da Mata'],
  },
  'Valéria': {
    name: 'Valéria',
    lat: -12.8680,
    lng: -38.4430,
    zoom: 15,
    region: 'Cajazeiras',
    icon: '🛣️',
    keyStreets: ['BR-324 (km 620)', 'Rua Nova Brasília de Valéria', 'Largo da Matriz de Valéria'],
  },
  'Palestina': {
    name: 'Palestina',
    lat: -12.8450,
    lng: -38.4350,
    zoom: 15,
    region: 'Cajazeiras',
    icon: '🏘️',
    keyStreets: ['BR-324 Norte', 'Rua da Palestina'],
  },

  // --- Itapuã, São Cristóvão & Litoral Norte SSA ---
  'Mussurunga': {
    name: 'Mussurunga',
    lat: -12.9250,
    lng: -38.3720,
    zoom: 15,
    region: 'Itapuã / Ipitanga',
    icon: '🚇',
    keyStreets: ['Estação Mussurunga de Metrô e Ônibus', 'Setores A a L de Mussurunga', 'Av. Paralela'],
  },
  'São Cristóvão': {
    name: 'São Cristóvão',
    lat: -12.9120,
    lng: -38.3480,
    zoom: 15,
    region: 'Itapuã / Ipitanga',
    icon: '✈️',
    keyStreets: ['Av. São Cristóvão', 'Praça da Matriz de São Cristóvão', 'Acesso Aeroporto'],
  },
  'Aeroporto': {
    name: 'Aeroporto',
    lat: -12.9080,
    lng: -38.3320,
    zoom: 15,
    region: 'Itapuã / Ipitanga',
    icon: '✈️',
    keyStreets: ['Aeroporto Internacional de Salvador - Dep. Luís Eduardo Magalhães', 'BAMBUSAZZO'],
  },
  'Jardim das Margaridas': {
    name: 'Jardim das Margaridas',
    lat: -12.9050,
    lng: -38.3620,
    zoom: 15,
    region: 'Itapuã / Ipitanga',
    icon: '🌸',
    keyStreets: ['Rua Joaquim Ferreira', 'Estrada do Caji'],
  },
  'Bairro da Paz': {
    name: 'Bairro da Paz',
    lat: -12.9360,
    lng: -38.3810,
    zoom: 15,
    region: 'Itapuã / Ipitanga',
    icon: '🕊️',
    keyStreets: ['Av. Paralela', 'Rua da Paz', 'Rua Nossa Senhora da Paz'],
  },
  'Alto do Coqueirinho': {
    name: 'Alto do Coqueirinho',
    lat: -12.9450,
    lng: -38.3650,
    zoom: 15,
    region: 'Itapuã / Ipitanga',
    icon: '🥥',
    keyStreets: ['Rua Alto do Coqueirinho', 'Acesso Itapuã'],
  },
  'Ititioca': {
    name: 'Ititioca',
    lat: -12.9490,
    lng: -38.3580,
    zoom: 15,
    region: 'Itapuã / Ipitanga',
    icon: '🏘️',
    keyStreets: ['Rua Ititioca'],
  },

  // --- Ilhas Oficiais de Salvador ---
  'Ilha dos Frades': {
    name: 'Ilha dos Frades',
    lat: -12.7950,
    lng: -38.6410,
    zoom: 14,
    region: 'Ilhas',
    icon: '🏝️',
    keyStreets: ['Praia de Ponta de Nossa Senhora de Guadalupe', 'Praia da Viração'],
  },
  'Ilha de Bom Jesus dos Passos': {
    name: 'Ilha de Bom Jesus dos Passos',
    lat: -12.7610,
    lng: -38.6380,
    zoom: 15,
    region: 'Ilhas',
    icon: '⛪',
    keyStreets: ['Orla de Bom Jesus', 'Igreja Matriz de Bom Jesus'],
  },
  'Ilha de Maré': {
    name: 'Ilha de Maré',
    lat: -12.8250,
    lng: -38.5280,
    zoom: 14,
    region: 'Ilhas',
    icon: '⛵',
    keyStreets: ['Praia de Itamoabo', 'Praia das Neves', 'Praia de Botelho'],
  },
};

/**
 * Retorna as coordenadas oficiais e exatas de qualquer bairro de Salvador.
 * Se houver variação de escrita ou acentuação, normaliza e localiza com precisão.
 */
export function getSalvadorNeighborhoodLocation(query: string): NeighborhoodGeoData {
  if (!query || typeof query !== 'string') {
    return SALVADOR_NEIGHBORHOOD_GEO_MAP['Barra'];
  }

  const cleanQuery = query.trim();

  // 1. Busca exata direta
  if (SALVADOR_NEIGHBORHOOD_GEO_MAP[cleanQuery]) {
    return SALVADOR_NEIGHBORHOOD_GEO_MAP[cleanQuery];
  }

  // 2. Normalização para busca insensível a maiúsculas e acentos
  const normalizeText = (str: string) =>
    str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '');

  const normalizedQuery = normalizeText(cleanQuery);

  // Busca em chaves normalizadas
  for (const [key, val] of Object.entries(SALVADOR_NEIGHBORHOOD_GEO_MAP)) {
    if (normalizeText(key) === normalizedQuery) {
      return val;
    }
  }

  // Busca parcial (ex: "pelourinho" em "Pelourinho / Centro Histórico")
  for (const [key, val] of Object.entries(SALVADOR_NEIGHBORHOOD_GEO_MAP)) {
    const normKey = normalizeText(key);
    if (normKey.includes(normalizedQuery) || normalizedQuery.includes(normKey)) {
      return val;
    }
  }

  // Fallback padrão se não encontrar: Centro de Salvador (Barra / Pelourinho)
  return {
    name: cleanQuery,
    lat: -12.9777,
    lng: -38.5016,
    zoom: 14,
    region: 'Centro / Pelourinho',
    icon: '📍',
  };
}

/**
 * Parser inteligente de link do Google Maps, Google Earth ou coordenadas GPS puras.
 * Suporta:
 * - Links encurtados ou completos: https://maps.app.goo.gl/... / https://www.google.com/maps/...
 * - Parâmetros com @lat,lng: https://www.google.com/maps/@-13.0039,-38.5326,17z
 * - Parâmetros de busca ?q=lat,lng ou ?query=lat,lng ou ?ll=lat,lng
 * - Coordenadas puras digitadas: "-13.0039, -38.5326" ou "-13.0039 -38.5326"
 * - Links geo: geo:-13.0039,-38.5326
 */
export interface ParsedGpsLocation {
  lat: number;
  lng: number;
  isValidCoordinates: boolean;
  googleMapsUrl: string;
  sourceType: 'google_maps_url' | 'raw_coordinates' | 'neighborhood_fallback';
  formattedDisplay: string;
}

export function parseGoogleMapsUrlOrGps(
  input: string,
  fallbackNeighborhood?: string
): ParsedGpsLocation {
  const trimmed = input ? input.trim() : '';

  if (trimmed) {
    // 1. Tentar extrair @lat,lng do Google Maps (ex: @-12.9714,-38.5080)
    const atMatch = trimmed.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (atMatch) {
      const lat = parseFloat(atMatch[1]);
      const lng = parseFloat(atMatch[2]);
      if (isValidSalvadorCoordinate(lat, lng)) {
        return {
          lat,
          lng,
          isValidCoordinates: true,
          googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
          sourceType: 'google_maps_url',
          formattedDisplay: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
        };
      }
    }

    // 2. Tentar extrair query/q/ll/destination/daddr (ex: ?q=-12.9714,-38.5080)
    const queryMatch = trimmed.match(/[?&](?:q|query|ll|destination|daddr|saddr|center)=(-?\d+\.\d+)[,%20]+(-?\d+\.\d+)/i);
    if (queryMatch) {
      const lat = parseFloat(queryMatch[1]);
      const lng = parseFloat(queryMatch[2]);
      if (isValidSalvadorCoordinate(lat, lng)) {
        return {
          lat,
          lng,
          isValidCoordinates: true,
          googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
          sourceType: 'google_maps_url',
          formattedDisplay: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
        };
      }
    }

    // 3. Tentar extrair geo: URI (ex: geo:-12.9714,-38.5080)
    const geoMatch = trimmed.match(/geo:(-?\d+\.\d+),(-?\d+\.\d+)/i);
    if (geoMatch) {
      const lat = parseFloat(geoMatch[1]);
      const lng = parseFloat(geoMatch[2]);
      if (isValidSalvadorCoordinate(lat, lng)) {
        return {
          lat,
          lng,
          isValidCoordinates: true,
          googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
          sourceType: 'google_maps_url',
          formattedDisplay: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
        };
      }
    }

    // 4. Tentar extrair coordenadas puras no texto (ex: "-13.0039, -38.5326" ou "-13.0039 -38.5326")
    const rawCoordMatch = trimmed.match(/(-?\d{1,2}\.\d+)[,\s/|]+(-?\d{1,3}\.\d+)/);
    if (rawCoordMatch) {
      const lat = parseFloat(rawCoordMatch[1]);
      const lng = parseFloat(rawCoordMatch[2]);
      if (isValidSalvadorCoordinate(lat, lng)) {
        return {
          lat,
          lng,
          isValidCoordinates: true,
          googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
          sourceType: 'raw_coordinates',
          formattedDisplay: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
        };
      }
    }

    // 5. Se for um link do Google Maps com endereço/busca ou link curto (ex: maps.app.goo.gl)
    if (trimmed.includes('maps.google.') || trimmed.includes('google.com/maps') || trimmed.includes('maps.app.goo.gl') || trimmed.includes('goo.gl/maps')) {
      const fallbackGeo = getSalvadorNeighborhoodLocation(fallbackNeighborhood || 'Barra');
      return {
        lat: fallbackGeo.lat,
        lng: fallbackGeo.lng,
        isValidCoordinates: true,
        googleMapsUrl: trimmed.startsWith('http') ? trimmed : `https://${trimmed}`,
        sourceType: 'google_maps_url',
        formattedDisplay: `Link do Google Maps cadastrado`,
      };
    }
  }

  // Fallback baseado no bairro selecionado
  const neighborhoodGeo = getSalvadorNeighborhoodLocation(fallbackNeighborhood || 'Barra');
  return {
    lat: neighborhoodGeo.lat,
    lng: neighborhoodGeo.lng,
    isValidCoordinates: false,
    googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${fallbackNeighborhood || 'Salvador'}, Salvador - BA`
    )}`,
    sourceType: 'neighborhood_fallback',
    formattedDisplay: `GPS aproximado de ${neighborhoodGeo.name}`,
  };
}

/**
 * Validador de coordenadas para o quadrante do Estado da Bahia / Salvador
 * Latitude de Salvador: ~ -12.5 a -13.2
 * Longitude de Salvador: ~ -38.1 a -38.8
 */
export function isValidSalvadorCoordinate(lat: number, lng: number): boolean {
  if (isNaN(lat) || isNaN(lng)) return false;
  // Latitude do hemisfério sul do Brasil / Bahia (-25 até 0)
  // Longitude do Brasil (-75 até -30)
  const isWithinBahiaRegion = lat >= -18.5 && lat <= -8.0 && lng >= -46.0 && lng <= -36.0;
  return isWithinBahiaRegion;
}

/**
 * Converte latitude e longitude de Salvador para porcentagem X e Y (0 a 100) do mapa SVG
 */
export function calculateSalvadorMapPercent(lat: number, lng: number): { mapX: number; mapY: number } {
  // Limites aproximados da cidade de Salvador para projeção 2D
  const minLat = -13.04;
  const maxLat = -12.78;
  const minLng = -38.65;
  const maxLng = -38.28;

  const mapX = Math.min(Math.max(((lng - minLng) / (maxLng - minLng)) * 100, 5), 95);
  // Latitudes são invertidas no eixo Y visual
  const mapY = Math.min(Math.max(((maxLat - lat) / (maxLat - minLat)) * 100, 5), 95);

  return {
    mapX: Math.round(mapX),
    mapY: Math.round(mapY),
  };
}

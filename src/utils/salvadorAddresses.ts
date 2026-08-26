import { getSalvadorNeighborhoodLocation } from './salvadorGeoDatabase';

// Salvador Address, Streets & CEP Database and Lookup Engine

export interface SalvadorAddressRecord {
  cep: string;
  street: string;
  neighborhood: string;
  reference?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export const POPULAR_SALVADOR_LOCATIONS: SalvadorAddressRecord[] = [
  // Barra
  {
    cep: '40140-130',
    street: 'Avenida Sete de Setembro',
    neighborhood: 'Barra',
    reference: 'Próximo ao Porto da Barra e Forte de Santa Maria',
    coordinates: { lat: -13.0039, lng: -38.5326 },
  },
  {
    cep: '40140-110',
    street: 'Avenida Oceânica',
    neighborhood: 'Barra',
    reference: 'Orla da Barra / Farol da Barra',
    coordinates: { lat: -13.0097, lng: -38.5315 },
  },
  {
    cep: '40140-400',
    street: 'Rua Afonso Celso',
    neighborhood: 'Barra',
    reference: 'Trecho gastronômico da Barra',
    coordinates: { lat: -13.0062, lng: -38.5301 },
  },
  {
    cep: '40140-650',
    street: 'Avenida Centenário',
    neighborhood: 'Barra',
    reference: 'Próximo ao Shopping Barra',
    coordinates: { lat: -13.0005, lng: -38.5245 },
  },
  {
    cep: '40140-380',
    street: 'Rua Marquês de Caravelas',
    neighborhood: 'Barra',
    reference: 'Centro comercial da Barra',
    coordinates: { lat: -13.0078, lng: -38.5282 },
  },

  // Pelourinho & Centro Histórico
  {
    cep: '40026-280',
    street: 'Largo do Pelourinho',
    neighborhood: 'Centro Histórico',
    reference: 'Casa de Jorge Amado e Fundação Casa do Pelô',
    coordinates: { lat: -12.9718, lng: -38.508 },
  },
  {
    cep: '40026-010',
    street: 'Praça Quinze de Novembro (Terreiro de Jesus)',
    neighborhood: 'Centro Histórico',
    reference: 'Catedral Basílica de Salvador',
    coordinates: { lat: -12.9729, lng: -38.5101 },
  },
  {
    cep: '40020-000',
    street: 'Rua Chile',
    neighborhood: 'Centro',
    reference: 'Primeira rua do Brasil / Fera Palace Hotel',
    coordinates: { lat: -12.9755, lng: -38.514 },
  },
  {
    cep: '40026-290',
    street: 'Rua das Laranjeiras',
    neighborhood: 'Centro Histórico',
    reference: 'Pelourinho Baixo / Galerias de Arte',
    coordinates: { lat: -12.9715, lng: -38.5074 },
  },
  {
    cep: '40026-020',
    street: 'Rua do Passo',
    neighborhood: 'Centro Histórico',
    reference: 'Escadaria da Igreja do Passo',
    coordinates: { lat: -12.9692, lng: -38.5072 },
  },

  // Rio Vermelho
  {
    cep: '41940-000',
    street: 'Praça Brigadeiro Faria Rocha (Largo de Santana)',
    neighborhood: 'Rio Vermelho',
    reference: 'Largo de Dinha / Acarajé da Dinha',
    coordinates: { lat: -13.0145, lng: -38.489 },
  },
  {
    cep: '41940-570',
    street: 'Rua da Paciência',
    neighborhood: 'Rio Vermelho',
    reference: 'Orla do Rio Vermelho e Casa de Iemanjá',
    coordinates: { lat: -13.015, lng: -38.494 },
  },
  {
    cep: '41950-640',
    street: 'Rua Odilon Santos',
    neighborhood: 'Rio Vermelho',
    reference: 'Largo da Mariquita / Polo Noturno',
    coordinates: { lat: -13.0125, lng: -38.4862 },
  },
  {
    cep: '41950-670',
    street: 'Rua Fonte do Boi',
    neighborhood: 'Rio Vermelho',
    reference: 'Polo gastronômico e hoteleiro',
    coordinates: { lat: -13.0118, lng: -38.482 },
  },

  // Pituba
  {
    cep: '41810-000',
    street: 'Avenida Manoel Dias da Silva',
    neighborhood: 'Pituba',
    reference: 'Corredor comercial da Pituba',
    coordinates: { lat: -13.001, lng: -38.461 },
  },
  {
    cep: '41830-000',
    street: 'Avenida Paulo VI',
    neighborhood: 'Pituba',
    reference: 'Corredor gastronômico e serviços',
    coordinates: { lat: -12.998, lng: -38.455 },
  },
  {
    cep: '41830-450',
    street: 'Avenida Octávio Mangabeira',
    neighborhood: 'Pituba',
    reference: 'Orla da Pituba / Praça Jardim dos Namorados',
    coordinates: { lat: -13.004, lng: -38.452 },
  },
  {
    cep: '41810-011',
    street: 'Rua Amazonas',
    neighborhood: 'Pituba',
    reference: 'Área nobre e residencial',
    coordinates: { lat: -13.003, lng: -38.464 },
  },

  // Itapuã
  {
    cep: '41610-010',
    street: 'Praça Vinicius de Moraes',
    neighborhood: 'Itapuã',
    reference: 'Farol de Itapuã e estátua de Vinicius',
    coordinates: { lat: -12.9525, lng: -38.3533 },
  },
  {
    cep: '41610-000',
    street: 'Rua Aristides Milton',
    neighborhood: 'Itapuã',
    reference: 'Praia de Itapuã / Sereia de Itapuã',
    coordinates: { lat: -12.954, lng: -38.358 },
  },
  {
    cep: '41630-000',
    street: 'Avenida Dorival Caymmi',
    neighborhood: 'Itapuã',
    reference: 'Principal ligação Itapuã / Aeroporto',
    coordinates: { lat: -12.946, lng: -38.362 },
  },

  // Bonfim
  {
    cep: '40415-000',
    street: 'Largo do Bonfim',
    neighborhood: 'Bonfim',
    reference: 'Basílica Santuário do Senhor do Bonfim',
    coordinates: { lat: -12.9238, lng: -38.5086 },
  },
  {
    cep: '40415-030',
    street: 'Avenida Dendezeiros do Bonfim',
    neighborhood: 'Bonfim',
    reference: 'Caminho Sagrado da Colina',
    coordinates: { lat: -12.928, lng: -38.506 },
  },

  // Ribeira
  {
    cep: '40420-000',
    street: 'Praça General Osório',
    neighborhood: 'Ribeira',
    reference: 'Orla da Ribeira e Sorveteria da Ribeira',
    coordinates: { lat: -12.909, lng: -38.498 },
  },
  {
    cep: '40420-130',
    street: 'Avenida Beira Mar',
    neighborhood: 'Ribeira',
    reference: 'Enseada dos Tainheiros',
    coordinates: { lat: -12.911, lng: -38.495 },
  },

  // Caminho das Árvores / Iguatemi
  {
    cep: '41820-020',
    street: 'Avenida Tancredo Neves',
    neighborhood: 'Caminho das Árvores',
    reference: 'Centro Financeiro / Salvador Shopping',
    coordinates: { lat: -12.9815, lng: -38.455 },
  },
  {
    cep: '41820-560',
    street: 'Alameda das Espatódeas',
    neighborhood: 'Caminho das Árvores',
    reference: 'Alameda de Decoração e Design',
    coordinates: { lat: -12.986, lng: -38.458 },
  },

  // Campo Grande & Canela / Corredor da Vitória
  {
    cep: '40080-002',
    street: 'Praça Dois de Julho (Campo Grande)',
    neighborhood: 'Campo Grande',
    reference: 'Teatro Castro Alves (TCA) / Concha Acústica',
    coordinates: { lat: -12.9895, lng: -38.5205 },
  },
  {
    cep: '40081-000',
    street: 'Avenida Sete de Setembro (Corredor da Vitória)',
    neighborhood: 'Vitória',
    reference: 'Museu de Arte da Bahia (MAB) / Mansões da Vitória',
    coordinates: { lat: -12.996, lng: -38.526 },
  },

  // Ondina
  {
    cep: '40170-010',
    street: 'Avenida Oceânica',
    neighborhood: 'Ondina',
    reference: 'Monumento As Gordinhas / Circuito Barra-Ondina',
    coordinates: { lat: -13.007, lng: -38.515 },
  },
  {
    cep: '40170-110',
    street: 'Avenida Adhemar de Barros',
    neighborhood: 'Ondina',
    reference: 'Campus Universitário da UFBA',
    coordinates: { lat: -13.003, lng: -38.508 },
  },

  // Stella Maris
  {
    cep: '41600-500',
    street: 'Alameda Praia de Guarajuba',
    neighborhood: 'Stella Maris',
    reference: 'Praia de Stella Maris / Grand Hotel',
    coordinates: { lat: -12.941, lng: -38.332 },
  },

  // Liberdade
  {
    cep: '40375-016',
    street: 'Estrada da Liberdade',
    neighborhood: 'Liberdade',
    reference: 'Sede do Ilê Aiyê / Curuzu',
    coordinates: { lat: -12.955, lng: -38.498 },
  },

  // Imbuí
  {
    cep: '41720-000',
    street: 'Avenida Jorge Amado',
    neighborhood: 'Imbuí',
    reference: 'Praça do Imbuí e quiosques de petiscos',
    coordinates: { lat: -12.973, lng: -38.432 },
  },

  // Brotas
  {
    cep: '40285-000',
    street: 'Avenida Dom João VI',
    neighborhood: 'Brotas',
    reference: 'Polo médico e comercial de Brotas',
    coordinates: { lat: -12.984, lng: -38.489 },
  },

  // Costa Azul
  {
    cep: '41760-000',
    street: 'Rua Arthur de Azevêdo Machado',
    neighborhood: 'Costa Azul',
    reference: 'Parque Costa Azul',
    coordinates: { lat: -12.996, lng: -38.448 },
  },

  // Patamares
  {
    cep: '41680-010',
    street: 'Avenida Professor Pinto de Aguiar',
    neighborhood: 'Patamares',
    reference: 'Parque de Pituaçu e Orla de Patamares',
    coordinates: { lat: -12.962, lng: -38.405 },
  },

  // Cabula
  {
    cep: '41150-000',
    street: 'Estrada das Barreiras / Rua Silveira Martins',
    neighborhood: 'Cabula',
    reference: 'UNEB / Campus Universitário',
    coordinates: { lat: -12.953, lng: -38.462 },
  },

  // Cajazeiras
  {
    cep: '41330-000',
    street: 'Estrada do Coqueiro Grande',
    neighborhood: 'Cajazeiras X',
    reference: 'Rótula da Feirinha / Shopping Cajazeiras',
    coordinates: { lat: -12.898, lng: -38.398 },
  },

  // Periperi / Subúrbio Ferroviário
  {
    cep: '40720-000',
    street: 'Rua Frederico Costa',
    neighborhood: 'Periperi',
    reference: 'Praça da Revolução / Estação de Trem',
    coordinates: { lat: -12.862, lng: -38.481 },
  },
];

export interface CepLookupResult {
  cep: string;
  street: string;
  neighborhood: string;
  city: string;
  uf: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  source: 'local_database' | 'viacep_api';
}

/**
 * Clean CEP string (digits only)
 */
export function cleanCep(cep: string): string {
  return cep.replace(/\D/g, '');
}

/**
 * Format CEP string to XXXXX-XXX
 */
export function formatCep(cep: string): string {
  const digits = cleanCep(cep);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5, 8)}`;
}

/**
 * Look up a Salvador CEP with offline-first local database and ViaCEP fallback
 */
export async function lookupSalvadorCep(rawCep: string): Promise<CepLookupResult | null> {
  const digits = cleanCep(rawCep);
  if (digits.length !== 8) return null;

  const formatted = formatCep(digits);

  // 1. Check local database first
  const localMatch = POPULAR_SALVADOR_LOCATIONS.find(
    (loc) => cleanCep(loc.cep) === digits || loc.cep === formatted
  );

  if (localMatch) {
    return {
      cep: localMatch.cep,
      street: localMatch.street,
      neighborhood: localMatch.neighborhood,
      city: 'Salvador',
      uf: 'BA',
      coordinates: localMatch.coordinates,
      source: 'local_database',
    };
  }

  // 2. Query ViaCEP online service
  try {
    const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
    if (res.ok) {
      const data = await res.json();
      if (!data.erro) {
        // Approximate coordinates according to neighborhood
        const fallbackCoords = getApproximateSalvadorCoordinates(data.bairro || 'Salvador');
        return {
          cep: data.cep || formatted,
          street: data.logradouro || '',
          neighborhood: data.bairro || 'Salvador',
          city: data.localidade || 'Salvador',
          uf: data.uf || 'BA',
          coordinates: fallbackCoords,
          source: 'viacep_api',
        };
      }
    }
  } catch {
    // Network failure / offline
  }

  return null;
}

/**
 * Search Salvador streets and locations by query string
 */
export function searchSalvadorLocations(query: string, neighborhoodFilter?: string): SalvadorAddressRecord[] {
  const q = query.toLowerCase().trim();

  return POPULAR_SALVADOR_LOCATIONS.filter((item) => {
    if (neighborhoodFilter && neighborhoodFilter !== 'Todos os Bairros' && neighborhoodFilter !== 'Todos') {
      if (item.neighborhood.toLowerCase() !== neighborhoodFilter.toLowerCase()) {
        return false;
      }
    }

    if (!q) return true;

    return (
      item.street.toLowerCase().includes(q) ||
      item.neighborhood.toLowerCase().includes(q) ||
      item.cep.includes(q) ||
      (item.reference && item.reference.toLowerCase().includes(q))
    );
  });
}

/**
 * Approximate lat/lng for Salvador neighborhoods using precise Google Earth data
 */
export function getApproximateSalvadorCoordinates(neighborhood: string): { lat: number; lng: number } {
  const loc = getSalvadorNeighborhoodLocation(neighborhood);
  return { lat: loc.lat, lng: loc.lng };
}

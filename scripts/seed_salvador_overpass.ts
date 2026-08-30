/**
 * ==============================================================================
 * 🛰️ SCRIPT DE COLETA & SINCRONIZAÇÃO OPENSTREETMAP (OVERPASS API) PARA SALVADOR
 * Coleta estabelecimentos comerciais, postos, farmácias, shoppings e monumentos
 * ==============================================================================
 * 
 * Execução:
 * npx tsx scripts/seed_salvador_overpass.ts
 */

import fs from 'fs';
import path from 'path';

// Salvador Bounding Box (Sul, Oeste, Norte, Leste)
const SALVADOR_BBOX = '-13.05,-38.55,-12.80,-38.30';

// Query Overpass Turbo para buscar amenidades e comércios de Salvador
const OVERPASS_QUERY = `
[out:json][timeout:35];
(
  // Postos de Combustível
  node["amenity"="fuel"](${SALVADOR_BBOX});
  // Farmácias
  node["amenity"="pharmacy"](${SALVADOR_BBOX});
  // Shoppings & Mercados
  node["shop"="mall"](${SALVADOR_BBOX});
  node["shop"="supermarket"](${SALVADOR_BBOX});
  node["shop"="bakery"](${SALVADOR_BBOX});
  // Hospitais e Clínicas
  node["amenity"="hospital"](${SALVADOR_BBOX});
  node["amenity"="clinic"](${SALVADOR_BBOX});
  // Turismo e Cultura
  node["tourism"="attraction"](${SALVADOR_BBOX});
  node["tourism"="viewpoint"](${SALVADOR_BBOX});
  node["historic"](${SALVADOR_BBOX});
  // Gastronomia Baiana
  node["amenity"="restaurant"](${SALVADOR_BBOX});
);
out body;
>;
out skel qt;
`;

interface OsmNode {
  type: 'node';
  id: number;
  lat: number;
  lon: number;
  tags?: Record<string, string>;
}

export async function fetchSalvadorOverpassData(): Promise<OsmNode[]> {
  console.log('📡 [SALVÓ MAPPING] Conectando aos servidores Overpass da OpenStreetMap...');
  const url = 'https://overpass-api.de/api/interpreter';

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: `data=${encodeURIComponent(OVERPASS_QUERY)}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'SalvoAppSalvadorNavigation/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`Erro na resposta Overpass API: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const nodes: OsmNode[] = data.elements.filter((el: any) => el.type === 'node' && el.tags && el.tags.name);
    console.log(`✅ [SALVÓ MAPPING] Sucesso! ${nodes.length} estabelecimentos catalogados em Salvador.`);
    return nodes;
  } catch (error) {
    console.error('❌ Erro ao consultar Overpass API:', error);
    return [];
  }
}

export async function generatePostGisInsertSql(nodes: OsmNode[]): Promise<string> {
  const sqlStatements: string[] = [
    '-- INSERÇÕES GERADAS AUTOMATICAMENTE VIA OVERPASS API (SALVADOR - BAHIA)',
    'BEGIN;',
  ];

  nodes.forEach((node) => {
    const tags = node.tags || {};
    const name = (tags.name || 'Sem nome').replace(/'/g, "''");
    const street = (tags['addr:street'] || tags['addr:full'] || 'Logradouro de Salvador').replace(/'/g, "''");
    const neighborhood = (tags['addr:suburb'] || tags['addr:district'] || 'Salvador').replace(/'/g, "''");
    const phone = tags.phone || tags['contact:phone'] || tags['contact:whatsapp'] || null;

    let categoria = 'loja_comercio';
    if (tags.amenity === 'fuel') categoria = 'posto_combustivel';
    else if (tags.amenity === 'pharmacy') categoria = 'farmacia';
    else if (tags.shop === 'bakery') categoria = 'padaria';
    else if (tags.shop === 'supermarket') categoria = 'supermercado';
    else if (tags.shop === 'mall') categoria = 'shopping';
    else if (tags.amenity === 'restaurant') categoria = 'restaurante';
    else if (tags.amenity === 'hospital' || tags.amenity === 'clinic') categoria = 'hospital_upa';
    else if (tags.tourism === 'attraction' || tags.tourism === 'viewpoint' || tags.historic) categoria = 'ponto_turistico';

    const tagsJson = JSON.stringify(tags).replace(/'/g, "''");

    const sql = `
INSERT INTO salvador_pois (
  osm_id, nome, categoria, bairro, logradouro, telefone, tags, geom
) VALUES (
  ${node.id},
  '${name}',
  '${categoria}'::tipo_poi_enum,
  '${neighborhood}',
  '${street}',
  ${phone ? `'${phone}'` : 'NULL'},
  '${tagsJson}'::jsonb,
  ST_SetSRID(ST_MakePoint(${node.lon}, ${node.lat}), 4326)
) ON CONFLICT (osm_id) DO UPDATE SET
  nome = EXCLUDED.nome,
  geom = EXCLUDED.geom,
  tags = EXCLUDED.tags,
  atualizado_em = CURRENT_TIMESTAMP;`;

    sqlStatements.push(sql);
  });

  sqlStatements.push('COMMIT;');
  return sqlStatements.join('\n');
}

// Execução standalone
if (process.argv[1] && process.argv[1].endsWith('seed_salvador_overpass.ts')) {
  (async () => {
    const nodes = await fetchSalvadorOverpassData();
    if (nodes.length > 0) {
      const sql = await generatePostGisInsertSql(nodes);
      const outputPath = path.join(process.cwd(), 'src/db/salvador_overpass_seed.sql');
      fs.writeFileSync(outputPath, sql);
      console.log(`💾 Arquivo SQL gerado com sucesso em: ${outputPath}`);
    }
  })();
}

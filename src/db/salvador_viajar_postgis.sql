-- ==============================================================================
-- 🚗 SALVÓ VIAJAR — ESQUEMA COMPLETO DE BANCO DE DADOS GEOESPACIAL (POSTGRESQL 15+ & POSTGIS 3+)
-- Módulo de Navegação Inteligente, Roteirização Offline, Mapeamento de Salvador & POIs
-- ==============================================================================

-- 1. Habilitação de Extensões Geoespaciais e Utilitárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "postgis_topology";
CREATE EXTENSION IF NOT EXISTS "fuzzystrmatch"; -- Para busca fonética de ruas de Salvador

-- 2. ENUMS DE NAVEGAÇÃO E ESTABELECIMENTOS
CREATE TYPE tipo_poi_enum AS ENUM (
    'posto_combustivel',
    'farmacia',
    'padaria',
    'supermercado',
    'shopping',
    'restaurante',
    'bar_boteco',
    'hospital_upa',
    'banco_caixa24h',
    'ponto_turistico',
    'oficina_mecanica',
    'academia',
    'escola_faculdade',
    'hotel_pousada',
    'loja_comercio',
    'estacao_transporte'
);

CREATE TYPE modo_navegacao_enum AS ENUM ('carro', 'moto', 'bicicleta', 'caminhada', 'transporte_publico');
CREATE TYPE status_rota_enum AS ENUM ('calculada', 'em_andamento', 'concluida', 'cancelada', 'recalculada');
CREATE TYPE condicao_transito_enum AS ENUM ('livre', 'moderado', 'intenso', 'lento', 'interditado');

-- ==============================================================================
-- 3. TABELA DE CATEGORIAS DE POIS (PONTOS DE INTERESSE)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS poi_categorias (
    id VARCHAR(50) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    icone VARCHAR(50) NOT NULL,
    cor_pin VARCHAR(20) DEFAULT '#0B3D91',
    tags_osm TEXT[] DEFAULT '{}',
    sinonimos TEXT[] DEFAULT '{}',
    descricao TEXT
);

-- ==============================================================================
-- 4. TABELA PRINCIPAL DE POIS / ESTABELECIMENTOS DE SALVADOR (POSTGIS GEOMETRY)
-- Armazena todos os pontos mapeados via Overpass API, lojas do SALVÓ e cadastros locais
-- ==============================================================================
CREATE TABLE IF NOT EXISTS salvador_pois (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    osm_id BIGINT UNIQUE,
    loja_salvo_id UUID, -- Referência opcional à loja cadastrada no SALVÓ
    nome VARCHAR(255) NOT NULL,
    categoria tipo_poi_enum NOT NULL,
    subcategoria VARCHAR(100),
    bairro VARCHAR(100) NOT NULL,
    logradouro VARCHAR(255),
    numero VARCHAR(30),
    cep VARCHAR(10),
    cidade VARCHAR(100) DEFAULT 'Salvador',
    uf VARCHAR(2) DEFAULT 'BA',
    telefone VARCHAR(50),
    whatsapp VARCHAR(50),
    website TEXT,
    horario_funcionamento JSONB DEFAULT '{"aberto_24h": false, "dias": []}'::jsonb,
    esta_aberto_agora BOOLEAN DEFAULT TRUE,
    avaliacao_media NUMERIC(3, 2) DEFAULT 4.5,
    total_avaliacoes INT DEFAULT 0,
    tags JSONB DEFAULT '{}'::jsonb, -- Metadados brutos do OpenStreetMap (ex: brand, amenity, fuel:cng)
    
    -- Coluna Geoespacial PostGIS (EPSG 4326: WGS 84 Lat/Lng)
    geom GEOMETRY(Point, 4326) NOT NULL,
    
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices Espaciais e de Busca Textual para Alto Desempenho
CREATE INDEX IF NOT EXISTS idx_salvador_pois_geom ON salvador_pois USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_salvador_pois_categoria ON salvador_pois (categoria);
CREATE INDEX IF NOT EXISTS idx_salvador_pois_bairro ON salvador_pois (bairro);
CREATE INDEX IF NOT EXISTS idx_salvador_pois_nome_trgm ON salvador_pois USING gin (nome gin_trgm_ops);

-- ==============================================================================
-- 5. TABELA DE ROTAS E NAVEGAÇÃO GPS (ESTILO UBER / 99)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS rotas_navegacao (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID,
    origem_nome VARCHAR(255) NOT NULL,
    origem_geom GEOMETRY(Point, 4326) NOT NULL,
    destino_nome VARCHAR(255) NOT NULL,
    destino_geom GEOMETRY(Point, 4326) NOT NULL,
    destino_poi_id UUID REFERENCES salvador_pois(id) ON DELETE SET NULL,
    
    modo_transporte modo_navegacao_enum DEFAULT 'carro',
    distancia_metros INT NOT NULL,
    tempo_estimado_segundos INT NOT NULL,
    
    -- Linha de geometria completa do trajeto (LineString)
    trajeto_geom GEOMETRY(LineString, 4326) NOT NULL,
    
    instrucoes_passo_a_passo JSONB NOT NULL DEFAULT '[]'::jsonb,
    condicao_transito condicao_transito_enum DEFAULT 'moderado',
    status status_rota_enum DEFAULT 'calculada',
    calculado_offline BOOLEAN DEFAULT FALSE,
    recalculado_count INT DEFAULT 0,
    
    iniciado_em TIMESTAMP WITH TIME ZONE,
    finalizado_em TIMESTAMP WITH TIME ZONE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_rotas_trajeto_geom ON rotas_navegacao USING GIST (trajeto_geom);

-- ==============================================================================
-- 6. TABELA DE SESSÕES DE NAVEGAÇÃO EM TEMPO REAL & TELEMETRIA
-- ==============================================================================
CREATE TABLE IF NOT EXISTS sessoes_navegacao_telemetria (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rota_id UUID NOT NULL REFERENCES rotas_navegacao(id) ON DELETE CASCADE,
    usuario_id UUID,
    posicao_atual GEOMETRY(Point, 4326) NOT NULL,
    velocidade_kmh NUMERIC(5, 2) DEFAULT 0,
    direcao_graus NUMERIC(5, 2) DEFAULT 0, -- Heading (0° a 360°)
    distancia_restante_metros INT,
    tempo_restante_segundos INT,
    passo_atual_indice INT DEFAULT 0,
    estava_offline BOOLEAN DEFAULT FALSE,
    registrado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_telemetria_posicao ON sessoes_navegacao_telemetria USING GIST (posicao_atual);

-- ==============================================================================
-- 7. TABELA DE PACOTES DE MAPAS OFFLINE DE SALVADOR
-- Gerenciamento de blocos de tiles e malhas viárias para download PWA
-- ==============================================================================
CREATE TABLE IF NOT EXISTS pacotes_mapa_offline (
    id VARCHAR(50) PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    regiao_bairros TEXT[] NOT NULL,
    bbox_geometria GEOMETRY(Polygon, 4326) NOT NULL,
    zoom_min INT DEFAULT 11,
    zoom_max INT DEFAULT 17,
    tamanho_estimado_mb NUMERIC(6, 2) NOT NULL,
    total_tiles INT NOT NULL,
    total_pois_incluidos INT DEFAULT 0,
    versao VARCHAR(20) DEFAULT '2026.1',
    url_arquivo_mbtiles TEXT,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 8. TABELA DE INCIDENTES DE TRÂNSITO EM TEMPO REAL (TRANSALVADOR / CODESAL)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS incidentes_transito_salvador (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tipo VARCHAR(50) NOT NULL, -- 'acidente', 'obra', 'alagamento', 'interdicao', 'blitz'
    titulo VARCHAR(200) NOT NULL,
    descricao TEXT,
    via_afetada VARCHAR(200) NOT NULL,
    bairro VARCHAR(100) NOT NULL,
    gravidade condicao_transito_enum DEFAULT 'intenso',
    posicao_geom GEOMETRY(Point, 4326) NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    expira_em TIMESTAMP WITH TIME ZONE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_incidentes_posicao ON incidentes_transito_salvador USING GIST (posicao_geom);

-- ==============================================================================
-- 9. FUNÇÕES GEOESPACIAIS OTIMIZADAS (POSTGIS PL/pgSQL)
-- ==============================================================================

-- Função 1: Buscar POIs mais próximos em um raio em metros (ST_DWithin otimizado)
CREATE OR REPLACE FUNCTION buscar_pois_proximos(
    p_lat DOUBLE PRECISION,
    p_lng DOUBLE PRECISION,
    p_raio_metros INT DEFAULT 3000,
    p_categoria tipo_poi_enum DEFAULT NULL,
    p_apenas_abertos BOOLEAN DEFAULT FALSE,
    p_limite INT DEFAULT 30
)
RETURNS TABLE (
    id UUID,
    nome VARCHAR(255),
    categoria tipo_poi_enum,
    subcategoria VARCHAR(100),
    bairro VARCHAR(100),
    logradouro VARCHAR(255),
    telefone VARCHAR(50),
    esta_aberto_agora BOOLEAN,
    avaliacao_media NUMERIC(3, 2),
    distancia_metros INT,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.nome,
        p.categoria,
        p.subcategoria,
        p.bairro,
        p.logradouro,
        p.telefone,
        p.esta_aberto_agora,
        p.avaliacao_media,
        ROUND(ST_DistanceSphere(p.geom, ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)))::INT AS distancia_metros,
        ST_Y(p.geom) AS lat,
        ST_X(p.geom) AS lng
    FROM salvador_pois p
    WHERE ST_DWithin(
        p.geom::geography,
        ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography,
        p_raio_metros
    )
    AND (p_categoria IS NULL OR p.categoria = p_categoria)
    AND (NOT p_apenas_abertos OR p.esta_aberto_agora = TRUE)
    ORDER BY p.geom <-> ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)
    LIMIT p_limite;
END;
$$ LANGUAGE plpgsql STABLE;

-- Função 2: Assistente de Busca em Linguagem Natural
CREATE OR REPLACE FUNCTION buscar_pois_linguagem_natural(
    p_termo TEXT,
    p_user_lat DOUBLE PRECISION,
    p_user_lng DOUBLE PRECISION,
    p_limite INT DEFAULT 20
)
RETURNS TABLE (
    id UUID,
    nome VARCHAR(255),
    categoria tipo_poi_enum,
    bairro VARCHAR(100),
    logradouro VARCHAR(255),
    distancia_metros INT,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION
) AS $$
DECLARE
    v_clean_term TEXT := LOWER(TRIM(p_termo));
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.nome,
        p.categoria,
        p.bairro,
        p.logradouro,
        ROUND(ST_DistanceSphere(p.geom, ST_SetSRID(ST_MakePoint(p_user_lng, p_user_lat), 4326)))::INT AS distancia_metros,
        ST_Y(p.geom) AS lat,
        ST_X(p.geom) AS lng
    FROM salvador_pois p
    WHERE 
        LOWER(p.nome) LIKE '%' || v_clean_term || '%'
        OR LOWER(p.bairro) LIKE '%' || v_clean_term || '%'
        OR LOWER(p.categoria::text) LIKE '%' || v_clean_term || '%'
        OR (p.tags->>'amenity') ILIKE '%' || v_clean_term || '%'
        OR (p.tags->>'shop') ILIKE '%' || v_clean_term || '%'
    ORDER BY 
        CASE WHEN LOWER(p.nome) ILIKE v_clean_term || '%' THEN 1 ELSE 2 END,
        ST_DistanceSphere(p.geom, ST_SetSRID(ST_MakePoint(p_user_lng, p_user_lat), 4326)) ASC
    LIMIT p_limite;
END;
$$ LANGUAGE plpgsql STABLE;

-- ==============================================================================
-- 🌊 BANCO DE DADOS POSTGRESQL + POSTGIS — SUPERAPP SALVÔ (A CIDADE DAS MARÉS)
-- Esquema completo de geolocalização hiperlocal, ofertas, lojas e gamificação
-- ==============================================================================

-- Habilita extensão espacial PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABELA: USERS
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(50) DEFAULT 'client' CHECK (role IN ('client', 'merchant', 'admin', 'guest')),
    avatar_url TEXT,
    neighborhood VARCHAR(100),
    location GEOGRAPHY(Point, 4326), -- Posição GPS do usuário
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_location ON users USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 2. TABELA: USER_GAMIFICATION ("A Cidade das Marés")
CREATE TABLE IF NOT EXISTS user_gamification (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    mares_score INTEGER DEFAULT 50, -- Moeda Marés (🌊)
    streak_days INTEGER DEFAULT 1,
    streak_status VARCHAR(50) DEFAULT 'mare_cheia' CHECK (streak_status IN ('mare_cheia', 'mare_baixa')),
    depth_level INTEGER DEFAULT 1,
    depth_title VARCHAR(100) DEFAULT 'Orla', -- Orla -> Abismo do Carmo -> Fossa das Marianas
    conchas_count INTEGER DEFAULT 0, -- 7 conchas = recompensa
    last_checkin_neighborhood VARCHAR(100),
    last_checkin_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABELA: NEIGHBORHOODS (Bairros de Salvador)
CREATE TABLE IF NOT EXISTS neighborhoods (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    zone VARCHAR(50) NOT NULL, -- Orla Atlântica, Centro Histórico, Baía de Todos os Santos, etc.
    center_point GEOGRAPHY(Point, 4326) NOT NULL,
    polygon_boundary GEOGRAPHY(Polygon, 4326),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_neighborhoods_center ON neighborhoods USING GIST (center_point);

-- 4. TABELA: STORES (Comércios & Lojas Físicas)
CREATE TABLE IF NOT EXISTS stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    logo_url TEXT,
    cover_image_url TEXT,
    address TEXT NOT NULL,
    neighborhood VARCHAR(100) NOT NULL,
    location GEOGRAPHY(Point, 4326) NOT NULL, -- Ponto GPS exato da loja
    phone VARCHAR(50),
    whatsapp VARCHAR(50),
    instagram VARCHAR(100),
    website TEXT,
    is_open_now BOOLEAN DEFAULT true,
    rating NUMERIC(3,2) DEFAULT 5.0,
    review_count INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT true, -- Selo Gota de Dendê
    subscription_tier VARCHAR(50) DEFAULT 'orla' CHECK (subscription_tier IN ('orla', 'mare_alta', 'fundo_do_mar', 'free')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice espacial GIST para busca por raio ultrarrápida
CREATE INDEX IF NOT EXISTS idx_stores_location ON stores USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_stores_neighborhood ON stores(neighborhood);
CREATE INDEX IF NOT EXISTS idx_stores_category ON stores(category);

-- 5. TABELA: OFFERS (Ofertas Relâmpago & Cupons)
CREATE TABLE IF NOT EXISTS offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    discount_badge VARCHAR(50) NOT NULL, -- "20% OFF", "R$ 15 COMBO"
    original_price NUMERIC(10,2),
    discount_price NUMERIC(10,2),
    description TEXT,
    image_url TEXT,
    category VARCHAR(100) NOT NULL,
    is_featured BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SCHEDULED', 'EXPIRED', 'PAUSED')),
    views_count INTEGER DEFAULT 0,
    clicks_count INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_offers_store_id ON offers(store_id);
CREATE INDEX IF NOT EXISTS idx_offers_status ON offers(status);

-- 6. TABELA: CHATS & MESSAGES (1-para-1 Cliente e Lojista)
CREATE TABLE IF NOT EXISTS chats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    last_message TEXT,
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(store_id, client_id)
);

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'text' CHECK (message_type IN ('text', 'audio', 'location', 'pix', 'offer', 'coupon')),
    audio_duration VARCHAR(20),
    is_read BOOLEAN DEFAULT false,
    is_automated_bot BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_chat ON messages(chat_id);

-- 7. TABELA: CAMPAIGNS & SALVÔ ADS ("SALVÔ FÉ")
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    plan_tier VARCHAR(50) NOT NULL CHECK (plan_tier IN ('orla', 'mare_alta', 'fundo_do_mar')),
    monthly_price NUMERIC(10,2) NOT NULL, -- 197, 347, 597
    management_fee NUMERIC(10,2) DEFAULT 150.00,
    media_budget NUMERIC(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'pending_payment', 'paused', 'completed')),
    payment_method VARCHAR(50) DEFAULT 'pix' CHECK (payment_method IN ('pix', 'credit_card')),
    impressions_delivered INTEGER DEFAULT 0,
    clicks_delivered INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- 8. TABELA: ORDERS & CASHBACK
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    offer_id UUID REFERENCES offers(id) ON DELETE SET NULL,
    amount NUMERIC(10,2) NOT NULL,
    cashback_generated NUMERIC(10,2) DEFAULT 0.0,
    status VARCHAR(50) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 🔍 FUNÇÃO POSTGIS: BUSCA POR RAIO (ST_DWithin + ST_Distance)
-- ==============================================================================

CREATE OR REPLACE FUNCTION get_stores_nearby(
    user_lat DOUBLE PRECISION,
    user_lng DOUBLE PRECISION,
    radius_meters DOUBLE PRECISION DEFAULT 5000
)
RETURNS TABLE (
    id UUID,
    name VARCHAR,
    category VARCHAR,
    neighborhood VARCHAR,
    address TEXT,
    logo_url TEXT,
    cover_image_url TEXT,
    rating NUMERIC,
    is_open_now BOOLEAN,
    distance_meters DOUBLE PRECISION
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        s.id,
        s.name,
        s.category,
        s.neighborhood,
        s.address,
        s.logo_url,
        s.cover_image_url,
        s.rating,
        s.is_open_now,
        ST_Distance(s.location, ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography) AS distance_meters
    FROM stores s
    WHERE ST_DWithin(s.location, ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography, radius_meters)
    ORDER BY distance_meters ASC;
END;
$$ LANGUAGE plpgsql;

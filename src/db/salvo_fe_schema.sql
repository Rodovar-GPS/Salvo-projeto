-- ==============================================================================
-- 🕊️ SALVÓ FÉ — ESQUEMA COMPLETO DE BANCO DE DADOS (POSTGRESQL 15+)
-- Sistema de Tráfego Pago, Leilão de Mídia Hyperlocal e Gestão Financeira
-- ==============================================================================

-- 1. Habilitação de Extensões Essenciais
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Definição de Tipos Enumerados (ENUMS)
CREATE TYPE tipo_usuario_enum AS ENUM ('cliente', 'lojista', 'admin');
CREATE TYPE status_pagamento_enum AS ENUM ('pendente', 'pago', 'em_analise', 'falhou', 'estornado');
CREATE TYPE metodo_pagamento_enum AS ENUM ('pix', 'cartao_credito', 'boleto');
CREATE TYPE status_campanha_enum AS ENUM ('ativa', 'pendente_pagamento', 'pausada', 'finalizada');
CREATE TYPE status_anuncio_enum AS ENUM ('pendente', 'aprovado', 'rejeitado', 'pausado');
CREATE TYPE tier_plano_enum AS ENUM ('local', 'plus', 'premium');

-- ==============================================================================
-- 3. TABELA DE USUÁRIOS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    telefone VARCHAR(30),
    bairro_residencia VARCHAR(100) DEFAULT 'Barra',
    cidade VARCHAR(100) DEFAULT 'Salvador',
    uf VARCHAR(2) DEFAULT 'BA',
    tipo tipo_usuario_enum DEFAULT 'cliente',
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 4. TABELA DE LOJISTAS / EMPRESAS ANUNCIANTES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS lojistas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    nome_fantasia VARCHAR(200) NOT NULL,
    razao_social VARCHAR(200),
    cnpj_cpf VARCHAR(30) UNIQUE,
    segmento_categoria VARCHAR(100) NOT NULL,
    whatsapp VARCHAR(30) NOT NULL,
    telefone_comercial VARCHAR(30),
    bairro VARCHAR(100) NOT NULL,
    endereco_completo TEXT,
    logo_url TEXT,
    instagram VARCHAR(100),
    website_url TEXT,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 5. TABELA DE PLANOS SALVÓ FÉ
-- ==============================================================================
CREATE TABLE IF NOT EXISTS planos_fe (
    id tier_plano_enum PRIMARY KEY,
    nome VARCHAR(50) NOT NULL, -- 'Fé Local', 'Fé Plus', 'Fé Premium'
    preco_mensal NUMERIC(10, 2) NOT NULL, -- 197.00, 347.00, 597.00
    taxa_gestao_fixa NUMERIC(10, 2) NOT NULL DEFAULT 150.00,
    saldo_midia_liquido NUMERIC(10, 2) NOT NULL, -- 47.00, 197.00, 447.00
    cpc_padrao NUMERIC(10, 2) NOT NULL, -- 0.50, 0.45, 0.40
    cpm_padrao NUMERIC(10, 2) NOT NULL, -- 10.00, 9.00, 8.00
    estimativa_cliques INTEGER NOT NULL,
    estimativa_impressoes INTEGER NOT NULL,
    abrangencia_bairros VARCHAR(100) NOT NULL,
    descricao TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Inicial dos 3 Planos SALVÓ Fé
INSERT INTO planos_fe (id, nome, preco_mensal, taxa_gestao_fixa, saldo_midia_liquido, cpc_padrao, cpm_padrao, estimativa_cliques, estimativa_impressoes, abrangencia_bairros, descricao)
VALUES 
('local', 'Fé Local', 197.00, 150.00, 47.00, 0.50, 10.00, 94, 4700, '1 a 3 Bairros', 'Ideal para comércios locais e microempreendedores que buscam público imediato do bairro.'),
('plus', 'Fé Plus', 347.00, 150.00, 197.00, 0.45, 9.00, 438, 21888, 'Multi-Bairros e Polos', 'Perfeito para clínicas, restaurantes e lojas com entrega e atendimento regional em Salvador.'),
('premium', 'Fé Premium', 597.00, 150.00, 447.00, 0.40, 8.00, 1118, 55875, 'Salvador Inteira', 'Máxima prioridade no Fé Engine, cobertura total na cidade e consultoria de tráfego especializada.')
ON CONFLICT (id) DO UPDATE SET
    preco_mensal = EXCLUDED.preco_mensal,
    saldo_midia_liquido = EXCLUDED.saldo_midia_liquido,
    cpc_padrao = EXCLUDED.cpc_padrao,
    cpm_padrao = EXCLUDED.cpm_padrao;

-- ==============================================================================
-- 6. TABELA DE CAMPANHAS DE TRÁFEGO PAGO
-- ==============================================================================
CREATE TABLE IF NOT EXISTS campanhas_fe (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lojista_id UUID NOT NULL REFERENCES lojistas(id) ON DELETE RESTRICT,
    plano_id tier_plano_enum NOT NULL REFERENCES planos_fe(id),
    valor_total NUMERIC(10, 2) NOT NULL, -- Ex: 347.00
    taxa_gestao NUMERIC(10, 2) NOT NULL DEFAULT 150.00,
    saldo_midia_inicial NUMERIC(10, 2) NOT NULL, -- Ex: 197.00
    saldo_midia_restante NUMERIC(10, 2) NOT NULL, -- Saldo que decresce com cliques
    status status_campanha_enum DEFAULT 'pendente_pagamento',
    data_inicio DATE,
    data_fim DATE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 7. TABELA DE CRIATIVOS / ANÚNCIOS (FÉ ADS)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS anuncios_fe (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campanha_id UUID NOT NULL REFERENCES campanhas_fe(id) ON DELETE CASCADE,
    lojista_id UUID NOT NULL REFERENCES lojistas(id) ON DELETE CASCADE,
    titulo VARCHAR(120) NOT NULL,
    descricao VARCHAR(250) NOT NULL,
    imagem_url TEXT NOT NULL,
    cta_texto VARCHAR(50) DEFAULT 'Ver no WhatsApp',
    link_destino TEXT NOT NULL,
    bairros_alvo TEXT[] NOT NULL DEFAULT '{"Todos"}', -- Array de bairros de Salvador
    categorias_alvo TEXT[] NOT NULL DEFAULT '{"Geral"}',
    lance_cpc NUMERIC(6, 2) NOT NULL DEFAULT 0.50, -- Lance por clique no leilão
    status status_anuncio_enum DEFAULT 'pendente',
    motivo_rejeicao TEXT,
    aprovado_por UUID REFERENCES usuarios(id),
    aprovado_em TIMESTAMP WITH TIME ZONE,
    total_impressoes INTEGER DEFAULT 0,
    total_cliques INTEGER DEFAULT 0,
    total_gasto NUMERIC(10, 2) DEFAULT 0.00,
    ctr_percentual NUMERIC(6, 2) DEFAULT 0.00,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 8. TABELA DE TRANSAÇÕES E PAGAMENTOS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS pagamentos_fe (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campanha_id UUID NOT NULL REFERENCES campanhas_fe(id) ON DELETE RESTRICT,
    lojista_id UUID NOT NULL REFERENCES lojistas(id) ON DELETE RESTRICT,
    plano_id tier_plano_enum NOT NULL REFERENCES planos_fe(id),
    valor_total NUMERIC(10, 2) NOT NULL,
    taxa_gestao NUMERIC(10, 2) NOT NULL DEFAULT 150.00,
    valor_midia NUMERIC(10, 2) NOT NULL,
    metodo metodo_pagamento_enum NOT NULL,
    status status_pagamento_enum DEFAULT 'pendente',
    gateway_id VARCHAR(100), -- Ex: Stripe charge ID ou PagSeguro Order ID
    gateway_payload JSONB,
    pix_copia_cola TEXT,
    pix_qr_code_url TEXT,
    pago_em TIMESTAMP WITH TIME ZONE,
    expira_em TIMESTAMP WITH TIME ZONE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 9. TABELA DE MÉTRICAS DIÁRIAS E CONSOLIDADAS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS metricas_fe (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    anuncio_id UUID NOT NULL REFERENCES anuncios_fe(id) ON DELETE CASCADE,
    campanha_id UUID NOT NULL REFERENCES campanhas_fe(id) ON DELETE CASCADE,
    data_registro DATE NOT NULL DEFAULT CURRENT_DATE,
    impressoes INTEGER DEFAULT 0,
    cliques INTEGER DEFAULT 0,
    gasto_dia NUMERIC(10, 2) DEFAULT 0.00,
    bairro_evento VARCHAR(100),
    UNIQUE(anuncio_id, data_registro, bairro_evento)
);

-- ==============================================================================
-- 10. TABELA DE LOGS DO LEILÃO "FÉ ENGINE" (Auditoria e Telemetria)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS leiloes_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES usuarios(id),
    bairro_usuario VARCHAR(100) NOT NULL,
    categoria_interesse VARCHAR(100),
    anuncio_vencedor_id UUID REFERENCES anuncios_fe(id),
    lance_vencedor NUMERIC(6, 2),
    relevancia_vencedor NUMERIC(6, 4),
    score_final_vencedor NUMERIC(6, 4),
    total_concorrentes INTEGER,
    processado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 11. ÍNDICES DE ALTA PERFORMANCE PARA O LEILÃO FÉ ENGINE
-- ==============================================================================
CREATE INDEX idx_campanhas_status_saldo ON campanhas_fe(status, saldo_midia_restante);
CREATE INDEX idx_anuncios_status ON anuncios_fe(status);
CREATE INDEX idx_anuncios_bairros ON anuncios_fe USING GIN(bairros_alvo);
CREATE INDEX idx_anuncios_categorias ON anuncios_fe USING GIN(categorias_alvo);
CREATE INDEX idx_pagamentos_status ON pagamentos_fe(status);
CREATE INDEX idx_metricas_data ON metricas_fe(data_registro);

-- ==============================================================================
-- 12. TRIGGER DE ATUALIZAÇÃO AUTOMÁTICA DE TIMESTAMP
-- ==============================================================================
CREATE OR REPLACE FUNCTION atualiza_timestamp_modificacao()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_usuarios_modificado BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE PROCEDURE atualiza_timestamp_modificacao();
CREATE TRIGGER trg_lojistas_modificado BEFORE UPDATE ON lojistas FOR EACH ROW EXECUTE PROCEDURE atualiza_timestamp_modificacao();
CREATE TRIGGER trg_campanhas_modificado BEFORE UPDATE ON campanhas_fe FOR EACH ROW EXECUTE PROCEDURE atualiza_timestamp_modificacao();
CREATE TRIGGER trg_anuncios_modificado BEFORE UPDATE ON anuncios_fe FOR EACH ROW EXECUTE PROCEDURE atualiza_timestamp_modificacao();

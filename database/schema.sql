-- 1. TABELA DE USUÁRIOS (Métricas Demográficas e Comportamentais)
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    idade_grupo VARCHAR(20),
    bairro VARCHAR(100),
    ocupacao VARCHAR(100),
    escolaridade VARCHAR(50),
    frequencia_uso VARCHAR(50),
    ja_foi_vitima BOOLEAN DEFAULT FALSE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABELA DE TIPOS DE GOLPE (Taxonomia da Engenharia Social)
CREATE TABLE tipos_golpe (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50),
    descricao TEXT,
    gatilho_psicologico VARCHAR(50)
);

-- 3. TABELA DE INTERAÇÕES (Log de Telemetria e Profundidade)
CREATE TABLE logs_interacao (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id),
    golpe_id INTEGER REFERENCES tipos_golpe(id),
    decisao VARCHAR(20),
    tempo_reacao_segundos INTEGER,
    dados_digitados TEXT,
    chegou_ao_fim BOOLEAN DEFAULT FALSE,
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. ÍNDICES DE PERFORMANCE (Otimização para o Dashboard)
CREATE INDEX idx_usuario_id ON logs_interacao(usuario_id);
CREATE INDEX idx_decisao ON logs_interacao(decisao);

-- 5. CARGA DE DADOS INICIAIS (Seed)
INSERT INTO tipos_golpe (nome, descricao, gatilho_psicologico) VALUES 
('Falso Pix', 'Simulação de comprovante falso com ameaça de bloqueio', 'Urgência / Medo'),
('Falsa Vaga de Emprego', 'Propostas de ganho fácil via WhatsApp da BYD/Amazon', 'Cobiça / Ganho Fácil'),
('Phishing Bancário', 'SMS pedindo atualização de chave de segurança', 'Autoridade');

-- 6. VIEW ANALÍTICA (Motor do Dashboard)
CREATE VIEW vw_dashboard_estatisticas AS
SELECT 
    tg.nome AS golpe_simulado,
    tg.gatilho_psicologico,
    u.idade_grupo,
    u.escolaridade,
    COUNT(li.id) AS total_simulacoes,
    SUM(CASE WHEN li.decisao LIKE 'ERRO%' THEN 1 ELSE 0 END) AS total_vitimas,
    ROUND(AVG(li.tempo_reacao_segundos), 2) AS tempo_medio_segundos
FROM logs_interacao li
JOIN tipos_golpe tg ON li.golpe_id = tg.id
JOIN usuarios u ON li.usuario_id = u.id
GROUP BY tg.nome, tg.gatilho_psicologico, u.idade_grupo, u.escolaridade;
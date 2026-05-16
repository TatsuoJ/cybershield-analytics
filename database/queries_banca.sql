-- =========================================================================
-- CYBERSHIELD ANALYTICS - QUERIES PARA A BANCA DE DEFESA
-- =========================================================================

-- 1. A QUERY DE RASTREABILIDADE (Mostra o fluxo exato de um alvo)
SELECT 
    u.id AS id_alvo,
    u.bairro,
    tg.nome AS vetor_ataque,
    li.decisao AS resultado_simulacao,
    li.tempo_reacao_segundos AS tempo_segundos,
    li.dados_digitados AS detalhe_vazamento
FROM logs_interacao li
JOIN usuarios u ON li.usuario_id = u.id
JOIN tipos_golpe tg ON li.golpe_id = tg.id
ORDER BY li.data_hora DESC
LIMIT 10;


-- 2. A QUERY ANALÍTICA AVANÇADA (O "Fator Uau" usando CTE - Common Table Expression)
-- "Para o nosso Dashboard, nós não fazemos a conta no Front-end. Usamos uma CTE no PostgreSQL para extrair a Taxa de Vulnerabilidade por Escolaridade, otimizando o processamento."
WITH AnaliseEscolaridade AS (
    SELECT 
        u.escolaridade,
        COUNT(li.id) AS total_testes,
        SUM(CASE WHEN li.decisao LIKE 'ERRO%' THEN 1 ELSE 0 END) AS total_vazamentos,
        AVG(li.tempo_reacao_segundos) AS tempo_medio
    FROM usuarios u
    JOIN logs_interacao li ON u.id = li.usuario_id
    GROUP BY u.escolaridade
)
SELECT 
    escolaridade,
    total_testes,
    total_vazamentos,
    ROUND((total_vazamentos::numeric / NULLIF(total_testes, 0)) * 100, 2) || '%' AS taxa_vulnerabilidade,
    ROUND(tempo_medio, 1) || 's' AS tempo_cognitivo_medio
FROM AnaliseEscolaridade
ORDER BY taxa_vulnerabilidade DESC;


-- 3. A QUERY DE VETOR GEOGRÁFICO (Mapeamento do Polo Industrial de Manaus)
SELECT 
    u.bairro,
    COUNT(li.id) as incidentes_ganho_facil
FROM logs_interacao li
JOIN usuarios u ON li.usuario_id = u.id
JOIN tipos_golpe tg ON li.golpe_id = tg.id
WHERE tg.gatilho_psicologico = 'Cobiça / Ganho Fácil' AND li.decisao LIKE 'ERRO%'
GROUP BY u.bairro
ORDER BY incidentes_ganho_facil DESC;
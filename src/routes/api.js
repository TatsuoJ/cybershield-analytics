/**
 * Module: API Routes
 * Responsável por gerenciar os endpoints RESTful do CyberShield.
 */

const express = require('express');
const router = express.Router();
const pool = require('../db'); // Importa a conexão com o banco

// =========================================================================
// ROTAS DE TELEMETRIA E DADOS
// =========================================================================

// 1. Cadastrar Usuário (Módulo de Calibragem)
router.post('/usuarios', async (req, res) => {
    const { idade_grupo, bairro, ocupacao, escolaridade, frequencia_uso, ja_foi_vitima } = req.body;
    try {
        const query = `
            INSERT INTO usuarios (idade_grupo, bairro, ocupacao, escolaridade, frequencia_uso, ja_foi_vitima)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;
        `;
        const values = [idade_grupo, bairro, ocupacao, escolaridade, frequencia_uso, ja_foi_vitima];
        const result = await pool.query(query, values);
        
        console.log(`[+] Novo alvo mapeado! ID: ${result.rows[0].id}`);
        res.status(201).json({ id: result.rows[0].id });
    } catch (error) {
        console.error("Erro na rota /usuarios:", error);
        res.status(500).json({ error: "Falha interna no servidor" });
    }
});

// 2. Registrar Decisão (Telemetria do WebApp)
router.post('/logs', async (req, res) => {
    const { usuario_id, golpe_id, decisao, tempo_reacao_segundos } = req.body;
    try {
        const query = `
            INSERT INTO logs_interacao (usuario_id, golpe_id, decisao, tempo_reacao_segundos)
            VALUES ($1, $2, $3, $4) RETURNING id;
        `;
        const values = [usuario_id, golpe_id, decisao, tempo_reacao_segundos];
        const result = await pool.query(query, values);
        
        console.log(`[!] Telemetria: Alvo ${usuario_id} | Golpe ${golpe_id} | Ação: ${decisao}`);
        res.status(201).json({ id: result.rows[0].id });
    } catch (error) {
        console.error("Erro na rota /logs:", error);
        res.status(500).json({ error: "Falha interna no servidor" });
    }
});

// 3. Atualizar Profundidade (Vazamento no Phishing)
router.put('/logs/update-profundidade', async (req, res) => {
    const { usuario_id, dados_digitados, chegou_ao_fim } = req.body;
    try {
        const query = `
            UPDATE logs_interacao 
            SET dados_digitados = $1, chegou_ao_fim = $2 
            WHERE usuario_id = $3 AND decisao = 'ERRO'
            AND id = (SELECT MAX(id) FROM logs_interacao WHERE usuario_id = $3)
            RETURNING id;
        `;
        const values = [dados_digitados, chegou_ao_fim, usuario_id];
        await pool.query(query, values);
        
        console.log(`[☠️] ALERTA: Vazamento Crítico confirmado para o Alvo ${usuario_id}`);
        res.status(200).json({ message: "Profundidade de ataque registrada" });
    } catch (error) {
        console.error("Erro na rota /logs/update-profundidade:", error);
        res.status(500).json({ error: "Falha interna no servidor" });
    }
});

// 4. Coletar Dados para o Dashboard (View de Analytics)
router.get('/stats', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM vw_dashboard_estatisticas');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Erro na rota /stats:", error);
        res.status(500).json({ error: "Falha interna no servidor" });
    }
});

module.exports = router;
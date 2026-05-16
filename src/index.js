/**
 * CYBERSHIELD ANALYTICS - Main Server (Entry Point)
 * Arquitetura: Node.js + Express (Clean Architecture)
 */

const express = require('express');
const path = require('path');
require('dotenv').config();

// Importação das Rotas
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json()); // Permite ler JSON no body das requisições
app.use(express.static(path.join(__dirname, '../public'))); // Serve os arquivos estáticos

// =========================================================================
// DELEGAÇÃO DE ROTAS (Router Middleware)
// Toda requisição que começar com '/api' será tratada pelo arquivo api.js
// =========================================================================
app.use('/api', apiRoutes);

// =========================================================================
// INICIALIZAÇÃO DO SERVIDOR
// =========================================================================
app.listen(PORT, () => {
    console.log(`🚀 Motor CyberShield rodando na porta ${PORT}`);
    console.log(`📊 Dashboard disponível em: http://localhost:${PORT}/dashboard.html`);
});
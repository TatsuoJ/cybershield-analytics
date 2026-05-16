/**
 * Module: Database Connection (Pool)
 * Gerencia as conexões com o PostgreSQL de forma otimizada.
 */

const { Pool } = require('pg');
require('dotenv').config();

// Configuração do Pool de Conexões usando as variáveis do .env
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Teste de conexão no momento em que o módulo é carregado
pool.connect()
    .then(() => console.log('✅ Banco de Dados conectado via módulo db.js!'))
    .catch(err => console.error('❌ Erro crítico ao conectar no banco:', err.stack));

// Exporta o pool para ser usado nas rotas
module.exports = pool;
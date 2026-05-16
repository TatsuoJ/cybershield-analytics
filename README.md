# 🛡️ CyberShield Analytics

> Projeto Interdisciplinar desenvolvido por alunos do 3º período de Análise e Desenvolvimento de Sistemas (UNIESBAM).

O **CyberShield Analytics** é um ecossistema de simulação cibernética focado em Engenharia Social. Nossa missão é mitigar vulnerabilidades cognitivas através de microlearning prático, voltado especialmente para microempreendedores (MEIs) e idosos no Polo Industrial de Manaus.

## ⚙️ Arquitetura e Tecnologias

A aplicação segue o padrão arquitetural **MVC (Model-View-Controller)** através de uma abordagem Cliente-Servidor (SoC):

*   **Front-end (View):** HTML5, CSS3, JavaScript Vanilla, Bootstrap 5, Chart.js.
*   **Back-end (Controller):** Node.js com Express (APIs RESTful orientadas a eventos).
*   **Database (Model):** PostgreSQL (RDBMS relacional com garantias ACID e Connection Pool).

## 🚀 Funcionalidades do MVP (Fase I)

1.  **Central de Calibração:** Captura de dados demográficos e nível de letramento digital.
2.  **Engine Assíncrona de Simulação:** Clone imersivo de interface de mensagens testando 3 vetores de ataque (Urgência, Autoridade, Ganho Fácil).
3.  **Sistema de Interceptação (Microlearning):** Feedback imediato baseado nos gatilhos psicológicos de Robert Cialdini no momento exato do clique malicioso.
4.  **Dashboard de Telemetria:** Agregação de dados matemáticos via CTEs e visualização de eficácia de ataques cruzada com faixa etária.

## 📦 Como rodar o projeto localmente

### 1. Pré-requisitos
*   [Node.js](https://nodejs.org/) v18+
*   [PostgreSQL](https://www.postgresql.org/) v14+

### 2. Configuração do Banco de Dados
1. Inicie o PostgreSQL.
2. Execute o script `database/schema.sql` no seu SGBD (ex: DBeaver, pgAdmin) para criar as tabelas, as views e popular os dados iniciais (Seeders).
3. O arquivo `database/queries_banca.sql` contém as consultas analíticas avançadas (CTEs) utilizadas no painel.

### 3. Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto com as credenciais do seu banco:
```env
PORT=3000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=cybershield
DB_PASSWORD=sua_senha_aqui
DB_PORT=5432
```

### 4. Inicialização do Servidor
```bash
# Instalar dependências
npm install

# Iniciar o motor da aplicação
node src/index.js
```

O servidor será exposto em `http://localhost:3000`.

## 👥 Equipe Desenvolvedora

*   Daniela Tatiane da Silva e Silva
*   Hevelyn Oliveira das Chagas
*   Janssen Josué Colares Braga
*   Wellington Geovani Ferreira Ribeiro 
*   Breno Ferreira Ribeiro 
*   Henrique Paiva Araújo
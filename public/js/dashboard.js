/**
 * Module: Analytics Dashboard
 * Fetches data, aggregates statistics to avoid duplicate labels, and renders Chart.js
 */

document.addEventListener('DOMContentLoaded', carregarMetricas);

async function carregarMetricas() {
    try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        
        processarKPIs(data);
        renderizarGraficoAtaques(data);
        renderizarGraficoDemografia(data);
        
    } catch (error) {
        console.error("Erro ao carregar telemetria:", error);
        alert("Falha de conexão com o banco de telemetria.");
    }
}

/**
 * Calcula os Indicadores Totais (Cards superiores)
 */
function processarKPIs(data) {
    let totalSimulacoes = 0;
    let totalVitimas = 0;
    let somaTempo = 0;
    let contagensDeTempo = 0;

    data.forEach(row => {
        const sim = parseInt(row.total_simulacoes) || 0;
        const vit = parseInt(row.total_vitimas) || 0;
        const tmp = parseFloat(row.tempo_medio_segundos) || 0;

        totalSimulacoes += sim;
        totalVitimas += vit;
        
        if (vit > 0 && tmp > 0) {
            somaTempo += (tmp * vit); // Pondera o tempo pelo número de vítimas
            contagensDeTempo += vit;
        }
    });

    const taxa = totalSimulacoes > 0 ? ((totalVitimas / totalSimulacoes) * 100).toFixed(1) : 0;
    const tempoMedio = contagensDeTempo > 0 ? (somaTempo / contagensDeTempo).toFixed(1) : 0;

    // Atualiza a UI
    document.getElementById('kpi-total').innerText = totalSimulacoes;
    document.getElementById('kpi-vitimas').innerText = totalVitimas;
    document.getElementById('kpi-taxa').innerText = `${taxa}%`;
    document.getElementById('kpi-tempo').innerText = `${tempoMedio}s`;
}

/**
 * Agrupa os dados por GOLPE e renderiza o gráfico de barras
 * Isso resolve o problema de colunas repetidas no eixo X
 */
function renderizarGraficoAtaques(data) {
    const statsGolpes = {};

    // Agrupamento (Reduce)
    data.forEach(row => {
        const nomeGolpe = `${row.golpe_simulado} (${row.gatilho_psicologico})`;
        if (!statsGolpes[nomeGolpe]) {
            statsGolpes[nomeGolpe] = { testados: 0, vitimas: 0 };
        }
        statsGolpes[nomeGolpe].testados += parseInt(row.total_simulacoes);
        statsGolpes[nomeGolpe].vitimas += parseInt(row.total_vitimas);
    });

    const labels = Object.keys(statsGolpes);
    const dataTestados = labels.map(l => statsGolpes[l].testados);
    const dataVitimas = labels.map(l => statsGolpes[l].vitimas);

    const ctx = document.getElementById('chartAtaques').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Alvos Testados',
                    data: dataTestados,
                    backgroundColor: '#0b315b',
                    borderRadius: 4
                },
                {
                    label: 'Vazamentos (Vítimas)',
                    data: dataVitimas,
                    backgroundColor: '#dc3545',
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            plugins: { legend: { position: 'top' } },
            scales: {
                y: { beginAtZero: true, ticks: { stepSize: 1 } }
            }
        }
    });
}

/**
 * Agrupa os dados por FAIXA ETÁRIA e renderiza o gráfico de rosca (Wow Factor Acadêmico)
 */
function renderizarGraficoDemografia(data) {
    const statsIdade = {};

    // Agrupamento de vítimas por idade
    data.forEach(row => {
        const idade = row.idade_grupo || 'Desconhecido';
        if (!statsIdade[idade]) {
            statsIdade[idade] = 0;
        }
        statsIdade[idade] += parseInt(row.total_vitimas);
    });

    const labels = Object.keys(statsIdade);
    const dataVitimas = labels.map(l => statsIdade[l]);

    const ctx = document.getElementById('chartIdade').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: dataVitimas,
                backgroundColor: ['#40b47c', '#ffc107', '#0b315b', '#dc3545', '#6c757d'],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            cutout: '65%',
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

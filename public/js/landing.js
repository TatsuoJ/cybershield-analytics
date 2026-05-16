const locationsData = [
    "Adrianópolis", "Aleixo", "Alvorada", "Centro", "Cidade Nova", 
    "Compensa", "Coroado", "Distrito Industrial", "Educandos", 
    "Flores", "Japiim", "Nova Esperança", "Parque 10", "Ponta Negra", "São José"
];

document.addEventListener('DOMContentLoaded', () => {
    const panel = document.getElementById('interactive-panel');
    if (panel) {
        panel.addEventListener('mousemove', (e) => {
            const rect = panel.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            panel.style.setProperty('--mouse-x', `${x}px`);
            panel.style.setProperty('--mouse-y', `${y}px`);
        });
    }
});

function queryLocation(input) {
    const dropdown = document.getElementById('lista-bairros');
    if (input.length < 2) { dropdown.classList.add('hidden'); return; }
    const matches = locationsData.filter(loc => loc.toLowerCase().includes(input.toLowerCase()));
    
    if (matches.length > 0) {
        dropdown.innerHTML = matches.map(loc => `<button type="button" onclick="selectLocation('${loc}')">${loc}</button>`).join('');
        dropdown.classList.remove('hidden');
    } else {
        dropdown.classList.add('hidden');
    }
}

function selectLocation(selection) {
    document.getElementById('bairro').value = selection;
    document.getElementById('lista-bairros').classList.add('hidden');
}

async function initSimEngine(event) {
    event.preventDefault(); 
    const btnSubmit = document.getElementById('btn-submit');
    const feedbackBox = document.getElementById('api-feedback');
    
    btnSubmit.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> PROCESSANDO...';
    btnSubmit.disabled = true;
    feedbackBox.classList.add('hidden');

    const payload = {
        idade_grupo: document.getElementById('idade').value,
        escolaridade: document.getElementById('escolaridade').value,
        frequencia_uso: document.getElementById('frequencia').value,
        bairro: document.getElementById('bairro').value,
        ocupacao: "Mapeamento ADS",
        ja_foi_vitima: document.getElementById('vitima_anterior').checked
    };

    try {
        const response = await fetch('/api/usuarios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(`Server returned status: ${response.status}`);
        
        const data = await response.json();
        localStorage.setItem('cyberUsuarioId', data.id);
        
        // Transição de tela
        document.body.classList.add('page-exit');
        setTimeout(() => {
            window.location.href = 'webapp.html';
        }, 400);

    } catch (error) {
        console.error("[Cybershield Exception]:", error);
        feedbackBox.innerText = "Falha de conexão com o Banco de Dados.";
        feedbackBox.className = "alert alert-danger text-center small rounded-3 fw-bold mt-3";
        feedbackBox.classList.remove('hidden');
        
        btnSubmit.innerHTML = 'COMPILAR E INICIAR AMBIENTE (WEBAPP) <i class="bi bi-arrow-right ms-2"></i>';
        btnSubmit.disabled = false;
    }
}
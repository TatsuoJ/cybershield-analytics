let cyberUsuarioId = localStorage.getItem('cyberUsuarioId');
let activeScenario = null;
let sessionStartTime = null;

const scenarios = [
    {
        id: 1, title: "Novo Número", subtitle: "Parente solicitando transação",
        avatar: "https://i.pravatar.cc/150?img=11", time: "10:24", scamType: "phishing_familiar",
        script: [
            { text: "Oi, salva meu número novo! O outro quebrou a tela e tá no conserto 😥", delay: 1500 },
            { text: "Tô usando esse celular antigo provisoriamente.", delay: 2000 },
            { text: "Você consegue me fazer um favor urgente?", delay: 3000 },
            { text: "Preciso pagar um fornecedor agora, mas meu app do banco deslogou nesse celular. Pode fazer um Pix de R$ 850,00 pra ele? Te devolvo no fim do dia sem falta!", delay: 4000 },
            { text: "A chave Pix é o CPF dele: <br><strong>048.293.112-X0</strong><br><br>Manda o comprovante quando fizer por favor 🙏", delay: 2500 }
        ],
        radiography: "O golpista cria um contexto verossímil (<span class='highlight-warning'>Celular Quebrado</span>) para justificar o número desconhecido e apela para o Vínculo Emocional. A <span class='highlight-danger'>Urgência</span> impede que você ligue para verificar a veracidade.",
        dica: "Nunca transfira dinheiro para 'números novos' de parentes sem antes fazer uma chamada de voz ou vídeo para confirmar a identidade. Golpistas capturam fotos de perfil nas redes sociais."
    },
    {
        id: 2, title: "Banco Central | Alerta", subtitle: "Notificação de Bloqueio",
        avatar: "https://ui-avatars.com/api/?name=BC&background=0b315b&color=fff", time: "09:12", scamType: "phishing_bancario",
        script: [
            { text: "⚠️ <strong>ALERTA DE SEGURANÇA</strong> ⚠️", delay: 1000 },
            { text: "Identificamos um acesso suspeito à sua conta bancária originado de um novo dispositivo.", delay: 2000 },
            { text: "Suas transações e chaves PIX foram <strong>suspensas preventivamente</strong>.", delay: 3000 },
            { text: "Para reconhecer o acesso ou efetuar o bloqueio de forma segura, valide sua identidade no portal oficial:<br><br><a href='#' class='wa-link' onclick='registrarClique(event)'>https://portal-seguranca.banco-verificacao.com/validar</a>", delay: 3500 }
        ],
        radiography: "Ameaça clássica baseada em <span class='highlight-danger'>Medo e Perda</span>. Eles usam a autoridade visual do Banco para forçar você a clicar em um <span class='highlight-warning'>Link de Phishing</span> que clonará suas senhas.",
        dica: "Bancos e instituições governamentais não enviam links por SMS ou WhatsApp ameaçando bloqueios. Na dúvida, abra o aplicativo oficial do seu banco pelo celular."
    },
    {
        id: 3, title: "RH - BYD Manaus", subtitle: "Proposta de Emprego",
        avatar: "https://ui-avatars.com/api/?name=HR&background=40b47c&color=fff", time: "Ontem", scamType: "phishing_vaga",
        script: [
            { text: "Olá! Somos da agência de recrutamento parceira da BYD no Polo Industrial.", delay: 1500 },
            { text: "Seu perfil foi pré-selecionado para uma vaga remota de meio período. O ganho é de R$ 300 a R$ 800 por dia útil.", delay: 3500 },
            { text: "O trabalho consiste em avaliar produtos online pelo celular. Não requer experiência.", delay: 2500 },
            { text: "Para ativar seu cadastro e receber o primeiro bônus de boas-vindas, acesse o painel da gerência: <br><br><a href='#' class='wa-link' onclick='registrarClique(event)'>https://vagas-tech-am.com/cadastro-byd</a>", delay: 3000 }
        ],
        radiography: "O ataque explora a <span class='highlight-warning'>Cobiça / Ganho Fácil</span>, muito comum em regiões industriais. O uso indevido da marca 'BYD' tenta gerar <span class='highlight-danger'>Autoridade</span> para o golpe.",
        dica: "Nenhuma empresa de grande porte contrata funcionários por WhatsApp oferecendo ganhos diários irreais. Se a esmola é demais, desconfie."
    }
];

document.addEventListener('DOMContentLoaded', () => {
    if (!cyberUsuarioId) {
        alert("Sessão não identificada. Por favor, calibre os parâmetros iniciais.");
        window.location.href = 'index.html';
        return;
    }
    renderContactList();
});

function renderContactList() {
    const list = document.getElementById('contact-list');
    list.innerHTML = ''; 
    scenarios.forEach((scenario, index) => {
        const item = document.createElement('div');
        item.className = 'contact-item px-3 py-3 d-flex align-items-center';
        item.onclick = () => loadScenario(index, item);
        item.innerHTML = `
            <img src="${scenario.avatar}" class="avatar-circle shadow-sm" alt="Contact">
            <div class="ms-3 flex-grow-1 overflow-hidden">
                <div class="d-flex justify-content-between align-items-center">
                    <span class="fw-bold small text-dark text-truncate">${scenario.title}</span>
                    <span class="text-success tiny fw-bold ms-2">${scenario.time}</span>
                </div>
                <div class="d-flex justify-content-between align-items-center mt-1">
                    <span class="text-muted tiny text-truncate">${scenario.subtitle}</span>
                    <span class="unread-badge">1</span>
                </div>
            </div>
        `;
        list.appendChild(item);
    });
}

async function loadScenario(index, element) {
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.add('sidebar-hidden');
        document.getElementById('chat-area').classList.remove('d-none');
        document.getElementById('chat-area').classList.add('d-flex');
    }

    document.querySelectorAll('.contact-item').forEach(el => el.classList.remove('active'));
    element.classList.add('active');
    element.querySelector('.unread-badge').classList.add('hidden');

    document.getElementById('empty-state').classList.add('hidden');
    document.getElementById('chat-active').classList.remove('hidden');
    document.getElementById('controles-decisao').classList.add('hidden');
    document.getElementById('chat-viewport').innerHTML = '<div class="text-center my-3"><span class="badge bg-white text-muted border shadow-sm px-3 py-1">Sessão Criptografada</span></div>';

    activeScenario = scenarios[index];
    document.getElementById('chat-name').innerText = activeScenario.title;
    document.getElementById('chat-avatar').src = activeScenario.avatar;

    const delay = (ms) => new Promise(res => setTimeout(res, ms));

    for (let i = 0; i < activeScenario.script.length; i++) {
        const step = activeScenario.script[i];
        setChatStatus('digitando...');
        renderTypingBubble();
        await delay(step.delay); 
        removeTypingBubble();
        setChatStatus('online');
        renderMessageBubble(step.text);
        await delay(800);
    }

    document.getElementById('controles-decisao').classList.remove('hidden');
    document.getElementById('chat-input-fake').classList.add('hidden');
    sessionStartTime = Date.now();
}

function setChatStatus(text) { document.getElementById('chat-status').innerText = text; }

function renderTypingBubble() {
    const div = document.createElement('div');
    div.className = "message-row received"; div.id = "typing-bot";
    div.innerHTML = `<div class="wa-bubble received typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>`;
    document.getElementById('chat-viewport').appendChild(div); scrollToBottom();
}

function removeTypingBubble() { const el = document.getElementById('typing-bot'); if(el) el.remove(); }

function renderMessageBubble(htmlText) {
    const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const div = document.createElement('div');
    div.className = "message-row received";
    div.innerHTML = `<div class="wa-bubble received">${htmlText}<div class="bubble-time">${time}</div><div style="clear:both;"></div></div>`;
    document.getElementById('chat-viewport').appendChild(div); scrollToBottom();
}

function scrollToBottom() { const vp = document.getElementById('chat-viewport'); vp.scrollTop = vp.scrollHeight; }

function closeChatMobile() {
    document.getElementById('sidebar').classList.remove('sidebar-hidden');
    document.getElementById('chat-area').classList.add('d-none');
    document.getElementById('chat-area').classList.remove('d-flex');
}

function registrarClique(event) {
    event.preventDefault();
    registrarDecisao('ERRO_LINK');
}

async function registrarDecisao(decisao) {
    document.getElementById('controles-decisao').classList.add('hidden');
    const reactionTime = Math.floor((Date.now() - sessionStartTime) / 1000);

    try {
        await fetch('/api/logs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario_id: cyberUsuarioId, golpe_id: activeScenario.id, decisao: decisao.includes('ERRO') ? 'ERRO' : 'ACERTO', tempo_reacao_segundos: reactionTime })
        });

        // Transição Controlada
        if (decisao.includes('ERRO') && activeScenario.id === 2) {
            sessionStorage.setItem('cyberScamId', activeScenario.id);
            document.body.classList.add('page-exit');
            setTimeout(() => { window.location.href = 'phishing.html'; }, 400);
        } else {
            exibirRadiografia(decisao, reactionTime);
        }

    } catch (error) {
        console.error("Database connection error:", error);
        alert("Erro ao gravar telemetria.");
    }
}

function exibirRadiografia(decisao, time) {
    const isError = decisao.includes('ERRO');
    const icon = document.getElementById('feedback-icon');
    const title = document.getElementById('feedback-title');
    
    if (isError) {
        icon.innerHTML = "<i class='bi bi-exclamation-triangle-fill text-danger'></i>";
        title.innerText = "Vulnerabilidade Explorada!"; 
        title.className = "fw-bold text-danger";
    } else {
        icon.innerHTML = "<i class='bi bi-shield-fill-check text-success'></i>";
        title.innerText = "Ameaça Neutralizada com Sucesso";
        title.className = "fw-bold text-success";
    }

    document.getElementById('feedback-time').innerText = time;
    document.getElementById('radiografia-texto').innerHTML = activeScenario.radiography;
    document.getElementById('dica-texto').innerHTML = activeScenario.dica;
    document.getElementById('overlay-radiografia').classList.remove('hidden');
}

// Retorna para a tela de calibragem limpando a sessão
function encerrarSimulacao() {
    if(confirm("Deseja encerrar a simulação e retornar à Central de Controle?")) {
        localStorage.removeItem('cyberUsuarioId');
        document.body.classList.add('page-exit');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 400);
    }
}
const cyberUsuarioId = localStorage.getItem('cyberUsuarioId');

document.addEventListener('DOMContentLoaded', () => {
    if (!cyberUsuarioId) {
        alert("Sessão corrompida. Retornando ao painel.");
        window.location.href = 'index.html';
        return;
    }
    iniciarCronometro(4, 59);
});

function maskCPF(input) {
    let v = input.value.replace(/\D/g, "");
    if (v.length <= 11) {
        v = v.replace(/(\d{3})(\d)/, "$1.$2");
        v = v.replace(/(\d{3})(\d)/, "$1.$2");
        v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }
    input.value = v;
}

function maskAgencia(input) { input.value = input.value.replace(/\D/g, "").substring(0, 4); }

function maskConta(input) {
    let v = input.value.replace(/\D/g, "");
    v = v.replace(/(\d)(\d{1})$/, "$1-$2");
    input.value = v;
}

function togglePassword() {
    const input = document.getElementById('fake-password');
    const icon = document.getElementById('eye-icon');
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('bi-eye-slash'); icon.classList.add('bi-eye');
    } else {
        input.type = 'password';
        icon.classList.remove('bi-eye'); icon.classList.add('bi-eye-slash');
    }
}

function iniciarCronometro(minutos, segundos) {
    const display = document.getElementById('timer-urgencia');
    let tempoEmSegundos = minutos * 60 + segundos;
    const intervalo = setInterval(() => {
        tempoEmSegundos--;
        let m = Math.floor(tempoEmSegundos / 60); let s = tempoEmSegundos % 60;
        m = m < 10 ? '0' + m : m; s = s < 10 ? '0' + s : s;
        display.innerText = `${m}:${s}`;
        if (tempoEmSegundos <= 0) { clearInterval(intervalo); display.innerText = "EXPIRADO"; }
    }, 1000);
}

async function capturarVazamento(event) {
    event.preventDefault();
    const btn = document.getElementById('btn-submit');
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> VALIDANDO...';
    btn.disabled = true;

    const payload = { usuario_id: cyberUsuarioId, chegou_ao_fim: true, dados_digitados: "Vazamento Crítico Confirmado (Credenciais Inseridas)" };

    try {
        await fetch('/api/logs/update-profundidade', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        setTimeout(() => { document.getElementById('overlay-busted').classList.remove('hidden'); }, 1500);
    } catch (error) {
        console.error("Erro na API de Telemetria:", error);
        document.getElementById('overlay-busted').classList.remove('hidden');
    }
}

function retornarAoWebapp() {
    document.body.classList.add('page-exit');
    setTimeout(() => { window.location.href = 'webapp.html'; }, 400);
}
const API_URL = "http://127.0.0.1:8000/predecir";

// ================================
// TODO SE EJECUTA CUANDO CARGA EL HTML
// ================================
document.addEventListener('DOMContentLoaded', () => {

    // ===== REFERENCIAS =====
    const loginCard = document.getElementById('login-card');
    const registerCard = document.getElementById('register-card');
    const loginSection = document.getElementById('login-section');
    const dashboardSection = document.getElementById('dashboard-section');

    const showLogin = document.getElementById('show-login');
    const showRegister = document.getElementById('show-register');

    const btnLogin = document.getElementById('btn-login');
    const btnLogout = document.getElementById('btn-logout');
    const btnAnalizar = document.getElementById('btn-analizar');

    // ================================
    // NAVEGACIÓN LOGIN / REGISTER
    // ================================
    if (showLogin) {
        showLogin.onclick = (e) => {
            e.preventDefault();
            registerCard.classList.add('hidden');
            loginCard.classList.remove('hidden');
        };
    }

    if (showRegister) {
        showRegister.onclick = (e) => {
            e.preventDefault();
            loginCard.classList.add('hidden');
            registerCard.classList.remove('hidden');
        };
    }

    // ================================
    // LOGIN SIMULADO
    // ================================
    if (btnLogin) {
        btnLogin.onclick = () => {
            loginSection.style.display = 'none';
            dashboardSection.style.display = 'block';
        };
    }

    // ================================
    // LOGOUT
    // ================================
    if (btnLogout) {
        btnLogout.onclick = () => {
            loginSection.style.display = 'block';
            dashboardSection.style.display = 'none';
        };
    }

    // ================================
    // ANALIZAR IMAGEN (IA REAL)
    // ================================
    if (btnAnalizar) {
        btnAnalizar.onclick = analizarHoja;
    }
});


// ================================
// FUNCIÓN IA REAL (FASTAPI)
// ================================
async function analizarHoja() {

    const fileInput = document.getElementById('foto-hoja');
    const resultadoBox = document.getElementById('resultado-box');

    if (!fileInput || !fileInput.files.length) {
        alert("Sube una imagen");
        return;
    }

    const formData = new FormData();

    // IMPORTANTE: debe llamarse "imagen"
    formData.append("imagen", fileInput.files[0]);

    resultadoBox.classList.remove('hidden');
    resultadoBox.innerText = "⏳ Analizando con IA...";

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            body: formData
        });

        const data = await res.json();

        console.log("RESPUESTA IA:", data);

        if (!data.valido) {
            resultadoBox.innerHTML = "⚠️ " + data.mensaje;
            return;
        }

        resultadoBox.innerHTML = `
            🌿 <b>Diagnóstico:</b> ${data.diagnostico}<br>
            🎯 <b>Confianza:</b> ${data.confianza}%
        `;

    } catch (error) {
        console.log(error);
        resultadoBox.innerHTML = "❌ Error conectando con el servidor";
    }
}
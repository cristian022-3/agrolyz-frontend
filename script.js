// ================================
// CONFIG SUPABASE
// ================================
const SUPABASE_URL = "https://ovvtjqwkfdwymbczcanm.supabase.co";
const SUPABASE_KEY = "sb_publishable_-ug71BjVdFs9OLHKBBvCXA_U2FJkOrL"; // 👈 reemplaza esto

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ================================
// API FASTAPI
// ================================
const API_URL = "https://agrolyz-backend-production.up.railway.app/predecir";

// ================================
// CUANDO CARGA EL DOM
// ================================
document.addEventListener('DOMContentLoaded', () => {

    // ===== ELEMENTOS =====
    const loginCard = document.getElementById('login-card');
    const registerCard = document.getElementById('register-card');
    const loginSection = document.getElementById('login-section');
    const dashboardSection = document.getElementById('dashboard-section');

    const showLogin = document.getElementById('show-login');
    const showRegister = document.getElementById('show-register');

    const btnLogin = document.getElementById('btn-login');
    const btnRegister = document.getElementById('btn-register');
    const btnLogout = document.getElementById('btn-logout');
    const btnAnalizar = document.getElementById('btn-analizar');

    // ================================
    // CAMBIO LOGIN / REGISTER
    // ================================
    showLogin.onclick = (e) => {
        e.preventDefault();
        registerCard.classList.add('hidden');
        loginCard.classList.remove('hidden');
    };

    showRegister.onclick = (e) => {
        e.preventDefault();
        loginCard.classList.add('hidden');
        registerCard.classList.remove('hidden');
    };

    // ================================
    // REGISTRO
    // ================================
    btnRegister.onclick = async () => {

        const email = document.getElementById("reg-email").value;
        const password = document.getElementById("reg-password").value;
        const nombre = document.getElementById("reg-nombre").value;
        const ubicacion = document.getElementById("reg-ubicacion").value;

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    nombre_completo: nombre,
                    ubicacion_cultivo: ubicacion
                }
            }
        });

        if (error) {
            alert("Error registro: " + error.message);
            return;
        }

        alert("Registro exitoso. Revisa tu correo o inicia sesión.");
    };

    // ================================
    // LOGIN
    // ================================
    btnLogin.onclick = async () => {

        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            alert("Error login: " + error.message);
            return;
        }

        loginSection.style.display = "none";
        dashboardSection.style.display = "block";
    };

    // ================================
    // LOGOUT
    // ================================
    btnLogout.onclick = async () => {
        await supabase.auth.signOut();
        loginSection.style.display = "block";
        dashboardSection.style.display = "none";
    };

    // ================================
    // ANALIZAR IMAGEN
    // ================================
    btnAnalizar.onclick = analizarHoja;
});


// ================================
// FUNCIÓN IA
// ================================
async function analizarHoja() {

    const fileInput = document.getElementById('foto-hoja');
    const resultadoBox = document.getElementById('resultado-box');

    if (!fileInput.files.length) {
        alert("Sube una imagen");
        return;
    }

    const formData = new FormData();
    formData.append("imagen", fileInput.files[0]);

    resultadoBox.classList.remove('hidden');
    resultadoBox.innerText = "⏳ Analizando con IA...";

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            body: formData
        });

        const data = await res.json();

        console.log("IA:", data);

        if (!data.valido) {
            resultadoBox.innerHTML = "⚠️ " + data.mensaje;
            return;
        }

        resultadoBox.innerHTML = `
            🌿 <b>Diagnóstico:</b> ${data.diagnostico}<br>
            🎯 <b>Confianza:</b> ${data.confianza}%
        `;

    } catch (err) {
        console.log(err);
        resultadoBox.innerHTML = "❌ Error con el servidor";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const inputEmail = document.getElementById("emailLogin"); // Usando el ID del HTML
    const inputPassword = document.getElementById("passLogin");
    const btnConfirmar = document.getElementById("confirmar");
    const loginError = document.getElementById("loginError");

    if(btnConfirmar) {
        btnConfirmar.addEventListener("click", async (e) => {
            e.preventDefault();
            loginError.textContent = "Verificando...";

            const email = inputEmail.value.trim();
            const password = inputPassword.value.trim();

            if (!email || !password) {
                loginError.textContent = "Por favor ingresa correo y contraseña.";
                return;
            }

            try {
                // RUTA RELATIVA: Ya no necesita http://localhost:3000
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (data.success) {
                    localStorage.setItem("usuarioId", data.userId);
                    localStorage.setItem("usuarioNombre", data.nombre);
                    // REDIRECCIÓN RELATIVA
                    window.location.href = "dashboard.html";
                } else {
                    loginError.textContent = "❌ " + (data.message || "Error de acceso");
                }
            } catch (err) {
                console.error("Error de conexión:", err);
                loginError.textContent = "No se pudo conectar con el servidor.";
            }
        });
    }
});
document.addEventListener("DOMContentLoaded", () => {
    const inputEmail = document.getElementById("emailLogin"); // Usando el ID del HTML
    const inputPassword = document.getElementById("passLogin");
    const btnConfirmar = document.getElementById("confirmar");
    const loginError = document.getElementById("loginError");

    if(btnConfirmar) {
        btnConfirmar.addEventListener("click", async (e) => {
            e.preventDefault();
            
            const email = inputEmail.value.trim();
            const password = inputPassword.value.trim();

            if (!email || !password) {
                loginError.textContent = "Por favor ingresa correo y contraseña.";
                return;
            }

            // Bloque C: Loading State
            loginError.innerText = "";
            btnConfirmar.classList.add("loading");
            btnConfirmar.textContent = ""; // Hide text only show spinner
            
            try {
                // RUTA RELATIVA: Ya no necesita http://localhost:3000
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (data.success) {
                    // Micro-interaction success (could add checkmark here)
                    localStorage.setItem("usuarioId", data.userId);
                    localStorage.setItem("usuarioNombre", data.nombre);
                    // REDIRECCIÓN RELATIVA
                    window.location.href = "dashboard.html";
                } else {
                    loginError.innerText = data.message || "Error de acceso";
                    // Shake animation for error (optional)
                    document.querySelector('.login').animate([
                        { transform: 'translateX(0)' },
                        { transform: 'translateX(-10px)' },
                        { transform: 'translateX(10px)' },
                        { transform: 'translateX(0)' }
                    ], { duration: 300 });
                }
            } catch (err) {
                console.error("Error de conexión:", err);
                loginError.innerText = "No se pudo conectar con el servidor.";
            } finally {
                // Restore button
                btnConfirmar.classList.remove("loading");
                btnConfirmar.textContent = "Acceso";
            }
        });
    }

    // Video Controls
    const video = document.getElementById("bgVideo");
    const btn = document.getElementById("videoBtn");
    
    if (video && btn) {
        btn.addEventListener("click", () => {
            if (video.paused) {
                video.play();
                video.style.animationPlayState = "running"; // Resumes panning
                btn.innerHTML = "❚❚";
            } else {
                video.pause();
                video.style.animationPlayState = "paused"; // Pauses panning
                btn.innerHTML = "►";
            }
        });
    }
});
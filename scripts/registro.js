document.addEventListener("DOMContentLoaded", () => {
    const btnRegistro = document.getElementById("confirmar2");
    const msgDiv = document.getElementById("registroMsg");

    const inputs = {
        nombre: document.getElementById("regNombre"),
        email: document.getElementById("regEmail"),
        password: document.getElementById("regPassword"),
        edad: document.getElementById("regEdad"),
        peso: document.getElementById("regPeso"),
        altura: document.getElementById("regAltura")
    };

const regForm = document.getElementById("registroForm");

    // Validaciones visuales (blur)
    Object.values(inputs).forEach(input => {
        if(!input) return;
        input.addEventListener("blur", () => {
            if(input.value.trim() !== "") {
                input.style.border = "2px solid #2D665E"; // Verde marca
                input.style.transition = "border 0.3s ease";
            } else {
                input.style.border = "2px solid #e63946"; // Rojo
                shakeElement(input);
            }
        });
    });

    if(regForm) {
        regForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            // Resetear estilos y mensajes
            msgDiv.innerText = "";
            msgDiv.style.color = "black";
            
            let valid = true;
            const data = {};

            // Validar que todo esté lleno
            for (const [key, input] of Object.entries(inputs)) {
                if (!input || input.value.trim() === "") {
                    input.style.border = "2px solid #e63946";
                    shakeElement(input);
                    valid = false;
                } else {
                    data[key] = input.value.trim();
                }
            }

            if (!valid) {
                msgDiv.innerText = "Por favor, completa todos los campos.";
                msgDiv.style.color = "red";
                return;
            }

            // Estado de carga
            btnRegistro.classList.add("loading");
            btnRegistro.textContent = "Registrando...";

            try {
                // --- CONEXIÓN REAL CON EL BACKEND ---
                const respuesta = await fetch('/api/registro', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const resultado = await respuesta.json();

                if (resultado.success) {
                    // ÉXITO
                    msgDiv.innerText = "¡Registro completado! Redirigiendo...";
                    msgDiv.style.color = "#2D665E";
                
                // Esperar un poco para que el usuario lea el mensaje
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 1500);

            } else {
                // ERROR (ej: email repetido)
                msgDiv.innerText = resultado.message || "Error al registrar.";
                msgDiv.style.color = "#e63946";
                shakeElement(btnRegistro);
            }

        } catch (e) {
            console.error(e);
            msgDiv.innerText = "Error de conexión con el servidor.";
            msgDiv.style.color = "#e63946";
        } finally {
            btnRegistro.classList.remove("loading");
            if(btnRegistro.textContent !== "Registrando...") {
                 // Si no redirigimos, volver el texto a la normalidad
                 btnRegistro.textContent = "Confirmar Registro";
            }
        }
        });
    }

    function shakeElement(element) {
        element.animate([
            { transform: 'translateX(0)' },
            { transform: 'translateX(-5px)' },
            { transform: 'translateX(5px)' },
            { transform: 'translateX(0)' }
        ], { duration: 300 });
    }
});
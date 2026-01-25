document.addEventListener('DOMContentLoaded', () => {

    // 1. Mostrar nombre del usuario
    const nombreElem = document.getElementById("nombreUsuario");
    const nombreGuardado = localStorage.getItem("usuarioNombre");

    if (nombreGuardado && nombreElem) {
        nombreElem.innerText = nombreGuardado;
    } else if (nombreElem) {
        nombreElem.innerText = "Invitado";
    }

    // 2. Funcionalidad de botones de navegación (Login)
    const boton = document.getElementById('confirmar');
    if (boton) {
        boton.addEventListener('click', () => {
            window.location.href = 'dashboard.html';
        });
    }

    const botonRegistro = document.getElementById('confirmar2');
    if (botonRegistro) {
        botonRegistro.addEventListener('click', () => {
            window.location.href = 'dashboard.html';
        });
    }

    // --- BLOQUE DE ACCESIBILIDAD (Menú Desplegable) ---
    const toggleBtn = document.getElementById('menuToggle');
    const menu = document.getElementById('menuDesplegable');

    if(toggleBtn && menu){
        // Función auxiliar para abrir/cerrar
        const toggleMenu = () => {
            // Cambiamos la clase visual
            menu.classList.toggle("activo");
            
            // ACCESIBILIDAD: Actualizamos el estado ARIA
            // Si tiene la clase 'activo', expanded es true. Si no, false.
            const estaAbierto = menu.classList.contains("activo");
            toggleBtn.setAttribute("aria-expanded", estaAbierto);
        };

        // Evento Click (Ratón)
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation(); 
            toggleMenu();
        });

        // ACCESIBILIDAD: Evento Teclado (Enter o Espacio)
        // Como pusimos role="button" y tabindex="0" en el HTML, necesitamos esto:
        toggleBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault(); // Evita que la página haga scroll con espacio
                toggleMenu();
            }
        });
    }

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (menu && toggleBtn && !toggleBtn.contains(e.target) && !menu.contains(e.target)) {
            // Si el menú estaba abierto, lo cerramos y actualizamos ARIA
            if (menu.classList.contains('activo')) {
                menu.classList.remove('activo');
                toggleBtn.setAttribute("aria-expanded", "false");
            }
        }
    });

    // 4. Botón de Cerrar Sesión
    const btnLogout = document.getElementById('logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.clear();
            window.location.href = 'login.html';
        });
    }
});
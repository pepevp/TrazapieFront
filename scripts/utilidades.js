document.addEventListener('DOMContentLoaded', () => {

    // 1. Mostrar nombre del usuario logueado desde la Base de Datos
    const nombreElem = document.getElementById("nombreUsuario");
    
    // CAMBIO: Ahora buscamos "usuarioNombre" que es lo que guarda tu nuevo login.js
    const nombreGuardado = localStorage.getItem("usuarioNombre");

    if (nombreGuardado && nombreElem) {
        nombreElem.innerText = nombreGuardado;
    } else if (nombreElem) {
        nombreElem.innerText = "Invitado";
    }

    // 2. Funcionalidad de botones de navegación
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

    // 3. Menú desplegable (Lógica de UI)
    const toggleBtn = document.getElementById('menuToggle');
    const menu = document.getElementById('menuDesplegable');

    if(toggleBtn && menu){
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation(); 
            // Bloque C: Menu transition
            // menu.style.display = (menu.style.display === "block") ? "none" : "block";
            menu.classList.toggle("activo");
        });
    }

    document.addEventListener('click', (e) => {
        if (menu && toggleBtn && !toggleBtn.contains(e.target) && !menu.contains(e.target)) {
            menu.style.display = 'none';
        }
    });

    // 4. Botón de Cerrar Sesión (Opcional pero recomendado)
    const btnLogout = document.getElementById('logout'); // Si tienes un ID 'logout' en tu menú
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.clear(); // Borra los datos del usuario
            window.location.href = 'login.html';
        });
    }
});
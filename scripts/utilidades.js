document.addEventListener('DOMContentLoaded', () => {

    // -------------------------
    // Mostrar nombre del usuario logueado
    // -------------------------
    const nombreElem = document.getElementById("nombreUsuario");
    const usuarioActual = JSON.parse(localStorage.getItem("usuarioActual"));

    if (usuarioActual && nombreElem) {
        nombreElem.innerText = usuarioActual.username;
    } else if (nombreElem) {
        nombreElem.innerText = "--";
    }

    // -------------------------
    // Funcionalidad de botones
    // -------------------------
    const boton = document.getElementById('confirmar');
    if (boton) {
        boton.addEventListener('click', () => {
            // Si ya validaste login, redirige a dashboard
            window.location.href = '../dashboard.html';
        });
    }

    const botonRegistro = document.getElementById('confirmar2');
    if (botonRegistro) {
        botonRegistro.addEventListener('click', () => {
            // Redirige al dashboard sin necesidad de iniciar sesión
            window.location.href = '/TrazapieFront/dashboard.html';
        });
    }



    // -------------------------
    // Funcionalidad desplegable del menú
    // -------------------------
    const toggleBtn = document.getElementById('menuToggle');
    const menu = document.getElementById('menuDesplegable');

    if(toggleBtn && menu){
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // evita que el click se propague y cierre el menú
            menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        });
    }

    // Cerrar menú si se hace click fuera
    document.addEventListener('click', (e) => {
        if (menu && toggleBtn && !toggleBtn.contains(e.target) && !menu.contains(e.target)) {
            menu.style.display = 'none';
        }
    });

});

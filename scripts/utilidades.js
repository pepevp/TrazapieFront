document.addEventListener('DOMContentLoaded', () => {

    //Funcionalidad de botones
    const boton = document.getElementById('confirmar');
    if (boton) {
        boton.addEventListener('click', () => {
            window.location.href = '../dashboard.html';
        });
    }


//Funcion desplegable
    const toggleBtn = document.getElementById('menuToggle');
    const menu = document.getElementById('menuDesplegable');

    if(toggleBtn){
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // evita que el click se propague y cierre el menú
            menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        });
    }


    // Para cerrar el menú si se hace click fuera
    document.addEventListener('click', (e) => {
        if (!toggleBtn.contains(e.target) && !menu.contains(e.target)) {
            menu.style.display = 'none';
        }
    });
});

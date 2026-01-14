document.addEventListener("DOMContentLoaded", () => {
    // 1. Obtener el ID del usuario del localStorage
    const userId = localStorage.getItem("usuarioId");
    
    // Si no hay ID, redirigimos al login por seguridad
    if (!userId) {
        console.warn("Acceso denegado: No se encontró ID de usuario.");
        window.location.href = "login.html";
        return;
    }

    const mapaDiv = document.getElementById("mapa");

    // -------------------------
    // Configuración del Mapa con Leaflet
    // -------------------------
    if (navigator.geolocation) {
        // Mostramos un mensaje de "cargando" opcional
        if (mapaDiv) mapaDiv.innerHTML = "<p style='padding:10px;'>Localizando tu posición...</p>";

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                // Limpiar el div antes de renderizar el mapa
                if (mapaDiv) mapaDiv.innerHTML = "";

                // Inicializar el mapa centrado en las coordenadas reales
                const mapa = L.map('mapa').setView([lat, lon], 15);

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors'
                }).addTo(mapa);

                // Añadir marcador de posición actual
                L.marker([lat, lon]).addTo(mapa)
                    .bindPopup("<b>Estás aquí</b><br>Listo para iniciar tu ruta.")
                    .openPopup();
                
                // Nota: Aquí podrías hacer un fetch a tu API si quisieras 
                // cargar rutas guardadas en MongoDB para este usuario.
            },
            (error) => {
                console.error("Error obteniendo ubicación:", error);
                if (mapaDiv) {
                    mapaDiv.innerHTML = `
                        <div style="text-align:center; padding:20px;">
                            <p>⚠️ No pudimos acceder a tu ubicación.</p>
                            <button onclick="location.reload()" style="padding:5px 10px; cursor:pointer;">Reintentar</button>
                        </div>`;
                }
            },
            { enableHighAccuracy: true, timeout: 5000 } // Mejor precisión
        );
    } else {
        console.error("Geolocation no soportado");
        if (mapaDiv) mapaDiv.innerHTML = "<p>Tu navegador no soporta geolocalización.</p>";
    }
});
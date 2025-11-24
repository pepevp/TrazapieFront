document.addEventListener("DOMContentLoaded", () => {
    const usuarioActualStr = localStorage.getItem("usuarioActual");
    if (!usuarioActualStr) return;

    const usuarioActual = JSON.parse(usuarioActualStr);

    // -------------------------
    //Map con Leaflet mostrando ubicación actual
    // -------------------------
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                const mapa = L.map('mapa').setView([lat, lon], 15);

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors'
                }).addTo(mapa);

                L.marker([lat, lon]).addTo(mapa)
                    .bindPopup("Tu ubicación actual")
                    .openPopup();
            },
            (error) => {
                console.error("Error obteniendo ubicación:", error);
                const mapaDiv = document.getElementById("mapa");
                if (mapaDiv) mapaDiv.innerHTML = "<p>No se pudo obtener tu ubicación.</p>";
            }
        );
    } else {
        console.error("Geolocation no soportado");
        const mapaDiv = document.getElementById("mapa");
        if (mapaDiv) mapaDiv.innerHTML = "<p>Geolocation no soportado por tu navegador.</p>";
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const usuarioActualStr = localStorage.getItem("usuarioActual");
    if (!usuarioActualStr) return;

    const usuarioActual = JSON.parse(usuarioActualStr);

    // -------------------------
    // 1️⃣ Mostrar nombre de usuario en la barra
    // -------------------------
    const nombreUsuarioElem = document.getElementById("nombreUsuario");
    if (nombreUsuarioElem) nombreUsuarioElem.innerText = usuarioActual.username ?? "--";

    // -------------------------
    // 2️⃣ Calcular datos de actividad del día actual
    // -------------------------
    const fechaHoy = new Date();
    const anio = fechaHoy.getFullYear();
    const mes = String(fechaHoy.getMonth() + 1).padStart(2, "0"); // 0-index
    const dia = String(fechaHoy.getDate()).padStart(2, "0");

    const historialMes = usuarioActual.historial?.[`${anio}-${mes}`] ?? {};
    const registroHoy = historialMes?.[String(Number(dia))] ?? { pasos: 0, calorias: 0, tiempo: 0 };

    // Actualizar el HTML
    const pasosElem = document.getElementById("pasosAct");
    const caloriasElem = document.getElementById("caloriasAct");
    const tiempoElem = document.getElementById("tiempoAct");

    if (pasosElem) pasosElem.innerText = `Pasos: ${registroHoy.pasos}`;
    if (caloriasElem) caloriasElem.innerText = `Calorías: ${registroHoy.calorias}`;
    if (tiempoElem) tiempoElem.innerText = `Tiempo de actividad: ${registroHoy.tiempo} min`;

    // -------------------------
    // 3️⃣ Map con Leaflet mostrando ubicación actual
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

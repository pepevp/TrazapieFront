document.addEventListener("DOMContentLoaded", async () => {
    const userId = localStorage.getItem("usuarioId");

    // Verificación de seguridad corregida para localhost:3000
    if (!userId) {
        window.location.href = "login.html";
        return;
    }

    const nombreElem = document.getElementById("nombreUsuario");
    const pasosElem = document.getElementById("pasosAct");
    const caloriasElem = document.getElementById("caloriasAct");
    const tiempoElem = document.getElementById("tiempoAct");

    try {
        // RUTA RELATIVA
        const response = await fetch(`/api/usuario/${userId}`);
        if (!response.ok) throw new Error("Error al obtener datos");

        const usuario = await response.json();

        if (nombreElem) nombreElem.textContent = usuario.datos_personales.nombre;

        const pasos = usuario.actividad_resumen.pasosTotales || 0;
        const calorias = (pasos * 0.04).toFixed(0);
        const tiempo = (pasos / 100).toFixed(0);

        if (pasosElem) pasosElem.innerText = `Pasos: ${pasos}`;
        if (caloriasElem) caloriasElem.innerText = `Calorías: ${calorias}`;
        if (tiempoElem) tiempoElem.innerText = `Tiempo: ${tiempo} min`;

    } catch (error) {
        console.error("Error cargando dashboard:", error);
    }
});
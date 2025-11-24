document.addEventListener("DOMContentLoaded", () => {

    const monthYear = document.getElementById("month-year");
    const calendarGrid = document.getElementById("calendar-grid");

    // Párrafos donde se mostrarán los datos
    const pPasos = document.getElementById("p-pasos");
    const pCalorias = document.getElementById("p-calorias");
    const pTiempo = document.getElementById("p-tiempo");

    let currentDate = new Date(); // Fecha mostrada actualmente en el calendario
    const today = new Date();     // Fecha actual
    let historial = {};            // JSON con los datos de actividad

    // ----------- 1️⃣ Cargar JSON externo -----------
    async function cargarHistorial() {
        try {
            const response = await fetch("/back/historial.json"); // ruta a tu JSON
            historial = await response.json();
            renderCalendar(currentDate);
            actualizarDatos(today.getDate(), today.getMonth(), today.getFullYear()); // cargar datos hoy por defecto
        } catch (err) {
            console.error("Error cargando historial:", err);
        }
    }

    // ----------- 2️⃣ Actualizar los párrafos con los datos de un día -----------
    function actualizarDatos(day, month, year) {
        const clave = `${year}-${String(month + 1).padStart(2, '0')}`;
        const datos = historial[clave]?.[day];

        // Si no hay datos para ese día
        if (!datos) {
            document.getElementById("valor-pasos").textContent = 0;
            document.getElementById("valor-calorias").textContent = 0;
            document.getElementById("valor-tiempo").textContent = 0;
            return;
        }

        // Actualizar los valores dentro de los spans
        document.getElementById("valor-pasos").textContent = datos.pasos;
        document.getElementById("valor-calorias").textContent = datos.calorias;
        document.getElementById("valor-tiempo").textContent = datos.tiempo;
    }


    // ----------- 3️⃣ Renderizar calendario -----------
    function renderCalendar(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const monthNames = ["Enero","Febrero","Marzo","Abril","Mayo","Junio",
                            "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
        monthYear.textContent = `${monthNames[month]} ${year}`;

        // eliminar días anteriores, mantener los nombres de los días
        [...calendarGrid.querySelectorAll(".calendar__day, .calendar__empty")].forEach(el => el.remove());

        const firstDay = new Date(year, month, 1);
        const startDay = firstDay.getDay() === 0 ? 7 : firstDay.getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // huecos antes del primer día
        for (let i = 1; i < startDay; i++) {
            const emptyCell = document.createElement("div");
            emptyCell.classList.add("calendar__empty");
            calendarGrid.appendChild(emptyCell);
        }

        // crear los días
        for (let day = 1; day <= daysInMonth; day++) {
            const cell = document.createElement("div");
            cell.classList.add("calendar__day");
            cell.textContent = day;

            const cellDate = new Date(year, month, day);

            // Bloquear días futuros
            if (cellDate > today) {
                cell.classList.add("disabled");
            } else {
                cell.addEventListener("click", () => actualizarDatos(day, month, year));
            }

            calendarGrid.appendChild(cell);
        }
    }

    // ----------- 4️⃣ Botones de navegación -----------
    document.getElementById("prev").addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
    });

    document.getElementById("next").addEventListener("click", () => {
        const nuevaFecha = new Date(currentDate);
        nuevaFecha.setMonth(nuevaFecha.getMonth() + 1);

        // Bloquear meses futuros
        if (nuevaFecha.getFullYear() > today.getFullYear() ||
            (nuevaFecha.getFullYear() === today.getFullYear() && nuevaFecha.getMonth() > today.getMonth())) {
            return; // no hacer nada
        }

        currentDate = nuevaFecha;
        renderCalendar(currentDate);
    });

    // ----------- 5️⃣ Inicializar -----------
    cargarHistorial();
});
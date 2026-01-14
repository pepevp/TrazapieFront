document.addEventListener("DOMContentLoaded", async () => {
    const monthYear = document.getElementById("month-year");
    const calendarGrid = document.getElementById("calendar-grid");

    // IDs corregidos según tu HTML
    const pasosElem = document.getElementById("valor-pasos");
    const caloriasElem = document.getElementById("valor-calorias");
    const tiempoElem = document.getElementById("valor-tiempo");

    let currentDate = new Date();
    let datosUsuario = null; 
    const userId = localStorage.getItem("usuarioId") || 'user_001';

    async function cargarDatosServidor() {
        try {
            const response = await fetch(`http://localhost:3000/api/usuario/${userId}`);
            if (!response.ok) throw new Error("Error al obtener datos");
            datosUsuario = await response.json();
            
            renderCalendar(currentDate);
            const hoy = new Date();
            mostrarDatosDia(hoy.getDate(), hoy.getMonth(), hoy.getFullYear());
        } catch (error) {
            console.error("Error:", error);
        }
    }

    function renderCalendar(date) {
        if (!datosUsuario) return;
        const year = date.getFullYear();
        const month = date.getMonth();
        const monthNames = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

        monthYear.textContent = `${monthNames[month]} ${year}`;

        while (calendarGrid.children.length > 7) calendarGrid.removeChild(calendarGrid.lastChild);

        const firstDay = new Date(year, month, 1);
        const startDay = firstDay.getDay() === 0 ? 7 : firstDay.getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 1; i < startDay; i++) {
            const emptyCell = document.createElement("div");
            emptyCell.classList.add("calendar__empty");
            calendarGrid.appendChild(emptyCell);
        }

        const hoy = new Date();
        for (let day = 1; day <= daysInMonth; day++) {
            const cell = document.createElement("div");
            cell.classList.add("calendar__day");
            cell.textContent = day;

            const fechaBusqueda = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const tieneDatos = datosUsuario.historial_actividad?.find(a => a.fecha === fechaBusqueda);

            if (tieneDatos) cell.classList.add("has-data");

            if (new Date(year, month, day) > hoy) {
                cell.classList.add("disabled");
            } else {
                cell.addEventListener("click", () => {
                    document.querySelectorAll('.calendar__day').forEach(d => d.classList.remove('selected'));
                    cell.classList.add('selected');
                    mostrarDatosDia(day, month, year);
                });
            }
            calendarGrid.appendChild(cell);
        }
    }

    function mostrarDatosDia(dia, mes, anio) {
        if (!datosUsuario?.historial_actividad) return;

        const fechaBusqueda = `${anio}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
        const datos = datosUsuario.historial_actividad.find(a => a.fecha === fechaBusqueda);

        // Mapeo directo con los datos de MongoDB
        pasosElem.textContent = datos ? (datos.pasos || 0) : 0;
        caloriasElem.textContent = datos ? (datos.calorias || 0) : 0;
        // Se usa tiempo_minutos que es el nombre en Atlas
        tiempoElem.textContent = `${datos ? (datos.tiempo_minutos || 0) : 0} min`;
    }

    document.getElementById("prev").addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
    });

    document.getElementById("next").addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate);
    });

    cargarDatosServidor();
});
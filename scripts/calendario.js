const monthYear = document.getElementById("month-year");
const calendarGrid = document.getElementById("calendar-grid");

let currentDate = new Date();

function renderCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();

    const monthNames = [
        "Enero","Febrero","Marzo","Abril","Mayo","Junio",
        "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
    ];

    monthYear.textContent = `${monthNames[month]} ${year}`;

    while (calendarGrid.children.length > 7) {
        calendarGrid.removeChild(calendarGrid.lastChild);
    }

    const firstDay = new Date(year, month, 1);
    const startDay = firstDay.getDay() === 0 ? 7 : firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 1; i < startDay; i++) {
        const emptyCell = document.createElement("div");
        emptyCell.classList.add("calendar__empty");
        calendarGrid.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement("div");
        cell.classList.add("calendar__day");
        cell.textContent = day;

        cell.addEventListener("click", () => {
            alert(`Has seleccionado el día ${day}/${month + 1}/${year}`);
        });

        calendarGrid.appendChild(cell);
    }
}

document.getElementById("prev").addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
});

document.getElementById("next").addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
});

renderCalendar(currentDate);

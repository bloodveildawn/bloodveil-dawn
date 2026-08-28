import { BLOODVEIL_MONTHS } from "./character-utils.js";

const list = document.querySelector("#calendar-month-list");

if (list) {
    const months = Object.entries(BLOODVEIL_MONTHS)
        .sort(([a], [b]) => Number(a) - Number(b));

    list.innerHTML = months.map(([number, name]) => `
        <li class="calendar-month-item">
            <span class="calendar-month-number">${String(number).padStart(2, "0")}</span>
            <span class="calendar-month-name">${name}</span>
        </li>
    `).join("");
}

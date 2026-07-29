import { chapters } from "./chapters.js";

export function createDropdown(){

const container = document.getElementById("dropdown");

const select = document.createElement("select");

chapters.forEach(chapter=>{

const option = document.createElement("option");

option.value = chapter.url;

option.textContent =
`Chapter ${chapter.number} - ${chapter.title}`;

select.appendChild(option);

});

select.addEventListener("change",()=>{

window.location.href = select.value;

});

container.appendChild(select);

}
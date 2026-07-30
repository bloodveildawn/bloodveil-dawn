export function createPrevNext(){

const container =
document.getElementById("navigation");

const prev =
document.createElement("button");

prev.textContent = "⬅ Previous";

const next =
document.createElement("button");

next.textContent = "Next ➡";

container.appendChild(prev);

container.appendChild(next);

}
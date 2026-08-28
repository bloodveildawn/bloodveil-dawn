import { chapterData } from "./data/chapters/index.js";

const list = document.querySelector("#chapterList");
const empty = document.querySelector("#chapterEmpty");
const viewAll = document.querySelector("#viewAllBtn");
const count = document.querySelector("#chapterCount");
const toggles = [...document.querySelectorAll("[data-version]")];
const sortButton = document.querySelector(".sort-btn");
const sortMenu = document.querySelector(".sort-dropdown");

const landingTestEntries = [
  { number: 1, "displayStatus": "Final", title: "NOT AVAILABLE", date: "TBA", thumbnail: "https://res.cloudinary.com/q8roiivw/image/upload/not-available.jpg", synopsis: "Ramaikan #ReleaseTheScinisterCut untuk mempercepat perilisannya." },
  { number: 2, "displayStatus": "Final", title: "Tutorial Menanam Sawit feat. Eiden Dusk", date: "TBA", thumbnail: "https://res.cloudinary.com/q8roiivw/image/upload/not-available.jpg", synopsis: "Open komis, minat inbok." },
  { number: 3, "displayStatus": "Final", title: "Placeholder buat testing fitur View All", date: "TBA", thumbnail: "https://res.cloudinary.com/q8roiivw/image/upload/not-available.jpg", synopsis: "Hewan hewan apa yang kalo bisa padahal remot AC." },
  { number: 4, "displayStatus": "Final", title: "Placeholder buat testing fitur Show Less", date: "TBA", thumbnail: "https://res.cloudinary.com/q8roiivw/image/upload/not-available.jpg", synopsis: "Jangan kasih tahu siapa-siapa ya... Sebenernya aku ini Power Ranger Merah Muda." }
];

const state = {
  version: "rough",
  sort: "oldest",
  expanded: { final: false, rough: false }
};

const versionEntry = chapter => chapter?.[state.version]?.available ? chapter[state.version] : null;
const availableChapters = () => {
  const actual = chapterData.filter(chapter => versionEntry(chapter));
  if (state.version === "final") return [...landingTestEntries, ...actual.map(chapter => ({ ...chapter, _actual: true }))];
  return actual;
};

function getOrdinalLabel(number) {
  const value = Number(number);
  if (!Number.isFinite(value)) return String(number ?? "");
  const mod100 = value % 100;
  const suffix = mod100 >= 11 && mod100 <= 13 ? "th" : ({1:"st",2:"nd",3:"rd"}[value % 10] || "th");
  return `${value}${suffix} Dawn`;
}

function getChapterLabel(chapter) {
  if (typeof chapter?.displayNumber === "string" && chapter.displayNumber.trim()) return chapter.displayNumber.trim();
  const titlePrefix = String(chapter?.title ?? "").match(/^(\d+(?:st|nd|rd|th) Dawn)\s*:/i);
  if (titlePrefix) return titlePrefix[1];
  return getOrdinalLabel(chapter?.number);
}

function getChapterStatus(chapter) {
  const status = String(chapter?.displayStatus ?? "").trim();
  return status || "Rough";
}

function getChapterLandingTitle(chapter) {
  const title = String(chapter?.title ?? "").trim();
  return title.replace(/^\d+(?:st|nd|rd|th) Dawn\s*:\s*/i, "");
}

function renderCard(chapter) {
  const entry = chapter._actual ? versionEntry(chapter) : versionEntry(chapter);
  const card = document.createElement("a");
  card.className = "chapter-card";
  if (!entry) card.classList.add("chapter-card--unavailable");
  if (entry) {
    card.href = `./reader.html?id=${encodeURIComponent(entry.id)}`;
  } else {
    card.removeAttribute("href");
    card.setAttribute("aria-disabled", "true");
    card.setAttribute("tabindex", "0");
  }
  card.setAttribute("aria-label", `${getChapterLabel(chapter)} - ${getChapterStatus(chapter)} — ${getChapterLandingTitle(chapter)}`);

  const thumbnail = document.createElement("img");
  thumbnail.src = chapter.thumbnail;
  thumbnail.alt = `${chapter.title} thumbnail`;
  thumbnail.loading = "lazy";
  thumbnail.decoding = "async";

  const info = document.createElement("div");
  info.className = "chapter-info";
  info.innerHTML = `<span>${getChapterLabel(chapter)} - ${getChapterStatus(chapter)}</span><h3>${getChapterLandingTitle(chapter)}</h3><p>${chapter.synopsis}</p><time class="chapter-date">${chapter.date}</time>`;

  card.append(thumbnail, info);
  return card;
}

function render() {
  const data = [...availableChapters()].sort((a, b) => state.sort === "oldest" ? a.number - b.number : b.number - a.number);
  const expanded = state.expanded[state.version];
  const shown = expanded ? data : data.slice(0, 3);

  list.replaceChildren(...shown.map(renderCard));
  empty.hidden = data.length > 0;
  viewAll.hidden = data.length <= 3;
  viewAll.textContent = expanded ? "Show Less" : "View All Chapters";
  count.textContent = String(chapterData.length);
}

toggles.forEach(button => button.addEventListener("click", () => {
  state.version = button.dataset.version;
  toggles.forEach(current => {
    const active = current === button;
    current.classList.toggle("active", active);
    current.setAttribute("aria-pressed", String(active));
  });
  render();
}));

viewAll.addEventListener("click", () => {
  const nextExpanded = !state.expanded[state.version];
  state.expanded[state.version] = nextExpanded;
  render();
});

sortButton.addEventListener("click", event => {
  event.stopPropagation();
  const open = sortMenu.classList.toggle("show");
  sortButton.setAttribute("aria-expanded", String(open));
});

sortMenu.querySelectorAll("[data-sort]").forEach(button => button.addEventListener("click", () => {
  state.sort = button.dataset.sort;
  sortButton.innerHTML = `${button.textContent} <span aria-hidden="true">▾</span>`;
  sortMenu.classList.remove("show");
  sortButton.setAttribute("aria-expanded", "false");
  render();
}));

document.addEventListener("click", () => {
  sortMenu.classList.remove("show");
  sortButton.setAttribute("aria-expanded", "false");
});

render();

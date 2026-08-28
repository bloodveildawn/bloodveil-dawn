import { chapterData } from "./data/chapters/index.js";
import { readerSourceBase } from "./data/config.js";

const params = new URLSearchParams(location.search);
const id = (params.get("id") || "rough-001").trim();
const chapter = chapterData.find(c => c?.rough?.id === id || c?.final?.id === id);
const version = id.startsWith("rough-") ? "rough" : "final";
const entry = chapter?.[version];
const title = document.querySelector("#readerTitle");
const versionLabel = document.querySelector("#readerVersion");
const container = document.querySelector(".reader-container");
const prev = document.querySelector("#readerPrev");
const next = document.querySelector("#readerNext");
const top = document.querySelector("#readerTop");
const selectButton = document.querySelector("#readerSelectButton");
const menu = document.querySelector("#readerSelectMenu");

function readerUrl(c, v) {
  const targetId = c?.[v]?.id;
  return targetId ? `./reader.html?id=${encodeURIComponent(targetId)}` : "./reader.html";
}

function available(c, v) {
  return Boolean(c?.[v]?.available && Array.isArray(c?.[v]?.pages));
}

function buildUrl(src) {
  return readerSourceBase.replace(/\/?$/, "/") + String(src).replace(/^\//, "");
}

function getOrdinalLabel(number) {
  const value = Number(number);
  if (!Number.isFinite(value)) return String(number ?? "");
  const mod100 = value % 100;
  const suffix = mod100 >= 11 && mod100 <= 13 ? "th" : ({1:"st",2:"nd",3:"rd"}[value % 10] || "th");
  return `${value}${suffix} Dawn`;
}

function getChapterLabel(c) {
  const displayNumber = String(c?.displayNumber ?? "").trim();
  if (displayNumber) return displayNumber;
  const prefix = String(c?.title ?? "").match(/^(\d+(?:st|nd|rd|th) Dawn)\s*:/i);
  return prefix ? prefix[1] : getOrdinalLabel(c?.number);
}

function getVersionLabel(c, v) {
  if (v === "rough") return String(c?.displayStatus ?? "Rough");
  return "Final";
}

function showReaderError(message) {
  title.textContent = "Chapter unavailable";
  versionLabel.textContent = "";
  container.replaceChildren();
  const error = document.createElement("p");
  error.className = "reader-error";
  error.textContent = message;
  container.appendChild(error);
  const mount = document.querySelector("#continueMount");
  if (mount) mount.replaceChildren();
}

function renderNav() {
  const availableChapters = chapterData.filter(c => available(c, version));
  const currentAvailableIndex = availableChapters.findIndex(c => c?.number === chapter?.number);
  const previous = currentAvailableIndex > 0 ? availableChapters[currentAvailableIndex - 1] : null;
  const following = currentAvailableIndex >= 0 && currentAvailableIndex < availableChapters.length - 1 ? availableChapters[currentAvailableIndex + 1] : null;

  if (previous) { prev.href = readerUrl(previous, version); prev.removeAttribute("aria-disabled"); }
  else { prev.removeAttribute("href"); prev.setAttribute("aria-disabled","true"); }

  if (following) { next.href = readerUrl(following, version); next.removeAttribute("aria-disabled"); }
  else { next.removeAttribute("href"); next.setAttribute("aria-disabled","true"); }

  selectButton.textContent = chapter ? `${getChapterLabel(chapter)} - ${getVersionLabel(chapter, version)}` : "Chapter";
  menu.replaceChildren();

  availableChapters.forEach(c => {
    const option = document.createElement("a");
    option.href = readerUrl(c, version);
    option.role = "option";
    option.textContent = `${getChapterLabel(c)} - ${getVersionLabel(c, version)}`;
    if (c.number === chapter?.number) option.setAttribute("aria-selected", "true");
    menu.appendChild(option);
  });
}

function renderContinueCard() {
  const mount = document.querySelector("#continueMount");
  if (!mount || !chapter) return;
  const availableChapters = chapterData.filter(c => available(c, version));
  const currentIndex = availableChapters.findIndex(c => c.number === chapter.number);
  const following = currentIndex >= 0 ? availableChapters[currentIndex + 1] : null;
  if (!following) {
    mount.innerHTML = '<div class="continue-card latest"><p>Latest available chapter</p><strong>Stay Tuned for The Next Dawn</strong></div>';
    return;
  }
  const thumbnail = following.thumbnail ? `<img class="continue-thumbnail" src="${following.thumbnail}" alt="${following.title} thumbnail" loading="lazy" decoding="async">` : "";
  mount.innerHTML = `<a class="continue-card" href="${readerUrl(following, version)}">${thumbnail}<div class="continue-content"><p class="continue-label">Continue reading</p><strong class="continue-title">${following.title}</strong></div><span class="continue-arrow" aria-hidden="true"></span></a>`;
}

function renderPages() {
  if (!chapter) {
    showReaderError("This chapter could not be found.");
    return;
  }
  if (!entry || !entry.available) {
    showReaderError("This chapter version is not currently available.");
    return;
  }
  if (!Array.isArray(entry.pages) || entry.pages.length === 0) {
    showReaderError("This chapter has no readable pages available yet.");
    return;
  }

  title.textContent = chapter.title;
  versionLabel.textContent = version === "rough" ? "ROUGH VERSION" : "FINAL VERSION";
  document.title = `${chapter.title} - ${getVersionLabel(chapter, version)}`;
  container.replaceChildren();

  let renderedPages = 0;
  entry.pages.forEach((page, index) => {
    if (!page || typeof page !== "object") return;
    const src = typeof page.src === "string" ? page.src.trim() : "";
    if (!src) return;

    const img = document.createElement("img");
    img.src = /^https?:\/\//i.test(src) ? src : buildUrl(src);
    img.alt = typeof page.alt === "string" && page.alt.trim() ? page.alt.trim() : `${getChapterLabel(chapter)} page ${index + 1}`;
    img.loading = "lazy";
    img.decoding = "async";
    container.appendChild(img);
    renderedPages += 1;
  });

  if (!renderedPages) {
    showReaderError("This chapter does not contain any valid readable pages.");
    return;
  }

  renderContinueCard();
}

selectButton.addEventListener("click", e => {
  e.stopPropagation();
  const open = menu.classList.toggle("show");
  selectButton.setAttribute("aria-expanded", String(open));
});

document.addEventListener("click", () => {
  menu.classList.remove("show");
  selectButton.setAttribute("aria-expanded", "false");
});

top.addEventListener("click", () => window.scrollTo({top:0,behavior:"smooth"}));

renderNav();
renderPages();

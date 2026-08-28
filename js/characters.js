import {
    getCommonName,
    getBloodveilBirthdate,
    compareBirthdate,
    getLatestTimelineEntry,
    formatTimelineValue,
    getSearchableNames
} from "./character-utils.js";
import { characters } from "../data/characters/index.js";

const characterGrid = document.querySelector("#character-grid");
const emptyState = document.querySelector("#character-empty");
const resultsCount = document.querySelector("#character-results-count");
const searchInput = document.querySelector("#character-search");
const clearSearchButton = document.querySelector("#character-search-clear");
const sortSelect = document.querySelector("#character-sort");
const sortDropdown = document.querySelector("[data-sort-dropdown]");
const sortTrigger = document.querySelector("#character-sort-trigger");
const sortMenu = document.querySelector("#character-sort-menu");
const sortValue = document.querySelector("#character-sort-value");
const sortOptions = [...document.querySelectorAll("[data-sort-option]")];

const SORT_LABELS = {
    az: "A ⇄ Z",
    za: "Z ⇄ A",
    oldest: "Oldest ⇄ Youngest",
    youngest: "Youngest ⇄ Oldest"
};


// =========================
// VALIDATION
// =========================

function validateCharacters(characterList) {

    const errors = [];
    const warnings = [];
    const ids = new Set();

    characterList.forEach(character => {

        if (!character.id) {
            errors.push("Character is missing an id.");
        } else if (ids.has(character.id)) {
            errors.push(`Duplicate character id: "${character.id}".`);
        } else {
            ids.add(character.id);
        }

        if (!character.name) {
            errors.push(`Character "${character.id ?? "unknown"}" is missing a name.`);
        }

        if (!character.portrait) {
            errors.push(`Character "${character.name ?? character.id ?? "unknown"}" is missing a portrait.`);
        }

        const birthdate = getBloodveilBirthdate(character);

        if (!birthdate) {
            errors.push(`Character "${getCommonName(character)}" is missing Bloodveil birthdate data.`);
            return;
        }

        if (
            !Number.isInteger(birthdate.year) ||
            !Number.isInteger(birthdate.month) ||
            !Number.isInteger(birthdate.day)
        ) {
            errors.push(`Character "${getCommonName(character)}" has incomplete Bloodveil birthdate data.`);
        }

        if (Number.isInteger(birthdate.month) &&
            (birthdate.month < 1 || birthdate.month > 15)) {
            errors.push(`Character "${getCommonName(character)}" has invalid Bloodveil birth month: ${birthdate.month}.`);
        }

        if (Number.isInteger(birthdate.day) &&
            (birthdate.day < 1 || birthdate.day > 27)) {
            errors.push(`Character "${getCommonName(character)}" has invalid Bloodveil birth day: ${birthdate.day}.`);
        }
    });

    const birthdateGroups = new Map();

    characterList.forEach(character => {
        const birthdate = getBloodveilBirthdate(character);

        if (
            !birthdate ||
            !Number.isInteger(birthdate.year) ||
            !Number.isInteger(birthdate.month) ||
            !Number.isInteger(birthdate.day)
        ) return;

        const key = `${birthdate.year}-${birthdate.month}-${birthdate.day}`;

        if (!birthdateGroups.has(key)) {
            birthdateGroups.set(key, []);
        }

        birthdateGroups.get(key).push(character);
    });

    birthdateGroups.forEach((group, birthdateKey) => {

        if (group.length < 2) return;

        const orders = new Set();

        group.forEach(character => {
        const birthdate = getBloodveilBirthdate(character);
        if (!birthdate) return;
        const order = birthdate.birthOrder;

            if (!Number.isInteger(order)) {
                errors.push(
                    `Character "${getCommonName(character)}" shares birthdate ${birthdateKey} but has no birthOrder.`
                );
                return;
            }

            if (order < 1) {
                errors.push(
                    `Character "${getCommonName(character)}" has invalid birthOrder: ${order}.`
                );
            }

            if (orders.has(order)) {
                errors.push(
                    `Duplicate birthOrder ${order} among characters born on ${birthdateKey}.`
                );
            } else {
                orders.add(order);
            }
        });

        if (orders.size === group.length) {
            const sortedOrders = [...orders].sort((a, b) => a - b);

            sortedOrders.forEach((order, index) => {
                const expected = index + 1;

                if (order !== expected) {
                    warnings.push(
                        `Birth order for ${birthdateKey} is not continuous. Expected ${expected}, found ${order}.`
                    );
                }
            });
        }
    });

    if (errors.length) {
        console.error("[Characters] Validation errors:", errors);
    }

    if (warnings.length) {
        console.warn("[Characters] Validation warnings:", warnings);
    }

    if (!errors.length && !warnings.length) {
        console.info(
            `[Characters] Validation passed: ${characterList.length} characters checked.`
        );
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings
    };
}

validateCharacters(characters);


// =========================
// SEARCH
// =========================

function normalizeSearchText(value) {
    return String(value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}

function matchesSearch(character, query) {
    const searchTerm = normalizeSearchText(query);
    if (!searchTerm) return true;

    return getSearchableNames(character).some(name =>
        normalizeSearchText(name).includes(searchTerm)
    );
}

// =========================
// SORT
// =========================

function sortCharacters(characterList, sortMode) {

    const sorted = [...characterList];

    switch (sortMode) {

        case "az":
            sorted.sort((a, b) => getCommonName(a).localeCompare(getCommonName(b)));
            break;

        case "za":
            sorted.sort((a, b) => getCommonName(b).localeCompare(getCommonName(a)));
            break;

        case "oldest":
            sorted.sort((a, b) => compareBirthdate(a, b));
            break;

        case "youngest":
            sorted.sort((a, b) => compareBirthdate(b, a));
            break;
    }

    return sorted;
}


// =========================
// RENDER
// =========================

function renderCharacters(characterList) {

    characterGrid.innerHTML = "";
    emptyState.hidden = characterList.length !== 0;
    resultsCount.textContent = `${characterList.length} ${characterList.length === 1 ? "Character" : "Characters"}`;

    characterList.forEach(character => {

        const card = document.createElement("article");
        card.className = "character-card";

        const occupation =
            character.landing?.showOccupation
                ? formatTimelineValue(getLatestTimelineEntry(character.profile.current.occupation))
                : null;

        const affiliation =
            character.landing?.showAffiliation
                ? formatTimelineValue(getLatestTimelineEntry(character.profile.current.affiliation))
                : null;

        const metadata = [
            occupation,
            affiliation
        ].filter(Boolean);

        const commonName = getCommonName(character);
        const safeName = commonName.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
        const safePortrait = String(character.portrait).replace(/&/g, "&amp;").replace(/"/g, "&quot;");

        card.innerHTML = `
            <a class="character-card__link"
                href="./detail.html?id=${encodeURIComponent(character.id)}">

                <div class="character-card__portrait">
                    <img src="${safePortrait}"
                        alt="${safeName}"
                        loading="lazy">
                </div>

                <div class="character-card__content">

                    <h2 class="character-card__name">
                        ${safeName}
                    </h2>

                    ${
                        metadata.length
                            ? `
                                <div class="character-card__meta">
                                    ${metadata.map(value =>
                                        `<span>${value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</span>`
                                    ).join("")}
                                </div>
                              `
                            : ""
                    }

                </div>
            </a>
        `;

        characterGrid.appendChild(card);
    });
}


// =========================
// UPDATE
// =========================

function updateCharacters() {

    const filtered = characters.filter(character =>
        matchesSearch(character, searchInput.value)
    );

    renderCharacters(
        sortCharacters(filtered, sortSelect.value)
    );
}


// =========================
// EVENTS
// =========================

function updateSearchControls() {
    clearSearchButton.hidden = !searchInput.value.trim();
}

function setSortValue(value, { close = true } = {}) {
    const nextValue = SORT_LABELS[value] ? value : "az";
    sortSelect.value = nextValue;
    sortValue.textContent = SORT_LABELS[nextValue];
    sortOptions.forEach(option => {
        const selected = option.dataset.sortOption === nextValue;
        option.classList.toggle("is-selected", selected);
        option.setAttribute("aria-selected", String(selected));
    });
    if (close) closeSortDropdown();
    updateCharacters();
}

function openSortDropdown() {
    sortMenu.hidden = false;
    sortTrigger.setAttribute("aria-expanded", "true");
}

function closeSortDropdown({ restoreFocus = false } = {}) {
    if (sortMenu.hidden) return;
    sortMenu.hidden = true;
    sortTrigger.setAttribute("aria-expanded", "false");
    if (restoreFocus) sortTrigger.focus();
}

function focusSortOption(index) {
    const safeIndex = Math.max(0, Math.min(index, sortOptions.length - 1));
    sortOptions[safeIndex]?.focus();
}

sortTrigger.addEventListener("click", () => {
    if (sortMenu.hidden) {
        openSortDropdown();
        const selectedIndex = sortOptions.findIndex(option => option.dataset.sortOption === sortSelect.value);
        focusSortOption(selectedIndex);
    } else {
        closeSortDropdown();
    }
});

sortTrigger.addEventListener("keydown", event => {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openSortDropdown();
        focusSortOption(Math.max(0, sortOptions.findIndex(option => option.dataset.sortOption === sortSelect.value)));
    }
    if (event.key === "Escape") closeSortDropdown();
});

sortOptions.forEach((option, index) => {
    option.addEventListener("click", () => setSortValue(option.dataset.sortOption));
    option.addEventListener("keydown", event => {
        if (event.key === "ArrowDown") {
            event.preventDefault();
            focusSortOption((index + 1) % sortOptions.length);
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            focusSortOption((index - 1 + sortOptions.length) % sortOptions.length);
        } else if (event.key === "Home") {
            event.preventDefault();
            focusSortOption(0);
        } else if (event.key === "End") {
            event.preventDefault();
            focusSortOption(sortOptions.length - 1);
        } else if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setSortValue(option.dataset.sortOption);
            sortTrigger.focus();
        } else if (event.key === "Escape") {
            event.preventDefault();
            closeSortDropdown({ restoreFocus: true });
        }
    });
});

document.addEventListener("click", event => {
    if (sortDropdown && !sortDropdown.contains(event.target)) closeSortDropdown();
});

searchInput.addEventListener("input", () => {
    updateCharacters();
    updateSearchControls();
});

clearSearchButton.addEventListener("click", () => {
    searchInput.value = "";
    updateCharacters();
    updateSearchControls();
    searchInput.focus();
});

sortSelect.addEventListener("change", () => setSortValue(sortSelect.value));

setSortValue(sortSelect.value, { close: true });
updateSearchControls();

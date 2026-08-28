import {
    getCharacterById,
    getCommonName,
    getAdditionalFamilyName,
    getFullName,
    getOtherNames,
    formatBirthdate,
    normalizeTimelineValue,
    formatList,
    hasDisplayValue
} from "./character-utils.js";
import { characters } from "../data/characters/index.js";

const detailContainer = document.querySelector("#character-detail");
const params = new URLSearchParams(window.location.search);
const characterId = params.get("id");
const character = characterId ? getCharacterById(characters, characterId) : null;

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

const ENTITY_ROUTES = {
    namingSystem: { href: "../bloodveilpedia/naming-system.html", available: true },
    calendar: {
        "bloodveil-dawn-calendar": { href: "../bloodveilpedia/calendar.html", available: true }
    },
    organizations: {
        rosennoire: { href: "../bloodveilpedia/rosennoire.html", available: true }
    }
};

function getCharacterHref(id) {
    if (!id || !characters.some(item => item.id === id)) return null;
    return `./detail.html?id=${encodeURIComponent(id)}`;
}

function getEntityHref(type, id) {
    if (type === "character") return getCharacterHref(id);
    if (type === "naming-system") return ENTITY_ROUTES.namingSystem.available ? ENTITY_ROUTES.namingSystem.href : null;
    if (type === "calendar") return ENTITY_ROUTES.calendar[id]?.available ? ENTITY_ROUTES.calendar[id].href : null;
    return ENTITY_ROUTES.organizations[id]?.available ? ENTITY_ROUTES.organizations[id].href : null;
}

function renderLinkedValue(value, options = {}) {
    const { type, id, className = "" } = options;
    const href = getEntityHref(type, id);
    const text = escapeHtml(value);
    if (!href) return text;
    return `<a class="profile-entity-link ${escapeHtml(className)}" href="${escapeHtml(href)}">${text}</a>`;
}

function renderAdditionalFamilyName(value) {
    if (!hasDisplayValue(value)) return "";
    return `<a class="character-name__additional" href="${getEntityHref("naming-system")}" title="Bloodveil Naming System">${escapeHtml(value)}</a>`;
}

function formatTimelineMetadata(entry) {
    if (!entry || typeof entry !== "object") return "";
    if (Number.isInteger(entry.year)) return `Year ${entry.year}`;
    if (Number.isInteger(entry.startYear) || Number.isInteger(entry.endYear)) {
        const start = entry.startYear ?? entry.endYear;
        const end = entry.endYear ?? entry.startYear;
        return `Year ${start}–${end}`;
    }
    if (hasDisplayValue(entry.year)) return `Year ${entry.year}`;
    return "";
}

function renderTimelineValueHtml(value) {
    const entries = normalizeTimelineValue(value);
    if (!entries.length) return "";
    return entries.map(entry => {
        const displayValue = entry?.value ?? "";
        const metadata = formatTimelineMetadata(entry);
        const content = metadata
            ? `<span class="timeline-entry"><span>${escapeHtml(displayValue)}</span> <em>(${escapeHtml(metadata)})</em></span>`
            : `<span class="timeline-entry">${escapeHtml(displayValue)}</span>`;
        return renderSpoilerEntry(content, Boolean(entry?.spoiler));
    }).join("<br>");
}

function renderProfileItems(character) {
    const profile = character.profile ?? {};
    const identity = profile.identity ?? {};
    const origin = profile.origin ?? {};
    const current = profile.current ?? {};
    const abilities = profile.abilities ?? {};
    const items = [];
    const fullName = getFullName(character);
    const otherNames = getOtherNames(character);
    const birthdateEntries = formatBirthdate(origin.birthdate);

    if (fullName) items.push(["Full Name", escapeHtml(fullName)]);
    if (otherNames.length) items.push(["Other Names", otherNames.map(escapeHtml).join(", ")]);
    if (birthdateEntries.length) {
        const birthdateHtml = birthdateEntries.map(entry => {
            const calendarId = entry.calendar === "Bloodveil Dawn Calendar" ? "bloodveil-dawn-calendar" : null;
            const calendar = calendarId
                ? renderLinkedValue(entry.calendar, { type: "calendar", id: calendarId, className: "birthdate-calendar-link" })
                : escapeHtml(entry.calendar);
            const dateValue = calendarId
                ? renderLinkedValue(entry.value, { type: "calendar", id: calendarId, className: "birthdate-date-link" })
                : escapeHtml(entry.value);
            return `<span class="birthdate-entry"><span>${dateValue}</span><small>${calendar}</small></span>`;
        }).join("");
        items.push(["Birthdate", `<div class="character-birthdate">${birthdateHtml}</div>`]);
    }
    if (identity.gender) items.push(["Gender", escapeHtml(identity.gender)]);

    const timelineFields = [
        ["Age", current.age],
        ["Height", current.height],
        ["Occupation", current.occupation],
        ["Affiliation", current.affiliation]
    ];

    timelineFields.forEach(([label, value]) => {
        if (label === "Affiliation") {
            const entries = normalizeTimelineValue(value);
            if (entries.length) {
                const html = entries.map(entry => {
                    const metadata = formatTimelineMetadata(entry);
                    const renderedValue = renderLinkedValue(entry?.value ?? "", { type: "organization", id: String(entry?.value ?? "").toLowerCase().replace(/\s+/g, "-") });
                    const content = metadata
                        ? `<span class="timeline-entry"><span>${renderedValue}</span> <em>(${escapeHtml(metadata)})</em></span>`
                        : `<span class="timeline-entry">${renderedValue}</span>`;
                    return renderSpoilerEntry(content, Boolean(entry?.spoiler));
                }).join("<br>");
                items.push([label, html]);
            }
            return;
        }
        const html = renderTimelineValueHtml(value);
        if (html) items.push([label, html]);
    });

    const rankEntries = normalizeTimelineValue(current.rank);
    if (rankEntries.length) {
        const isRosennoireAffiliated = normalizeTimelineValue(current.affiliation).some(entry => String(entry?.value ?? "").trim().toLowerCase() === "rosennoire");
        const rankHtml = rankEntries.map(entry => {
            const value = escapeHtml(entry?.value ?? "");
            const rendered = isRosennoireAffiliated
                ? renderLinkedValue(entry?.value ?? "", { type: "organization", id: "rosennoire", className: "profile-position-link" })
                : value;
            return renderSpoilerEntry(rendered, Boolean(entry?.spoiler));
        }).join("<br>");
        if (rankHtml) items.push(["Position", rankHtml]);
    }

    const residence = renderTimelineValueHtml(current.residence);
    if (residence) items.push(["Residence", residence]);

    if (origin.birthplace) items.push(["Origin", escapeHtml(origin.birthplace)]);

    const ethnicity = formatList(identity.ethnicity);
    if (ethnicity) items.push(["Ethnicity", escapeHtml(ethnicity)]);

    const sorcery = formatList(abilities.sorcery);
    if (sorcery) items.push(["Sorcery", escapeHtml(sorcery)]);

    const combatExperience = abilities.combatExperience;
    if (combatExperience?.value !== null && combatExperience?.value !== undefined && combatExperience?.value !== "") {
        const unit = combatExperience.unit || "years";
        items.push(["Combat Experience", `${escapeHtml(combatExperience.value)} ${escapeHtml(unit)}`]);
    }

    return items;
}

function renderProfileMetadata(character) {
    const items = renderProfileItems(character);
    return items.length
        ? `<dl class="character-profile__grid">${items.map(([label, value]) => `<div class="character-profile__item"><dt>${escapeHtml(label)}</dt><dd>${value}</dd></div>`).join("")}</dl>`
        : "";
}

function normalizeAppearanceEntry(entry, fallbackWork = "") {
    if (Array.isArray(entry)) {
        return { work: entry[0], chapter: entry[1] };
    }
    if (typeof entry === "string") {
        return { work: fallbackWork, chapter: entry };
    }
    if (entry && typeof entry === "object") {
        return { work: entry.work ?? fallbackWork, ...entry };
    }
    return null;
}

function renderDestination(text, href, className = "") {
    const safeText = escapeHtml(text);
    if (!href) return safeText;
    return `<a class="${escapeHtml(className)}" href="${escapeHtml(href)}">${safeText}</a>`;
}

function renderFirstAppearance(character) {
    const appearance = character.profile?.firstAppearance;
    if (!appearance) return "";

    if (Array.isArray(appearance)) {
        return renderFirstAppearanceEntries(appearance);
    }

    const entries = [];
    const pushLegacy = (work, value) => {
        if (!hasDisplayValue(value)) return;
        if (typeof value === "object") entries.push({ work, ...value });
        else entries.push({ work, chapter: value });
    };
    pushLegacy("Bloodveil Dawn", appearance.mainStoryComic);
    pushLegacy("Light Novel", appearance.lightNovel);
    pushLegacy("Side Story", appearance.sideStoryComic);
    pushLegacy("Anime", appearance.anime);
    return renderFirstAppearanceEntries(entries);
}

function renderFirstAppearanceEntries(entries) {
    if (!entries.length) return "";
    const normalized = entries.map(entry => normalizeAppearanceEntry(entry))
        .filter(entry => hasDisplayValue(entry?.work) && hasDisplayValue(entry?.chapter));
    if (!normalized.length) return "";

    return `<section class="character-profile-subsection" aria-labelledby="first-appearance-heading">
        <h3 class="profile-heading-line" id="first-appearance-heading"><span>First Appearance</span></h3>
        <div class="first-appearance-list">${normalized.map(entry => {
            const work = renderDestination(entry.work, entry.workDestination, "first-appearance-work");
            const chapterLabel = `${entry.chapter}${entry.title ? `: ${entry.title}` : ""}`;
            const chapter = renderDestination(chapterLabel, entry.destination, "first-appearance-chapter");
            return `<div class="first-appearance-item"><span>${work}</span><span>${chapter}</span></div>`;
        }).join("")}</div>
    </section>`;
}

function renderSpoilerContent(content, options = {}) {
    const { className = "" } = options;
    return `<span class="spoiler-content ${escapeHtml(className)}" data-spoiler-content>${content}</span>`;
}

function renderSpoilerEntry(content, spoiler, options = {}) {
    if (!spoiler) return content;
    return `<span class="spoiler" data-spoiler="true">${renderSpoilerContent(content, options)}<button class="spoiler__toggle" type="button" data-spoiler-toggle aria-expanded="false">Reveal Spoiler ▼</button></span>`;
}

function renderProfileRelatedText(character) {
    const related = Array.isArray(character.profile?.relatedCharacters) ? character.profile.relatedCharacters : [];
    if (!related.length) return "";
    const lines = related.map(item => {
        const data = typeof item === "string" ? { name: item } : (item || {});
        const name = data.name || data.id || "";
        if (!name) return "";
        const id = data.id || characters.find(entry => getCommonName(entry) === name)?.id;
        const relationship = hasDisplayValue(data.relationship)
            ? `<span class="profile-related-relationship">(${escapeHtml(data.relationship)})</span>`
            : "";
        const linkedName = id && characters.some(entry => entry.id === id)
            ? renderLinkedValue(name, { type: "character", id, className: "profile-related-name" })
            : `<span class="profile-related-name profile-related-name--unavailable">${escapeHtml(name)}</span>`;
        return renderSpoilerEntry(`${linkedName} ${relationship}`.trim(), Boolean(data.spoiler));
    }).filter(Boolean);
    if (!lines.length) return "";

    return `<section class="character-profile-subsection" aria-labelledby="profile-related-heading">
        <h3 class="profile-heading-line" id="profile-related-heading"><span>Related Characters</span></h3>
        <ul class="profile-related-list">${lines.map(line => `<li>${line}</li>`).join("")}</ul>
    </section>`;
}

function renderProfile(character) {
    const metadata = renderProfileMetadata(character);
    const firstAppearance = renderFirstAppearance(character);
    const related = renderProfileRelatedText(character);
    if (!metadata && !firstAppearance && !related) return "";
    return `<section class="character-profile" aria-labelledby="profile-heading">
        <h2 class="profile-heading-line" id="profile-heading"><span>Profile</span></h2>
        ${metadata}${firstAppearance}${related}
    </section>`;
}

function renderHero(character) {
    const primaryName = getCommonName(character);
    const additionalFamilyName = getAdditionalFamilyName(character);
    return `<section class="character-hero">
        <div class="character-hero__portrait"><img src="${escapeHtml(character.portrait)}" alt="${escapeHtml(primaryName)}"></div>
        <div class="character-hero__content">
            <header class="character-hero__identity">
                <h1><span class="character-name__primary">${escapeHtml(primaryName)}</span>${renderAdditionalFamilyName(additionalFamilyName)}</h1>
                ${hasDisplayValue(character.quote) ? `<p class="character-hero__quote">“${escapeHtml(character.quote)}”</p>` : ""}
            </header>
            ${renderProfile(character)}
        </div>
    </section>`;
}

function renderSectionHeading(id, title, kicker) {
    return `<div class="section-heading"><span class="section-kicker">${escapeHtml(kicker)}</span><h2 class="section-heading__title" id="${escapeHtml(id)}"><span>${escapeHtml(title)}</span></h2></div>`;
}

function renderAbout(character) {
    const about = character.about;
    const content = renderRichContent(about, "prose");
    if (!content) return "";
    return `<section class="detail-section about-section" aria-labelledby="about-heading">
        <div class="about-box">
            ${renderSectionHeading("about-heading", "Overview", "Introduction")}
            <div class="about-text">${content}</div>
        </div>
    </section>`;
}

function renderReferenceBoard(character) {
    const refs = Array.isArray(character.referenceBoard)
        ? character.referenceBoard.filter(ref => ref && hasDisplayValue(ref.src))
        : [];
    const mainRef = refs[0];
    const additionalRefs = refs.slice(1);
    const visibleAdditional = additionalRefs.slice(0, 3);
    const hiddenCount = Math.max(0, additionalRefs.length - visibleAdditional.length);

    if (!mainRef) return "";

    const renderRef = (ref, index, extraClass = "", overlay = "") => `<button class="reference-card ${extraClass}" type="button" data-reference-index="${index}" aria-label="Open reference ${index + 1}">
        <img src="${escapeHtml(ref.src)}" alt="${escapeHtml(ref.alt || "Character reference")}" loading="lazy">
        ${overlay ? `<span class="reference-card__overlay">${escapeHtml(overlay)}</span>` : ""}
    </button>`;

    const visible = [mainRef, ...visibleAdditional];
    return `<section class="detail-section reference-board-section" aria-labelledby="reference-heading">
        ${renderSectionHeading("reference-heading", "reference board & illustrations", "Character visuals")}
        <div class="reference-board reference-board--count-${Math.min(visible.length, 4)}" data-reference-board data-reference-count="${visible.length}">
            ${renderRef(mainRef, 0, "reference-card--main")}
            ${visibleAdditional.map((ref, index) => {
                const actualIndex = index + 1;
                const overlay = index === visibleAdditional.length - 1 && hiddenCount > 0 ? `+${hiddenCount}` : "";
                return renderRef(ref, actualIndex, "reference-card--additional", overlay);
            }).join("")}
        </div>
    </section>`;
}

function renderRichContent(value, mode = "prose") {
    if (mode === "list") {
        const items = Array.isArray(value)
            ? value.filter(item => {
                if (item === null || item === undefined) return false;
                if (typeof item === "object") return hasDisplayValue(item.content ?? item.text);
                return hasDisplayValue(item);
            })
            : [];
        if (!items.length) return "";
        return `<ul>${items.map(item => {
            if (typeof item === "object" && item !== null) {
                const content = escapeHtml(item.content ?? item.text ?? "");
                return `<li>${renderSpoilerEntry(content, Boolean(item.spoiler))}</li>`;
            }
            return `<li>${escapeHtml(item)}</li>`;
        }).join("")}</ul>`;
    }

    if (!hasDisplayValue(value)) return "";
    const entries = Array.isArray(value) ? value : [value];
    return entries.map(entry => {
        if (entry && typeof entry === "object") {
            const content = escapeHtml(entry.content ?? entry.text ?? "");
            return hasDisplayValue(content) ? `<p>${renderSpoilerEntry(content, Boolean(entry.spoiler))}</p>` : "";
        }
        return hasDisplayValue(entry) ? `<p>${escapeHtml(entry)}</p>` : "";
    }).filter(Boolean).join("");
}

function renderCharacterInformation(character) {
    const info = character.information ?? {};
    const definitions = [
        ["Personality", info.personality, "prose"],
        ["Biography", info.biography, "prose"],
        ["Combat Style", info.combatStyle, "prose"],
        ["Trivia", info.trivia, "list"]
    ];
    const sections = definitions.map(([title, value, mode]) => {
        const content = renderRichContent(value, mode);
        return content
            ? `<article class="information-subsection"><h3 class="content-heading-line"><span>${escapeHtml(title)}</span></h3>${content}</article>`
            : "";
    }).filter(Boolean).join("");
    if (!sections) return "";
    return `<section class="detail-section character-information" aria-labelledby="information-heading">
        <div class="information-panel">
            ${renderSectionHeading("information-heading", "Character Information", "Profile Details")}
            ${sections}
        </div>
    </section>`;
}

function renderAppearances(character) {
    const appearances = Array.isArray(character.appearances) ? character.appearances.filter(Boolean) : [];
    const groups = appearances.reduce((map, appearance) => {
        if (!hasDisplayValue(appearance?.work) || !hasDisplayValue(appearance?.chapter)) return map;
        const work = appearance.work;
        if (!map.has(work)) map.set(work, []);
        map.get(work).push(appearance);
        return map;
    }, new Map());
    if (!groups.size) return "";

    return `<section class="detail-section appearances-section" aria-labelledby="appearances-heading">
        <div class="appearances-box">
            ${renderSectionHeading("appearances-heading", "Related works", "Appearances")}
            ${[...groups.entries()].map(([work, entries]) => {
                const workId = `appearance-work-${character.id}-${String(work).replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "")}`;
                return `<section class="appearance-work" aria-labelledby="${escapeHtml(workId)}">
                    <h3 class="content-heading-line"><span id="${escapeHtml(workId)}">${renderDestination(work, entries.find(entry => entry?.workDestination)?.workDestination, "appearance-work-link")}</span></h3>
                    <ul class="appearance-list">${entries.map(appearance => {
                        const chapterText = appearance.chapter;
                        const fullLabel = `${chapterText}${appearance.title && appearance.chapter ? `: ${appearance.title}` : ""}`;
                        const chapter = renderDestination(fullLabel, appearance.destination, "appearance-chapter");
                        return `<li class="appearance-item">${chapter}</li>`;
                    }).join("")}</ul>
                </section>`;
            }).join("")}
        </div>
    </section>`;
}

function resolveRelatedCharacter(item) {
    if (typeof item === "string") return characters.find(character => character.id === item) || null;
    if (item?.id) return characters.find(character => character.id === item.id) || item;
    return null;
}

function renderRelatedCharacters(character) {
    const related = (Array.isArray(character.relatedCharacters) ? character.relatedCharacters : [])
        .map(resolveRelatedCharacter)
        .filter(item => item && hasDisplayValue(getCommonName(item)) && hasDisplayValue(item.portrait));
    if (!related.length) return "";

    return `<section class="detail-section related-characters-section" aria-labelledby="related-heading">
        ${renderSectionHeading("related-heading", "Related Characters", "Connections")}
        <div class="related-character-carousel" data-related-carousel>
            <div class="related-character-viewport">
                <div class="related-character-track">${related.map(relatedCharacter => {
                    const name = getCommonName(relatedCharacter);
                    return `<a class="related-character-card" href="./detail.html?id=${encodeURIComponent(relatedCharacter.id)}" data-related-card><div class="related-character-card__portrait"><img src="${escapeHtml(relatedCharacter.portrait)}" alt="${escapeHtml(name)}" loading="lazy"></div><div class="related-character-card__content"><h3>${escapeHtml(name)}</h3></div></a>`;
                }).join("")}</div>
            </div>
            <div class="related-character-controls" data-related-controls hidden>
                <button type="button" class="related-character-nav" data-related-prev aria-label="Previous related characters">‹</button>
                <button type="button" class="related-character-nav" data-related-next aria-label="Next related characters">›</button>
            </div>
        </div>
    </section>`;
}

function renderLightbox(character) {
    const refs = Array.isArray(character.referenceBoard) ? character.referenceBoard : [];
    if (!refs.length) return "";
    return `<div class="reference-lightbox" id="reference-lightbox" hidden aria-hidden="true">
        <div class="reference-lightbox__backdrop" data-lightbox-close></div>
        <div class="reference-lightbox__dialog" role="dialog" aria-modal="true" aria-labelledby="reference-lightbox-title">
            <div class="reference-lightbox__toolbar">
                <span id="reference-lightbox-title">Visual</span>
                <span class="reference-lightbox__counter" id="reference-lightbox-counter"></span>
                <button type="button" class="reference-lightbox__close" data-lightbox-close aria-label="Close reference viewer">×</button>
            </div>
            <div class="reference-lightbox__media-wrap">
                <button type="button" class="reference-lightbox__nav" id="reference-lightbox-prev" aria-label="Previous reference">‹</button>
                <img class="reference-lightbox__media" id="reference-lightbox-image" src="" alt="">
                <button type="button" class="reference-lightbox__nav" id="reference-lightbox-next" aria-label="Next reference">›</button>
            </div>
        </div>
    </div>`;
}

function bindReferenceViewer(character) {
    const refs = Array.isArray(character.referenceBoard) ? character.referenceBoard : [];
    const lightbox = document.querySelector("#reference-lightbox");
    if (!lightbox || !refs.length) return;
    const image = lightbox.querySelector("#reference-lightbox-image");
    const counter = lightbox.querySelector("#reference-lightbox-counter");
    const prev = lightbox.querySelector("#reference-lightbox-prev");
    const next = lightbox.querySelector("#reference-lightbox-next");
    let currentIndex = 0;

    const show = index => {
        currentIndex = (index + refs.length) % refs.length;
        const ref = refs[currentIndex];
        image.src = ref.src;
        image.alt = ref.alt || "Character reference";
        counter.textContent = `${currentIndex + 1} / ${refs.length}`;
        prev.disabled = refs.length < 2;
        next.disabled = refs.length < 2;
    };

    const open = index => {
        show(index);
        lightbox.hidden = false;
        lightbox.setAttribute("aria-hidden", "false");
        document.body.classList.add("reference-viewer-open");
    };

    const close = () => {
        lightbox.hidden = true;
        lightbox.setAttribute("aria-hidden", "true");
        document.body.classList.remove("reference-viewer-open");
    };

    detailContainer.querySelectorAll("[data-reference-index]").forEach(button => {
        button.addEventListener("click", () => open(Number(button.dataset.referenceIndex)));
    });
    lightbox.querySelectorAll("[data-lightbox-close]").forEach(element => element.addEventListener("click", close));
    prev.addEventListener("click", () => show(currentIndex - 1));
    next.addEventListener("click", () => show(currentIndex + 1));
    document.addEventListener("keydown", event => {
        if (lightbox.hidden) return;
        if (event.key === "Escape") close();
        if (event.key === "ArrowLeft") show(currentIndex - 1);
        if (event.key === "ArrowRight") show(currentIndex + 1);
    });
}

function bindSpoilers() {
    detailContainer.querySelectorAll("[data-spoiler-toggle]").forEach(button => {
        button.addEventListener("click", () => {
            const wrapper = button.closest("[data-spoiler]");
            if (!wrapper) return;
            const revealed = wrapper.classList.toggle("is-revealed");
            button.setAttribute("aria-expanded", String(revealed));
            button.textContent = revealed ? "Hide Spoiler ▲" : "Reveal Spoiler ▼";
        });
    });
}

function bindReferenceBoardLayout() {
    const board = detailContainer.querySelector("[data-reference-board]");
    if (!board) return;
    const images = [...board.querySelectorAll("img")];
    if (!images.length) return;
    const apply = () => {
        const first = images[0];
        if (!first.naturalWidth || !first.naturalHeight) return;
        const ratios = images.map(img => img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 1);
        const firstRatio = ratios[0];
        const count = images.length;
        const wide = firstRatio >= 1.55;
        const portrait = firstRatio <= 0.88;
        const squareSet = count === 4 && ratios.every(r => r >= 0.9 && r <= 1.1);
        board.classList.remove("reference-board--side", "reference-board--wide", "reference-board--square-set");
        if (squareSet) board.classList.add("reference-board--square-set");
        else if (wide) board.classList.add("reference-board--wide");
        else board.classList.add("reference-board--side");
        board.style.setProperty("--reference-main-ratio", String(Math.max(0.88, Math.min(1.78, firstRatio))));
        board.style.setProperty("--reference-image-count", String(count));
        board.dataset.firstOrientation = portrait ? "portrait" : wide ? "wide-landscape" : "landscape-square";
    };
    images.forEach(img => {
        if (img.complete) return;
        img.addEventListener("load", apply, { once: true });
    });
    apply();
}

function bindRelatedCarousel() {
    const carousel = detailContainer.querySelector("[data-related-carousel]");
    if (!carousel) return;
    const track = carousel.querySelector(".related-character-track");
    const cards = [...carousel.querySelectorAll("[data-related-card]")];
    const controls = carousel.querySelector("[data-related-controls]");
    const prev = carousel.querySelector("[data-related-prev]");
    const next = carousel.querySelector("[data-related-next]");
    if (!track || !cards.length || !controls || !prev || !next) return;

    let capacity = 4;
    let page = 0;

    const getCapacity = () => window.matchMedia("(max-width: 600px)").matches ? 2 : window.matchMedia("(max-width: 900px)").matches ? 3 : 4;
    const refresh = (reset = false) => {
        const nextCapacity = getCapacity();
        if (reset || nextCapacity !== capacity) page = 0;
        capacity = nextCapacity;
        const totalPages = Math.max(1, Math.ceil(cards.length / capacity));
        page = Math.min(page, totalPages - 1);
        const active = cards.length > capacity;
        controls.hidden = !active;
        track.style.setProperty("--related-columns", String(capacity));
        track.style.transform = `translateX(-${page * 100}%)`;
        prev.disabled = !active || page === 0;
        next.disabled = !active || page >= totalPages - 1;
    };

    prev.addEventListener("click", () => { page -= 1; refresh(); });
    next.addEventListener("click", () => { page += 1; refresh(); });
    window.addEventListener("resize", () => refresh());
    refresh(true);
}

function renderPage(character) {
    const primaryName = getCommonName(character);
    document.title = primaryName;
    detailContainer.innerHTML = `
        <nav class="character-breadcrumb" aria-label="Breadcrumb"><a href="../index.html">Home</a><span aria-hidden="true">›</span><a href="./index.html">Characters</a><span aria-hidden="true">›</span><span aria-current="page">${escapeHtml(primaryName)}</span></nav>
        ${renderHero(character)}
        ${renderAbout(character)}
        ${renderReferenceBoard(character)}
        ${renderCharacterInformation(character)}
        ${renderAppearances(character)}
        ${renderRelatedCharacters(character)}
        ${renderLightbox(character)}
    `;
    bindReferenceViewer(character);
    bindReferenceBoardLayout();
    bindSpoilers();
    bindRelatedCarousel();
}

function renderNotFound() {
    document.title = "Character Not Found";
    detailContainer.innerHTML = `<section class="character-not-found"><h1>Character Not Found</h1><p>The character you're looking for doesn't exist.</p><a href="./index.html">Back to Characters</a></section>`;
}

if (character) renderPage(character);
else renderNotFound();

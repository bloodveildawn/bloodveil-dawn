// ========================================
// CHARACTER LOOKUP
// ========================================

export function getCharacterIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

export function getCharacterById(characters, id) {
    if (!Array.isArray(characters) || !id) return null;
    return characters.find(character => character.id === id) || null;
}


// ========================================
// NAME HELPERS
// ========================================

export function getCommonName(character) {
    const name = character?.name;
    if (typeof name === "string") return name;
    if (!name || typeof name !== "object") return "";
    return name.common || "";
}

export function getAdditionalFamilyName(character) {
    const name = character?.name;
    if (!name || typeof name !== "object") return "";
    return name.additionalFamilyName || "";
}

export function getFullName(character) {
    const name = character?.name;
    if (!name || typeof name !== "object") return "";
    return name.fullName || "";
}

export function getOtherNames(character) {
    const name = character?.name;
    if (!name || typeof name !== "object") return [];
    return Array.isArray(name.otherNames) ? name.otherNames : [];
}

export function getSearchableNames(character) {
    return [
        getCommonName(character),
        getAdditionalFamilyName(character),
        getFullName(character),
        ...getOtherNames(character)
    ].filter(value => typeof value === "string" && value.trim());
}


// ========================================
// CALENDARS
// ========================================

export const BLOODVEIL_MONTHS = {
    1: "Haveryne",
    2: "Rousvaille",
    3: "Eriethra",
    4: "Gallene",
    5: "Thelvere",
    6: "Avellisk",
    7: "Clouvera",
    8: "Nyrosyss",
    9: "Lycorra",
    10: "Demerysch",
    11: "Belmora",
    12: "Seravelle",
    13: "Zovraine",
    14: "Yisennouve",
    15: "Mythrena"
};

export const GREGORIAN_MONTHS = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December"
};


// ========================================
// FLEXIBLE TIMELINE VALUES
// ========================================

export function normalizeTimelineValue(value) {
    if (value === null || value === undefined || value === "") return [];

    if (Array.isArray(value)) {
        return value.filter(entry =>
            entry !== null &&
            entry !== undefined &&
            (
                typeof entry !== "object" ||
                entry.value !== undefined
            )
        ).map(entry =>
            typeof entry === "object" ? entry : { value: entry }
        );
    }

    if (typeof value === "object") {
        return value.value === undefined ? [] : [value];
    }

    return [{ value }];
}

export function getLatestTimelineEntry(value) {
    const entries = normalizeTimelineValue(value);
    if (!entries.length) return null;

    const dated = entries.filter(entry => Number.isInteger(entry.year));

    if (dated.length) {
        return dated.reduce((latest, entry) =>
            entry.year > latest.year ? entry : latest
        );
    }

    return entries[entries.length - 1];
}

export function getLatestTimelineValue(value) {
    const entry = getLatestTimelineEntry(value);
    return entry ? entry.value : null;
}

export function formatTimelineValue(entry) {
    if (entry === null || entry === undefined) return "";

    const normalized = typeof entry === "object"
        ? entry
        : { value: entry };

    const value = normalized.value ?? "";
    return Number.isInteger(normalized.year)
        ? `${value} (Year ${normalized.year})`
        : String(value);
}

export function formatFlexibleValue(value, options = {}) {
    const { latestOnly = true, separator = ", " } = options;
    const entries = normalizeTimelineValue(value);

    if (!entries.length) return "";

    if (latestOnly) {
        return formatTimelineValue(getLatestTimelineEntry(entries));
    }

    return entries.map(formatTimelineValue).filter(Boolean).join(separator);
}


// ========================================
// BIRTHDATE
// ========================================

export function getBloodveilBirthdate(character) {
    const birthdate = character?.profile?.origin?.birthdate;

    if (Array.isArray(birthdate)) {
        return birthdate.find(entry => entry?.calendar === "bloodveil") || null;
    }

    if (birthdate && typeof birthdate === "object") {
        return {
            calendar: "bloodveil",
            day: birthdate.day,
            month: birthdate.month,
            year: birthdate.year,
            birthOrder: birthdate.birthOrder
        };
    }

    return null;
}

export function formatBirthdateEntry(entry) {
    if (!entry || !entry.calendar) return null;

    if (entry.calendar === "bloodveil") {
        const month = BLOODVEIL_MONTHS[entry.month] || `Month ${entry.month}`;
        const year = Number.isInteger(entry.year) ? ` ${entry.year}` : "";
        return {
            value: `${entry.day} ${month}${year}`,
            calendar: "Bloodveil Dawn Calendar"
        };
    }

    if (entry.calendar === "gregorian") {
        const month = GREGORIAN_MONTHS[entry.month] || `Month ${entry.month}`;
        const year = Number.isInteger(entry.year) ? ` ${entry.year}` : "";
        return {
            value: `${entry.day} ${month}${year}`,
            calendar: "Gregorian Calendar"
        };
    }

    return {
        value: entry.label || "",
        calendar: entry.calendar
    };
}

export function formatBirthdate(birthdate) {
    if (!birthdate) return [];

    const entries = Array.isArray(birthdate)
        ? birthdate
        : [birthdate];

    return entries.map(formatBirthdateEntry).filter(Boolean);
}


// ========================================
// SORTING
// ========================================

export function compareBirthdate(a, b) {
    const birthA = getBloodveilBirthdate(a);
    const birthB = getBloodveilBirthdate(b);

    if (!birthA || !birthB) return 0;

    return (
        (birthA.year ?? 0) - (birthB.year ?? 0) ||
        (birthA.month ?? 0) - (birthB.month ?? 0) ||
        (birthA.day ?? 0) - (birthB.day ?? 0) ||
        (birthA.birthOrder ?? 0) - (birthB.birthOrder ?? 0)
    );
}


// ========================================
// GENERIC HELPERS
// ========================================

export function formatList(value) {
    if (value === null || value === undefined) return null;
    if (Array.isArray(value)) {
        const items = value.filter(Boolean);
        return items.length ? items.join(", ") : null;
    }
    return String(value).trim() || null;
}

export function hasDisplayValue(value) {
    if (value === null || value === undefined) return false;
    if (Array.isArray(value)) return value.length > 0;
    return String(value).trim().length > 0;
}

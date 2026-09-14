export const normalizeSearchText = (value: string): string =>
  value
    .normalize("NFKD")

    // Remove combining diacritical marks created by Unicode normalization.
    // Example: "é" becomes "e", "ö" becomes "o".
    .replace(/\p{Diacritic}/gu, "")

    .toLowerCase()

    // Replace all Unicode dash and hyphen characters with a normal space.
    // This makes "Uruk-hai", "Uruk–hai" and "Uruk—hai" searchable as "uruk hai".
    .replace(/\p{Pd}/gu, " ")

    // Collapse multiple consecutive whitespace characters into a single space.
    // Example: "witch   king" becomes "witch king".
    .replace(/\s+/g, " ")

    .trim();

/** Normalizes user-entered tags while retaining the first casing for each value. */
export function normalizeRosterTags(values: string[]): string[] {
  const seen = new Set<string>();

  return values
    .map((value) => value.trim())
    .filter(Boolean)
    .filter((value) => {
      const normalized = value.toLocaleLowerCase();

      if (seen.has(normalized)) {
        return false;
      }

      seen.add(normalized);
      return true;
    });
}

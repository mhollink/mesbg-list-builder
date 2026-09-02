export function splitList(value: string): string[] {
  if (!value.trim()) {
    return [];
  }

  return value
    .split(";")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

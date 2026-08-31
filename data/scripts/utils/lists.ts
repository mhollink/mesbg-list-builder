export function splitList(value?: string): string[] {
  if (!value?.trim()) {
    return [];
  }

  return value
    .split(";")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function optionalArray<K extends PropertyKey, T>(
  key: K,
  values: T[] | undefined,
): Partial<Record<K, T[]>> {
  return values?.length ? ({ [key]: values } as Record<K, T[]>) : {};
}

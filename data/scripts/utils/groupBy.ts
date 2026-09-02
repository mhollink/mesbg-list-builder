export function groupBy<T>(
  rows: T[],
  keyGetter: (row: T) => string,
): Map<string, T[]> {
  const result = new Map<string, T[]>();
  for (const row of rows) {
    const key = keyGetter(row);
    const existing = result.get(key);

    if (existing) {
      existing.push(row);
    } else {
      result.set(key, [row]);
    }
  }
  return result;
}

export function byOrder(a: { order: number }, b: { order: number }): number {
  return a.order - b.order;
}

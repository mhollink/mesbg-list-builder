import type { Supporter } from "../types/supporter.types.ts";

type RotationInterval = "daily" | "weekly";

export function getSupporterRotationKey(
  date: Date = new Date(),
  interval: RotationInterval = "weekly",
): string {
  const utcDate = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );

  if (interval === "weekly") {
    const daysSinceMonday = (utcDate.getUTCDay() + 6) % 7;

    utcDate.setUTCDate(utcDate.getUTCDate() - daysSinceMonday);
  }

  return utcDate.toISOString().slice(0, 10);
}

function hash(value: string): number {
  let result = 2166136261;

  for (let i = 0; i < value.length; i++) {
    result ^= value.charCodeAt(i);
    result = Math.imul(result, 16777619);
  }

  return result >>> 0;
}

export function sortSupporters(
  supporters: readonly Supporter[],
  rotationKey: string = getSupporterRotationKey(),
): Supporter[] {
  return [...supporters].sort(
    (a, b) =>
      hash(`${rotationKey}:${a.id}`) - hash(`${rotationKey}:${b.id}`) ||
      a.id.localeCompare(b.id),
  );
}

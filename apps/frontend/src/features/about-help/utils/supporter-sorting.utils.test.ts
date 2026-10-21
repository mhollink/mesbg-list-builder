import { describe, expect, it } from "vitest";

import type { Supporter } from "../types/supporter.types.ts";
import {
  getSupporterRotationKey,
  sortSupporters,
} from "./supporter-sorting.utils.ts";

const supporters: Supporter[] = [
  { id: "aragorn", name: "Aragorn", tier: "Hero of Legend" },
  { id: "boromir", name: "Boromir" },
  { id: "eowyn", name: "Éowyn", tier: "Minor Hero" },
  { id: "faramir", name: "Faramir" },
  { id: "gandalf", name: "Gandalf" },
  { id: "gimli", name: "Gimli" },
  { id: "legolas", name: "Legolas" },
  { id: "pippin", name: "Pippin" },
  { id: "samwise", name: "Samwise" },
  { id: "theoden", name: "Théoden" },
];

const ids = (items: readonly Supporter[]) => items.map(({ id }) => id);

describe("getSupporterRotationKey", () => {
  it("defaults to a weekly rotation starting on Monday (UTC)", () => {
    expect(getSupporterRotationKey(new Date("2026-10-21T12:00:00Z"))).toBe(
      "2026-10-19",
    );
  });

  it("keeps the same weekly key from Monday through Sunday", () => {
    expect(getSupporterRotationKey(new Date("2026-10-19T00:00:00Z"))).toBe(
      "2026-10-19",
    );
    expect(getSupporterRotationKey(new Date("2026-10-25T23:59:59Z"))).toBe(
      "2026-10-19",
    );
  });

  it("switches the weekly key at Monday midnight UTC", () => {
    expect(getSupporterRotationKey(new Date("2026-10-26T00:00:00Z"))).toBe(
      "2026-10-26",
    );
  });

  it("handles a week spanning two calendar years", () => {
    expect(getSupporterRotationKey(new Date("2027-01-01T12:00:00Z"))).toBe(
      "2026-12-28",
    );
  });

  it("uses UTC dates, not the date encoded by the local timezone offset", () => {
    expect(
      getSupporterRotationKey(new Date("2026-10-21T23:30:00-02:00"), "daily"),
    ).toBe("2026-10-22");
  });

  it("changes the daily key at midnight UTC", () => {
    expect(
      getSupporterRotationKey(new Date("2026-10-21T23:59:59Z"), "daily"),
    ).toBe("2026-10-21");
    expect(
      getSupporterRotationKey(new Date("2026-10-22T00:00:00Z"), "daily"),
    ).toBe("2026-10-22");
  });
});

describe("sortSupporters", () => {
  const rotationKey = "2026-10-21";

  it("produces a deterministic order independent of the input order", () => {
    const sorted = ids(sortSupporters(supporters, rotationKey));

    expect(ids(sortSupporters(supporters, rotationKey))).toEqual(sorted);
    expect(ids(sortSupporters([...supporters].reverse(), rotationKey))).toEqual(
      sorted,
    );
  });

  it("does not mutate the source array", () => {
    const original = [...supporters];
    const result = sortSupporters(supporters, rotationKey);

    expect(supporters).toEqual(original);
    expect(result).not.toBe(supporters);
    expect(result).toHaveLength(supporters.length);
  });

  it("does not use names or Patreon tiers to determine placement", () => {
    const altered = supporters.map((supporter) => ({
      ...supporter,
      name: `Renamed ${supporter.id}`,
      tier: undefined,
    }));

    expect(ids(sortSupporters(altered, rotationKey))).toEqual(
      ids(sortSupporters(supporters, rotationKey)),
    );
  });

  it("rotates the ordering when the rotation key changes", () => {
    expect(ids(sortSupporters(supporters, "2026-10-22"))).not.toEqual(
      ids(sortSupporters(supporters, "2026-10-21")),
    );
  });

  it("handles empty and single-member lists", () => {
    expect(sortSupporters([], rotationKey)).toEqual([]);
    const supporter: Supporter = { id: "bilbo", name: "Bilbo" };
    expect(sortSupporters([supporter], rotationKey)).toEqual([supporter]);
  });
});

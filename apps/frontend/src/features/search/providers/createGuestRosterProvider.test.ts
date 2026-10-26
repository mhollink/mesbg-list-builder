import { describe, expect, it } from "vitest";

import { createGuestRosterProvider } from "./createGuestRosterProvider.ts";
import type { GuestRoster } from "~/features/armies/rosters/guest/guest-roster.types.ts";

const request = { query: "rohan", normalizedQuery: "rohan", limit: 5 };
const names = new Map([["rohan", "Rohan"]]);

describe("createGuestRosterProvider", () => {
  it("returns no results when no guest roster exists", () => {
    const provider = createGuestRosterProvider(() => null, names);
    expect(provider.search(request)).toEqual({ results: [], total: 0 });
  });

  it("searches the army-list name even without roster tags", () => {
    const roster = {
      id: "guest",
      name: "My Riders",
      armyListId: "rohan",
    } as GuestRoster;
    const provider = createGuestRosterProvider(() => roster, names);
    const response = provider.search(request);
    expect(response).toMatchObject({
      total: 1,
      results: [
        { key: "rosters:guest", target: { path: "/armies/rosters/guest" } },
      ],
    });
  });
});

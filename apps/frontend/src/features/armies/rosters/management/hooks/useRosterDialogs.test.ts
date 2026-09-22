import type { RosterGroup, RosterSummary } from "@mlb/api-client";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useRosterDialogs } from "./useRosterDialogs.ts";

describe("useRosterDialogs", () => {
  it("opens and closes create dialogs", () => {
    const { result } = renderHook(() => useRosterDialogs());

    act(() => result.current.createRoster.show());
    expect(result.current.createRoster.open).toBe(true);

    act(() => result.current.createRoster.close());
    expect(result.current.createRoster.open).toBe(false);

    act(() => result.current.createGroup.show());
    expect(result.current.createGroup.open).toBe(true);

    act(() => result.current.createGroup.close());
    expect(result.current.createGroup.open).toBe(false);
  });

  it("tracks the selected roster for delete and move dialogs", () => {
    const { result } = renderHook(() => useRosterDialogs());
    const value = roster();

    act(() => result.current.deleteRoster.open(value));
    expect(result.current.deleteRoster.roster).toBe(value);

    act(() => result.current.deleteRoster.close());
    expect(result.current.deleteRoster.roster).toBeNull();

    act(() => result.current.moveRoster.open(value));
    expect(result.current.moveRoster.roster).toBe(value);

    act(() => result.current.moveRoster.close());
    expect(result.current.moveRoster.roster).toBeNull();
  });

  it("tracks the selected group for rename and delete dialogs", () => {
    const { result } = renderHook(() => useRosterDialogs());
    const value = group();

    act(() => result.current.renameGroup.open(value));
    expect(result.current.renameGroup.group).toBe(value);

    act(() => result.current.renameGroup.close());
    expect(result.current.renameGroup.group).toBeNull();

    act(() => result.current.deleteGroup.open(value));
    expect(result.current.deleteGroup.group).toBe(value);

    act(() => result.current.deleteGroup.close());
    expect(result.current.deleteGroup.group).toBeNull();
  });
});

function roster(): RosterSummary {
  return { id: 42, name: "Mordor" } as RosterSummary;
}

function group(): RosterGroup {
  return { id: 12, name: "Events", children: [] } as RosterGroup;
}

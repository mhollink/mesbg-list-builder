import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useRosterDragAndDrop } from "./useRosterDragAndDrop.ts";

const mocks = vi.hoisted(() => ({
  moveRosterToGroup: vi.fn(),
  moveRosterToGroupUnwrap: vi.fn(),
  moveRosterToRoot: vi.fn(),
  moveGroup: vi.fn(),
  moveGroupUnwrap: vi.fn(),
  moveGroupToRoot: vi.fn(),
  moveGroupToRootUnwrap: vi.fn(),
}));

vi.mock("~/features/armies/rosters/api/roster-api.ts", () => ({
  useMoveRosterToGroupMutation: () => [mocks.moveRosterToGroup],
  useMoveRosterToRootMutation: () => [mocks.moveRosterToRoot],
}));

vi.mock("~/features/armies/rosters/api/roster-group-api.ts", () => ({
  useMoveRosterGroupMutation: () => [mocks.moveGroup],
  useMoveRosterGroupToRootMutation: () => [mocks.moveGroupToRoot],
}));

describe("useRosterDragAndDrop", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.moveRosterToGroup.mockReturnValue({
      unwrap: mocks.moveRosterToGroupUnwrap,
    });
    mocks.moveRosterToGroupUnwrap.mockResolvedValue(undefined);
    mocks.moveRosterToRoot.mockResolvedValue(undefined);

    mocks.moveGroup.mockReturnValue({ unwrap: mocks.moveGroupUnwrap });
    mocks.moveGroupUnwrap.mockResolvedValue(undefined);

    mocks.moveGroupToRoot.mockReturnValue({
      unwrap: mocks.moveGroupToRootUnwrap,
    });
    mocks.moveGroupToRootUnwrap.mockResolvedValue(undefined);
  });

  it("ignores canceled or incomplete drag operations", async () => {
    const { result } = renderHook(() => useRosterDragAndDrop());

    await act(async () => {
      await result.current.handleDragEnd(event(true));
      await result.current.handleDragEnd({
        canceled: false,
        operation: { source: null, target: null },
      } as never);
    });

    expect(mocks.moveRosterToGroup).not.toHaveBeenCalled();
    expect(mocks.moveGroup).not.toHaveBeenCalled();
  });

  it("moves a roster into a group", async () => {
    const { result } = renderHook(() => useRosterDragAndDrop());

    await act(async () => {
      await result.current.handleDragEnd(
        event(
          false,
          { type: "roster", rosterId: 42 },
          { type: "group", groupId: 12 },
        ),
      );
    });

    expect(mocks.moveRosterToGroup).toHaveBeenCalledWith({
      rosterId: 42,
      groupId: 12,
    });
    expect(mocks.moveRosterToGroupUnwrap).toHaveBeenCalledOnce();
  });

  it("moves a roster to root", async () => {
    const { result } = renderHook(() => useRosterDragAndDrop());

    await act(async () => {
      await result.current.handleDragEnd(
        event(false, { type: "roster", rosterId: 42 }, { type: "root" }),
      );
    });

    expect(mocks.moveRosterToRoot).toHaveBeenCalledWith(42);
  });

  it("moves groups between groups and to root", async () => {
    const { result } = renderHook(() => useRosterDragAndDrop());

    await act(async () => {
      await result.current.handleDragEnd(
        event(
          false,
          { type: "group", groupId: 20 },
          { type: "group", groupId: 30 },
        ),
      );
      await result.current.handleDragEnd(
        event(false, { type: "group", groupId: 20 }, { type: "root" }),
      );
    });

    expect(mocks.moveGroup).toHaveBeenCalledWith({
      groupId: 20,
      parentGroupId: 30,
    });
    expect(mocks.moveGroupToRoot).toHaveBeenCalledWith({ groupId: 20 });
  });

  it("does not move a group onto itself", async () => {
    const { result } = renderHook(() => useRosterDragAndDrop());

    await act(async () => {
      await result.current.handleDragEnd(
        event(
          false,
          { type: "group", groupId: 20 },
          { type: "group", groupId: 20 },
        ),
      );
    });

    expect(mocks.moveGroup).not.toHaveBeenCalled();
  });

  it("reports mutation errors and allows clearing them", async () => {
    mocks.moveGroupUnwrap.mockRejectedValue(new Error("move failed"));

    const { result } = renderHook(() => useRosterDragAndDrop());

    await act(async () => {
      await result.current.handleDragEnd(
        event(
          false,
          { type: "group", groupId: 20 },
          { type: "group", groupId: 30 },
        ),
      );
    });

    expect(result.current.isError).toBe(true);

    act(() => result.current.clearError());

    expect(result.current.isError).toBe(false);
  });
});

function event(
  canceled: boolean,
  sourceData?: Record<string, unknown>,
  targetData?: Record<string, unknown>,
) {
  return {
    canceled,
    operation: {
      source: sourceData ? { data: sourceData } : undefined,
      target: targetData ? { data: targetData } : undefined,
    },
  } as never;
}

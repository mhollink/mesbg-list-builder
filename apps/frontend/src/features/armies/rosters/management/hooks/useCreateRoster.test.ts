import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  GuestRosterAlreadyExistsError,
  useCreateRoster,
} from "./useCreateRoster.ts";

const mocks = vi.hoisted(() => ({
  dispatch: vi.fn(),
  selector: vi.fn(),
  createAccountRoster: vi.fn(),
  unwrap: vi.fn(),
  keycloak: {
    authenticated: false,
  },
}));

vi.mock("~/app/store/hooks.ts", () => ({
  useAppDispatch: () => mocks.dispatch,
  useAppSelector: () => mocks.selector(),
}));

vi.mock("~/features/account/auth/keycloak.ts", () => ({
  keycloak: mocks.keycloak,
}));

vi.mock("~/features/armies/rosters/api/roster-api.ts", () => ({
  useCreateRosterMutation: () => [
    mocks.createAccountRoster,
    {
      isLoading: false,
      isError: false,
    },
  ],
}));

describe("useCreateRoster", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.keycloak.authenticated = false;
    mocks.selector.mockReturnValue(null);
    mocks.unwrap.mockResolvedValue({ id: 42 });
    mocks.createAccountRoster.mockReturnValue({
      unwrap: mocks.unwrap,
    });
  });

  it("creates a guest roster when unauthenticated", async () => {
    const { result } = renderHook(() => useCreateRoster());

    await expect(
      result.current.createRoster({
        name: "Mordor",
        armyListId: "mordor",
        pointsLimit: 750,
        tags: ["Tournament"],
      }),
    ).resolves.toBe("/armies/rosters/guest");

    expect(mocks.dispatch).toHaveBeenCalledWith({
      type: "guestRoster/replaceGuestRoster",
      payload: expect.objectContaining({
        id: "guest",
        name: "Mordor",
        armyListId: "mordor",
        pointsLimit: 750,
        tags: ["Tournament"],
        warbands: [],
      }),
    });

    expect(mocks.createAccountRoster).not.toHaveBeenCalled();
  });

  it("rejects a second guest roster unless replacement was requested", async () => {
    mocks.selector.mockReturnValue({
      id: "guest",
      name: "Existing",
    });

    const { result } = renderHook(() => useCreateRoster());

    await expect(
      result.current.createRoster({
        name: "Replacement",
        armyListId: "mordor",
        tags: [],
      }),
    ).rejects.toBeInstanceOf(GuestRosterAlreadyExistsError);

    expect(mocks.dispatch).not.toHaveBeenCalled();
  });

  it("replaces the existing guest roster when explicitly requested", async () => {
    mocks.selector.mockReturnValue({
      id: "guest",
      name: "Existing",
    });

    const { result } = renderHook(() => useCreateRoster());

    await act(async () => {
      await result.current.createRoster(
        {
          name: "Replacement",
          armyListId: "mordor",
          tags: [],
        },
        {
          replaceGuestRoster: true,
        },
      );
    });

    expect(mocks.dispatch).toHaveBeenCalledWith({
      type: "guestRoster/replaceGuestRoster",
      payload: expect.objectContaining({
        name: "Replacement",
      }),
    });
  });

  it("creates a server roster when authenticated", async () => {
    mocks.keycloak.authenticated = true;

    const { result } = renderHook(() => useCreateRoster());

    await expect(
      result.current.createRoster({
        name: "Mordor",
        armyListId: "mordor",
        pointsLimit: 750,
        tags: ["Tournament"],
        groupId: 12,
      }),
    ).resolves.toBe("/armies/rosters/42");

    expect(mocks.createAccountRoster).toHaveBeenCalledWith({
      name: "Mordor",
      armyListId: "mordor",
      pointsLimit: 750,
      tags: ["Tournament"],
      groupId: 12,
    });

    expect(mocks.dispatch).not.toHaveBeenCalled();
  });
});

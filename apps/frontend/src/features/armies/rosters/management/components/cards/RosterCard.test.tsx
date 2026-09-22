import { MemoryRouter } from "react-router";

import type { RosterSummary } from "@mlb/api-client";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { RosterCard } from "./RosterCard.tsx";

const mocks = vi.hoisted(() => ({
  favorite: vi.fn(),
  lock: vi.fn(),
}));

vi.mock("@dnd-kit/react", () => ({
  useDraggable: () => ({
    ref: vi.fn(),
    handleRef: vi.fn(),
    isDragging: false,
  }),
}));

vi.mock("~/components/heraldry/HeraldryIcon.tsx", () => ({
  HeraldryIcon: () => <span data-testid="heraldry-icon" />,
}));

vi.mock(
  "~/features/armies/rosters/management/hooks/useRosterMetadata.ts",
  () => ({
    useRosterMetadata: () => ({
      onFavorite: mocks.favorite,
      onLock: mocks.lock,
      isFavoriteLoading: false,
      isLockLoading: false,
      isError: false,
    }),
  }),
);

describe("RosterCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders roster metadata and statistics", () => {
    renderCard();

    expect(screen.getByText("Tournament Mordor")).toBeInTheDocument();
    expect(screen.getByText("Mordor")).toBeInTheDocument();

    for (const label of [
      "Points",
      "Models",
      "Warbands",
      "Might",
      "Bows",
      "Thr. Weap",
    ]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }

    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/armies/rosters/42",
    );
  });

  it("shows favorite and locked status icons when active", () => {
    renderCard({
      favorite: true,
      locked: true,
    });

    expect(screen.getByLabelText("Favorite roster")).toBeInTheDocument();

    expect(screen.getByLabelText("Locked roster")).toBeInTheDocument();
  });

  it("uses the metadata actions from the menu", async () => {
    const user = userEvent.setup();

    renderCard();

    await user.click(
      screen.getByRole("button", {
        name: "Actions for Mordor",
      }),
    );

    await user.click(
      screen.getByRole("menuitem", {
        name: "Add to favorites",
      }),
    );

    expect(mocks.favorite).toHaveBeenCalledOnce();

    await user.click(
      screen.getByRole("button", {
        name: "Actions for Mordor",
      }),
    );

    await user.click(
      screen.getByRole("menuitem", {
        name: "Lock roster",
      }),
    );

    expect(mocks.lock).toHaveBeenCalledOnce();
  });

  it("moves and deletes an unlocked roster", async () => {
    const user = userEvent.setup();
    const onMove = vi.fn();
    const onDelete = vi.fn();
    const value = roster();

    renderCard({}, onMove, onDelete);

    await user.click(
      screen.getByRole("button", {
        name: "Actions for Mordor",
      }),
    );

    await user.click(
      screen.getByRole("menuitem", {
        name: "Move to group",
      }),
    );

    expect(onMove).toHaveBeenCalledWith(value);

    await user.click(
      screen.getByRole("button", {
        name: "Actions for Mordor",
      }),
    );

    await user.click(
      screen.getByRole("menuitem", {
        name: "Delete",
      }),
    );

    expect(onDelete).toHaveBeenCalledWith(value);
  });

  it("disables deletion for a locked roster", async () => {
    const user = userEvent.setup();

    renderCard({
      locked: true,
    });

    await user.click(
      screen.getByRole("button", {
        name: "Actions for Mordor",
      }),
    );

    expect(
      screen.getByRole("menuitem", {
        name: "Delete",
      }),
    ).toHaveAttribute("aria-disabled", "true");

    expect(
      screen.getByRole("menuitem", {
        name: "Unlock roster",
      }),
    ).toBeInTheDocument();
  });
});

function renderCard(
  overrides: Partial<RosterSummary> = {},
  onMove = vi.fn(),
  onDelete = vi.fn(),
) {
  const value = roster(overrides);

  return render(
    <MemoryRouter>
      <RosterCard
        roster={value}
        armyList="Tournament Mordor"
        onMove={onMove}
        onDelete={onDelete}
      />
    </MemoryRouter>,
  );
}

function roster(overrides: Partial<RosterSummary> = {}): RosterSummary {
  return {
    id: 42,
    name: "Mordor",
    armyListId: "mordor",
    favorite: false,
    locked: false,
    tags: [],
    points: 750,
    warbandCount: 3,
    modelCount: 32,
    might: 8,
    bowCount: 10,
    throwingWeaponCount: 4,
    createdAt: "2026-09-22T12:00:00Z",
    updatedAt: "2026-09-22T12:00:00Z",
    ...overrides,
  } as RosterSummary;
}

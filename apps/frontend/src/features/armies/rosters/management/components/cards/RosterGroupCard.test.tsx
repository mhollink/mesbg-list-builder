import { MemoryRouter } from "react-router";

import type { RosterGroup } from "@mlb/api-client";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { RosterGroupCard } from "./RosterGroupCard.tsx";

vi.mock("@dnd-kit/react", () => ({
  useDraggable: () => ({
    ref: vi.fn(),
    handleRef: vi.fn(),
    isDragging: false,
  }),
  useDroppable: () => ({
    ref: vi.fn(),
    isDropTarget: false,
  }),
}));

describe("RosterGroupCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders group counts and navigation", () => {
    renderCard(group(42, "Tournament", [group(43, "Nested")]), 2);

    expect(screen.getByText("Tournament")).toBeInTheDocument();
    expect(screen.getByText("2 rosters · 1 group")).toBeInTheDocument();

    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/armies/rosters/groups/42",
    );
  });

  it("renames an existing group", async () => {
    const user = userEvent.setup();
    const value = group(42, "Tournament");
    const onRename = vi.fn();

    renderCard(value, 0, onRename);

    await user.click(
      screen.getByRole("button", {
        name: "Actions for Tournament",
      }),
    );

    await user.click(
      screen.getByRole("menuitem", {
        name: "Rename",
      }),
    );

    expect(onRename).toHaveBeenCalledWith(value);
  });

  it("allows deleting an empty group", async () => {
    const user = userEvent.setup();
    const value = group(42, "Tournament");
    const onDelete = vi.fn();

    renderCard(value, 0, vi.fn(), onDelete);

    await user.click(
      screen.getByRole("button", {
        name: "Actions for Tournament",
      }),
    );

    await user.click(
      screen.getByRole("menuitem", {
        name: "Delete",
      }),
    );

    expect(onDelete).toHaveBeenCalledWith(value);
  });

  it("blocks deletion while the group contains rosters", async () => {
    const user = userEvent.setup();

    renderCard(group(42, "Tournament"), 2);

    await user.click(
      screen.getByRole("button", {
        name: "Actions for Tournament",
      }),
    );

    expect(
      screen.getByRole("menuitem", {
        name: /Delete/,
      }),
    ).toHaveAttribute("aria-disabled", "true");

    expect(
      screen.getByText("Move or delete the rosters in this group first."),
    ).toBeInTheDocument();
  });

  it("blocks deletion while the group contains nested groups", async () => {
    const user = userEvent.setup();

    renderCard(group(42, "Tournament", [group(43, "Nested")]), 0);

    await user.click(
      screen.getByRole("button", {
        name: "Actions for Tournament",
      }),
    );

    expect(
      screen.getByRole("menuitem", {
        name: /Delete/,
      }),
    ).toHaveAttribute("aria-disabled", "true");

    expect(
      screen.getByText("Move or delete the nested groups first."),
    ).toBeInTheDocument();
  });
});

function renderCard(
  value: RosterGroup,
  rosterCount: number,
  onRename = vi.fn(),
  onDelete = vi.fn(),
) {
  return render(
    <MemoryRouter>
      <RosterGroupCard
        group={value}
        rosterCount={rosterCount}
        onRename={onRename}
        onDelete={onDelete}
      />
    </MemoryRouter>,
  );
}

function group(
  id: number,
  name: string,
  children: RosterGroup[] = [],
): RosterGroup {
  return {
    id,
    name,
    children,
  } as RosterGroup;
}

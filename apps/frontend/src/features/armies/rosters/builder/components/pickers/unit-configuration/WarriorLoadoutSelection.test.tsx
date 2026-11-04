import { describe, expect, it, vi } from "vitest";

import { createWarriorDrafts } from "./unit-configuration.utils.ts";
import { WarriorLoadoutSelection } from "./WarriorLoadoutSelection.tsx";
import type { LocalizedArmyListProfile } from "~/features/reference/army-lists/army-lists.types.ts";
import { fireEvent, render, screen } from "~/test/render";

const profile = {
  id: "rivendell-warrior",
  profile: { points: 8, stats: { type: "warrior" } },
  options: [
    {
      id: "shield",
      name: "Shield",
      category: "equipment",
      state: "available",
      points: 1,
    },
    {
      id: "upgrade-to-kings-guard",
      name: "Upgrade to King's Guard",
      category: "special-upgrade",
      state: "available",
      points: 1,
    },
  ],
} as unknown as LocalizedArmyListProfile;

describe("WarriorLoadoutSelection", () => {
  it("displays separate regular and upgraded groups with zero-based controls", () => {
    const onChangeQuantity = vi.fn();
    render(
      <WarriorLoadoutSelection
        profile={profile}
        drafts={createWarriorDrafts(profile)}
        onChangeQuantity={onChangeQuantity}
      />,
    );
    expect(screen.getByText("Regular Warriors")).toBeInTheDocument();
    expect(screen.getByText("King's Guard")).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", {
        name: "Increase quantity for King's Guard, Shield",
      }),
    );
    expect(onChangeQuantity).toHaveBeenCalledWith(
      '["shield","upgrade-to-kings-guard"]',
      1,
    );
    expect(
      screen.getByRole("button", {
        name: "Decrease quantity for King's Guard, Shield",
      }),
    ).toBeDisabled();
  });

  it("omits the regular group heading when no upgrade is available", () => {
    const equipmentOnly = { ...profile, options: [profile.options[0]] };
    render(
      <WarriorLoadoutSelection
        profile={equipmentOnly}
        drafts={createWarriorDrafts(equipmentOnly)}
        onChangeQuantity={vi.fn()}
      />,
    );
    expect(screen.queryByText("Regular Warriors")).not.toBeInTheDocument();
    expect(screen.getByText("Shield")).toBeInTheDocument();
  });

  it("shows only a quantity row when there is no selectable option", () => {
    const standard = { ...profile, options: [] };
    render(
      <WarriorLoadoutSelection
        profile={standard}
        drafts={createWarriorDrafts(standard)}
        onChangeQuantity={vi.fn()}
      />,
    );
    expect(screen.getByText("Quantity")).toBeInTheDocument();
    expect(screen.queryByText("Regular Warriors")).not.toBeInTheDocument();
    expect(screen.queryByText("Standard equipment")).not.toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import type { LocalizedArmyListProfile } from "../../army-lists.types.ts";
import { ArmyListComposition } from "./ArmyListComposition.tsx";
import type { LocalizedProfile } from "~/features/reference/profiles/profiles.types.ts";

vi.mock("./ArmyListTier.tsx", () => ({
  ArmyListTier: ({
    profiles,
    onOpenProfile,
  }: {
    profiles: LocalizedArmyListProfile[];
    onOpenProfile: (profileId: string) => void;
  }) => (
    <button
      type="button"
      data-testid="army-list-tier"
      onClick={() => onOpenProfile(profiles[0].profileId)}
    >
      {profiles.map((profile) => profile.profile.name).join(", ")}
    </button>
  ),
}));

const profiles = [
  {
    id: "aragorn",
    profileId: "aragorn",
    tier: "hero-of-legend",
    tierName: "Heroes of Legend",
    profile: { name: "Aragorn" } as LocalizedProfile,
    options: [],
  },
  {
    id: "boromir",
    profileId: "boromir",
    tier: "hero-of-valour",
    tierName: "Heroes of Valour",
    profile: { name: "Boromir" } as LocalizedProfile,
    options: [],
  },
  {
    id: "warrior-of-minas-tirith",
    profileId: "warrior-of-minas-tirith",
    tier: "warrior",
    tierName: "Warriors",
    profile: { name: "Warrior of Minas Tirith" } as LocalizedProfile,
    options: [],
  },
] as LocalizedArmyListProfile[];

describe("ArmyListComposition", () => {
  test("renders a tier for each profile tier", () => {
    render(<ArmyListComposition profiles={profiles} onOpenProfile={vi.fn()} />);

    expect(screen.getAllByTestId("army-list-tier")).toHaveLength(3);
    expect(screen.getByText("Aragorn")).toBeInTheDocument();
    expect(screen.getByText("Boromir")).toBeInTheDocument();
    expect(screen.getByText("Warrior of Minas Tirith")).toBeInTheDocument();
  });

  test("forwards profile opening", async () => {
    const user = userEvent.setup();
    const onOpenProfile = vi.fn();

    render(
      <ArmyListComposition profiles={profiles} onOpenProfile={onOpenProfile} />,
    );

    await user.click(screen.getByRole("button", { name: "Aragorn" }));

    expect(onOpenProfile).toHaveBeenCalledWith("aragorn");
  });
});

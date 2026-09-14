import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import type { LocalizedArmyListProfile } from "../../army-lists.types.ts";
import { ArmyListProfile } from "./ArmyListProfile.tsx";

vi.mock("./ArmyListProfileOptions.tsx", () => ({
  ArmyListProfileOptions: ({
    options,
  }: {
    options: LocalizedArmyListProfile["options"];
  }) => (
    <div data-testid="profile-options">
      {options.map((option) => option.name).join(", ")}
    </div>
  ),
}));

const profile = {
  id: "aragorn",
  profileId: "aragorn",
  tier: "hero-of-legend",
  tierName: "Hero of Legend",
  profile: {
    profile: "aragorn",
    name: "Aragorn",
    points: 160,
  },
  options: [
    {
      id: "anduril",
      optionId: "anduril",
      state: "preselected",
      name: "Andúril",
      points: 5,
    },
    {
      id: "armour",
      optionId: "armour",
      state: "preselected",
      name: "Heavy armour",
      points: 10,
    },
    {
      id: "horse",
      optionId: "horse",
      state: "available",
      name: "Horse",
      points: 10,
    },
  ],
} as LocalizedArmyListProfile;

describe("ArmyListProfile", () => {
  test("renders the profile and calculated points", () => {
    render(<ArmyListProfile profile={profile} onOpenProfile={vi.fn()} />);

    expect(
      screen.getByRole("heading", { name: "Aragorn" }),
    ).toBeInTheDocument();

    expect(screen.getByText("175 pts")).toBeInTheDocument();
    expect(
      screen.getByText("with Andúril and Heavy armour"),
    ).toBeInTheDocument();
  });

  test("only passes available options to the options list", () => {
    render(<ArmyListProfile profile={profile} onOpenProfile={vi.fn()} />);

    const options = screen.getByTestId("profile-options");

    expect(options).toHaveTextContent("Horse");
    expect(options).not.toHaveTextContent("Andúril");
    expect(options).not.toHaveTextContent("Heavy armour");
  });

  test("opens the profile when its name is clicked", async () => {
    const user = userEvent.setup();
    const onOpenProfile = vi.fn();

    render(<ArmyListProfile profile={profile} onOpenProfile={onOpenProfile} />);

    await user.click(screen.getByRole("button", { name: "Aragorn" }));

    expect(onOpenProfile).toHaveBeenCalledOnce();
    expect(onOpenProfile).toHaveBeenCalledWith("aragorn");
  });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

import type { LocalizedArmyListProfile } from "../../army-lists.types.ts";
import { ArmyListTier } from "./ArmyListTier.tsx";
import type { LocalizedProfile } from "~/features/reference/profiles/profiles.types.ts";

vi.mock("./ArmyListProfile.tsx", () => ({
  ArmyListProfile: ({ profile }: { profile: LocalizedArmyListProfile }) => (
    <div data-testid="army-list-profile">{profile.profile.name}</div>
  ),
}));

const profiles = [
  {
    id: "aragorn",
    profileId: "aragorn",
    tier: "hero-of-legend",
    tierName: "Heroes of Legend",
    profile: {
      name: "Aragorn",
    } as LocalizedProfile,
    options: [],
  },
  {
    id: "elrond",
    profileId: "elrond",
    tier: "hero-of-legend",
    tierName: "Heroes of Legend",
    profile: {
      name: "Elrond",
    } as LocalizedProfile,
    options: [],
  },
] as LocalizedArmyListProfile[];

describe("ArmyListTier", () => {
  test("renders nothing without profiles", () => {
    const { container } = render(
      <ArmyListTier profiles={[]} onOpenProfile={vi.fn()} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  test("renders the tier and its profiles", () => {
    render(<ArmyListTier profiles={profiles} onOpenProfile={vi.fn()} />);

    expect(screen.getByText("Heroes of Legend")).toBeInTheDocument();
    expect(screen.getAllByTestId("army-list-profile")).toHaveLength(2);
    expect(screen.getByText("Aragorn")).toBeInTheDocument();
    expect(screen.getByText("Elrond")).toBeInTheDocument();
  });
});

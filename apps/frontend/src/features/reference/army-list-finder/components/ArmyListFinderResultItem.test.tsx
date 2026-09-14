import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import type { ArmyListMatch } from "../army-list-finder.types.ts";
import { ArmyListFinderResultItem } from "./ArmyListFinderResultItem.tsx";
import type { LocalizedProfile } from "~/features/reference/profiles/profiles.types.ts";

vi.mock("./ProfileFitChip.tsx", () => ({
  ProfileFitChip: ({
    profile,
    fits,
  }: {
    profile: LocalizedProfile;
    fits: boolean;
  }) => (
    <span data-testid={`profile-fit-${profile.profile}`} data-fits={fits}>
      {profile.name}
    </span>
  ),
}));

const aragorn = {
  profile: "aragorn",
  name: "Aragorn",
} as LocalizedProfile;

const gandalf = {
  profile: "gandalf-the-grey",
  name: "Gandalf the Grey",
} as LocalizedProfile;

const match = {
  armyList: {
    id: "the-fellowship",
    name: "The Fellowship",
  },
  matchedProfileIds: ["aragorn"],
  missingProfileIds: ["gandalf-the-grey"],
  matchCount: 1,
  exactMatch: false,
} as ArmyListMatch;

describe("ArmyListFinderResultItem", () => {
  test("renders the army list and selected profiles", () => {
    render(
      <ArmyListFinderResultItem
        match={match}
        selectedProfiles={[aragorn, gandalf]}
        onOpenArmyList={vi.fn()}
      />,
    );

    expect(screen.getByText("The Fellowship")).toBeInTheDocument();
    expect(screen.getByText("Aragorn")).toBeInTheDocument();
    expect(screen.getByText("Gandalf the Grey")).toBeInTheDocument();
  });

  test("marks profiles as fitting when they are matched", () => {
    render(
      <ArmyListFinderResultItem
        match={match}
        selectedProfiles={[aragorn, gandalf]}
        onOpenArmyList={vi.fn()}
      />,
    );

    expect(screen.getByTestId("profile-fit-aragorn")).toHaveAttribute(
      "data-fits",
      "true",
    );

    expect(screen.getByTestId("profile-fit-gandalf-the-grey")).toHaveAttribute(
      "data-fits",
      "false",
    );
  });

  test("opens the army list when clicked", async () => {
    const user = userEvent.setup();
    const onOpenArmyList = vi.fn();

    render(
      <ArmyListFinderResultItem
        match={match}
        selectedProfiles={[aragorn, gandalf]}
        onOpenArmyList={onOpenArmyList}
      />,
    );

    await user.click(screen.getByRole("button", { name: /the fellowship/i }));

    expect(onOpenArmyList).toHaveBeenCalledOnce();
    expect(onOpenArmyList).toHaveBeenCalledWith("the-fellowship");
  });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { ArmyListMatch } from "../army-list-finder.types.ts";
import { ArmyListFinderResults } from "./ArmyListFinderResults.tsx";
import type { LocalizedProfile } from "~/features/reference/profiles/profiles.types.ts";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("./ArmyListFinderResultItem.tsx", () => ({
  ArmyListFinderResultItem: ({ match }: { match: ArmyListMatch }) => (
    <div data-testid="army-list-result">{match.armyList.name}</div>
  ),
}));

const aragorn = {
  profile: "aragorn",
  name: "Aragorn",
} as LocalizedProfile;

const fellowshipMatch = {
  armyList: {
    id: "the-fellowship",
    name: "The Fellowship",
  },
  matchedProfileIds: ["aragorn"],
  missingProfileIds: [],
  matchCount: 1,
  exactMatch: true,
} as ArmyListMatch;

const minasTirithMatch = {
  armyList: {
    id: "minas-tirith",
    name: "Minas Tirith",
  },
  matchedProfileIds: ["aragorn"],
  missingProfileIds: [],
  matchCount: 1,
  exactMatch: true,
} as ArmyListMatch;

describe("ArmyListFinderResults", () => {
  it("renders the results heading", () => {
    render(
      <ArmyListFinderResults
        matches={[]}
        selectedProfiles={[]}
        onOpenArmyList={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "results.title" }),
    ).toBeInTheDocument();
  });

  it("shows the empty message when no profiles are selected", () => {
    render(
      <ArmyListFinderResults
        matches={[]}
        selectedProfiles={[]}
        onOpenArmyList={vi.fn()}
      />,
    );

    expect(screen.getByText("results.empty")).toBeInTheDocument();
    expect(screen.queryByText("results.noResults")).not.toBeInTheDocument();
  });

  it("shows the no results message when no army lists match", () => {
    render(
      <ArmyListFinderResults
        matches={[]}
        selectedProfiles={[aragorn]}
        onOpenArmyList={vi.fn()}
      />,
    );

    expect(screen.getByText("results.noResults")).toBeInTheDocument();
    expect(screen.queryByText("results.empty")).not.toBeInTheDocument();
  });

  it("renders each matching army list", () => {
    render(
      <ArmyListFinderResults
        matches={[fellowshipMatch, minasTirithMatch]}
        selectedProfiles={[aragorn]}
        onOpenArmyList={vi.fn()}
      />,
    );

    expect(screen.getAllByTestId("army-list-result")).toHaveLength(2);
    expect(screen.getByText("The Fellowship")).toBeInTheDocument();
    expect(screen.getByText("Minas Tirith")).toBeInTheDocument();
  });
});

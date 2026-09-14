import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

import type { LocalizedProfile, ProfileRow } from "../../profiles.types.ts";
import { ProfileList } from "./ProfileList.tsx";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("./ProfileListRow.tsx", () => ({
  ProfileListRow: ({ row }: { row: ProfileRow }) => (
    <div data-testid="profile-row">{row.key}</div>
  ),
}));

const rows: ProfileRow[] = [
  {
    key: "letter:A",
    type: "letter",
    letter: "A",
  },
  {
    key: "profile:aragorn",
    type: "profile",
    letter: "A",
    profile: {
      profile: "aragorn",
      name: "Aragorn",
    } as LocalizedProfile,
  },
];

describe("ProfileList", () => {
  test("renders the empty state when there are no rows", () => {
    render(
      <ProfileList
        rows={[]}
        onOpenProfile={vi.fn()}
        registerLetter={vi.fn()}
      />,
    );

    expect(screen.getByText("search.noResults")).toBeInTheDocument();
    expect(screen.getByText("search.noResultsHelper")).toBeInTheDocument();
  });

  test("renders each row", () => {
    render(
      <ProfileList
        rows={rows}
        onOpenProfile={vi.fn()}
        registerLetter={vi.fn()}
      />,
    );

    expect(screen.getAllByTestId("profile-row")).toHaveLength(2);
    expect(screen.getByText("letter:A")).toBeInTheDocument();
    expect(screen.getByText("profile:aragorn")).toBeInTheDocument();
    expect(screen.queryByText("search.noResults")).not.toBeInTheDocument();
  });
});

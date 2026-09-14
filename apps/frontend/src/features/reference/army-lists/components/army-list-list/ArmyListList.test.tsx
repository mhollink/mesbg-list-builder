import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { ArmyListRow, LocalizedArmyList } from "../../army-lists.types.ts";
import { ArmyListList } from "./ArmyListList.tsx";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("./ArmyListListRow.tsx", () => ({
  ArmyListListRow: ({ row }: { row: ArmyListRow }) => (
    <div data-testid="army-list-row">{row.key}</div>
  ),
}));

const rows: ArmyListRow[] = [
  {
    key: "letter:M",
    type: "letter",
    letter: "M",
  },
  {
    key: "army-list:minas-tirith",
    type: "army-list",
    letter: "M",
    armyList: {
      id: "minas-tirith",
      name: "Minas Tirith",
    } as LocalizedArmyList,
  },
];

describe("ArmyListList", () => {
  it("shows the empty state when there are no rows", () => {
    render(
      <ArmyListList
        rows={[]}
        onOpenArmyList={vi.fn()}
        registerLetter={vi.fn()}
      />,
    );

    expect(screen.getByText("search.noResults")).toBeInTheDocument();
    expect(screen.getByText("search.noResultsHelper")).toBeInTheDocument();
  });

  it("renders each row", () => {
    render(
      <ArmyListList
        rows={rows}
        onOpenArmyList={vi.fn()}
        registerLetter={vi.fn()}
      />,
    );

    expect(screen.getAllByTestId("army-list-row")).toHaveLength(2);

    expect(screen.getByText("letter:M")).toBeInTheDocument();
    expect(screen.getByText("army-list:minas-tirith")).toBeInTheDocument();
  });

  it("does not show the empty state when rows are present", () => {
    render(
      <ArmyListList
        rows={rows}
        onOpenArmyList={vi.fn()}
        registerLetter={vi.fn()}
      />,
    );

    expect(screen.queryByText("search.noResults")).not.toBeInTheDocument();
    expect(
      screen.queryByText("search.noResultsHelper"),
    ).not.toBeInTheDocument();
  });
});

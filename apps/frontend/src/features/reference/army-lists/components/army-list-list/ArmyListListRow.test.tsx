import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { ArmyListRow, LocalizedArmyList } from "../../army-lists.types.ts";
import { ArmyListListRow } from "./ArmyListListRow.tsx";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (
      key: string,
      options?: {
        profiles?: number;
        rules?: number;
      },
    ) => (options ? `${key}:${options.profiles}:${options.rules}` : key),
  }),
}));

const armyList = {
  id: "minas-tirith",
  name: "Minas Tirith",
  sourceName: "Armies of The Lord of the Rings",
  source: {
    book: "armies-of-the-lord-of-the-rings",
    page: 42,
  },
  profiles: [{}, {}, {}],
  specialRules: [{ id: "rule-1" }, { id: "rule-2" }],
  additionalRules: [{ id: "rule-3" }],
} as LocalizedArmyList;

describe("ArmyListListRow", () => {
  it("renders a letter row and registers it", () => {
    const refCallback = vi.fn();
    const registerLetter = vi.fn(() => refCallback);

    const row: ArmyListRow = {
      key: "letter:M",
      type: "letter",
      letter: "M",
    };

    render(
      <ArmyListListRow
        row={row}
        onOpenArmyList={vi.fn()}
        registerLetter={registerLetter}
      />,
    );

    expect(screen.getByText("M")).toBeInTheDocument();

    expect(registerLetter).toHaveBeenCalledOnce();
    expect(registerLetter).toHaveBeenCalledWith("M");

    expect(refCallback).toHaveBeenCalled();
  });

  it("renders an army list row", () => {
    const row: ArmyListRow = {
      key: "army-list:minas-tirith",
      type: "army-list",
      letter: "M",
      armyList,
    };

    render(
      <ArmyListListRow
        row={row}
        onOpenArmyList={vi.fn()}
        registerLetter={vi.fn()}
      />,
    );

    expect(screen.getByText("Minas Tirith")).toBeInTheDocument();

    expect(
      screen.getByText(/Armies of The Lord of the Rings/),
    ).toBeInTheDocument();

    expect(screen.getByText(/42/)).toBeInTheDocument();
  });

  it("renders the profile and rule counts", () => {
    const row: ArmyListRow = {
      key: "army-list:minas-tirith",
      type: "army-list",
      letter: "M",
      armyList,
    };

    render(
      <ArmyListListRow
        row={row}
        onOpenArmyList={vi.fn()}
        registerLetter={vi.fn()}
      />,
    );

    expect(screen.getByText("list.summary:3:3")).toBeInTheDocument();
  });

  it("opens the army list when clicked", async () => {
    const user = userEvent.setup();
    const onOpenArmyList = vi.fn();

    const row: ArmyListRow = {
      key: "army-list:minas-tirith",
      type: "army-list",
      letter: "M",
      armyList,
    };

    render(
      <ArmyListListRow
        row={row}
        onOpenArmyList={onOpenArmyList}
        registerLetter={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: /minas tirith/i }));

    expect(onOpenArmyList).toHaveBeenCalledOnce();
    expect(onOpenArmyList).toHaveBeenCalledWith(armyList);
  });
});

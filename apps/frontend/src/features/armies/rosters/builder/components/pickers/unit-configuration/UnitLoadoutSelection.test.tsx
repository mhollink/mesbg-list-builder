import { describe, expect, it, vi } from "vitest";

import { UnitLoadoutSelection } from "./UnitLoadoutSelection.tsx";
import type { LocalizedArmyListProfileOption } from "~/features/reference/army-lists/army-lists.types.ts";
import { fireEvent, render, screen } from "~/test/render";

const options = [
  {
    id: "upgrade",
    optionId: "upgrade",
    name: "King's Guard",
    state: "available",
    category: "special-upgrade",
    points: 1,
  },
  {
    id: "shield",
    optionId: "shield",
    name: "Shield",
    state: "available",
    category: "equipment",
    points: 1,
  },
  {
    id: "spear",
    optionId: "spear",
    name: "Spear",
    state: "available",
    category: "equipment",
    points: 1,
  },
] as LocalizedArmyListProfileOption[];

describe("UnitLoadoutSelection", () => {
  it("separates special upgrades, equipment and one quantity control", () => {
    const onToggleOption = vi.fn();
    const onChangeQuantity = vi.fn();
    render(
      <UnitLoadoutSelection
        options={options}
        selectedOptionIds={["spear"]}
        quantity={8}
        showQuantity
        onToggleOption={onToggleOption}
        onChangeQuantity={onChangeQuantity}
      />,
    );

    expect(screen.getByText("Special upgrades")).toBeInTheDocument();
    expect(screen.getByText("Equipment")).toBeInTheDocument();
    expect(screen.getByRole("switch", { name: "Spear" })).toBeChecked();
    fireEvent.click(screen.getByRole("switch", { name: "Shield" }));
    expect(onToggleOption).toHaveBeenCalledWith("shield", true);
    fireEvent.click(screen.getByRole("switch", { name: "King's Guard" }));
    expect(onToggleOption).toHaveBeenCalledWith("upgrade", true);
    expect(screen.getByText("8")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Increase quantity" }));
    expect(onChangeQuantity).toHaveBeenCalledWith(9);
  });

  it("hides the quantity control for heroes", () => {
    render(
      <UnitLoadoutSelection
        options={options}
        selectedOptionIds={[]}
        quantity={1}
        showQuantity={false}
        onToggleOption={vi.fn()}
        onChangeQuantity={vi.fn()}
      />,
    );
    expect(
      screen.queryByRole("button", { name: "Increase quantity" }),
    ).not.toBeInTheDocument();
  });
});

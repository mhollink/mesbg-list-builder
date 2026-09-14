import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import type { LocalizedArmyListProfileOption } from "../../army-lists.types.ts";
import { ArmyListProfileOptions } from "./ArmyListProfileOptions.tsx";

const options = [
  {
    id: "horse",
    optionId: "horse",
    state: "available",
    name: "Horse",
    points: 10,
  },
  {
    id: "remove-armour",
    optionId: "remove-armour",
    state: "available",
    name: "Remove armour",
    points: -5,
  },
  {
    id: "free-upgrade",
    optionId: "free-upgrade",
    state: "available",
    name: "Free upgrade",
    points: 0,
  },
] as LocalizedArmyListProfileOption[];

describe("ArmyListProfileOptions", () => {
  test("renders nothing without options", () => {
    const { container } = render(<ArmyListProfileOptions options={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  test("renders all available options", () => {
    render(<ArmyListProfileOptions options={options} />);

    expect(screen.getByText("Options")).toBeInTheDocument();
    expect(screen.getByText("Horse")).toBeInTheDocument();
    expect(screen.getByText("Remove armour")).toBeInTheDocument();
    expect(screen.getByText("Free upgrade")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  test("formats positive and negative point costs", () => {
    render(<ArmyListProfileOptions options={options} />);

    expect(screen.getByText("+10 pts")).toBeInTheDocument();
    expect(screen.getByText("-5 pts")).toBeInTheDocument();
    expect(screen.queryByText("0 pts")).not.toBeInTheDocument();
  });
});

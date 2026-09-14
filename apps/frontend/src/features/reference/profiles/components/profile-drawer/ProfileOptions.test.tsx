import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { ProfileOptions } from "./ProfileOptions.tsx";
import type { ProfileDrawerOption } from "./profile-drawer.types.ts";

const options: ProfileDrawerOption[] = [
  {
    id: "horse",
    name: "Horse",
    points: 10,
  },
  {
    id: "heavy-armour",
    name: "Heavy armour",
    points: 5,
  },
];

describe("ProfileOptions", () => {
  test("renders nothing without options", () => {
    const { container } = render(<ProfileOptions options={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  test("renders option names and points", () => {
    render(<ProfileOptions options={options} />);

    expect(screen.getByText("Options")).toBeInTheDocument();
    expect(screen.getByText("Horse")).toBeInTheDocument();
    expect(screen.getByText("+10 pts")).toBeInTheDocument();
    expect(screen.getByText("Heavy armour")).toBeInTheDocument();
    expect(screen.getByText("+5 pts")).toBeInTheDocument();
  });
});

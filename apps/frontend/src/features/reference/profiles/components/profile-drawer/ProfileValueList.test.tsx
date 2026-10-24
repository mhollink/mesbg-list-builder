import { describe, expect, test } from "vitest";

import { ProfileValueList } from "./ProfileValueList.tsx";
import { render, screen } from "~/test/render";

describe("ProfileValueList", () => {
  test("renders nothing without values", () => {
    const { container } = render(
      <ProfileValueList title="Wargear" values={[]} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  test("renders stacked values by default", () => {
    render(
      <ProfileValueList
        title="Additional Information"
        values={["First value", "Second value"]}
      />,
    );

    expect(screen.getByText("Additional Information")).toBeInTheDocument();
    expect(screen.getByText("First value")).toBeInTheDocument();
    expect(screen.getByText("Second value")).toBeInTheDocument();
  });

  test("formats inline values as a list", () => {
    render(
      <ProfileValueList
        title="Wargear"
        values={["Sword", "Shield", "Bow"]}
        display="inline"
      />,
    );

    expect(screen.getByText("Wargear")).toBeInTheDocument();
    expect(screen.getByText("Sword, Shield and Bow")).toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { ProfileSection } from "./ProfileSection.tsx";

describe("ProfileSection", () => {
  test("renders its title and children", () => {
    render(
      <ProfileSection title="Wargear">
        <span>Heavy armour</span>
      </ProfileSection>,
    );

    expect(screen.getByText("Wargear")).toBeInTheDocument();
    expect(screen.getByText("Heavy armour")).toBeInTheDocument();
  });
});

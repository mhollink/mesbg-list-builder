import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";

import type { LocalizedArmyList } from "../../army-lists.types.ts";
import { ArmyListPageHeader } from "./ArmyListPageHeader.tsx";

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  location: {
    state: null as { backTo?: string } | null,
  },
}));

vi.mock("react-router", () => ({
  useNavigate: () => mocks.navigate,
  useLocation: () => mocks.location,
}));

const armyList = {
  id: "minas-tirith",
  name: "Minas Tirith",
  sourceName: "Armies of The Lord of the Rings",
  source: {
    book: "armies-of-the-lord-of-the-rings",
    page: 42,
  },
} as LocalizedArmyList;

describe("ArmyListPageHeader", () => {
  beforeEach(() => {
    mocks.navigate.mockReset();
    mocks.location.state = null;
  });

  test("renders the army list information", () => {
    render(<ArmyListPageHeader armyList={armyList} />);

    expect(
      screen.getByRole("heading", { name: "Minas Tirith" }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Armies of The Lord of the Rings · page 42"),
    ).toBeInTheDocument();
  });

  test("navigates back to the army list overview by default", async () => {
    const user = userEvent.setup();

    render(<ArmyListPageHeader armyList={armyList} />);

    await user.click(screen.getByRole("button", { name: /army lists/i }));

    expect(mocks.navigate).toHaveBeenCalledWith("/reference/armylists");
  });

  test("navigates back to the provided location", async () => {
    const user = userEvent.setup();

    mocks.location.state = {
      backTo: "/reference/army-list-finder?profiles=aragorn",
    };

    render(<ArmyListPageHeader armyList={armyList} />);

    await user.click(screen.getByRole("button", { name: /army lists/i }));

    expect(mocks.navigate).toHaveBeenCalledWith(
      "/reference/army-list-finder?profiles=aragorn",
    );
  });

  test("starts a new roster for the army list", async () => {
    const user = userEvent.setup();

    render(<ArmyListPageHeader armyList={armyList} />);

    await user.click(screen.getByRole("button", { name: /create a roster/i }));

    expect(mocks.navigate).toHaveBeenCalledWith(
      "/armies/rosters/new?armyList=minas-tirith",
    );
  });
});

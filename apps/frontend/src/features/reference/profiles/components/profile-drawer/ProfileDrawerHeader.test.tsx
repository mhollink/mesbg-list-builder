import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import type { LocalizedProfile } from "../../profiles.types.ts";
import { ProfileDrawerHeader } from "./ProfileDrawerHeader.tsx";

const profile = {
  profile: "aragorn",
  name: "Aragorn",
  originName: "The Fellowship",
  points: 160,
  race: ["Man"],
  factions: ["Minas Tirith"],
  unitTypes: ["Hero"],
  baseSize: "25mm",
} as LocalizedProfile;

describe("ProfileDrawerHeader", () => {
  test("renders profile metadata", () => {
    render(
      <ProfileDrawerHeader
        profile={profile}
        canGoBack={false}
        onBack={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Aragorn" }),
    ).toBeInTheDocument();
    expect(screen.getByText("The Fellowship")).toBeInTheDocument();
    expect(screen.getByText("160 pts")).toBeInTheDocument();
    expect(screen.getByText("Man")).toBeInTheDocument();
    expect(screen.getByText("Hero")).toBeInTheDocument();
    expect(screen.getByText("25mm")).toBeInTheDocument();
  });

  test("shows the back action only when the drawer can go back", () => {
    const { rerender } = render(
      <ProfileDrawerHeader
        profile={profile}
        canGoBack={false}
        onBack={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    expect(
      screen.queryByRole("button", { name: "Back to previous item" }),
    ).not.toBeInTheDocument();

    rerender(
      <ProfileDrawerHeader
        profile={profile}
        canGoBack
        onBack={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Back to previous item" }),
    ).toBeInTheDocument();
  });

  test("forwards back and close actions", async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();
    const onClose = vi.fn();

    render(
      <ProfileDrawerHeader
        profile={profile}
        canGoBack
        onBack={onBack}
        onClose={onClose}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "Back to previous item" }),
    );
    await user.click(
      screen.getByRole("button", { name: "Close profile details" }),
    );

    expect(onBack).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledOnce();
  });
});

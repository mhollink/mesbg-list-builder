import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import type { LocalizedProfile, ProfileRow } from "../../profiles.types.ts";
import { ProfileListRow } from "./ProfileListRow.tsx";

const profile = {
  profile: "aragorn",
  name: "Aragorn",
  originName: "The Fellowship",
  points: 160,
} as LocalizedProfile;

describe("ProfileListRow", () => {
  test("renders and registers a letter row", () => {
    const refCallback = vi.fn();
    const registerLetter = vi.fn(() => refCallback);

    const row: ProfileRow = {
      key: "letter:A",
      type: "letter",
      letter: "A",
    };

    render(
      <ProfileListRow
        row={row}
        onOpenProfile={vi.fn()}
        registerLetter={registerLetter}
      />,
    );

    expect(screen.getByText("A")).toBeInTheDocument();
    expect(registerLetter).toHaveBeenCalledWith("A");
    expect(refCallback).toHaveBeenCalled();
  });

  test("renders profile information", () => {
    const row: ProfileRow = {
      key: "profile:aragorn",
      type: "profile",
      letter: "A",
      profile,
    };

    render(
      <ProfileListRow
        row={row}
        onOpenProfile={vi.fn()}
        registerLetter={vi.fn()}
      />,
    );

    expect(screen.getByText("Aragorn")).toBeInTheDocument();
    expect(screen.getByText("The Fellowship")).toBeInTheDocument();
    expect(screen.getByText("160 pts")).toBeInTheDocument();
  });

  test("opens the profile when clicked", async () => {
    const user = userEvent.setup();
    const onOpenProfile = vi.fn();

    const row: ProfileRow = {
      key: "profile:aragorn",
      type: "profile",
      letter: "A",
      profile,
    };

    render(
      <ProfileListRow
        row={row}
        onOpenProfile={onOpenProfile}
        registerLetter={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: /aragorn/i }));

    expect(onOpenProfile).toHaveBeenCalledOnce();
    expect(onOpenProfile).toHaveBeenCalledWith(profile);
  });

  test("omits points when the profile has no points value", () => {
    const row: ProfileRow = {
      key: "profile:equipment",
      type: "profile",
      letter: "E",
      profile: {
        ...profile,
        profile: "equipment",
        name: "Equipment",
        points: undefined,
      },
    };

    render(
      <ProfileListRow
        row={row}
        onOpenProfile={vi.fn()}
        registerLetter={vi.fn()}
      />,
    );

    expect(screen.queryByText(/pts$/)).not.toBeInTheDocument();
  });
});

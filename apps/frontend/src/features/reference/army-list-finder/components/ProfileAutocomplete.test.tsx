import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ProfileAutocomplete } from "./ProfileAutocomplete.tsx";
import type { LocalizedProfile } from "~/features/reference/profiles/profiles.types.ts";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const aragorn = {
  profile: "aragorn",
  name: "Aragorn",
  originName: "The Fellowship",
} as LocalizedProfile;

const gandalf = {
  profile: "gandalf-the-grey",
  name: "Gandalf the Grey",
  originName: "The Fellowship",
} as LocalizedProfile;

const eomer = {
  profile: "eomer",
  name: "Éomer",
  originName: "Rohan",
} as LocalizedProfile;

const profiles = [aragorn, gandalf, eomer];

describe("ProfileAutocomplete", () => {
  it("renders the profile search field", () => {
    render(
      <ProfileAutocomplete
        profiles={profiles}
        selectedProfileIds={[]}
        disabled={false}
        onSelect={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("combobox", { name: "profileSearch.label" }),
    ).toHaveAttribute("placeholder", "profileSearch.placeholder");
  });

  it("excludes already selected profiles", async () => {
    const user = userEvent.setup();

    render(
      <ProfileAutocomplete
        profiles={profiles}
        selectedProfileIds={["aragorn"]}
        disabled={false}
        onSelect={vi.fn()}
      />,
    );

    const input = screen.getByRole("combobox", {
      name: "profileSearch.label",
    });

    await user.click(input);

    expect(
      screen.queryByRole("option", { name: /aragorn/i }),
    ).not.toBeInTheDocument();

    expect(
      screen.getByRole("option", { name: /gandalf the grey/i }),
    ).toBeInTheDocument();

    expect(screen.getByRole("option", { name: /éomer/i })).toBeInTheDocument();
  });

  it("filters profiles by name", async () => {
    const user = userEvent.setup();

    render(
      <ProfileAutocomplete
        profiles={profiles}
        selectedProfileIds={[]}
        disabled={false}
        onSelect={vi.fn()}
      />,
    );

    const input = screen.getByRole("combobox", {
      name: "profileSearch.label",
    });

    await user.type(input, "gandalf");

    expect(
      screen.getByRole("option", { name: /gandalf the grey/i }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("option", { name: /aragorn/i }),
    ).not.toBeInTheDocument();
  });

  it("selects a profile", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <ProfileAutocomplete
        profiles={profiles}
        selectedProfileIds={[]}
        disabled={false}
        onSelect={onSelect}
      />,
    );

    const input = screen.getByRole("combobox", {
      name: "profileSearch.label",
    });

    await user.type(input, "gandalf");

    await user.click(screen.getByRole("option", { name: /gandalf the grey/i }));

    expect(onSelect).toHaveBeenCalledOnce();
    expect(onSelect).toHaveBeenCalledWith("gandalf-the-grey");
  });

  it("shows the profile origin in the options", async () => {
    const user = userEvent.setup();

    render(
      <ProfileAutocomplete
        profiles={profiles}
        selectedProfileIds={[]}
        disabled={false}
        onSelect={vi.fn()}
      />,
    );

    await user.type(
      screen.getByRole("combobox", { name: "profileSearch.label" }),
      "eomer",
    );

    expect(screen.getByRole("option", { name: /éomer/i })).toHaveTextContent(
      "Rohan",
    );
  });

  it("is disabled and shows a message when the profile limit is reached", () => {
    render(
      <ProfileAutocomplete
        profiles={profiles}
        selectedProfileIds={[]}
        disabled
        onSelect={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("combobox", { name: "profileSearch.label" }),
    ).toBeDisabled();

    expect(screen.getByText("profileSearch.limitReached")).toBeInTheDocument();
  });
});

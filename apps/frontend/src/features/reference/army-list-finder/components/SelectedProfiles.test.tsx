import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { SelectedProfiles } from "./SelectedProfiles.tsx";
import type { LocalizedProfile } from "~/features/reference/profiles/profiles.types.ts";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const aragorn = {
  profile: "aragorn",
  name: "Aragorn",
} as LocalizedProfile;

const gandalf = {
  profile: "gandalf-the-grey",
  name: "Gandalf the Grey",
} as LocalizedProfile;

describe("SelectedProfiles", () => {
  it("renders nothing when no profiles are selected", () => {
    const { container } = render(
      <SelectedProfiles
        profiles={[]}
        maximumProfiles={5}
        onRemove={vi.fn()}
        onClear={vi.fn()}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("renders the selected profiles and count", () => {
    render(
      <SelectedProfiles
        profiles={[aragorn, gandalf]}
        maximumProfiles={5}
        onRemove={vi.fn()}
        onClear={vi.fn()}
      />,
    );

    expect(
      screen.getByText("selectedProfiles.title (2/5)"),
    ).toBeInTheDocument();

    expect(screen.getByText("Aragorn")).toBeInTheDocument();
    expect(screen.getByText("Gandalf the Grey")).toBeInTheDocument();
  });

  it("clears all selected profiles", async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();

    render(
      <SelectedProfiles
        profiles={[aragorn]}
        maximumProfiles={5}
        onRemove={vi.fn()}
        onClear={onClear}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "selectedProfiles.clear" }),
    );

    expect(onClear).toHaveBeenCalledOnce();
  });

  it("removes a selected profile", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();

    render(
      <SelectedProfiles
        profiles={[aragorn, gandalf]}
        maximumProfiles={5}
        onRemove={onRemove}
        onClear={vi.fn()}
      />,
    );

    const deleteButtons = screen.getAllByTestId("CancelIcon");

    await user.click(deleteButtons[0]);

    expect(onRemove).toHaveBeenCalledOnce();
    expect(onRemove).toHaveBeenCalledWith("aragorn");
  });
});

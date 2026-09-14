import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import { ProfileRelatedProfiles } from "./ProfileRelatedProfiles.tsx";
import type { ProfileDrawerRelatedProfile } from "./profile-drawer.types.ts";

const profiles: ProfileDrawerRelatedProfile[] = [
  {
    id: "aragorn-mounted",
    name: "Aragorn (Mounted)",
  },
];

describe("ProfileRelatedProfiles", () => {
  test("renders nothing without related profiles", () => {
    const { container } = render(
      <ProfileRelatedProfiles profiles={[]} onOpenProfile={vi.fn()} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  test("renders and opens related profiles", async () => {
    const user = userEvent.setup();
    const onOpenProfile = vi.fn();

    render(
      <ProfileRelatedProfiles
        profiles={profiles}
        onOpenProfile={onOpenProfile}
      />,
    );

    expect(screen.getByText("Additional Profiles")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /aragorn \(mounted\)/i }),
    );

    expect(onOpenProfile).toHaveBeenCalledWith("aragorn-mounted");
  });
});

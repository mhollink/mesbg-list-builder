import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ProfileFitChip } from "./ProfileFitChip.tsx";
import type { LocalizedProfile } from "~/features/reference/profiles/profiles.types.ts";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: { profile?: string }) =>
      `${key}:${options?.profile}`,
  }),
}));

const profile = {
  profile: "aragorn",
  name: "Aragorn",
} as LocalizedProfile;

describe("ProfileFitChip", () => {
  it("renders an available profile", () => {
    render(<ProfileFitChip profile={profile} fits />);

    const chip = screen.getByLabelText("fit.available:Aragorn");

    expect(chip).toHaveTextContent("Aragorn");
    expect(chip).toHaveAttribute("title", "fit.available:Aragorn");
    expect(chip).toHaveClass("MuiChip-colorSuccess");

    expect(screen.getByTestId("CheckRoundedIcon")).toBeInTheDocument();
    expect(screen.queryByTestId("CloseRoundedIcon")).not.toBeInTheDocument();
  });

  it("renders an unavailable profile", () => {
    render(<ProfileFitChip profile={profile} fits={false} />);

    const chip = screen.getByLabelText("fit.unavailable:Aragorn");

    expect(chip).toHaveTextContent("Aragorn");
    expect(chip).toHaveAttribute("title", "fit.unavailable:Aragorn");
    expect(chip).toHaveClass("MuiChip-colorWarning");

    expect(screen.getByTestId("CloseRoundedIcon")).toBeInTheDocument();
    expect(screen.queryByTestId("CheckRoundedIcon")).not.toBeInTheDocument();
  });
});

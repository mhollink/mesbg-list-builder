import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import { ProfileRuleLinks } from "./ProfileRuleLinks.tsx";
import type { ProfileDrawerRuleLink } from "./profile-drawer.types.ts";

const rules: ProfileDrawerRuleLink[] = [
  {
    id: "terror",
    name: "Terror",
  },
  {
    id: "resistant-to-magic",
    name: "Resistant to Magic",
  },
];

describe("ProfileRuleLinks", () => {
  test("renders nothing without rules", () => {
    const { container } = render(
      <ProfileRuleLinks
        title="Special Rules"
        rules={[]}
        onOpenRule={vi.fn()}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  test("renders the section and opens a rule", async () => {
    const user = userEvent.setup();
    const onOpenRule = vi.fn();

    render(
      <ProfileRuleLinks
        title="Special Rules"
        rules={rules}
        onOpenRule={onOpenRule}
      />,
    );

    expect(screen.getByText("Special Rules")).toBeInTheDocument();
    expect(screen.getByText("Terror")).toBeInTheDocument();
    expect(screen.getByText("Resistant to Magic")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /terror/i }));

    expect(onOpenRule).toHaveBeenCalledWith("terror");
  });
});

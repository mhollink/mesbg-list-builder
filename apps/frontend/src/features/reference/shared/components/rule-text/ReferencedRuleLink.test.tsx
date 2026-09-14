import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import { ReferencedRuleLink } from "./ReferencedRuleLink.tsx";

describe("ReferencedRuleLink", () => {
  test("renders as a button and forwards clicks", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<ReferencedRuleLink onClick={onClick}>Spear</ReferencedRuleLink>);

    await user.click(screen.getByRole("button", { name: "Spear" }));

    expect(onClick).toHaveBeenCalledOnce();
  });
});

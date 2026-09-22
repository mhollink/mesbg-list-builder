import type { ComponentProps } from "react";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ReplaceGuestRosterDialog } from "./ReplaceGuestRosterDialog.tsx";

describe("ReplaceGuestRosterDialog", () => {
  it("explains which guest roster will be replaced", () => {
    renderDialog();

    expect(
      screen.getByRole("heading", {
        name: "Replace your guest roster?",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("Existing roster")).toBeInTheDocument();
    expect(screen.getByText("New roster")).toBeInTheDocument();
  });

  it("exposes cancel, open existing and replace actions", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    const onOpenExisting = vi.fn();
    const onReplace = vi.fn();

    renderDialog({
      onCancel,
      onOpenExisting,
      onReplace,
    });

    await user.click(
      screen.getByRole("button", {
        name: "Cancel",
      }),
    );

    await user.click(
      screen.getByRole("button", {
        name: "Open existing roster",
      }),
    );

    await user.click(
      screen.getByRole("button", {
        name: "Replace roster",
      }),
    );

    expect(onCancel).toHaveBeenCalledOnce();
    expect(onOpenExisting).toHaveBeenCalledOnce();
    expect(onReplace).toHaveBeenCalledOnce();
  });

  it("disables actions while loading", () => {
    renderDialog({
      isLoading: true,
    });

    expect(
      screen.getByRole("button", {
        name: "Cancel",
      }),
    ).toBeDisabled();

    expect(
      screen.getByRole("button", {
        name: "Open existing roster",
      }),
    ).toBeDisabled();

    expect(
      screen.getByRole("button", {
        name: "Replace roster",
      }),
    ).toBeDisabled();
  });
});

function renderDialog(
  overrides: Partial<ComponentProps<typeof ReplaceGuestRosterDialog>> = {},
) {
  const props: ComponentProps<typeof ReplaceGuestRosterDialog> = {
    open: true,
    existingRosterName: "Existing roster",
    newRosterName: "New roster",
    isLoading: false,
    onCancel: vi.fn(),
    onOpenExisting: vi.fn(),
    onReplace: vi.fn(),
    ...overrides,
  };

  return render(<ReplaceGuestRosterDialog {...props} />);
}

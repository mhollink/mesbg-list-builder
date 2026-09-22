import type { ReactNode } from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { RostersSpeedDial } from "./RostersSpeedDial.tsx";

vi.mock("@mui/material/SpeedDial", () => ({
  default: ({
    open,
    onOpen,
    onClose,
    children,
  }: {
    open: boolean;
    onOpen: () => void;
    onClose: (event: unknown, reason: string) => void;
    children: ReactNode;
  }) => (
    <div data-testid="speed-dial" data-open={String(open)}>
      <button type="button" onClick={onOpen}>
        open dial
      </button>
      <button type="button" onClick={(event) => onClose(event, "toggle")}>
        toggle close
      </button>
      <button
        type="button"
        onClick={(event) => onClose(event, "escapeKeyDown")}
      >
        escape close
      </button>
      {children}
    </div>
  ),
}));

vi.mock("@mui/material/SpeedDialAction", () => ({
  default: ({
    onClick,
    slotProps,
  }: {
    onClick: () => void;
    slotProps?: { tooltip?: { title?: string } };
  }) => (
    <button type="button" onClick={onClick}>
      {slotProps?.tooltip?.title}
    </button>
  ),
}));

vi.mock("@mui/material/SpeedDialIcon", () => ({
  default: () => <span />,
}));

describe("RostersSpeedDial", () => {
  it("does not close when the main toggle is clicked while open", () => {
    render(
      <RostersSpeedDial onCreateRoster={vi.fn()} onCreateGroup={vi.fn()} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "open dial" }));
    expect(screen.getByTestId("speed-dial")).toHaveAttribute(
      "data-open",
      "true",
    );

    fireEvent.click(screen.getByRole("button", { name: "toggle close" }));
    expect(screen.getByTestId("speed-dial")).toHaveAttribute(
      "data-open",
      "true",
    );

    fireEvent.click(screen.getByRole("button", { name: "escape close" }));
    expect(screen.getByTestId("speed-dial")).toHaveAttribute(
      "data-open",
      "false",
    );
  });

  it("invokes create actions and closes the dial", () => {
    const onCreateRoster = vi.fn();
    const onCreateGroup = vi.fn();

    render(
      <RostersSpeedDial
        onCreateRoster={onCreateRoster}
        onCreateGroup={onCreateGroup}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "open dial" }));
    fireEvent.click(screen.getByRole("button", { name: "Create roster" }));

    expect(onCreateRoster).toHaveBeenCalledOnce();
    expect(screen.getByTestId("speed-dial")).toHaveAttribute(
      "data-open",
      "false",
    );

    fireEvent.click(screen.getByRole("button", { name: "open dial" }));
    fireEvent.click(screen.getByRole("button", { name: "Create group" }));

    expect(onCreateGroup).toHaveBeenCalledOnce();
  });
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import { ProfileMagicPowers } from "./ProfileMagicPowers.tsx";
import type { ProfileDrawerMagicPower } from "./profile-drawer.types.ts";

const powers: ProfileDrawerMagicPower[] = [
  {
    id: "immobilise",
    name: "Immobilise",
    range: "12″",
    cast: "3+",
  },
];

describe("ProfileMagicPowers", () => {
  test("renders nothing without magical powers", () => {
    const { container } = render(
      <ProfileMagicPowers powers={[]} onOpenRule={vi.fn()} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  test("renders magical power details", () => {
    render(<ProfileMagicPowers powers={powers} onOpenRule={vi.fn()} />);

    expect(screen.getByText("Magical Powers")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Range")).toBeInTheDocument();
    expect(screen.getByText("Cast")).toBeInTheDocument();
    expect(screen.getByText("Immobilise")).toBeInTheDocument();
    expect(screen.getByText("12″")).toBeInTheDocument();
    expect(screen.getByText("3+")).toBeInTheDocument();
  });

  test("opens the selected magical power", async () => {
    const user = userEvent.setup();
    const onOpenRule = vi.fn();

    render(<ProfileMagicPowers powers={powers} onOpenRule={onOpenRule} />);

    await user.click(screen.getByRole("button", { name: /immobilise/i }));

    expect(onOpenRule).toHaveBeenCalledWith("immobilise");
  });
});
